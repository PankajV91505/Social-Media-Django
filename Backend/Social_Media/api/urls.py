from django.urls import path
from .views import csrf_view, post_list

urlpatterns = [
    path('csrf/', csrf_view, name='csrf'),
    path('posts/', post_list, name='post-list'),
]