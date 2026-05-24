document.addEventListener('DOMContentLoaded', () => {
    const movie      = localStorage.getItem('selectedMovie');
    const time       = localStorage.getItem('selectedTime');
    const day        = localStorage.getItem('selectedDay');
    const dateText   = localStorage.getItem('selectedDateText');
    const finalPrice = localStorage.getItem('totalPrice');
    const seats      = JSON.parse(localStorage.getItem('bookedSeats') || '[]');

    const movieNameElem = document.querySelector('.movie-box h2');
    const dateTimeElem  = document.querySelector('.movie-box p:nth-of-type(1)');
    const fullDateElem  = document.querySelector('.movie-box p:nth-of-type(2)');
    const priceBoxElem  = document.querySelector('.price-box');

    if (movie)            movieNameElem.innerText = movie;
    if (day && time)      dateTimeElem.innerText  = `${day}, ${time}`;
    if (dateText)         fullDateElem.innerText  = dateText;
    if (finalPrice && priceBoxElem) priceBoxElem.innerText = `${finalPrice}.00 EGP`;

    // ✅ Generate QR
    generateQR({ movie, day, time, seats, finalPrice });
});