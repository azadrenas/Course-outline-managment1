// src/pages/ViceDeanInstructors.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCourses } from "../context/CourseContext";
import { useAuth } from "../context/AuthContext"; 
import "../styles/fiu-dashboard.css"; 

export default function ViceDeanInstructors() {
  const { user, logout } = useAuth();
  const { instructors, fetchData } = useCourses();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const handleForceLogout = (e) => {
      if(e && e.preventDefault) e.preventDefault();
      if(e && e.stopPropagation) e.stopPropagation();
      if(logout) logout();
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
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
    var email = (ins.email || "").toLowerCase();
    var dept = (ins.department_name || "").toLowerCase();
    return fullName.includes(term) || email.includes(term) || dept.includes(term);
  });

  return (
    <div className="fiu-shell">
      <aside className="fiu-sidebar">
        <div className="fiu-brand">FIU SYSTEM</div>
        <div className="fiu-nav-section">
            <div className="fiu-nav-label">ACADEMIC ADMIN</div>
            
            <div onClick={() => navigate('/vice-dean')} className="fiu-nav" style={{cursor:'pointer'}}>
                <span className="fiu-nav-ico">🔍</span> Review Outlines
            </div>

            <div className="fiu-nav-label" style={{marginTop:'20px'}}>LISTS</div>
            
            <div className="fiu-nav active" style={{cursor:'pointer'}}>
                <span className="fiu-nav-ico">👥</span> Instructors List
            </div>
            
            <div onClick={() => navigate('/vice-dean/departments')} className="fiu-nav" style={{cursor:'pointer'}}>
                <span className="fiu-nav-ico">🏢</span> Departments
            </div>
        </div>
      </aside>

      <main className="fiu-main">
        <div className="fiu-topbar">
          <div>
            <div className="fiu-page-title">Instructors List</div>
            <div className="fiu-muted">Vice Dean View</div>
          </div>
          
          <div className="fiu-userbox" style={{position: 'relative'}}>
            <div className="fiu-pill" style={{background:'#dbeafe', color:'#1e40af'}}>
                Vice Dean
            </div>
             
             <div 
                className="fiu-avatar" 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{background: '#c8102e', cursor: 'pointer'}}
             >
                VD
             </div>

             {showProfileMenu && (
                <div style={{
                    position: "absolute", top: "50px", right: "0", 
                    background: "white", border: "1px solid #e5e7eb", borderRadius: "12px", 
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", padding: "6px", width: "140px", zIndex: 999
                }}>
                    <button 
                        onClick={handleForceLogout}
                        style={{width: "100%", textAlign: "left", padding: "8px 12px", background: "transparent", border: "none", color: "#ef4444", fontWeight: "bold", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px"}}
                    >
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
                            <th>DEPARTMENT</th>
                            <th>STATUS</th>
                            {/* Actions başlığını kaldırdım çünkü artık action yok */}
                            <th style={{textAlign:'right'}}></th> 
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInstructors.length > 0 ? (
                            filteredInstructors.map((ins) => (
                                <tr key={ins.id}>
                                    <td className="fiu-strong">{ins.first_name + " " + ins.last_name}</td>
                                    <td style={{ color: '#2563eb' }}>{ins.email}</td>
                                    <td><span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>{ins.department_name || "General"}</span></td>
                                    <td><span className="fiu-badge-green">Active</span></td>
                                    <td style={{textAlign:'right'}}>
                                        {/* Buton kaldırıldı */}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>{searchTerm ? "No results found." : "No instructors found."}</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </main>
    </div>
  );
}