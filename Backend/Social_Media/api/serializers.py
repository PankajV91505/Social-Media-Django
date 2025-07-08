from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Post

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class PostSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    user = UserSerializer(read_only=True)  # Nested user data

    class Meta:
        model = Post
        fields = '__all__'

    def create(self, validated_data):
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            validated_data["user"] = request.user
        return super().create(validated_data)
