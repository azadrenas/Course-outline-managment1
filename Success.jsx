import React from "react";
import { Link } from "react-router-dom";

export default function Success() {
  return (
    <div
      className="container"
      style={{
        textAlign: "center",
        marginTop: "60px",
      }}
    >
      <h1>✔ Course Outline Added Successfully</h1>
      <br />

      <Link
        to="/dashboard"
        style={{
          background: "#005bbb",
          color: "white",
          padding: "14px 24px",
          border: "none",
          borderRadius: "10px",
          fontSize: "16px",
          cursor: "pointer",
          textDecoration: "none",
          display: "inline-block"
        }}
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
