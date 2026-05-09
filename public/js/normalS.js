const SEAT_LIMIT = 6;
const PRICES = { standard: 120, deluxe: 180 };

/* Row definitions for Standard and Deluxe only */
const ROWS = [ 
  { label:'A', type:'standard', count:12, gap:5, occupied:[2,5,9],    hold:[] },
  { label:'B', type:'standard', count:12, gap:5, occupied:[0,7],        hold:[3,4] },
  { label:'C', type:'standard', count:14, gap:6, occupied:[1,6,11],     hold:[8] },
  { label:'D', type:'standard', count:14, gap:6, occupied:[4,9],        hold:[0,1] },
  { label:'E', type:'standard', count:14, gap:6, occupied:[2,10],  hold:[]},
  { label:'F', type:'deluxe',   count:12, gap:5, occupied:[0,11],       hold:[6,7] },
  { label:'G', type:'deluxe',      count:14, gap:6, occupied:[1,4,8],      hold:[] },
  { label:'H', type:'deluxe',      count:14, gap:6, occupied:[2,7],        hold:[0] },
  { label:'I', type:'deluxe',   count:14, gap:6, occupied:[3,5],   hold:[] },
];

let selectedSeats = []; 

function buildSeats() {
  const container = document.getElementById('seatsContainer');
  container.innerHTML = '';

  ROWS.forEach((rowDef) => {
    
    // Create the spacer when transitioning to Deluxe (at Row F)
    if (rowDef.label === 'F') {
      const spacer = document.createElement('div');
      spacer.className = 'section-divider';
      spacer.innerHTML = `<span>Deluxe Experience</span>`;
      container.appendChild(spacer);
    }

    const rowEl = document.createElement('div');
    rowEl.className = 'seat-row';

    // Left Label
    const lbl = document.createElement('div');
    lbl.className = 'row-label';
    lbl.textContent = rowDef.label;
    rowEl.appendChild(lbl);

    for (let i = 0; i < rowDef.count; i++) {
      // Preserve your gap logic
      if (rowDef.gap && i === rowDef.gap) {
          const gap = document.createElement('div');
          gap.className = 'gap';
          rowEl.appendChild(gap);
      }

      const seatId = `${rowDef.label}${i + 1}`;
      const seat = document.createElement('div');
      seat.className = `seat ${rowDef.type}`;
      seat.dataset.id = seatId;
      seat.dataset.type = rowDef.type;

      seat.dataset.label = `${seatId} • ${capitalise(rowDef.type)} • EGP ${PRICES[rowDef.type]}`;
      
      seat.innerHTML = `
        <div class="seat-arm-l"></div>
        <div class="seat-back"></div>
        <div class="seat-cushion"></div>
        <div class="seat-arm-r"></div>
        <div class="seat-leg"></div>
      `;

      if (rowDef.occupied.includes(i)) seat.classList.add('occupied');
      else if (rowDef.hold.includes(i)) seat.classList.add('hold');

      seat.addEventListener('click', () => toggleSeat(seat));
      rowEl.appendChild(seat);
    }
    
    // Right Label
    const lbl2 = lbl.cloneNode(true);
    rowEl.appendChild(lbl2);

    container.appendChild(rowEl);
  });
}

function capitalise(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function toggleSeat(seat) {
  if (seat.classList.contains('occupied') || seat.classList.contains('hold')) return;

  const id    = seat.dataset.id;
  const type  = seat.dataset.type;
  const price = PRICES[type];

  if (seat.classList.contains('selected')) {
    seat.classList.remove('selected');
    selectedSeats = selectedSeats.filter(s => s.id !== id);
  } else {
    if (selectedSeats.length >= SEAT_LIMIT) {
      showWarning();
      return;
    }
    seat.classList.add('selected');
    selectedSeats.push({ id, label: id, type, price });
  }

  updateUI();
}

function updateUI() {
  const total = selectedSeats.reduce((s, x) => s + x.price, 0);
  const count = selectedSeats.length;

  document.getElementById('metaCount').textContent = count;

  const bar = document.getElementById('checkoutBar');
  bar.classList.toggle('visible', count > 0);

  document.getElementById('checkoutSeats').textContent =
    count === 0 ? '0 seats selected' : `${count} seat${count > 1 ? 's' : ''} selected`;

  const priceEl = document.getElementById('checkoutPrice');
  priceEl.textContent = `EGP ${total.toLocaleString()}`;
  priceEl.classList.remove('bump');
  void priceEl.offsetWidth; 
  priceEl.classList.add('bump');

  const chips = document.getElementById('selectedChips');
  chips.innerHTML = '';
  selectedSeats.forEach(s => {
    const chip = document.createElement('div');
    // Removed VIP chip logic
    chip.className = `chip ${s.type === 'deluxe' ? 'dlx' : ''}`;
    chip.textContent = s.id;
    chips.appendChild(chip);
  });
}

let warnTimeout;
function showWarning() {
  const el = document.getElementById('limitWarning');
  el.classList.add('show');
  clearTimeout(warnTimeout);
  warnTimeout = setTimeout(() => el.classList.remove('show'), 2200);
}

let isConfirmed = false; 

function showAlert(message, confirmed = false) {
    const modal = document.getElementById("customAlert");
    document.getElementById("alertMessage").innerText = message;
    isConfirmed = confirmed; 
    modal.style.display = "flex";
}

function closeAlert() {
    document.getElementById("customAlert").style.display = "none";
    if (isConfirmed) {
        window.location.href = "orderSum.html";
    }
}

function checkout() {
  if (selectedSeats.length === 0) return;
  const total = selectedSeats.reduce((s, x) => s + x.price, 0);
  const seatIds = selectedSeats.map(s => s.id);

  localStorage.setItem('bookedSeats', JSON.stringify(seatIds));
  localStorage.setItem('totalPrice',  total);
  localStorage.setItem('bookingTime', new Date().toISOString());

  const btn = document.getElementById('btnCheckout');
  btn.textContent = '✓ Booking…';

  setTimeout(() => {
    const msg = `Booking confirmed!\n\nSeats: ${seatIds.join(', ')}\nTotal: EGP ${total.toLocaleString()}\n\n(Redirecting to payment…)`;
    showAlert(msg, true); 
    btn.innerHTML = 'Confirm & Pay &rarr;';
  }, 600);
}

function displayMovieMeta() {
    const day = localStorage.getItem('selectedDay');
    const time = localStorage.getItem('selectedTime');
    const movieSub = document.getElementById('movieSub');
    const movieName = localStorage.getItem('selectedMovie');
    const movieTitle = document.getElementById('movieTitleDisplay');
    
    if (movieTitle && movieName) {
        movieTitle.textContent = movieName;
    }

    if (movieSub) {
        // Hardcoded to Screen 4 for this version
        const roomName = "Screen 4";
        if (day && time) {
            movieSub.textContent = `${day} · ${time} · ${roomName}`;
        }
    }
}

displayMovieMeta();
buildSeats();