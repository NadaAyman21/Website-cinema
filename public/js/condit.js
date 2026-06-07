let currentType = "";
let movieIdParam = "";
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    currentType = urlParams.get('type'); 
    movieIdParam = urlParams.get('id') || (typeof currentMovieId !== 'undefined' ? currentMovieId : "");

    if (!movieIdParam && document.referrer) {
        const refUrl = new URL(document.referrer);
        movieIdParam = refUrl.searchParams.get('id') || "";
    }

    const modalBox = document.getElementById("modalBox"); 

    if (currentType === 'premiere') {
        document.getElementById("premiereRule").style.display = "block";
        modalBox.classList.add("gold-theme"); 
    } else {
        modalBox.classList.add("blue-theme"); 
    }
};
function agree() {
    
    const queryStr = movieIdParam ? `?id=${movieIdParam}` : "";

    if (currentType === "premiere") {
        window.location.href = `/vipSeats${queryStr}`;   
    } else {
        window.location.href = `/normalSeats${queryStr}`; 
    }
}

function closeTerms() {
    window.history.back();
}