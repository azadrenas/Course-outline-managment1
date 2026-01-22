import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; 
import "../styles/fiu-dashboard.css";

export default function CourseSection() {
  const [courses, setCourses] = useState([]); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- VERİ ÇEKME ---
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/api/outlines/"); 
        // Gelen veri dizi mi kontrol et, değilse boş dizi yap
        const safeData = Array.isArray(response.data) ? response.data : [];
        setCourses(safeData);
      } catch (error) {
        console.error("Kurslar yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // --- RENK VE STATÜ AYARLARI ---
  const getBadgeColor = (code) => {
    const colors = ["#1d4ed8", "#c8102e", "#059669", "#7c3aed", "#d97706"];
    const safeCode = code || "";
    const index = safeCode.length % colors.length;
    return colors[index];
  };

  const getStatusBadgeStyle = (status) => {
      if (status === 'approved' || status === 'published') return { bg: '#dcfce7', color: '#166534', label: 'APPROVED' };
      if (status === 'rejected') return { bg: '#fee2e2', color: '#991b1b', label: 'REJECTED' };
      if (status === 'vice_approved') return { bg: '#dbeafe', color: '#1e40af', label: 'DEAN REVIEW' };
      if (status === 'submitted') return { bg: '#fef3c7', color: '#92400e', label: 'PENDING' };
      return { bg: '#f3f4f6', color: '#374151', label: 'DRAFT' };
  };

  // --- SAYFA YÖNLENDİRME ---
  const handleViewOutline = (course) => {
    navigate("/create-outline", { state: { courseToEdit: course } });
  };

  // --- YÜKLENİYOR ---
  if (loading) {
    return (
      <div style={{textAlign:'center', padding:'40px', color:'#6b7280'}}>
        Loading courses...
      </div>
    );
  }

  // --- ANA GÖRÜNÜM ---
  return (
    <div className="course-section-container">
      
      {/* ÜST İSTATİSTİK KARTI */}
      <div className="fiu-stats" style={{marginBottom: '20px'}}>
         <div className="fiu-card fiu-stat">
            <div>
                <div className="fiu-stat-title">My Outlines</div>
                <div className="fiu-stat-value">{courses.length}</div>
            </div>
            <div className="fiu-icon-badge" style={{background:'#eff6ff', color:'#1d4ed8'}}>📂</div>
         </div>
      </div>

      <h3 className="fiu-section-title">My Course Outlines</h3>
      
      {courses.length === 0 ? (
        <p style={{color:'#6b7280'}}>No outlines created yet. Click "New Outline" to start.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
          
          {courses.map((course) => {
            // İsimlendirme Kontrolleri (Hata vermemesi için)
            const courseCode = course.course_code || course.code || "NO CODE";
            const courseName = course.course_name || course.title || course.name || "Unnamed Course";
            const semester = course.semester || "N/A";
            const ects = course.ects_credit || course.ects || "-";
            const credit = course.local_credit || course.localCredit || "-";

            // Renk ve Stil Hesaplama
            const cardColor = getBadgeColor(courseCode);
            const statusInfo = getStatusBadgeStyle(course.status);

            return (
              <div key={course.id} className="fiu-card" style={{ padding: '0', overflow: 'hidden', borderLeft: '5px solid ' + cardColor }}>
                
                {/* KART İÇERİĞİ */}
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                        <span style={{ 
                            background: cardColor, color: 'white', 
                            padding: '4px 8px', borderRadius: '4px', 
                            fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' 
                        }}>
                            {courseCode}
                        </span>
                        
                        <h3 style={{ margin: '10px 0 5px 0', fontSize: '18px', color: '#1f2937', fontWeight: 'bold' }}>
                            {courseName}
                        </h3>
                        
                        <div style={{ color: '#6b7280', fontSize: '14px' }}>
                           Semester: {semester}
                        </div>
                    </div>
                    
                    {/* Durum Badge */}
                    <div style={{ textAlign: 'right' }}>
                        <span style={{
                            padding: '5px 10px', borderRadius: '15px', fontSize: '11px', fontWeight:'bold',
                            background: statusInfo.bg,
                            color: statusInfo.color
                        }}>
                            {statusInfo.label}
                        </span>
                    </div>
                  </div>

                  <div style={{ marginTop: '15px', fontSize: '13px', color: '#4b5563' }}>
                    <strong>ECTS:</strong> {ects} | <strong>Credit:</strong> {credit}
                  </div>
                </div>

                {/* BUTON ALANI */}
                <div style={{ padding: '15px 20px', background: '#f9fafb', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '10px' }}>
                    <button 
                        onClick={() => handleViewOutline(course)}
                        style={{ 
                            flex: 1, padding: '10px', borderRadius: '6px', border: 'none', 
                            background: '#1f2937', cursor: 'pointer', fontWeight: '500', color: 'white', fontSize:'13px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                        }}
                    >
                        ✏️ View / Edit Course Outline
                    </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}