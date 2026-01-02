from django.db import models
from django.contrib.auth.models import User

# 0. YENİ MODEL: FAKÜLTELER (Faculties)
class Faculty(models.Model):
    name = models.CharField(max_length=150, unique=True, verbose_name="Faculty Name")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Faculties"

# 1. BÖLÜMLER (Departments) - GÜNCELLENDİ
class Department(models.Model):
    # Fakülte Bağlantısı (Yeni)
    faculty = models.ForeignKey(
        Faculty, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='departments'
    )
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        # Admin panelinde "Fakülte - Departman" şeklinde görünsün
        if self.faculty:
            return f"{self.faculty.name} - {self.name}"
        return self.name

# 2. OUTLINE (DERS TASLAĞI)
class Outline(models.Model):
    department = models.ForeignKey('Department', on_delete=models.SET_NULL, null=True, blank=True, related_name='outlines')
    
    # --- TEMEL KİMLİK BİLGİLERİ ---
    course_code = models.CharField(max_length=20, db_index=True) 
    semester = models.CharField(max_length=20, db_index=True)     
    course_name = models.CharField(max_length=255, verbose_name="Course Name")
    
    instructor = models.ForeignKey(User, on_delete=models.PROTECT, related_name="outlines")

    # --- KREDİ VE SAAT DETAYLARI ---
    theory_hours = models.CharField(max_length=10, blank=True, null=True)
    lab_hours = models.CharField(max_length=10, blank=True, null=True)
    local_credit = models.CharField(max_length=10, blank=True, null=True)
    ects_credit = models.CharField(max_length=10, blank=True, null=True)
    
    # --- DERS DETAYLARI ---
    prereq = models.CharField(max_length=100, blank=True, null=True)
    level = models.CharField(max_length=50, blank=True, null=True)
    language = models.CharField(max_length=50, default="English")
    
    # --- HOCA VE ASİSTAN DETAYLARI ---
    lecturer_office = models.CharField(max_length=100, blank=True, null=True)
    
    assistant_name = models.CharField(max_length=100, blank=True, null=True)
    assistant_email = models.EmailField(blank=True, null=True)
    assistant_office = models.CharField(max_length=100, blank=True, null=True)

    # --- UZUN METİN ALANLARI ---
    aims = models.TextField(blank=True, null=True)
    content = models.TextField(blank=True, null=True)
    outcomes = models.TextField(blank=True, null=True)
    
    # --- HAFTALIK PROGRAM (JSON) ---
    weeks = models.JSONField(default=list, blank=True, null=True)

    # --- DEĞERLENDİRME SİSTEMİ ---
    assignments = models.CharField(max_length=10, blank=True, null=True)
    quizzes = models.CharField(max_length=10, blank=True, null=True)
    project = models.CharField(max_length=10, blank=True, null=True)
    participation = models.CharField(max_length=10, blank=True, null=True)
    lab_eval = models.CharField(max_length=10, blank=True, null=True)
    midterm = models.CharField(max_length=10, blank=True, null=True)
    final = models.CharField(max_length=10, blank=True, null=True)

    # --- DİĞER ---
    textbooks = models.TextField(blank=True, null=True)
    policies = models.TextField(blank=True, null=True)

    # --- ONAY AKIŞI ---
    STATUS_CHOICES = [
        ('draft', 'Draft'),                      # Hoca henüz düzenliyor
        ('submitted', 'Submitted to Vice Dean'), # Hoca gönderdi, Vice Dean ekranına düşecek
        ('vice_approved', 'Approved by Vice Dean'), # Vice Dean onayladı, Dean ekranına düşecek
        ('approved', 'Final Approved'),          # Dean onayladı, herkes görebilir (Rektör dahil)
        ('rejected', 'Rejected'),                # Reddedildi, Hoca düzeltecek
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')

    # --- RED SEBEBİ ALANI ---
    rejection_reason = models.TextField(blank=True, null=True)

    test_file = models.FileField(upload_to='test_uploads/', blank=True, null=True)

    final_version = models.OneToOneField(
        'OutlineVersion', 
        on_delete=models.SET_NULL, 
        related_name='final_for_outline', 
        null=True, 
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.course_code} ({self.semester}) - {self.course_name}"

    class Meta:
        unique_together = ('course_code', 'semester')

# 3. VERSİYON MODELİ
class OutlineVersion(models.Model):
    outline = models.ForeignKey(Outline, on_delete=models.CASCADE, related_name="versions")
    version_number = models.PositiveIntegerField()
    content = models.JSONField(default=dict)
    syllabus_file = models.FileField(upload_to='syllabuses/%Y/%m/', null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('outline', 'version_number')
        ordering = ['-version_number'] 

    def __str__(self):
        return f"{self.outline.course_code} - Version {self.version_number}"

# 4. ONAY LOGLARI
class ApprovalLog(models.Model):
    version = models.ForeignKey(OutlineVersion, on_delete=models.CASCADE, related_name="logs")
    actor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    
    ACTION_CHOICES = [
        ('submitted', 'Submitted'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('commented', 'Commented'), 
    ]
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    notes = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.version.outline.course_code} (v{self.version.version_number}) - {self.action} by {self.actor.username}"

# 5. KULLANICI PROFİLİ - (GÜNCELLENDİ: Assistant Rolü Eklendi)
class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('rectorate', 'Rectorate'),
        ('dean', 'Dean'),
        ('vice_dean', 'Vice Dean'),
        ('admin', 'Admin'),
        ('instructor', 'Instructor'),
        # --- YENİ EKLENEN ROL ---
        ('assistant', 'Assistant'),
        # ------------------------
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='instructor')
    
    department = models.ForeignKey(
        Department, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='members'
    )
    
    # --- YENİ EKLENEN OFİS ALANI ---
    office = models.CharField(max_length=50, blank=True, null=True, help_text="Örn: A-204")
    # -------------------------------

    def __str__(self):
        return f"{self.user.username} - {self.role}"

# --- api/models.py DOSYASININ EN ALTI ---

class SystemSetting(models.Model):
    # Akademik Yıl (Örn: 2023-2024)
    academic_year = models.CharField(max_length=20, default="2023-2024")
    
    # Aktif Dönem (Güz, Bahar, Yaz)
    semester = models.CharField(
        max_length=20, 
        choices=[('Fall', 'Fall'), ('Spring', 'Spring'), ('Summer', 'Summer')],
        default='Fall'
    )
    
    # Son Teslim Tarihi (Outline Girişleri İçin)
    submission_deadline = models.DateField(null=True, blank=True)
    
    # Bakım Modu (Sistemi Kilitlemek İçin)
    maintenance_mode = models.BooleanField(default=False)

    # --- KRAL DOKUNUŞU: SABİT POLİTİKA METNİ (VARSAYILAN) ---
    DEFAULT_POLICY_TEXT = """1. Attendance: In accordance with FIU regulations, minimum 70% attendance is compulsory for theoretical courses, and 80% for practical courses. Students are strongly advised not to miss any lecture hours since success is closely associated with attendance. Therefore, you are expected to attend all classes and not to miss any lecture hours without an acceptable excuse. You are responsible for compensating any work which has been left behind. Unexcused absence of lecture hours on a continual basis will result in a grade "NG".

2. Academic Honesty and Plagiarism: You are expected to be familiar with and to follow the policies on academic integrity. Copying from another student’s paper or from another text in the examination is cheating. Your exams and assignments must be solely your own work. Any attempt to represent the work of others as your own without a proper reference will be considered as plagiarism. Cheating in exams and plagiarism are disciplinary offences and disciplinary actions are taken.

3. Make-Up Exams: Please note that you may only allowed to take a make-up exam for the midterm and final exams if you provide an acceptable excuse. If a student feels sick on an exam day, he needs to provide a doctor’s report to verify his condition. No make-up is given for quizzes or projects. Late submissions of projects, presentations problem sets, assignment or similar other assessments may may not be accepted or a grade cap can be applied. If that is the case, then you will be informed on your assessment guideline.

For more detailed information:
Regulations for Education, Exemptions and Success
https://www.final.edu.tr/photos/2024_2025/OgretimSinavveBasariYonetmeligi_ENG.pdf

Academic Integrity Document:
https://www.final.edu.tr/ckfinder/userfiles/files/Academic%20Integrity.pdf

Student Discipline Regulation:
https://www.final.edu.tr/ckfinder/userfiles/files/Regulations%20for%20Student%20Disciplinary%20Code.pdf"""

    policies = models.TextField(default=DEFAULT_POLICY_TEXT, verbose_name="Default Policies")

    def __str__(self):
        return f"System Config ({self.academic_year} - {self.semester})"
