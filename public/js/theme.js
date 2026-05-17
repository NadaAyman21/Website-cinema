// public/js/theme.js
(function () {
  // Apply saved theme IMMEDIATELY before page paints (prevents flash)
  var saved = localStorage.getItem('cinema-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;

    // Set correct icon on load
    updateIcon(saved);

    btn.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('cinema-theme', next);
      updateIcon(next);
    });
  });

  function updateIcon(theme) {
    var sun  = document.getElementById('icon-sun');
    var moon = document.getElementById('icon-moon');
    if (!sun || !moon) return;
    sun.style.display  = theme === 'dark'  ? 'inline' : 'none';
    moon.style.display = theme === 'light' ? 'inline' : 'none';
  }
})();