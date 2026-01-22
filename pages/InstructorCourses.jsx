import React from "react";

export default function InstructorCourses() {
  return (
    <div className="layout">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img
            src="https://i.imgur.com/1u3JvFM.png"
            className="sidebar-logo-img"
            alt="Logo"
          />
        </div>

        <button id="collapseBtn" className="collapse-btn">
          <i data-lucide="chevron-left"></i>
        </button>

        <div className="nav-section-title">MAIN</div>

        <a href="/instructor_dashboard" className="nav-link">
          <i data-lucide="layout-dashboard"></i>
          <span>Dashboard</span>
        </a>

        <div className="nav-section-title">ACADEMIC</div>

        <a href="/instructor_courses" className="nav-link active">
          <i data-lucide="book"></i>
          <span>My Courses</span>
        </a>

        <a href="/instructor_sections" className="nav-link">
          <i data-lucide="layers"></i>
          <span>My Sections</span>
        </a>

        <a href="/instructor_outlines" className="nav-link">
          <i data-lucide="file-text"></i>
          <span>My Outlines</span>
        </a>

        <div className="nav-section-title">ACCOUNT</div>

        <a href="/profile" className="nav-link">
          <i data-lucide="user"></i>
          <span>Profile</span>
        </a>

        <a className="nav-link" onClick={() => console.log("logout()")}>
          <i data-lucide="log-out"></i>
          <span>Log Out</span>
        </a>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main">

        {/* TOPBAR */}
        <div className="topbar">
          <div>
            <div className="topbar-title">My Courses</div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>
              Courses assigned by the department
            </div>
          </div>

          <div className="topbar-right">
            <span className="badge">Instructor</span>
            <div className="avatar-container">
              <div className="avatar">I</div>
            </div>
          </div>
        </div>

        {/* COURSE LIST */}
        <section className="table-card">
          <div className="table-card-header">
            <div>
              <div className="table-title">Assigned Courses</div>
              <div className="table-subtitle">
                Courses you are teaching this term
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Course Name</th>
                <th>Sections</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>

            <tbody id="instCoursesBody"></tbody>
          </table>
        </section>

      </main>
    </div>
  );
}
