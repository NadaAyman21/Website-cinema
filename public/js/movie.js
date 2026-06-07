const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");

let selectedExperience = "STANDARD&DELUXE";
let selectedDayLabel = ""; 

document.addEventListener("DOMContentLoaded", () => {
    if (!movieId) {
        console.error("No Movie ID supplied in query parameters.");
        return;
    }
    const heroBg = document.getElementById("hero");
    const posterImg = document.getElementById("poster");
    if (heroBg && posterImg && posterImg.src) {
        heroBg.style.backgroundImage = `linear-gradient(to bottom, rgba(11, 11, 18, 0.95), rgba(11, 11, 18, 0.75)), url('${posterImg.src}')`;
    }

    loadOtherRecommendations(movieId);
    initializeCalendarClickListeners();
    
  
    const defaultActiveCard = document.querySelector(".date-card.active");
    if (defaultActiveCard) {
        selectedDayLabel = defaultActiveCard.querySelector("strong").innerText.trim().toUpperCase();
    } else {
        selectedDayLabel = "TODAY"; 
    }
    
    renderDynamicTimeChips();
    setupTrailerTriggerAction();
});

function initializeCalendarClickListeners() {
    document.querySelectorAll(".date-card").forEach(card => {
        card.onclick = () => {
            document.querySelectorAll(".date-card").forEach(c => c.classList.remove("active"));
            card.classList.add("active");
            selectedDayLabel = card.querySelector("strong").innerText.trim().toUpperCase();
            renderDynamicTimeChips(); 
        };
    });
}
function renderDynamicTimeChips() {
    const timesContainer = document.getElementById("times-chips-wrapper");
    if (!timesContainer) return;
    
    timesContainer.innerHTML = ""; 
    
   
    const activeCard = document.querySelector(".date-card.active");
    if (!activeCard) return;

    let dayToMatch = activeCard.querySelector("strong").innerText.trim().toUpperCase(); 
    
    if (dayToMatch === "TODAY") {
        const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        const currentRealDayIndex = new Date().getDay(); 
        dayToMatch = daysOfWeek[currentRealDayIndex]; 
    }
    
    
    const expTagToMatch = selectedExperience === "STANDARD&DELUXE" ? "(Std)" : "(Prem)";
    const matchedShowtimes = dbShowtimes.filter(slot => {
        const upperSlot = slot.toUpperCase();
        return upperSlot.includes(`[${dayToMatch}]`) && upperSlot.includes(expTagToMatch.toUpperCase());
    });

    if (matchedShowtimes.length === 0) {
        timesContainer.innerHTML = '<p style="color:#6b6b80; font-size:13.5px; padding:10px 0;">No showtimes available for this selection.</p>';
        return;
    }
    matchedShowtimes.forEach(slot => {
        const matchRegex = /\](.*)\(/;
        const matches = slot.match(matchRegex);
        
        let cleanTime = "";
        if (matches && matches[1]) {
            cleanTime = matches[1].trim(); 
        } else {
            cleanTime = slot.replace(/\[.*?\]\s?/, '').replace(/\s?\(.*?\)/, '').trim();
        }
        const timeBtn = document.createElement("button");
        timeBtn.className = "time";
        timeBtn.innerText = cleanTime; 
        timeBtn.onclick = () => handleShowtimeSelection(timeBtn);
        timesContainer.appendChild(timeBtn);
    });
}

function selectExp(btn) {
    document.querySelectorAll(".exp-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedExperience = btn.innerText.trim();
    renderDynamicTimeChips(); 
}

function handleShowtimeSelection(btn) {
    document.querySelectorAll(".time").forEach(t => t.classList.remove("active"));
    btn.classList.add("active");
    
    const movieTitle = document.getElementById("title").innerText;
    const selectedTime = btn.innerText.trim();
    
    const activeDateCard = document.querySelector(".date-card.active");
    if (!activeDateCard) {
        alert("Please pick an active reservation date.");
        return;
    }
    
    const dayName = activeDateCard.querySelector("strong").innerText; 
    const dateText = activeDateCard.getAttribute("data-date"); 

    // Sync state securely back to localStorage to maintain your booking dashboard pipeline
    localStorage.setItem('selectedMovie', movieTitle);
    localStorage.setItem('selectedTime', selectedTime);
    localStorage.setItem('selectedDay', dayName);
    localStorage.setItem('selectedDateText', dateText);

       let typeParam = "standard";
    if (selectedExperience === "PREMIERE") {
        typeParam = "premiere";
    }
    const urlParams = new URLSearchParams(window.location.search);
const currentId = urlParams.get("id") || "";
    const targetUrl = `/condtions?type=${typeParam}`;
    if (typeof isUserLoggedIn !== 'undefined' && isUserLoggedIn) {
        window.location.href = targetUrl;
    } else {
        
        if (typeof handleProtectedRedirect === 'function') {
            handleProtectedRedirect(targetUrl);
        } else {
           
            openLogin();
        }
    }

}
async function loadOtherRecommendations(currentId) {
    const otherContainer = document.getElementById("otherMovies");
    if (!otherContainer) return;
    
    try {
        const res = await fetch('/movie/api/all'); 
        const allMovies = await res.json();
        otherContainer.innerHTML = "";

        const filterList = allMovies.filter(m => m._id !== currentId);

        if (filterList.length === 0) {
            otherContainer.innerHTML = `<p style="padding: 0 40px; color:#6b6b80;">No alternative matches found.</p>`;
            return;
        }

        filterList.forEach(m => {
            otherContainer.innerHTML += `
                <a href="/movie?id=${m._id}" class="movie-card">
                    <img src="${m.imageUrl}" alt="${m.title}" onerror="this.src='/images/homepage.jpg';">
                    <span class="age">${m.ageRating || "+0"}</span>
                </a>
            `;
        });
    } catch (err) {
        console.error("Error setting up recommendations rows:", err);
        otherContainer.innerHTML = `<p style="padding: 0 40px; color:#e74c3c;">Failed to populate recommended movies.</p>`;
    }
}

function setupTrailerTriggerAction() {
    const trailerBtn = document.getElementById("trailerBtn");
    if (!trailerBtn) return;

    trailerBtn.onclick = function () {
        const iframe = document.getElementById("videoPlayer");
        let link = activeMovieTrailerUrl || "";

        if (!link) {
            alert("No trailer link provided for this title.");
            return;
        }

        if (link.includes("embed")) {
            iframe.src = link + "?autoplay=1";
        } else if (link.includes("watch?v=")) {
            let vId = link.split("v=")[1].split("&")[0];
            iframe.src = `https://www.youtube.com/embed/${vId}?autoplay=1`;
        } else if (link.includes("youtu.be")) {
            let vId = link.split("youtu.be/")[1];
            iframe.src = `https://www.youtube.com/embed/${vId}?autoplay=1`;
        } else {
            iframe.src = `https://www.youtube.com/embed/${link}?autoplay=1`;
        }

        document.getElementById("videoModal").style.display = "block";
    };
}

const closeModalElement = document.querySelector(".close-btn");
if (closeModalElement) {
    closeModalElement.onclick = function () {
        document.getElementById("videoModal").style.display = "none";
        document.getElementById("videoPlayer").src = ""; 
    };
}

window.onclick = function(event) {
    const modal = document.getElementById("videoModal");
    if (event.target == modal) {
        modal.style.display = "none";
        document.getElementById("videoPlayer").src = "";
    }
};

