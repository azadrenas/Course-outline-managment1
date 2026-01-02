import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api"; 
import "../styles/fiu-dashboard.css"; 
// GRAFİK KÜTÜPHANESİ
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip, Legend } from 'recharts';

export default function StaffStats() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const [stats, setStats] = useState({
    totalStaff: 0,
    activeInstructors: 0,
    totalDepartments: 0,
    rolesDistribution: [],
    departmentDistribution: [],
    topPerformers: []
  });

  // --- KESİN ÇÖZÜM: HARD LOGOUT FUNCTION (Eklendi) ---
  const handleForceLogout = (e) => {
      if(e && e.preventDefault) e.preventDefault();
      if(logout) logout();
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      window.location.href = "/login";
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/staff-stats/");
      setStats(response.data);
    } catch (error) {
      console.error("Stats fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // --- KPI KART BİLEŞENİ ---
  const KPICard = ({ title, value, sub, icon, color, bg }) => (
    <div style={{
      background: 'white', padding: '24px', borderRadius: '16px',
      border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
      transition: 'transform 0.2s',
      cursor: 'default'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'16px'}}>
        <div style={{
          width:'48px', height:'48px', borderRadius:'12px', background: bg, 
          color: color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem'
        }}>
          {icon}
        </div>
      </div>
      
      <div>
        <div style={{fontSize:'2.2rem', fontWeight:'800', color:'#1e293b', lineHeight:'1', marginBottom:'6px', letterSpacing:'-1px'}}>
          {value}
        </div>
        <div style={{fontSize:'0.9rem', color:'#64748b', fontWeight:'500'}}>{title}</div>
      </div>

      <div style={{marginTop:'12px', paddingTop:'12px', borderTop:'1px solid #f8fafc', fontSize:'0.75rem', color: '#94a3b8', display:'flex', alignItems:'center', gap:'6px'}}>
         {sub}
      </div>
    </div>
  );

  return (
    <div className="fiu-shell">
      {/* SIDEBAR */}
      <aside className="fiu-sidebar" style={{zIndex:100}}>
        <div className="fiu-brand">FIU SYSTEM</div>
        <div className="fiu-nav-section">
            <div className="fiu-nav-label">RECTORATE</div>
            <Link to="/rector" className="fiu-nav" style={{ textDecoration: 'none', color: 'inherit' }}>
                <span className="fiu-nav-ico">📈</span> University Overview
            </Link>
            <Link to="/rector/faculties" className="fiu-nav" style={{ textDecoration: 'none', color: 'inherit' }}>
                <span className="fiu-nav-ico">🏢</span> Faculties
            </Link>
            <div className="fiu-nav active">
                <span className="fiu-nav-ico">👥</span> Staff Stats
            </div>
        </div>
        <div style={{marginTop: 'auto'}}>
            {/* LOGOUT DÜZELTİLDİ */}
           
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="fiu-main" style={{backgroundColor: '#f8fafc', paddingBottom: '40px'}}>
        <div className="fiu-topbar">
          <div>
            <div className="fiu-page-title">Staff Analytics</div>
            <div className="fiu-muted">Academic Staff Performance & Distribution</div>
          </div>
          
          <div style={{display:'flex', gap:'15px', alignItems:'center'}}>
             <button onClick={fetchStats} className="fiu-btn" style={{background:'#fff', color:'#333', border:'1px solid #ddd'}}>Refresh Data ↻</button>
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

        {loading ? (
          <div style={{height:'60vh', display:'flex', justifyContent:'center', alignItems:'center'}}>
            <div className="spinner"></div>
            <span style={{marginLeft:'10px', color:'#64748b'}}>Loading real-time data...</span>
          </div>
        ) : (
          <div style={{display:'flex', flexDirection:'column', gap:'24px', marginTop:'20px', padding:'0 20px'}}>
            
            {/* 1. YENİ KPI KARTLARI */}
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:'24px'}}>
              <KPICard 
                title="Total Registered Staff" 
                value={stats.totalStaff} 
                sub="Active system users" 
                icon="👥" 
                color="#2563eb" bg="#eff6ff"
              />
              <KPICard 
                title="Total Departments" 
                value={stats.totalDepartments} 
                sub="Academic units" 
                icon="🏛️" 
                color="#7c3aed" bg="#f5f3ff"
              />
              <KPICard 
                title="Active Instructors" 
                value={stats.activeInstructors} 
                sub="Contributed at least 1 course" 
                icon="✍️" 
                color="#059669" bg="#ecfdf5"
              />
              <KPICard 
                title="Participation Rate" 
                value={stats.totalStaff > 0 ? `%${Math.round((stats.activeInstructors / stats.totalStaff)*100)}` : '0%'} 
                sub="Staff creating content" 
                icon="📊" 
                color="#ea580c" bg="#fff7ed"
              />
            </div>

            {/* 2. GRAFİKLER */}
            <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:'24px'}}>
              
              {/* SOL: Department Distribution */}
              <div className="fiu-card" style={{padding:'24px', minHeight:'350px'}}>
                <h3 style={{marginTop:0, marginBottom:'20px', fontSize:'1.1rem', color:'#0f172a'}}>Department Staff Distribution</h3>
                <div style={{display:'flex', flexDirection:'column', gap:'16px'}}>
                  {stats.departmentDistribution.length > 0 ? (
                      stats.departmentDistribution.map((item, index) => (
                        <div key={index}>
                          <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.9rem', marginBottom:'6px'}}>
                            <span style={{fontWeight:'600', color:'#334155'}}>{item.name}</span>
                            <span style={{fontWeight:'600', color:'#64748b'}}>{item.count}</span>
                          </div>
                          <div style={{width:'100%', height:'10px', background:'#f1f5f9', borderRadius:'5px', overflow:'hidden'}}>
                            <div style={{
                              width: `${stats.totalStaff > 0 ? (item.count / stats.totalStaff) * 100 : 0}%`, 
                              height:'100%', 
                              background: item.color, 
                              borderRadius:'5px',
                              transition: 'width 1s ease-in-out'
                            }}></div>
                          </div>
                        </div>
                      ))
                  ) : (
                      <div style={{color: '#94a3b8', textAlign:'center', padding:'40px', background:'#f8fafc', borderRadius:'8px'}}>
                        No departments found.
                      </div>
                  )}
                </div>
              </div>

              {/* SAĞ: Role Distribution */}
              <div className="fiu-card" style={{padding:'24px', minHeight:'350px', display:'flex', flexDirection:'column'}}>
                 <h3 style={{marginTop:0, fontSize:'1.1rem', color:'#0f172a'}}>Academic Role Breakdown</h3>
                 <p style={{fontSize:'12px', color:'#64748b', marginBottom:'10px'}}>Distribution by user titles</p>
                 
                 <div style={{flex:1, minHeight:'200px'}}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={stats.rolesDistribution}
                                cx="50%" cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {stats.rolesDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <ReTooltip />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                 </div>
                 {stats.rolesDistribution.length === 0 && (
                     <div style={{textAlign:'center', color:'#94a3b8', fontSize:'12px'}}>No role data available.</div>
                 )}
              </div>
            </div>

            {/* 3. TABLO: Top Contributors */}
            <div className="fiu-card" style={{padding:'24px'}}>
               <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                   <h3 style={{margin:0, fontSize:'1.1rem', color:'#0f172a'}}>🏆 Top Contributors</h3>
                   <span style={{fontSize:'12px', color:'#64748b', background:'#f1f5f9', padding:'4px 8px', borderRadius:'6px'}}>Most Outlines Created</span>
               </div>
               
               <div className="fiu-table-wrap">
                   <table className="fiu-table">
                     <thead>
                       <tr>
                         <th>STAFF NAME</th>
                         <th>ROLE</th>
                         <th>DEPARTMENT</th>
                         <th style={{textAlign:'center'}}>OUTLINES CREATED</th>
                         <th style={{textAlign:'right'}}>STATUS</th>
                       </tr>
                     </thead>
                     <tbody>
                       {stats.topPerformers.length > 0 ? (
                           stats.topPerformers.map((person, i) => (
                             <tr key={i}>
                               <td style={{fontWeight:'600', color:'#334155'}}>
                                 <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                                   <div style={{width:'36px', height:'36px', background:'#e0e7ff', color:'#4338ca', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.9rem', fontWeight:'bold'}}>
                                     {person.name.charAt(0).toUpperCase()}
                                   </div>
                                   {person.name}
                                 </div>
                               </td>
                               <td><span style={{background:'#f3f4f6', padding:'2px 8px', borderRadius:'4px', fontSize:'12px', color:'#4b5563', fontWeight:'500'}}>{person.role}</span></td>
                               <td>{person.dept}</td>
                               <td style={{textAlign:'center'}}>
                                 <span style={{background:'#dbeafe', color:'#1e40af', padding:'4px 12px', borderRadius:'20px', fontSize:'0.9rem', fontWeight:'bold'}}>
                                   {person.publications}
                                 </span>
                               </td>
                               <td style={{textAlign:'right'}}>
                                  <span style={{color:'#16a34a', fontWeight:'600', fontSize:'0.85rem', display:'inline-flex', alignItems:'center', gap:'4px'}}>
                                    <span style={{width:'8px', height:'8px', background:'#16a34a', borderRadius:'50%'}}></span> Active
                                  </span>
                               </td>
                             </tr>
                           ))
                       ) : (
                           <tr><td colSpan="5" style={{textAlign:'center', color:'#999', padding:'30px'}}>No outlines created yet.</td></tr>
                       )}
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
