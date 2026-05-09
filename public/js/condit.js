let currentType = "";
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    currentType = urlParams.get('type'); // "premiere" or "standard"

    if (currentType === 'premiere') {
        document.getElementById("premiereRule").style.display = "block";
    }
};

function agree() {
    if (currentType === "premiere") {
        window.location.href = "/vipSeats";   // Go to VIP seats
    } else {
        window.location.href = "/normalSeats"; // Go to Standard seats
    }
}

function closeTerms() {
    window.history.back();
}