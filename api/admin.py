from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import UserProfile, Outline, OutlineVersion, ApprovalLog, Department, Faculty

# 1. FAKÜLTE ADMİNİ
@admin.register(Faculty)
class FacultyAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    list_display_links = ('id', 'name')
    search_fields = ('name',)

# 2. DEPARTMAN ADMİNİ
@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'faculty') 
    list_display_links = ('id', 'name')
    list_filter = ('faculty',) 
    search_fields = ('name',)

# 3. KULLANICI PROFİLİ (INLINE AYARI) - BURASI DEĞİŞTİ
# UserProfile'ı tek başına göstermek yerine, User sayfasının içine gömüyoruz.
class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Extra Profile Information (Role, Dept, Office)'
    fk_name = 'user'

# Standart User Admin'i genişletiyoruz
class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,) # Profili içeri göm
    
    # Kullanıcı listesinde Rol, Departman ve Ofis de görünsün
    list_display = ('username', 'email', 'first_name', 'last_name', 'get_role', 'get_department', 'get_office')
    list_select_related = ('profile', ) # Performans için

    def get_role(self, instance):
        return instance.profile.role
    get_role.short_description = 'Role'

    def get_department(self, instance):
        return instance.profile.department
    get_department.short_description = 'Department'

    def get_office(self, instance):
        return instance.profile.office
    get_office.short_description = 'Office'

# Eski User panelini kaldırıp, bizim yeni süper User panelini kaydediyoruz
admin.site.unregister(User)
admin.site.register(User, UserAdmin)

# 4. OUTLINE ADMİNİ
@admin.register(Outline)
class OutlineAdmin(admin.ModelAdmin):
    list_display = ('course_code', 'course_name', 'instructor', 'department', 'status')
    list_display_links = ('course_code', 'course_name')
    list_filter = ('status', 'department', 'semester')
    search_fields = ('course_code', 'course_name', 'instructor__username')

# 5. DİĞERLERİ
admin.site.register(OutlineVersion)
admin.site.register(ApprovalLog)
# UserProfile'ı yukarıda User içine gömdüğümüz için burada tekrar register etmeye gerek yok.
