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