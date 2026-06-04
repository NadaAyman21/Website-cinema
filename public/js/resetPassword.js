async function submitReset() {
  const newPassword     = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const errorEl         = document.getElementById('errorMsg');
  const successEl       = document.getElementById('successMsg');

  errorEl.style.display   = 'none';
  successEl.style.display = 'none';

  if (!newPassword || !confirmPassword) {
    errorEl.innerText     = 'Please fill in both fields.';
    errorEl.style.display = 'block';
    return;
  }

  if (newPassword !== confirmPassword) {
    errorEl.innerText     = 'Passwords do not match.';
    errorEl.style.display = 'block';
    return;
  }

  try {
    const res  = await fetch('/api/auth/resetPassword', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ token, newPassword })
    });

    const data = await res.json();

    if (data.success) {
      successEl.innerText     = data.message + ' Redirecting to login...';
      successEl.style.display = 'block';
      setTimeout(() => window.location.href = '/cinemaM', 2500);
    } else {
      errorEl.innerText     = data.message;
      errorEl.style.display = 'block';
    }
  } catch (err) {
    errorEl.innerText     = 'Something went wrong. Please try again.';
    errorEl.style.display = 'block';
  }
}

function togglePassword(inputId, eyeIcon) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type    = 'text';
    eyeIcon.style.color = '#c9a84c';
  } else {
    input.type    = 'password';
    eyeIcon.style.color = 'rgba(255,255,255,0.4)';
  }
}