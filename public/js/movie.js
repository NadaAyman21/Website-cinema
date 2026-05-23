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

function renderActiveMovieInfo(movie) {
    document.getElementById("title").innerText = movie.title || "Untitled";
    document.getElementById("genre").innerText = movie.genre || "N/A";
    document.getElementById("time").innerText = "⏱ " + (movie.runTime || "N/A");
    document.getElementById("story").innerText = movie.description || "No synopsis recorded yet.";
    document.getElementById("age").textContent = movie.ageRating || "+0";

    if (Array.isArray(movie.cast)) {
        document.getElementById("cast").innerText = movie.cast.join(', ');
    } else {
        document.getElementById("cast").innerText = movie.cast || "No cast breakdown available.";
    }

   
    const posterImg = document.getElementById("poster");
    if (posterImg) {
        posterImg.src = movie.imageUrl || "/images/homepage.jpg";
        posterImg.alt = movie.title;
    }

    const heroBg = document.getElementById("hero");
    if (heroBg && movie.imageUrl) {
        heroBg.style.backgroundImage = `linear-gradient(to bottom, rgba(11, 11, 18, 0.95), rgba(11, 11, 18, 0.75)), url('${movie.imageUrl}')`;
    }

    const trailerBtn = document.getElementById("trailerBtn");
    if (trailerBtn) {
        trailerBtn.onclick = function () {
            const iframe = document.getElementById("videoPlayer");
            let link = movie.videoUrl || "";

            if (!link) {
                alert("No trailer link provided for this title.");
                return;
            }

            if (link.includes("embed")) {
                iframe.src = link + "?autoplay=1";
            } else if (link.includes("watch?v=")) {
                let vId = link.split("v=")[1].split("&")[0];
                iframe.src = `https://www.youtube.com/embed/${vId}?autoplay=1`;
            } else if (link.includes("youtu.be")) {
                let vId = link.split("youtu.be/")[1];
                iframe.src = `https://www.youtube.com/embed/${vId}?autoplay=1`;
            } else {
                iframe.src = `https://www.youtube.com/embed/${link}?autoplay=1`;
            }

            document.getElementById("videoModal").style.display = "block";
        };
    }
}

async function loadOtherRecommendations(currentId) {
    const otherContainer = document.getElementById("otherMovies");
    if (!otherContainer) return;
    
    try {
        const res = await fetch('/api/movies');
        const allMovies = await res.json();
        otherContainer.innerHTML = "";

        // Filter away the currently active movie object card out of recommendation limits
        const filterList = allMovies.filter(m => m._id !== currentId);

        if (filterList.length === 0) {
            otherContainer.innerHTML = `<p style="padding: 0 40px; color:#6b6b80;">No alternative matches found.</p>`;
            return;
        }

        // Render dynamic element components into row grid viewport wrapper
        filterList.forEach(m => {
            otherContainer.innerHTML += `
                <a href="/movie?id=${m._id}" class="movie-card">
                    <img src="${m.imageUrl}" alt="${m.title}" onerror="this.src='/images/homepage.jpg';">
                    <span class="age">${m.ageRating || "+0"}</span>
                </a>
            `;
        });
    } catch (err) {
        console.error("Error setting up database carousel rows:", err);
        otherContainer.innerHTML = `<p style="padding: 0 40px; color:#e74c3c;">Failed to populate recommended movies.</p>`;
    }
}

const closeModalElement = document.querySelector(".close-btn");
if (closeModalElement) {
    closeModalElement.onclick = function () {
        document.getElementById("videoModal").style.display = "none";
        document.getElementById("videoPlayer").src = ""; 
    };
}

window.onclick = function(event) {
    const modal = document.getElementById("videoModal");
    if (event.target == modal) {
        modal.style.display = "none";
        document.getElementById("videoPlayer").src = "";
    }
};

function initializeCalendarTimeline() {
    const dateContainer = document.getElementById("date-container");
    if (!dateContainer) return;
    dateContainer.innerHTML = ""; // Clean structural setup boundaries

    const days = ["SUN","MON","TUE","WED","THU","FRI","SAT"];

    for (let i = 0; i < 4; i++) {
        let d = new Date();
        d.setDate(d.getDate() + i);

        const card = document.createElement("div");
        card.classList.add("date-card");
        if (i === 0) card.classList.add("active");

        card.innerHTML = `
            <strong>${i === 0 ? "Today" : days[d.getDay()]}</strong><br>
            ${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}
        `;

        card.onclick = () => {
            document.querySelectorAll(".date-card").forEach(c => c.classList.remove("active"));
            card.classList.add("active");
        };

        dateContainer.appendChild(card);
    }
}
