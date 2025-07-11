from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import (
    get_csrf_token,
    request_signup,
    verify_otp,
    forgot_password_request,
    reset_password,
    post_list,
    post_detail,
)

urlpatterns = [
    # ✅ JWT Authentication
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # ✅ CSRF (for React frontend if using Session Auth or CSRF)
    path("csrf/", get_csrf_token, name="csrf"),

    # ✅ Signup (with OTP)
    path("request-signup/", request_signup, name="request-signup"),
    path("verify-otp/", verify_otp, name="verify-otp"),

    # ✅ Forgot Password (OTP + Reset)
    path("forgot-password/", forgot_password_request, name="forgot-password"),
    path("reset-password/", reset_password, name="reset-password"),
    # urls.py
    path("request-password-reset/", forgot_password_request, name="request-password-reset"),
 

    # ✅ Posts
    path("posts/", post_list, name="post-list"),
    path("posts/<int:pk>/", post_detail, name="post-detail"),
]
