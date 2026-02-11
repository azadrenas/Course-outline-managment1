import React, { useState } from "react";

export default function CourseDetails() {
  // --- 1. STATE (DURUM) YÖNETİMİ ---
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false); // Modal açık mı?
  const [rejectionReason, setRejectionReason] = useState(""); // Red sebebi
  const [selectedOutlineId, setSelectedOutlineId] = useState(null); // Hangi ders?
  const [isLoading, setIsLoading] = useState(false);

  // ÖRNEK VERİ (Test için)
  const [outlines, setOutlines] = useState([
    { id: 1, instructor: "Dr. Ahmet Yılmaz", updated: "2023-10-25", status: "submitted", rejection_reason: null }, 
    { id: 2, instructor: "Prof. Mehmet Demir", updated: "2023-10-24", status: "vice_approved", rejection_reason: null }, 
    { id: 3, instructor: "Dr. Ayşe Kaya", updated: "2023-10-20", status: "approved", rejection_reason: null },
  ]);

  // --- 2. FONKSİYONLAR ---

  // [ÖNEMLİ] Bu fonksiyon sadece pencereyi açar, işlem yapmaz!
  const handleRejectClick = (outlineId) => {
    console.log("Reject butonuna basıldı. Pencere açılıyor..."); // Kontrol için log
    setSelectedOutlineId(outlineId);
    setRejectionReason(""); 
    setIsRejectModalOpen(true); 
  };

  // Bu fonksiyon Backend'e veriyi yollar
  const submitReject = async () => {
    if (!rejectionReason || rejectionReason.trim() === "") {
      alert("Lütfen bir red sebebi yazınız!");
      return;
    }

    setIsLoading(true);

    // URL birleştirme (String concatenation ile hata riskini önledik)
    const url = "http://127.0.0.1:8000/api/reject_outline/" + selectedOutlineId + "/";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
          // "Authorization": "Bearer " + token  <-- Token varsa burayı aç
        },
        body: JSON.stringify({
          reason: rejectionReason 
        })
      });

      if (response.ok) {
        alert("✅ Ders reddedildi ve notunuz hocaya iletildi.");
        
        // Tabloyu güncelle
        setOutlines((prev) => 
          prev.map((item) => {
            if (item.id === selectedOutlineId) {
              return { ...item, status: "rejected", rejection_reason: rejectionReason };
            }
            return item;
          })
        );
        setIsRejectModalOpen(false); // Pencereyi kapat
      } else {
        alert("❌ İşlem başarısız. Hata kodu: " + response.status);
      }
    } catch (error) {
      console.error("Hata:", error);
      alert("❌ Sunucuya bağlanılamadı.");
    } finally {
      setIsLoading(false);
    }
  };

  // Onaylama Fonksiyonu
  const handleApproveClick = async (outlineId) => {
    const confirmApprove = window.confirm("Bu dersi onaylamak istiyor musunuz?");
    if (!confirmApprove) return;

    const url = "http://127.0.0.1:8000/api/approve_outline/" + outlineId + "/";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message || "✅ Onaylandı.");
        setOutlines((prev) => 
          prev.map((item) => item.id === outlineId ? { ...item, status: data.status } : item)
        );
      } else {
        alert("Hata oluştu.");
      }
    } catch (error) {
      console.error(error);
      alert("Bağlantı hatası.");
    }
  };

  // --- 3. ARAYÜZ (JSX) ---
  return (
    <div className="layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src="https://i.imgur.com/1u3JvFM.png" className="sidebar-logo-img" alt="FIU Logo" />
        </div>
        <div className="nav-section-title">MAIN</div>
        <a href="/dashboard" className="nav-link">Dashboard</a>
        <div className="nav-section-title">ACADEMIC</div>
        <a href="/course" className="nav-link">Courses</a>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main">
        <div className="topbar">
          <div className="topbar-title">Course Details</div>
          <div className="topbar-right"><span className="badge">Admin</span></div>
        </div>

        <section className="table-card" style={{ marginTop: "20px" }}>
          <div className="table-card-header">
            <div className="table-title">Course Outlines</div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Instructor</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {outlines.map((outline) => (
                <tr key={outline.id}>
                  <td>{outline.instructor}</td>
                  <td>
                    <span className={`px-2 py-1 rounded text-xs text-white 
                      ${outline.status === 'approved' ? 'bg-green-500' : 
                        outline.status === 'rejected' ? 'bg-red-600' : 
                        'bg-blue-500'}`}>
                      {outline.status}
                    </span>
                    {/* Red Sebebi Varsa Göster */}
                    {outline.status === 'rejected' && outline.rejection_reason && (
                        <div style={{ marginTop: '5px', fontSize: '12px', color: 'red' }}>
                           Not: {outline.rejection_reason}
                        </div>
                    )}
                  </td>
                  <td>
                    {/* Sadece Bekleyenlerde Buton Göster */}
                    {(outline.status === 'submitted' || outline.status === 'vice_approved') && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleApproveClick(outline.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                        >
                          Approve
                        </button>

                        {/* REJECT BUTTON - ARTIK DİREKT İŞLEM YAPMAZ, MODAL AÇAR */}
                        <button 
                          onClick={() => handleRejectClick(outline.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      {/* --- MODAL (POPUP PENCERE) --- */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 border border-gray-200">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Dersi Reddet</h3>
            <p className="mb-2 text-sm text-gray-600">
              Lütfen red sebebini yazınız. (Zorunlu)
            </p>

            <textarea
              className="w-full border border-gray-300 p-2 rounded mb-4 h-32"
              placeholder="Örn: Kaynakça eksik..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
              >
                İptal
              </button>
              
              {/* ASIL API İSTEĞİNİ YAPAN BUTON BU */}
              <button 
                onClick={submitReject}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                {isLoading ? "Yollanıyor..." : "Reddet ve Gönder"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
