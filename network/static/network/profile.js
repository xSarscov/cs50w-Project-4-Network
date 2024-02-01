const profileName = document.querySelector('#profile-name');
const username = profileName.dataset.username;
const profileUsername = document.querySelector('#profile-username');
const profilePageContainer = document.querySelector('#profile');
const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value

fetch(`/get_profile/${username}`)
.then(response => response.json())
.then(profile => {

    if (profile.error) {
        profileName.innerHTML = profile.error;
        return;
    }

    profileName.innerHTML = profile.name;
    profileUsername.innerHTML = '@' + profile.username;

    

    const profilePage = document.createElement('div');

    const profilePageBody = `
    <div class="px-4 d-flex flex-column align-items-end text-center stats">
        ${!profile.is_owner ? ` 
            <div class="mb-0">
                <button class="btn btn-light rounded-pill" id="follow">${profile.is_following ? 'Unfollow' : 'Follow'}</button>
            </div>` : ''
        }
        <ul class="list-inline mb-0">
            <li class="list-inline-item">
                <h5 class="font-weight-bold mb-0 d-block">${profile.posts_number}</h5>
                <small class="text-muted"> <i class="fas fa-image mr-1"></i>Posts</small>
            </li>
            <li class="list-inline-item">
                <h5 class="font-weight-bold mb-0 d-block" id="followers">${profile.followers}</h5>
                <small class="text-muted"> <i class="fas fa-user mr-1"></i>Followers</small>
            </li>
            <li class="list-inline-item">
                <h5 class="font-weight-bold mb-0 d-block">${profile.following}</h5>
                <small class="text-muted"> <i class="fas fa-user mr-1"></i>Following</small>
            </li>
        </ul>
    </div>
    <div class="px-4 py-3 ">
        <h5 class="mb-0">About</h5>
        <div class="py-4 rounded shadow-sm">
            <p class="font-italic mb-0">${profile.bio}</p>
        </div>
    </div>
    
    <hr>

    <div class="py-4 px-4">
        
        <div class="d-flex align-items-center justify-content-between mb-3">
            <h5 class="mb-0">Recent posts</h5>
        </div>
        <div class="row" id="posts-container">
        </div>
    </div>
    `;
    profilePage.innerHTML = profilePageBody;

    
    profilePageContainer.appendChild(profilePage);
    
    const postsContainer = document.querySelector('#posts-container');
    profile.posts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.classList.add('card', 'mb-2')
        const postBody = document.createElement('div');
        postBody.classList.add('card-body');
        postBody.innerHTML =  `
            <h5 class="card-title">
                <a href="/${post.username}" class="link-body-emphasis link-offset-1 link-offset-1-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover">
                    @${post.username}
                </a>
            </h5>
            <p class="card-text">${post.content}</p>
            <h6 class="card-subtitle mb-2 text-body-secondary">${post.timestamp}</h6>

        `;

        const editButton = document.createElement('button');
        editButton.classList.add('btn', 'btn-primary', 'mt-2')
        editButton.textContent = 'Edit';
        editButton.setAttribute('data-bs-toggle', 'modal');
        editButton.setAttribute('data-bs-target', '#exampleModal');
        
        editButton.addEventListener('click', () => {
            const modal = document.querySelector('#modal-body');
            const editContentTextArea = `
            <div class="form-floating mb-2">
                <textarea class="form-control" placeholder="Edit your post" id="floatingTextarea2">${post.content}</textarea>
                <label for="floatingTextarea2">Edit your post</label>
            </div>
            `;
            modal.innerHTML = editContentTextArea;

            const saveButton = document.querySelector('#save');
            saveButton.addEventListener('click', () => {
                const textAreaContent = document.querySelector('#floatingTextarea2').value;
                
                fetch(`/edit_post/${post.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken 
                    },
                    body: JSON.stringify({
                        content: textAreaContent
                    })
                })
                .then(response => response.json())
                .then(result => {
                    postBody.innerHTML = `
                    <h5 class="card-title">
                        <a href="/${post.username}" class="link-body-emphasis link-offset-1 link-offset-1-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover">
                            @${post.username}
                        </a>
                    </h5>
                    <p class="card-text">${result.new_content}</p>
                    <h6 class="card-subtitle mb-2 text-body-secondary">${post.timestamp}</h6>
                    <button type="button" class="btn btn-primary" id="edit">Edit</button>
                `;
                })
            })
            
        });


        const likeSection = document.createElement('div');
        const likeCount = document.createElement('span');
        likeCount.classList.add('card-text', 'ms-1');
        likeCount.textContent = `${post.likes} Likes`;

        const likeButton = document.createElement('button');
        likeButton.classList.add('btn', 'py-1', 'px-2');
        likeButton.innerHTML = post.is_liked_by_current_user ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#ff0000" class="bi bi-heart-fill like" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
        </svg>`
        :
        `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-heart like" viewBox="0 0 18 18">
        <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
        </svg>`;
        likeButton.addEventListener('click', () => {
            fetch(`/toggle_like/${post.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken 
                }
            })
            .then(response => response.json())
            .then(result => {
                likeButton.innerHTML = result.is_liked ? 
                `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#ff0000" class="bi bi-heart-fill like" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                </svg>`
                :
                `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-heart like" viewBox="0 0 16 16">
                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
                </svg>`;

                likeCount.innerHTML = `${result.likes_count} Likes`;
            })
        });

        likeSection.appendChild(likeButton);
        likeSection.appendChild(likeCount);

        postBody.appendChild(likeSection);
        postBody.appendChild(editButton);
        postCard.appendChild(postBody);
        postsContainer.appendChild(postCard);
    });

    if (!profile.is_owner) {

        const followButton = document.querySelector('#follow');
    
        followButton.addEventListener('click', () => {
            fetch(`/toggle_follow/${profile.username}`)
            .then(response => response.json())
            .then(result => {
                const followerCount = document.querySelector('#followers');
                followerCount.innerHTML = result.followers_count;
                followButton.innerHTML = result.is_following ? 'Unfollow' : 'Follow'
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }

})
.catch(error => {
    console.error('Error fetching profile:', error);
});

