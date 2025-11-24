from rest_framework import serializers
from .models import Outline, OutlineVersion, ApprovalLog

class OutlineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Outline
        fields = '__all__'

# api/serializers.py içindeki ilgili kısmı bununla değiştir:

class OutlineVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = OutlineVersion
        fields = '__all__'
        # BU SATIRI EKLE: outline alanını "sadece okunabilir" yapıyoruz.
        # Böylece Postman'den göndermeni istemeyecek.
        read_only_fields = ['outline']

class ApprovalLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApprovalLog
        fields = '__all__'