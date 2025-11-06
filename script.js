// Reveal on scroll
const revealEls = Array.from(document.querySelectorAll('.reveal'));
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal-visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

revealEls.forEach((el) => io.observe(el));

// Tilt hover cards
const tiltCards = Array.from(document.querySelectorAll('.tilt'));
tiltCards.forEach((card) => {
  const rectCache = { w: 0, h: 0 };
  const updateRect = () => {
    const r = card.getBoundingClientRect();
    rectCache.w = r.width; rectCache.h = r.height;
  };
  updateRect();
  window.addEventListener('resize', updateRect);

  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const rx = ((y - rectCache.h / 2) / rectCache.h) * -6;
    const ry = ((x - rectCache.w / 2) / rectCache.w) * 6;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// Active nav link on scroll
const sections = Array.from(document.querySelectorAll('main section[id]'));
const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));
const setActive = (id) => {
  navLinks.forEach((a) => {
    if (a.getAttribute('href') === `#${id}`) {
      a.classList.add('text-amber-400');
    } else {
      a.classList.remove('text-amber-400');
    }
  });
};
let activeId = '';
const spy = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      activeId = entry.target.id;
      setActive(activeId);
    }
  });
}, { threshold: 0.4 });
sections.forEach((s) => spy.observe(s));

// Smooth scroll tweak for browsers lacking CSS behavior (fallback)
navLinks.forEach((a) => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Theme: respect system, persist, and toggle
(function initTheme() {
  const root = document.documentElement;
  const stored = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const setDark = (isDark) => {
    root.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    const btn = document.getElementById('themeToggle');
    if (btn) btn.setAttribute('aria-pressed', String(isDark));
  };
  setDark(stored ? stored === 'dark' : systemPrefersDark);

  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.addEventListener('click', () => setDark(!document.documentElement.classList.contains('dark')));
  }

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      const saved = localStorage.getItem('theme');
      if (!saved) setDark(e.matches);
    });
  }
})();


