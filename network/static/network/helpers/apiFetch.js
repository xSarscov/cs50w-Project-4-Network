export const checkAuthentication = async () => {
    try {
        const response = await fetch('/api/check_authentication_status/');
        const data = await response.json();
        return data.authenticated;
    } catch (error) {
        console.error('Error checking authentication:', error);
        return false;
    }
};

export const fetchNewPost = async(content) => {

    const isAuthenticated = await checkAuthentication();

    if (!isAuthenticated) {
        window.location.href = 'login';
        return;
    }

    try {
        const response = await fetch('/api/posts/new/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content
            })
        });

          
        if (response.redirected) {
            window.location.href = response.url;
            return;
        }
  

        const data = await response.json();
        console.log(data);
        return data
    } catch (error) {
        throw new Error(error);

    }

}

export const fetchEditPost = async(post_id, new_content) => {
    
    const isAuthenticated = await checkAuthentication();

    if (!isAuthenticated) {
        window.location.href = 'login';
        return;
    }


    try {
        
        const response = await fetch(`/api/posts/${post_id}/edit/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                new_content
            })
        });

          
        if (response.redirected) {
            window.location.href = response.url;
            return;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }


}

export const fetchAllPosts = async(page = 1) => {
    try {        
        const response = await fetch(`/api/posts/all_posts?page=${page}`);
    
        const data = await response.json();
    
        return data;
    } catch (error) {
        throw error;

    }
}

export const fetchFollowingPosts = async(page = 1) => {
    
    const isAuthenticated = await checkAuthentication();

    if (!isAuthenticated) {
        window.location.href = 'login';
        return;
    }


    try {
        const response = await fetch(`/api/posts/following?page=${page}`);
        
          
        if (response.redirected) {
            window.location.href = response.url;
            return;
        }

        const data = await response.json();
    
        return data;
        
    } catch (error) {
        
    }
}

export const fetchUserProfile = async(username) => {
    try {
        const response = await fetch(`/api/profile/${username}/`);
    
        const data = await response.json();
    
        return data;
        
    } catch (error) {
        throw error;

    }
}


export const fetchUserPosts = async(username, page = 1) => {
    try {
        
        const response = await fetch(`/api/posts/${username}?page=${page}`);
    
        const data = await response.json();
    
        return data;
    } catch (error) {
        throw error;

    }
}

export const fetchToggleFollow = async(username) => {

    const isAuthenticated = await checkAuthentication();

    if (!isAuthenticated) {
        window.location.href = 'login';
        return;
    }


    try {
        const response = await fetch(`/api/profile/${username}/toggle_follow/`, {
            method: 'POST'
        });
          
        if (response.redirected) {
            window.location.href = response.url;
            return;
        }
    
        const data = await response.json();
    
        return data;
        
    } catch (error) {
        throw error;

    }


}

export const fetchToggleLike = async(post_id) => {

    
    const isAuthenticated = await checkAuthentication();

    if (!isAuthenticated) {
        window.location.href = 'login';
        return;
    }


    try {
        const response = await fetch(`/api/posts/${post_id}/toggle_like/`, {
            method: 'POST'
        });
    
        const data = await response.json();
    
        return data;
        
    } catch (error) {
        throw error;

    }


}