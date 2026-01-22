import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/new-outline.css";

export default function DeanReview() {
  const { id } = useParams();
  const navigate = useNavigate();

  // MOCK: Backend'den gelen outline
  const outline = {
    courseCode: "CS101",
    courseName: "Introduction to Programming",
    semester: "Fall",
    instructor: "Dr. Ahmet Yılmaz",
    viceDean: "Assoc. Prof. Mehmet Kaya",
    aims: "Introduce programming fundamentals.",
    content: "Variables, loops, functions.",
    clos: [
      "Understand programming basics",
      "Develop simple programs",
    ],
  };

  const [comment, setComment] = useState("");

  // -------------------------------
  // ACTIONS
  // -------------------------------
  const handleFinalApprove = () => {
    alert("Course outline FINAL APPROVED.");
    navigate("/dean");
  };

  const handleReject = () => {
    alert("Course outline rejected and returned to Instructor.");
    navigate("/dean");
  };

  // -------------------------------
  // PAGE
  // -------------------------------
  return (
    <div className="new-outline">
      <h1>Final Approval</h1>
      <p className="subtitle">
        Outline ID: {id}
      </p>

      <section className="card">
        <h2>Course Information</h2>
        <p><strong>Course Code:</strong> {outline.courseCode}</p>
        <p><strong>Course Name:</strong> {outline.courseName}</p>
        <p><strong>Semester:</strong> {outline.semester}</p>
        <p><strong>Instructor:</strong> {outline.instructor}</p>
        <p><strong>Reviewed by Vice Dean:</strong> {outline.viceDean}</p>
      </section>

      <section className="card">
        <h2>Course Description</h2>
        <p><strong>Aims:</strong> {outline.aims}</p>
        <p><strong>Content:</strong> {outline.content}</p>
      </section>

      <section className="card">
        <h2>Course Learning Outcomes</h2>
        <ul>
          {outline.clos.map((clo, index) => (
            <li key={index}>{clo}</li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>Dean Comment (Optional)</h2>
        <textarea
          rows={4}
          placeholder="Optional final comments..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </section>

      <div className="actions">
        <button className="draft" onClick={handleReject}>
          Reject
        </button>
        <button className="submit" onClick={handleFinalApprove}>
          Final Approve
        </button>
      </div>
    </div>
  );
}
