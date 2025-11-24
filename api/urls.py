from django.urls import path
from .views import OutlineListCreateView, OutlineDetailView, OutlineVersionListCreateView

urlpatterns = [
    # 1. Tüm dersleri listele veya yeni ders oluştur
    # Adres: /api/outlines/
    path('outlines/', OutlineListCreateView.as_view()),

    # 2. Tek bir dersi getir, güncelle veya sil
    # Adres: /api/outlines/1/  (1 yerine ID gelecek)
    path('outlines/<int:pk>/', OutlineDetailView.as_view()),

    # 3. Bir dersin versiyonlarını listele veya yeni versiyon ekle
    # Adres: /api/outlines/1/versions/
    path('outlines/<int:outline_id>/versions/', OutlineVersionListCreateView.as_view()),
]