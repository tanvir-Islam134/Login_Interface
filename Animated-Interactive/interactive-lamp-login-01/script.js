document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const pullCord = document.getElementById('pullCord');
  const pullTooltip = document.getElementById('pullTooltip');
  const dustCanvas = document.getElementById('dustCanvas');

  // Form Elements
  const tabSignIn = document.getElementById('tabSignIn');
  const tabSignUp = document.getElementById('tabSignUp');
  const headerTitle = document.getElementById('headerTitle');
  const headerSubtitle = document.getElementById('headerSubtitle');
  const nameFieldGroup = document.getElementById('nameFieldGroup');
  const emailLabel = document.getElementById('emailLabel');
  const btnText = document.getElementById('btnText');
  const forgotLink = document.getElementById('forgotLink');

  const authForm = document.getElementById('lampAuthForm');
  const authName = document.getElementById('authName');
  const authEmail = document.getElementById('authEmail');
  const authPassword = document.getElementById('authPassword');
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const eyeIcon = document.getElementById('eyeIcon');
  const toast = document.getElementById('lampToast');

  let isLightOn = false;
  let isSignUpMode = true;

  // Synthesize realistic mechanical switch "click" sound using Web Audio API
  const playClickSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } catch (e) {
      // AudioContext not permitted before gesture
    }
  };

  // Toggle Lamp On / Off with pull cord bounce animation
  const toggleLamp = () => {
    // Cord pull animation
    pullCord.classList.add('is-pulled');
    playClickSound();

    setTimeout(() => {
      pullCord.classList.remove('is-pulled');
      isLightOn = !isLightOn;
      body.setAttribute('data-on', isLightOn ? 'true' : 'false');
      
      if (isLightOn) {
        showToast('💡 Lamp turned ON! Welcome.', 2500);
      }
    }, 180);
  };

  pullCord.addEventListener('click', toggleLamp);

  // Tab switching: Sign In vs Sign Up
  tabSignIn.addEventListener('click', () => {
    if (!isSignUpMode) return;
    isSignUpMode = false;
    tabSignIn.classList.add('active');
    tabSignUp.classList.remove('active');

    headerTitle.textContent = 'Sign In';
    headerSubtitle.textContent = 'Welcome back! Enter your credentials';
    nameFieldGroup.style.display = 'none';
    emailLabel.textContent = 'Username or Email';
    btnText.textContent = 'Sign In';
    forgotLink.style.display = 'inline';
    clearErrors();
  });

  tabSignUp.addEventListener('click', () => {
    if (isSignUpMode) return;
    isSignUpMode = true;
    tabSignUp.classList.add('active');
    tabSignIn.classList.remove('active');

    headerTitle.textContent = 'Sign Up';
    headerSubtitle.textContent = 'Create an account to get started';
    nameFieldGroup.style.display = 'flex';
    emailLabel.textContent = 'Email Address';
    btnText.textContent = 'Create Account';
    forgotLink.style.display = 'none';
    clearErrors();
  });

  // Password visibility toggle
  togglePasswordBtn.addEventListener('click', () => {
    const isPass = authPassword.type === 'password';
    authPassword.type = isPass ? 'text' : 'password';

    eyeIcon.innerHTML = isPass
      ? `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
         <line x1="1" y1="1" x2="23" y2="23"/>`
      : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
         <circle cx="12" cy="12" r="3"/>`;
  });

  const clearErrors = () => {
    nameError.textContent = '';
    emailError.textContent = '';
    passwordError.textContent = '';
  };

  authName.addEventListener('input', () => { nameError.textContent = ''; });
  authEmail.addEventListener('input', () => { emailError.textContent = ''; });
  authPassword.addEventListener('input', () => { passwordError.textContent = ''; });

  const showToast = (msg, duration = 3000) => {
    toast.textContent = msg;
    toast.classList.add('active');
    setTimeout(() => {
      toast.classList.remove('active');
    }, duration);
  };

  // Form submit handler
  authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!isLightOn) {
      showToast('⚠️ Please pull the lamp string first to turn on light!');
      return;
    }

    let valid = true;
    clearErrors();

    if (isSignUpMode && !authName.value.trim()) {
      nameError.textContent = 'Username is required.';
      valid = false;
    }

    const email = authEmail.value.trim();
    if (!email) {
      emailError.textContent = 'Email or username is required.';
      valid = false;
    }

    const pass = authPassword.value;
    if (!pass) {
      passwordError.textContent = 'Password is required.';
      valid = false;
    } else if (pass.length < 6) {
      passwordError.textContent = 'Password must be at least 6 characters.';
      valid = false;
    }

    if (!valid) return;

    const action = isSignUpMode ? 'Registered account' : 'Signed in';
    showToast(`✨ Success! ${action} for ${email}`);
    authForm.reset();
  });

  // Setup Ambient Dust Particle Canvas
  const ctx = dustCanvas.getContext('2d');
  let particles = [];
  const particleCount = 45;

  const resizeCanvas = () => {
    dustCanvas.width = window.innerWidth;
    dustCanvas.height = window.innerHeight;
  };

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * dustCanvas.width;
      this.y = Math.random() * dustCanvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = -Math.random() * 0.5 - 0.1;
      this.opacity = Math.random() * 0.6 + 0.2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.y < 0 || this.x < 0 || this.x > dustCanvas.width) {
        this.reset();
        this.y = dustCanvas.height;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(45, 212, 191, ${this.opacity})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#2dd4bf';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  const animateDust = () => {
    ctx.clearRect(0, 0, dustCanvas.width, dustCanvas.height);
    if (isLightOn) {
      particles.forEach(p => {
        p.update();
        p.draw();
      });
    }
    requestAnimationFrame(animateDust);
  };

  animateDust();
});
