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

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const error = document.getElementById("error");

    // 👇 Your 2 users
    const admin = {
        email: "admin@gmail.com",
        password: "123456"
    };

    const customer = {
        email: "user@gmail.com",
        password: "123456"
    };

    // ✅ Check Admin
    if(email === admin.email && password === admin.password){
        window.location.href = "admin.html";
    }
    // ✅ Check Customer
    else if(email === customer.email && password === customer.password){
        window.location.href = "cinemaM.html";
    }
    // ❌ Wrong login
    else{
        error.textContent = "Invalid email or password!";
    }
});