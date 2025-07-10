from django.urls import path
from .views import (
    request_signup,
    verify_otp,
    get_csrf_token,
    post_list,
    post_detail
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # JWT Auth
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # OTP Signup
    path("request-signup/", request_signup, name="request_signup"),
    path("verify-otp/", verify_otp, name="verify_otp"),
    path("csrf/", get_csrf_token, name="get_csrf_token"),

    # Posts
    path("posts/", post_list, name="post-list"),
    path("posts/<int:pk>/", post_detail, name="post-detail"),
]
