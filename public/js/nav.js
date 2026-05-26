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

  premiere:     'PREMIERE',
  deluxe:       'DELUXE',
  standardCard: 'STANDARD',

 premiereTitle:       'PREMIERE',
  premiereDesc:        'Our Premiere halls are designed to create an unforgettable experience, where every detail is tailored to your comfort and enjoyment. Indulge in the ultimate cinematic luxury with our Premiere cinema halls. Our exclusive seating features chaise lounge chairs that recline, offering unmatched relaxation and sophistication. Sink into plush cushioning and enjoy the show in a way that elevates traditional movie-watching.',
  conditionsTitle:     'Conditions of Entry',
  condition1:          'Please note that children under the age of 12 are not permitted to attend Premiere Experience shows.',
  condition2:          'Please note that children under 3 years of age are not permitted at any screenings.',
  condition3:          'Outside food and beverages are not permitted inside cinema halls.',
  condition4:          'Valid ID showing proof of age is required for admission for certain movie classifications.',
  premiereReviews:     'Premiere Reviews',
  premiereReviewsDesc: 'Read what our guests say about their luxurious Premiere experience at CineX!',
  noReviews:           'No Premiere reviews yet. Be the first to share your experience on the',
  reviewsPage:         'Reviews page',

  deluxeDesc:              'Elevate your movie night with our luxurious seating. Premium leather recliners offer unmatched comfort with plush cushions and generous legroom. Enjoy a fully immersive cinematic experience in style.',
  standardDesc:            'Comfortable, modern seating designed for an immersive movie experience. Equipped with advanced projection and powerful surround sound for crystal-clear visuals and audio.',
  standardDeluxeReviews:   'Standard & Deluxe Reviews',

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

   premiere:     'بريميير',
  deluxe:       'ديلوكس',
  standardCard: 'ستاندرد',

  premiereTitle:       'بريميير',
  premiereDesc:        'صُممت قاعات البريميير لدينا لتقديم تجربة لا تُنسى، حيث كل تفصيلة مصممة لراحتك ومتعتك. استمتع بأقصى درجات الفخامة السينمائية في قاعات البريميير الحصرية. تتميز مقاعدنا بكراسي شيز لونج قابلة للإمالة، توفر استرخاءً وأناقة لا مثيل لهما.',
  conditionsTitle:     'شروط الدخول',
  condition1:          'يُرجى العلم بأنه لا يُسمح للأطفال دون سن 12 عامًا بحضور عروض تجربة البريميير.',
  condition2:          'يُرجى العلم بأنه لا يُسمح للأطفال دون سن 3 سنوات بحضور أي عروض.',
  condition3:          'لا يُسمح بإدخال الأطعمة والمشروبات من خارج القاعة.',
  condition4:          'يُشترط تقديم هوية سارية تُثبت العمر عند الدخول لبعض تصنيفات الأفلام.',

  premiereReviews:     'تقييمات البريميير',
  premiereReviewsDesc: 'اقرأ ما يقوله ضيوفنا عن تجربتهم الفاخرة في بريميير CineX!',
  noReviews:           'لا توجد تقييمات للبريميير بعد. كن أول من يشارك تجربته في',
  reviewsPage:         'صفحة التقييمات',

  deluxeDesc:              'ارتقِ بليلة السينما مع مقاعدنا الفاخرة. توفر الكراسي الجلدية المتكئة راحة لا مثيل لها مع وسائد ناعمة ومساحة واسعة للقدمين. استمتع بتجربة سينمائية غامرة بالكامل بأسلوب راقٍ.',
  standardDesc:            'مقاعد مريحة وعصرية مصممة لتجربة سينمائية غامرة. مجهزة بأحدث تقنيات العرض وصوت محيطي قوي لصور وصوت بوضوح كريستالي.',
  standardDeluxeReviews:   'تقييمات ستاندرد وديلوكس',
  }
};

