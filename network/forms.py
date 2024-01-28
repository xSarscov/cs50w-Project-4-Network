from django import forms
from .models import Post

class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['content']
        labels = {
            'content': 'New Post'
        }
        widgets = {
            'content': forms.Textarea(attrs={'class': 'form-control', 'rows': 1, 'placeholder': 'What is happening?!'})
        }