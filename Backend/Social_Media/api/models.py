from django.db import models
from django.contrib.auth.models import User

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    body = models.TextField()
    reactions = models.PositiveIntegerField(default=0)
    tags = models.JSONField(default=list)
    
    created_at = models.DateTimeField(auto_now_add=True)  # ✅ Created date
    updated_at = models.DateTimeField(auto_now=True)      # ✅ Updated every time post is saved

    def __str__(self):
        return self.title
