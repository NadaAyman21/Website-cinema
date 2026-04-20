let slides = document.querySelectorAll(".slide");
let index = 0;

function showSlide(i) {
    slides.forEach(slide => slide.classList.remove("active"));
    slides[i].classList.add("active");
}

// NEXT
document.querySelector(".next").onclick = () => {
    index++;
    if (index >= slides.length) index = 0;
    showSlide(index);
};

// PREV
document.querySelector(".prev").onclick = () => {
    index--;
    if (index < 0) index = slides.length - 1;
    showSlide(index);
};

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