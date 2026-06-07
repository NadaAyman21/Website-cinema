let editingMovieId = null;
let showtimes = [];

function addShowtime() {
  const timeInput = document.getElementById('showtimeInput');
  const daySelect = document.getElementById('showtimeDaySelect');
  const expSelect = document.getElementById('showtimeExpSelect');

  const timeVal = timeInput.value.trim();
  const dayVal  = daySelect.value;
  const expVal  = expSelect.value;

  if (!timeVal) return;

  const payloadString = `${dayVal}|${timeVal}|${expVal}`;

  if (showtimes.includes(payloadString)) { 
    showAlert('This exact showtime mapping configuration already exists!'); 
    return; 
  }

  showtimes.push(payloadString);
  timeInput.value = ''; 
  renderShowtimeTags();
}

function removeShowtime(rawString) {
  showtimes = showtimes.filter(t => t !== rawString);
  renderShowtimeTags();
}

function renderShowtimeTags() {
  const builder = document.getElementById('showtimesBuilder');
  if (!builder) return;
  
  builder.innerHTML = ''; 
  
  showtimes.forEach(t => {
    const parts = t.split('|');
    if (parts.length < 3) return;

    const displayDay  = parts[0];
    const displayTime = parts[1];
    const displayExp  = parts[2] === 'STANDARD&DELUXE' ? 'Std' : 'Prem';

    const tag = document.createElement('div');
    tag.className = 'showtime-tag';
    
    tag.style.display = 'inline-flex';
    tag.style.alignItems = 'center';
    tag.style.gap = '6px';
    tag.style.margin = '4px';
    tag.style.padding = '6px 10px';
    tag.style.background = '#6c5ce7';
    tag.style.color = '#fff';
    tag.style.borderRadius = '6px';
    tag.style.fontSize = '12px';
    tag.style.fontWeight = '500';

    tag.innerHTML = `
      <span>[${displayDay}] ${displayTime} (${displayExp})</span> 
      <button type="button" onclick="removeShowtime('${t}')" style="background:none; border:none; color:#fff; cursor:pointer; font-weight:bold; font-size:14px; margin-left:4px; padding:0; line-height:1;">×</button>
    `;
    builder.appendChild(tag);
  });
}

document.getElementById('showtimeInput')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') { 
    e.preventDefault(); 
    addShowtime(); 
  }
});

