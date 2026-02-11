import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import api from "../api"; 
import "../styles/login.css"; 

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth(); 
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [language, setLanguage] = useState("EN");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // --- DİL PAKETİ ---
  const t = {
    EN: {
     
      username: "Username / Email",
      password: "Password",
      placeholderUser: "instructor1",
      
      
      loginBtn: "Log In",
      loadingBtn: "Logging in...",
      errorMsg: "Login failed! Check your credentials or connection.",
    },
    TR: {
     
      username: "Kullanıcı Adı / E-posta",
      password: "Şifre",
      placeholderUser: "egitmen1",
      
      
      loginBtn: "Giriş Yap",
      loadingBtn: "Giriş yapılıyor...",
      errorMsg: "Giriş başarısız! Bilgilerinizi veya bağlantınızı kontrol edin.",
    }
  };

  const text = t[language];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Backend'e İstek At
      const response = await api.post("/api/login/", {
        username: email,
        password: password,
      });

      console.log("✅ Backend Cevabı:", response.data);

      // 2. Verileri Hazırla
      const token = response.data.access || response.data.token;
      const role = (response.data.role || "instructor").toLowerCase(); 
      const userName = response.data.username || email;
      const userId = response.data.user_id || response.data.id;
      
      // Ekstra bilgiler
      const officeInfo = response.data.office_location || response.data.office || "";
      const firstName = response.data.first_name || "";
      const lastName = response.data.last_name || "";
      const isSuperuser = response.data.is_superuser || false; 
      
      // Department ID
      let deptId = response.data.department_id || null; 
      if (!deptId) {
          deptId = 1; 
      }

      // --- 3. USER OBJESİNİ OLUŞTUR ---
      const fullUserData = {
          id: userId,
          username: userName,
          role: role,
          department_id: deptId,
          first_name: firstName,
          last_name: lastName,
          office: officeInfo,
          email: response.data.email || "",
          is_superuser: isSuperuser,
          profile: response.data.profile || {}
      };

      // 4. LocalStorage Kaydı
      if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("authTokens", JSON.stringify(response.data)); 
          
          localStorage.setItem("user", JSON.stringify(fullUserData));

          // Context Güncelle
          if (setUser) {
              setUser(fullUserData);
          }
      } else {
          throw new Error("Token alınamadı!");
      }

      // 5. YÖNLENDİRME (ROUTING)
      if (isSuperuser || role === 'admin') {
          navigate("/admin");
      } else {
          switch (role) {
              case "vice_dean":
              case "vicedean":
                  navigate("/vice-dean");
                  break;
              case "dean":
                  navigate("/dean");
                  break;
              case "rectorate":
              case "rector":
                  navigate("/rector");
                  break;
              case "instructor":
              default:
                  navigate("/instructor");
                  break;
          }
      }

    } catch (err) {
      console.error("Login Hatası:", err);
      setError(err.response?.data?.detail || text.errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* 🔥 MOBİL DÜZELTME YAMASI (CSS) 🔥 */}
      <style>{`
        @media screen and (max-width: 768px) {
            .login-container {
                flex-direction: column !important;
                height: 100vh;
            }
            .login-right {
                display: none !important; /* Mobilde resmi yok et */
            }
            .login-left {
                width: 100% !important;
                padding: 20px !important;
                flex: 1 !important;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
            .login-form {
                width: 100% !important;
                max-width: 100% !important;
            }
        }
      `}</style>

      {/* LEFT SIDE (FORM) */}
      <div className="login-left">
        
        {/* HEADER */}
        <div className="login-header">
          <img
            src="https://yt3.googleusercontent.com/fHhTkYBvybtsr6ndyjZWYeKdZcWfm5iDwHTwLW8Q68VknsXN3TNvelmRQkUOOEM7NWwIIj0Js9g=s900-c-k-c0x00ffffff-no-rj"
            alt="FIU Logo"
            className="login-logo"
            onError={(e) => {e.target.src="https://www.final.edu.tr/assets/images/logo/logo-en.png"}}
          />
          
          <div className="language-wrapper">
            <select 
              className="lang-select"
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="EN">🇬🇧 EN</option>
              <option value="TR">🇹🇷 TR</option>
            </select>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <h2 style={{textAlign: 'center', marginBottom: '20px', fontWeight:'600'}}>
            {text.welcome}
          </h2>
          
          {error && <div style={{ color: "red", marginBottom: "10px", fontSize: "14px", textAlign:"center" }}>{error}</div>}

          <div>
            <label>{text.username}</label>
            <input
              type="text"
              placeholder={text.placeholderUser}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label>{text.password}</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="login-options">
            <label className="remember-label">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>{text.remember}</span>
            </label>

            <span className="forgot-link" onClick={() => navigate("/forgot-password")}>
              {text.forgot}
            </span>
          </div>

          <button 
            type="submit" 
            className="login-btn" 
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? text.loadingBtn : text.loginBtn}
          </button>
        </form>
      </div>

      {/* RIGHT SIDE (IMAGE) */}
      <div
        className="login-right"
        style={{
          backgroundImage: "url('https://www.studyportalturkey.com/wp-content/uploads/2024/06/n05-6817jpg1718105706.jpg')",
        }}
      />
    </div>
  );
}
