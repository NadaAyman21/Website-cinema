// Toggle password visibility
function togglePassword() {
    let password = document.getElementById("password");

    if (password.type === "password") {
        password.type = "text";
    } else {
        password.type = "password";
    }
}

function validateEmail(){
    let email = document.getElementById("email").value.trim();
    let emailError = document.getElementById("emailError");

    emailError.innerText = "";

    let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

    if(email === "" || !email.match(pattern)){
        emailError.innerText = "Enter a valid email";
        return false;
    }

    return true;
}

function validatePassword(){
    let password = document.getElementById("password").value.trim();
    let passwordError = document.getElementById("passwordError");

    passwordError.innerText = "";

    let passwordPattern = /^(?=.*[A-Z])(?=.*[0-9]).{6,}$/;

    if(!password.match(passwordPattern)){
        passwordError.innerText =
            "Password must contain 1 uppercase, 1 number, min 6 chars";
        return false;
    }

    return true;
}

  
const form = document.getElementById("loginForm");

form.addEventListener("submit", function(e){
    e.preventDefault();

    let valid = true;

    if(!validateEmail()) valid = false;
    if(!validatePassword()) valid = false;

    if(!valid) return;

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Users
    if(email === "admin@gmail.com" && password === "Admin123"){
        window.location.href = "admin.html";
    }
    else if(email === "user@gmail.com" && password === "User123"){
        window.location.href = "cinemaM.html";
    }
    else{
        document.getElementById("error").innerText = "Invalid email or password!";
    }
});