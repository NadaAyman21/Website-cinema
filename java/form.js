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