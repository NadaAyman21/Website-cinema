// LOAD MOVIES
let movies = JSON.parse(localStorage.getItem("movies")) || [];
let editIndex = -1;

const form = document.getElementById("movieForm");
const moviesList = document.getElementById("moviesList");

// 2. ALERT SYSTEM
function showAlert(message) {
    const modal = document.getElementById("customAlert");
    if (modal) {
        document.getElementById("alertMessage").innerText = message;
        modal.style.display = "flex";
    }
}

function closeAlert() {
    const modal = document.getElementById("customAlert");
    if (modal) {
        modal.style.display = "none";
    }
}

/* DISPLAY MOVIES */
function displayMovies(){
    moviesList.innerHTML = "";

    movies.forEach((movie, index) => {

        const movieDiv = document.createElement("div");
        movieDiv.classList.add("movie");

        movieDiv.innerHTML = `
            <img src="${movie.image}">
            <h4>${movie.title}</h4>
            <p><i class="fa-solid fa-film"></i> ${movie.genre}</p>
            <p><i class="fa-solid fa-clock"></i> ${movie.time}</p>

            <p><b>Story:</b> ${movie.story || "—"}</p>
            <p><b>Cast:</b> ${movie.cast || "—"}</p>

            <button class="edit" onclick="editMovie(${index})">Edit</button>
            <button class="delete" onclick="deleteMovie(${index})">Delete</button>
        `;

        moviesList.appendChild(movieDiv);
    });
}


/* ADD OR UPDATE */
form.addEventListener("submit", function(e){
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const genre = document.getElementById("genre").value.trim();
    const time = document.getElementById("time").value.trim();
    const image = document.getElementById("image").value.trim();

    
    const story = document.getElementById("story").value.trim();
    const cast = document.getElementById("cast").value.trim();
    const trailer = document.getElementById("trailer").value.trim();
    const age = document.getElementById("age").value.trim();

    /* VALIDATION */
    if(!validateTitle(title)){
    showAlert("Title must be at least 2 characters!");
    return;
}



/* VALIDATION FUNCTIONS */

// Title: at least 2 characters
function validateTitle(title){
    return title.length >= 2;
}

// Genre: letters only
function validateGenre(genre){
    // letters + spaces + "/" only, must contain at least one letter
    return /^[A-Za-z\s\/]+$/.test(genre) && /[A-Za-z]/.test(genre);
}
// Time: format مثل 2h أو 2h 30m
function validateTime(time){
    return /^[0-9]+h\s?[0-9]*m?$/.test(time);
}

// Image: must be a valid URL
function validateImage(path){
    return /^(https?:\/\/.*\.(jpg|jpeg|png|gif|webp)|\.?\/?images\/.+\.(jpg|jpeg|png|gif|webp))$/i.test(path);
}

// Age: only numbers between 1 and 21 (cinema ratings)
function validateAge(age){
    // "+" before number (like +13, +16, +18)
    return /^\+(?:[1-9]|1[0-9]|2[01])$/.test(age);
}

// Trailer: optional but must be YouTube link if موجود
function validateTrailer(trailer){
    if(trailer === "") return true;
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(trailer);
}

if(!validateGenre(genre)){
    showAlert("Genre must contain letters only!");
    return;
}

if(!validateTime(time)){
    showAlert("Time must be like: 2h or 2h 30m");
    return;
}

if(!validateImage(image)){
    showAlert("Image must be a valid image URL!");
    return;
}

if(!validateAge(age)){
    showAlert("Age must be a number between 1 and 21!");
    return;
}

if(!validateTrailer(trailer)){
    showAlert("Trailer must be a valid YouTube link!");
    return;
}

    /* CREATE MOVIE OBJECT */
    const movie = {
        id: title.toLowerCase().replace(/\s+/g, ""), // unique id
        title,
        genre,
        time,
        image,
        age,
        story,
        cast,
        trailer
    };

    if(editIndex === -1){
        movies.push(movie);
    } else {
        movies[editIndex] = movie;
        editIndex = -1;
    }

    localStorage.setItem("movies", JSON.stringify(movies));

    form.reset();
    displayMovies();
});

function logout(){
    localStorage.removeItem("loggedInUser");
    window.location.href = "cinemaM.html"; // or home.html
}

/* DELETE */
function deleteMovie(index){
    movies.splice(index,1);
    localStorage.setItem("movies", JSON.stringify(movies));
    displayMovies();
}


/* EDIT */
function editMovie(index){
    const movie = movies[index];

    document.getElementById("title").value = movie.title;
    document.getElementById("genre").value = movie.genre;
    document.getElementById("time").value = movie.time;
    document.getElementById("image").value = movie.image;

    document.getElementById("story").value = movie.story || "";
    document.getElementById("cast").value = movie.cast || "";
    document.getElementById("trailer").value = movie.trailer || "";
    document.getElementById("age").value = movie.age || "";

    editIndex = index;
}


/* LOAD */
displayMovies();