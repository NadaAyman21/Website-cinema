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
        window.location.href = "vip.html";   // Go to VIP seats
    } else {
        window.location.href = "seats.html"; // Go to Standard seats
    }
}

function closeTerms() {
    window.history.back();
}