from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    biography = models.CharField(max_length=150, blank=True, null=True)

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            "id": self.id,
            "username": self.user.username,
            "content": self.content,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p")
        }

    def __str__(self) -> str:
        return f'{self.user.username} - {self.timestamp.strftime("%b %d %Y, %I:%M %p")}'

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post_liked = models.ForeignKey(Post, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f'{self.user.username} likes {self.post_liked.content} at {self.timestamp.strftime("%b %d %Y, %I:%M %p")}'
    
class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f'{self.user.username} said "{self.post.content} at {self.timestamp.strftime("%b %d %Y, %I:%M %p")}'

class Following (models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name='following')
    following = models.ForeignKey(User, on_delete=models.CASCADE, related_name='followers')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.follower.username} follows {self.following.username} since {self.timestamp.strftime("%b %d %Y, %I:%M %p")}'

