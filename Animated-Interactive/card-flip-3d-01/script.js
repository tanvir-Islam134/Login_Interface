document.addEventListener('DOMContentLoaded', () => {
  const cardInner = document.getElementById('cardInner');
  const flipToRegister = document.getElementById('flipToRegister');
  const flipToLogin = document.getElementById('flipToLogin');
  const signInForm = document.getElementById('signInForm');
  const registerForm = document.getElementById('registerForm');
  const toast = document.getElementById('flipToast');

  // Trigger 3D Card Flip
  flipToRegister.addEventListener('click', () => {
    cardInner.classList.add('flipped');
  });

  flipToLogin.addEventListener('click', () => {
    cardInner.classList.remove('flipped');
  });

  const notify = (text) => {
    toast.textContent = text;
    toast.classList.add('visible');
    setTimeout(() => {
      toast.classList.remove('visible');
    }, 3000);
  };

  // Sign in handling
  signInForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const pass = document.getElementById('loginPassword').value;

    if (!email || !pass) {
      notify('Please enter both email and password.');
      return;
    }

    notify(`Authentication verified for ${email}`);
    signInForm.reset();
  });

  // Registration handling
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass = document.getElementById('regPassword').value;

    if (!name || !email || !pass) {
      notify('Please complete all registration fields.');
      return;
    }

    notify(`Profile created for ${name}! Flipping to login...`);
    registerForm.reset();
    setTimeout(() => {
      cardInner.classList.remove('flipped');
    }, 1200);
  });
});
