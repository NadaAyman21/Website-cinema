function togglePassword(inputId, icon) {
    let pass = document.getElementById(inputId);

    if (pass.type === "password") {
        pass.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        pass.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
}

function toggleConfirmPassword() {
    let pass = document.getElementById("confirmPassword");
    if (pass.type === "password") {
        pass.type = "text";
    } else {
        pass.type = "password";
    }
}
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

  document.getElementById("signupForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let valid = true;

    // Get values
    let firstName = document.getElementById("firstName").value.trim();
    let lastName = document.getElementById("lastName").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let phone = document.getElementById("tel").value.trim();
    let dob = document.getElementById("dob").value;
    let terms = document.getElementById("terms").checked;
    let gender = document.querySelector('input[name="gender"]:checked');

   

    // Clear errors
    document.querySelectorAll(".error").forEach(e => e.innerText = "");

    // First Name
    if (firstName === "" || firstName.length < 2) {
        document.getElementById("firstNameError").innerText = "Enter valid first name";
        valid = false;
    }

    // Last Name
    if (lastName === "" || lastName.length < 2) {
        document.getElementById("lastNameError").innerText = "Enter valid last name";
        valid = false;
    }

    // Email
    let emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!email.match(emailPattern)) {
        document.getElementById("emailError").innerText = "Invalid email format";
        valid = false;
    }

    // Password
    let passwordPattern = /^(?=.*[A-Z])(?=.*[0-9]).{6,}$/;
    if (!password.match(passwordPattern)) {
        document.getElementById("passwordError").innerText =
            "Password must contain 1 uppercase, 1 number, min 6 chars";
        valid = false;
    }

    // Confirm Password
    if (password !== confirmPassword) {
        document.getElementById("confirmPasswordError").innerText = "Passwords do not match";
        valid = false;
    }

    // Gender
    if (!gender) {
        document.getElementById("genderError").innerText = "Select your gender";
        valid = false;
    }

    // Phone (Egypt format)
    let phonePattern = /^01[0-2,5]{1}[0-9]{8}$/;
    if (!phone.match(phonePattern)) {
        document.getElementById("phoneError").innerText = "Invalid phone number";
        valid = false;
    }

    // Date of Birth (must be 13+)
    if (!dob) {
        document.getElementById("dobError").innerText = "Select your birth date";
        valid = false;
    } else {
        let today = new Date();
let birthDate = new Date(dob);
let age = today.getFullYear() - birthDate.getFullYear();
let m = today.getMonth() - birthDate.getMonth();

if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
}
        if (age < 13) {
            document.getElementById("dobError").innerText = "You must be at least 13";
            valid = false;
        }
    }

    // Terms
    if (!terms) {
        document.getElementById("termsError").innerText = "You must accept terms";
        valid = false;
    }

    // Success
    if (valid) {
        showAlert("Signup successful 🎉");
    }
});