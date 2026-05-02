   document.addEventListener('DOMContentLoaded', () => {
    // 1. Pull data from localStorage
    const movie = localStorage.getItem('selectedMovie');
    const time = localStorage.getItem('selectedTime');
    const day = localStorage.getItem('selectedDay');
    const dateText = localStorage.getItem('selectedDateText');
      const finalPrice = localStorage.getItem('totalPrice');
    // 2. Target the elements using querySelector (required for class paths)
    const movieNameElem = document.querySelector('.movie-box h2');
    const dateTimeElem = document.querySelector('.movie-box p:nth-of-type(1)');
    const fullDateElem = document.querySelector('.movie-box p:nth-of-type(2)');
    const priceBoxElem = document.querySelector('.price-box');

    // 3. Update the text only if the data exists in memory
    if (movie) movieNameElem.innerText = movie;
    
    if (day && time) {
        dateTimeElem.innerText = `${day}, ${time}`;
    }

    if (dateText) {
        fullDateElem.innerText = dateText;
    }

    if (finalPrice && priceBoxElem) {
        priceBoxElem.innerText = `${finalPrice}.00 EGP`;
    }
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


const closeBtn = document.querySelector('.close-btn');
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        window.location.href = "cinemaM.html"; 
    });
}


document.getElementById('custName').addEventListener('input', function(e) {
    this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
});

// Phone: Only allow numbers
document.getElementById('custPhone').addEventListener('input', function(e) {
    this.value = this.value.replace(/[^0-9]/g, '');
});

const payBtn = document.querySelector('.pay-btn');

if (payBtn) {
    payBtn.addEventListener('click', (e) => {
        e.preventDefault();

        let isValid = true;

        const nameInput = document.getElementById('custName');
        const phoneInput = document.getElementById('custPhone');
        const emailInput = document.getElementById('custEmail');

        const nameError = document.getElementById('custNameError');
        const phoneError = document.getElementById('custPhoneError');
        const emailError = document.getElementById('custEmailError');

        // Reset
        [nameInput, phoneInput, emailInput].forEach(input => {
            input.classList.remove('input-error');
        });

        [nameError, phoneError, emailError].forEach(e => e.textContent = '');

        // ===== VALIDATION =====

        // Name
        if (nameInput.value.trim().length < 3) {
            nameError.textContent = "Enter a valid full name";
            nameInput.classList.add('input-error');
            isValid = false;
        }

        // Phone (Egypt)
        const phoneRegex = /^01[0125][0-9]{8}$/;
        if (!phoneRegex.test(phoneInput.value.trim())) {
            phoneError.textContent = "Enter a valid Egyptian phone number";
            phoneInput.classList.add('input-error');
            isValid = false;
        }

        // Email
        const emailValue = emailInput.value.trim();
        if (!emailValue.includes('@') || !emailValue.includes('.')) {
            emailError.textContent = "Enter a valid email address";
            emailInput.classList.add('input-error');
            isValid = false;
        }

        /*if (!isValid) return;

        // ✅ Save price
        const priceDisplay = document.querySelector('.price-box').innerText;
        localStorage.setItem('finalAmount', priceDisplay);*/

        // ✅ Go to payment
        window.location.href = "form.html";
    });
}

       