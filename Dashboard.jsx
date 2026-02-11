import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../api"; 
import CourseSection from "./CourseSection"; // DÜZELTİLDİ: Yan yana oldukları için ./ ile çağırıyoruz
import "../styles/fiu-dashboard.css"; 

import { 
  LayoutDashboard, Users, Building2, FilePlus, 
  ChevronLeft, LogOut, FileText, Clock, Globe 
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, instructors: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- Veri Çekme (Sadece istatistikler) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('outlines/');
        const data = response.data;
        
        const pendingCount = data.filter(o => o.status === 'draft' || o.status === 'pending').length;
        
        setStats({
            total: data.length,
            pending: pendingCount,
            instructors: 1 
        });
        setLoading(false);
      } catch (error) {
        console.error("Dashboard Veri Hatası:", error);
        setLoading(false);
        if (error.response && error.response.status === 401) {
            navigate('/login');
        }
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
      if(window.confirm("Çıkış yapmak istediğinize emin misiniz?")) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
      }
  };

  return (
    <div className="fiu-shell">
      {/* SIDEBAR */}
      <aside className="fiu-sidebar">
        <div className="fiu-brand">
          <img
            src="https://lms1.final.edu.tr/LMS/pluginfile.php/1/core_admin/logocompact/300x300/1633460467/ufulogomin.JPG"
            alt="FIU Logo"
            style={{ width: '100%', maxWidth: '120px', display:'block' }}
          />
        </div>

        <div className="fiu-nav-section">
            <div className="fiu-nav-label">Main</div>
            
            <NavLink to="/instructor" className={({ isActive }) => isActive ? "fiu-nav active" : "fiu-nav"}>
                <span className="fiu-nav-ico"><LayoutDashboard size={18} /></span>
                <span>Dashboard</span>
            </NavLink>
        </div>

        <div className="fiu-nav-section">
            <div className="fiu-nav-label">Academic</div>

            <NavLink to="/instructors" className={({ isActive }) => isActive ? "fiu-nav active" : "fiu-nav"}>
                <span className="fiu-nav-ico"><Users size={18} /></span>
                <span>Instructors</span>
            </NavLink>

            <NavLink to="/departments" className={({ isActive }) => isActive ? "fiu-nav active" : "fiu-nav"}>
                <span className="fiu-nav-ico"><Building2 size={18} /></span>
                <span>Departments</span>
            </NavLink>

            <NavLink to="/create-outline" className={({ isActive }) => isActive ? "fiu-nav active" : "fiu-nav"}>
                <span className="fiu-nav-ico"><FilePlus size={18} /></span>
                <span>New Outline</span>
            </NavLink>
        </div>

        <div className="fiu-nav-section" style={{ marginTop: 'auto' }}>
            <button onClick={handleLogout} className="fiu-nav" style={{ width:'100%', background:'transparent', border:'none', cursor:'pointer', color:'#dc2626' }}>
                <span className="fiu-nav-ico"><LogOut size={18} /></span>
                <span>Logout</span>
            </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="fiu-main">
        {/* TOPBAR */}
        <div className="fiu-topbar">
          <div>
            <div className="fiu-page-title">Dashboard</div>
            <div className="fiu-muted">Welcome back, Instructor</div>
          </div>

          <div className="fiu-userbox">
            <Globe size={20} color="#6b7280" />
            <span className="fiu-pill">Instructor</span>
            <div className="fiu-avatar">I</div>
          </div>
        </div>

        {/* İSTATİSTİKLER */}
        <div className="fiu-stats">
          <div className="fiu-card fiu-stat">
            <div>
                <div className="fiu-stat-title">Total Outlines</div>
                <div className="fiu-stat-value">{loading ? '-' : stats.total}</div>
            </div>
            <div className="fiu-icon-badge" style={{color:'#1d4ed8'}}>
                <FileText size={20}/>
            </div>
          </div>

          <div className="fiu-card fiu-stat">
             <div>
                <div className="fiu-stat-title">Active Instructors</div>
                <div className="fiu-stat-value">{loading ? '-' : stats.instructors}</div>
             </div>
             <div className="fiu-icon-badge" style={{color:'#059669'}}>
                <Users size={20}/>
             </div>
          </div>

          <div className="fiu-card fiu-stat">
             <div>
                <div className="fiu-stat-title">Pending Reviews</div>
                <div className="fiu-stat-value">{loading ? '-' : stats.pending}</div>
             </div>
             <div className="fiu-icon-badge" style={{color:'#d97706'}}>
                <Clock size={20}/>
             </div>
          </div>
        </div>

        {/* --- DERS LİSTESİ BİLEŞENİ --- */}
        <CourseSection />

      </main>
    </div>
  );
}
