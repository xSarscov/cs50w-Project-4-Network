import { Post } from "./Post.js";

export const PostList = (posts, feed, refreshComponent) => {
    posts.forEach(async(post) => {
        const postItem = await Post(post, refreshComponent);
        feed.append(postItem);
    });

}