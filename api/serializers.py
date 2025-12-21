from rest_framework import serializers
from .models import Outline, OutlineVersion, ApprovalLog

class OutlineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Outline
        fields = '__all__'
        read_only_fields = ['user', 'status']

class OutlineVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = OutlineVersion
        fields = '__all__'
        read_only_fields = ['outline']

class ApprovalLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApprovalLog
        fields = '__all__'
