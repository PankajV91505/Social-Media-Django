from django.urls import path
from .views import csrf_view, post_list  # Make sure these match your view functions

urlpatterns = [
    path('csrf/', csrf_view, name='csrf'),
    path('posts/', post_list, name='post-list'),
]

# urls.py
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse

@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'detail': 'CSRF cookie set'})