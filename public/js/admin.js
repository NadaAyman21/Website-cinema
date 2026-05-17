
let editingMovieId = null;

// Run automatically on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchMovies();
    
    // Bind form submit event
    const form = document.getElementById('movieForm');
    form.addEventListener('submit', handleFormSubmit);
});

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
    listContainer.innerHTML = ''; // Reset container

    if(movies.length === 0) {
        listContainer.innerHTML = '<p style="color:#6b6b80;">No movies found in database.</p>';
        return;
    }

    movies.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card'; // Double-check this matches your admin.css style
        card.innerHTML = `
            <img src="${movie.imageUrl}" alt="${movie.title}" style="width:100%; border-radius:8px;">
            <h3>${movie.title}</h3>
            <p><strong>Genre:</strong> ${movie.genre}</p>
            <p><strong>Duration:</strong> ${movie.runTime}</p>
            <p><strong>Story:</strong> ${movie.description || 'N/A'}</p>
            <div style="margin-top: 10px; display:flex; gap:10px;">
                <button onclick="editMovie('${movie._id}', '${escapeHtml(JSON.stringify(movie))}')" style="background:#f1c40f; color:#000; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Edit</button>
                <button onclick="deleteMovie('${movie._id}')" style="background:#e74c3c; color:#fff; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Delete</button>
            </div>
        `;
        listContainer.appendChild(card);
    });
}

async function handleFormSubmit(e) {
    e.preventDefault();

    // Collect values matching your backend structure expectations
    const payload = {
        title: document.getElementById('title').value,
        genre: document.getElementById('genre').value,
        runTime: document.getElementById('time').value,
        ageRating: document.getElementById('age').value,
        imageUrl: document.getElementById('image').value,
        videoUrl: document.getElementById('trailer').value,
        cast: document.getElementById('cast').value,
        description: document.getElementById('story').value
    };

    let url = '/api/movies/add';
    let method = 'POST';

    // Switch details if editing mode is active
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
            editingMovieId = null; // Reset form status tracker
            document.querySelector('#movieForm button[type="submit"]').innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Movie';
            fetchMovies(); // Reload layout
        } else {
            const data = await res.json();
            showAlert("Error: " + data.message);
        }
    } catch (err) {
        console.error("Submission failed:", err);
    }
      
}
function editMovie(id, movieString) {
    const movie = JSON.parse(movieString);
    editingMovieId = id;

    // Pop values up into form fields
    document.getElementById('title').value = movie.title;
    document.getElementById('genre').value = movie.genre;
    document.getElementById('time').value = movie.runTime;
    document.getElementById('age').value = movie.ageRating;
    document.getElementById('image').value = movie.imageUrl;
    document.getElementById('trailer').value = movie.videoUrl;
    document.getElementById('cast').value = Array.isArray(movie.cast) ? movie.cast.join(', ') : movie.cast;
    document.getElementById('story').value = movie.description || '';

    // Transform submission button UI
    document.querySelector('#movieForm button[type="submit"]').innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Update Movie';
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
function escapeHtml(str) {
    return str.replace(/'/g, "&apos;").replace(/"/g, "&quot;");
}
function logout() {
    alert("Logging out...");
    window.location.href = "/";
}