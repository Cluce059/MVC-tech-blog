async function newFormHandler(event){
    event.preventDefault();

    //get post title and text from form
    const title = document.querySelector('input[name="post-title"]').value;
    const post_text = document.querySelector('textarea[name="post-text"]').value;

    //use add new post route 
    //user_id added form session info in post route
    const response = await fetch(`/api/posts`, {
        method: 'POST',
        body: JSON.stringify({
            title, 
            post_text
        }),
        headers: {
            'Content-Type': 'application/json' 
        }
    });

    //if res.ok reload page with new post list
    if(response.ok){
        //reload to dashboard
        document.location.replace('/dashboard');
    } else {
        alert(response.statusText);
    }
};

document.querySelector('.new-post-form').addEventListener('submit', newFormHandler);
