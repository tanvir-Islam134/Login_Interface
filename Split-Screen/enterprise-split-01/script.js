document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('enterpriseLoginForm');
  const emailInput = document.getElementById('workEmail');
  const passInput = document.getElementById('workPassword');
  const emailError = document.getElementById('emailError');
  const passError = document.getElementById('passError');
  const eyeToggle = document.getElementById('eyeToggle');
  const eyeSvg = document.getElementById('eyeSvg');
  const submitBtn = document.getElementById('submitBtn');
  const btnLabel = submitBtn.querySelector('.btn-label');
  const btnSpinner = submitBtn.querySelector('.btn-spinner');
  const btnIcon = submitBtn.querySelector('.btn-icon');
  const magicLinkBtn = document.getElementById('magicLinkBtn');
  const toast = document.getElementById('toast');

  // Password visibility switcher
  eyeToggle.addEventListener('click', () => {
    const isPass = passInput.getAttribute('type') === 'password';
    passInput.setAttribute('type', isPass ? 'text' : 'password');

    eyeSvg.innerHTML = isPass
      ? `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
         <line x1="1" y1="1" x2="23" y2="23"/>`
      : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
         <circle cx="12" cy="12" r="3"/>`;
  });

  const clearErrors = () => {
    emailError.textContent = '';
    passError.textContent = '';
  };

  emailInput.addEventListener('input', () => { emailError.textContent = ''; });
  passInput.addEventListener('input', () => { passError.textContent = ''; });

  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Form submission handling
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const email = emailInput.value.trim();
    const pass = passInput.value;
    let isValid = true;

    if (!email) {
      emailError.textContent = 'Please enter your corporate email.';
      isValid = false;
    } else if (!validateEmail(email)) {
      emailError.textContent = 'Please enter a valid work email address.';
      isValid = false;
    }

    if (!pass) {
      passError.textContent = 'Password is required.';
      isValid = false;
    } else if (pass.length < 8) {
      passError.textContent = 'Password must be at least 8 characters.';
      isValid = false;
    }

    if (!isValid) return;

    // Simulate enterprise authentication
    submitBtn.disabled = true;
    btnLabel.textContent = 'Authenticating Workspace...';
    btnSpinner.style.display = 'inline-block';
    btnIcon.style.display = 'none';

    setTimeout(() => {
      submitBtn.disabled = false;
      btnLabel.textContent = 'Sign In to Dashboard';
      btnSpinner.style.display = 'none';
      btnIcon.style.display = 'inline';
      showToast(`Welcome back! Authenticated as ${email}`);
      form.reset();
    }, 1200);
  });

  // Magic link simulation
  magicLinkBtn.addEventListener('click', () => {
    const email = emailInput.value.trim();
    if (!email || !validateEmail(email)) {
      emailError.textContent = 'Enter your email above to receive a magic sign-in link.';
      emailInput.focus();
      return;
    }

    showToast(`Magic sign-in link dispatched to ${email}`);
  });
});
