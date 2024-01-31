
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("following", views.following, name="following"),

    # API routes
    path("posts", views.get_all_posts, name="posts"),
    path("create_post", views.create_post, name="create_post"),
    path("following_posts", views.get_following_posts, name="following_posts"),
    path("get_profile/<str:username>", views.get_profile, name="get_profile"),
    path("toggle_follow/<str:username>", views.toggle_follow, name="toggle_follow"),
    
    path("<str:username>", views.profile, name="profile"),
]
