import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// --- ORTAK SAYFALAR ---
import Login from "./pages/Login";
import NewOutline from "./pages/NewOutline";
import ForgotPassword from "./pages/ForgotPassword";

// --- LİSTE SAYFALARI (Hocalar ve Ortak Kullanım İçin) ---
import Instructors from "./pages/Instructors"; 
import Departments from "./pages/Departments";

// --- VICE DEAN (DEKAN YARDIMCISI) SAYFALARI ---
import ViceDeanInstructors from "./pages/ViceDeanInstructors"; 
import ViceDeanDepartments from "./pages/ViceDeanDepartments";

// --- DEAN (DEKAN) SAYFALARI ---
import DeanInstructors from "./pages/DeanInstructors";
import DeanDepartments from "./pages/DeanDepartments";
import FacultyStats from "./pages/FacultyStats"; 
import DeanPrograms from "./pages/DeanPrograms"; 

// --- RECTOR (REKTÖR) ÖZEL SAYFALARI ---
import RectorFaculties from "./pages/RectorFaculties"; 
import StaffStats from "./pages/StaffStats"; 

// --- DASHBOARDLAR (Ana Paneller) ---
import InstructorDashboard from "./pages/InstructorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ViceDeanDashboard from "./pages/ViceDeanDashboard";
import DeanDashboard from "./pages/DeanDashboard";
import RectorDashboard from "./pages/RectorDashboard";

export default function App() {
  return (
    <Routes>
      {/* 1. Varsayılan Yönlendirme: Giriş yapmamışsa Login'e at */}
      <Route path="/" element={<Navigate to="/login" />} />
      
      {/* 2. Login Sayfası */}
      <Route path="/login" element={<Login />} />
      
      {/* 3. INSTRUCTOR (HOCA) PANELİ */}
      <Route path="/instructor" element={<InstructorDashboard />} />
      
      {/* 4. VICE DEAN (DEKAN YARDIMCISI) ROTALARI */}
      <Route path="/vice-dean" element={<ViceDeanDashboard />} />
      <Route path="/vice-dean/instructors" element={<ViceDeanInstructors />} />
      <Route path="/vice-dean/departments" element={<ViceDeanDepartments />} />

      {/* 5. DEAN (DEKAN) ROTALARI */}
      <Route path="/dean" element={<DeanDashboard />} />
      <Route path="/dean/instructors" element={<DeanInstructors />} />
      <Route path="/dean/departments" element={<DeanDepartments />} />
      <Route path="/dean/stats" element={<FacultyStats />} />
      <Route path="/dean/programs" element={<DeanPrograms />} />

      {/* 6. RECTOR (REKTÖR) ROTALARI - ÖNEMLİ: Alt sayfaları üste aldık */}
      <Route path="/rector/faculties" element={<RectorFaculties />} /> 
      <Route path="/rector/staff-stats" element={<StaffStats />} />
      <Route path="/rector" element={<RectorDashboard />} /> {/* Ana Dashboard en altta */}

      {/* 7. ADMIN */}
      <Route path="/admin" element={<AdminDashboard />} />
      
      {/* 8. ORTAK/HOCA LİSTE SAYFALARI */}
      <Route path="/instructors" element={<Instructors />} />
      <Route path="/departments" element={<Departments />} />

      {/* 9. DERS OLUŞTURMA VE DÜZENLEME */}
      <Route path="/create-outline" element={<NewOutline />} />
      <Route path="/new-outline" element={<NewOutline />} /> 

      {/* 10. DİĞERLERİ */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      {/* Hatalı URL girilirse Login'e at */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
