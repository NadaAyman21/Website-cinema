
let editingMovieId = null;

// Run automatically on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchMovies();
    
    // Bind form submit event
    const form = document.getElementById('movieForm');
    form.addEventListener('submit', handleFormSubmit);
});

