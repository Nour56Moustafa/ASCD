document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-register').addEventListener('click', (event) => {
        event.preventDefault();
        const lastName = document.getElementById('lastName').value;
        const firstName = document.getElementById('firstName').value;
        const co_email = document.getElementById('co-email').value;
        const email = document.getElementById('email').value;
        const co_password = document.getElementById('co-password').value;
        const password = document.getElementById('password').value;
        const username = document.getElementById('username').value;
        const phoneNumber = document.getElementById('phoneNumber').value;

        const signInData = {
            lastName: lastName,
            firstName: firstName,
            email: email,
            password: password,
            username: username,
            phoneNumber: phoneNumber
        };
        console.log(lastName, firstName, email, password, username, phoneNumber);
        // Sending the data to the controller endpoint using Axios
        axios.post('http://localhost:3000/api/v1/auth/register', signInData, {
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
                console.log('User:', user);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });
});