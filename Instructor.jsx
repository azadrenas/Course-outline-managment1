import React from "react";

export default function Instructors() {
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
        <a href="/instructors" className="nav-link active">
          <i data-lucide="users"></i>
          <span>Instructors</span>
        </a>

        <a href="/departments" className="nav-link">
          <i data-lucide="building-2"></i>
          <span>Departments</span>
        </a>

        <a href="/new_outline" className="nav-link">
          <i data-lucide="file-text"></i>
          <span>New Course Outline</span>
        </a>
      </aside>

      {/* MAIN */}
      <main className="main">
        <div className="topbar">
          <div>
            <div className="topbar-title">Instructors</div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>
              Manage and view course instructors
            </div>
          </div>
        </div>

        {/* ADD INSTRUCTOR FORM */}
        <section className="table-card" style={{ marginBottom: "18px" }}>
          <div className="table-card-header">
            <div>
              <div className="table-title">Add New Instructor</div>
              <div className="table-subtitle">
                Fill the form and click Add
              </div>
            </div>
          </div>

          <form id="instructorForm">
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="instructorName">Name</label>
                <input
                  id="instructorName"
                  type="text"
                  placeholder="Dr. Jane Doe"
                />
              </div>

              <div className="form-field">
                <label htmlFor="instructorEmail">Email</label>
                <input
                  id="instructorEmail"
                  type="email"
                  placeholder="jane@fiu.edu"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="instructorDept">Department</label>
                <select id="instructorDept"></select>
              </div>

              <div className="form-field">
                <label htmlFor="instructorStatus">Status</label>
                <select id="instructorStatus">
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>

              <div
                className="form-field"
                style={{ flex: "0 0 auto", alignSelf: "flex-end" }}
              >
                <button className="btn-primary" type="submit">
                  Add Instructor
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* INSTRUCTOR LIST */}
        <section className="table-card">
          <div className="table-card-header">
            <div>
              <div className="table-title">Instructor List</div>
              <div className="table-subtitle">Filter by department</div>
            </div>

            <div>
              <select id="deptFilter" className="form-select"></select>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Dept</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody id="instructorBody"></tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
