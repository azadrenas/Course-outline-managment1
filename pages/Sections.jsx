import React from "react";

export default function Sections() {
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

        <a href="/sections" className="nav-link active">
          <i data-lucide="layers"></i>
          <span>Course Sections</span>
        </a>

        <a href="/new_outline" className="nav-link">
          <i data-lucide="file-plus"></i>
          <span>New Course Outline</span>
        </a>
      </aside>

      {/* MAIN Content */}
      <main className="main">
        {/* TOPBAR */}
        <div className="topbar">
          <div>
            <div className="topbar-title">Course Sections</div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>
              Create sections for courses, assign instructors and schedules
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

        {/* CREATE SECTION */}
        <section className="table-card">
          <div className="table-card-header">
            <div>
              <div className="table-title">Create New Section</div>
              <div className="table-subtitle">
                Select a course, assign an instructor, schedule and classroom
              </div>
            </div>
          </div>

          <form id="sectionForm">
            <div className="form-row">
              <div className="form-field">
                <label>Course</label>
                <select id="sectionCourse"></select>
              </div>

              <div className="form-field">
                <label>Section Number</label>
                <input id="sectionNumber" placeholder="01" />
              </div>

              <div className="form-field">
                <label>Instructor</label>
                <select id="sectionInstructor"></select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Day</label>
                <select id="sectionDay">
                  <option value="">Select...</option>
                  <option>Monday</option>
                  <option>Tuesday</option>
                  <option>Wednesday</option>
                  <option>Thursday</option>
                  <option>Friday</option>
                  <option>Saturday</option>
                </select>
              </div>

              <div className="form-field">
                <label>Start Time</label>
                <input type="time" id="sectionStart" />
              </div>

              <div className="form-field">
                <label>End Time</label>
                <input type="time" id="sectionEnd" />
              </div>

              <div className="form-field">
                <label>Classroom</label>
                <input
                  id="sectionRoom"
                  list="classroomOptions"
                  placeholder="B202"
                />
                <datalist id="classroomOptions"></datalist>
              </div>

              <div className="form-field">
                <label>Capacity</label>
                <input type="number" id="sectionCapacity" min="1" placeholder="30" />
              </div>
            </div>

            <button type="submit" className="btn-primary">
              Create Section
            </button>
          </form>
        </section>

        {/* EXISTING SECTIONS */}
        <section className="table-card" style={{ marginTop: "16px" }}>
          <div className="table-card-header">
            <div>
              <div className="table-title">Existing Sections</div>
              <div className="table-subtitle">
                All active sections in the system
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Section</th>
                <th>Course</th>
                <th>Instructor</th>
                <th>Schedule</th>
                <th>Room</th>
                <th>Capacity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="sectionsBody"></tbody>
          </table>
        </section>

        {/* CLASSROOMS */}
        <section className="table-card" style={{ marginTop: "16px" }}>
          <div className="table-card-header">
            <div>
              <div className="table-title">Classrooms</div>
              <div className="table-subtitle">
                Define classrooms and reuse them in sections
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>New Classroom</label>
              <input
                id="classroomNameInput"
                placeholder="B202, C310, Lab-1, etc."
              />
            </div>

            <div className="form-field" style={{ alignSelf: "flex-end" }}>
              <button type="button" className="btn-primary" id="addClassroomBtn">
                Add Classroom
              </button>
            </div>
          </div>

          <ul
            id="classroomsBody"
            style={{ marginTop: "8px", listStyle: "none", paddingLeft: 0 }}
          ></ul>
        </section>
      </main>
    </div>
  );
}
