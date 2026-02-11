import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// api.js dosyanın yolu neyse onu yaz (genelde bir üst klasördedir)
import api from "../api"; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    // --- STATE TANIMLARI ---
    const [user, setUser] = useState(() => {
        return localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
    });
    
    const [authTokens, setAuthTokens] = useState(() => {
        return localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem("authTokens")) : null;
    });

    // --- GİRİŞ FONKSİYONU (API İsteği Burada) ---
    const loginUser = async (e) => {
        e.preventDefault();
        
        // Formdaki inputlardan veriyi al
        const username = e.target.username.value;
        const password = e.target.password.value;

        try {
            // Backend'e istek atıyoruz
            const response = await api.post("/login/", {
                username: username,
                password: password
            });

            const data = response.data;

            if (response.status === 200) {
                // KONTROL: Konsolda bu veriyi görmen lazım. İçinde "office_location" var mı?
                console.log("✅ LOGIN BAŞARILI! Gelen Veri:", data); 

                // Tokenları kaydet
                setAuthTokens(data);
                
                // KRİTİK NOKTA: Backend'den gelen ofis, isim, email her şeyi user'a atıyoruz
                setUser(data); 

                // Tarayıcı hafızasına yaz (Sayfa yenilenince gitmesin)
                localStorage.setItem("authTokens", JSON.stringify(data));
                localStorage.setItem("user", JSON.stringify(data));

                navigate("/instructor"); 
            } else {
                alert("Bir şeyler ters gitti!");
            }
        } catch (error) {
            console.error("Login Hatası:", error);
            alert("Kullanıcı adı veya şifre yanlış!");
        }
    };

    // --- ÇIKIŞ FONKSİYONU ---
    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const contextData = {
        user,
        authTokens,
        loginUser, // Artık bu fonksiyonu kullanacağız
        logoutUser
    };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
