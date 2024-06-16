from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    bio = models.TextField(default="No bio")
    profile_picture = models.ImageField(upload_to="profile_pictures", default='default_profile_picture.jpg')

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    content = models.TextField()
    likes = models.ManyToManyField(User)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} posted '{ self.content[:11] + '...' if len(self.content) > 10 else self.content }' "
    
    def serialize(self):
        return {
            "id": self.id,
            "user": self.user.username,
            "content": self.content,
            "likes": self.likes.count(),
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
        }

class Follow(models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name="following")
    followed = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followers")
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.follower} followed {self.followed}"
    
