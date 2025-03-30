from django.db import models
from django.core.exceptions import ValidationError
import uuid
from accounts.models import CustomUser

class Status(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Campus(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, unique=True)

    def __str__(self):
        return self.name

class Collage(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, unique=True)
    campus = models.ForeignKey(Campus, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Department(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, unique=True)
    collage = models.ForeignKey(Collage, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Project(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted for Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('completed', 'Completed'),
    ]
    
    project_id = models.CharField(max_length=50, unique=True, default=uuid.uuid4)
    title = models.CharField(max_length=200)
    campus = models.ForeignKey(Campus, on_delete=models.CASCADE)
    collage = models.ForeignKey(Collage, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    status = models.ForeignKey(Status, on_delete=models.CASCADE)
    approval_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='created_projects')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    approver = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_projects')
    rejection_reason = models.TextField(blank=True, null=True)
    
    # JSON fields for step data
    basic_info = models.JSONField(blank=True, null=True)
    funding_details = models.JSONField(blank=True, null=True)
    team_members = models.JSONField(blank=True, null=True)
    project_documents = models.JSONField(blank=True, null=True)
    agreements = models.JSONField(blank=True, null=True)
    timelines = models.JSONField(blank=True, null=True)
    reports = models.JSONField(blank=True, null=True)
    resources = models.JSONField(blank=True, null=True)
    risks = models.JSONField(blank=True, null=True)
    publications = models.JSONField(blank=True, null=True)
    funders = models.JSONField(blank=True, null=True)
    
    # Completion tracking
    completion_status = models.JSONField(default=dict, blank=True)
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        self.update_completion_status()
        super().save(*args, **kwargs)
    
    def update_completion_status(self):
        completion = {
            'basic_info': bool(self.basic_info),
            'funding_details': bool(self.funding_details),
            'team_members': bool(self.team_members),
            'project_documents': bool(self.project_documents),
            'agreements': bool(self.agreements),
            'timelines': bool(self.timelines),
            'reports': bool(self.reports),
            'resources': bool(self.resources),
            'risks': bool(self.risks),
            'publications': bool(self.publications),
            'funders': bool(self.funders),
        }
        self.completion_status = completion
    
    def get_completion_percentage(self):
        if not self.completion_status:
            return 0
        completed = sum(1 for step, complete in self.completion_status.items() if complete)
        total = len(self.completion_status)
        return int((completed / total) * 100) if total > 0 else 0
    
    def submit_for_approval(self):
        if self.get_completion_percentage() == 100:
            self.approval_status = 'submitted'
            self.save()
            return True
        return False
    
    class Meta:
        ordering = ['-created_at']