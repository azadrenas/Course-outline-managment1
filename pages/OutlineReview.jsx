import React from "react";

export default function OutlineReview() {
  return (
    <div className="layout" data-page="outline-review">

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

        <div className="nav-section-title">OUTLINES</div>

        <a href="/outline_review" className="nav-link active">
          <i data-lucide="check-circle"></i>
          <span>Review Outlines</span>
        </a>
      </aside>

      {/* MAIN */}
      <main className="main">

        {/* TOP BAR */}
        <div className="topbar">
          <div className="topbar-title">Outline Review</div>

          <div className="topbar-right">
            <span className="badge">Admin</span>

            <div className="avatar-container">
              <div className="avatar">A</div>

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

        {/* TABLE SECTION */}
        <section className="table-card">

          <div className="table-card-header">
            <div>
              <div className="table-title">Pending Outlines</div>
              <div className="table-subtitle">
                Review submitted course outlines
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Course</th>
                <th>Instructor</th>
                <th>Date</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>

            <tbody id="reviewTable"></tbody>
          </table>

        </section>
      </main>
    </div>
  );
}
