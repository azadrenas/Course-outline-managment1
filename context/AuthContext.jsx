import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // api.js yolun doğruysa buna dokunma

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    // --- 1. STATE TANIMLARI (LocalStorage'dan Başlangıç Değerlerini Al) ---
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("LocalStorage user okuma hatası:", error);
            return null;
        }
    });
    
    const [authTokens, setAuthTokens] = useState(() => {
        try {
            const storedTokens = localStorage.getItem("authTokens");
            return storedTokens ? JSON.parse(storedTokens) : null;
        } catch (error) {
            console.error("LocalStorage token okuma hatası:", error);
            return null;
        }
    });

    // --- 2. GİRİŞ FONKSİYONU ---
    const loginUser = async (e) => {
        e.preventDefault();
        
        const username = e.target.username.value;
        const password = e.target.password.value;

        try {
            const response = await api.post("/api/token/", {
                username: username,
                password: password
            });

            const data = response.data;

            if (response.status === 200) {
                console.log("✅ LOGIN BAŞARILI! Gelen Veri:", data); 

                // State Güncelle
                setAuthTokens(data);
                
                // DİKKAT: Backend'den 'user' objesi içinde 'role' gelmesi ŞART.
                // Eğer backend sadece token dönüyorsa, user bilgisini decode etmen gerekir.
                // Şimdilik data'nın içinde user bilgisi olduğunu varsayıyoruz.
                setUser(data); 

                // LocalStorage Güncelle
                localStorage.setItem("authTokens", JSON.stringify(data));
                localStorage.setItem("user", JSON.stringify(data));

                // Yönlendirme Mantığı
                const role = (data.role || data.profile?.role || 'instructor').toString().toLowerCase();
                
                console.log("📍 Giriş Yönlendirmesi Hesaplanıyor... Rol:", role);

                if (data.is_superuser || role === 'admin') {
                    navigate("/admin");
                } else if (role === 'rectorate' || role === 'rector') {
                    navigate("/rector");
                } else if (role.includes('vice') || role === 'vice_dean') {
                    // vice_dean, vice-dean, vicedean hepsini kapsar
                    navigate("/vice-dean");
                } else if (role === 'dean') {
                    navigate("/dean");
                } else {
                    navigate("/instructor");
                }

            } else {
                alert("Giriş yapılamadı! Lütfen bilgilerinizi kontrol edin.");
            }
        } catch (error) {
            console.error("Login Hatası:", error);
            alert("Kullanıcı adı veya şifre hatalı!");
        }
    };

    // --- 3. ÇIKIŞ FONKSİYONU ---
    const logoutUser = () => {
        console.log("🚪 Çıkış yapılıyor...");
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
        localStorage.removeItem("user");
        // Eğer ayrı kaydettiysen bunları da sil:
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        
        navigate("/login");
    };

    // --- 4. YÜKLEME KONTROLÜ ---
    // Sayfa ilk açıldığında loading'i kapat.
    // Önceki kodundaki useEffect([authTokens]) gereksiz yere çalışabiliyordu.
    useEffect(() => {
        if (authTokens) {
            // Token varsa user bilgisini doğrula (opsiyonel)
            // Şimdilik sadece loading'i kapatıyoruz.
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, []); 

    const contextData = {
        user,
        authTokens,
        loginUser,
        logoutUser,
        logout: logoutUser
    };

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;