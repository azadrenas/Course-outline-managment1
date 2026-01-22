import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom"; 
import api from "../api";
import "../styles/fiu-dashboard.css";
// GRAFİK İÇİN
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function RectorFaculties() {
  const { user, logout } = useAuth();
  const navigate = useNavigate(); 

  const [facultiesData, setFacultiesData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // --- KESİN ÇÖZÜM: HARD LOGOUT FUNCTION (Eklendi) ---
  const handleForceLogout = (e) => {
      if(e && e.preventDefault) e.preventDefault();
      if(logout) logout();
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      window.location.href = "/login";
  };

  // --- VERİ ÇEKME ---
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/outlines/");
      const allCourses = Array.isArray(response.data) ? response.data : [];

      const deptStats = {};

      allCourses.forEach(course => {
        // 1. Departman İsmi
        const deptName = course.department_name || "Unassigned Department";
        // 2. Fakülte İsmi
        const facultyName = course.faculty_name || "Unassigned Faculty"; 

        if (!deptStats[deptName]) {
          deptStats[deptName] = {
            name: deptName,
            total: 0,
            approved: 0,
            pending: 0,
            rejected: 0,
            faculty: facultyName
          };
        }

        deptStats[deptName].total += 1;
        if (course.status === 'approved') deptStats[deptName].approved += 1;
        else if (course.status === 'rejected') deptStats[deptName].rejected += 1;
        else deptStats[deptName].pending += 1;
      });

      const groupedByFaculty = {};
      Object.values(deptStats).forEach(dept => {
        if (!groupedByFaculty[dept.faculty]) {
          groupedByFaculty[dept.faculty] = [];
        }
        groupedByFaculty[dept.faculty].push(dept);
      });

      setFacultiesData(groupedByFaculty);

    } catch (error) {
      console.error("Data fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const COLORS = ['#22c55e', '#e5e7eb'];

  return (
    <div className="fiu-shell">
      {/* --- SIDEBAR --- */}
      <aside className="fiu-sidebar" style={{ zIndex: 100 }}>
        <div className="fiu-brand">FIU SYSTEM</div>
        <div className="fiu-nav-section">
            <div className="fiu-nav-label">RECTORATE</div>
            
            {/* 1. University Overview */}
            <Link to="/rector" className="fiu-nav" style={{ textDecoration: 'none', color: 'inherit', display:'flex', alignItems:'center', width:'100%' }}>
                <span className="fiu-nav-ico">📈</span> University Overview
            </Link>
            
            {/* 2. Faculties (AKTİF SAYFA) */}
            <div className="fiu-nav active" style={{ display:'flex', alignItems:'center', width:'100%' }}>
                <span className="fiu-nav-ico">🏢</span> Faculties
            </div>
            
            {/* 3. Staff Stats */}
            <Link to="/rector/staff-stats" className="fiu-nav" style={{ textDecoration: 'none', color: 'inherit', display:'flex', alignItems:'center', width:'100%' }}>
                <span className="fiu-nav-ico">👥</span> Staff Stats
            </Link>
        </div>

        <div style={{marginTop: 'auto'}}>
            {/* LOGOUT DÜZELTİLDİ */}
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="fiu-main">
        <div className="fiu-topbar">
            <div>
                <div className="fiu-page-title">Faculties & Departments</div>
                <div className="fiu-muted">Academic Units Performance Metrics</div>
            </div>
            
            <div style={{display:'flex', gap:'15px', alignItems:'center'}}>
                <input 
                    type="text" 
                    placeholder="Search department..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        padding: '10px 15px', borderRadius: '8px', border: '1px solid #d1d5db', 
                        width: '280px', outline: 'none', fontSize: '13px', backgroundColor: 'white'
                    }}
                />

                <div className="fiu-userbox" style={{position:'relative', cursor:'pointer'}} onClick={() => setShowProfileMenu(!showProfileMenu)}>
                    <div className="fiu-pill" style={{background:'#f3e8ff', color:'#6b21a8', borderColor:'#e9d5ff'}}>Rector Office</div>
                    <div className="fiu-avatar" style={{background:'#6b21a8'}}>R</div>
                    {showProfileMenu && (
                        <div style={{position: "absolute", top: "50px", right: "0", background: "white", border: "1px solid #e5e7eb", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", padding: "6px", width: "140px", zIndex: 999}}>
                            {/* LOGOUT DÜZELTİLDİ */}
                            <button onClick={handleForceLogout} style={{width: "100%", textAlign: "left", padding: "8px 12px", background: "transparent", border: "none", color: "#ef4444", fontWeight: "bold", cursor: "pointer"}}>🚪 Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </div>

        <div style={{padding: '0 20px 40px 20px'}}>
            {loading ? (
                <div style={{textAlign:'center', padding:'50px', color:'#6b7280'}}>Loading academic data...</div>
            ) : Object.keys(facultiesData).length === 0 ? (
                <div style={{textAlign:'center', padding:'50px', background:'#fff', borderRadius:'12px', marginTop:'20px'}}>
                    <h3 style={{color:'#374151'}}>No Data Found</h3>
                    <p style={{color:'#6b7280', fontSize:'14px'}}>
                        Currently, there are no courses linked to any faculty. <br/>
                        Please make sure courses are assigned to departments in the Admin Panel.
                    </p>
                </div>
            ) : (
                Object.keys(facultiesData).map((facultyName) => {
                    const departments = facultiesData[facultyName].filter(dept => 
                        dept.name.toLowerCase().includes(searchTerm.toLowerCase())
                    );

                    if (departments.length === 0) return null;

                    return (
                        <div key={facultyName} style={{marginBottom: '40px'}}>
                            {/* FAKÜLTE BAŞLIĞI */}
                            <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px', borderBottom:'1px solid #e5e7eb', paddingBottom:'10px'}}>
                                <div style={{fontSize:'22px', background: '#f3e8ff', width:'40px', height:'40px', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'8px'}}>🏛️</div>
                                <div>
                                    <h2 style={{margin:0, fontSize:'18px', color:'#1f2937', fontWeight:'800'}}>{facultyName}</h2>
                                    <span style={{fontSize:'12px', color:'#6b7280'}}>{departments.length} Departments Associated</span>
                                </div>
                            </div>

                            {/* DEPARTMAN KARTLARI */}
                            <div style={{display:'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap:'25px'}}>
                                {departments.map((dept) => {
                                    const percent = dept.total > 0 ? Math.round((dept.approved / dept.total) * 100) : 0;
                                    const pieData = [{ value: dept.approved }, { value: dept.total - dept.approved }];

                                    return (
                                        <div key={dept.name} className="fiu-card" style={{padding:'25px', position:'relative', borderTop: percent === 100 ? '4px solid #22c55e' : '4px solid #3b82f6', transition: 'transform 0.2s', cursor:'default'}}>
                                            
                                            {/* Üst Kısım: İsim ve Yüzde */}
                                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                                                <div style={{maxWidth: '70%'}}>
                                                    <h3 style={{margin:0, fontSize:'16px', color:'#111', fontWeight:'bold', lineHeight:'1.4'}}>{dept.name}</h3>
                                                    <div style={{fontSize:'12px', color:'#6b7280', marginTop:'6px'}}>Total Courses: <span style={{fontWeight:'bold', color:'#111', background:'#f3f4f6', padding:'2px 6px', borderRadius:'4px'}}>{dept.total}</span></div>
                                                </div>
                                                
                                                <div style={{width:'50px', height:'50px', position:'relative'}}>
                                                    <ResponsiveContainer>
                                                        <PieChart>
                                                            <Pie data={pieData} innerRadius={16} outerRadius={24} paddingAngle={0} dataKey="value" stroke="none" startAngle={90} endAngle={-270}>
                                                                {pieData.map((entry, index) => (
                                                                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                                                ))}
                                                            </Pie>
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                    <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', fontSize:'10px', fontWeight:'bold', color: percent===100?'#166534':'#111'}}>
                                                        {percent}%
                                                    </div>
                                                </div>
                                            </div>

                                            {/* İstatistik Barları */}
                                            <div style={{marginTop:'25px', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px'}}>
                                                <div style={{background:'#f0fdf4', padding:'8px', borderRadius:'6px', textAlign:'center', border:'1px solid #dcfce7'}}>
                                                    <div style={{fontSize:'16px', fontWeight:'bold', color:'#15803d'}}>{dept.approved}</div>
                                                    <div style={{fontSize:'9px', color:'#15803d', fontWeight:'700', textTransform:'uppercase', marginTop:'2px'}}>Approved</div>
                                                </div>
                                                <div style={{background:'#fffbeb', padding:'8px', borderRadius:'6px', textAlign:'center', border:'1px solid #fef3c7'}}>
                                                    <div style={{fontSize:'16px', fontWeight:'bold', color:'#b45309'}}>{dept.pending}</div>
                                                    <div style={{fontSize:'9px', color:'#b45309', fontWeight:'700', textTransform:'uppercase', marginTop:'2px'}}>Pending</div>
                                                </div>
                                                <div style={{background:'#fef2f2', padding:'8px', borderRadius:'6px', textAlign:'center', border:'1px solid #fee2e2'}}>
                                                    <div style={{fontSize:'16px', fontWeight:'bold', color:'#b91c1c'}}>{dept.rejected}</div>
                                                    <div style={{fontSize:'9px', color:'#b91c1c', fontWeight:'700', textTransform:'uppercase', marginTop:'2px'}}>Rejected</div>
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            <div style={{marginTop:'20px'}}>
                                                <div style={{display:'flex', justifyContent:'space-between', fontSize:'11px', marginBottom:'6px', color:'#6b7280', fontWeight:'500'}}>
                                                    <span>Completion Status</span>
                                                    <span>{dept.approved} / {dept.total}</span>
                                                </div>
                                                <div style={{width:'100%', height:'8px', background:'#e5e7eb', borderRadius:'4px', overflow:'hidden'}}>
                                                    <div style={{width: `${percent}%`, height:'100%', background: percent===100 ? '#22c55e' : '#3b82f6', transition:'width 0.5s', borderRadius:'4px'}}></div>
                                                </div>
                                            </div>

                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })
            )}
        </div>
      </main>
    </div>
  );
}