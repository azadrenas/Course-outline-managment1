// src/pages/ForgotPassword.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css"; // Aynı stilleri kullanıyoruz

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = (e) => {
    e.preventDefault();
    // Backend olmadığı için sahte işlem (Mock)
    if (!email) return;

    setMessage("📩 Password reset link sent to your email!");
    
    // 3 saniye sonra login'e geri at
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  };

  return (
    <div className="login-container">
      {/* SOL TARAFI */}
      <div className="login-left">
        <div className="login-header">
           <img
            src="https://yt3.googleusercontent.com/fHhTkYBvybtsr6ndyjZWYeKdZcWfm5iDwHTwLW8Q68VknsXN3TNvelmRQkUOOEM7NWwIIj0Js9g=s900-c-k-c0x00ffffff-no-rj"
            alt="FIU Logo"
            className="login-logo"
          />
        </div>

        <form className="login-form" onSubmit={handleReset}>
          <h2 style={{textAlign: 'center', marginBottom: '10px'}}>Reset Password</h2>
          <p style={{textAlign: 'center', color: '#666', marginBottom: '20px', fontSize: '14px'}}>
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {message && (
            <div style={{ padding: "10px", background: "#d4edda", color: "#155724", borderRadius: "5px", marginBottom: "15px", fontSize: "14px" }}>
              {message}
            </div>
          )}

          <div>
            <label>Email Address</label>
            <input
              type="email"
              placeholder="instructor1@test.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn" style={{marginTop: '20px'}}>
            Send Reset Link
          </button>

          <div style={{textAlign: 'center', marginTop: '20px'}}>
            <span 
                style={{cursor: 'pointer', color: '#000', fontWeight: 'bold'}}
                onClick={() => navigate("/login")}
            >
              ← Back to Login
            </span>
          </div>
        </form>
      </div>

      {/* SAĞ TARAF (AYNI RESİM) */}
      <div
        className="login-right"
        style={{
          backgroundImage: "url('https://haberkibris.com/images/2025_11_07/uluslararasi-final-universitesinde-renkli-hosgeldin-partisi-basladi-1808-2025-11-07_m.jpg')",
        }}
      />
    </div>
  );
}