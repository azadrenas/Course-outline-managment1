import { createContext, useState, useEffect, useContext, useCallback } from "react";
import api from "../api";

const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Verileri çekme fonksiyonu
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // API isteklerini paralel atıyoruz
      const [courseRes, instructorRes, deptRes] = await Promise.all([
        api.get("api/outlines/"),
        api.get("api/instructors/"),
        api.get("api/departments/")
      ]);

      // Gelen veriyi kontrol edip state'e atıyoruz
      setCourses(Array.isArray(courseRes.data) ? courseRes.data : []);
      setInstructors(Array.isArray(instructorRes.data) ? instructorRes.data : []);
      setDepartments(Array.isArray(deptRes.data) ? deptRes.data : []);
    } catch (error) {
      console.error("Veri çekme hatası:", error);
      // Hata olsa bile array'leri boşaltıyoruz ki map fonksiyonu patlamasın
      setCourses([]);
      setInstructors([]);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Yeni Ders Ekleme
  const addCourse = async (courseData) => {
    try {
      const response = await api.post("api/outlines/", courseData);
      setCourses((prev) => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error("Ekleme Hatası:", error);
      throw error;
    }
  };

  // Ders Güncelleme - EN GÜVENLİ YAZIM ŞEKLİ
  const editCourse = async (courseData) => {
    // ID kontrolü
    const id = courseData.id;
    if (!id) {
        console.error("Hata: ID bulunamadı");
        return;
    }

    try {
      // HATA ÇIKARAN KISIM BURASIYDI. 
      // Backtick (`) riskine girmeden klasik yöntemle yazıyorum:
      const url = "api/outlines/" + id + "/"; 
      
      const response = await api.put(url, courseData);
      
      setCourses((prev) => 
        prev.map((item) => (item.id === id ? response.data : item))
      );
      return response.data;
    } catch (error) {
      console.error("Güncelleme Hatası:", error);
      throw error;
    }
  };

  return (
    <CourseContext.Provider value={{ 
      courses, 
      instructors, 
      departments, 
      loading, 
      fetchData, 
      addCourse, 
      editCourse 
    }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = () => useContext(CourseContext);
export default CourseContext;
