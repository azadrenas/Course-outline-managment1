import React from "react";

export default function InstructorSections() {
  return (
    <div className="page-container" data-page="instructor-sections">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="logo">FIU</h2>

        <ul>
          <li>
            <a href="/instructor_dashboard">Dashboard</a>
          </li>
          <li>
            <a href="/instructor_courses">My Courses</a>
          </li>
          <li className="active">
            <a href="/instructor_sections">My Sections</a>
          </li>
          <li>
            <a href="/profile">Profile</a>
          </li>
          <li>
            <a onClick={() => console.log("logout()")}>Logout</a>
          </li>
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <main className="content">
        <h1>My Assigned Sections</h1>

        <table className="table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Section</th>
              <th>Schedule</th>
              <th>Room</th>
              <th>Outline</th>
            </tr>
          </thead>

          <tbody id="instSectionsBody"></tbody>
        </table>
      </main>
    </div>
  );
}
