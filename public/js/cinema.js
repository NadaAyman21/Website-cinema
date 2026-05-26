
let slides = document.querySelectorAll(".slide");
let index = 0;

const dotsContainer = document.getElementById("dots");

function updateDots() {
    let dots = document.querySelectorAll(".dot");
    dots.forEach(dot => dot.classList.remove("active"));
    if (dots[index]) dots[index].classList.add("active");
}

function showSlide(i) {
    slides.forEach(slide => slide.classList.remove("active"));
    slides[i].classList.add("active");
    updateDots();
}

function createDots() {
    slides.forEach((_, i) => {
        let dot = document.createElement("span");
        dot.classList.add("dot");
        if (i === 0) dot.classList.add("active");
        dot.onclick = () => {
            index = i;
            showSlide(index);
        };
        dotsContainer.appendChild(dot);
    });
}


setInterval(() => {
    index++;
    if (index >= slides.length) index = 0;
    showSlide(index);
}, 4000);

createDots();

function goToPage(element) {
    window.location.href = element.dataset.page;
}


const container = document.getElementById("moviesList");

async function displayMovies() {
    if (!container) return;
    
    container.innerHTML = "<p class='loading-movies'>Loading movies...</p>";

    try {
        const response = await fetch('/movie/api/all'); 
        const movies = await response.json();

        container.innerHTML = "";

        if (!movies || movies.length === 0) {
            container.innerHTML = "<p class='no-movies'>No movies available at the moment.</p>";
            return;
        }
        
        movies.forEach(movie => {
            container.innerHTML += `
                <a href="/movie?id=${movie._id}" class="movie-card">
                    <div class="poster">
                        <img src="${movie.imageUrl}" alt="${movie.title}" onerror="this.src='/images/homepage.jpg';">
                        <span class="age">${movie.ageRating || "PG"}</span>
                    </div>
                    <h3>${movie.title}</h3>
                </a>
            `;
        });
    } catch (err) {
        console.error("Error fetching movies from database:", err);
        container.innerHTML = "<p class='error-movies'>Failed to load movies. Please try again later.</p>";
    }
}
displayMovies();