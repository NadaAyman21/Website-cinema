document.addEventListener("submit", function(e) {
  if (e.target && e.target.id === "forgotForm") {
    e.preventDefault();

    const email     = document.getElementById("forgotEmail").value.trim();
    const errorEl   = document.getElementById("forgotError");
    const successEl = document.getElementById("forgotSuccess");

    errorEl.innerText   = "";
    successEl.innerText = "";

    const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!email.match(pattern)) {
      errorEl.innerText = "Please enter a valid email address.";
      return;
    }

    fetch('/api/auth/forgotPassword', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        successEl.innerText = "✓ Reset link sent! Check your inbox.";
        document.getElementById("forgotEmail").value = "";
      } else {
        errorEl.innerText = data.message;
      }
    })
    .catch(() => {
      errorEl.innerText = "Something went wrong. Please try again.";
    });
  }
});