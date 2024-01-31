const feed = document.querySelector('#feed');
getPosts(feed); 
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
            getPosts(feed);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    
    });
}



function getPosts(feed) {
    const currentUsername = feed.dataset.currentUsername;

    fetch('/posts')
    .then(response => response.json())
    .then(posts => {
        posts.forEach(post => {
            
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

            if (post.username === currentUsername) {
                const editButton = document.createElement('button');
                editButton.classList.add('btn', 'btn-primary')
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
                        const csrfToken = feed.dataset.csrfToken;
                        
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
    })
};