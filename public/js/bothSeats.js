
const SEAT_LIMIT = 6;
const PRICES = { standard: 120, deluxe: 180, vip: 250 };
const isVIPPage = window.location.pathname.includes('vipSeats.html');
/* Row definitions: label, type, count, gaps(after seat index), occupied[], hold[] */
const ROWS = isVIPPage ?[
   // VIP DATA: Rows A-E, all VIP type
  { label:'A', type:'vip', count:8, gap:4, occupied:[1, 4, 7], hold:[2,5] },
  { label:'B', type:'vip', count:8, gap:4, occupied:[0, 3,6],    hold:[] },
  { label:'C', type:'vip', count:8, gap:4, occupied:[5, 6],    hold:[1] },
  { label:'D', type:'vip', count:10, gap:5, occupied:[2, 8],   hold:[] },
  { label:'E', type:'vip', count:10, gap:5, occupied:[0, 1, 9], hold:[5] }
] : [ 
  { label:'A', type:'standard', count:12, gap:5, occupied:[2,5,9],      hold:[] },
  { label:'B', type:'standard', count:12, gap:5, occupied:[0,7],        hold:[3,4] },
  { label:'C', type:'standard', count:14, gap:6, occupied:[1,6,11],     hold:[8] },
  { label:'D', type:'standard', count:14, gap:6, occupied:[4,9],        hold:[0,1] },
  {label:'E', type:'standard', count:14, gap:6, occupied:[2,10],  hold:[]},
  { label:'F', type:'deluxe',   count:12, gap:5, occupied:[0,11],       hold:[6,7] },
  { label:'G', type:'deluxe',      count:14, gap:6, occupied:[1,4,8],      hold:[] },
  { label:'H', type:'deluxe',      count:14, gap:6, occupied:[2,7],        hold:[0] },
  { label:'I', type:'deluxe',   count:14, gap:6, occupied:[3,5],   hold:[] },
];

let selectedSeats = []; // [{id, label, row, type, price}]


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
  // ... (your existing gap code)

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

/* ══════════════════════════════════════
   TOGGLE SEAT
══════════════════════════════════════ */
function toggleSeat(seat) {
  if (seat.classList.contains('occupied') || seat.classList.contains('hold')) return;

  const id    = seat.dataset.id;
  const type  = seat.dataset.type;
  const price = PRICES[type];

  if (seat.classList.contains('selected')) {
    // Deselect
    seat.classList.remove('selected');
    selectedSeats = selectedSeats.filter(s => s.id !== id);
  } else {
    // Limit check
    if (selectedSeats.length >= SEAT_LIMIT) {
      showWarning();
      return;
    }
    seat.classList.add('selected');
    selectedSeats.push({ id, label: id, type, price });
  }

  updateUI();
}

/* ══════════════════════════════════════
   UPDATE UI
══════════════════════════════════════ */
function updateUI() {
  const total = selectedSeats.reduce((s, x) => s + x.price, 0);
  const count = selectedSeats.length;

  // Meta
  document.getElementById('metaCount').textContent = count;

  // Checkout bar
  const bar = document.getElementById('checkoutBar');
  bar.classList.toggle('visible', count > 0);

  document.getElementById('checkoutSeats').textContent =
    count === 0 ? '0 seats selected' : `${count} seat${count > 1 ? 's' : ''} selected`;

  // Price with bump animation
  const priceEl = document.getElementById('checkoutPrice');
  priceEl.textContent = `EGP ${total.toLocaleString()}`;
  priceEl.classList.remove('bump');
  void priceEl.offsetWidth; // reflow
  priceEl.classList.add('bump');

  // Chips
  const chips = document.getElementById('selectedChips');
  chips.innerHTML = '';
  selectedSeats.forEach(s => {
    const chip = document.createElement('div');
    chip.className = `chip ${s.type === 'deluxe' ? 'dlx' : s.type === 'vip' ? 'vip' : ''}`;
    chip.textContent = s.id;
    chips.appendChild(chip);
  });
}

/* ══════════════════════════════════════
   WARNING TOAST
══════════════════════════════════════ */
let warnTimeout;
function showWarning() {
  const el = document.getElementById('limitWarning');
  el.classList.add('show');
  clearTimeout(warnTimeout);
  warnTimeout = setTimeout(() => el.classList.remove('show'), 2200);
}

/* ══════════════════════════════════════
   CHECKOUT
══════════════════════════════════════ */
let isConfirmed = false; // Tracks if we should redirect on OK click

function showAlert(message, confirmed = false) {
    const modal = document.getElementById("customAlert");
    document.getElementById("alertMessage").innerText = message;
    isConfirmed = confirmed; // Set flag
    modal.style.display = "flex";
}

function closeAlert() {
    document.getElementById("customAlert").style.display = "none";
    // If it was the success message, redirect to orderSum
    if (isConfirmed) {
        window.location.href = "orderSum.html";
    }
}

function checkout() {
  if (selectedSeats.length === 0) return;
  const total = selectedSeats.reduce((s, x) => s + x.price, 0);
  const seatIds = selectedSeats.map(s => s.id);

  // Save to localStorage (preserve original logic)
  localStorage.setItem('bookedSeats', JSON.stringify(seatIds));
  localStorage.setItem('totalPrice',  total);
  localStorage.setItem('bookingTime', new Date().toISOString());

  // Visual feedback before redirect
  const btn = document.getElementById('btnCheckout');
  btn.textContent = '✓ Booking…';
 

  // In a real app: window.location.href = '/checkout';
  setTimeout(() => {
    const msg = `Booking confirmed!\n\nSeats: ${seatIds.join(', ')}\nTotal: EGP ${total.toLocaleString()}\n\n(Redirecting to payment…)`;
        
        // Trigger custom alert
        showAlert(msg, true); 

        // Reset button text
        btn.innerHTML = 'Confirm & Pay &rarr;';

  }, 600);
}

function displayMovieMeta() {
    // 1. Get the values that movie.js saved
    const day = localStorage.getItem('selectedDay');
    const time = localStorage.getItem('selectedTime');
    const movieSub = document.getElementById('movieSub');
    const movieName = localStorage.getItem('selectedMovie');
    const movieTitle = document.getElementById('movieTitleDisplay');
    
if (movieTitle && movieName) {
        movieTitle.textContent = movieName;
    }

    // Display Sub-details (Day, Time, Room)
    if (movieSub) {
        const roomName = isVIPPage ? "Private Suite 1" : "Screen 4";
        if (day && time) {
            movieSub.textContent = `${day} · ${time} · ${roomName}`;
        }
    }

}
displayMovieMeta();
buildSeats();
