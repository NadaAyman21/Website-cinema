// ── Modal controls ──
function togglePasswordS(inputId, icon) {
    const passInput = document.getElementById(inputId);
    if (!passInput) return; // Safety check

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

function openSignup() {
    const loginModal = document.getElementById("loginModal");
    if (loginModal) loginModal.classList.remove("active");

    const modal = document.getElementById("signupModal");
    if (modal) {
        modal.classList.add("active");
 
        const form = document.getElementById("signupForm");
        if (form) form.reset();
        document.querySelectorAll(".errorS").forEach(e => {
            e.innerText = "";
            e.classList.remove("active");
        });
        document.querySelectorAll(".input-boxS input").forEach(i => i.classList.remove("invalid"));
    } else {
        window.location.href = "sign up page.html";
    }
}

function closeSignup() {
    const modal = document.getElementById("signupModal");
    if (modal) modal.classList.remove("active");
}

window.addEventListener("click", function(e) {
    const modal = document.getElementById("signupModal");
    if (modal && e.target === modal) closeSignup();
});



function showAlert(message) {
    const modal = document.getElementById("customAlert");
    if (modal) {
        document.getElementById("alertMessage").innerText = message;
        modal.style.display = "flex";
    }
}

// 2. Function to close it
function closeAlert() {
    const modal = document.getElementById("customAlert");
    if (modal) {
        modal.style.display = "none";
    }
}

 // Ensure the form exists before adding the listener
const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", function(e) {
        e.preventDefault();

        let valid = true;

        let firstNameInput = document.getElementById("firstName");
        let lastNameInput = document.getElementById("lastName");
        let emailInput = document.getElementById("signupEmail");
        let passwordInput = document.getElementById("signupPassword");
        let confirmInput = document.getElementById("signupconfirmPassword");
        let phoneInput = document.getElementById("tel");
        let dobInput = document.getElementById("dob");

        let firstName = firstNameInput.value.trim();
        let lastName = lastNameInput.value.trim();
        let email = emailInput.value.trim();
        let password = passwordInput.value; 
        let confirmPassword = confirmInput.value;
        let phone = phoneInput.value.trim();
        let dob = dobInput.value;
        let terms = document.getElementById("terms").checked;
        let gender = document.querySelector('input[name="gender"]:checked');

        // 2. Clear all previous errors and red borders
        document.querySelectorAll(".errorS").forEach(err => {
            err.innerText = "";
            err.classList.remove("active");
        });
        document.querySelectorAll(".input-boxS input").forEach(input => {
            input.classList.remove("invalid");
        });

        // 3. Validation Logic (With Active Classes)
        if (firstName.length < 2) {
            let err = document.getElementById("firstNameError");
            err.innerText = "Enter valid first name";
            err.classList.add("active");
            firstNameInput.classList.add("invalid");
            valid = false;
        }
        if (lastName.length < 2) {
            let err = document.getElementById("lastNameError");
            err.innerText = "Enter valid last name";
            err.classList.add("active");
            lastNameInput.classList.add("invalid");
            valid = false;
        }

        let emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        if (!email.match(emailPattern)) {
            let err = document.getElementById("signupemailError");
            err.innerText = "Invalid email format";
            err.classList.add("active");
            emailInput.classList.add("invalid");
            valid = false;
        }

        let passwordPattern = /^(?=.*[A-Z])(?=.*[0-9]).{6,}$/;
        if (!password.match(passwordPattern)) {
            let err = document.getElementById("signuppasswordError");
            err.innerText = "Password must contain 1 uppercase, 1 number, min 6 chars";
            err.classList.add("active");
            passwordInput.classList.add("invalid");
            valid = false;
        }

        if (password !== confirmPassword) {
            let err = document.getElementById("signupconfirmPasswordError");
            err.innerText = "Passwords do not match";
            err.classList.add("active");
            confirmInput.classList.add("invalid");
            valid = false;
        }

        if (!gender) {
            let err = document.getElementById("genderError");
            err.innerText = "Select your gender";
            err.classList.add("active");
            valid = false;
        }

        if (phone === "") {
            let err = document.getElementById("phoneError");
            err.innerText = "Invalid phone number";
            err.classList.add("active");
            phoneInput.classList.add("invalid");
            valid = false;
        }

        if (!dob) {
            let err = document.getElementById("dobError");
            err.innerText = "Select your birth date";
            err.classList.add("active");
            dobInput.classList.add("invalid");
            valid = false;
        }

        if (!terms) {
            let err = document.getElementById("termsError");
            err.innerText = "You must accept terms";
            err.classList.add("active");
            valid = false;
        }

        // 4. Success
        if (valid) {
            showAlert("Signup successful 🎉");
        }
    });
    


}