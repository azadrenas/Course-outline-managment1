import React from "react";

export default function InstructorDashboard() {
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

        <a href="/instructor_dashboard" className="nav-link active">
          <i data-lucide="layout-dashboard"></i>
          <span>Dashboard</span>
        </a>

        <div className="nav-section-title">ACADEMIC</div>

        <a href="/instructor_courses" className="nav-link">
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

        <a
          href="#"
          className="nav-link"
          onClick={() => console.log("logout()")}
        >
          <i data-lucide="log-out"></i>
          <span>Log Out</span>
        </a>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main">

        {/* TOPBAR */}
        <div className="topbar">
          <div>
            <div className="topbar-title">Instructor Dashboard</div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>
              Welcome back!
            </div>
          </div>

          <div className="topbar-right">
            <span className="badge">Instructor</span>

            <div className="avatar-container">
              <div className="avatar" id="instAvatar">I</div>

              <div className="avatar-menu" id="avatarMenu">
                <div className="menu-item" onClick={() => console.log("goProfile()")}>
                  Profile
                </div>
                <div className="menu-item logout" onClick={() => console.log("logout()")}>
                  Log Out
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PROFILE INFO */}
        <section className="table-card">
          <div className="table-title">My Profile</div>

          <p>
            <strong>Name:</strong> <span id="instName"></span>
          </p>
          <p>
            <strong>Email:</strong> <span id="instEmail"></span>
          </p>
        </section>

        {/* MY COURSES */}
        <section className="table-card">
          <div className="table-card-header">
            <div>
              <div className="table-title">My Courses</div>
              <div className="table-subtitle">Courses assigned to you</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Name</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody id="instCoursesBody"></tbody>
          </table>
        </section>

        {/* MY SECTIONS */}
        <section className="table-card">
          <div className="table-card-header">
            <div>
              <div className="table-title">My Sections</div>
              <div className="table-subtitle">Your weekly teaching schedule</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Course</th>
                <th>Section</th>
                <th>Schedule</th>
                <th>Room</th>
              </tr>
            </thead>
            <tbody id="instSectionsBody"></tbody>
          </table>
        </section>

        {/* MY OUTLINES */}
        <section className="table-card">
          <div className="table-card-header">
            <div>
              <div className="table-title">My Outlines</div>
              <div className="table-subtitle">Submitted course outlines</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Course</th>
                <th>Date</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody id="instOutlineTable"></tbody>
          </table>
        </section>

      </main>
    </div>
  );
}
