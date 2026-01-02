from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes 
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated 
from rest_framework.views import APIView 
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.db.models import Count, Q 

# --- JWT LOGIN ---
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# --- IMPORT KISMI ---
# SystemSetting modelini ekledik
from .models import Outline, OutlineVersion, Department, UserProfile, SystemSetting
# SystemSettingSerializer'ı ekledik
from .serializers import (
    OutlineSerializer, 
    OutlineVersionSerializer, 
    UserSerializer, 
    DepartmentSerializer,
    SystemSettingSerializer
)

# --- 1. ÖZEL LOGIN LOGIC (GÜNCELLENDİ: Superuser Bilgisi Eklendi) ---
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # 1. Standart User Bilgileri
        data['user_id'] = self.user.id
        data['id'] = self.user.id
        data['username'] = self.user.username
        data['email'] = self.user.email
        
        # --- KRAL DOKUNUŞU: IS_SUPERUSER BİLGİSİ ---
        # Bu satır sayesinde Frontend senin Admin olduğunu anlıyor!
        data['is_superuser'] = self.user.is_superuser
        # --------------------------------------------
        
        # --- AUTOFILL İÇİN: İsim ve Soyisim ---
        data['first_name'] = self.user.first_name
        data['last_name'] = self.user.last_name
        
        try:
            profile = self.user.profile 
            data['role'] = profile.role           
            data['department_id'] = profile.department.id if profile.department else None
            
            # --- AUTOFILL İÇİN: Ofis Bilgisi (Kapsamlı Kontrol) ---
            office_val = ""
            if hasattr(profile, 'office') and profile.office:
                office_val = profile.office
            elif hasattr(profile, 'office_location') and profile.office_location:
                office_val = profile.office_location
            
            # Frontend her iki isimle de arasa bulsun diye ikisini de gönderiyoruz
            data['office'] = office_val
            data['office_location'] = office_val
            
        except:
            # Profil yoksa varsayılanlar
            data['role'] = 'instructor'           
            data['department_id'] = None
            data['office'] = ""
            data['office_location'] = ""
            
        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# --- 2. OUTLINE İŞLEMLERİ ---
class OutlineListCreateView(generics.ListCreateAPIView):
    queryset = Outline.objects.all()
    serializer_class = OutlineSerializer

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(instructor=self.request.user)
        else:
            serializer.save()

class OutlineDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Outline.objects.all()
    serializer_class = OutlineSerializer
    permission_classes = [AllowAny] 

class OutlineVersionListCreateView(generics.ListCreateAPIView):
    serializer_class = OutlineVersionSerializer
    
    def get_queryset(self):
        outline_id = self.kwargs.get('outline_id')
        return OutlineVersion.objects.filter(outline_id=outline_id)

    def perform_create(self, serializer):
        outline = Outline.objects.get(pk=self.kwargs.get('outline_id'))
        serializer.save(outline=outline)


# --- 3. KULLANICI LİSTELERİ (HOCA & ASİSTAN) ---

class InstructorListView(generics.ListAPIView):
    queryset = User.objects.filter(profile__role='instructor')
    serializer_class = UserSerializer

class AssistantListView(generics.ListAPIView):
    # Asistan listesi: Sadece rolü 'assistant' olanlar
    queryset = User.objects.filter(profile__role='assistant')
    serializer_class = UserSerializer

