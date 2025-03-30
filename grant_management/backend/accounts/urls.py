from django.urls import path
from rest_framework_simplejwt.views import TokenVerifyView
from .views import UserRegistrationView, UserProfileView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]