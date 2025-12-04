let lastScroll = 0;
let lastMouseY = window.innerHeight;
let hideTimeout = null;
let hideTimeoutHazard = null;

const nav = document.getElementById('top-nav');
const hazard = document.getElementById('hazardID');

function showHazards() {
  hazard.classList.remove('hidden');
  hazard.classList.add('visible');

  // Reset hide timer
  if (hideTimeoutHazard) clearTimeout(hideTimeoutHazard);

  hideTimeoutHazard = setTimeout(() => {
    hazard.classList.remove('visible');
    hazard.classList.add('hidden');
  }, 10000);
}

function showNav() {
  nav.classList.remove('hidden');
  nav.classList.add('visible');

  // Reset hide timer
  if (hideTimeout) clearTimeout(hideTimeout);

  hideTimeout = setTimeout(() => {
    nav.classList.remove('visible');
    nav.classList.add('hidden');
  }, 10000);
}

// Scroll logic
window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;

  if (currentScroll < 30) {
    showNav();
  } else if (currentScroll < lastScroll) {
    showNav();
  } else {
    nav.classList.remove('visible');
    nav.classList.add('hidden');
  }

  lastScroll = currentScroll;
});

// Mouse approaching the top
window.addEventListener('mousemove', (e) => {
  const triggerZone = 105;
  const movingUpward = e.clientY < lastMouseY;
  const insideTriggerZone = e.clientY < triggerZone;

  if (movingUpward && insideTriggerZone) {
    showNav();
  }

  lastMouseY = e.clientY;
});