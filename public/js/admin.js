let editingMovieId = null;
//  SHOWTIMES BUILDER
// ═══════════════════════════════════════
let showtimes = [];

function addShowtime() {
  const input = document.getElementById('showtimeInput');
  const val   = input.value.trim();
  if (!val) return;
  if (showtimes.includes(val)) { showAlert('This time already exists!'); return; }

  showtimes.push(val);
  input.value = '';
  renderShowtimeTags();
}

function removeShowtime(time) {
  showtimes = showtimes.filter(t => t !== time);
  renderShowtimeTags();
}

function renderShowtimeTags() {
  const builder = document.getElementById('showtimesBuilder');
  builder.innerHTML = '';
  showtimes.forEach(t => {
    const tag = document.createElement('div');
    tag.className = 'showtime-tag';
    tag.innerHTML = `${t} <button type="button" onclick="removeShowtime('${t}')">×</button>`;
    builder.appendChild(tag);
  });
}

// ── Allow pressing Enter to add showtime ──
document.getElementById('showtimeInput')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') { e.preventDefault(); addShowtime(); }
});

document.addEventListener('DOMContentLoaded', () => {
    fetchMovies();
    
    const form = document.getElementById('movieForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});

function validateTitle(title) {
    return title.length >= 2;
}

function validateGenre(genre) {
    return /^[A-Za-z\s\/]+$/.test(genre) && /[A-Za-z]/.test(genre);
}

function validateTime(time) {
    return /^[0-9]+h\s?[0-9]*m?$/.test(time);
}

function validateImage(path) {
    return /^(https?:\/\/.*\.(jpg|jpeg|png|gif|webp)|\.?\/?images\/.+\.(jpg|jpeg|png|gif|webp))$/i.test(path);
}

function validateAge(age) {
    return /^\+(?:[1-9]|1[0-9]|2[01])$/.test(age) || /^[A-Za-z0-9\+]+$/.test(age);
}

function validateTrailer(trailer) {
    if (trailer === "") return true;
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(trailer);
}


async function fetchMovies() {
    try {
        const res = await fetch('/api/movies');
        const movies = await res.json();
        renderMoviesList(movies);
    } catch (err) {
        console.error("Error fetching movies:", err);
    }
}

function renderMoviesList(movies) {
    const listContainer = document.getElementById('moviesList');
    if (!listContainer) return;
    listContainer.innerHTML = ''; // Reset container

    if (movies.length === 0) {
        listContainer.innerHTML = '<p style="color:#6b6b80;">No movies found in database.</p>';
        return;
    }

    movies.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card'; 
        card.innerHTML = `
            <img src="${movie.imageUrl}" alt="${movie.title}" style="width:100%; border-radius:8px;">
            <h3>${movie.title}</h3>
            <p><strong>Genre:</strong> ${movie.genre}</p>
            <p><strong>Duration:</strong> ${movie.runTime}</p>
            <p><strong>Story:</strong> ${movie.description || 'N/A'}</p>
            <div style="margin-top: 10px; display:flex; gap:10px;">
                <button class="edit-btn-action" style="background:#f1c40f; color:#000; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Edit</button>
                <button class="delete-btn-action" style="background:#e74c3c; color:#fff; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Delete</button>
            </div>
        `;

       
        const editBtn = card.querySelector('.edit-btn-action');
        const deleteBtn = card.querySelector('.delete-btn-action');

        editBtn.addEventListener('click', () => {
            populateFormForEditing(movie);
        });

        deleteBtn.addEventListener('click', () => {
            deleteMovie(movie._id);
        });

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
    showtimes = movie.showtimes || [];
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

    const payload = { title, genre, runTime, ageRating, imageUrl, videoUrl, cast, description };

    let url = '/api/movies/add';
    let method = 'POST';

    if (editingMovieId) {
        url = `/api/movies/edit/${editingMovieId}`;
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
    } catch (err) {
        console.error("Submission failed:", err);
    }
}

async function deleteMovie(id) {
    if (!confirm("Are you sure you want to delete this movie?")) return;

    try {
        const res = await fetch(`/api/movies/delete/${id}`, { method: 'DELETE' });
        if (res.ok) {
            showAlert("Movie deleted!");
            fetchMovies();
        } else {
            showAlert("Failed to delete movie.");
        }
    } catch (err) {
        console.error(err);
    }
}


function showAlert(msg) {
    document.getElementById('alertMessage').innerText = msg;
    document.getElementById('customAlert').style.display = 'flex';
}

function closeAlert() {
    document.getElementById('customAlert').style.display = 'none';
}

function logout() {
    alert("Logging out...");
    window.location.href = "/logout";
}