from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .models import Post
from .serializers import PostSerializer

@ensure_csrf_cookie
@api_view(['GET'])
@permission_classes([AllowAny])  # Only AllowAny for CSRF token access
def csrf_view(request):
    """Endpoint to set CSRF cookie"""
    return Response({'detail': 'CSRF cookie set'})

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])  # Require authentication for POST
def post_list(request):
    if request.method == 'GET':
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication required'}, status=401)
            
        serializer = PostSerializer(
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)