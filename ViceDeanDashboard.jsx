// src/pages/ViceDeanDashboard.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
// useNavigate'i sildim veya bıraksam da kullanmayacağım, direkt browser yönlendirmesi yapıcam.
import { useNavigate } from "react-router-dom";
import api from "../api"; 
import "../styles/fiu-dashboard.css"; 

export default function ViceDeanDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // --- STATE YÖNETİMİ ---
  const [pendingReviews, setPendingReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal (Pencere) için State'ler
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- DROPDOWN STATE ---
  const [showDropdown, setShowDropdown] = useState(false);

  // --- VERİLERİ ÇEKME FONKSİYONU ---
  const fetchPendingOutlines = async () => {
    try {
        setLoading(true);
        const response = await api.get("/api/outlines/"); 
        
        const allCourses = Array.isArray(response.data) ? response.data : [];
        
        const filtered = allCourses.filter(c => c.status === "submitted");
        
        setPendingReviews(filtered);
    } catch (error) {
        console.error("Data fetch error:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingOutlines();
  }, []);

  // --- KESİN ÇÖZÜM: HARD LOGOUT FUNCTION ---
  const handleForceLogout = (e) => {
      e.preventDefault();
      e.stopPropagation();

      // 1. Önce AuthContext içindeki logout'u çağır (varsa)
      if(logout) logout();

      // 2. LocalStorage'ı manuel olarak da temizle (Garanti olsun)
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      // 3. React Router'ı (navigate) BOŞVER. Direkt tarayıcıyı yönlendir.
      // Bu komut sayfayı tamamen yeniler ve login'e atar. Kaçarı yok.
      window.location.href = "/login";
  };

  // --- ONAYLA (Approve) ---
  const handleApprove = async (id) => {
    if(window.confirm("Are you sure you want to approve this outline?")) {
        try {
            const url = "/api/outlines/" + id + "/approve/";
            await api.post(url);
            
            alert("✅ Course Approved! Forwarded to Dean.");
            fetchPendingOutlines(); 
        } catch (error) {
            console.error("Approval error:", error);
            alert("❌ An error occurred.");
        }
    }
  };

  const handleRejectClick = (id) => {
    setSelectedCourseId(id);
    setRejectionReason(""); 
    setIsRejectModalOpen(true); 
  };

  const submitReject = async () => {
    if (!rejectionReason || rejectionReason.trim() === "") {
        alert("Please enter a rejection reason!");
        return;
    }

    setIsSubmitting(true);

    try {
        const url = "/api/outlines/" + selectedCourseId + "/reject/";
        const taggedReason = "VICE::" + rejectionReason;

        await api.post(url, {
            reason: taggedReason
        });
        
        alert("🚫 Course Rejected. Reason sent to instructor.");
        
        setIsRejectModalOpen(false); 
        fetchPendingOutlines(); 
    } catch (error) {
        console.error("Rejection error:", error);
        alert("❌ An error occurred. Please try again.");
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
            <div className="fiu-nav-label">ACADEMIC ADMIN</div>
            
            <div className="fiu-nav active" style={{cursor:'pointer'}}>
                <span className="fiu-nav-ico">🔍</span> Review Outlines
            </div>
            
            <div onClick={() => navigate('/vice-dean/instructors')} className="fiu-nav" style={{cursor:'pointer'}}>
                <span className="fiu-nav-ico">👥</span> Instructors List
            </div>
            
            <div onClick={() => navigate('/vice-dean/departments')} className="fiu-nav" style={{cursor:'pointer'}}>
                <span className="fiu-nav-ico">🏢</span> Departments
            </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="fiu-main">
        <div className="fiu-topbar">
          <div>
            <div className="fiu-page-title">Vice Dean Panel</div>
            <div className="fiu-muted">Pending Reviews</div>
          </div>
          
          {/* USERBOX - LOGOUT MENÜSÜ */}
          <div 
            className="fiu-userbox"
            onClick={() => setShowDropdown(!showDropdown)} 
            style={{position: 'relative', cursor: 'pointer'}} 
          >
            <div className="fiu-pill" style={{background:'#dbeafe', color:'#1e40af'}}>
                {user?.name || "Vice Dean"}
            </div>
            
            <div className="fiu-avatar">VD</div>

            {/* AÇILIR MENÜ (DROPDOWN) */}
            {showDropdown && (
                <div style={{
                    position: 'absolute',
                    top: '120%',
                    right: 0,
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    padding: '8px',
                    zIndex: 50,
                    minWidth: '150px'
                }}>
                    <button 
                        onClick={handleForceLogout} // BURAYA DİKKAT: YENİ FONKSİYON
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            padding: '8px 12px',
                            fontSize: '14px',
                            color: '#ef4444', 
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            transition: 'background 0.2s'
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

        <div className="fiu-card fiu-table-card">
            <div className="fiu-table-head">
                <div className="fiu-chart-title">Incoming Course Outlines</div>
                <button onClick={fetchPendingOutlines} className="fiu-btn">Refresh ↻</button>
            </div>
            
            <div className="fiu-table-wrap">
                <table className="fiu-table">
                    <thead>
                        <tr>
                            <th>CODE</th>
                            <th>COURSE NAME</th>
                            <th>SEMESTER</th>
                            <th>STATUS</th>
                            <th style={{textAlign:'right'}}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{textAlign:'center', padding:'20px'}}>Loading...</td></tr>
                        ) : pendingReviews.length === 0 ? (
                            <tr><td colSpan="5" style={{textAlign:'center', padding:'40px', color:'#999'}}>✅ No pending outlines.</td></tr>
                        ) : (
                            pendingReviews.map((item) => (
                                <tr key={item.id}>
                                    <td className="fiu-strong">{item.course_code || item.code}</td>
                                    <td>{item.course_name || item.title}</td>
                                    <td>{item.semester}</td>
                                    <td><span className="fiu-badge-yellow">Waiting Approval</span></td>
                                    <td style={{textAlign:'right'}}>
                                        <button onClick={() => handleView(item)} style={{marginRight:'10px', padding:'6px 12px', cursor:'pointer'}}>View</button>
                                        
                                        <button onClick={() => handleApprove(item.id)} style={{marginRight:'5px', background:'#dcfce7', color:'#166534', border:'none', padding:'6px 12px', borderRadius:'4px', cursor:'pointer', fontWeight:'bold'}}>
                                            Approve
                                        </button>
                                        
                                        <button onClick={() => handleRejectClick(item.id)} style={{background:'#fee2e2', color:'#991b1b', border:'none', padding:'6px 12px', borderRadius:'4px', cursor:'pointer', fontWeight:'bold'}}>
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </main>

      {/* --- REJECT MODAL --- */}
      {isRejectModalOpen && (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
        }}>
          <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '8px',
              width: '400px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{marginTop: 0, marginBottom: '16px', fontSize: '1.25rem', fontWeight: 'bold'}}>Reject Course</h3>
            
            <p style={{marginBottom: '8px', fontSize: '0.875rem', color: '#666'}}>
              Please enter the rejection reason. This note will be sent to the instructor.
            </p>

            <textarea
              style={{
                  width: '100%',
                  height: '100px',
                  padding: '8px',
                  marginBottom: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  resize: 'none'
              }}
              placeholder="e.g., Missing references..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />

            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '8px'}}>
              <button 
                onClick={() => setIsRejectModalOpen(false)}
                style={{
                    padding: '8px 16px',
                    backgroundColor: '#e5e7eb',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              
              <button 
                onClick={submitReject}
                disabled={isSubmitting}
                style={{
                    padding: '8px 16px',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    opacity: isSubmitting ? 0.7 : 1
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
