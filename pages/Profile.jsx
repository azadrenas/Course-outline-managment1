import React from "react";

export default function Profile() {
  return (
    <div className="layout" data-page="profile">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="sidebar-logo">FIU System</div>

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
        <div className="topbar">
          <div>
            <div className="topbar-title">Profile</div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>
              User Account Information
            </div>
          </div>
        </div>

        <section className="table-card" style={{ maxWidth: "500px" }}>

          {/* Avatar */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div
              className="avatar"
              style={{
                width: "70px",
                height: "70px",
                fontSize: "30px",
                margin: "0 auto"
              }}
            >
              A
            </div>
          </div>

          {/* Name */}
          <div className="form-field">
            <label>Name</label>
            <input value="Admin User" disabled />
          </div>

          {/* Email */}
          <div className="form-field" style={{ marginTop: "12px" }}>
            <label>Email</label>
            <input value="admin@fiu.edu" disabled />
          </div>

          {/* Role */}
          <div className="form-field" style={{ marginTop: "12px" }}>
            <label>Role</label>
            <input value="Administrator" disabled />
          </div>

          {/* Button */}
          <button className="btn-primary" style={{ marginTop: "20px" }}>
            Change Password
          </button>

        </section>
      </main>
    </div>
  );
}
