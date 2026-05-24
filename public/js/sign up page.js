
function togglePasswordS(inputId, icon) {
    const passInput = document.getElementById(inputId);
    if (!passInput) return;

    if (passInput.type === "password") {
        passInput.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        passInput.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
}

function showAlert(message) {
    const modal = document.getElementById("customAlert");
    if (modal) {
        document.getElementById("alertMessage").innerText = message;
        modal.style.display = "flex";
    }
}

function closeAlert() {
    const modal = document.getElementById("customAlert");
    if (modal) modal.style.display = "none";
}

// ── Helper: show a field error ──
function showError(errorId, inputEl, message) {
    const err = document.getElementById(errorId);
    if (!err) return;
    err.innerText = message;
    err.classList.add("active");
    if (inputEl) inputEl.classList.add("invalid");
}

// ── Helper: clear all errors ──
function clearErrors() {
    document.querySelectorAll(".errorS").forEach(err => {
        err.innerText = "";
        err.classList.remove("active");
    });
    document.querySelectorAll(".input-boxS input").forEach(input => {
        input.classList.remove("invalid");
    });
}

// ── Signup form ──
const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Get elements
        const firstNameInput   = document.getElementById("firstName");
        const lastNameInput    = document.getElementById("lastName");
        const emailInput       = document.getElementById("signupEmail");
        const passwordInput    = document.getElementById("signupPassword");
        const confirmInput     = document.getElementById("signupConfirmPassword"); 
        const phoneInput       = document.getElementById("tel");
        const dobInput         = document.getElementById("dob");
        const termsInput       = document.getElementById("terms");
        const genderInput      = document.querySelector('input[name="gender"]:checked');

        // Get values
        const firstName      = firstNameInput.value.trim();
        const lastName       = lastNameInput.value.trim();
        const email          = emailInput.value.trim();
        const password       = passwordInput.value;
        const confirmPassword = confirmInput.value;
        const phone          = phoneInput.value.trim();
        const dob            = dobInput.value;
        const terms          = termsInput.checked;

        clearErrors();

        let valid = true;

        const namePattern = /^[a-zA-Z]{2,}$/;
        if (!firstName.match(namePattern)) {
            showError("firstNameError", firstNameInput, "First name must be letters only (min 2)");
            valid = false;
        }

        if (!lastName.match(namePattern)) {
            showError("lastNameError", lastNameInput, "Last name must be letters only (min 2)");
            valid = false;
        }

        const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        if (!email.match(emailPattern)) {
            showError("signupEmailError", emailInput, "Please enter a valid email address"); 
            valid = false;
        }

        // Password
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!password.match(passwordPattern)) {
            showError("signupPasswordError", passwordInput, "Must be min 8 chars with 1 uppercase, 1 lowercase, and 1 number"); 
            valid = false;
        }

        if (password !== confirmPassword) {
            showError("signupConfirmPasswordError", confirmInput, "Passwords do not match"); 
            valid = false;
        }

        if (!genderInput) {
            showError("genderError", null, "Select your gender");
            valid = false;
        }

        // Phone
        const phonePattern = /^\d{11}$/;
        if (!phone.match(phonePattern)) {                                  
            showError("phoneError", phoneInput, "Phone number must be exactly 11 digits");
            valid = false;
        }

        // Date of birth
        if (!dob) {
            showError("dobError", dobInput, "Select your birth date");
            valid = false;
        } else {
            const birthDate = new Date(dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            if (age < 13) {
                showError("dobError", dobInput, "You must be at least 13 years old to create an account");
                valid = false;
            }
        }

        // Terms
        if (!terms) {
            showError("termsError", null, "You must accept the terms");
            valid = false;
        }

        // Success
        if (valid) {
            const data = {
                firstName: firstName,
                lastName:  lastName,
                email:     email,
                password:  password,
                gender:    genderInput.value,
                phone:     phone,
                dob:       dob
            };

            fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    signupForm.reset();
                    
                   
                    if (result.role === 'admin') {
                        window.location.href = '/admin';
                    } else {
                        window.location.href = '/cinemaM';
                    }
                } else {
                    showAlert(result.message); 
                }
            })
            .catch(err => {
                console.error(err);
                showAlert("Something went wrong. Try again.");
            });
        }
    });
}