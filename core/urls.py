from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Burası çok önemli: /api/ ile başlayan her isteği
    # bizim az önce oluşturduğumuz api/urls.py dosyasına gönderiyoruz.
    path('api/', include('api.urls')),
]