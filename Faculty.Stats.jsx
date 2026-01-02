// src/pages/FacultyStats.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api"; 
import "../styles/fiu-dashboard.css"; 
// Grafik Kütüphanesi
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function FacultyStats() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // İstatistik Verileri
  const [stats, setStats] = useState({
    totalCourses: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    deptData: [] 
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
        setLoading(true);
        const response = await api.get("/api/outlines/");
        const courses = Array.isArray(response.data) ? response.data : [];

        // --- 1. GENEL SAYILAR ---
        const approvedCount = courses.filter(c => c.status === 'approved').length;
        const pendingCount = courses.filter(c => c.status === 'submitted' || c.status === 'vice_approved').length;
        const rejectedCount = courses.filter(c => c.status === 'rejected').length;

        // --- 2. DEPARTMAN BAZLI VERİ HAZIRLAMA ---
        const deptMap = {};

        courses.forEach(c => {
            const deptName = c.department_name || "General";
            if (!deptMap[deptName]) {
                deptMap[deptName] = { name: deptName, Total: 0, Approved: 0, Pending: 0 };
            }
            deptMap[deptName].Total += 1;
            if (c.status === 'approved') deptMap[deptName].Approved += 1;
            else if (c.status !== 'rejected') deptMap[deptName].Pending += 1;
        });

        const chartData = Object.values(deptMap);

        setStats({
            totalCourses: courses.length,
            approved: approvedCount,
            pending: pendingCount,
            rejected: rejectedCount,
            deptData: chartData
        });

    } catch (error) {
        console.error("Stats error:", error);
    } finally {
        setLoading(false);
    }
  };

  // Pie Chart Verisi
  const pieData = [
    { name: 'Approved', value: stats.approved },
    { name: 'Pending', value: stats.pending },
    { name: 'Rejected', value: stats.rejected },
  ];

  return (
    <div className="fiu-shell">
      {/* SIDEBAR - DEAN */}
      <aside className="fiu-sidebar">
        <div className="fiu-brand">FIU SYSTEM</div>
        <div className="fiu-nav-section">
            <div className="fiu-nav-label">Dean's Office</div>
            
            <div onClick={() => navigate('/dean')} className="fiu-nav" style={{cursor:'pointer'}}>
                <span className="fiu-nav-ico">✍️</span> Final Approvals
            </div>
            
            {/* AKTİF SAYFA */}
            <div className="fiu-nav active" style={{cursor:'pointer'}}>
                <span className="fiu-nav-ico">📊</span> Faculty Stats
            </div>
            
            <div onClick={() => navigate('/dean/programs')} className="fiu-nav" style={{cursor:'pointer'}}>
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
        </div>
      </aside>

      <main className="fiu-main">
        <div className="fiu-topbar">
          <div>
            <div className="fiu-page-title">Faculty Statistics</div>
            <div className="fiu-muted">Real-time data visualization</div>
          </div>
          
          <div 
                className="fiu-userbox" 
                style={{position: 'relative', cursor: 'pointer'}}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
                <div className="fiu-pill" style={{background:'#e0e7ff', color:'#3730a3', borderColor:'#c7d2fe'}}>
                    {user?.name || "Dean"}
                </div>
                <div className="fiu-avatar" style={{background:'#3730a3'}}>D</div>

                {showProfileMenu && (
                    <div style={{
                        position: 'absolute', top: '120%', right: 0,
                        background: 'white', border: '1px solid #e5e7eb',
                        borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                        padding: '8px', zIndex: 50, minWidth: '150px'
                    }}>
                        <button 
                            onClick={handleForceLogout} 
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
        </div>

        {/* --- ÖZET KARTLARI --- */}
        <div className="fiu-stats" style={{marginBottom:'30px'}}>
            <div className="fiu-card fiu-stat">
                <div><div className="fiu-stat-title">Total Courses</div><div className="fiu-stat-value">{stats.totalCourses}</div></div>
                <div className="fiu-icon-badge">📚</div>
            </div>
            <div className="fiu-card fiu-stat">
                <div><div className="fiu-stat-title">Fully Approved</div><div className="fiu-stat-value" style={{color:'#059669'}}>{stats.approved}</div></div>
                <div className="fiu-icon-badge" style={{background:'#d1fae5', color:'#059669'}}>✅</div>
            </div>
            <div className="fiu-card fiu-stat">
                <div><div className="fiu-stat-title">Pending Action</div><div className="fiu-stat-value" style={{color:'#d97706'}}>{stats.pending}</div></div>
                <div className="fiu-icon-badge" style={{background:'#fef3c7', color:'#d97706'}}>⏳</div>
            </div>
            <div className="fiu-card fiu-stat">
                <div><div className="fiu-stat-title">Completion Rate</div><div className="fiu-stat-value">{stats.totalCourses > 0 ? Math.round((stats.approved / stats.totalCourses) * 100) : 0}%</div></div>
                <div className="fiu-icon-badge">📈</div>
            </div>
        </div>

        {/* --- GRAFİKLER ALANI --- */}
        <div style={{display:'grid', gridTemplateColumns: '2fr 1fr', gap:'20px', padding:'0 20px 20px 20px'}}>
            
            {/* 1. BAR CHART: DEPARTMAN PERFORMANSI */}
            <div className="fiu-card" style={{padding:'20px', height:'400px'}}>
                <h3 style={{marginTop:0, color:'#374151'}}>Department Outline Status</h3>
                <div style={{width:'100%', height:'320px'}}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.deptData} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip cursor={{fill: '#f3f4f6'}} />
                            <Legend />
                            <Bar dataKey="Approved" stackId="a" fill="#059669" name="Approved" barSize={50} />
                            <Bar dataKey="Pending" stackId="a" fill="#fbbf24" name="Pending" barSize={50} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 2. PIE CHART: GENEL DAĞILIM */}
            <div className="fiu-card" style={{padding:'20px', height:'400px'}}>
                <h3 style={{marginTop:0, color:'#374151'}}>Overall Status</h3>
                <div style={{width:'100%', height:'320px'}}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 0 ? '#059669' : index === 1 ? '#fbbf24' : '#ef4444'} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
      </main>
    </div>
  );
}
