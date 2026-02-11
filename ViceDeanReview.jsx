import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/new-outline.css";

export default function ViceDeanReview() {
  const { id } = useParams();
  const navigate = useNavigate();

  // MOCK: Backend'den gelen outline (read-only)
  const outline = {
    courseCode: "CS101",
    courseName: "Introduction to Programming",
    semester: "Fall",
    instructor: "Dr. Ahmet Yılmaz",
    aims: "Introduce basic programming concepts.",
    content: "Variables, loops, functions.",
    clos: [
      "Understand programming fundamentals",
      "Write basic programs",
    ],
    evaluation: {
      assignment: 20,
      quizzes: 10,
      midterm: 30,
      final: 40,
    },
  };

  const [comment, setComment] = useState("");

  // -------------------------------
  // ACTIONS
  // -------------------------------
  const handleReject = () => {
    alert("Outline rejected and returned to Instructor.");
    navigate("/vice-dean");
  };

  const handleForward = () => {
    alert("Outline forwarded to Dean for final approval.");
    navigate("/vice-dean");
  };

  // -------------------------------
  // PAGE
  // -------------------------------
  return (
    <div className="new-outline">
      <h1>Review Course Outline</h1>
      <p className="subtitle">
        Reviewing outline ID: {id}
      </p>

      {/* COURSE INFO */}
      <section className="card">
        <h2>Course Information</h2>
        <p><strong>Course Code:</strong> {outline.courseCode}</p>
        <p><strong>Course Name:</strong> {outline.courseName}</p>
        <p><strong>Semester:</strong> {outline.semester}</p>
        <p><strong>Instructor:</strong> {outline.instructor}</p>
      </section>

      {/* DESCRIPTION */}
      <section className="card">
        <h2>Course Description</h2>
        <p><strong>Aims:</strong> {outline.aims}</p>
        <p><strong>Content:</strong> {outline.content}</p>
      </section>

      {/* CLOs */}
      <section className="card">
        <h2>Course Learning Outcomes</h2>
        <ul>
          {outline.clos.map((clo, index) => (
            <li key={index}>{clo}</li>
          ))}
        </ul>
      </section>

      {/* EVALUATION */}
      <section className="card">
        <h2>Evaluation</h2>
        <ul>
          {Object.entries(outline.evaluation).map(
            ([key, value]) => (
              <li key={key}>
                {key.toUpperCase()}: {value}%
              </li>
            )
          )}
        </ul>
      </section>

      {/* COMMENT */}
      <section className="card">
        <h2>Vice Dean Comment</h2>
        <textarea
          rows={4}
          placeholder="Write your comments for the instructor..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </section>

      {/* ACTIONS */}
      <div className="actions">
        <button className="draft" onClick={handleReject}>
          Reject & Return
        </button>
        <button className="submit" onClick={handleForward}>
          Forward to Dean
        </button>
      </div>
    </div>
  );
}
