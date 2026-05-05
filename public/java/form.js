document.addEventListener('DOMContentLoaded', () => {
    // 1. Get the saved price from memory
    const savedPrice = localStorage.getItem('finalAmount');
    const payBtn = document.getElementById('dynamicPayBtn');

    // 2. If a price exists, update the button text
    if (savedPrice && payBtn) {
        // This keeps the lock icon but changes the text after it
        payBtn.innerHTML = `<span class="lock"></span> Pay ${savedPrice}`;
    }
});
const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {

            window.location.href = "cinemaM.html"; 
        });
    }

    const payBtn = document.getElementById('dynamicPayBtn');

if (payBtn) {
    payBtn.addEventListener('click', (e) => {
        e.preventDefault();

        let isValid = true;

        // Inputs
        const cardName = document.getElementById('cardName');
        const cardNumber = document.getElementById('cardNumber');
        const expiry = document.getElementById('expiry');
        const cvv = document.getElementById('cvv');

        // Errors
        const cardNameError = document.getElementById('cardNameError');
        const cardNumberError = document.getElementById('cardNumberError');
        const expiryError = document.getElementById('expiryError');
        const cvvError = document.getElementById('cvvError');

        // Reset errors
        [cardName, cardNumber, expiry, cvv].forEach(input => {
            input.classList.remove('input-error');
        });

        [cardNameError, cardNumberError, expiryError, cvvError].forEach(e => {
            e.textContent = '';
        });

        // ===== VALIDATIONS =====

        // Name
        if (cardName.value.trim().length < 3) {
            cardNameError.textContent = "Name must be at least 3 characters";
            cardName.classList.add('input-error');
            isValid = false;
        }

        // Card Number (16 digits)
        if (!/^\d{16}$/.test(cardNumber.value.replace(/\s/g, ''))) {
            cardNumberError.textContent = "Card number must be 16 digits";
            cardNumber.classList.add('input-error');
            isValid = false;
        }

        // Expiry (MM/YY)
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry.value)) {
            expiryError.textContent = "Format must be MM/YY";
            expiry.classList.add('input-error');
            isValid = false;
        }

        // CVV (3 digits)
        if (!/^\d{3}$/.test(cvv.value)) {
            cvvError.textContent = "CVV must be 3 digits";
            cvv.classList.add('input-error');
            isValid = false;
        }

        // ===== STOP if invalid =====
        if (!isValid) return;

        // ✅ Continue payment logic here
        alert("Payment successful ✅");
        window.location.href = "cinemaM.html";
    });
}