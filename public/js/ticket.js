async function loadTicket() {
  try {
    const res  = await fetch(`/reservation/${reservationId}`, { credentials: 'include' });
    const data = await res.json();

    document.getElementById('t-movie').textContent = data.movie     || '—';
    document.getElementById('t-hall').textContent  = (data.hall     || '—') + ' Hall';
    document.getElementById('t-date').textContent  = data.date      || '—';
    document.getElementById('t-time').textContent  = data.showtime  || '—';
    document.getElementById('t-name').textContent  = userName;
    document.getElementById('t-count').textContent = data.seats.length + ' seat(s)';
    document.getElementById('t-order').textContent = data.orderNumber || '—';
    document.getElementById('t-price').textContent = (data.totalPrice || 0) + ' EGP';

    const seatsEl = document.getElementById('t-seats');
    data.seats.forEach(s => {
      const tag       = document.createElement('div');
      tag.className   = 'seat-tag';
      tag.textContent = s;
      seatsEl.appendChild(tag);
    });
        new QRCode(document.getElementById('qrCode'), {
      text:         `CINEX|${data.orderNumber}|${data.movie}|${data.seats.join(',')}|${data.totalPrice}EGP`,
      width:        160,
      height:       160,
      colorDark:    '#0a1628',
      colorLight:   '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });

  } catch (err) {
    console.error(err);
  }
}

function downloadTicket() {
  window.print();
}

loadTicket();