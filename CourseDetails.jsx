// src/pages/CourseDetails.jsx

import React from "react";

export default function CourseDetails() {
  return (
    <div className="layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img
            src="https://i.imgur.com/1u3JvFM.png"
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

        <a href="/course" className="nav-link">
          <i data-lucide="library"></i>
          <span>Courses</span>
        </a>

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

      {/* MAIN */}
      <main className="main">
        {/* TOPBAR */}
        <div className="topbar">
          <div>
            <div className="topbar-title">Course Details</div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>
              Course information, sections and outlines
            </div>
          </div>

          <div className="topbar-right">
            <span className="badge">Admin</span>

            <div className="avatar-container">
              <div className="avatar">A</div>
              <div className="avatar-menu" id="avatarMenu">
                <div className="menu-item">Profile</div>
                <div className="menu-item logout">Log Out</div>
              </div>
            </div>
          </div>
        </div>

        {/* COURSE INFO */}
        <section className="table-card">
          <div className="table-card-header">
            <div>
              <div className="table-title">Course Information</div>
            </div>
            <button className="btn-primary">Edit Course</button>
          </div>

          <div id="courseInfo"></div>
        </section>

        {/* SECTIONS LIST */}
        <section className="table-card" style={{ marginTop: "20px" }}>
          <div className="table-card-header">
            <div>
              <div className="table-title">Sections</div>
            </div>
            <button className="btn-primary">Add Section</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Section</th>
                <th>Instructor</th>
                <th>Schedule</th>
                <th>Capacity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="sectionsTable"></tbody>
          </table>
        </section>

        {/* OUTLINES LIST */}
        <section className="table-card" style={{ marginTop: "20px" }}>
          <div className="table-card-header">
            <div>
              <div className="table-title">Course Outlines</div>
            </div>
            <button className="btn-primary">Create Outline</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Instructor</th>
                <th>Updated</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody id="outlinesTable"></tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
