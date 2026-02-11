import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/fiu-dashboard.css";

const fiuLogo = "https://www.final.edu.tr/success/fiulogo.jpg";

export default function AdminDashboard() {
  // --- AUTH & NAV ---
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // --- STATE ---
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [outlines, setOutlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, instructors: 0, admins: 0 });
  const [searchTerm, setSearchTerm] = useState("");

  // Logout Menüsü Kontrolü
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);

  // GÖRÜNÜM KONTROLÜ
  const [activeView, setActiveView] = useState('list');

  // CREATE USER FORM STATE
  const [newUser, setNewUser] = useState({
    username: '', password: '', email: '',
    first_name: '', last_name: '',
    role: 'instructor', department_id: ''
  });

  // --- PROFİL TIKLAMA İŞLEMLERİ ---
  
  // 1. Sağ üstteki profile basınca menüyü aç/kapat
  const handleProfileClick = (e) => {
    e.stopPropagation(); // Sayfa tıklamasını engelle ki hemen kapanmasın
    setShowLogoutMenu(!showLogoutMenu);
  };

  // 2. Menüdeki "Log Out" butonuna basınca kesin çıkış yap (HARD LOGOUT GÜNCELLENDİ)
  const handleHardLogout = () => {
    // 1. Tarayıcı önbelleğini ve depolamayı temizle
    localStorage.clear();
    sessionStorage.clear();

    // 2. Context logout işlemini yap
    if (logout) logout();

    // 3. Login sayfasına at ve geçmişi sil
    navigate("/login", { replace: true });
    
    // 4. State'in tamamen temizlenmesi için sayfayı zorla yenile (Opsiyonel ama önerilir)
    // window.location.reload(); 
  };

  // --- VERİ ÇEKME FONKSİYONU ---
  const fetchData = async () => {
    try {
      setLoading(true);
      const userRes = await api.get("/api/admin/users/");
      setUsers(userRes.data);

      const deptRes = await api.get("/api/departments/");
      setDepartments(deptRes.data);

      const outlinesRes = await api.get("/api/outlines/");
      setOutlines(outlinesRes.data);

      setStats({
        total: userRes.data.length,
        instructors: userRes.data.filter(u => u.profile?.role === 'instructor' || u.profile?.role === 'dean').length,
        admins: userRes.data.filter(u => u.is_staff || u.profile?.role === 'admin').length
      });
    } catch (error) {
      console.error("Admin data error:", error);
      // Eğer token süresi dolduysa ve veri çekemiyorsa otomatik logout yapabilirsin:
      if (error.response && error.response.status === 401) {
          handleHardLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- ACTIONS (User Operations) ---
  const handleUpdateUser = async (userId, field, value) => {
    try {
      const payload = {};
      payload[field] = value;
      await api.put(`/api/admin/users/${userId}/update/`, payload);
      setUsers(prev => prev.map(u => {
        if (u.id === userId) {
          const updatedProfile = { ...u.profile, [field]: value };
          return { ...u, profile: updatedProfile };
        }
        return u;
      }));
    } catch (error) {
      alert("Failed to update user.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure? This action cannot be undone.")) return;
    try {
      await api.delete(`/api/admin/users/${userId}/delete/`);
      setUsers(prev => prev.filter(u => u.id !== userId));
      setStats(prev => ({ ...prev, total: prev.total - 1 }));
      alert("User deleted. 🗑️");
    } catch (error) {
      const msg = error.response?.data?.error || "Delete failed.";
      alert(msg);
    }
  };

  const handleResetPassword = async (userId, username) => {
    const newPassword = prompt(`Enter new password for user "${username}":`);
    if (!newPassword) return;
    if (newPassword.length < 4) {
      alert("Password must be at least 4 characters.");
      return;
    }
    try {
      await api.post(`/api/admin/users/${userId}/reset-password/`, { password: newPassword });
      alert(`Password for ${username} reset successfully! 🔑`);
    } catch (error) {
      alert("Failed to reset password.");
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/admin/users/create/", newUser);
      alert("✨ User created successfully!");
      setNewUser({ username: '', password: '', email: '', first_name: '', last_name: '', role: 'instructor', department_id: '' });
      setActiveView('list');
      fetchData();
    } catch (error) {
      alert("Failed to create user. Username might be taken.");
    }
  };

  const handleEditOutline = (outline) => {
    navigate("/create-outline", { state: { courseToEdit: outline } });
  };

  // --- FİLTRELER ---
  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredOutlines = outlines.filter(o =>
    o.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.course_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = () => {
    if (user?.username) return user.username.charAt(0).toUpperCase();
    return "A"; 
  };

  return (
    // Ekranda herhangi bir yere tıklayınca menüyü kapatmak için
    <div className="fiu-shell" onClick={() => setShowLogoutMenu(false)}>
      
      {/* SIDEBAR */}
      <aside className="fiu-sidebar" style={{ zIndex: 100 }}>
        
        {/* LOGO */}
        <div className="fiu-brand">FIU SYSTEM</div>
        
        <div className="fiu-nav-section">
          <div className="fiu-nav-label">ADMINISTRATION</div>

          <div className={`fiu-nav ${activeView === 'list' ? 'active' : ''}`} onClick={() => setActiveView('list')} style={{ cursor: 'pointer' }}>
            <span className="fiu-nav-ico">👥</span> User Management
          </div>

          <div className={`fiu-nav ${activeView === 'create' ? 'active' : ''}`} onClick={() => setActiveView('create')} style={{ cursor: 'pointer' }}>
            <span className="fiu-nav-ico">✨</span> Create User
          </div>

          <div className={`fiu-nav ${activeView === 'courses' ? 'active' : ''}`} onClick={() => setActiveView('courses')} style={{ cursor: 'pointer' }}>
            <span className="fiu-nav-ico">📚</span> Course Outlines
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="fiu-main" style={{ background: '#f1f5f9', minHeight: '100vh' }}> 

        {/* --- TOPBAR --- */}
        <div className="fiu-topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '30px' }}>

          {/* SOL KISIM: BAŞLIKLAR VE ARAMA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
            <div>
              <div className="fiu-page-title">
                {activeView === 'list' && 'Admin Dashboard'}
                {activeView === 'create' && 'User Registration'}
                {activeView === 'courses' && 'Course Management'}
              </div>
              <div className="fiu-muted">
                {activeView === 'list' && 'Manage Users & Roles'}
                {activeView === 'create' && 'Create a new academic or administrative account'}
                {activeView === 'courses' && 'Edit Course Policies & Descriptions'}
              </div>
            </div>

            {/* Arama Kutusu */}
            {(activeView === 'list' || activeView === 'courses') && (
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
                <input
                  type="text"
                  placeholder={activeView === 'list' ? "Search users..." : "Search courses..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ padding: '10px 15px 10px 35px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '250px', outline: 'none', background: 'white', transition: 'all 0.2s' }}
                  onFocus={(e) => e.target.style.borderColor = '#ef4444'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                />
                <button onClick={fetchData} className="fiu-btn" style={{ background: 'white', color: '#333', border: '1px solid #ddd', marginLeft: '10px', padding: '10px' }}>↻</button>
              </div>
            )}
          </div>

          {/* SAĞ KISIM: PROFİL BİLGİSİ VE MENÜ BURADA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', position: 'relative' }}>

            {/* Profil Alanı - TIKLANABİLİR */}
            <div
              onClick={handleProfileClick}
              title="Click to Log Out"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                cursor: 'pointer',
                padding: '5px 10px',
                borderRadius: '8px',
                transition: 'background 0.2s',
                userSelect: 'none'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ textAlign: 'right', marginRight: '5px' }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>
                  {user?.username || "Admin"}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>
                  {user?.role || "Administrator"}
                </div>
              </div>
              <div style={{
                width: '42px', height: '42px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(239, 68, 68, 0.25)',
                border: '2px solid white'
              }}>
                {getInitials()}
              </div>
            </div>

            {/* --- LOGOUT MENÜSÜ (Sağ Üstte Açılır) --- */}
            {showLogoutMenu && (
              <div style={{
                position: 'absolute',
                top: '60px',
                right: '0', 
                background: 'white',
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                borderRadius: '8px',
                padding: '6px',
                zIndex: 1000,
                minWidth: '160px',
                animation: 'fadeIn 0.2s ease-in-out'
              }} onClick={(e) => e.stopPropagation()}>
                
                <div style={{ fontSize: '11px', color: '#94a3b8', padding: '6px 10px', borderBottom: '1px solid #f1f5f9', marginBottom: '4px' }}>
                  Account Options
                </div>

                <button
                  onClick={handleHardLogout}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 12px',
                    background: 'transparent',
                    border: 'none',
                    color: '#ef4444', 
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    borderRadius: '6px'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#fef2f2'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  🚪 Log Out
                </button>
              </div>
            )}

          </div>
        </div>

        {/* --- VIEW 1: USER LIST --- */}
        {activeView === 'list' && (
          <>
            <div className="fiu-stats" style={{ padding: '0 20px', marginBottom: '20px' }}>
              <div className="fiu-card fiu-stat">
                <div><div className="fiu-stat-title">TOTAL USERS</div><div className="fiu-stat-value">{stats.total}</div></div>
                <div className="fiu-icon-badge" style={{ background: '#eff6ff', color: '#2563eb' }}>👥</div>
              </div>
              <div className="fiu-card fiu-stat">
                <div><div className="fiu-stat-title">ACADEMIC STAFF</div><div className="fiu-stat-value">{stats.instructors}</div></div>
                <div className="fiu-icon-badge" style={{ background: '#f5f3ff', color: '#7c3aed' }}>🎓</div>
              </div>
              <div className="fiu-card fiu-stat">
                <div><div className="fiu-stat-title">ADMINS</div><div className="fiu-stat-value">{stats.admins}</div></div>
                <div className="fiu-icon-badge" style={{ background: '#ecfdf5', color: '#059669' }}>🛡️</div>
              </div>
            </div>

            <div style={{ padding: '0 20px 40px 20px' }}>
              <div className="fiu-card" style={{ padding: '0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <div className="fiu-table-head" style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', background: '#fff' }}>
                  <h3 style={{ margin: 0, color: '#1e293b', fontSize: '16px' }}>All Registered Users</h3>
                </div>
                <div className="fiu-table-wrap">
                  <table className="fiu-table">
                    <thead style={{ background: '#f8fafc' }}>
                      <tr>
                        <th style={{ paddingLeft: '24px' }}>USER</th>
                        <th>EMAIL</th>
                        <th>ROLE (Editable)</th>
                        <th>DEPARTMENT (Editable)</th>
                        <th style={{ textAlign: 'right', paddingRight: '24px' }}>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ fontWeight: '600', color: '#334155', paddingLeft: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '32px', height: '32px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '12px' }}>
                                {u.username.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                {u.first_name ? `${u.first_name} ${u.last_name}` : u.username}
                                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'normal' }}>@{u.username}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ color: '#64748b' }}>{u.email || "-"}</td>
                          <td>
                            <select
                              value={u.profile?.role || 'instructor'}
                              onChange={(e) => handleUpdateUser(u.id, 'role', e.target.value)}
                              style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', background: 'white', color: '#334155', cursor: 'pointer' }}
                            >
                              <option value="instructor">Instructor</option>
                              <option value="dean">Dean</option>
                              <option value="vice_dean">Vice Dean</option>
                              <option value="rectorate">Rectorate</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td>
                            <select
                              value={u.profile?.department || ''}
                              onChange={(e) => handleUpdateUser(u.id, 'department_id', e.target.value)}
                              style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', background: 'white', maxWidth: '180px', color: '#334155', cursor: 'pointer' }}
                            >
                              <option value="">-- No Department --</option>
                              {departments.map(dept => (
                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                              ))}
                            </select>
                          </td>
                          <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                              <button
                                onClick={() => handleResetPassword(u.id, u.username)}
                                style={{
                                  padding: '6px 10px', fontSize: '14px', background: '#fef3c7', color: '#d97706',
                                  border: '1px solid #fcd34d', borderRadius: '6px', cursor: 'pointer'
                                }}
                                title="Reset Password"
                              >
                                🔑
                              </button>

                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                style={{
                                  padding: '6px 12px', fontSize: '12px', background: '#fee2e2', color: '#ef4444',
                                  border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', fontWeight: '600'
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {/* --- VIEW 2: CREATE USER FORM --- */}
        {activeView === 'create' && (
          <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              background: 'white', width: '100%', maxWidth: '700px', borderRadius: '20px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              overflow: 'hidden',
              border: '1px solid #fecaca'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #b91c1c 0%, #ef4444 100%)',
                padding: '30px', color: 'white', textAlign: 'center', position: 'relative'
              }}>
                <div 
                  style={{
                    background: 'white', width: '140px', padding: '10px', borderRadius: '12px',
                    margin: '0 auto 15px auto', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                  <img src={fiuLogo} alt="FIU Logo" style={{ width: '100%', display: 'block', objectFit: 'contain' }} />
                </div>
                
                <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', letterSpacing: '0.5px' }}>CREATE NEW ACCOUNT</h2>
              </div>

              <form onSubmit={handleCreateUser} style={{ padding: '40px', display: 'grid', gap: '25px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                  <div>
                    <label style={labelStyle}>Username <span style={{ color: '#ef4444' }}>*</span></label>
                    <div style={inputWrapperStyle}>
                      <span style={iconStyle}>👤</span>
                      <input required type="text" placeholder="e.g. hoca1" style={inputStyle}
                        value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Password <span style={{ color: '#ef4444' }}>*</span></label>
                    <div style={inputWrapperStyle}>
                      <span style={iconStyle}>🔒</span>
                      <input required type="text" placeholder="e.g. 123456" style={inputStyle}
                        value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                  <div>
                    <label style={labelStyle}>First Name</label>
                    <div style={inputWrapperStyle}>
                      <span style={iconStyle}>🆔</span>
                      <input type="text" placeholder="e.g. Ahmet" style={inputStyle}
                        value={newUser.first_name} onChange={e => setNewUser({ ...newUser, first_name: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Last Name</label>
                    <div style={inputWrapperStyle}>
                      <span style={iconStyle}>🆔</span>
                      <input type="text" placeholder="e.g. Yilmaz" style={inputStyle}
                        value={newUser.last_name} onChange={e => setNewUser({ ...newUser, last_name: e.target.value })} />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Email Address</label>
                  <div style={inputWrapperStyle}>
                    <span style={iconStyle}>📧</span>
                    <input type="email" placeholder="e.g. ahmet@final.edu.tr" style={inputStyle}
                      value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                  <div>
                    <label style={labelStyle}>System Role</label>
                    <div style={inputWrapperStyle}>
                      <span style={iconStyle}>🛡️</span>
                      <select style={inputStyle} value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                        <option value="instructor">Instructor</option>
                        <option value="dean">Dean</option>
                        <option value="vice_dean">Vice Dean</option>
                        <option value="rectorate">Rectorate</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Department</label>
                    <div style={inputWrapperStyle}>
                      <span style={iconStyle}>🏢</span>
                      <select style={inputStyle} value={newUser.department_id} onChange={e => setNewUser({ ...newUser, department_id: e.target.value })}>
                        <option value="">-- No Department --</option>
                        {departments.map(dept => (
                          <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', gap: '15px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
                  <button type="button" onClick={() => setActiveView('list')}
                    style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: '#f1f5f9', color: '#64748b', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit"
                    style={{ flex: 2, padding: '14px', borderRadius: '10px', border: 'none', background: 'linear-gradient(90deg, #dc2626 0%, #ef4444 100%)', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Create User</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- VIEW 3: COURSE MANAGEMENT --- */}
        {activeView === 'courses' && (
          <div style={{ padding: '0 20px 40px 20px' }}>
            <div className="fiu-card" style={{ padding: '0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              <div className="fiu-table-head" style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, color: '#1e293b', fontSize: '16px' }}>All Course Outlines</h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Edit descriptions & policies here</span>
              </div>
              <div className="fiu-table-wrap">
                <table className="fiu-table">
                  <thead style={{ background: '#f8fafc' }}>
                    <tr>
                      <th style={{ paddingLeft: '24px' }}>CODE</th>
                      <th>COURSE NAME</th>
                      <th>INSTRUCTOR</th>
                      <th>STATUS</th>
                      <th style={{ textAlign: 'right', paddingRight: '24px' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOutlines.map((o) => (
                      <tr key={o.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ fontWeight: '700', color: '#1d4ed8', paddingLeft: '24px' }}>{o.course_code}</td>
                        <td style={{ fontWeight: '600', color: '#334155' }}>{o.course_name}</td>
                        <td style={{ fontSize: '13px', color: '#64748b' }}>
                          {users.find(u => u.id === o.instructor)?.username || "Unknown"}
                        </td>
                        <td>
                          <span style={{
                            padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase',
                            background: o.status === 'approved' ? '#dcfce7' : '#fee2e2',
                            color: o.status === 'approved' ? '#166534' : '#991b1b'
                          }}>
                            {o.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                          <button
                            onClick={() => handleEditOutline(o)}
                            style={{
                              padding: '8px 16px', fontSize: '12px', background: '#2563eb', color: 'white',
                              border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600',
                              boxShadow: '0 2px 4px rgba(37,99,235,0.2)'
                            }}
                          >
                            ✏️ Edit Outline
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

// --- STYLES OBJECTS ---
const labelStyle = {
  display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px'
};
const inputWrapperStyle = { position: 'relative', display: 'flex', alignItems: 'center' };
const iconStyle = { position: 'absolute', left: '12px', fontSize: '16px', opacity: 0.6, zIndex: 1 };
const inputStyle = {
  width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px',
  border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '14px',
  color: '#1e293b', outline: 'none', transition: 'all 0.2s', fontWeight: '500'
};
