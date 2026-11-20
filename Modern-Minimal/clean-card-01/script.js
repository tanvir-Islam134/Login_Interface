document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('minimalLoginForm');
  const emailInput = document.getElementById('minEmail');
  const passwordInput = document.getElementById('minPassword');
  const emailError = document.getElementById('minEmailError');
  const passError = document.getElementById('minPassError');
  const toggleBtn = document.getElementById('minTogglePass');
  const eyeSvg = document.getElementById('minEyeSvg');
  const submitBtn = document.getElementById('minSubmitBtn');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnSpinner = submitBtn.querySelector('.btn-spinner');
  const toast = document.getElementById('minToast');

  // Password Visibility Toggle
  toggleBtn.addEventListener('click', () => {
    const isPass = passwordInput.getAttribute('type') === 'password';
    passwordInput.setAttribute('type', isPass ? 'text' : 'password');

    eyeSvg.innerHTML = isPass
      ? `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
         <line x1="1" y1="1" x2="23" y2="23"/>`
      : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
         <circle cx="12" cy="12" r="3"/>`;
  });

  // Clear errors on typing
  emailInput.addEventListener('input', () => { emailError.textContent = ''; });
  passwordInput.addEventListener('input', () => { passError.textContent = ''; });

  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add('active');
    setTimeout(() => {
      toast.classList.remove('active');
    }, 3000);
  };

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    emailError.textContent = '';
    passError.textContent = '';

    const email = emailInput.value.trim();
    const pass = passwordInput.value;

    if (!email) {
      emailError.textContent = 'Email is required.';
      valid = false;
    } else if (!validateEmail(email)) {
      emailError.textContent = 'Please enter a valid email address.';
      valid = false;
    }

    if (!pass) {
      passError.textContent = 'Password is required.';
      valid = false;
    } else if (pass.length < 6) {
      passError.textContent = 'Password must be at least 6 characters.';
      valid = false;
    }

    if (!valid) return;

    // Show loading state
    submitBtn.disabled = true;
    btnText.textContent = 'Verifying...';
    btnSpinner.style.display = 'inline-block';

    setTimeout(() => {
      submitBtn.disabled = false;
      btnText.textContent = 'Sign In';
      btnSpinner.style.display = 'none';
      showToast(`Logged in successfully as ${email}`);
      form.reset();
    }, 1100);
  });
});
