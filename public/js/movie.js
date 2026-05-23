const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");


document.addEventListener("DOMContentLoaded", () => {
    if (!movieId) {
        console.error("No Movie ID supplied in query parameters.");
        return;
    }
    
    loadMovieDetails(movieId);
    loadOtherRecommendations(movieId);
    initializeCalendarTimeline();
});


async function loadMovieDetails(id) {
    try {
        const res = await fetch(`/api/movies/${id}`);
        if (!res.ok) throw new Error("Target movie payload couldn't be loaded.");
        
        const movie = await res.json();
        renderActiveMovieInfo(movie);
    } catch (err) {
        console.error("Error setting up details area view:", err);
        document.getElementById("title").innerText = "Failed to load movie.";
    }
}
