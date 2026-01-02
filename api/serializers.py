from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Outline, OutlineVersion, Department, UserProfile, SystemSetting 

# --- USER SERIALIZER (GÜÇLENDİRİLMİŞ & OFİS EKLENDİ) ---
class UserSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()
    # Frontend'in 'user.office_location' olarak erişebilmesi için buraya ekledik:
    office_location = serializers.SerializerMethodField()

    class Meta:
        model = User
        # 'office_location' alanını fields listesine ekledik
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined', 'profile', 'office_location']

    def get_office_location(self, obj):
        """
        Bu fonksiyon ofis bilgisini bulmaya çalışır.
        Önce User modeline bakar, yoksa Profile modeline bakar.
        """
        # 1. Durum: Eğer ofis bilgisi direkt User modeline eklenmişse (Custom User)
        if hasattr(obj, 'office_location') and obj.office_location:
            return str(obj.office_location)
        
        # 2. Durum: Eğer ofis bilgisi Profile modelindeyse
        if hasattr(obj, 'profile'):
            # Profile içinde 'office' alanı varsa onu döndür (Yeni eklediğimiz alan)
            if hasattr(obj.profile, 'office') and obj.profile.office:
                return str(obj.profile.office)
            # Veya 'office_location' diye kayıtlıysa onu döndür (Eski alan adı ihtimaline karşı)
            if hasattr(obj.profile, 'office_location') and obj.profile.office_location:
                return str(obj.profile.office_location)
            
        return "" # Bulamazsa boş döner

    def get_profile(self, obj):
        # Profil verisini güvenli çekelim
        if hasattr(obj, 'profile'):
            dept_name = "No Department"
            faculty_name = ""
            
            # Eğer departmanı varsa ismini al
            if obj.profile.department:
                dept_name = obj.profile.department.name
                # Eğer departmanın fakültesi varsa onu da al
                if obj.profile.department.faculty:
                    faculty_name = obj.profile.department.faculty.name

            # Ofis bilgisini burada da bulalım (Yedek olarak profile içine de koyuyoruz)
            office_val = ""
            if hasattr(obj.profile, 'office'):
                office_val = obj.profile.office
            elif hasattr(obj.profile, 'office_location'):
                office_val = obj.profile.office_location

            return {
                'role': obj.profile.role,
                'department_id': obj.profile.department.id if obj.profile.department else None,
                'department_name': dept_name, 
                'faculty_name': faculty_name,
                'office_location': office_val
            }
            
        # Profil yoksa varsayılan boş veri
        return {
            'role': 'instructor',
            'department_id': None,
            'department_name': 'Unassigned',
            'faculty_name': '',
            'office_location': ''
        }

# --- DEPARTMENT SERIALIZER ---
class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name']

# --- OUTLINE SERIALIZER ---
class OutlineSerializer(serializers.ModelSerializer):
    department = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(), 
        required=False, 
        allow_null=True
    )
    instructor = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), 
        required=False, 
        allow_null=True
    )

    department_name = serializers.CharField(source='department.name', read_only=True)
    faculty_name = serializers.CharField(source='department.faculty.name', read_only=True)
    
    # Hoca Adı ve Ofisi (Otomatik Doldurma İçin Helper Alanlar)
    lecturer_name = serializers.SerializerMethodField()
    lecturer_email = serializers.SerializerMethodField()
    lecturer_office = serializers.SerializerMethodField()

    class Meta:
        model = Outline
        fields = '__all__'

    # --- Hoca Bilgilerini Çekmek İçin Helper Metotlar ---
    def get_lecturer_name(self, obj):
        # Eğer Outline modelinde lecturer_name kayıtlıysa onu dön, yoksa ilişkiden çek
        if hasattr(obj, 'lecturer_name') and obj.lecturer_name:
             return obj.lecturer_name # Eğer modelde varsa
             
        if obj.instructor:
            if obj.instructor.first_name:
                return f"{obj.instructor.first_name} {obj.instructor.last_name}"
            return obj.instructor.username
        return ""

    def get_lecturer_email(self, obj):
        return obj.instructor.email if obj.instructor else ""

    def get_lecturer_office(self, obj):
        # 1. Önce Outline tablosunda kayıtlı "lecturer_office" alanına bak (Daha önce kaydedilmişse)
        if obj.lecturer_office:
            return obj.lecturer_office
        
        # 2. Yoksa, Hocanın profilinden taze çekmeye çalış
        if obj.instructor and hasattr(obj.instructor, 'profile'):
            if hasattr(obj.instructor.profile, 'office') and obj.instructor.profile.office:
                return obj.instructor.profile.office
            if hasattr(obj.instructor.profile, 'office_location') and obj.instructor.profile.office_location:
                return obj.instructor.profile.office_location
        return ""

    # --- KRAL DOKUNUŞU v2: KURŞUN GEÇİRMEZ ID KONTROLÜ ---
    def to_internal_value(self, data):
        data = data.copy()

        # Kontrol edilecek alanlar
        fields_to_check = {
            'department': Department,
            'instructor': User
        }

        # 1. İlişkisel Alanları Kontrol Et (ID var mı yok mu?)
        for field, model in fields_to_check.items():
            if field in data:
                value = data[field]
                
                # Değer boşsa None yap
                if value == "" or value == "null" or value is None:
                    data[field] = None
                else:
                    try:
                        pk = int(value)
                        # KRAL HAMLE: Veritabanında bu ID var mı?
                        if not model.objects.filter(pk=pk).exists():
                            # ID veritabanında yoksa, hata verme, BOŞ YAP.
                            data[field] = None 
                    except ValueError:
                        # Sayı değilse boş yap
                        data[field] = None

        # 2. Diğer sayısal alanları temizle (Kredi, Saat vs.)
        other_ints = ['theory_hours', 'lab_hours', 'local_credit', 'ects_credit']
        for field in other_ints:
             if field in data:
                if data[field] == "" or data[field] is None:
                    data[field] = 0

        return super().to_internal_value(data)

# --- OUTLINE VERSION SERIALIZER ---
class OutlineVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = OutlineVersion
        fields = '__all__'
        # --- serializers.py DOSYASININ EN ALTI ---

class SystemSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemSetting
        fields = '__all__'
