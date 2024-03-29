import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator

from .models import User, Post, Following, Like
from .forms import PostForm

def index(request):
    form = PostForm()
    return render(request, "network/index.html", {
        'form': form
    })

@login_required
def following(request):
    return render(request, "network/following.html")

@login_required
def profile(request, username):
    return render(request, "network/profile.html", {
        "username": username
    })

@login_required
def create_post(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            form = PostForm(data)
            
            if form.is_valid():
                content = form.cleaned_data['content']
                Post.objects.create(user=request.user, content=content)

                return JsonResponse({"message": "Post created successfully."}, status=201)
            else:
                return JsonResponse({
                "error": form.errors.get('content', 'Something went wrong. Please try again :c')
                }, status=400)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format in the request."}, status=400)
        
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)

def get_all_posts(request):
    posts = Post.objects.all().order_by('-timestamp')

    posts_paginator = Paginator(posts, 10)
    page_number = request.GET.get('page')
    page_obj = posts_paginator.get_page(page_number)

    serialized_posts = [post.serialize(request.user) for post in page_obj]

    return JsonResponse({
        'posts': serialized_posts,
        'total_pages': posts_paginator.num_pages,
        'is_current_user_authenticated': request.user.is_authenticated
    }, safe=False)

@login_required
def edit_post(request, post_id):
    if request.method == 'PUT':
        post = get_object_or_404(Post, id=post_id, user=request.user)

        if post.user == request.user:
            data = json.loads(request.body)
            new_content = data.get("content", "")
            post.content = new_content
            post.save()
            return JsonResponse({"new_content": new_content}, safe=False)
        else:
            return HttpResponse(status=403)
        
    return HttpResponse(status=403)


@login_required
def get_following_posts(request):
    followed_users = User.objects.filter(followers__follower=request.user)
    posts = Post.objects.filter(user__in=followed_users)
    return JsonResponse([post.serialize() for post in posts], safe=False)

@login_required
def get_profile(request, username):

    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return JsonResponse({"error": "This account doesn’t exist. Try searching for another."}, status=400)

    is_owner = user == request.user

    profile = {
        "is_owner": is_owner,
        "name": user.first_name,
        "username": user.username,
        "bio": user.biography if user.biography else 'No bio yet' ,
        "posts_number": user.posts.count(),
        "followers": user.followers.count(),
        "following": user.following.count(), 
        "posts": [post.serialize(request.user) for post in user.posts.all()],
    }

    if not is_owner:
        is_following = Following.objects.filter(follower=request.user, following=user)
        profile.update({"is_following": True if is_following else False})
    
    return JsonResponse(profile, safe=False)

@login_required
def toggle_follow(request, username):
    if request.method == 'PUT':
        user_profile = get_object_or_404(User, username=username)

        if user_profile != request.user:
            follow, created = Following.objects.get_or_create(follower=request.user, following=user_profile)

            if created:
                is_following = True
            else:
                follow.delete()
                is_following = False

            result = {
                "followers_count": user_profile.followers.count(),
                "is_following": is_following
            }

            return JsonResponse(result, safe=False)
        else:
            HttpResponse(status=403)

    else:
        return JsonResponse({
            "error": "GET request required."
        }, status=400)

@login_required
def toggle_like(request, post_id):
    if request.method == 'PUT':
        post_target = get_object_or_404(Post, id=post_id)
        
        like, created = Like.objects.get_or_create(post_liked=post_target, user=request.user)

        if created:
            is_liked = True
        else:
            like.delete()
            is_liked = False

        likes_count = post_target.likes.count()

        result = {
            "likes_count": likes_count,
            "is_liked": is_liked
        }

        return JsonResponse(result, safe=False)
    
    else:
        return JsonResponse({
            "error": "PUT request required."
        }, status=400)
        
# Auth
def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        name = request.POST["name"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password, first_name=name)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
