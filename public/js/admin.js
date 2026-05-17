
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