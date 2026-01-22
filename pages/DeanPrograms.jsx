// src/pages/DeanPrograms.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import "../styles/fiu-dashboard.css";

export default function DeanPrograms() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- EKLENEN STATE: Profil menüsünün açılıp kapanması için ---
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    fetchApprovedCourses();
  }, []);

  // --- EKLENEN FONKSİYON: KESİN ÇIKIŞ (Hard Logout) ---
  const handleForceLogout = (e) => {
      // Olası event çakışmalarını engelle
      if(e && e.preventDefault) e.preventDefault();
      if(e && e.stopPropagation) e.stopPropagation();

      // 1. Context içindeki logout'u çağır
      if(logout) logout();

      // 2. LocalStorage'ı temizle
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      // 3. Login sayfasına zorla yönlendir
      window.location.href = "/login";
  };

  const fetchApprovedCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/outlines/");
      const allCourses = Array.isArray(response.data) ? response.data : [];
      
      // SADECE DEKAN TARAFINDAN ONAYLANMIŞ DERSLERİ GÖSTER
      const approved = allCourses.filter(c => c.status === "approved");
      setPrograms(approved);
    } catch (error) {
      console.error("Error fetching programs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (course) => {
    navigate("/create-outline", { state: { courseToEdit: course, readOnly: true } });
  };

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
            
            {/* AKTİF SAYFA */}
            <div className="fiu-nav active" style={{cursor:'pointer'}}>
                <span className="fiu-nav-ico">🎓</span> Programs
            </div>

            <div className="fiu-nav-label" style={{marginTop:'20px'}}>LISTS</div>
            <div onClick={() => navigate('/dean/instructors')} className="fiu-nav" style={{cursor:'pointer'}}>
                <span className="fiu-nav-ico">👥</span> Instructors List
            </div>
            <div onClick={() => navigate('/dean/departments')} className="fiu-nav" style={{cursor:'pointer'}}>
                <span className="fiu-nav-ico">🏢</span> Departments
            </div>
        </div>
        
        <div style={{marginTop: 'auto'}}>
            {/* Sol menüdeki çıkış butonunu da güncelledik */}
        </div>
      </aside>

      <main className="fiu-main">
        <div className="fiu-topbar">
          <div>
            <div className="fiu-page-title">Active Programs</div>
            <div className="fiu-muted">Officially Published Course Outlines</div>
          </div>
          
          {/* --- GÜNCELLENEN KISIM: Tıklanabilir Profil Logosu ve Dropdown --- */}
          <div 
            className="fiu-userbox" 
            style={{position: 'relative', cursor: 'pointer'}}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="fiu-pill" style={{background:'#e0e7ff', color:'#3730a3'}}>
                {user?.name || "Dean"}
            </div>
            <div className="fiu-avatar" style={{background:'#3730a3'}}>D</div>

            {/* Açılır Menü (Dropdown) */}
            {showProfileMenu && (
                <div style={{
                    position: 'absolute', top: '120%', right: 0,
                    background: 'white', border: '1px solid #e5e7eb',
                    borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    padding: '8px', zIndex: 50, minWidth: '150px'
                }}>
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleForceLogout(e); }} 
                        style={{
                            display: 'flex', alignItems: 'center', width: '100%',
                            padding: '8px 12px', fontSize: '14px', color: '#ef4444',
                            background: 'transparent', border: 'none', cursor: 'pointer',
                            borderRadius: '4px'
                        }}
                        onMouseOver={(e) => e.target.style.background = '#fef2f2'}
                        onMouseOut={(e) => e.target.style.background = 'transparent'}
                    >
                        <span style={{marginRight: '8px'}}>🚪</span> Logout
                    </button>
                </div>
            )}
          </div>
          {/* ------------------------------------------------------------------ */}
          
        </div>

        <div className="fiu-card fiu-table-card">
            <div className="fiu-table-head">
                <div className="fiu-chart-title">Published Curriculum ({programs.length})</div>
                <button onClick={fetchApprovedCourses} className="fiu-btn" style={{background:'#fff', color:'#333', border:'1px solid #ddd'}}>Refresh ↻</button>
            </div>
            <div className="fiu-table-wrap">
                <table className="fiu-table">
                    <thead>
                        <tr>
                            <th>CODE</th>
                            <th>COURSE NAME</th>
                            <th>DEPARTMENT</th>
                            <th>SEMESTER</th>
                            <th>STATUS</th>
                            <th style={{textAlign:'right'}}>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" style={{textAlign:'center', padding:'20px'}}>Loading...</td></tr>
                        ) : programs.length === 0 ? (
                            <tr><td colSpan="6" style={{textAlign:'center', padding:'40px', color:'#999'}}>No published courses yet.</td></tr>
                        ) : (
                            programs.map((course) => (
                                <tr key={course.id}>
                                    <td className="fiu-strong">{course.course_code || course.code}</td>
                                    <td>{course.course_name || course.title}</td>
                                    <td><span style={{background:'#f3f4f6', padding:'4px 10px', borderRadius:'12px', fontSize:'12px'}}>{course.department_name || "General"}</span></td>
                                    <td>{course.semester}</td>
                                    
                                    <td>
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '5px',
                                            background: '#dcfce7', 
                                            color: '#166534',      
                                            padding: '5px 12px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            border: '1px solid #bbf7d0'
                                        }}>
                                            <span>✓</span> Published
                                        </span>
                                    </td>

                                    <td style={{textAlign:'right'}}>
                                        <button onClick={() => handleView(course)} className="fiu-btn" style={{background:'#fff', border:'1px solid #ddd'}}>View Details</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </main>
    </div>
  );
}