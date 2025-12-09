import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img
            src="https://lms1.final.edu.tr/LMS/pluginfile.php/1/core_admin/logocompact/300x300/1633460467/ufulogomin.JPG"
            className="sidebar-logo-img"
            alt="FIU Logo"
          />
        </div>

        <button id="collapseBtn" className="collapse-btn">
          <i data-lucide="chevron-left"></i>
        </button>

        <div className="nav-section-title">MAIN</div>

        <a href="/dashboard" className="nav-link">
          <i data-lucide="layout-dashboard"></i>
          <span>Dashboard</span>
        </a>

        <div className="nav-section-title">ACADEMIC</div>

        <a href="/instructors" className="nav-link">
          <i data-lucide="users"></i>
          <span>Instructors</span>
        </a>

        <a href="/departments" className="nav-link">
          <i data-lucide="building-2"></i>
          <span>Departments</span>
        </a>

        <a href="/new_outline" className="nav-link">
          <i data-lucide="file-plus"></i>
          <span>New Course Outline</span>
        </a>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main">
        {/* TOPBAR */}
        <div className="topbar">
          <div>
            <div className="topbar-title">Course Outline Management</div>

            <div style={{ fontSize: "12px", color: "#6b7280" }}>
              Overview of outlines, instructors and departments
            </div>
          </div>

          <div className="topbar-right">
            <div className="lang-switch">🌐</div>

            <span className="badge">Admin</span>

            <div className="avatar-container">
              <div className="avatar">A</div>

              <div className="avatar-menu" id="avatarMenu">
                <div className="menu-item">Profile</div>
                <div className="menu-item">Settings</div>
                <div className="menu-item logout">Log Out</div>
              </div>
            </div>
          </div>
        </div>

        {/* STATS CARDS */}
        <section className="stats-grid">
          <div className="card">
            <div className="card-header">
              <span className="card-label">Total Outlines</span>
              <div className="card-icon">
                <i data-lucide="file-text"></i>
              </div>
            </div>
            <div className="card-value" id="totalOutlines">0</div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-label">Active Instructors</span>
              <div className="card-icon">
                <i data-lucide="users"></i>
              </div>
            </div>
            <div className="card-value" id="activeInstructors">0</div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-label">Pending Reviews</span>
              <div className="card-icon">
                <i data-lucide="clock-3"></i>
              </div>
            </div>
            <div className="card-value" id="pendingReviews">0</div>
          </div>
        </section>

        {/* GRAPHS */}
        <section className="grid-2">
          <div className="graph-card">
            <div className="table-title" style={{ marginBottom: "8px" }}>
              User Activity
            </div>
            <canvas id="lineChart"></canvas>
          </div>

          <div className="graph-card">
            <div className="table-title" style={{ marginBottom: "8px" }}>
              Outlines by Department
            </div>
            <canvas id="barChart"></canvas>
          </div>
        </section>

        {/* RECENT OUTLINES */}
        <section className="table-card">
          <div className="table-card-header">
            <div>
              <div className="table-title">Recent Course Outlines</div>
              <div className="table-subtitle">Latest submitted outlines</div>
            </div>

            <Link to="/new_outline" className="btn-ghost" style={{ textDecoration: 'none' }}>
              New Outline
            </Link>
          </div>

          <table>
            <thead>
              <tr>
                <th>Course</th>
                <th>Instructor</th>
                <th>Dept</th>
                <th>Updated</th>
              </tr>
            </thead>

            <tbody id="outlineBody"></tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
