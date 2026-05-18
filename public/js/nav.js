/*function toggleMenu() {
    let nav = document.getElementById("navLinks");
    nav.classList.toggle("active");
}

function goToLogin(){
    window.location.href = "login.html";
}*/
// Open/Close logic for Pop-ups
function openLogin() {
    closeAllModals();
    document.getElementById('loginModal').classList.add('active');
}

function openSignup() {
    closeAllModals();
    document.getElementById('signupModal').classList.add('active');
}

function openForgot() {
    closeAllModals();
    document.getElementById('forgotModal').classList.add('active');
}

function closeLogin() { document.getElementById('loginModal').classList.remove('active'); }
function closeSignup() { document.getElementById('signupModal').classList.remove('active'); }
function closeForgot() { document.getElementById('forgotModal').classList.remove('active'); }

function closeAllModals() {
    document.getElementById('loginModal').classList.remove('active');
    document.getElementById('signupModal').classList.remove('active');
    document.getElementById('forgotModal').classList.remove('active');
}

// Close when clicking the dark background
window.onclick = function(event) {
    if (event.target.className.includes('modal') && event.target.className.includes('active')) {
        closeAllModals();
    }
};

// Toggle for mobile menu (if you have one)
function toggleMenu() {
    document.getElementById("navLinks").classList.toggle("active");
}
// Custom Alert Close
function closeAlert() {
    document.getElementById('customAlert').style.display = 'none';
}

// ── Language Switcher ──
let currentLang = 'en';

function setLang(lang) {
  currentLang = lang;
  const t = translations[lang];

  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) {
      // Preserve any <i> icons inside the element (dropdown arrows)
      const icon = el.querySelector('i');
      el.textContent = t[key];
      if (icon) el.appendChild(icon);
    }
  });

