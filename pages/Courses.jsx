import React from "react";

export default function Courses() {
  return (
    <>
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
          <a href="/course" className="nav-link active">
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

        {/* MAIN CONTENT */}
        <main className="main">
          {/* TOPBAR */}
          <div className="topbar">
            <div>
              <div className="topbar-title">Courses</div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>
                Manage all university courses
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

          {/* FILTERS */}
          <section className="table-card">
            <div className="form-row" style={{ marginBottom: "16px" }}>
              <input
                className="input"
                id="courseSearch"
                placeholder="Search by name or code..."
              />

              <select className="input" id="courseDeptFilter">
                <option value="">All Departments</option>
              </select>
            </div>

            <div className="table-card-header">
              <div>
                <div className="table-title">Course List</div>
                <div className="table-subtitle">All registered courses</div>
              </div>
              <button className="btn-primary">Add Course</button>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Course Name</th>
                  <th>Department</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody id="courseTableBody"></tbody>
            </table>
          </section>
        </main>
      </div>

      {/* ADD COURSE MODAL */}
      <div className="modal" id="courseModal">
        <div className="modal-content">
          <div className="modal-title">Add New Course</div>

          <label>Course Code</label>
          <input id="courseCode" className="input" />

          <label>Course Name</label>
          <input id="courseName" className="input" />

          <label>Department</label>
          <select id="courseDept" className="input"></select>

          <div className="modal-actions">
            <button className="btn-secondary">Cancel</button>
            <button className="btn-primary">Save</button>
          </div>
        </div>
      </div>

      {/* EDIT COURSE MODAL */}
      <div className="modal" id="editCourseModal">
        <div className="modal-content">
          <div className="modal-title">Edit Course</div>

          <label>Course Code</label>
          <input id="editCourseCode" className="input" />

          <label>Course Name</label>
          <input id="editCourseName" className="input" />

          <label>Department</label>
          <select id="editCourseDept" className="input"></select>

          <div className="modal-actions">
            <button className="btn-secondary">Cancel</button>
            <button className="btn-primary">Update</button>
          </div>
        </div>
      </div>
    </>
  );
}
