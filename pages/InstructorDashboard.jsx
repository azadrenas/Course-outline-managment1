import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext";
import { useCourses } from "../context/CourseContext";
import "../styles/fiu-dashboard.css";
// GRAFİK KÜTÜPHANESİ
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// CourseSection bileşenini çağırıyoruz
import CourseSection from "./CourseSection";

export default function InstructorDashboard() {
  const { user, logout } = useAuth();
  const { courses, fetchData } = useCourses();
  const navigate = useNavigate();
  const location = useLocation(); 

  const [activeTab, setActiveTab] = useState("dashboard");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  // --- TAB YÖNETİMİ ---
  useEffect(() => {
    if (location.state && location.state.tab) {
        setActiveTab(location.state.tab);
    }
  }, [location]);

  // --- 🔥 GÜNCELLENMİŞ GARANTİ LOGOUT FONKSİYONU 🔥 ---
  const handleLogout = (e) => {
      // 1. Linkin varsayılan davranışını durdur
      if(e) e.preventDefault();

      // 2. Context içindeki logout fonksiyonunu çalıştır
      if (logout) logout();
      
      // 3. Tarayıcı hafızasındaki (LocalStorage) HER ŞEYİ sil
      localStorage.clear(); 
      // Alternatif olarak tek tek de silebilirsin ama clear() en temizidir:
      // localStorage.removeItem("user");
      // localStorage.removeItem("access_token");

      // 4. Menüyü kapat
      setShowProfileMenu(false);

      // 5. 🔥 KRİTİK NOKTA: React Router (navigate) yerine window.location kullanıyoruz.
      // Bu sayede sayfa tamamen yenilenir ve hafıza boşalır.
      window.location.href = "/";
  };

  const handleEdit = (course) => {
     navigate("/create-outline", { state: { courseToEdit: course } });
  };

  const allCourses = courses || [];
   
  const filteredCourses = allCourses.filter((c) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      const code = (c.course_code || c.code || "").toLowerCase();
      const name = (c.course_name || c.title || c.name || "").toLowerCase();
      return code.includes(term) || name.includes(term);
  });

  // --- İSTATİSTİKLER ---
  const publishedCount = allCourses.filter(c => c.status === "published" || c.status === "approved").length;
  const pendingCount = allCourses.filter(c => c.status === "submitted" || c.status === "vice_approved").length;
  const draftCount = allCourses.filter(c => !c.status || c.status === "draft").length;
  const rejectedCount = allCourses.filter(c => c.status === "rejected").length;

  // --- GRAFİK VERİLERİ ---
  const pieData = [
    { name: 'Published', value: publishedCount },
    { name: 'Pending', value: pendingCount },
    { name: 'Draft', value: draftCount },
    { name: 'Rejected', value: rejectedCount },
  ];
  const COLORS = ['#059669', '#d97706', '#9ca3af', '#ef4444'];

  const barData = [
    { name: 'Published', count: publishedCount },
    { name: 'Pending', count: pendingCount },
    { name: 'Draft', count: draftCount },
    { name: 'Rejected', count: rejectedCount },
  ];

  const getStatusBadge = (status) => {
    if (status === "published" || status === "approved") return <span className="fiu-badge-green">Published</span>;
    if (status === "vice_approved") return <span className="fiu-badge-blue">Dean Review</span>;
    if (status === "submitted" || status === "pending_approval") return <span className="fiu-badge-yellow">Pending</span>;
    if (status === "rejected") return <span className="fiu-badge-red">Rejected</span>;
    return <span className="fiu-badge-gray">Draft</span>;
  };

  const parseRejectionInfo = (reason) => {
      if (!reason) return { role: 'MANAGEMENT', text: '-' };
      if (reason.startsWith("DEAN::")) return { role: 'DEAN', text: reason.replace("DEAN::", "") };
      if (reason.startsWith("VICE::")) return { role: 'VICE DEAN', text: reason.replace("VICE::", "") };
      return { role: 'MANAGEMENT', text: reason };
  };

  return (
    <div className="fiu-shell">
      <aside className="fiu-sidebar">
        <div className="fiu-brand">FIU SYSTEM</div>
        <div className="fiu-nav-section">
            <div className="fiu-nav-label">MAIN</div>
            
            <div 
                onClick={() => setActiveTab("dashboard")} 
                className={activeTab === "dashboard" ? "fiu-nav active" : "fiu-nav"} 
                style={{cursor: "pointer"}}
            >
                <span className="fiu-nav-ico">⊞</span> Dashboard
            </div>
            
            <div 
                onClick={() => setActiveTab("sections")} 
                className={activeTab === "sections" ? "fiu-nav active" : "fiu-nav"} 
                style={{cursor: "pointer"}}
            >
                <span className="fiu-nav-ico">📚</span> Course Sections
            </div>
            
            <div className="fiu-nav-label" style={{marginTop: "20px"}}>ACADEMIC</div>
            
            <div onClick={() => navigate("/instructors")} className="fiu-nav" style={{cursor: "pointer"}}>
                <span className="fiu-nav-ico">👥</span> Instructors
            </div>
            
            <div onClick={() => navigate("/departments")} className="fiu-nav" style={{cursor: "pointer"}}>
                <span className="fiu-nav-ico">🏢</span> Departments
            </div>
            
            <div onClick={() => navigate("/create-outline")} className="fiu-nav" style={{marginTop: "20px", color: "#c8102e", fontWeight: "bold", background: "#fee2e2", border: "1px solid #fecaca", cursor: "pointer"}}>
                <span className="fiu-nav-ico">📝</span> + New Outline
            </div>
        </div>
      </aside>

      <main className="fiu-main">
        <div className="fiu-topbar">
          <div><div className="fiu-page-title">{activeTab === "dashboard" ? "Dashboard Overview" : "Course Sections"}</div><div className="fiu-muted">Academic Staff Panel</div></div>
          
          {/* USER MENU ALANI */}
          <div className="fiu-userbox" style={{position: "relative"}}>
            <div className="fiu-pill" style={{background: "#eff6ff", color: "#1d4ed8", borderColor: "#dbeafe"}}>{user?.name || "Instructor"}</div>
            <div className="fiu-avatar" onClick={() => setShowProfileMenu(!showProfileMenu)} style={{cursor: "pointer", background: "#1d4ed8"}}>{user?.name ? user.name.charAt(0) : "I"}</div>
            
            {showProfileMenu && (
                <div style={{position: "absolute", top: "50px", right: "0", background: "white", border: "1px solid #e5e7eb", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", padding: "6px", width: "140px", zIndex: 999}}>
                    <button 
                        onClick={(e) => handleLogout(e)} 
                        style={{width: "100%", textAlign: "left", padding: "8px 12px", background: "transparent", border: "none", color: "#ef4444", fontWeight: "bold", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px"}}
                    >
                        🚪 Logout
                    </button>
                </div>
            )}
          </div>
        </div>

        {activeTab === "dashboard" && (
            <div>
                {/* --- İSTATİSTİK KARTLARI --- */}
                <div className="fiu-stats">
                    <div className="fiu-card fiu-stat"><div><div className="fiu-stat-title">Total Outlines</div><div className="fiu-stat-value">{allCourses.length}</div></div><div className="fiu-icon-badge">📄</div></div>
                    <div className="fiu-card fiu-stat"><div><div className="fiu-stat-title">Pending Review</div><div className="fiu-stat-value">{pendingCount}</div></div><div className="fiu-icon-badge" style={{color: "#d97706"}}>⏳</div></div>
                    <div className="fiu-card fiu-stat"><div><div className="fiu-stat-title">Published</div><div className="fiu-stat-value">{publishedCount}</div></div><div className="fiu-icon-badge" style={{color: "#059669"}}>✅</div></div>
                </div>

                {/* --- GRAFİKLER --- */}
                <div className="fiu-grid-2" style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:'20px', marginBottom:'20px'}}>
                    
                    {/* 1. Bar Chart (Activity) */}
                    <div className="fiu-card fiu-chart" style={{padding:'20px', height:'350px'}}>
                        <div className="fiu-chart-header" style={{marginBottom:'10px'}}>
                            <div className="fiu-chart-title">Weekly Activity (Status Distribution)</div>
                        </div>
                        <div style={{width:'100%', height:'280px'}}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData} margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{fill: '#f3f4f6'}} />
                                    <Bar dataKey="count" fill="#c8102e" barSize={40} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 2. Pie Chart (Status Overview) */}
                    <div className="fiu-card fiu-chart" style={{padding:'20px', height:'350px'}}>
                        <div className="fiu-chart-header" style={{marginBottom:'10px'}}>
                            <div className="fiu-chart-title">Status Overview</div>
                        </div>
                        <div style={{width:'100%', height:'280px'}}>
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
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* --- DERS TABLOSU --- */}
                <div className="fiu-card fiu-table-card">
                    <div className="fiu-table-head">
                        <div className="fiu-chart-title">Recent Course Outlines</div>
                        <div style={{display:'flex', gap:'10px'}}>
                            <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{padding: '5px 10px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '13px', outline: 'none'}} />
                            <button onClick={() => navigate("/create-outline")} className="fiu-btn">+ New</button>
                        </div>
                    </div>
                    
                    <div className="fiu-table-wrap">
                        <table className="fiu-table">
                            <thead>
                                <tr>
                                    <th>CODE</th>
                                    <th>COURSE NAME</th>
                                    <th>SEMESTER</th>
                                    <th>STATUS</th>
                                    <th>FEEDBACK</th>
                                    <th style={{textAlign:'right'}}>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCourses.length > 0 ? (
                                    filteredCourses.map((course) => {
                                        const { role, text } = parseRejectionInfo(course.rejection_reason);
                                        return (
                                            <tr key={course.id}>
                                                <td className="fiu-strong">{course.course_code || course.code}</td>
                                                <td style={{fontWeight:'500', color:'#111'}}>{course.course_name || course.title || course.name || "-"}</td>
                                                <td>{course.semester}</td>
                                                <td>{getStatusBadge(course.status)}</td>
                                                <td style={{fontSize: "12px"}}>
                                                    {course.status === "rejected" && text ? (
                                                        <div style={{background: '#fef2f2', color: '#b91c1c', border: '1px solid #fca5a5', padding: '8px 10px', borderRadius: '6px', maxWidth: '220px'}}>
                                                            <div style={{borderBottom:'1px solid #fecaca', paddingBottom:'4px', marginBottom:'4px', fontWeight:'bold', fontSize:'11px', textTransform:'uppercase'}}>REJECTED BY: {role}</div>
                                                            <div style={{lineHeight: '1.4', whiteSpace: 'pre-wrap'}}>{text}</div>
                                                        </div>
                                                    ) : (<span style={{color: '#9ca3af'}}>-</span>)}
                                                </td>
                                                <td style={{textAlign:'right'}}>
                                                    <button onClick={() => handleEdit(course)} style={{background: '#eff6ff', color: '#1d4ed8', border: 'none', padding: '5px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', cursor: 'pointer'}}>Edit</button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr><td colSpan="6" style={{textAlign:'center', padding:'20px', color:'#999'}}>No courses found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

        {activeTab === "sections" && <CourseSection />} 
      </main>
    </div>
  );
}