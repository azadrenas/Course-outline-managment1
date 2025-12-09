import React from "react";

export default function NewOutline() {
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

        <a href="/sections" className="nav-link">
          <i data-lucide="layers"></i>
          <span>Course Sections</span>
        </a>

        <a href="/new_outline" className="nav-link">
          <i data-lucide="file-plus"></i>
          <span>New Outline</span>
        </a>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main">
        <div className="topbar">
          <div>
            <div className="topbar-title">New Course Outline</div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>
              Fill basic course info and proceed to outline editor
            </div>
          </div>

          <div className="topbar-right">
            <span className="badge">Admin</span>
            <div className="avatar">A</div>
          </div>
        </div>

        <section className="table-card">
          <div className="table-title">Course Information</div>
          <div className="table-subtitle">
            Start by entering the Course Code
          </div>

          <form id="outlineForm">
            <div className="form-row">
              <div className="form-field">
                <label>Course Code</label>
                <input
                  type="text"
                  id="courseCode"
                  placeholder="SOFT343"
                  required
                />
              </div>

              <div className="form-field">
                <label>Course Name</label>
                <input type="text" id="courseName" readOnly />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Instructor</label>
                <input type="text" id="courseInstructor" readOnly />
              </div>

              <div className="form-field">
                <label>Department</label>
                <input type="text" id="courseDept" readOnly />
              </div>
            </div>

            <button type="submit" className="btn-primary">
              Start Outline Editor
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
