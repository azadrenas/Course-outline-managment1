import React from "react";

export default function Forgot() {
  return (
    <div style={container}>
      {/* LEFT PANEL */}
      <div style={leftPanel}>
        <div style={logoBox}>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToxqbiElXBH_Ii16yY1kib9IC6s_QQvAqtbQ&s"
            alt="FIU Logo"
            style={{ width: "180px" }}
          />
        </div>

        <h2 style={title}>Reset Password</h2>
        <p style={subtitle}>
          Enter your email and we will send you reset instructions.
        </p>

        <label style={labelStyle}>Email</label>
        <input
          id="forgotEmail"
          type="email"
          placeholder="name@example.com"
          style={inputStyle}
        />

        <button style={sendBtn}>Send Reset Link</button>

        <div
          style={backLogin}
          onClick={() => (window.location.href = "/login")}
        >
          ← Back to Login
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={rightPanel}>
        <img
          src="https://www.studyportalturkey.com/wp-content/uploads/2024/06/n05-6817jpg1718105706.jpg"
          alt="Campus"
          style={rightImg}
        />
      </div>
    </div>
  );
}

/* ============================= */
/* INLINE STYLE OBJECTS */
/* ============================= */

const container = {
  display: "flex",
  width: "100%",
  height: "100vh"
};

const leftPanel = {
  width: "45%",
  padding: "60px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center"
};

const logoBox = {
  display: "flex",
  justifyContent: "center",
  marginBottom: "40px"
};

const title = {
  textAlign: "center",
  marginBottom: "10px",
  fontSize: "26px",
  fontWeight: "700"
};

const subtitle = {
  textAlign: "center",
  color: "#555",
  marginBottom: "30px"
};

const labelStyle = {
  fontSize: "14px",
  fontWeight: "600"
};

const inputStyle = {
  width: "100%",
  padding: "10px 5px",
  marginTop: "5px",
  border: "none",
  borderBottom: "2px solid #000",
  fontSize: "16px",
  outline: "none"
};

const sendBtn = {
  width: "100%",
  marginTop: "25px",
  background: "#111",
  color: "#fff",
  padding: "12px 0",
  borderRadius: "30px",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
  transition: ".2s"
};

const backLogin = {
  textAlign: "center",
  marginTop: "20px",
  fontSize: "14px",
  cursor: "pointer",
  color: "#0073ff",
  textDecoration: "underline"
};

const rightPanel = {
  width: "55%",
  height: "100%"
};

const rightImg = {
  width: "100%",
  height: "100%",
  objectFit: "cover"
};
