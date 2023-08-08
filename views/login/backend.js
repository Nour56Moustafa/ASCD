document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('submit').addEventListener('click', () => {
        console.log(this)
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const signInData = {
            email: email,
            password: password,
        };

        console.log(password, email, signInData)
            // Sending the data to the controller endpoint using Axios
        axios.post('http://localhost:3000/api/v1/auth/login', signInData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => {
                // Assuming the token is returned in the 'token' property of the JSON response
                const token = response.data.token;
                const user = response.data.user;
                // You can now use the token or process the JSON data as needed
                console.log('Token:', token);
                console.log('user:', user);
                window.location.href = '../main/main.html';
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });

})