document.addEventListener('DOMContentLoaded', () => {
    fetchMovies();
    const form = document.getElementById('movieForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});

function validateTitle(title) { return title.length >= 2; }
function validateGenre(genre) { return /^[A-Za-z\s\/]+$/.test(genre) && /[A-Za-z]/.test(genre); }
function validateTime(time) { return /^[0-9]+h\s?[0-9]*m?$/.test(time); }
function validateImage(path) { return /^(https?:\/\/.*\.(jpg|jpeg|png|gif|webp)|\.?\/?images\/.+\.(jpg|jpeg|png|gif|webp))$/i.test(path); }
function validateAge(age) { return /^\+(?:[1-9]|1[0-9]|2[01])$/.test(age);}
function validateTrailer(trailer) {
    if (trailer === "") return true;
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(trailer);
}
async function fetchMovies() {
    try {
        const res = await fetch('/movie/api/all');
        const movies = await res.json();
        renderMoviesList(movies);
    } catch (err) {
        console.error("Error fetching movies:", err);
    }
}

function renderMoviesList(movies) {
  const listContainer = document.getElementById('moviesList');
  if (!listContainer) return;
  listContainer.innerHTML = '';

  if (movies.length === 0) {
    listContainer.innerHTML = '<p style="color:var(--muted);">No movies found in database.</p>';
    return;
  }
 movies.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'movie';
    card.innerHTML = `
      <img src="${movie.imageUrl}" alt="${movie.title}">
      <div class="movie-info">
        <h4>${movie.title}</h4>
        <span>${movie.genre} · ${movie.runTime}</span>
      </div>
      <div class="movie-actions">
        <button class="edit">Edit</button>
        <button class="delete">Delete</button>
      </div>
    `;
    card.querySelector('.edit').addEventListener('click',   () => populateFormForEditing(movie));
    card.querySelector('.delete').addEventListener('click', () => deleteMovie(movie._id));
    listContainer.appendChild(card);
  });
}

function populateFormForEditing(movie) {
    editingMovieId = movie._id;

    document.getElementById('title').value = movie.title || '';
    document.getElementById('genre').value = movie.genre || '';
    document.getElementById('time').value = movie.runTime || '';
    document.getElementById('age').value = movie.ageRating || '';
    document.getElementById('image').value = movie.imageUrl || '';
    document.getElementById('trailer').value = movie.videoUrl || '';
    if (movie.showtimes && movie.showtimes.length > 0) {
        showtimes = movie.showtimes.map(str => {
            try {
                const dayMatch = str.match(/\[(.*?)\]/);
                const timeMatch = str.match(/\]\s*(.*?)\s*\(/); 
                const expMatch = str.match(/\((.*?)\)/);

                if (dayMatch && timeMatch && expMatch) {
                    const day = dayMatch[1].trim();
                    const time = timeMatch[1].trim();
                    
                    let exp = 'PREMIERE';
                    if (expMatch[1].trim() === 'Std' || expMatch[1].trim() === 'STANDARD&DELUXE') {
                        exp = 'STANDARD&DELUXE';
                    }
                    return `${day}|${time}|${exp}`;
                }
            } catch (e) {
                console.error("String mapping fail fallback:", e);
            }
            return str; 
        });
    } else {
        showtimes = [];
    }
    
    renderShowtimeTags();
         
    if (Array.isArray(movie.cast)) {
        document.getElementById('cast').value = movie.cast.join(', ');
    } else {
        document.getElementById('cast').value = movie.cast || '';
    }
    
    document.getElementById('story').value = movie.description || '';

    const submitBtn = document.querySelector('#movieForm button[type="submit"]');
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Update Movie';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const title       = document.getElementById('title').value.trim();
    const genre       = document.getElementById('genre').value.trim();
    const runTime     = document.getElementById('time').value.trim();
    const ageRating   = document.getElementById('age').value.trim();
    const imageUrl    = document.getElementById('image').value.trim();
    const videoUrl    = document.getElementById('trailer').value.trim();
    const cast        = document.getElementById('cast').value.trim();
    const description = document.getElementById('story').value.trim();

    if (!validateTitle(title)) { showAlert("Title must be at least 2 characters!"); return; }
    if (!validateGenre(genre)) { showAlert("Genre must contain letters only!"); return; }
    if (!validateTime(runTime)) { showAlert("Time must be like: 2h or 2h 30m"); return; }
    if (!validateImage(imageUrl)) { showAlert("Image must be a valid image URL or path!"); return; }
    if (!validateAge(ageRating)) { showAlert("Age must be like +12, +16, +18 etc."); return; }
    if (!validateTrailer(videoUrl)) { showAlert("Trailer must be a valid YouTube link!"); return; }
    if (cast === "") { 
        showAlert("Cast information is required!"); 
        return; 
    }
    if (description === "") { 
        showAlert("Story description is required!"); 
        return; 
    }

    const structuredShowtimes = showtimes.map(t => {
        const parts = t.split('|');
        const dayLabel = parts[0];
        const displayExp = parts[2] === 'STANDARD&DELUXE' ? 'Std' : 'Prem';
        return `[${dayLabel}] ${parts[1]} (${displayExp})`;
    });

    const payload = { title, genre, runTime, ageRating, imageUrl, videoUrl, cast, description, showtimes: structuredShowtimes };

    let url = '/movie/add';
    let method = 'POST';

    if (editingMovieId) {
        url = `/movie/edit/${editingMovieId}`;
        method = 'PUT';
    }

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            showAlert(editingMovieId ? "Movie updated successfully!" : "Movie added successfully!");
            document.getElementById('movieForm').reset();
            showtimes = [];              
            renderShowtimeTags();
            editingMovieId = null; 
            
            const submitBtn = document.querySelector('#movieForm button[type="submit"]');
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Movie';
            }
            fetchMovies(); 
        } else {
            const data = await res.json();
            showAlert("Error: " + data.message);
        }
    } catch (err) { console.error("Submission failed:", err); }
}

