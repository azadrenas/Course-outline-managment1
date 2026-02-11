from django.db import models

from django.contrib.auth.models import User



class Outline(models.Model):
    
    course_code = models.CharField(max_length=20, db_index=True) 
    semester = models.CharField(max_length=20, db_index=True)     

    title = models.CharField(max_length=255) 
    

    instructor = models.ForeignKey(User, on_delete=models.PROTECT, related_name="outlines")

    STATUS_CHOICES = [
        ('draft', 'Draft'),                      
        ('pending_approval', 'Pending Approval'), 
        ('approved', 'Approved'),                
        ('rejected', 'Rejected'),                
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')


    final_version = models.OneToOneField(
        'OutlineVersion', 
        on_delete=models.SET_NULL, 
        related_name='final_for_outline', 
        null=True, 
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.course_code} ({self.semester}) - {self.title}"

    class Meta:

        unique_together = ('course_code', 'semester')




class OutlineVersion(models.Model):

    outline = models.ForeignKey(Outline, on_delete=models.CASCADE, related_name="versions")
    
    version_number = models.PositiveIntegerField()


    content = models.JSONField(default=dict)


    syllabus_file = models.FileField(upload_to='syllabuses/%Y/%m/', null=True, blank=True)


    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
    
        unique_together = ('outline', 'version_number')
        ordering = ['-version_number'] 

    def __str__(self):
        return f"{self.outline.course_code} - Version {self.version_number}"



class ApprovalLog(models.Model):

    version = models.ForeignKey(OutlineVersion, on_delete=models.CASCADE, related_name="logs")
    
    actor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    
    ACTION_CHOICES = [
        ('submitted', 'Submitted'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('commented', 'Commented'), 
    ]
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    

    notes = models.TextField(blank=True, null=True)
    
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.version.outline.course_code} (v{self.version.version_number}) - {self.action} by {self.actor.username}"