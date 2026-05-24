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
window.addEventListener("click", function(event) {
    if (event.target.className.includes('modal') && event.target.className.includes('active')) {
        closeAllModals();
    }
});

// Toggle for mobile menu (if you have one)
function toggleMenu() {
    document.getElementById("navLinks").classList.toggle("active");
}
// Custom Alert Close
function closeAlert() {
    document.getElementById('customAlert').style.display = 'none';
}

// ===== PROFILE DROPDOWN =====
function toggleProfile() {
    const menu = document.getElementById("profileMenu");
    menu.classList.toggle("active");
}

// Close when clicking outside
window.addEventListener("click", function(e) {
    const dropdown = document.querySelector(".profile-dropdown");
    if (dropdown && !dropdown.contains(e.target)) {
        const menu = document.getElementById("profileMenu");
        if (menu) menu.classList.remove("active");
    }
});


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
  });document.getElementById('langEN').classList.toggle('active', lang === 'en');
  document.getElementById('langAR').classList.toggle('active', lang === 'ar');

  // RTL / LTR direction
  document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;

  // Optional: flip font for Arabic
  document.body.style.fontFamily = lang === 'ar'
    ? "'Cairo', 'Segoe UI', sans-serif"
    : "'Outfit', sans-serif";

  // Save preference
  localStorage.setItem('cinex-lang', lang);
}
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('cinex-lang') || 'en';
  setLang(saved);
});
const translations = {
  en: {
    // NAV
    home:         'HOME',
    movies:       'MOVIES',
    nowShowing:   'Now Showing',
    experiences:  'EXPERIENCES',
    premiere:     'Premiere',
    standard:     'Standard/Deluxe',
    food:         'FOOD & DRINKS',
    locations:    'LOCATIONS',
    cairo:        'Cairo',
    locationName: 'Cairo Festival City',
    login:        'Login',
    signup:       'Sign Up',

    // HOME PAGE
    nowShowingTitle: 'NOW SHOWING',
    bookNow:         'Book Now',
    viewAll:         'View All',
    genre:           'Sport/Action',

    // SEAT PAGE
    selectedLabel:   'Selected:',
    maxLabel:        'Max:',
    seats:           'seats',
    screenLabel:     'SCREEN',
    legendStd:       'Standard',
    legendDlx:       'Deluxe',
    legendSel:       'Selected',
    legendHold:      'On Hold',
    legendTaken:     'Taken',
    confirmPay:      'Confirm & Pay →',
    seatsSelected:   'seats selected',
    deluxeExp:       'Deluxe Experience',
    view3d:          '3D View',
    backToSeats:     '← Back to Seats',
    mouseHint:       'Move mouse to look around',

    // FOOD PAGE
    foodTitle:       'FOOD & DRINKS',
    addToCart:       'Add to Cart',

    // GENERAL
    alertOk:         'OK',
    cinexSays:       'CineX says',
    bookingConfirmed:'Booking Confirmed!',

    footerBrand:      'CineX',
  footerDesc:       'Your gateway to the latest movies. Book tickets easily and enjoy cinema like never before.',
  footerQuickLinks: 'Quick Links',
  reserveSeat:      'Reserve Seat',
  login:            'Login',
  footerContact:    'Contact Us',
  footerEmail:      'Email: CineX@email.com',
  footerPhone:      'Phone: +20 123 456 7890',
  footerLocation:   'Location: Cairo, Egypt',
  footerFollow:     'Follow Us',
  facebook:         'Facebook',
  instagram:        'Instagram',
  twitter:          'Twitter',
  footerRights:     '© 2026 CineX | All Rights Reserved',
  },
  ar: {
    // NAV
    home:         'الرئيسية',
    movies:       'الأفلام',
    nowShowing:   'يعرض الآن',
    experiences:  'التجارب',
    premiere:     'بريميير',
    standard:     'ستاندرد / ديلوكس',
    food:         'طعام ومشروبات',
    locations:    'الفروع',
    cairo:        'القاهرة',
    locationName: 'القاهرة فستيفال سيتي',
    login:        'تسجيل الدخول',
    signup:       'إنشاء حساب',

    // HOME PAGE
    nowShowingTitle: 'يعرض الآن',
    bookNow:         'احجز الآن',
    viewAll:         'عرض الكل',
    genre:           'رياضة / أكشن',

    // FOOD PAGE
    foodTitle:       'طعام ومشروبات',
    addToCart:       'أضف للسلة',

    // GENERAL
    alertOk:         'حسناً',
    cinexSays:       'CineX يقول',
    bookingConfirmed:'تم تأكيد الحجز!',

    footerBrand:      'سين اكس',
  footerDesc:       'بوابتك لأحدث الأفلام. احجز تذاكرك بسهولة واستمتع بالسينما كما لم تفعل من قبل.',
  footerQuickLinks: 'روابط سريعة',
  reserveSeat:      'احجز مقعدك',
  login:            'تسجيل الدخول',
  footerContact:    'تواصل معنا',
  footerEmail:      'البريد: CineX@email.com',
  footerPhone:      'الهاتف: 7890 456 123 20+',
  footerLocation:   'الموقع: القاهرة، مصر',
  footerFollow:     'تابعنا',
  facebook:         'فيسبوك',
  instagram:        'انستغرام',
  twitter:          'تويتر',
  footerRights:     '© 2026 سين اكس | جميع الحقوق محفوظة',
  }
};

