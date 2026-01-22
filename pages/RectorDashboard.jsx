// src/pages/RectorDashboard.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import api from "../api"; 
import "../styles/fiu-dashboard.css"; 
// GRAFİK KÜTÜPHANESİ
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LabelList } from 'recharts';

export default function RectorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // --- STATE ---
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    draft: 0
  });
  const [approvedCourses, setApprovedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // --- KESİN ÇÖZÜM: HARD LOGOUT FUNCTION (Eklendi) ---
  const handleForceLogout = (e) => {
      // Olası event hatalarını engelle
      if(e && e.preventDefault) e.preventDefault();
      
      // 1. Context içindeki logout'u çağır
      if(logout) logout();

      // 2. LocalStorage'ı manuel temizle (Garanti olsun)
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      // 3. Tarayıcıyı zorla Login'e fırlat
      window.location.href = "/login";
  };

  // --- VERİ ÇEKME ---
  const fetchData = async () => {
    try {
        setLoading(true);
        const response = await api.get("/api/outlines/");
        const allCourses = Array.isArray(response.data) ? response.data : [];

        // İstatistik Hesaplama
        const approved = allCourses.filter(c => c.status === 'approved').length;
        const pending = allCourses.filter(c => c.status === 'submitted' || c.status === 'vice_approved').length;
        const draft = allCourses.filter(c => !c.status || c.status === 'draft' || c.status === 'rejected').length;

        setStats({
            total: allCourses.length,
            approved,
            pending,
            draft
        });

        // Tablo için sadece onaylanmışları filtrele
        setApprovedCourses(allCourses.filter(c => c.status === 'approved'));

    } catch (error) {
        console.error("Rector data error:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- GRAFİK VERİLERİ ---
  
  // 1. Status Distribution (BAR CHART VERİSİ)
  const barData = [
    { name: 'Approved', count: stats.approved, fill: '#059669' }, // Yeşil
    { name: 'Pending', count: stats.pending, fill: '#d97706' },   // Turuncu
    { name: 'Draft/Reject', count: stats.draft, fill: '#94a3b8' }, // Gri
  ];

  // 2. Approval Rate (Pie Chart)
  const approvalRate = stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0;
  const pieData = [
    { name: 'Approved', value: stats.approved },
    { name: 'Others', value: stats.total - stats.approved },
  ];
  const PIE_COLORS = ['#3b82f6', '#e5e7eb']; // Mavi ve Gri

  const handleView = (course) => {
      navigate("/create-outline", { state: { courseToEdit: course, readOnly: true } });
  };

  return (
    <div className="fiu-shell">
      {/* SIDEBAR */}
      <aside className="fiu-sidebar">
        <div className="fiu-brand">FIU SYSTEM</div>
        <div className="fiu-nav-section">
            <div className="fiu-nav-label">RECTORATE</div>
            
            {/* 1. University Overview (AKTİF) */}
            <div className="fiu-nav active">
                <span className="fiu-nav-ico">📈</span> University Overview
            </div>
            
            {/* 2. Faculties (LİNK) */}
            <Link to="/rector/faculties" className="fiu-nav" style={{ textDecoration: 'none', color: 'inherit' }}>
                <span className="fiu-nav-ico">🏢</span> Faculties
            </Link>

            {/* 3. Staff Stats (LİNK) */}
            <Link to="/rector/staff-stats" className="fiu-nav" style={{ textDecoration: 'none', color: 'inherit' }}>
                <span className="fiu-nav-ico">👥</span> Staff Stats
            </Link>
        </div>
        <div style={{marginTop: 'auto'}}>
            {/* LOGOUT GÜNCELLENDİ: handleForceLogout kullanıldı */}

        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="fiu-main">
        <div className="fiu-topbar">
            <div>
                <div className="fiu-page-title">Rectorate View</div>
                <div className="fiu-muted">University Academic Overview</div>
            </div>
            
            {/* User Profile */}
            <div className="fiu-userbox" style={{position:'relative', cursor:'pointer'}} onClick={() => setShowProfileMenu(!showProfileMenu)}>
                <div className="fiu-pill" style={{background:'#f3e8ff', color:'#6b21a8', borderColor:'#e9d5ff'}}>Rector Office</div>
                <div className="fiu-avatar" style={{background:'#6b21a8'}}>R</div>
                {showProfileMenu && (
                    <div style={{position: "absolute", top: "50px", right: "0", background: "white", border: "1px solid #e5e7eb", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", padding: "6px", width: "140px", zIndex: 999}}>
                        {/* LOGOUT GÜNCELLENDİ: handleForceLogout kullanıldı */}
                        <button onClick={handleForceLogout} style={{width: "100%", textAlign: "left", padding: "8px 12px", background: "transparent", border: "none", color: "#ef4444", fontWeight: "bold", cursor: "pointer"}}>🚪 Logout</button>
                    </div>
                )}
            </div>
        </div>

        {/* --- KARTLAR (ÖZET) --- */}
        <div className="fiu-stats">
            <div className="fiu-card fiu-stat">
                <div><div className="fiu-stat-title">Total Courses</div><div className="fiu-stat-value">{stats.total}</div></div>
                <div className="fiu-icon-badge">📚</div>
            </div>
            <div className="fiu-card fiu-stat">
                <div><div className="fiu-stat-title">Approved Outlines</div><div className="fiu-stat-value">{stats.approved}</div></div>
                <div className="fiu-icon-badge" style={{color:'#059669'}}>✅</div>
            </div>
            <div className="fiu-card fiu-stat">
                <div><div className="fiu-stat-title">Pending Review</div><div className="fiu-stat-value">{stats.pending}</div></div>
                <div className="fiu-icon-badge" style={{color:'#d97706'}}>⏳</div>
            </div>
        </div>

        {/* --- GRAFİKLER --- */}
        <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:'20px', marginBottom:'30px', padding:'0 20px'}}>
            
            {/* 1. Bar Chart: Status Distribution */}
            <div className="fiu-card" style={{padding:'25px', height:'350px'}}>
                <h3 style={{marginTop:0, marginBottom:'20px', color:'#374151', fontSize:'16px'}}>Status Distribution</h3>
                <ResponsiveContainer width="100%" height="85%">
                    <BarChart 
                        data={barData} 
                        margin={{top: 20, right: 30, left: 20, bottom: 5}}
                        barCategoryGap={30} 
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="name" tick={{fontSize: 12, fontWeight: 600, fill: '#4b5563'}} axisLine={false} tickLine={false} dy={10} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius:'8px', border:'none', boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}} />
                        <Bar dataKey="count" radius={[8, 8, 0, 0]}> 
                            {barData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                            <LabelList dataKey="count" position="top" style={{ fill: '#6b7280', fontSize: '14px', fontWeight: 'bold' }} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* 2. Pie Chart: Approval Rate */}
            <div className="fiu-card" style={{padding:'25px', height:'350px', display:'flex', flexDirection:'column', alignItems:'center'}}>
                <h3 style={{marginTop:0, marginBottom:'10px', color:'#374151', fontSize:'16px', width:'100%', textAlign:'left'}}>Approval Rate</h3>
                <div style={{width:'100%', height:'220px', position:'relative'}}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%" cy="50%"
                                innerRadius={65} outerRadius={85}
                                startAngle={180} endAngle={0}
                                paddingAngle={0}
                                dataKey="value"
                                stroke="none"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{position:'absolute', top:'60%', left:'50%', transform:'translate(-50%, -50%)', textAlign:'center'}}>
                        <div style={{fontSize:'36px', fontWeight:'800', color:'#3b82f6', lineHeight:'1'}}>{approvalRate}%</div>
                        <div style={{fontSize:'12px', color:'#9ca3af', fontWeight:'500', marginTop:'5px'}}>COMPLETED</div>
                    </div>
                </div>
                <div style={{textAlign:'center', marginTop:'-20px'}}>
                    <p style={{fontSize:'13px', color:'#6b7280', margin:0}}>
                        <span style={{color:'#3b82f6', fontWeight:'bold'}}>{stats.approved}</span> approved out of <span style={{fontWeight:'bold'}}>{stats.total}</span>
                    </p>
                </div>
            </div>
        </div>

        {/* --- TABLO --- */}
        <div className="fiu-card fiu-table-card">
            <div className="fiu-table-head">
                <div className="fiu-chart-title">Officially Approved Outlines</div>
                <button onClick={fetchData} className="fiu-btn">Refresh ↻</button>
            </div>
            <div className="fiu-table-wrap">
                <table className="fiu-table">
                    <thead>
                        <tr>
                            <th>CODE</th><th>COURSE NAME</th><th>INSTRUCTOR</th><th>SEMESTER</th><th style={{textAlign:'right'}}>VIEW</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (<tr><td colSpan="5" style={{textAlign:'center', padding:'20px'}}>Loading...</td></tr>) : approvedCourses.length === 0 ? (<tr><td colSpan="5" style={{textAlign:'center', padding:'40px', color:'#999'}}>No published courses yet.</td></tr>) : (
                            approvedCourses.map((course) => (
                                <tr key={course.id}>
                                    <td className="fiu-strong">{course.course_code || course.code}</td>
                                    <td>{course.course_name || course.title}</td>
                                    <td>{course.lecturer || "Instructor"}</td>
                                    <td>{course.semester}</td>
                                    <td style={{textAlign:'right'}}>
                                        <button onClick={() => handleView(course)} className="fiu-btn" style={{background:'#fff', border:'1px solid #ddd'}}>👁 View Details</button>
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