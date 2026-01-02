// src/pages/DeanDepartments.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCourses } from "../context/CourseContext";
import { useAuth } from "../context/AuthContext";
import "../styles/fiu-dashboard.css"; 

export default function DeanDepartments() {
  const { user, logout } = useAuth(); 
  const { departments, instructors, courses, fetchData } = useCourses();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [openStaffIds, setOpenStaffIds] = useState([]);
  const [openCourseIds, setOpenCourseIds] = useState([]);

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
    setOpenStaffIds([]);    
    setOpenCourseIds([]);   
    setLoading(false);
  };

  const toggleStaff = (id) => { if (openStaffIds.includes(id)) setOpenStaffIds(openStaffIds.filter(itemId => itemId !== id)); else setOpenStaffIds([...openStaffIds, id]); };
  const toggleCourses = (id) => { if (openCourseIds.includes(id)) setOpenCourseIds(openCourseIds.filter(itemId => itemId !== id)); else setOpenCourseIds([...openCourseIds, id]); };

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
            
            <div onClick={() => navigate('/dean/instructors')} className="fiu-nav" style={{cursor:'pointer'}}>
                <span className="fiu-nav-ico">👥</span> Instructors List
            </div>
            
            {/* AKTİF SAYFA */}
            <div className="fiu-nav active" style={{cursor:'pointer'}}>
                <span className="fiu-nav-ico">🏢</span> Departments
            </div>
        </div>
        
        <div style={{marginTop: 'auto'}}>
            {/* Sol menüdeki çıkış butonu güncellendi */}
          
        </div>
      </aside>

      <main className="fiu-main">
        <div className="fiu-topbar">
          <div><div className="fiu-page-title">Departments</div><div className="fiu-muted">Faculty overview & stats (Dean View)</div></div>
          
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

        <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px' }}>
          {departments.map((dept) => {
              const deptStaff = (instructors || []).filter(ins => ins.department_name === dept.name);
              const deptCourses = (courses || []).filter(c => c.department === dept.id || c.department_name === dept.name);
              const isStaffOpen = openStaffIds.includes(dept.id);
              const isCoursesOpen = openCourseIds.includes(dept.id);

              return (
                <div key={dept.id} className="fiu-card" style={{ borderTop: '4px solid #3730a3', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    <div style={{ padding: '25px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <div style={{ fontSize: '26px', background: '#e0e7ff', color: '#3730a3', width: '55px', height: '55px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🏢</div>
                          <div><h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>Faculty of Engineering</h3><p style={{ margin: '3px 0 0', fontSize: '12px', color: '#6b7280' }}>{dept.name}</p></div>
                        </div>
                        <hr style={{ border: 'none', borderTop: '1px solid #f3f4f6', margin: '15px 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                          <div style={{ display: 'flex', gap: '20px' }}>
                              <div style={{ textAlign: 'center' }}><div style={{ fontSize: '18px', fontWeight: 'bold', color: '#111' }}>{deptStaff.length}</div><div style={{ fontSize: '10px', color: '#6b7280', fontWeight: '600' }}>STAFF</div></div>
                              <div style={{ borderLeft: '1px solid #e5e7eb' }}></div>
                              <div style={{ textAlign: 'center' }}><div style={{ fontSize: '18px', fontWeight: 'bold', color: '#111' }}>{deptCourses.length}</div><div style={{ fontSize: '10px', color: '#6b7280', fontWeight: '600' }}>COURSES</div></div>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                              <button onClick={() => toggleStaff(dept.id)} style={{ background: isStaffOpen ? '#f3f4f6' : '#fff', border: '1px solid #e5e7eb', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>{isStaffOpen ? "Hide" : "Staff"}</button>
                              <button onClick={() => toggleCourses(dept.id)} style={{ background: isCoursesOpen ? '#eff6ff' : '#fff', border: isCoursesOpen ? '1px solid #bfdbfe' : '1px solid #e5e7eb', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', color: '#1e40af' }}>{isCoursesOpen ? "Hide" : "Courses"}</button>
                          </div>
                        </div>
                    </div>
                    {isStaffOpen && (<div style={{ background: '#f9fafb', borderTop: '1px solid #e5e7eb', padding: '15px 25px' }}><ul style={{listStyle:'none', padding:0}}>{deptStaff.map(s=><li key={s.id} style={{padding:'5px 0', borderBottom:'1px solid #eee'}}>{s.first_name} {s.last_name}</li>)}</ul></div>)}
                    {isCoursesOpen && (<div style={{ background: '#f0f9ff', borderTop: '1px solid #bfdbfe', padding: '15px 25px' }}><ul style={{listStyle:'none', padding:0}}>{deptCourses.map(c=><li key={c.id} style={{padding:'5px 0', borderBottom:'1px solid #bfdbfe'}}>{c.course_code} - {c.course_name}</li>)}</ul></div>)}
                </div>
              );
            })
          }
        </div>
      </main>
    </div>
  );
}
