// src/pages/DeanInstructors.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCourses } from "../context/CourseContext";
import { useAuth } from "../context/AuthContext"; 
import "../styles/fiu-dashboard.css"; 

export default function DeanInstructors() {
  const { user, logout } = useAuth();
  const { instructors, fetchData } = useCourses();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => { fetchData(); }, []);

  // --- KESİN ÇÖZÜM: HARD LOGOUT FUNCTION (Burayı ekledim) ---
  const handleForceLogout = (e) => {
      // Olası event hatalarını engelle
      if(e && e.preventDefault) e.preventDefault();
      if(e && e.stopPropagation) e.stopPropagation();

      // 1. Context içindeki logout'u çağır
      if(logout) logout();

      // 2. LocalStorage'ı manuel temizle (Garanti olsun)
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      // 3. Tarayıcıyı zorla Login'e fırlat
      window.location.href = "/login";
  };

  const handleRefresh = async () => {
    setLoading(true);
    await fetchData();
    setLoading(false);
  };

  const filteredInstructors = (instructors || []).filter(function(ins) {
    var term = searchTerm ? searchTerm.toLowerCase() : "";
    var fullName = ((ins.first_name || "") + " " + (ins.last_name || "")).toLowerCase();
    return fullName.includes(term) || (ins.email || "").toLowerCase().includes(term);
  });

  return (
    <div className="fiu-shell">
      <aside className="fiu-sidebar">
        <div className="fiu-brand">FIU SYSTEM</div>
        <div className="fiu-nav-section">
            <div className="fiu-nav-label">Dean's Office</div>
            
            <div onClick={() => navigate('/dean')} className="fiu-nav" style={{cursor:'pointer'}}>
                <span className="fiu-nav-ico">✍️</span> Final Approvals
            </div>

            <div onClick={() => navigate('/dean/stats')} className="fiu-nav" style={{cursor:'pointer'}}>
                <span className="fiu-nav-ico">📊</span> Faculty Stats
            </div>
            
            <div onClick={() => navigate('/dean/programs')} className="fiu-nav" style={{cursor:'pointer'}}>
                <span className="fiu-nav-ico">🎓</span> Programs
            </div>

            <div className="fiu-nav-label" style={{marginTop:'20px'}}>LISTS</div>
            
            <div className="fiu-nav active" style={{cursor:'pointer'}}>
                <span className="fiu-nav-ico">👥</span> Instructors List
            </div>
            
            <div onClick={() => navigate('/dean/departments')} className="fiu-nav" style={{cursor:'pointer'}}>
                <span className="fiu-nav-ico">🏢</span> Departments
            </div>
        </div>
        
        <div style={{marginTop: 'auto'}}>
            {/* Sol menüdeki çıkış butonu güncellendi */}
        </div>
      </aside>

      <main className="fiu-main">
        <div className="fiu-topbar">
          <div><div className="fiu-page-title">Instructors List</div><div className="fiu-muted">Dean View</div></div>
          
          <div style={{display:'flex', gap:'10px', alignItems:'center', position: 'relative'}}>
             <div className="fiu-pill" style={{background:'#e0e7ff', color:'#3730a3'}}>Dean</div>
             
             {/* Profil Logosu ve Dropdown */}
             <div className="fiu-avatar" onClick={() => setShowProfileMenu(!showProfileMenu)} style={{background: '#3730a3', cursor: 'pointer'}}>D</div>
             
             {showProfileMenu && (
                <div style={{
                    position: "absolute", top: "50px", right: "120px", 
                    background: "white", border: "1px solid #e5e7eb", 
                    borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", 
                    padding: "6px", width: "150px", zIndex: 999
                }}>
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleForceLogout(e); }} 
                        style={{
                            width: "100%", textAlign: "left", padding: "8px 12px", 
                            background: "transparent", border: "none", color: "#ef4444", 
                            fontWeight: "bold", cursor: "pointer", display:'flex', alignItems:'center'
                        }}
                        onMouseOver={(e) => e.target.style.background = '#fef2f2'}
                        onMouseOut={(e) => e.target.style.background = 'transparent'}
                    >
                        <span style={{marginRight:'8px'}}>🚪</span> Logout
                    </button>
                </div>
             )}

             <button onClick={handleRefresh} className="fiu-btn" disabled={loading} style={{ background: '#fff', border: '1px solid #ddd', color: '#333', padding: '8px 15px', borderRadius: '6px' }}>↻ Refresh</button>
          </div>
        </div>
          
        <div style={{ padding: '0 20px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px', width: '300px', outline: 'none'}} />
            <button onClick={handleRefresh} className="fiu-btn" disabled={loading} style={{ background: '#fff', border: '1px solid #ddd', color: '#333', padding: '8px 15px', borderRadius: '6px' }}>Refresh ↻</button>
        </div>

        <div className="fiu-card fiu-table-card" style={{margin: '0 20px'}}>
            <div className="fiu-table-head"><div className="fiu-chart-title">Registered Staff ({filteredInstructors.length})</div></div>
            <div className="fiu-table-wrap">
                <table className="fiu-table">
                    <thead><tr><th>FULL NAME</th><th>EMAIL</th><th>DEPARTMENT</th><th>STATUS</th></tr></thead>
                    <tbody>
                        {filteredInstructors.map((ins) => (
                            <tr key={ins.id}>
                                <td className="fiu-strong">{ins.first_name + " " + ins.last_name}</td>
                                <td style={{ color: '#2563eb' }}>{ins.email}</td>
                                <td><span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>{ins.department_name || "General"}</span></td>
                                <td><span className="fiu-badge-green">Active</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </main>
    </div>
  );
}