async function deleteMovie(id) {
    if (!confirm("Are you sure you want to delete this movie?")) return;
    try {
        const res = await fetch(`/movie/delete/${id}`, { method: 'DELETE' });
        if (res.ok) {
            showAlert("Movie deleted!");
            fetchMovies();
        } else {
            showAlert("Failed to delete movie.");
        }
    } catch (err) { console.error(err); }
}

function showAlert(msg) {
    document.getElementById('alertMessage').innerText = msg;
    document.getElementById('customAlert').style.display = 'flex';
}
function closeAlert() { document.getElementById('customAlert').style.display = 'none'; }
function logout() { alert("Logging out..."); window.location.href = "/logout"; }

let allReservations = [];

async function fetchReservations() {
  try {
    const res  = await fetch('/reservation/admin/all');
    allReservations = await res.json();
    updateStats();
    renderReservations();
  } catch (err) {
    console.error('Failed to fetch reservations:', err);
  }
}

function updateStats() {
  document.getElementById('statTotal').textContent   = allReservations.length;
  document.getElementById('statSeats').textContent   = allReservations.reduce((s, r) => s + r.seats.length, 0);
  document.getElementById('statRevenue').textContent = allReservations.reduce((s, r) => s + r.totalPrice, 0).toLocaleString();
}

function renderReservations() {
  const query    = (document.getElementById('reservationSearch')?.value || '').toLowerCase();
  const tbody    = document.getElementById('reservationsBody');
  const empty    = document.getElementById('reservationsEmpty');

  const filtered = allReservations.filter(r =>
    r.movie?.toLowerCase().includes(query) ||
    r.user?.firstName?.toLowerCase().includes(query) ||
    r.user?.lastName?.toLowerCase().includes(query) ||
    r.user?.email?.toLowerCase().includes(query)
  );

  tbody.innerHTML = '';

  if (filtered.length === 0) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  filtered.forEach((r, i) => {
    const name = r.user ? `${r.user.firstName} ${r.user.lastName}` : 'Unknown';
    const tr   = document.createElement('tr');
    tr.className = 'reservation-row';
    tr.innerHTML = `
      <td class="col-index">${i + 1}</td>
      <td class="col-movie">
        <div style="color:var(--text); font-weight:600;">${r.movie || '—'}</div>
        <div style="font-size:11px; color:var(--muted);">${r.hall || ''} Hall</div>
      </td>
      <td class="col-name">
        <div style="color:var(--text);">${name}</div>
        <div style="font-size:11px; color:var(--muted);">${r.user?.email || ''}</div>
      </td>
      <td class="col-datetime">
        <div>${r.date || '—'}</div>
        <div style="font-size:11px;">${r.showtime || ''}</div>
      </td>
      <td class="col-seats">
        ${r.seats.map(s => `<span class="seat-badge">${s}</span>`).join('')}
      </td>
      <td class="col-price" style="color:var(--accent2);">${r.totalPrice} EGP</td>
      <td class="col-actions">
        <button class="delete-btn" onclick="deleteReservation('${r._id}')">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function deleteReservation(id) {
  if (!confirm('Delete this reservation?')) return;
  try {
    await fetch(`/reservation/admin/${id}`, { method: 'DELETE' });
    allReservations = allReservations.filter(r => r._id !== id);
    updateStats();
    renderReservations();
  } catch (err) {
    console.error(err);
  }
}

async function clearAllReservations() {
  if (!confirm('Clear ALL reservations? This cannot be undone.')) return;
  try {
    await fetch('/reservation/admin/all/clear', { method: 'DELETE' });
    allReservations = [];
    updateStats();
    renderReservations();
  } catch (err) {
    console.error(err);
  }
}


fetchReservations();