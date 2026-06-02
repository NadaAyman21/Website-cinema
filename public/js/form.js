document.addEventListener('DOMContentLoaded', () => {
    
    const savedPrice = localStorage.getItem('finalAmount');
    const payBtn = document.getElementById('dynamicPayBtn');

   
    if (savedPrice && payBtn) {
      
        payBtn.innerHTML = `<span class="lock"></span> Pay ${savedPrice}`;
    }
});
const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {

            window.location.href = "cinemaM"; 
        });
    }

    const payBtn = document.getElementById('dynamicPayBtn');

if (payBtn) {
    payBtn.addEventListener('click', (e) => {
        e.preventDefault();
        let isValid = true;
        const cardName = document.getElementById('cardName');
        const cardNumber = document.getElementById('cardNumber');
        const expiry = document.getElementById('expiry');
        const cvv = document.getElementById('cvv');    
        const cardNameError = document.getElementById('cardNameError');
        const cardNumberError = document.getElementById('cardNumberError');
        const expiryError = document.getElementById('expiryError');
        const cvvError = document.getElementById('cvvError');

       
        [cardName, cardNumber, expiry, cvv].forEach(input => {
            input.classList.remove('input-error');
        });

        [cardNameError, cardNumberError, expiryError, cvvError].forEach(e => {
            e.textContent = '';
        });


       
        if (cardName.value.trim().length < 3) {
            cardNameError.textContent = "Name must be at least 3 characters";
            cardName.classList.add('input-error');
            isValid = false;
        }

       
        if (!/^\d{16}$/.test(cardNumber.value.replace(/\s/g, ''))) {
            cardNumberError.textContent = "Card number must be 16 digits";
            cardNumber.classList.add('input-error');
            isValid = false;
        }

       
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry.value)) {
            expiryError.textContent = "Format must be MM/YY";
            expiry.classList.add('input-error');
            isValid = false;
        }

       
        if (!/^\d{3}$/.test(cvv.value)) {
            cvvError.textContent = "CVV must be 3 digits";
            cvv.classList.add('input-error');
            isValid = false;
        }
        
        if (!isValid) return;
async function saveAndRedirect() {
  const payload = {
    movie:      localStorage.getItem('selectedMovie'),
    showtime:   localStorage.getItem('selectedTime'),
    date:       localStorage.getItem('selectedDateText'),
    hall:       localStorage.getItem('hallType'),
    seats:      localStorage.getItem('bookedSeats'),   
    totalPrice: localStorage.getItem('totalPrice')
  };

  try {
    const res  = await fetch('/reservation/save', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.success) {
      localStorage.clear();
      window.location.href = `/ticket/${data.reservationId}`;
    } else {
      alert('Booking failed, please try again.');
    }
  } catch (err) {
    console.error(err);
    alert('Something went wrong.');
  }
}

saveAndRedirect();
    });
}