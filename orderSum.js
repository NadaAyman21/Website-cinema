   document.addEventListener('DOMContentLoaded', () => {
    // 1. Pull data from localStorage
    const movie = localStorage.getItem('selectedMovie');
    const time = localStorage.getItem('selectedTime');
    const day = localStorage.getItem('selectedDay');
    const dateText = localStorage.getItem('selectedDateText');
    const finalPrice = localStorage.getItem('savedTotal');

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

    if (finalPrice) {
        priceBoxElem.innerText = `${finalPrice} EGP`;
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
        window.location.href = "cinemaM.html"; // Or wherever your home page is
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
        // 1. Get the input elements (make sure these IDs match your HTML)
        const nameInput = document.getElementById('custName').value.trim();
        const phoneInput = document.getElementById('custPhone').value.trim();
        const emailInput = document.getElementById('custEmail').value.trim();
        

        // Name Check
        if (nameInput.length < 3) {
            showAlert("Please enter your full name.");
            return;
        }

        // Phone Check (Egypt 11-digit format)
        const phoneRegex = /^01[0125][0-9]{8}$/;
        if (!phoneRegex.test(phoneInput)) {
            showAlert("Please enter a valid 11-digit phone number.");
            return;
        }

        // Email Check
        if (!emailInput.includes('@') || !emailInput.includes('.')) {
           showAlert("Please enter a valid email address.");
            return;
        }

        const priceDisplay = document.querySelector('.price-box').innerText; 

// 2. Save it to the browser's memory
localStorage.setItem('finalAmount', priceDisplay);

            window.location.href = "form.html";
       
    });
}

