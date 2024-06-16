from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.views.decorators.csrf import csrf_exempt 
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth.decorators import login_required

from django.core.paginator import Paginator, EmptyPage

from .models import User, Post, Follow

import json

def index(request):
    return render(request, "network/index.html")

@login_required
@csrf_exempt
def following(request):
    return render(request, "network/following.html")

def profile(request, username):
    return render(request, "network/profile.html", {"username": username})

@csrf_exempt
def all_posts(request):
    if request.method == "GET":
        posts_list = Post.objects.all().order_by('-timestamp')
        paginator = Paginator(posts_list, 10)
        page_number = request.GET.get('page', 1)
        num_pages = paginator.num_pages

        page_obj = paginator.get_page(page_number)

        data = {
            "page_number": page_number,
            "num_pages": num_pages,
            "posts": [ post.serialize() for post in page_obj ] if page_obj else []
        }
        
        return JsonResponse(data, safe=False, status=200)
    else:
        return JsonResponse({"error": "GET request required."}, status=405)

@login_required
@csrf_exempt
def new_post(request):
    if request.method == "POST":
        data = json.loads(request.body)
        content = data.get('content', '')

        if content:
            Post.objects.create(content=content, user=request.user)
            return JsonResponse({"detail": "Post created successfully."}, status=201)
        else:
            return JsonResponse({"error": "Content field required."}, status=400)
        

    else:
        return JsonResponse({"error": "POST request required."}, status=405)

@login_required
@csrf_exempt
def toggle_like(request, post_id):
    if request.method == "POST":

        try:
            post = Post.objects.get(id=post_id)

        except Post.DoesNotExist:
            return JsonResponse({"error": "Post not found."}, status=404)


        is_post_liked = request.user in post.likes.all()

        if is_post_liked:
            post.likes.remove(request.user)
            return JsonResponse({"detail": "Post has been disliked."}, status=200)
        else:
            post.likes.add(request.user)
            return JsonResponse({"detail": "Post has been liked."}, status=201)

    else:
        return JsonResponse({"error": "POST request required."}, status=405)

@login_required
@csrf_exempt
def edit_post(request, post_id):
    if request.method == "PUT":

        try:
            post = Post.objects.get(id=post_id, user=request.user)

        except Post.DoesNotExist:
            return JsonResponse({"error": "Post not found."}, status=404)

        data = json.loads(request.body)
        content = data.get('new_content', '')

        if content:
            post.content = content
            post.save()
            return JsonResponse({"detail": "Post has been modified."}, status=200)
        else:
            return JsonResponse({"error": "Content field required."}, status=400)


    else:
        return JsonResponse({"error": "PUT request required."}, status=405)

@login_required
@csrf_exempt
def following_posts(request):
    if request.method == "GET":
        
        follow_list = Follow.objects.filter(follower=request.user)

        posts_list = []

        for follow_instance in follow_list:
            user_posts = follow_instance.followed.posts.all().order_by('-timestamp')
            for post in user_posts:
                posts_list.append(post)
            
        paginator = Paginator(posts_list, 10)
        page_number = request.GET.get('page', 1)
        num_pages = paginator.num_pages

        page_obj = paginator.get_page(page_number)

        data = {
            "page_number": page_number,
            "num_pages": num_pages,
            "posts": [ post.serialize() for post in page_obj ] if page_obj else []
        }
        
        return JsonResponse(data, safe=False, status=200)
    else:
        return JsonResponse({"error": "GET request required."}, status=405)
    
@login_required
@csrf_exempt
def user_posts(request, username):
    if request.method == "GET":

        try:
            user = User.objects.get(username=username)

        except User.DoesNotExist:
            return JsonResponse({"error": "User not found."}, status=404)

        posts_list = user.posts.all().order_by('-timestamp')
        paginator = Paginator(posts_list, 10)
        page_number = request.GET.get('page', 1)
        num_pages = paginator.num_pages

        page_obj = paginator.get_page(page_number)

        data = {
            "page_number": page_number,
            "num_pages": num_pages,
            "posts": [ post.serialize() for post in page_obj ] if page_obj else []
        }
        
        return JsonResponse(data, safe=False, status=200)
    else:
        return JsonResponse({"error": "GET request required."}, status=405)

@login_required
@csrf_exempt
def user_profile(request, username):
    if request.method == "GET":
        
        try:
            user = User.objects.get(username=username)

        except User.DoesNotExist:
            return JsonResponse({"error": "User not found."}, status=404)

        data = {
            "id": user.id,
            "user": user.username,
            "bio": user.bio,
            "profile_picture": user.profile_picture.url,
            "posts_count": user.posts.count(),
            "followers_count": user.followers.count(),
            "following_count": user.following.count()
        }
        
        return JsonResponse(data, safe=False, status=200)
    else:
        return JsonResponse({"error": "GET request required."}, status=405)

@login_required
@csrf_exempt
def toggle_follow(request, username):
    if request.method == "POST":

        try:
            user = User.objects.get(username=username)

        except User.DoesNotExist:
            return JsonResponse({"error": "User not found."}, status=404)


        follow_instance, created = Follow.objects.get_or_create(follower=request.user, followed=user)

        if created:
            return JsonResponse({"detail": "User followed succesfully."}, status=201)
        else:
            follow_instance.delete()
            return JsonResponse({"detail": "User unfollowed succesfully."}, status=200)

    else:
        return JsonResponse({"error": "POST request required."}, status=405)

@csrf_exempt
def check_authentication_status(request):
    if request.method == "GET":
        
        if request.user.is_authenticated:
            return JsonResponse({"authenticated": True}, status=200)
        else:
            return JsonResponse({"authenticated": False}, status=200)



    else:
        return JsonResponse({"error": "GET request required."}, status=405)

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
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
