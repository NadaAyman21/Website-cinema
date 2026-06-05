const resources = {
  en: {
    translation: {
     
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

      
      nowShowingTitle: "NOW SHOWING",
      bookNow: "Book Now",

      
      screenLabel: "SCREEN",
      confirmPay: "Confirm & Pay →",
      backToSeats: "← Back to Seats",
      legendStd: "Standard",
      legendDlx: "Deluxe",
      legendSel: "Selected",
      legendHold: "On Hold",
      legendTaken: "Taken",

     
      foodTitle: "FOOD & DRINKS",
      addToCart: "Add to Cart",

      
      alertOk: "OK",
    }
  },
  ar: {
    translation: {
      
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

      
      nowShowingTitle: "يعرض الآن",
      bookNow: "احجز الآن",

      
      foodTitle: "طعام ومشروبات",
      addToCart: "أضف للسلة",

      
      alertOk: "حسناً",
    }
  }
};
i18next.init({
  lng: localStorage.getItem('cinex-lang') || 'en',
  resources
}, () => applyTranslations());


function applyTranslations() {
  const lang = i18next.language;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key  = el.getAttribute('data-i18n');
    const icon = el.querySelector('i');        
    el.textContent = i18next.t(key);
    if (icon) el.appendChild(icon);
  });
document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;

  document.body.style.fontFamily = lang === 'ar'
    ? "'Cairo', sans-serif"
    : "'Outfit', sans-serif";

 
  document.getElementById('langEN')?.classList.toggle('active', lang === 'en');
  document.getElementById('langAR')?.classList.toggle('active', lang === 'ar');
}
function setLang(lang) {
  localStorage.setItem('cinex-lang', lang);
  i18next.changeLanguage(lang, () => applyTranslations());
}