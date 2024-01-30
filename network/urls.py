
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("profile/<str:username>", views.profile, name="profile"),
    path("following", views.following, name="following"),

    # API routes
    path("posts", views.get_all_posts, name="posts"),
    path("create_post", views.create_post, name="create_post"),
    path("following_posts", views.get_following_posts, name="following_posts"),
    
]