class DepartmentListView(generics.ListAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer


# --- 4. STATİK DATA, ONAY VE DERS LİSTESİ ---

# --- DERS LİSTESİ (FULL DATA) ---
@api_view(['GET'])
@permission_classes([AllowAny])
def get_course_list(request):
    # Dropdown seçildiğinde tüm alanlar dolsun diye full data gönderiyoruz
    outlines = Outline.objects.all()
    serializer = OutlineSerializer(outlines, many=True)
    return Response(serializer.data)
# --------------------------------

@api_view(['GET'])
def course_sections_view(request):
    data = [
        { "id": 101, "code": "CMPE101", "name": "Intro to Programming", "section": "1", "room": "LAB-204", "day": "Monday", "time": "09:00 - 12:00", "enrolled": 42, "capacity": 50, "color": "#1d4ed8" },
        { "id": 102, "code": "CMPE101", "name": "Intro to Programming", "section": "2", "room": "LAB-101", "day": "Tuesday", "time": "14:00 - 17:00", "enrolled": 18, "capacity": 50, "color": "#c8102e" },
    ]
    return Response(data)

@api_view(['POST'])
def submit_outline(request, pk):
    outline = get_object_or_404(Outline, pk=pk)
    outline.status = 'submitted' 
    outline.save()
    return Response({'message': 'Submitted successfully', 'status': outline.status})

@api_view(['POST'])
def approve_outline(request, pk):
    outline = get_object_or_404(Outline, pk=pk)
    if outline.status == 'submitted':
        outline.status = 'vice_approved'
        message = 'Approved by Vice Dean. Now waiting for Dean.'
    elif outline.status == 'vice_approved':
        outline.status = 'approved'
        message = 'Final approval by Dean. Course is live.'
    else:
        outline.status = 'approved'
        message = 'Course approved.'
    outline.save()
    return Response({'message': message, 'status': outline.status})

@api_view(['POST'])
def reject_outline(request, pk):
    outline = get_object_or_404(Outline, pk=pk)
    reason_text = request.data.get('reason', '') 
    outline.status = 'rejected'
    outline.rejection_reason = reason_text 
    outline.save()
    return Response({
        'message': 'Rejected successfully', 
        'status': outline.status,
        'reason': outline.rejection_reason
    })

@api_view(['PUT'])
def mark_version_final(request, pk):
    return Response({'message': f'Version {pk} marked as final'})


# --- 4.5 YENİ EKLENEN: SİSTEM AYARLARI (POLICIES İÇİN) ---
@api_view(['GET'])
@permission_classes([AllowAny])
def get_system_settings(request):
    # ID=1 olan ayarı çek, yoksa varsayılanlarla oluştur
    setting, created = SystemSetting.objects.get_or_create(id=1)
    serializer = SystemSettingSerializer(setting)
    return Response(serializer.data)
# ---------------------------------------------------------


# --- 5. STAFF STATS VIEW ---
class StaffStatsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        total_staff = User.objects.count()
        active_instructors = User.objects.annotate(outline_count=Count('outlines')).filter(outline_count__gt=0).count()
        total_departments = Department.objects.count()
        dept_stats = Department.objects.annotate(staff_count=Count('members')).order_by('-staff_count')

        distribution_data = []
        colors = ["#2563eb", "#0891b2", "#0d9488", "#ca8a04", "#64748b", "#7c3aed", "#db2777"]
        for index, dept in enumerate(dept_stats):
            distribution_data.append({
                "name": dept.name,          
                "count": dept.staff_count, 
                "color": colors[index % len(colors)]
            })

        roles_data = [
            {"name": "Instructor", "value": UserProfile.objects.filter(role='instructor').count(), "fill": "#3b82f6"},
            {"name": "Dean", "value": UserProfile.objects.filter(role='dean').count(), "fill": "#8b5cf6"},
            {"name": "Vice Dean", "value": UserProfile.objects.filter(role='vice_dean').count(), "fill": "#10b981"},
            {"name": "Admin/Other", "value": UserProfile.objects.filter(role__in=['admin', 'rectorate']).count(), "fill": "#6b7280"},
        ]
        roles_data = [r for r in roles_data if r['value'] > 0]

        top_instructors = User.objects.annotate(outline_count=Count('outlines')).filter(outline_count__gt=0).order_by('-outline_count')[:5]
        top_performers_data = []
        for u in top_instructors:
            role = "N/A"
            dept = "N/A"
            if hasattr(u, 'profile'):
                role = u.profile.get_role_display()
                if u.profile.department:
                    dept = u.profile.department.name
            top_performers_data.append({
                "name": f"{u.first_name} {u.last_name}" if u.first_name else u.username,
                "role": role,
                "dept": dept,
                "publications": u.outline_count
            })

        return Response({
            "totalStaff": total_staff,
            "activeInstructors": active_instructors, 
            "totalDepartments": total_departments,    
            "rolesDistribution": roles_data,          
            "departmentDistribution": distribution_data,
            "topPerformers": top_performers_data
        })


# --- 6. ADMIN KULLANICI YÖNETİMİ ---
class AdminUserListView(generics.ListCreateAPIView):
    permission_classes = [AllowAny] 
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

@api_view(['PUT'])
@permission_classes([AllowAny]) 
def admin_update_user(request, pk):
    user = get_object_or_404(User, pk=pk)
    data = request.data
    profile, created = UserProfile.objects.get_or_create(user=user)
    if 'role' in data: profile.role = data['role']
    if 'department_id' in data:
        if data['department_id']: 
            dept = get_object_or_404(Department, pk=data['department_id'])
            profile.department = dept
        else: 
            profile.department = None
    
    # Eğer Admin panelinden ofis güncelleniyorsa onu da kaydet
    if 'office' in data:
        profile.office = data['office']
        
    profile.save()
    return Response({'message': 'User updated successfully'})

@api_view(['DELETE'])
@permission_classes([AllowAny])
def admin_delete_user(request, pk):
    try:
        user = get_object_or_404(User, pk=pk)
        if user.is_superuser:
            return Response({'error': 'Super Admin cannot be deleted!'}, status=400)
        Outline.objects.filter(instructor=user).update(instructor=None)
        user.delete() 
        return Response({'message': 'User deleted successfully'})
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
@permission_classes([AllowAny]) 
def admin_create_user(request):
    data = request.data
    if not data.get('username') or not data.get('password'):
        return Response({'error': 'Username and Password are required'}, status=400)
    if User.objects.filter(username=data['username']).exists():
        return Response({'error': 'Username already exists'}, status=400)
    try:
        user = User.objects.create_user(
            username=data['username'],
            email=data.get('email', ''),
            password=data['password'],
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', '')
        )
        role = data.get('role', 'instructor')
        profile, created = UserProfile.objects.get_or_create(user=user)
        profile.role = role
        if data.get('department_id'):
            dept = get_object_or_404(Department, pk=data['department_id'])
            profile.department = dept
        
        # Admin yeni user oluştururken Ofis girerse kaydet
        if 'office' in data:
            profile.office = data['office']

        profile.save()
        return Response({'message': 'User created successfully', 'id': user.id})
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
@permission_classes([AllowAny])
def admin_reset_password(request, pk):
    user = get_object_or_404(User, pk=pk)
    new_password = request.data.get('password')
    if not new_password or len(new_password) < 4:
        return Response({'error': 'Password must be at least 4 characters'}, status=400)
    user.set_password(new_password)
    user.save()
    return Response({'message': f'Password for {user.username} has been reset successfully.'})
# --- backend/api/views.py EN ALTI ---

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_user_role(request):
    """
    Frontend Context gecikirse, yetkiyi buradan teyit ederiz.
    """
    user = request.user
    role = 'instructor'
    if hasattr(user, 'profile'):
        role = user.profile.role
    
    # Admin, Rektör veya Superuser ise TRUE döner
    is_admin = role in ['admin', 'rectorate'] or user.is_superuser
    
    return Response({
        'is_admin': is_admin,
        'role': role,
        'username': user.username,
        'email': user.email
    })
