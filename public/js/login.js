
window.pendingRedirectUrl = window.pendingRedirectUrl || null;

function handleProtectedRedirect(targetUrl) {
    window.pendingRedirectUrl = targetUrl;
    openLogin(); 
}

function togglePassword() {
    const password = document.getElementById("loginPassword");
    password.type = password.type === "password" ? "text" : "password";
}


function validateEmail() {
    const email = document.getElementById("loginEmail").value.trim();
    const emailError = document.getElementById("loginEmailError");
    const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

    emailError.innerText = "";
    document.getElementById("loginEmail").classList.remove("invalid");

    if (email === "" || !email.match(pattern)) {
        emailError.innerText = "Enter a valid email";
        emailError.classList.add("active");
        document.getElementById("loginEmail").classList.add("invalid");
        return false;
    }

    emailError.classList.remove("active");
    return true;
}


function validatePassword() {
    const password = document.getElementById("loginPassword").value.trim();
    const passwordError = document.getElementById("loginPasswordError");
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    passwordError.innerText = "";
    document.getElementById("loginPassword").classList.remove("invalid");

    if (!password.match(pattern)) {
        passwordError.innerText = "Must be min 8 chars with 1 uppercase, 1 lowercase, and 1 number";
        passwordError.classList.add("active");
        document.getElementById("loginPassword").classList.add("invalid");
        return false;
    }

    passwordError.classList.remove("active");
    return true;
}


const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const isEmailValid    = validateEmail();
        const isPasswordValid = validatePassword();

        if (!isEmailValid || !isPasswordValid) return;
        
           console.log("REACHING FETCH");
       const email    = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value.trim();

      fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',  
    body: JSON.stringify({ email, password })
})
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                if (result.role === "admin") {
                    window.location.href = "/admin";
                } 
                else if (window.pendingRedirectUrl) {
                    window.location.href =  window.pendingRedirectUrl;
                } 
                
                else {
                    window.location.href = "/cinemaM";
                }
            } else {
                const passwordError = document.getElementById("loginPasswordError");
                passwordError.innerText = result.message;
                passwordError.classList.add("active");
                document.getElementById("loginPassword").classList.add("invalid");
            }
        })
        .catch(err => {
            console.error(err);
            const passwordError = document.getElementById("loginPasswordError");
            passwordError.innerText = "Something went wrong. Try again.";
            passwordError.classList.add("active");
        });
    });
}

// ── Modal controls ──
function openLogin() {
    document.getElementById("loginModal").classList.add("active");

    // Reset form
    document.getElementById("loginForm").reset();

    // Clear all errors
    document.getElementById("loginEmailError").innerText = "";
    document.getElementById("loginEmailError").classList.remove("active");
    document.getElementById("loginPasswordError").innerText = "";
    document.getElementById("loginPasswordError").classList.remove("active");

    // Clear invalid borders
    document.getElementById("loginEmail").classList.remove("invalid");
    document.getElementById("loginPassword").classList.remove("invalid");
}

function closeLogin() {
    document.getElementById("loginModal").classList.remove("active");
}

