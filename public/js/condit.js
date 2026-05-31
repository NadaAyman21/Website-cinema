let currentType = "";
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    currentType = urlParams.get('type'); 

    const modalBox = document.getElementById("modalBox"); 

    if (currentType === 'premiere') {
        document.getElementById("premiereRule").style.display = "block";
        modalBox.classList.add("gold-theme"); 
    } else {
        modalBox.classList.add("blue-theme"); 
    }
};
function agree() {
    if (currentType === "premiere") {
        window.location.href = "/vipSeats";   
    } else {
        window.location.href = "/normalSeats"; 
    }
}

function closeTerms() {
    window.history.back();
}