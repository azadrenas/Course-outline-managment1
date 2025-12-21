from django.contrib import admin
from .models import UserProfile, Outline, OutlineVersion, ApprovalLog

admin.site.register(UserProfile)
admin.site.register(Outline)
admin.site.register(OutlineVersion)
admin.site.register(ApprovalLog)
