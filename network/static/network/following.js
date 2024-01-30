getFollowingPosts();

function getFollowingPosts() {
    const feed = document.querySelector('#feed');

    fetch('/following_posts')
    .then(response => response.json())
    .then(posts => {
        posts.forEach(post => {
            
            const postCard = document.createElement('div');
            postCard.classList.add('card', 'mb-2')
            const postBody = `
            <div class="card-body">
              <h5 class="card-title">
                <a href="/profile/${post.username}" class="link-body-emphasis link-offset-1 link-offset-1-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover">
                    @${post.username}
                </a>
              </h5>
              <p class="card-text">${post.content}</p>
              <h6 class="card-subtitle mb-2 text-body-secondary">${post.timestamp}</h6>
            </div>
            `;
            postCard.innerHTML = postBody;

            feed.appendChild(postCard);
        });
    })
};
