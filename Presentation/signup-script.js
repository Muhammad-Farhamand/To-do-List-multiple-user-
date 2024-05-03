const signUpForm = document.getElementById('signup-form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const pass = document.getElementById('pass');
const passwordConfirm = document.getElementById('passwordConfirm');


signUpForm.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        signUpUser();
    }
});

async function signUpUser(){
    if(username.value === '' || email.value === '' || pass.value === '' || passwordConfirm.value === ''){
        alert("Please enter all SignUp details");
    }
    if([pass !== passwordConfirm]){
        alert("Password doesnt match!");
    }
    else{
        try{
            const responseSignUp = await fetch(`/api/users/signup`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                username: username.value,
                email: email.value,
                pass: pass.value,
                }),
            });

            const values = await responseSignUp.json();
            if (responseSignUp.ok) {
                alert('User Created!');
                window.location.href = 'index.html';
            
            }
            else {
                alert(values.message || 'An error occurred');
            }

        } catch(error){
            console.log(error);
            alert("An error occurred while processing your request.");
        }
    }
};