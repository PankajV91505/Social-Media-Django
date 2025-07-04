from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Post
from .serializers import PostSerializer
import logging

logger = logging.getLogger(__name__)

@ensure_csrf_cookie
@api_view(['GET'])
@permission_classes([AllowAny])
def csrf_view(request):
    return Response({'detail': 'CSRF cookie set'})

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def post_list(request):
    if request.method == 'GET':
        try:
            posts = Post.objects.all().order_by('-created_at')
            serializer = PostSerializer(posts, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error fetching posts: {str(e)}")
            return Response(
                {'error': 'Could not retrieve posts'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    elif request.method == 'POST':
        try:
            # Ensure required fields are present
            if not request.data.get('title') or not request.data.get('body'):
                return Response(
                    {'error': 'Title and body are required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Process tags if provided
            post_data = request.data.copy()
            if 'tags' in post_data and isinstance(post_data['tags'], str):
                post_data['tags'] = [tag.strip() for tag in post_data['tags'].split() if tag.strip()]

            serializer = PostSerializer(data=post_data)
            
            if serializer.is_valid():
                # Basic duplicate check
                if Post.objects.filter(
                    title=serializer.validated_data['title'],
                    body=serializer.validated_data['body']
                ).exists():
                    return Response(
                        {'error': 'Duplicate post'},
                        status=status.HTTP_409_CONFLICT
                    )
                
                post = serializer.save()
                return Response(
                    PostSerializer(post).data,
                    status=status.HTTP_201_CREATED
                )
            
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exception as e:
            logger.error(f"Error creating post: {str(e)}", exc_info=True)
            return Response(
                {'error': 'Internal server error'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )