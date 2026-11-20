document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('glassLoginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');
  const togglePasswordBtn = document.getElementById('togglePassword');
  const toast = document.getElementById('toast');
  const submitBtn = document.getElementById('submitBtn');

  // Toggle Password Visibility
  togglePasswordBtn.addEventListener('click', () => {
    const isPassword = passwordInput.getAttribute('type') === 'password';
    passwordInput.setAttribute('type', isPassword ? 'text' : 'password');

    // Update SVG icon
    togglePasswordBtn.innerHTML = isPassword
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
           <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
           <line x1="1" y1="1" x2="23" y2="23"/>
         </svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
           <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
           <circle cx="12" cy="12" r="3"/>
         </svg>`;
  });

  // Validation functions
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Real-time input clearing
  emailInput.addEventListener('input', () => {
    emailError.textContent = '';
  });

  passwordInput.addEventListener('input', () => {
    passwordError.textContent = '';
  });

  // Show Toast
  const showToast = (message, type = 'success') => {
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => {
      toast.className = 'toast';
    }, 3200);
  };

  // Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Reset errors
    emailError.textContent = '';
    passwordError.textContent = '';

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email) {
      emailError.textContent = 'Email is required';
      isValid = false;
    } else if (!validateEmail(email)) {
      emailError.textContent = 'Please enter a valid email address';
      isValid = false;
    }

    if (!password) {
      passwordError.textContent = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      passwordError.textContent = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!isValid) return;

    // Simulate Login Request
    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Signing In...</span>`;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnContent;
      showToast(`Welcome back, ${email.split('@')[0]}!`, 'success');
      form.reset();
    }, 1200);
  });
});
