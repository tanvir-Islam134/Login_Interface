document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const cordMechanism = document.getElementById('cordMechanism');
  const cordThread = document.getElementById('cordThread');
  const cordRing = document.getElementById('cordRing');
  const dustCanvas = document.getElementById('dustCanvas');

  // Form Elements
  const btnSignIn = document.getElementById('btnSignIn');
  const btnSignUp = document.getElementById('btnSignUp');
  const cardTitle = document.getElementById('cardTitle');
  const cardSubtitle = document.getElementById('cardSubtitle');
  const userFieldLabel = document.getElementById('userFieldLabel');
  const inputUsername = document.getElementById('inputUsername');
  const inputPassword = document.getElementById('inputPassword');
  const submitCtaText = document.getElementById('submitCtaText');
  const forgotBtn = document.getElementById('forgotBtn');

  const lampForm = document.getElementById('lampForm');
  const userError = document.getElementById('userError');
  const passError = document.getElementById('passError');
  const eyeToggle = document.getElementById('eyeToggle');
  const eyeSvg = document.getElementById('eyeSvg');
  const toast = document.getElementById('sceneToast');

  let isLampOn = false;
  let isSignUpMode = true;

  // Synthesize realistic mechanical lamp pull switch click sound using Web Audio API
  const playSwitchSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {
      // AudioContext permitted on first interaction
    }
  };

  // Toggle Lamp State
  const toggleLamp = () => {
    isLampOn = !isLampOn;
    body.setAttribute('data-on', isLampOn ? 'true' : 'false');
    playSwitchSound();

    if (isLampOn) {
      showToast('💡 Lamp is ON! Login interface illuminated.');
    }
  };

  // -------------------------------------------------------------
  // Interactive Drag & Pull Physics for the Cord Mechanism
  // -------------------------------------------------------------
  let isDragging = false;
  let startY = 0;
  let currentPull = 0;
  const maxPull = 45;
  const triggerThreshold = 25;

  const onPointerDown = (e) => {
    isDragging = true;
    startY = e.clientY || (e.touches && e.touches[0].clientY);
    cordMechanism.classList.remove('rebounding');
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    const deltaY = clientY - startY;

    if (deltaY > 0) {
      currentPull = Math.min(deltaY, maxPull);
      cordMechanism.style.transform = `translateY(${currentPull}px)`;
      cordThread.style.height = `${65 + currentPull * 0.4}px`;
    }
  };

  const onPointerUp = () => {
    if (!isDragging) return;
    isDragging = false;

    // Trigger toggle if pulled down beyond threshold or clicked
    if (currentPull >= triggerThreshold || currentPull === 0) {
      toggleLamp();
    }

    // Elastic snap back animation
    cordMechanism.classList.add('rebounding');
    cordMechanism.style.transform = 'translateY(0px)';
    cordThread.style.height = '65px';
    currentPull = 0;
  };

  cordMechanism.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  // Touch Support for Mobile
  cordMechanism.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp);

  // Simple click fallback
  cordMechanism.addEventListener('click', (e) => {
    if (currentPull === 0) {
      // Click bounce animation
      cordMechanism.style.transform = 'translateY(28px)';
      cordThread.style.height = '80px';
      setTimeout(() => {
        cordMechanism.classList.add('rebounding');
        cordMechanism.style.transform = 'translateY(0px)';
        cordThread.style.height = '65px';
        toggleLamp();
      }, 150);
    }
  });

  // -------------------------------------------------------------
  // Form Mode Switcher: Sign In vs Sign Up
  // -------------------------------------------------------------
  btnSignIn.addEventListener('click', () => {
    if (!isSignUpMode) return;
    isSignUpMode = false;
    btnSignIn.classList.add('active');
    btnSignUp.classList.remove('active');

    cardTitle.textContent = 'Sign In';
    cardSubtitle.textContent = 'Welcome back! Please enter your details';
    userFieldLabel.textContent = 'Username or Email';
    inputUsername.placeholder = 'Enter username or email';
    submitCtaText.textContent = 'Sign In';
    forgotBtn.style.display = 'inline';
    clearErrors();
  });

  btnSignUp.addEventListener('click', () => {
    if (isSignUpMode) return;
    isSignUpMode = true;
    btnSignUp.classList.add('active');
    btnSignIn.classList.remove('active');

    cardTitle.textContent = 'Sign Up';
    cardSubtitle.textContent = 'Create an account to get started';
    userFieldLabel.textContent = 'Username or Email';
    inputUsername.placeholder = 'Enter username or email';
    submitCtaText.textContent = 'Create Account';
    forgotBtn.style.display = 'none';
    clearErrors();
  });

  // Password visibility toggle
  eyeToggle.addEventListener('click', () => {
    const isPass = inputPassword.type === 'password';
    inputPassword.type = isPass ? 'text' : 'password';

    eyeSvg.innerHTML = isPass
      ? `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
         <line x1="1" y1="1" x2="23" y2="23"/>`
      : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
         <circle cx="12" cy="12" r="3"/>`;
  });

  const clearErrors = () => {
    userError.textContent = '';
    passError.textContent = '';
  };

  inputUsername.addEventListener('input', () => { userError.textContent = ''; });
  inputPassword.addEventListener('input', () => { passError.textContent = ''; });

  const showToast = (msg, duration = 3000) => {
    toast.textContent = msg;
    toast.classList.add('active');
    setTimeout(() => {
      toast.classList.remove('active');
    }, duration);
  };

  // Form Submission
  lampForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!isLampOn) {
      showToast('⚠️ Pull the lamp string first to turn on the light!');
      return;
    }

    let isValid = true;
    clearErrors();

    const user = inputUsername.value.trim();
    if (!user) {
      userError.textContent = 'Username or email is required.';
      isValid = false;
    }

    const pass = inputPassword.value;
    if (!pass) {
      passError.textContent = 'Password is required.';
      isValid = false;
    } else if (pass.length < 6) {
      passError.textContent = 'Password must be at least 6 characters.';
      isValid = false;
    }

    if (!isValid) return;

    const action = isSignUpMode ? 'Account registered' : 'Logged in';
    showToast(`✨ Success! ${action} as ${user}`);
    lampForm.reset();
  });

  // -------------------------------------------------------------
  // Ambient Glowing Dot Particles (Firefly / Dust Effect)
  // -------------------------------------------------------------
  const ctx = dustCanvas.getContext('2d');
  let particles = [];
  const particleCount = 65;

  const resizeCanvas = () => {
    dustCanvas.width = window.innerWidth;
    dustCanvas.height = window.innerHeight;
  };

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class DustParticle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * dustCanvas.width;
      this.y = Math.random() * dustCanvas.height;
      this.radius = Math.random() * 1.5 + 0.6;
      this.speedX = (Math.random() - 0.3) * 0.4;
      this.speedY = -Math.random() * 0.35 - 0.1;
      this.baseOpacity = Math.random() * 0.45 + 0.2;
      this.opacity = this.baseOpacity;
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
      this.pulseAngle = Math.random() * Math.PI * 2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.pulseAngle += this.pulseSpeed;
      this.opacity = this.baseOpacity + Math.sin(this.pulseAngle) * 0.2;

      if (this.y < 0 || this.x < 0 || this.x > dustCanvas.width) {
        this.reset();
        this.y = dustCanvas.height;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56, 248, 212, ${Math.max(0.12, this.opacity)})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#38f8d4';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new DustParticle());
  }

  const animateDust = () => {
    ctx.clearRect(0, 0, dustCanvas.width, dustCanvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateDust);
  };

  animateDust();
});
