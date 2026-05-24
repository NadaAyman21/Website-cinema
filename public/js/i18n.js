const resources = {
  en: {
    translation: {
      // NAV
      home: "HOME",
      movies: "MOVIES",
      nowShowing: "Now Showing",
      experiences: "EXPERIENCES",
      premiere: "Premiere",
      standard: "Standard/Deluxe",
      food: "FOOD & DRINKS",
      locations: "LOCATIONS",
      cairo: "Cairo",
      locationName: "Cairo Festival City",

      // HOME
      nowShowingTitle: "NOW SHOWING",
      bookNow: "Book Now",

      // SEATS
      screenLabel: "SCREEN",
      confirmPay: "Confirm & Pay →",
      backToSeats: "← Back to Seats",
      legendStd: "Standard",
      legendDlx: "Deluxe",
      legendSel: "Selected",
      legendHold: "On Hold",
      legendTaken: "Taken",

      // FOOD
      foodTitle: "FOOD & DRINKS",
      addToCart: "Add to Cart",

      // GENERAL
      alertOk: "OK",
    }
  },
  ar: {
    translation: {
      // NAV
      home: "الرئيسية",
      movies: "الأفلام",
      nowShowing: "يعرض الآن",
      experiences: "التجارب",
      premiere: "بريميير",
      standard: "ستاندرد / ديلوكس",
      food: "طعام ومشروبات",
      locations: "الفروع",
      cairo: "القاهرة",
      locationName: "القاهرة فستيفال سيتي",

      // HOME
      nowShowingTitle: "يعرض الآن",
      bookNow: "احجز الآن",

      // FOOD
      foodTitle: "طعام ومشروبات",
      addToCart: "أضف للسلة",

      // GENERAL
      alertOk: "حسناً",
    }
  }
};
i18next.init({
  lng: localStorage.getItem('cinex-lang') || 'en',
  resources
}, () => applyTranslations());

// Apply to all elements on the page
function applyTranslations() {
  const lang = i18next.language;

  // Translate every element that has data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key  = el.getAttribute('data-i18n');
    const icon = el.querySelector('i');        // keep dropdown arrows
    el.textContent = i18next.t(key);
    if (icon) el.appendChild(icon);
  });
document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;

  // Font
  document.body.style.fontFamily = lang === 'ar'
    ? "'Cairo', sans-serif"
    : "'Outfit', sans-serif";

  // Active button
  document.getElementById('langEN')?.classList.toggle('active', lang === 'en');
  document.getElementById('langAR')?.classList.toggle('active', lang === 'ar');
}
function setLang(lang) {
  localStorage.setItem('cinex-lang', lang);
  i18next.changeLanguage(lang, () => applyTranslations());
}