import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Context'i güncellemek için
import api from "../api"; 
import "../styles/login.css"; 

export default function Login() {
  const navigate = useNavigate();
  // Context'ten setUser fonksiyonunu çekiyoruz
  const { setUser } = useAuth(); 
  
  // State'ler
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [language, setLanguage] = useState("EN");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // --- DİL PAKETİ (TRANSLATIONS) ---
  const t = {
    EN: {
      username: "Username / Email",
      password: "Password",
      placeholderUser: "instructor1",
      remember: "Remember me",
      loginBtn: "Log In",
      loadingBtn: "Logging in...",
      errorMsg: "Login failed! Check your credentials or connection.",
      
      
    },
    TR: {
      username: "Kullanıcı Adı / E-posta",
      password: "Şifre",
      placeholderUser: "egitmen1",
      remember: "Beni Hatırla",
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

      // 2. Token ve Kullanıcı Bilgilerini Al
      const token = response.data.access || response.data.token;
      const role = (response.data.role || "instructor").toLowerCase(); 
      const userName = response.data.username || email;
      const userId = response.data.user_id || response.data.id;
      
      // KRİTİK: Ofis ve İsim Bilgilerini de alıyoruz
      const officeInfo = response.data.office_location || response.data.office || "";
      const firstName = response.data.first_name || "";
      const lastName = response.data.last_name || "";
      
      // KRİTİK: Department ID
      let deptId = response.data.department_id || null; 

      // 3. LocalStorage'a Kaydet (Kalıcılık için)
      if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("username", userName);
          localStorage.setItem("role", role);
          localStorage.setItem("user_id", userId);
          
          // --- GÜÇLENDİRİLMİŞ KISIM ---
          if (deptId) {
             localStorage.setItem("department_id", deptId);
          } else {
             console.warn("⚠️ Backend bölüm bilgisi göndermedi! Varsayılan olarak 1 atanıyor.");
             deptId = 1; 
             localStorage.setItem("department_id", "1");
          }
          
          // --- 4. CONTEXT GÜNCELLEME (EN ÖNEMLİ YER) ---
          // Burada Backend'den gelen TÜM veriyi (ofis dahil) Context'e atıyoruz.
          // NewOutline.jsx bu veriyi buradan okuyacak.
          if (setUser) {
             setUser({
                 id: userId,
                 username: userName,
                 role: role,
                 department_id: deptId,
                 first_name: firstName,
                 last_name: lastName,
                 office: officeInfo, // İşte aradığımız ofis bilgisi!
                 email: response.data.email || ""
             });
          }
      } else {
          throw new Error("Token alınamadı!");
      }

      // 5. ROL TABANLI YÖNLENDİRME
      switch (role) {
          case "admin":
              navigate("/admin");
              break;
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

    } catch (err) {
      console.error("Login Hatası:", err);
      setError(err.response?.data?.detail || text.errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* LEFT SIDE (FORM) */}
      <div className="login-left">
        
        {/* HEADER */}
        <div className="login-header">
          <img
            src="https://yt3.googleusercontent.com/fHhTkYBvybtsr6ndyjZWYeKdZcWfm5iDwHTwLW8Q68VknsXN3TNvelmRQkUOOEM7NWwIIj0Js9g=s900-c-k-c0x00ffffff-no-rj"
            alt="FIU Logo"
            className="login-logo"
            // Resim kırık görünürse yedek logo
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
