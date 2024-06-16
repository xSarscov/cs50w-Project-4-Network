
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("profile/<str:username>", views.profile, name="profile"),
    path("following", views.following, name="following"),

    path("api/check_authentication_status/", views.check_authentication_status, name="check_authentication_status"),

    path("api/posts/all_posts/", views.all_posts, name="all_posts"),
    path("api/posts/new/", views.new_post, name="new_post"),
    path("api/posts/<int:post_id>/toggle_like/", views.toggle_like, name="toggle_like"),
    path("api/posts/<int:post_id>/edit/", views.edit_post, name="edit_post"),
    path("api/posts/following", views.following_posts, name="following_posts"),
    path("api/posts/<str:username>/", views.user_posts, name="user_posts"),
    path("api/profile/<str:username>/", views.user_profile, name="user_profile"),
    path("api/profile/<str:username>/toggle_follow/", views.toggle_follow, name="toggle_follow"),
]
