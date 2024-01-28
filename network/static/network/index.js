getPosts(); 
const newPostForm = document.querySelector('#new-post-form');

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
    })
    .catch(error => {
        console.error('Error:', error);
    });

});

function getPosts() {
    fetch('/posts')
    .then(response => response.json())
    .then(posts => {
        console.log(posts)
         //posts.forEach(post => {
            
       // });
    })
};