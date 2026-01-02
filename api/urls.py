from django.urls import path
from .views import (
    MyTokenObtainPairView, 
    OutlineListCreateView, 
    OutlineDetailView,
    InstructorListView,
    AssistantListView, 
    DepartmentListView,
    submit_outline,
    approve_outline, 
    reject_outline,
    StaffStatsView,
    get_course_list,
    # --- ADMIN VIEW'LARI ---
    AdminUserListView,
    admin_update_user,
    admin_delete_user,
    admin_create_user,
    admin_reset_password,
    # --- YENİ EKLENENLER (POLICIES & ROLE CHECK) ---
    get_system_settings,
    check_user_role
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # --- AUTHENTICATION ---
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # --- ROLE CHECK (KRAL HAMLE: KESİN YETKİ KONTROLÜ) ---
    # Frontend Context gecikirse buradan teyit alacağız
    path('check-user-role/', check_user_role, name='check-user-role'),

    # --- SYSTEM SETTINGS (POLITIKALAR İÇİN) ---
    path('system-settings/', get_system_settings, name='system-settings'),

    # --- DERS LİSTESİ (DROPDOWN İÇİN) ---
    path('courses/', get_course_list, name='get_course_list'),

    # --- OUTLINES (DERS PLANLARI) ---
    path('outlines/', OutlineListCreateView.as_view(), name='outline-list'),
    path('outlines/<int:pk>/', OutlineDetailView.as_view(), name='outline-detail'),

    # --- ONAY İŞLEMLERİ (APPROVE/REJECT) ---
    path('outlines/<int:pk>/submit/', submit_outline, name='submit-outline'),
    path('outlines/<int:pk>/approve/', approve_outline, name='approve-outline'),
    path('outlines/<int:pk>/reject/', reject_outline, name='reject-outline'),

    # --- LISTELER & İSTATİSTİKLER ---
    path('instructors/', InstructorListView.as_view(), name='instructors'),
    
    # --- ASİSTAN LİSTESİ ---
    path('users/assistants/', AssistantListView.as_view(), name='assistant-list'),
    
    path('departments/', DepartmentListView.as_view(), name='departments'),
    path('staff-stats/', StaffStatsView.as_view(), name='staff-stats'),

    # --- ADMIN KULLANICI YÖNETİMİ ---
    path('admin/users/', AdminUserListView.as_view(), name='admin-user-list'),
    path('admin/users/<int:pk>/update/', admin_update_user, name='admin-user-update'),
    path('admin/users/<int:pk>/delete/', admin_delete_user, name='admin-user-delete'),
    path('admin/users/create/', admin_create_user, name='admin-user-create'),
    path('admin/users/<int:pk>/reset-password/', admin_reset_password, name='admin-user-reset-password'),
]
