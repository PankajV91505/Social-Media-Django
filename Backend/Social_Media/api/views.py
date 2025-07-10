from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.http import JsonResponse
from django.core.mail import send_mail
from .models import Post, OTP, CustomUser
from .serializers import PostSerializer, SignupSerializer
import random
import traceback

# ✅ CSRF Token for frontend
@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'detail': 'CSRF cookie set'})


# ✅ Send OTP to email
def send_otp_email(email):
    otp = str(random.randint(100000, 999999))
    OTP.objects.create(email=email, otp_code=otp)

    send_mail(
        subject='Your OTP Code',
        message=f'Your OTP is {otp}. It will expire in 10 minutes.',
        from_email='your@email.com',  # Use a verified sender (e.g., SMTP Mailtrap)
        recipient_list=[email],
        fail_silently=False
    )


# ✅ Request Signup with OTP
@api_view(['POST'])
@permission_classes([AllowAny])
def request_signup(request):
    serializer = SignupSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']

        # Save user data temporarily
        request.session['pending_user'] = serializer.validated_data

        # Send OTP
        send_otp_email(email)
        return Response({'message': 'OTP sent to email'}, status=200)

    return Response(serializer.errors, status=400)


# ✅ Verify OTP & Create User
@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    try:
        email = request.data.get('email')
        otp_input = request.data.get('otp')

        otp = OTP.objects.filter(email=email).latest('created_at')

        if not otp.is_valid():
            return Response({'error': 'OTP expired'}, status=400)

        if otp.otp_code != otp_input:
            return Response({'error': 'Invalid OTP'}, status=400)

        # Fetch pending signup data
        user_data = request.session.get('pending_user')

        if user_data and user_data['email'] == email:
            serializer = SignupSerializer(data=user_data)
            if serializer.is_valid():
                user = serializer.save()
                user.is_verified = True
                user.is_active = True  # ✅ Allow login after OTP
                user.save()
                del request.session['pending_user']
                return Response({'message': 'User created successfully'}, status=201)

        return Response({'error': 'Session invalid or email mismatch'}, status=400)

    except Exception as e:
        traceback.print_exc()
        return Response({'error': str(e)}, status=500)


# ✅ Get or create posts (authenticated)
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def post_list(request):
    if request.method == 'GET':
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = PostSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(user=request.user)  # ✅ Assign current user
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


# ✅ View, update or delete a single post
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def post_detail(request, pk):
    try:
        post = Post.objects.get(pk=pk)
    except Post.DoesNotExist:
        return Response({'detail': 'Post not found'}, status=404)

    if post.user != request.user:
        return Response({'detail': 'You do not have permission to modify this post.'}, status=403)

    if request.method == 'GET':
        serializer = PostSerializer(post)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = PostSerializer(post, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        post.delete()
        return Response(status=204)
