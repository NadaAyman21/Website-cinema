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

// This handles the button click to move to the next page
const payBtn = document.querySelector('.pay-btn');

if (payBtn) {
    payBtn.addEventListener('click', () => {
        // You can check if inputs are filled here if you want
        window.location.href = 'form.html';
    });
}

// Handling the Close button to go back
const closeBtn = document.querySelector('.close-btn');
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        window.history.back(); // Goes back to the previous movie page
    });
}