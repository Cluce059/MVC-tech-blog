async function editFormHandler(event){
    event.preventDEfault();

    //get post id from url
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];


    // Get the post title and post text from the form
    const title = document.querySelector('input[name="post-title"]').value;
    const post_text = document.querySelector('textarea[name="post-text"]').value;

    // use the put route to update post
    const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title,
          post_text
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

    if (response.ok) {
        document.location.replace('/dashboard');
        } else {
        alert(response.statusText);
        }
};

document.querySelector('.edit-post-form').addEventListener('submit', editFormHandler);