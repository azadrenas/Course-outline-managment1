from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from django.shortcuts import get_object_or_404
from .views import (
    OutlineListCreateView, 
    OutlineDetailView, 
    OutlineVersionListCreateView, 
    course_sections_view
)
from .views import (
    OutlineListCreateView, 
    OutlineDetailView, 
    OutlineVersionListCreateView, 
    course_sections_view,
    # Yeni eklediklerimiz:
    submit_outline,
    approve_outline,
    reject_outline,
    mark_version_final,
)

urlpatterns = [
    # --- LOGIN YOLU ---
    # React buraya POST isteği atacak: http://127.0.0.1:8000/api/login/
    path('login/', obtain_auth_token, name='api_token_auth'), 

    # --- OUTLINE YOLLARI ---
    # GET: Listele, POST: Yeni Ekle
    path('outlines/', OutlineListCreateView.as_view(), name='outline-list-create'),
    
    # GET/PUT/DELETE: Tek bir outline detayı
    path('outlines/<int:pk>/', OutlineDetailView.as_view(), name='outline-detail'),
    
    # Version işlemleri
    path('outlines/<int:outline_id>/versions/', OutlineVersionListCreateView.as_view(), name='outline-version-list'),
    
    # Statik Ders Bölümleri (React tablosu için)
    path('course-sections/', course_sections_view, name='course-sections'),
    path('outlines/<int:pk>/submit/', submit_outline, name='outline-submit'),
    path('outlines/<int:pk>/approve/', approve_outline, name='outline-approve'),
    path('outlines/<int:pk>/reject/', reject_outline, name='outline-reject'),
    path('versions/<int:pk>/mark-final/', mark_version_final, name='version-mark-final'),
    
]

