import React from "react";

export default function Departments() {
  return (
    <div className="layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">FIU System</div>

        <div className="nav-section-title">Main</div>
        <a href="/dashboard" className="nav-link">
          <i data-lucide="layout-dashboard"></i>
          <span>Dashboard</span>
        </a>

        <div className="nav-section-title">Academic</div>

        <a href="/instructors" className="nav-link">
          <i data-lucide="users"></i>
          <span>Instructors</span>
        </a>

        <a href="/departments" className="nav-link active">
          <i data-lucide="building-2"></i>
          <span>Departments</span>
        </a>

        <a href="/new_outline" className="nav-link">
          <i data-lucide="file-text"></i>
          <span>New Course Outline</span>
        </a>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main">
        <div className="topbar">
          <div>
            <div className="topbar-title">Departments</div>

            <div style={{ fontSize: "12px", color: "#6b7280" }}>
              Define departments and see instructor counts
            </div>
          </div>
        </div>

        {/* ADD DEPARTMENT */}
        <section className="table-card" style={{ marginBottom: "18px" }}>
          <div className="table-card-header">
            <div>
              <div className="table-title">Add New Department</div>
              <div className="table-subtitle">
                Type a department name and add it
              </div>
            </div>
          </div>

          <form id="deptForm">
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="deptName">Department Name</label>
                <input
                  id="deptName"
                  type="text"
                  placeholder="Economics, Psychology, etc."
                />
              </div>

              <div
                className="form-field"
                style={{
                  flex: "0 0 auto",
                  alignSelf: "flex-end"
                }}
              >
                <button type="submit" className="btn-primary">
                  Add Department
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* DEPARTMENT LIST */}
        <section className="table-card">
          <div className="table-card-header">
            <div>
              <div className="table-title">Departments & Instructor Count</div>
              <div className="table-subtitle">
                Click “View Instructors” to filter instructor list
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Department</th>
                <th>Instructors</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody id="deptBody"></tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
