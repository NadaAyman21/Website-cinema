
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