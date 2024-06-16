import { Paginator } from "../components/Paginator.js";
import { PostList } from "../components/PostList.js";
import { fetchAllPosts, fetchNewPost } from "../helpers/apiFetch.js"

document.addEventListener('DOMContentLoaded', () => {
    const getAllPosts = async(page = 1) => {
        const feed = document.querySelector("#feed");
        feed.innerHTML = "";
        const {posts, page_number, num_page} = await fetchAllPosts(page);
        PostList(posts, feed, getAllPosts);
        Paginator(page_number, num_page, getAllPosts);
    }

    const form = document.querySelector("#new-post-form");
    form.addEventListener('submit', async(event) => {
        event.preventDefault();

        const content = form.querySelector("#content").value;
        const response = await fetchNewPost(content);
        console.log(response);
        getAllPosts();
    });

    getAllPosts();
})