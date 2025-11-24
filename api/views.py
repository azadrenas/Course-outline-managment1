from rest_framework import generics
from .models import Outline, OutlineVersion
from .serializers import OutlineSerializer, OutlineVersionSerializer, ApprovalLogSerializer

# --- 1. DERS TASLAKLARI (OUTLINES) ---

# [GET] List All Outlines (Hepsini listele)
# [POST] Create New Outline (Yeni oluştur)
class OutlineListCreateView(generics.ListCreateAPIView):
    queryset = Outline.objects.all()
    serializer_class = OutlineSerializer

# [GET] Single Outline (Tek bir dersi getir)
# [PUT/PATCH] Update Outline (Güncelle)
# [DELETE] (Sil)
class OutlineDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Outline.objects.all()
    serializer_class = OutlineSerializer

# --- 2. VERSİYONLAR (VERSIONS) ---

# [GET] Bir dersin tüm versiyonlarını listele
# [POST] Bir derse yeni versiyon ekle
class OutlineVersionListCreateView(generics.ListCreateAPIView):
    serializer_class = OutlineVersionSerializer

    def get_queryset(self):
        # URL'den gelen 'outline_id'ye göre filtrele
        # Yani sadece o dersin versiyonlarını getir
        outline_id = self.kwargs['outline_id']
        return OutlineVersion.objects.filter(outline_id=outline_id)

    def perform_create(self, serializer):
        # Yeni versiyon oluştururken, onu otomatik olarak ilgili derse bağla
        outline_id = self.kwargs['outline_id']
        outline = Outline.objects.get(id=outline_id)
        serializer.save(outline=outline)
