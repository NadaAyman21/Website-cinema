
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

    let link = movie.trailer;

    // CASE 1: already embed link
    if (link.includes("embed")) {
        iframe.src = link + "?autoplay=1";
    }

    // CASE 2: normal youtube link
    else if (link.includes("watch?v=")) {
        let id = link.split("v=")[1].split("&")[0];
        iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1`;
    }

    // CASE 3: short youtu.be link
    else if (link.includes("youtu.be")) {
        let id = link.split("youtu.be/")[1];
        iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1`;
    }

    // CASE 4: just ID
    else {
        iframe.src = `https://www.youtube.com/embed/${link}?autoplay=1`;
    }

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

let selectedExperience = "STANDARD&DELUXE";
function selectExp(btn){
    document.querySelectorAll(".exp-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    // Store the choice
     selectedExperience = btn.innerText.trim();
}

function selectTime(btn){
    document.querySelectorAll(".time").forEach(t => t.classList.remove("active"));
    btn.classList.add("active");
 const movieTitle = document.getElementById("title").innerText;
    const selectedTime = btn.innerText;
    
    // Get date parts from the active date card
    const activeDateCard = document.querySelector(".date-card.active");
    const dayName = activeDateCard.querySelector("strong").innerText; // e.g., "Today" or "SUN"
    const fullDate = activeDateCard.innerText.split('\n')[1] || activeDateCard.innerText; // e.g., "20 Apr"

    // SAVE using the keys orderSum.js expects
    localStorage.setItem('selectedMovie', movieTitle);
    localStorage.setItem('selectedTime', selectedTime);
    localStorage.setItem('selectedDay', dayName);
    localStorage.setItem('selectedDateText', `${fullDate}, 2026`);

    // Determine the type to send to conditions.html
    let typeParam = "standard";
    if (selectedExperience === "PREMIERE") {
        typeParam = "premiere";
    }

    // Redirect to conditions.html with the type in the URL
    window.location.href = `condtions.html?type=${typeParam}`;

}

