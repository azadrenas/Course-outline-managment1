import React from "react";

export default function SectionDetails() {
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

        <a href="/sections" className="nav-link active">
          <i data-lucide="layers"></i>
          <span>Course Sections</span>
        </a>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main">
        <div className="topbar">
          <div>
            <div className="topbar-title" id="sectionTitle">
              Section Details
            </div>

            <div style={{ fontSize: "12px", color: "#6b7280" }}>
              View and edit section information
            </div>
          </div>
        </div>

        <section className="table-card">
          <div className="table-title">Section Information</div>

          <div
            id="sectionInfo"
            style={{
              marginTop: "8px",
              fontSize: "14px",
            }}
          ></div>

          <button
            className="btn-primary"
            style={{ marginTop: "16px" }}
          >
            Edit Section
          </button>
        </section>
      </main>
    </div>
  );
}
