function openForgot() {
    const loginModal = document.getElementById("loginModal");
    if (loginModal) loginModal.classList.remove("active");

    const modal = document.getElementById("forgotModal");
    if (modal) {
        modal.classList.add("active");
        const emailEl = document.getElementById("forgotEmail");
        const errEl   = document.getElementById("forgotError");
        const sucEl   = document.getElementById("forgotSuccess");
        if (emailEl) emailEl.value = "";
        if (errEl)   errEl.innerText = "";
        if (sucEl)   sucEl.innerText = "";
    } else {
        window.location.href = "forget.html";
    }
}

function closeForgot() {
    const modal = document.getElementById("forgotModal");
    if (modal) modal.classList.remove("active");
}

// Close on outside click
window.addEventListener("click", function(e) {
    const modal = document.getElementById("forgotModal");
    if (modal && e.target === modal) closeForgot();
});

// ✅ Delegate submit — works even when form was hidden on load
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

        successEl.innerText = "✓ Reset link sent! Check your inbox.";
        document.getElementById("forgotEmail").value = "";
    }
});