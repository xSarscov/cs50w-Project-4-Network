import { Paginator } from "../components/Paginator.js";
import { PostList } from "../components/PostList.js";
import { fetchFollowingPosts } from "../helpers/apiFetch.js";

document.addEventListener("DOMContentLoaded", () => {

    const getFollowingPosts = async (page = 1) => {
        
        const feed = document.querySelector("#feed");
        feed.innerHTML = "";
        const {posts, page_number, num_page} = await fetchFollowingPosts(page);
        PostList(posts, feed, getFollowingPosts);
        Paginator(page_number, num_page, getFollowingPosts);

    }

    getFollowingPosts();
});