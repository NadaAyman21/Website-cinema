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
function generateQR({ movie, day, time, seats, finalPrice }) {
    const qrData = [
        `CineX Ticket`,
        `Movie: ${movie    || 'N/A'}`,
        `Date:  ${day      || 'N/A'}`,
        `Time:  ${time     || 'N/A'}`,
        `Seats: ${seats.join(', ') || 'N/A'}`,
        `Total: ${finalPrice || '0'} EGP`,
        `Ref:   CX-${Date.now()}`
    ].join('\n');

    new QRCode(document.getElementById('qrCode'), {
        text:         qrData,
        width:        160,
        height:       160,
        colorDark:    '#000000',
        colorLight:   '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });
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
const closeBtn = document.querySelector('.close-btn');
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        window.location.href = "/cinemaM";
    });
}