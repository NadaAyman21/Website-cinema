
// GET MOVIE ID FROM URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// GET MOVIES FROM LOCAL STORAGE
const movies = JSON.parse(localStorage.getItem("movies")) || [];

// FIND MOVIE
const movie = movies.find(m => m.id == id);

// DISPLAY DATA
if (movie) {

    document.getElementById("title").innerText = movie.title;
    document.getElementById("genre").innerText = movie.genre;
    document.getElementById("time").innerText = "⏱ " + movie.time;
    document.getElementById("story").innerText = movie.story || "No story available";
    document.getElementById("cast").innerText = movie.cast || "No cast info";

    document.getElementById("poster").src = movie.image;
    document.getElementById("age").textContent = movie.age || "+0";

    // BACKGROUND IMAGE
    document.getElementById("hero").style.backgroundImage =
        `linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.6)), url('${movie.image}')`;

    // TRAILER BUTTON
    document.getElementById("trailerBtn").onclick = function () {
        const iframe = document.getElementById("videoPlayer");
        iframe.src = `https://www.youtube.com/embed/${movie.trailer}?autoplay=1`;
        document.getElementById("videoModal").style.display = "block";
    };
}

// CLOSE MODAL
document.querySelector(".close-btn").onclick = function () {
    const modal = document.getElementById("videoModal");
    const iframe = document.getElementById("videoPlayer");

    modal.style.display = "none";
    iframe.src = ""; // stop video
};

// CLICK OUTSIDE TO CLOSE
window.onclick = function(event) {
    const modal = document.getElementById("videoModal");
    if (event.target == modal) {
        modal.style.display = "none";
        document.getElementById("videoPlayer").src = "";
    }
};

// SHOW OTHER MOVIES
const otherContainer = document.getElementById("otherMovies");

movies.forEach(m => {

    // skip current movie
    if (m.id == id) return;

    otherContainer.innerHTML += `
        <a href="movie.html?id=${m.id}" class="movie-card">
            <img src="${m.image}">
           <span class="age">${m.age || "+0"}</span>
        </a>
    `;
});

// CREATE DATES (Today + 3 days)
const dateContainer = document.getElementById("date-container");

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

function selectExp(btn){
    document.querySelectorAll(".exp-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
}

function selectTime(btn){
    document.querySelectorAll(".time").forEach(t => t.classList.remove("active"));
    btn.classList.add("active");
}


fetch("nav.html")
  .then(response => response.text())
  .then(data => {
    document.getElementById("navbar").innerHTML = data;
  });

