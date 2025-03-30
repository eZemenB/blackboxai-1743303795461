from django.contrib.auth.models import AbstractUser
from django.db import models
from projects.models import Campus, Collage, Department

class CustomUser(AbstractUser):
    campus = models.ForeignKey(Campus, on_delete=models.SET_NULL, null=True, blank=True)
    collage = models.ForeignKey(Collage, on_delete=models.SET_NULL, null=True, blank=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    
    def __str__(self):
        return self.get_full_name() or self.username