const feed = document.querySelector('#feed');
const csrfToken = feed.dataset.csrfToken;

getPosts(feed, 1); 
const newPostForm = document.querySelector('#new-post-form');

if (newPostForm) {
    newPostForm.addEventListener('submit', (event) => {
        event.preventDefault();
    
        const newPostTextArea = document.querySelector('#id_content');
        const newPostContent = newPostTextArea.value;
    
        fetch('/create_post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: JSON.stringify({
                'content': newPostContent
            })
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            newPostTextArea.value = '';
            feed.innerHTML = '';
            getPosts(feed, 1);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    
    });
}



function getPosts(feed, page) {
    const currentUsername = feed.dataset.currentUsername;

    fetch(`/posts?page=${page}`)
    .then(response => response.json())
    .then(result => {
        result.posts.forEach(post => {
            
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
                    if (result.is_current_user_authenticated) {
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
                    } else {
                        window.location.href = '/login';
                    }
                });

            likeSection.appendChild(likeButton);
            likeSection.appendChild(likeCount);

            postBody.appendChild(likeSection);


            if (post.username === currentUsername) {
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
                            ${ post.username === currentUsername ? `<button type="button" class="btn btn-primary" id="edit">Edit</button>` : ''
                            }
                        `;
                        })
                    })
                    
                });

                postBody.appendChild(editButton);
            }

            
            
            postCard.appendChild(postBody);

            feed.appendChild(postCard);
            
           

        });

        const paginationContainer = document.querySelector('#pagination-container');
        paginationContainer.innerHTML = '';
        const pagination = document.createElement('ul');
        pagination.classList.add('pagination');

        for (let i = 1; i <= result.total_pages; i++) {
            if (result.total_pages > 1) {
                const pageButtonContainer = document.createElement('li');
                pageButtonContainer.classList.add('page-item');
                const pageButton = document.createElement('button');
                pageButton.classList.add('page-link');
                pageButton.textContent = i;
                
                if (i === page) {
                    pageButtonContainer.classList.add('active');
                }

                pageButton.addEventListener('click', () => {
                    feed.innerHTML = '';
                    getPosts(feed, i);
                });
                
                pageButtonContainer.appendChild(pageButton);
                paginationContainer.appendChild(pageButtonContainer);
                pagination.appendChild(pageButtonContainer);
            }
        }

        paginationContainer.appendChild(pagination)


    })
};