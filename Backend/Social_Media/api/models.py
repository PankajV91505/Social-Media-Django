from django.db import models
from django.utils import timezone

class Post(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    reactions = models.IntegerField(default=0)
    tags = models.JSONField(default=list)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.IntegerField(default=1)  # Simple user reference

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']