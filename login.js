// Toggle password visibility
function togglePassword() {
    let password = document.getElementById("password");

    if (password.type === "password") {
        password.type = "text";
    } else {
        password.type = "password";
    }
}

// Form validation
let form = document.getElementById("loginForm");

form.addEventListener("submit", function(e) {
    e.preventDefault();

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let error = document.getElementById("error");

    error.textContent = "";

    // Empty fields check
    if (email === "" || password === "") {
        error.textContent = "Please fill in all fields!";
        return;
    }

    // Email format check
    let emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

    if (!email.match(emailPattern)) {
        error.textContent = "Invalid email format!";
        return;
    }

    // Password check
    if (password.length < 6) {
        error.textContent = "Password must be at least 6 characters!";
        return;
    }

    // Success message
    alert("Login successful 🎉");
});