let slides = document.querySelectorAll(".slide");
let index = 0;

function showSlide(i) {
    slides.forEach(slide => slide.classList.remove("active"));
    slides[i].classList.add("active");
}

function goToLogin(){
    window.location.href = "login.html";
}


// AUTO SLIDE
setInterval(() => {
    index++;
    if (index >= slides.length) index = 0;
    showSlide(index);
}, 4000);

function toggleMenu() {
    let nav = document.getElementById("navLinks");
    nav.classList.toggle("active");
}


function goToPage(element) {
    window.location.href = element.dataset.page;
}

let movies = JSON.parse(localStorage.getItem("movies")) || [];

const container = document.getElementById("moviesList");

function displayMovies() {
    if (!container) return;

    container.innerHTML = "";

    movies.forEach(movie => {
       container.innerHTML += `
    <a href="movie.html?id=${movie.id}" class="movie-card">
        <div class="poster">
            <img src="${movie.image}">
            <span class="age">${movie.age || "+0"}</span>
        </div>
        <h3>${movie.title}</h3>
    </a>
`;
    });
}

displayMovies();

const dotsContainer = document.getElementById("dots");

function createDots() {
    slides.forEach((_, i) => {
        let dot = document.createElement("span");
        dot.classList.add("dot");
        if (i === 0) dot.classList.add("active");

        dot.onclick = () => {
            index = i;
            showSlide(index);
            updateDots();
        };

        dotsContainer.appendChild(dot);
    });
}

function updateDots() {
    let dots = document.querySelectorAll(".dot");
    dots.forEach(dot => dot.classList.remove("active"));
    dots[index].classList.add("active");
}

// Update inside showSlide
function showSlide(i) {
    slides.forEach(slide => slide.classList.remove("active"));
    slides[i].classList.add("active");
    updateDots();
}

createDots();