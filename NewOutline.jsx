import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/paper.css"; 
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api"; 

// --- ROL BAZLI YÖNLENDİRME FONKSİYONU ---
const getRedirectPath = (role) => {
    if (!role) return '/instructor';
    
    // Rolü string'e çevir, küçült ve boşlukları sil
    const r = String(role).toLowerCase().trim();
    
    console.log("🧭 Rota Hesaplanıyor... Algılanan Rol:", r);

    if (r === 'dean') return '/dean';
    // Vice Dean varyasyonlarını yakala
    if (r.includes('vice')) return '/vice-dean';
    if (r.includes('rect')) return '/rector';
    if (r.includes('admin') || r.includes('super')) return '/admin';
    
    // Hiçbiri değilse Instructor
    return '/instructor';
};

export default function NewOutline() {
  const { user } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation(); 

  // --- 1. ROL VE YETKİ KONTROLÜ ---
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentRole, setCurrentRole] = useState(null); 
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
      const verifyUserRole = async () => {
          let token = null;
          let localUser = null;
          
          try {
              const tokensStr = localStorage.getItem('authTokens');
              if (tokensStr) token = JSON.parse(tokensStr).access;
              
              const userStr = localStorage.getItem('user');
              if (userStr) localUser = JSON.parse(userStr);
          } catch(e) { console.error("Storage Error:", e); }

          // Backend Kontrolü (En güvenlisi)
          if (token) {
              try {
                  const res = await api.get("/api/check-user-role/", {
                      headers: { Authorization: `Bearer ${token}` }
                  });
                  
                  setIsAdmin(res.data.is_admin);
                  setCurrentRole(res.data.role); 
                  setLoadingRole(false);
                  return;
              } catch (err) {
                  console.error("Backend rol kontrolü başarısız...", err);
              }
          }

          // Local Kontrol (Yedek)
          if (localUser) {
              const role = (localUser.role || localUser.profile?.role || "instructor").toLowerCase();
              const isSuper = localUser.is_superuser === true || String(localUser.is_superuser) === "true";
              const adminStatus = role === 'admin' || role === 'rectorate' || isSuper;
              
              setIsAdmin(adminStatus);
              setCurrentRole(role);
          }
          setLoadingRole(false);
      };

      verifyUserRole();
  }, []);

  const passedState = location.state?.courseToEdit || null;
  const courseId = passedState?.id || null;

  const [availableCourses, setAvailableCourses] = useState([]);
  const [assistants, setAssistants] = useState([]); 
  const [hasAssistant, setHasAssistant] = useState(false);

  // --- EVALUATION SEÇENEKLERİ ---
  const EVALUATION_OPTIONS = [
      { label: "Assignments", key: "assignments" },
      { label: "Quizzes", key: "quizzes" },
      { label: "Project", key: "project" },
      { label: "Participation", key: "participation" },
      { label: "Lab / App", key: "lab_eval" }, 
      { label: "Midterm Exam", key: "midterm" },
      { label: "Final Exam", key: "final" }
  ];

  // --- YARDIMCI FONKSİYONLAR ---
  const getLecturerName = (u) => {
      if (!u) return "";
      if (u.first_name && u.last_name) return `${u.first_name} ${u.last_name}`;
      return u.username || "";
  };

  const getLecturerOffice = (u) => {
      if (!u) return "";
      return u.office || u.office_location || (u.profile?.office) || "";
  };

  const safeStr = (val) => (val === null || val === undefined) ? "" : String(val);

  // --- INITIAL STATE ---
  const [data, setData] = useState({
      courseName: "", code: "", semester: "", theory: "", appLab: "", localCredit: "", ects: "",
      prereq: "", level: "", language: "English",
      lecturer: "", lecturerEmail: "", lecturerOffice: "", 
      assistant: "", assistantEmail: "", assistantOffice: "",
      gr1: "", gr2: "", gr3: "", officeHours: "",
      aims: "", content: "", outcomes: "",
      weeks: Array(16).fill({ subject: "", clo: "", task: "" }), 
      textbooks: "", 
      policies: "",
      status: "submitted" // Varsayılan statü
  });

  const [evaluations, setEvaluations] = useState([]);

  // --- 2. USER YÜKLENDİĞİNDE OTOMATİK DOLDUR ---
  useEffect(() => {
    let activeUser = user;
    if (!activeUser) {
        try { activeUser = JSON.parse(localStorage.getItem('user')); } catch(e){}
    }

    if (!courseId && activeUser) {
        setData(prev => ({
            ...prev,
            lecturer: prev.lecturer || getLecturerName(activeUser),
            lecturerEmail: prev.lecturerEmail || activeUser.email || "",
            lecturerOffice: prev.lecturerOffice || getLecturerOffice(activeUser)
        }));
    }
  }, [user, courseId]);

  // --- 3. VERİLERİ VE POLİTİKALARI ÇEK ---
  useEffect(() => {
    const fetchResources = async () => {
        try {
            const courseRes = await api.get("/api/courses/");
            setAvailableCourses(courseRes.data);
            
            try {
                const assistantRes = await api.get("/api/users/assistants/"); 
                setAssistants(assistantRes.data);
            } catch (e) {}

            if (!courseId) {
                try {
                    const settingsRes = await api.get("/api/system-settings/");
                    if (settingsRes.data && settingsRes.data.policies) {
                        setData(prev => ({ ...prev, policies: settingsRes.data.policies }));
                    }
                } catch (e) {
                    console.error("Politikalar çekilemedi:", e);
                }
            }
        } catch (err) { console.error("Veri çekme hatası:", err); }
    };
    fetchResources();
  }, [courseId]);

  // --- BACKEND VERİSİNİ DÖNÜŞTÜR ---
  const mapBackendToFrontend = (apiData) => {
    if (!apiData) return null;

    const loadedEvaluations = [];
    EVALUATION_OPTIONS.forEach(opt => {
        let rawVal = apiData[opt.key] || apiData[opt.label.toLowerCase()] || "";
        if (rawVal && rawVal !== "0" && rawVal !== 0) {
            let count = "";
            let percentage = "";
            if (String(rawVal).includes("|")) {
                const parts = String(rawVal).split("|");
                count = parts[0];
                percentage = parts[1];
            } else {
                percentage = String(rawVal);
            }
            loadedEvaluations.push({ type: opt.key, count, percentage: percentage });
        }
    });
    setEvaluations(loadedEvaluations);

    let loadedWeeks = (apiData.weeks && Array.isArray(apiData.weeks)) ? apiData.weeks : [];
    if (loadedWeeks.length < 16) {
        const missingCount = 16 - loadedWeeks.length;
        const emptyRows = Array(missingCount).fill({ subject: "", clo: "", task: "" });
        loadedWeeks = [...loadedWeeks, ...emptyRows];
    }

    let activeUser = user;
    if (!activeUser) {
        try { activeUser = JSON.parse(localStorage.getItem('user')); } catch(e){}
    }

    return {
        courseName: apiData.course_name || "", code: apiData.course_code || "", semester: apiData.semester || "",
        theory: safeStr(apiData.theory_hours), appLab: safeStr(apiData.lab_hours), localCredit: safeStr(apiData.local_credit), ects: safeStr(apiData.ects_credit),              
        aims: apiData.aims || "", content: apiData.content || "", outcomes: apiData.outcomes || "",
        prereq: apiData.prereq || "", level: apiData.level || "", language: apiData.language || "English",
        
        lecturer: apiData.lecturer_name || (activeUser ? getLecturerName(activeUser) : ""), 
        lecturerEmail: apiData.lecturer_email || (activeUser?.email || ""),
        lecturerOffice: apiData.lecturer_office || (activeUser ? getLecturerOffice(activeUser) : ""), 
        
        assistant: apiData.assistant_name || "", assistantEmail: apiData.assistant_email || "", assistantOffice: apiData.assistant_office || "",
        weeks: loadedWeeks, textbooks: apiData.textbooks || "",
        policies: apiData.policies || data.policies || "",
        status: apiData.status || "submitted" // Statüyü veritabanından alıyoruz
    };
  };

  // Edit Modu Verisi
  useEffect(() => {
    if (courseId) {
        const fetchLatestData = async () => {
            try {
                const url = "/api/outlines/" + courseId + "/";
                const response = await api.get(url);
                const mapped = mapBackendToFrontend(response.data);
                setData(prevData => ({ ...prevData, ...mapped }));
                if (mapped.assistant) setHasAssistant(true);
            } catch (error) { console.error("Veri güncellenemedi:", error); }
        };
        fetchLatestData();
    }
  }, [courseId]);

  // --- HANDLERS ---
  const handleCourseSelect = (e) => {
      const selectedId = e.target.value;
      if (!selectedId) return;
      const selectedCourse = availableCourses.find(c => c.id.toString() === selectedId.toString());
      if (selectedCourse) {
          const mappedData = mapBackendToFrontend(selectedCourse);
          
          let activeUser = user;
          if (!activeUser) { try { activeUser = JSON.parse(localStorage.getItem('user')); } catch(e){} }

          setData(prev => ({
              ...prev,
              ...mappedData,
              lecturer: mappedData.lecturer || (activeUser ? getLecturerName(activeUser) : ""),
              lecturerEmail: mappedData.lecturerEmail || (activeUser?.email || ""),
              lecturerOffice: mappedData.lecturerOffice || (activeUser ? getLecturerOffice(activeUser) : "")
          }));
      }
  };

  const handleAssistantSelect = (e) => {
      const selectedId = e.target.value;
      if (!selectedId) {
          setData(prev => ({ ...prev, assistant: "", assistantEmail: "", assistantOffice: "" }));
          return;
      }
      const selectedAssistant = assistants.find(a => a.id.toString() === selectedId.toString());
      if (selectedAssistant) {
          setData(prev => ({
              ...prev,
              assistant: `${selectedAssistant.first_name} ${selectedAssistant.last_name}`,
              assistantEmail: selectedAssistant.email,
              assistantOffice: selectedAssistant.office_location || ""
          }));
      }
  };

  const handleAssistantCheckbox = (e) => {
      const checked = e.target.checked;
      setHasAssistant(checked);
      if (!checked) setData(prev => ({ ...prev, assistant: "", assistantEmail: "", assistantOffice: "" }));
  };

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });
   
  const handleWeekChange = (index, field, value) => {
    const newWeeks = [...data.weeks];
    newWeeks[index] = { ...newWeeks[index], [field]: value };
    setData({ ...data, weeks: newWeeks });
  };

  const addEvaluationRow = () => { setEvaluations([...evaluations, { type: "", count: "", percentage: "" }]); };
  const removeEvaluationRow = (index) => { const newEvals = [...evaluations]; newEvals.splice(index, 1); setEvaluations(newEvals); };
  const handleEvaluationChange = (index, field, value) => { const newEvals = [...evaluations]; newEvals[index] = { ...newEvals[index], [field]: value }; setEvaluations(newEvals); };

  const totalPercentage = evaluations.reduce((acc, curr) => {
      const val = parseInt(curr.percentage);
      return acc + (isNaN(val) ? 0 : val);
  }, 0);

  // --- 🔥 GÜNCELLENMİŞ CLO KONTROL FONKSİYONU 🔥 ---
  const validateCLOs = () => {
      // 1. Ana CLO kutusu boş mu?
      if (!data.outcomes || data.outcomes.trim() === "") {
          return "Please fill out the 'CLOs' (Course Learning Outcomes) field.";
      }

      // 2. Ana CLO maddelerini analiz et
      const mainCLOText = data.outcomes;
      const definedCLOs = [];
      const lines = mainCLOText.split('\n');
      
      lines.forEach(line => {
          // Satırın başında sayı var mı? (örn: "1. Blabla" veya "2) Blabla")
          const match = line.trim().match(/^(\d+)[\.\)\s]/);
          if (match) definedCLOs.push(parseInt(match[1]));
      });

      if (definedCLOs.length === 0) {
          return "Invalid CLO format! Please number your outcomes:\n1. Outcome one\n2. Outcome two";
      }

      // 3. Haftalık tablodaki CLO'ları kontrol et
      for (let i = 0; i < data.weeks.length; i++) {
          const week = data.weeks[i];
          const weekCLOStr = week.clo || ""; 

          if (!weekCLOStr.trim()) continue; 

          const parts = weekCLOStr.split(/[ ,]+/);
          const seenInThisWeek = new Set(); // Bu hafta içinde tekrarı önlemek için

          for (let part of parts) {
              if (!part.trim()) continue;
              const num = parseInt(part);

              // Sayı değilse
              if (isNaN(num)) {
                  return `Week ${i + 1}: Invalid format '${part}'. Please use numbers only (e.g., 1, 2).`;
              }

              // Tanımlı değilse
              if (!definedCLOs.includes(num)) {
                  return `Week ${i + 1}: CLO '${num}' is not defined in the main list above!`;
              }

              // AYNI HAFTADA TEKRAR VARSA (İSTEĞİN ÜZERİNE EKLENDİ)
              if (seenInThisWeek.has(num)) {
                  return `Week ${i + 1}: CLO '${num}' is repeated! Each CLO should be listed only once per week.`;
              }
              seenInThisWeek.add(num);
          }
      }
      return null;
  };

  // --- SAVE AND SUBMIT LOGIC ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.code) { alert("Hata: Lütfen Code alanını doldurun."); return; }
    if (!data.courseName) { alert("Hata: Lütfen Course Name alanını doldurun."); return; }

    if (totalPercentage !== 100) {
        alert(`❌ Error: Total evaluation percentage must be 100%! Current total: ${totalPercentage}%`);
        return; 
    }

    // --- CLO KONTROLÜ (BURADA ÇAĞIRIYORUZ) ---
    const cloError = validateCLOs();
    if (cloError) {
        alert(`❌ CLO Error:\n${cloError}`);
        return; // Hata varsa kaydetme işlemini durdur
    }
    // -----------------------------------------

    let activeUser = user;
    if (!activeUser) {
        try { activeUser = JSON.parse(localStorage.getItem("user")); } catch(e){}
    }

    var instructorId = activeUser?.id ? parseInt(activeUser.id) : 1;
    let localDept = localStorage.getItem("department_id");
    var deptId = parseInt(activeUser?.department_id) || parseInt(localDept) || 1;
    const safeInt = (val) => (val === "" || val === null) ? 0 : parseInt(val) || 0;

    const evalData = { assignments: "0", quizzes: "0", project: "0", participation: "0", lab_eval: "0", midterm: "0", final: "0" };
    evaluations.forEach(item => {
        if (item.type && item.percentage) {
            const countStr = item.count ? String(item.count) : "";
            const valToSave = countStr ? `${countStr}|${item.percentage}` : item.percentage;
            evalData[item.type] = valToSave;
        }
    });

    // --- KRİTİK STATÜ MANTIĞI ---
    let finalStatus = 'submitted'; 
    const roleStr = String(currentRole || "").toLowerCase();
    const isManager = roleStr.includes('dean') || roleStr.includes('vice') || roleStr.includes('admin') || isAdmin;

    if (courseId) {
        if (isManager) {
            finalStatus = data.status; 
        } else {
            finalStatus = 'submitted';
        }
    } else {
        finalStatus = 'submitted';
    }

    const payload = {
        ...data,
        ...evalData, 
        instructor: instructorId,
        department: deptId,
        status: finalStatus, 
        course_name: data.courseName,
        course_code: data.code,
        theory_hours: safeInt(data.theory),        
        lab_hours: safeInt(data.appLab),            
        ects_credit: safeInt(data.ects),
        local_credit: safeInt(data.localCredit),
        lecturer_name: data.lecturer || getLecturerName(activeUser),
        lecturer_email: data.lecturerEmail || activeUser?.email,
        lecturer_office: data.lecturerOffice || getLecturerOffice(activeUser),
        assistant_name: hasAssistant ? data.assistant : "",
        assistant_email: hasAssistant ? data.assistantEmail : "",
        assistant_office: hasAssistant ? data.assistantOffice : "",
    };

    try {
      if (courseId) {
        await api.put("/api/outlines/" + courseId + "/", payload);
        if (isManager) {
             alert("✅ Changes have been saved! ");
        } else {
             alert("✅ Updated and resubmitted for approval (forwarded to Vice Dean)!");
        }
      } else {
        await api.post("/api/outlines/", payload);
        alert("✅ Ders Başarıyla Oluşturuldu ve Onaya Gönderildi!");
      }
      
      const roleToUse = currentRole || "instructor"; 
      const targetPath = getRedirectPath(roleToUse);
      
      console.log("🚀 Yönlendirirme (NewOutline):", roleToUse, "->", targetPath);
      navigate(targetPath);

    } catch (error) {
      console.error("Kayıt Hatası:", error);
      alert("HATA: " + JSON.stringify(error.response?.data || "Bilinmeyen Hata"));
    }
  };

  return (
    <div className="paper-container">
      <div className="a4-page">
        <div className="doc-header">
           <img src="https://www.final.edu.tr/success/fiulogo.jpg" alt="FIU" style={{height:'60px'}}/>
           <div className="uni-title">FINAL INTERNATIONAL<br/>UNIVERSITY</div>
        </div>
        <div className="doc-title">{courseId ? "EDIT COURSE OUTLINE" : "COURSE OUTLINE"}</div>
        <div className="red-bar"></div>

        <form onSubmit={handleSubmit}>
          
          <table className="outline-table">
            <tbody>
              <tr>
                <td style={{fontWeight:'bold', width:'15%'}}>Course Name</td>
                <td colSpan="5">
                  {courseId ? (
                      <input className="table-input" name="courseName" value={data.courseName} onChange={handleChange} required />
                  ) : (
                      <select className="table-input" onChange={handleCourseSelect} defaultValue="" required style={{fontWeight: 'bold'}}>
                        <option value="" disabled>Select a Course to Autofill...</option>
                        {availableCourses.map(c => (
                            <option key={c.id} value={c.id}>{c.course_code ? `${c.course_code} - ` : ""}{c.course_name || c.name}</option>
                        ))}
                      </select>
                  )}
                </td>
              </tr>
              
              {/* --- MOBIL FIX (GÜNCELLENDİ) --- */}
              <tr className="mobile-hide-row"><th>Code</th><th>Semester</th><th>Theory</th><th>App/Lab</th><th>Credit</th><th>ECTS</th></tr>
              {/* Buradaki height:30px'i sildik */}
              <tr>
                  <td><span className="mobile-label">Code:</span><input className="table-input" name="code" value={data.code} onChange={handleChange}/></td>
                  <td><span className="mobile-label">Semester:</span><input className="table-input" name="semester" value={data.semester} onChange={handleChange}/></td>
                  <td><span className="mobile-label">Theory:</span><input className="table-input" name="theory" value={data.theory} onChange={handleChange}/></td>
                  <td><span className="mobile-label">App/Lab:</span><input className="table-input" name="appLab" value={data.appLab} onChange={handleChange}/></td>
                  <td><span className="mobile-label">Credit:</span><input className="table-input" name="localCredit" value={data.localCredit} onChange={handleChange}/></td>
                  <td><span className="mobile-label">ECTS:</span><input className="table-input" name="ects" value={data.ects} onChange={handleChange}/></td>
              </tr>
              {/* ------------------------------- */}

              <tr><td style={{fontWeight:'bold'}}>Prerequisites:</td><td colSpan="2"><input className="table-input" name="prereq" value={data.prereq} onChange={handleChange}/></td><td style={{fontWeight:'bold'}}>Level:</td><td><input className="table-input" name="level" value={data.level} onChange={handleChange}/></td><td><select className="table-input" name="language" value={data.language} onChange={handleChange}><option>English</option><option>Turkish</option></select></td></tr>
              <tr><td style={{fontWeight:'bold'}}>Course Lecturer:</td><td colSpan="2"><input className="table-input" name="lecturer" value={data.lecturer} onChange={handleChange} style={{backgroundColor: '#f9fafb'}} /></td><td style={{fontWeight:'bold'}}>E-mail:</td><td><input className="table-input" name="lecturerEmail" value={data.lecturerEmail} onChange={handleChange} style={{backgroundColor: '#f9fafb'}}/></td><td><b>Office:</b> <input className="table-input" name="lecturerOffice" value={data.lecturerOffice} onChange={handleChange} style={{backgroundColor: '#f9fafb'}}/></td></tr>
              <tr><td style={{fontWeight:'bold'}}>Assistant: <input type="checkbox" style={{marginLeft:'5px'}} checked={hasAssistant} onChange={handleAssistantCheckbox} /></td><td colSpan="2">{hasAssistant ? (<select className="table-input" onChange={handleAssistantSelect} defaultValue=""><option value="" disabled>Select Assistant...</option>{assistants.map(ast => <option key={ast.id} value={ast.id}>{ast.first_name} {ast.last_name}</option>)}</select>) : <input className="table-input" value="None" disabled style={{backgroundColor:'#eee', color:'#999'}}/>}</td><td style={{fontWeight:'bold'}}>E-mail:</td><td><input className="table-input" name="assistantEmail" value={hasAssistant ? data.assistantEmail : ""} readOnly style={{backgroundColor: hasAssistant ? '#f3f4f6' : '#fff'}}/></td><td><b>Office:</b> <input className="table-input" name="assistantOffice" value={hasAssistant ? data.assistantOffice : ""} readOnly style={{backgroundColor: hasAssistant ? '#f3f4f6' : '#fff'}}/></td></tr>
              <tr><td style={{fontWeight:'bold', verticalAlign:'top'}}>Lecture Hours</td><td colSpan="2" style={{padding:0}}><div style={{borderBottom:'1px solid #000', padding:'4px'}}>Gr. 1 <input className="table-input" name="gr1" value={data.gr1} onChange={handleChange}/></div><div style={{borderBottom:'1px solid #000', padding:'4px'}}>Gr. 2 <input className="table-input" name="gr2" value={data.gr2} onChange={handleChange}/></div><div style={{padding:'4px'}}>Gr. 3 <input className="table-input" name="gr3" value={data.gr3} onChange={handleChange}/></div></td><td colSpan="2" style={{verticalAlign:'middle', fontWeight:'bold', textAlign:'center'}}>Office Hours</td><td style={{verticalAlign:'middle'}}><textarea className="table-textarea" name="officeHours" value={data.officeHours} onChange={handleChange}></textarea></td></tr>
              <tr><td style={{fontWeight:'bold'}}>Aims:</td><td colSpan="5"><textarea className="table-textarea" name="aims" value={data.aims} style={{height:'80px'}} onChange={handleChange}></textarea></td></tr>
              <tr><td style={{fontWeight:'bold'}}>Content:</td><td colSpan="5"><textarea className="table-textarea" name="content" value={data.content} style={{height:'80px'}} onChange={handleChange}></textarea></td></tr>
              
              {/* --- CLOs KISMI --- */}
              <tr>
                  <td style={{fontWeight:'bold'}}>CLOs:</td>
                  <td colSpan="5">
                      <textarea 
                        className="table-textarea" 
                        name="outcomes" 
                        value={data.outcomes} 
                        style={{height:'120px'}} 
                        onChange={handleChange} 
                        placeholder="1. Outcome one...&#10;2. Outcome two..."
                      ></textarea>
                  </td>
              </tr>
            </tbody>
          </table>
          <div style={{marginTop:'20px'}}></div>
          
          <table className="outline-table">
            <tbody>
                <tr><td colSpan="4" className="gray-header">EVALUATION</td></tr>
                <tr><td style={{fontWeight:'bold', width:'40%'}}>Semester Requirements</td><td style={{fontWeight:'bold', textAlign:'center', width:'20%'}}>Count</td><td style={{fontWeight:'bold', textAlign:'center', width:'30%'}}>Percentage (%)</td><td style={{fontWeight:'bold', textAlign:'center', width:'10%'}}>Action</td></tr>
                {evaluations.map((item, index) => (
                    <tr key={index}>
                        <td><select className="table-input" value={item.type} onChange={(e) => handleEvaluationChange(index, 'type', e.target.value)}><option value="" disabled>Select Assessment...</option>{EVALUATION_OPTIONS.map(opt => (<option key={opt.key} value={opt.key}>{opt.label}</option>))}</select></td>
                        <td><input type="number" className="table-input" style={{textAlign:'center'}} placeholder="Qty" value={item.count} onChange={(e) => handleEvaluationChange(index, 'count', e.target.value)} /></td>
                        <td><input type="number" className="table-input" style={{textAlign:'center'}} value={item.percentage} onChange={(e) => handleEvaluationChange(index, 'percentage', e.target.value)} /></td>
                        <td style={{textAlign:'center'}}><button type="button" onClick={() => removeEvaluationRow(index)} style={{background:'red', color:'white', border:'none', cursor:'pointer', padding:'2px 6px', borderRadius:'4px'}}>X</button></td>
                    </tr>
                ))}
                <tr><td colSpan="4" style={{textAlign:'center', padding:'5px'}}><button type="button" onClick={addEvaluationRow} style={{background:'#2563eb', color:'white', border:'none', padding:'5px 10px', borderRadius:'4px', cursor:'pointer'}}>+ Add Item</button></td></tr>
                <tr><td colSpan="2" style={{fontWeight:'bold', textAlign:'right', paddingRight:'10px'}}>Total</td><td style={{fontWeight:'bold', textAlign:'center', color: totalPercentage !== 100 ? 'red' : 'green'}}>{totalPercentage}%</td><td></td></tr>
            </tbody>
          </table>

          <div style={{marginTop:'20px'}}></div>
          
          <table className="outline-table">
            <tbody>
                <tr><td colSpan="4" className="gray-header">WEEKLY TOPICS TO BE COVERED</td></tr>
                <tr><th style={{width:'5%', textAlign:'center'}}>Week</th><th style={{width:'45%'}}>Subjects</th><th style={{width:'15%'}}>CLOs</th><th style={{width:'35%'}}>Tasks/Think Points for Private Study</th></tr>
                {data.weeks.map((week, index) => (
                    <tr key={index}>
                        <td style={{textAlign:'center', fontWeight:'bold', verticalAlign: 'middle'}}>{index + 1}</td>
                        {index === 15 ? (<td colSpan="3" style={{textAlign:'center', fontWeight:'bold', padding: '10px'}}>FINAL EXAMINATIONS</td>) : (
                             <>
                                <td><textarea className="table-textarea" style={{minHeight: '40px'}} value={week.subject} onChange={(e) => handleWeekChange(index, 'subject', e.target.value)}></textarea></td>
                                <td>
                                    <textarea 
                                        className="table-textarea" 
                                        style={{minHeight: '40px', textAlign: 'center'}} 
                                        value={week.clo} 
                                        onChange={(e) => handleWeekChange(index, 'clo', e.target.value)} 
                                        placeholder="1, 2"
                                    ></textarea>
                                </td>
                                <td><textarea className="table-textarea" style={{minHeight: '40px'}} value={week.task} onChange={(e) => handleWeekChange(index, 'task', e.target.value)}></textarea></td>
                             </>
                        )}
                    </tr>
                ))}
            </tbody>
          </table>

          <table className="outline-table" style={{marginTop:'20px'}}>
             <tbody>
                <tr><td style={{width:'20%', fontWeight:'bold'}}>Textbooks</td><td><textarea className="table-textarea" name="textbooks" value={data.textbooks} onChange={handleChange}></textarea></td></tr>
                <tr>
                    <td className="gray-header" colSpan="2" style={{backgroundColor: isAdmin ? '#e0f2fe' : '#e5e7eb'}}>
                        POLICIES {isAdmin ? '(Admin Mode: Editable)' : '(Read Only)'} 
                        {loadingRole && ' [Checking permissions...]'}
                    </td>
                </tr>
                <tr>
                    <td colSpan="2" style={{height:'350px'}}>
                        <textarea 
                            className="table-textarea" 
                            name="policies" 
                            value={data.policies} 
                            onChange={handleChange} 
                            style={{
                                height:'100%', 
                                backgroundColor: isAdmin ? '#ffffff' : '#f3f4f6', 
                                cursor: isAdmin ? 'text' : 'not-allowed', 
                                color: '#333', 
                                fontSize: '13px',
                                whiteSpace: 'pre-wrap'
                            }} 
                            readOnly={!isAdmin} 
                        ></textarea>
                    </td>
                </tr>
             </tbody>
          </table>

          <button type="submit" className="floating-save-btn">
              {courseId ? "💾 Update Outline" : "💾 Submit to Vice Dean"}
          </button>
        </form>
      </div>
    </div>
  );
}
