import React from "react";

export default function OutlineEditor() {
  return (
    <div className="layout">
      {/* SIDEBAR (minimal) */}
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
      </aside>

      {/* MAIN */}
      <main className="main">
        <div className="topbar">
          <div>
            <div className="topbar-title" id="outlineTitle">
              COURSE OUTLINE
            </div>

            <div style={{ fontSize: "12px", color: "#6b7280" }}>
              Final International University – Course Outline Form
            </div>
          </div>
        </div>

        {/* PAGE 1 */}
        <section className="outline-sheet">
          <table className="outline-table">
            <tbody>
              <tr>
                <th colSpan={6} style={{ textAlign: "center" }}>
                  COURSE OUTLINE
                </th>
              </tr>

              {/* Course Name */}
              <tr>
                <th style={{ width: "15%" }}>Course Name</th>
                <td colSpan={5}>
                  <input id="co_courseName" className="outline-input" />
                </td>
              </tr>

              {/* Code + Hour + Credit Info */}
              <tr>
                <th style={{ width: "10%" }}>Code</th>
                <th style={{ width: "10%" }}>Semester</th>
                <th style={{ width: "15%" }}>Theory</th>
                <th style={{ width: "15%" }}>Lab</th>
                <th style={{ width: "15%" }}>Local Credits</th>
                <th style={{ width: "10%" }}>ECTS</th>
              </tr>

              <tr>
                <td><input id="co_code" className="outline-input" /></td>
                <td><input id="co_semester" className="outline-input" /></td>
                <td><input id="co_theory" className="outline-input" /></td>
                <td><input id="co_lab" className="outline-input" /></td>
                <td><input id="co_credits" className="outline-input" /></td>
                <td><input id="co_ects" className="outline-input" /></td>
              </tr>

              {/* Prereq / Level / Language */}
              <tr>
                <th>Prerequisites</th>
                <th>Course Level</th>
                <th colSpan={4}>Course Language</th>
              </tr>

              <tr>
                <td><input id="co_prereq" className="outline-input" /></td>
                <td><input id="co_level" className="outline-input" /></td>
                <td colSpan={4}>
                  <input id="co_language" className="outline-input" />
                </td>
              </tr>

              {/* Lecturer Info */}
              <tr>
                <th>Lecturer</th>
                <th>E-mail</th>
                <th>Office Room</th>
                <th>Assistant</th>
                <th>E-mail</th>
                <th>Office Room</th>
              </tr>

              <tr>
                <td><input id="co_lecturer" className="outline-input" /></td>
                <td><input id="co_lecturerMail" className="outline-input" /></td>
                <td><input id="co_lecturerOffice" className="outline-input" /></td>

                <td><input id="co_assistant" className="outline-input" /></td>
                <td><input id="co_assistantMail" className="outline-input" /></td>
                <td><input id="co_assistantOffice" className="outline-input" /></td>
              </tr>

              {/* Hours */}
              <tr>
                <th>Lecture Hours</th>
                <th colSpan={2}>Office Hours</th>
                <th colSpan={3}></th>
              </tr>

              <tr>
                <td>
                  <textarea
                    id="co_lectureHours"
                    className="outline-textarea"
                    rows={4}
                  ></textarea>
                </td>

                <td colSpan={2}>
                  <textarea
                    id="co_officeHours"
                    className="outline-textarea"
                    rows={4}
                  ></textarea>
                </td>

                <td colSpan={3}></td>
              </tr>

              {/* Aims */}
              <tr>
                <th>Course Aims and Objectives</th>
                <td colSpan={5}>
                  <textarea id="co_aims" className="outline-textarea" rows={5}></textarea>
                </td>
              </tr>

              {/* Content */}
              <tr>
                <th>Course Content</th>
                <td colSpan={5}>
                  <textarea id="co_content" className="outline-textarea" rows={6}></textarea>
                </td>
              </tr>

              {/* CLO */}
              <tr>
                <th>Course Learning Outcomes (CLOs)</th>
                <td colSpan={5}>
                  <textarea id="co_clos" className="outline-textarea" rows={6}></textarea>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="outline-page-note">Page 1 of 3</div>
        </section>

        {/* PAGE 2 */}
        <section className="outline-sheet">
          <table className="outline-table">
            <tbody>
              <tr>
                <th colSpan={3} style={{ textAlign: "center" }}>
                  EVALUATION OF THE COURSE
                </th>
              </tr>

              <tr>
                <th>Requirements</th>
                <th>Numbers</th>
                <th>Percentage</th>
              </tr>

              {[
                ["Assignment", "assign"],
                ["Quizzes", "quiz"],
                ["Creativity Project", "creative"],
                ["Class Participation", "part"],
                ["Lab", "lab"],
                ["Midterm Exam", "mid"],
                ["Final Exam", "final"]
              ].map(([label, key]) => (
                <tr key={key}>
                  <td>{label}</td>
                  <td><input id={`ev_${key}_num`} className="outline-input" /></td>
                  <td><input id={`ev_${key}_pct`} className="outline-input" /></td>
                </tr>
              ))}

              <tr>
                <td style={{ textAlign: "right" }}><strong>Total</strong></td>
                <td></td>
                <td>
                  <input
                    id="ev_total_pct"
                    className="outline-input"
                    placeholder="100%"
                  />
                </td>
              </tr>
            </tbody>
          </table>

          {/* WEEK 1–8 */}
          <table className="outline-table" style={{ marginTop: "16px" }}>
            <tbody>
              <tr>
                <th colSpan={4} style={{ textAlign: "center" }}>
                  WEEKLY TOPICS TO BE COVERED
                </th>
              </tr>

              <tr>
                <th>Week</th>
                <th>Subjects</th>
                <th>CLOs</th>
                <th>Tasks</th>
              </tr>

              {Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td><textarea id={`w${i + 1}_subj`} className="outline-textarea" /></td>
                  <td><textarea id={`w${i + 1}_clo`} className="outline-textarea" /></td>
                  <td><textarea id={`w${i + 1}_task`} className="outline-textarea" /></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="outline-page-note">Page 2 of 3</div>
        </section>

        {/* PAGE 3 */}
        <section className="outline-sheet">
          {/* Week 9–16 */}
          <table className="outline-table">
            <tbody>
              <tr>
                <th colSpan={4} style={{ textAlign: "center" }}>
                  WEEKLY TOPICS (CONT.)
                </th>
              </tr>

              <tr>
                <th>Week</th>
                <th>Subjects</th>
                <th>CLOs</th>
                <th>Tasks</th>
              </tr>

              {Array.from({ length: 8 }).map((_, i) => {
                const week = i + 9;
                return (
                  <tr key={week}>
                    <td>{week}</td>
                    <td>
                      <textarea
                        id={`w${week}_subj`}
                        className="outline-textarea"
                        defaultValue={week === 16 ? "FINAL EXAMS" : ""}
                      />
                    </td>
                    <td><textarea id={`w${week}_clo`} className="outline-textarea" /></td>
                    <td><textarea id={`w${week}_task`} className="outline-textarea" /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Textbooks & Reading */}
          <table className="outline-table" style={{ marginTop: "16px" }}>
            <tbody>
              <tr>
                <th>Course Textbooks</th>
                <td>
                  <textarea id="co_textbooks" className="outline-textarea" rows={3} />
                </td>
              </tr>

              <tr>
                <th>Additional Reading Material</th>
                <td>
                  <textarea id="co_reading" className="outline-textarea" rows={3} />
                </td>
              </tr>
            </tbody>
          </table>

          {/* Policies */}
          <table className="outline-table" style={{ marginTop: "16px" }}>
            <tbody>
              <tr><th>POLICIES</th></tr>
              <tr>
                <td>
                  <textarea id="co_policies" className="outline-textarea" rows={6} />
                </td>
              </tr>
            </tbody>
          </table>

          <div className="outline-page-note">Page 3 of 3</div>

          <button className="btn-primary" style={{ marginTop: "16px" }}>
            Save Outline
          </button>
        </section>
      </main>
    </div>
  );
}
