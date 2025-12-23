const root = document.documentElement;
const modeToggle = document.getElementById('modeToggle');
const modeIcon = document.getElementById('modeIcon');
const modeLabel = document.getElementById('modeLabel');
const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

const THEME_KEY = 'daacad-theme';
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

const setTheme = (mode) => {
  if (mode === 'dark') {
    root.classList.add('dark');
    if (modeIcon) modeIcon.innerHTML = '&#9790;';
    if (modeLabel) modeLabel.textContent = 'Dark';
  } else {
    root.classList.remove('dark');
    if (modeIcon) modeIcon.innerHTML = '&#9728;';
    if (modeLabel) modeLabel.textContent = 'Light';
  }
  localStorage.setItem(THEME_KEY, mode);
};

const initTheme = () => {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored) {
    setTheme(stored);
    return;
  }
  setTheme(prefersDark.matches ? 'dark' : 'light');
};

modeToggle?.addEventListener('click', () => {
  const isDark = root.classList.contains('dark');
  setTheme(isDark ? 'light' : 'dark');
});

prefersDark.addEventListener('change', (event) => {
  const stored = localStorage.getItem(THEME_KEY);
  if (!stored) {
    setTheme(event.matches ? 'dark' : 'light');
  }
});

mobileToggle?.addEventListener('click', () => {
  mobileMenu?.classList.toggle('hidden');
});

mobileLinks.forEach((link) => {
  link.addEventListener('click', () => mobileMenu?.classList.add('hidden'));
});

const animateTargets = document.querySelectorAll('[data-animate]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

animateTargets.forEach((target) => observer.observe(target));

const yearTarget = document.getElementById('year');
if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

const contactForm = document.getElementById('contactForm');
const contactStatus = document.getElementById('contactStatus');

const updateStatus = (message, isError = false) => {
  if (!contactStatus) return;
  contactStatus.textContent = message;
  contactStatus.classList.toggle('error', isError);
};

contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!contactForm) return;
  const submitButton = contactForm.querySelector('button[type="submit"]');
  submitButton?.setAttribute('disabled', 'true');
  updateStatus('Sending your message...');

  const formData = new FormData(contactForm);

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    updateStatus('Thank you! Your message is on its way to my inbox.');
    contactForm.reset();
  } catch (error) {
    updateStatus('Something went wrong. Email me directly at daacaddeveloper@gmail.com.', true);
  } finally {
    submitButton?.removeAttribute('disabled');
  }
});

// Make project cards clickable - navigate to live demo on click
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach((card) => {
  // Find the "Live Demo" link within this card
  const liveDemoLink = card.querySelector('a[href*="https://"]');

  if (liveDemoLink) {
    // Make the card clickable
    card.style.cursor = 'pointer';

    card.addEventListener('click', (event) => {
      // Don't trigger if user clicked directly on a link or button
      if (event.target.tagName === 'A' || event.target.closest('a')) {
        return;
      }

      // Navigate to the live demo URL
      window.open(liveDemoLink.href, '_blank', 'noopener,noreferrer');
    });
  }
});

initTheme();

