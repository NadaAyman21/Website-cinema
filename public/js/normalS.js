const SEAT_LIMIT = 6;
const PRICES = { standard: 120, deluxe: 180 };
let is3dOpen = false, animFrame3d, initialized3d = false;
let targetRotY = 0, targetRotX = 0, currentRotY = 0, currentRotX = 0;

function toggle3dView() {
  is3dOpen = !is3dOpen;
  const overlay = document.getElementById('view3d-overlay');
  const btn     = document.getElementById('btn3dToggle');
  if (is3dOpen) {
    overlay.classList.add('visible');
    btn.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (!initialized3d) { init3dScene(); initialized3d = true; }
    start3dLoop();
  } else {
    overlay.classList.remove('visible');
    btn.classList.remove('active');
    document.body.style.overflow = '';
    cancelAnimationFrame(animFrame3d);
  } }
  function init3dScene() {
  // Stars
  const starsEl = document.getElementById('stars3d');
  for (let i = 0; i < 120; i++) {
    const s = document.createElement('div');
    s.className = 'star3d';
    const size = Math.random() * 2.5 + 0.5;
    const minOp = (Math.random() * 0.3 + 0.1).toFixed(2);
    s.style.cssText = `width:${size}px;height:${size}px;top:${Math.random()*65}%;left:${Math.random()*100}%;--min-op:${minOp};--d:${(Math.random()*3+2).toFixed(2)}s;animation-delay:${(Math.random()*5).toFixed(2)}s;opacity:${minOp}`;
    starsEl.appendChild(s);
  }
  
}const cityEl = document.getElementById('cityscape3d');
  [{l:2,w:7,h:38},{l:10,w:5,h:52},{l:16,w:9,h:44},{l:26,w:6,h:65},{l:33,w:8,h:48},
   {l:42,w:5,h:72},{l:48,w:11,h:55},{l:60,w:7,h:60},{l:68,w:6,h:42},{l:75,w:9,h:58},
   {l:85,w:6,h:50},{l:92,w:7,h:40}].forEach(b => {
    const el = document.createElement('div');
    el.className = 'building3d';
    el.style.cssText = `left:${b.l}%;width:${b.w}%;height:${b.h}%;`;
    const wc = Math.max(2,Math.floor(b.w*1.2)), wr = Math.max(3,Math.floor(b.h*0.25));
    let html = '';
    for (let r=0;r<wr;r++) for (let c=0;c<wc;c++) {
      const lit = Math.random()>.4;
      const col = lit ? `rgba(255,${200+Math.floor(Math.random()*55)},${100+Math.floor(Math.random()*80)},.9)` : 'rgba(20,20,30,.5)';
      html += `<div style="position:absolute;width:6px;height:5px;background:${col};box-shadow:${lit?`0 0 6px ${col}`:'none'};border-radius:1px;left:${8+c*(80/wc)}%;top:${8+r*(80/wr)}%"></div>`;
    }
    el.innerHTML = html;
    cityEl.appendChild(el);
  });
// Seats
  const seatsEl = document.getElementById('seats3d');
  [8,10,12,14,16,18].forEach(count => {
    const row = document.createElement('div');
    row.className = 'seat-row3d';
    for (let i=0;i<count;i++) {
      const seat = document.createElement('div');
      const r = Math.random();
      seat.className = 'seat3d'+(r<.25?' taken3d':r<.35?' dlx3d':'');
      row.appendChild(seat);
    }
    seatsEl.appendChild(row);
  });

  const pEl = document.getElementById('particles3d');
  for (let i=0;i<35;i++) {
    const p = document.createElement('div');
    p.className = 'particle3d';
    p.style.cssText = `left:${20+Math.random()*60}%;top:${10+Math.random()*60}%;--tx:${(Math.random()-.5)*200}px;--ty:${(Math.random()-.5)*150}px;--dur:${(Math.random()*8+6).toFixed(1)}s;animation-delay:${(Math.random()*8).toFixed(1)}s;opacity:0`;
    pEl.appendChild(p);
  }
  // Mouse look
  document.getElementById('scene3d').addEventListener('mousemove', e => {
    document.getElementById('cursor3d').style.cssText    += `;left:${e.clientX}px;top:${e.clientY}px`;
    document.getElementById('cursor3d-dot').style.cssText += `;left:${e.clientX}px;top:${e.clientY}px`;
    targetRotY = ((e.clientX - innerWidth/2)  / (innerWidth/2))  * -18;
    targetRotX = ((e.clientY - innerHeight/2) / (innerHeight/2)) *  8;
  });
function start3dLoop() {
  const world = document.getElementById('cinema-world');
  (function frame() {
    currentRotY += (targetRotY - currentRotY) * 0.06;
    currentRotX += (targetRotX - currentRotX) * 0.06;
    world.style.transform = `rotateY(${currentRotY}deg) rotateX(${currentRotX}deg)`;
    animFrame3d = requestAnimationFrame(frame);
  })();
}



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