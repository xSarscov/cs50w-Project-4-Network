import { checkAuthentication, fetchToggleFollow } from "../helpers/apiFetch.js";

export const UserProfile = async({user, bio, profile_picture, posts_count, followers_count, following_count }, refreshComponent) => {
    const profileContainer = document.querySelector('#profile-container');

    profileContainer.innerHTML = '';
    
    const userProfileItem = document.createElement('div');
    userProfileItem.classList.add("row", "px-4", "py-5")

    userProfileItem.innerHTML = `

        <div class="col-xl-12 col-md-12 col-sm-12 ">

            <!-- Profile widget -->
            <div class="bg-white shadow rounded overflow-hidden">
                <div class="px-4 pt-0 pb-4 bg-dark">
                    <div class="media align-items-end profile-header">
                        <div class="profile mr-3">
                            <img src="${profile_picture}" alt="${user}'s profile picture" width="130" class="rounded mb-2 img-thumbnail">
                        </div>
                        <div class="media-body mb-5 text-white">
                            <h4 class="mt-0 mb-0">${user}</h4>
                            <p>${bio}</p>
                        </div>
                    </div>
                </div>

                <div class="bg-light p-4 d-flex justify-content-end text-center align-items-center">
                    <div class="me-2" id="follow-btn-container"></div>
                    <ul class="list-inline mb-0">
                        <li class="list-inline-item">
                            <h5 class="fw-bold mb-0 d-block">${posts_count}</h5><small class="text-muted">Posts</small>
                        </li>
                        <li class="list-inline-item">
                            <h5 class="fw-bold mb-0 d-block">${followers_count}</h5><small class="text-muted">Followers</small>
                        </li>
                        <li class="list-inline-item">
                            <h5 class="fw-bold mb-0 d-block">${following_count}</h5><small class="text-muted">Following</small>
                        </li>
                    </ul>
                </div>

                
            </div>
        </div>
    
    `;

    const isAuthenticated = await checkAuthentication();

    if (isAuthenticated && currentUser !== username) {
        const followBtnContainer = userProfileItem.querySelector("#follow-btn-container");
        const followBtn = document.createElement("button");
        followBtn.classList.add("btn", "btn-sm", "btn-block");
        followBtn.innerHTML = `
        
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-plus-square" viewBox="0 0 16 16">
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
            </svg>

        `;

        followBtn.addEventListener('click', async() => {
            const response = await fetchToggleFollow(user);
            console.log(response);
            refreshComponent(user);
        });

        followBtnContainer.append(followBtn);

    }

    profileContainer.append(userProfileItem);

}