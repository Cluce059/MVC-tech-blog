async function loginFormHandler(event) {
    event.preventDefault();
    // get login info from form  check
    const username = document.querySelector('#username-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();

    if (username && password) {
        // POST to the login route with the user information
        const response = await fetch('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                username,
                password
            }),
            headers: {'Content-Type': 'application/json'}
        });
       
        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            let result = await response.json()
            alert(result.message)
        }
    }
}

document.querySelector('#login-form').addEventListener('submit', loginFormHandler);