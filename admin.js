// LOAD MOVIES
let movies = JSON.parse(localStorage.getItem("movies")) || [];
let editIndex = -1;

const form = document.getElementById("movieForm");
const moviesList = document.getElementById("moviesList");


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
    if(!title || !genre || !time || !image || !age){
        alert("Please fill all required fields!");
        return;
    }

    /* runtime format */
    const timePattern = /^[0-9]+h\s?[0-9]*m?$/;
    if(!timePattern.test(time)){
        alert("Runtime must be like: 2h 30m");
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