const loginForm = document.getElementById('login-form');
const email = document.getElementById('email');
const pass = document.getElementById('pass');

loginForm.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        loginUser();
    }
});

async function loginUser(){
    if(email.value === '' || pass.value === ''){
        alert("Please enter all login details (WORKING HERE)");
    }
    else{
        console.log('2');
        try{
            console.log('3');
            const response = await fetch(`/api/user/login`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                email: email.value,
                pass: pass.value
                }),
            });
            if (response.ok) {
                console.log('4');
                const values = await response.json();
                const user_id = values.data.LoggedInUser.id;
                const username = values.data.LoggedInUser.username;

                localStorage.setItem("user_id", user_id)
                localStorage.setItem("username", username)

                window.location.href = 'to-do.html';
            
            } else {
                const errorResponse = await response.json();
                alert(errorResponse.message || 'Unauthorized');
                console.error('Error logging in user: ', response.statusText);
                location.reload()
            }

        } catch(error){
            console.log(error);
        }
    }
};

