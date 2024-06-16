import { Paginator } from "../components/Paginator.js";
import { PostList } from "../components/PostList.js";
import { UserProfile } from "../components/UserProfile.js";
import { fetchUserPosts, fetchUserProfile } from "../helpers/apiFetch.js";

document.addEventListener('DOMContentLoaded', () => {
    const getUserProfile = async() => {
        const userProfile = await fetchUserProfile(username);
        UserProfile(userProfile, getUserProfile);
    }

    const getUserPosts = async(page = 1) => {
        const { posts, page_number, num_pages } = await fetchUserPosts(username, page);
        
        const feed = document.querySelector('#feed');
        feed.innerHTML = "";

        PostList(posts, feed, getUserPosts);
        Paginator(page_number, num_pages, getUserPosts);
    }
    
    getUserProfile();
    getUserPosts();
});