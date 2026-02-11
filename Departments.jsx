import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCourses } from "../context/CourseContext";
import { useAuth } from "../context/AuthContext";
import "../styles/fiu-dashboard.css"; 

export default function Departments() {
  const { user, logout } = useAuth(); 
  const { departments, instructors, courses, fetchData } = useCourses();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [openStaffIds, setOpenStaffIds] = useState([]);
  const [openCourseIds, setOpenCourseIds] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    await fetchData();
    setOpenStaffIds([]);    
    setOpenCourseIds([]);   
    setLoading(false);
  };

  // --- ROL KONTROLÜ ---
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

  const toggleStaff = (id) => {
    if (openStaffIds.includes(id)) setOpenStaffIds(openStaffIds.filter(itemId => itemId !== id));
    else setOpenStaffIds([...openStaffIds, id]);
  };

  const toggleCourses = (id) => {
    if (openCourseIds.includes(id)) setOpenCourseIds(openCourseIds.filter(itemId => itemId !== id));
    else setOpenCourseIds([...openCourseIds, id]);
  };

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
            
            <div onClick={() => navigate('/instructors')} className="fiu-nav" style={{cursor:'pointer'}}>
                <span className="fiu-nav-ico">👥</span> Instructors List
            </div>
            
            <div className="fiu-nav active" style={{cursor:'pointer'}}>
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
            <div className="fiu-page-title">Departments</div>
            <div className="fiu-muted">Faculty overview & stats</div>
          </div>
          
          <div style={{display:'flex', gap:'10px', alignItems:'center', position: 'relative'}}>
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
                    position: "absolute", top: "50px", right: "120px",
                    background: "white", border: "1px solid #e5e7eb", borderRadius: "12px", 
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", padding: "6px", width: "140px", zIndex: 999
                }}>
                    <button onClick={logout} style={{width: "100%", textAlign: "left", padding: "8px 12px", background: "transparent", border: "none", color: "#ef4444", fontWeight: "bold", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px"}}>
                        🚪 Logout
                    </button>
                </div>
             )}

             <button onClick={handleRefresh} className="fiu-btn" disabled={loading} style={{ background: '#fff', border: '1px solid #ddd', color: '#333', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer' }}>
                {loading ? "..." : "↻ Refresh"}
             </button>
          </div>
        </div>

        <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px' }}>
          {departments.length > 0 ? (
            departments.map((dept) => {
              const deptStaff = (instructors || []).filter(ins => ins.department_name === dept.name);
              const deptCourses = (courses || []).filter(c => c.department === dept.id || c.department_name === dept.name);
              
              const isStaffOpen = openStaffIds.includes(dept.id);
              const isCoursesOpen = openCourseIds.includes(dept.id);

              return (
                <div key={dept.id} className="fiu-card" style={{ borderTop: '4px solid #c8102e', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    <div style={{ padding: '25px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <div style={{ fontSize: '26px', background: '#fef2f2', color: '#c8102e', width: '55px', height: '55px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🏢</div>
                          <div>
                             {/* --- DÜZELTME BURADA YAPILDI --- */}
                             {/* Sabit yazı yerine veritabanından gelen veriyi çekiyoruz */}
                             <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
                                {dept.faculty_name || dept.faculty || "Faculty"}
                             </h3>
                             <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#6b7280' }}>{dept.name}</p>
                          </div>
                        </div>
                        <hr style={{ border: 'none', borderTop: '1px solid #f3f4f6', margin: '15px 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                          <div style={{ display: 'flex', gap: '20px' }}>
                              <div style={{ textAlign: 'center' }}>
                                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#111' }}>{deptStaff.length}</div>
                                  <div style={{ fontSize: '10px', color: '#6b7280', fontWeight: '600' }}>STAFF</div>
                              </div>
                              <div style={{ borderLeft: '1px solid #e5e7eb' }}></div>
                              <div style={{ textAlign: 'center' }}>
                                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#111' }}>{deptCourses.length}</div>
                                  <div style={{ fontSize: '10px', color: '#6b7280', fontWeight: '600' }}>COURSES</div>
                              </div>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                              <button onClick={() => toggleStaff(dept.id)} style={{ background: isStaffOpen ? '#f3f4f6' : '#fff', border: '1px solid #e5e7eb', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', color: isStaffOpen ? '#111' : '#374151' }}>{isStaffOpen ? "Hide Staff" : "View Staff"}</button>
                              <button onClick={() => toggleCourses(dept.id)} style={{ background: isCoursesOpen ? '#eff6ff' : '#fff', border: isCoursesOpen ? '1px solid #bfdbfe' : '1px solid #e5e7eb', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', color: isCoursesOpen ? '#1e40af' : '#374151' }}>{isCoursesOpen ? "Hide Courses" : "View Courses"}</button>
                          </div>
                        </div>
                    </div>
                    {isStaffOpen && (
                        <div style={{ background: '#f9fafb', borderTop: '1px solid #e5e7eb', padding: '15px 25px' }}>
                           <h4 style={{ margin: '0 0 10px 0', fontSize: '11px', textTransform: 'uppercase', color: '#6b7280', fontWeight: 'bold' }}>Department Staff</h4>
                           {deptStaff.length > 0 ? (
                               <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                   {deptStaff.map(staff => (
                                     <li key={staff.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #e5e7eb' }}>
                                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#e5e7eb', color: '#4b5563', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{staff.first_name.charAt(0)}</div>
                                            <span style={{ fontSize: '13px', color: '#374151' }}>{staff.first_name} {staff.last_name}</span>
                                       </div>
                                     </li>
                                   ))}
                               </ul>
                           ) : <div style={{ fontSize: '13px', color: '#9ca3af' }}>No instructors.</div>}
                        </div>
                    )}
                    {isCoursesOpen && (
                        <div style={{ background: '#f0f9ff', borderTop: '1px solid #bfdbfe', padding: '15px 25px' }}>
                           <h4 style={{ margin: '0 0 10px 0', fontSize: '11px', textTransform: 'uppercase', color: '#1e40af', fontWeight: 'bold' }}>Department Courses</h4>
                           {deptCourses.length > 0 ? (
                               <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                   {deptCourses.map(course => (
                                     <li key={course.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #bfdbfe' }}>
                                       <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e3a8a' }}>{course.course_code || course.code}</span>
                                            <span style={{ fontSize: '12px', color: '#1e40af' }}>{course.course_name || "-"}</span>
                                       </div>
                                       <span style={{ fontSize: '11px', background: '#fff', border: '1px solid #bfdbfe', padding: '2px 6px', borderRadius: '4px', color: '#1e40af' }}>Sem: {course.semester || "?"}</span>
                                     </li>
                                   ))}
                               </ul>
                           ) : <div style={{ fontSize: '13px', color: '#60a5fa' }}>No courses listed.</div>}
                        </div>
                    )}
                </div>
              );
            })
          ) : (
            <div style={{ gridColumn: '1 / -1', padding: '50px', textAlign: 'center', background: 'white', borderRadius: '12px' }}>
                <p style={{ color: '#9ca3af' }}>No departments found.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
