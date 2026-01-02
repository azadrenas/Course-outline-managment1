 // src/pages/DeanDashboard.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api"; 
import "../styles/fiu-dashboard.css"; 

export default function DeanDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // --- STATE YÖNETİMİ ---
  const [waitingSign, setWaitingSign] = useState([]); 
  const [publishedCount, setPublishedCount] = useState(0); 
  const [loading, setLoading] = useState(true);

  // --- MODAL (PENCERE) İÇİN STATELER ---
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- DROPDOWN MENÜ ---
  const [showDropdown, setShowDropdown] = useState(false);

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

  // --- VERİLERİ ÇEKME ---
  const fetchData = async () => {
    try {
        setLoading(true);
        const response = await api.get("/api/outlines/");
        const allCourses = Array.isArray(response.data) ? response.data : [];

        // 1. İmza Bekleyenler: Statüsü 'vice_approved' olanlar
        const waiting = allCourses.filter(c => c.status === "vice_approved");
        setWaitingSign(waiting);

        // 2. Yayınlanmış (Final): Statüsü 'approved' olanlar
        const published = allCourses.filter(c => c.status === "approved");
        setPublishedCount(published.length);

    } catch (error) {
        console.error("Veri çekme hatası:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- ONAYLAMA İŞLEMİ (Publish) ---
  const handleFinalSign = async (id) => {
    if(window.confirm("Confirm final signature and publish this course?")) {
        try {
            await api.post(`/api/outlines/${id}/approve/`);
            alert("✅ Course is OFFICIALLY PUBLISHED! 🌍");
            fetchData();
        } catch (error) {
            console.error("Hata:", error);
            alert("❌ İşlem başarısız. Lütfen konsolu kontrol et.");
        }
    }
  };

  // --- REDDETME PENCERESİNİ AÇMA ---
  const handleRejectClick = (id) => {
    setSelectedCourseId(id);
    setRejectionReason(""); // Temizle
    setIsRejectModalOpen(true); // Modalı aç
  };

  // --- RED İŞLEMİNİ GÖNDERME (Submit Reject) ---
  const submitReject = async () => {
    if (!rejectionReason || rejectionReason.trim() === "") {
        alert("Please enter a rejection reason!");
        return;
    }

    setIsSubmitting(true);

    try {
        // Şifreyi burada ekliyoruz: "DEAN::"
        const taggedReason = "DEAN::" + rejectionReason;

        await api.post(`/api/outlines/${selectedCourseId}/reject/`, { 
            reason: taggedReason 
        });
        
        alert("🚫 Course returned to Instructor with your note.");
        
        setIsRejectModalOpen(false); // Pencereyi kapat
        fetchData(); // Listeyi yenile
    } catch (error) {
        console.error("Hata:", error);
        alert("❌ İşlem başarısız. Mesaj gönderilemedi.");
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const handleView = (course) => {
      navigate("/create-outline", { state: { courseToEdit: course } });
  };

  return (
    <div className="fiu-shell">
      
      {/* SIDEBAR */}
      <aside className="fiu-sidebar">
        <div className="fiu-brand">FIU SYSTEM</div>
        <div className="fiu-nav-section">
            <div className="fiu-nav-label">Dean's Office</div>
            <div className="fiu-nav active" style={{cursor:'pointer'}}><span className="fiu-nav-ico">✍️</span> Final Approvals</div>
            <div onClick={() => navigate('/dean/stats')} className="fiu-nav" style={{cursor:'pointer'}}><span className="fiu-nav-ico">📊</span> Faculty Stats</div>
            <div onClick={() => navigate('/dean/programs')} className="fiu-nav" style={{cursor:'pointer'}}><span className="fiu-nav-ico">🎓</span> Programs</div>
            <div className="fiu-nav-label" style={{marginTop:'20px'}}>LISTS</div>
            <div onClick={() => navigate('/dean/instructors')} className="fiu-nav" style={{cursor:'pointer'}}><span className="fiu-nav-ico">👥</span> Instructors List</div>
            <div onClick={() => navigate('/dean/departments')} className="fiu-nav" style={{cursor:'pointer'}}><span className="fiu-nav-ico">🏢</span> Departments</div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="fiu-main">
        <div className="fiu-topbar">
            <div>
                <div className="fiu-page-title">Dean Dashboard</div>
                <div className="fiu-muted">Faculty of Engineering - Final Approval Panel</div>
            </div>
            
            {/* USERBOX & DROPDOWN */}
            <div 
                className="fiu-userbox" 
                style={{position: 'relative', cursor: 'pointer'}}
                onClick={() => setShowDropdown(!showDropdown)}
            >
                <div className="fiu-pill" style={{background:'#e0e7ff', color:'#3730a3', borderColor:'#c7d2fe'}}>
                    {user?.name || "Dean"}
                </div>
                <div className="fiu-avatar" style={{background:'#3730a3'}}>D</div>

                {/* LOGOUT MENÜSÜ */}
                {showDropdown && (
                    <div style={{
                        position: 'absolute', top: '120%', right: 0,
                        background: 'white', border: '1px solid #e5e7eb',
                        borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                        padding: '8px', zIndex: 50, minWidth: '150px'
                    }}>
                        <button 
                            onClick={handleForceLogout} // GÜNCELLENDİ: Burası artık handleForceLogout
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

        <div className="fiu-stats">
            <div className="fiu-card fiu-stat"><div><div className="fiu-stat-title">Waiting Signature</div><div className="fiu-stat-value">{waitingSign.length}</div></div><div className="fiu-icon-badge" style={{color:'#c8102e'}}>✍️</div></div>
            <div className="fiu-card fiu-stat"><div><div className="fiu-stat-title">Published</div><div className="fiu-stat-value">{publishedCount}</div></div><div className="fiu-icon-badge" style={{color:'#059669'}}>🌍</div></div>
            <div className="fiu-card fiu-stat"><div><div className="fiu-stat-title">Faculty Performance</div><div style={{marginTop:'8px', fontSize:'14px', fontWeight:'bold', color:'#3730a3'}}>98%</div></div><div className="fiu-icon-badge">📈</div></div>
        </div>

        <div className="fiu-card fiu-table-card">
            <div className="fiu-table-head">
                <div className="fiu-chart-title">Outlines Approved by Vice Dean</div>
                <button onClick={fetchData} className="fiu-btn" style={{background:'#fff', color:'#333', border:'1px solid #ddd', marginLeft:'auto'}}>Refresh ↻</button>
            </div>

            <div className="fiu-table-wrap">
                <table className="fiu-table">
                    <thead>
                        <tr>
                            <th>CODE</th><th>COURSE NAME</th><th>INSTRUCTOR</th><th>SEMESTER</th><th>STATUS</th><th style={{textAlign:'right'}}>OFFICIAL ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                             <tr><td colSpan="6" style={{textAlign:'center', padding:'20px'}}>Loading...</td></tr>
                        ) : waitingSign.length === 0 ? (
                            <tr><td colSpan="6" style={{textAlign:'center', padding:'40px', color:'#999'}}>✅ All cleared! No files waiting for signature.</td></tr>
                        ) : (
                            waitingSign.map((course) => (
                                <tr key={course.id}>
                                    <td className="fiu-strong">{course.course_code || course.code}</td>
                                    <td>{course.course_name || course.title}</td>
                                    <td>{course.lecturer || "Instructor"}</td>
                                    <td>{course.semester}</td>
                                    <td><span style={{padding:'4px 8px', borderRadius:'6px', background:'#e0e7ff', color:'#3730a3', fontSize:'11px', fontWeight:'700'}}>Ready for Sign</span></td>
                                    <td style={{textAlign:'right'}}>
                                        <div style={{display:'flex', gap:'8px', justifyContent:'flex-end'}}>
                                            <button onClick={() => handleView(course)} className="fiu-btn" style={{background:'#f3f4f6', color:'#333', border:'none'}}>View</button>
                                            <button onClick={() => handleFinalSign(course.id)} className="fiu-btn" style={{background:'#1e3a8a', color:'#fff', border:'none', fontWeight:'bold'}}>Sign & Publish</button>
                                            
                                            {/* REJECT BUTONU MODAL AÇAR */}
                                            <button onClick={() => handleRejectClick(course.id)} className="fiu-btn" style={{background:'#fee2e2', color:'#dc2626', border:'none'}}>Return</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </main>

      {/* --- REJECT MODAL (PENCERE) --- */}
      {isRejectModalOpen && (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div style={{
              backgroundColor: 'white', padding: '24px', borderRadius: '8px', width: '400px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{marginTop: 0, marginBottom: '16px', fontSize: '1.25rem', fontWeight: 'bold'}}>Reject Course</h3>
            
            <p style={{marginBottom: '8px', fontSize: '0.875rem', color: '#666'}}>
              Please enter the rejection reason. This note will be sent to the instructor (from Dean).
            </p>

            <textarea
              style={{
                  width: '100%', height: '100px', padding: '8px', marginBottom: '16px',
                  border: '1px solid #ddd', borderRadius: '4px', resize: 'none', fontFamily: 'inherit'
              }}
              placeholder="e.g., Missing references..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />

            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '8px'}}>
              <button 
                onClick={() => setIsRejectModalOpen(false)}
                style={{padding: '8px 16px', backgroundColor: '#e5e7eb', border: 'none', borderRadius: '4px', cursor: 'pointer'}}
              >
                Cancel
              </button>
              
              <button 
                onClick={submitReject}
                disabled={isSubmitting}
                style={{
                    padding: '8px 16px', backgroundColor: '#dc2626', color: 'white',
                    border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: isSubmitting ? 0.7 : 1
                }}
              >
                {isSubmitting ? "Sending..." : "Reject and Send"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
