// ── SLIDER ──────────────────────────────────────────────
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

// AUTO SLIDE
setInterval(() => {
    index++;
    if (index >= slides.length) index = 0;
    showSlide(index);
}, 4000);

createDots();

// ── NAVIGATION ──────────────────────────────────────────
/*function toggleMenu() {
    let nav = document.getElementById("navLinks");
    nav.classList.toggle("active");
}

function goToLogin() {
    window.location.href = "login.html";
}*/

function goToPage(element) {
    window.location.href = element.dataset.page;
}

// ── MOVIES ──────────────────────────────────────────────
let movies = JSON.parse(localStorage.getItem("movies")) || [];
const container = document.getElementById("moviesList");

function displayMovies() {
    if (!container) return;
    container.innerHTML = "";

    if (movies.length === 0) {
        container.innerHTML = "<p class='no-movies'>No movies available.</p>";
        return;
    }

    movies.forEach(movie => {
        container.innerHTML += `
            <a href="/movie?id=${movie.id}" class="movie-card">
                <div class="poster">
                    <img src="${movie.image}" alt="${movie.title}">
                    <span class="age">${movie.age || "+0"}</span>
                </div>
                <h3>${movie.title}</h3>
            </a>
        `;
    });
}

displayMovies();