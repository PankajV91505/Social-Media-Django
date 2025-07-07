# api/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Post

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # Make user read-only in API
    
    class Meta:
        model = Post
        fields = '__all__'
    
    def create(self, validated_data):
        # Automatically set the user to the current authenticated user
        validated_data['user'] = User.objects.get(id=1)
        return super().create(validated_data)