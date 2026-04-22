// Toggle password visibility
function togglePassword() {
    let password = document.getElementById("password");

    if (password.type === "password") {
        password.type = "text";
    } else {
        password.type = "password";
    }
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