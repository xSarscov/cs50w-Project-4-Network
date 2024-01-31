const profileName = document.querySelector('#profile-name');
const username = profileName.dataset.username;
const profileUsername = document.querySelector('#profile-username');
const profilePageContainer = document.querySelector('#profile');

fetch(`/get_profile/${username}`)
.then(response => response.json())
.then(profile => {

    if (profile.error) {
        profileName.innerHTML = profile.error;
        return;
    }

    profileName.innerHTML = profile.name;
    profileUsername.innerHTML = '@' + profile.username;

    let postCard = '';
    profile.posts.forEach(post => {
        postCard += `
        <div class="card mb-2">
            <div class="card-body">
                <h5 class="card-title">
                    <a href="/${post.username}" class="link-body-emphasis link-offset-1 link-offset-1-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover">
                        @${post.username}
                    </a>
                </h5>
                <p class="card-text">${post.content}</p>
                <h6 class="card-subtitle mb-2 text-body-secondary">${post.timestamp}</h6>
            </div>
        </div>
        `;
    });

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
        <div class="row">
            ${postCard}
        </div>
    </div>
    `;
    profilePage.innerHTML = profilePageBody;
    profilePageContainer.appendChild(profilePage);
    
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

