import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCourses } from "../context/CourseContext";
import { useAuth } from "../context/AuthContext"; 
import "../styles/fiu-dashboard.css"; 

export default function Instructors() {
  const { user, logout } = useAuth();
  const { instructors, fetchData } = useCourses();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    await fetchData();
    setLoading(false);
  };

  const isManager = ['vice_dean', 'dean', 'rector', 'admin'].includes(user?.role);

  const getRoleLabel = () => {
      if (!user || !user.role) return "Instructor";
      const roleMap = {
          'vice_dean': 'Vice Dean',
          'dean': 'Dean',
          'rector': 'Rector',
          'admin': 'Admin',
          'instructor': 'Instructor',
          'student': 'Student'
      };
      return roleMap[user.role] || "Instructor";
  };

  const filteredInstructors = (instructors || []).filter(function(ins) {
    var term = searchTerm ? searchTerm.toLowerCase() : "";
    var fullName = ((ins.first_name || "") + " " + (ins.last_name || "")).toLowerCase();
    var email = (ins.email || "").toLowerCase();
    
    var deptName = ins.profile?.department_name || ins.department_name || "";
    var dept = deptName.toLowerCase();
    
    return fullName.includes(term) || email.includes(term) || dept.includes(term);
  });

  return (
    <div className="fiu-shell">
      <aside className="fiu-sidebar">
        <div className="fiu-brand">FIU SYSTEM</div>
        <div className="fiu-nav-section">
            
            <div className="fiu-nav-label">MAIN</div>
            
            <div 
                onClick={() => navigate('/instructor', { state: { tab: 'dashboard' } })} 
                className="fiu-nav" 
                style={{cursor:'pointer'}}
            >
                <span className="fiu-nav-ico">⊞</span> Dashboard
            </div>

            <div 
                onClick={() => navigate('/instructor', { state: { tab: 'sections' } })} 
                className="fiu-nav" 
                style={{cursor:'pointer'}}
            >
                <span className="fiu-nav-ico">📚</span> Course Sections
            </div>

            {isManager && (
                <div onClick={() => navigate('/vice-dean')} className="fiu-nav" style={{cursor:'pointer', marginTop:'10px'}}>
                    <span className="fiu-nav-ico">🔍</span> Review Outlines
                </div>
            )}

            <div className="fiu-nav-label" style={{marginTop:'20px'}}>LISTS</div>
            
            <div className="fiu-nav active" style={{cursor:'pointer'}}>
                <span className="fiu-nav-ico">👥</span> Instructors List
            </div>
            
            <div onClick={() => navigate('/departments')} className="fiu-nav" style={{cursor:'pointer'}}>
                <span className="fiu-nav-ico">🏢</span> Departments
            </div>
            
            <div onClick={() => navigate("/create-outline")} className="fiu-nav" style={{marginTop:'20px', color:'#c8102e', fontWeight:'bold', background:'#fee2e2', border:'1px solid #fecaca', cursor:'pointer'}}>
                <span className="fiu-nav-ico">📝</span> + New Outline
            </div>
        </div>
      </aside>

      <main className="fiu-main">
        <div className="fiu-topbar">
          <div>
            <div className="fiu-page-title">Instructors List</div>
            <div className="fiu-muted">Academic staff directory</div>
          </div>
          
          <div className="fiu-userbox" style={{position: 'relative'}}>
            <div className="fiu-pill" style={{background:'#eff6ff', color:'#1d4ed8'}}>
                {getRoleLabel()}
            </div>
             
             <div 
                className="fiu-avatar" 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{background: isManager ? '#c8102e' : '#1d4ed8', cursor: 'pointer'}}
             >
                {isManager ? 'A' : 'I'}
             </div>

             {showProfileMenu && (
                <div style={{
                    position: "absolute", top: "50px", right: "0", 
                    background: "white", border: "1px solid #e5e7eb", borderRadius: "12px", 
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", padding: "6px", width: "140px", zIndex: 999
                }}>
                    <button onClick={logout} style={{width: "100%", textAlign: "left", padding: "8px 12px", background: "transparent", border: "none", color: "#ef4444", fontWeight: "bold", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px"}}>
                        🚪 Logout
                    </button>
                </div>
            )}
          </div>
        </div>
          
        <div style={{ padding: '0 20px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input type="text" placeholder="Search name, email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px', width: '300px', outline: 'none'}} />
            <button onClick={handleRefresh} className="fiu-btn" disabled={loading} style={{ background: '#fff', border: '1px solid #ddd', color: '#333', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', height: '35px' }}>
                {loading ? "..." : "Refresh ↻"}
            </button>
        </div>

        <div className="fiu-card fiu-table-card" style={{margin: '0 20px'}}>
            <div className="fiu-table-head">
                <div className="fiu-chart-title">Registered Staff ({filteredInstructors.length})</div>
            </div>
            <div className="fiu-table-wrap">
                <table className="fiu-table">
                    <thead>
                        <tr>
                            <th>FULL NAME</th>
                            <th>EMAIL</th>
                            {/* Başlık Güncellendi */}
                            <th>FACULTY / DEPARTMENT</th> 
                            <th>STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInstructors.length > 0 ? (
                            filteredInstructors.map((ins) => (
                                <tr key={ins.id}>
                                    <td className="fiu-strong">
                                        {ins.first_name ? `${ins.first_name} ${ins.last_name}` : ins.username}
                                    </td>
                                    <td style={{ color: '#2563eb' }}>{ins.email || "-"}</td>
                                    
                                    {/* --- KRAL HAMLE: FAKÜLTE ÜSTTE & RENKLİ, DEPARTMAN ALTTA --- */}
                                    <td>
                                        {/* 1. FAKÜLTE (Varsa Göster - Renkli Badge) */}
                                        {ins.profile?.faculty_name && (
                                            <span style={{
                                                display: 'inline-block',
                                                background: '#eff6ff', // Açık Mavi Arkaplan
                                                color: '#1d4ed8',      // Koyu Mavi Yazı (Sistem Rengi)
                                                fontSize: '11px',
                                                fontWeight: '700',
                                                padding: '4px 10px',
                                                borderRadius: '12px',
                                                marginBottom: '5px',
                                                border: '1px solid #dbeafe',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}>
                                                {ins.profile.faculty_name}
                                            </span>
                                        )}
                                        
                                        {/* 2. DEPARTMAN (Altta - Net Siyah Yazı) */}
                                        <div style={{
                                            fontWeight: '600', 
                                            color: '#374151', // Koyu Gri
                                            fontSize: '13px',
                                            paddingLeft: '2px' // Hizalama
                                        }}>
                                            {ins.profile?.department_name || ins.department_name || "Unassigned"}
                                        </div>
                                    </td>

                                    <td><span className="fiu-badge-green">Active</span></td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>{searchTerm ? "No results found." : "No instructors found."}</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </main>
    </div>
  );
}