async function deleteFormHandler(event){
    event.preventDefault();

    //toss post id from url
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
    //delete post 
    const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE'
    });
    //return to dashboard if all good
    if(res.ok){
        document.location.replace('/dashboard');
    } else {
        alert(res.statusText);
    }
};

document.querySelector('.delete-post-btn').addEventListener('click', deleteFormHandler);