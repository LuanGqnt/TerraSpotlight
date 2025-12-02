let lastScroll = 0;
const nav = document.getElementById('top-nav');

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;

  if (currentScroll < 20) {
    // Always show near top
    nav.classList.remove('hidden');
    nav.classList.add('visible');
  } else if (currentScroll < lastScroll) {
    // Scrolling up
    nav.classList.remove('hidden');
    nav.classList.add('visible');
  } else {
    nav.classList.remove('visible');
    nav.classList.add('hidden');
  }

  lastScroll = currentScroll;
});

// Show nav when mouse is near top
window.addEventListener('mousemove', (e) => {
  if (e.clientY < 20) {
    nav.classList.add('visible');
  }
});
