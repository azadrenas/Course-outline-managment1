import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app.jsx";
import { AuthProvider } from "./context/AuthContext";
// 1. EKLEME: CourseContext'i import ediyoruz
import { CourseProvider } from "./context/CourseContext"; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        {/* 2. EKLEME: App'i CourseProvider ile sarmalıyoruz */}
        <CourseProvider>
           <App />
        </CourseProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
