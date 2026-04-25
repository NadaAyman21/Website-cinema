document.addEventListener('DOMContentLoaded', () => {

    // ===== PRICES =====
    const PRICES = {
        standard: 170.00,
        deluxe: 230.00,
        vip: 300.00
    };

    // ===== SEAT LIMITS =====
    const SEAT_LIMIT_STANDARD_DELUXE = 6;  // seats.html
    const SEAT_LIMIT_VIP = 4;               // vip.html

    const seats = document.querySelectorAll('.seat:not(.occupied):not(.hold)');
    const totalDisplay = document.querySelector('.price');

    let currentTotal = 0;
    let selectedCount = 0;

    // ===== FUNCTION TO GET SEAT PRICE =====
    function getSeatPrice(seat) {
        if (seat.classList.contains('vip')) return PRICES.vip;
        if (seat.classList.contains('deluxe')) return PRICES.deluxe;
        return PRICES.standard;
    }

    // ===== FUNCTION TO GET SEAT LIMIT =====
    function getSeatLimit(seat) {
        if (seat.classList.contains('vip')) return SEAT_LIMIT_VIP;
        return SEAT_LIMIT_STANDARD_DELUXE;
    }

    // ===== SEAT CLICK =====
    seats.forEach(seat => {
        seat.addEventListener('click', () => {

            const isSelected = seat.classList.contains('selected');
            const seatPrice = getSeatPrice(seat);
            const seatLimit = getSeatLimit(seat);

            if (isSelected) {
                // Deselect seat
                seat.classList.remove('selected');
                currentTotal -= seatPrice;
                selectedCount--;
            } else {
                // Check limit for this type
                if (selectedCount >= seatLimit) {
                   showAlert("you have reached the maximam seats to reserve in one booking");
                    return;
                }

                // Select seat
                seat.classList.add('selected');
                currentTotal += seatPrice;
                selectedCount++;
            }

            // Update total display
            totalDisplay.innerText = `${currentTotal.toFixed(2)} EGP`;
        });
    });


    // ===== SAVE PRICE ON CHECKOUT =====
    const checkoutBtn = document.querySelector('.checkout-btn');
   if (checkoutBtn) {
    checkoutBtn.addEventListener('click', (e) => {
        // Get the current text (e.g., "300.00 EGP")
        const priceText = document.querySelector('.price').innerText;
        // Clean it so it's just the number "300.00"
        const finalPrice = priceText.replace(' EGP', '').trim();
        
        if (parseFloat(finalPrice) === 0) {
            showAlert("Please select your seats first!");
            return;
        }

        // SAVE IT
        localStorage.setItem('savedTotal', finalPrice);
        
        // NOW GO TO THE SUMMARY PAGE
        window.location.href = "orderSum.html"; 
    });
}

});
function showAlert(message) {
    const modal = document.getElementById("customAlert");
    document.getElementById("alertMessage").innerText = message;
    modal.style.display = "flex";
}

// Function to close the custom alert
function closeAlert() {
    document.getElementById("customAlert").style.display = "none";
}
function goToLogin(){
    window.location.href = "login.html";
}