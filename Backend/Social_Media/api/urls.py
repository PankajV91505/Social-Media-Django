from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import register_user, post_list, post_detail

urlpatterns = [
    # Authentication routes
    path('register/', register_user, name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Post routes
    path('posts/', post_list, name='post-list'),
    path('posts/<int:pk>/', post_detail, name='post-detail'),
]
