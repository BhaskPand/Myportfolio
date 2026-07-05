/* Portfolio interactions — no dependencies. */

// ---------- Theme (dark-first, persisted, respects system) ----------
(function initTheme() {
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');

  const apply = (theme) => {
    if (theme === 'light') root.setAttribute('data-theme', 'light');
    else root.removeAttribute('data-theme');
    if (btn) btn.setAttribute('aria-pressed', String(theme === 'light'));
  };

  const stored = localStorage.getItem('theme');
  const systemLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  apply(stored || (systemLight ? 'light' : 'dark'));

  if (btn) {
    btn.addEventListener('click', () => {
      const next = root.hasAttribute('data-theme') ? 'dark' : 'light';
      apply(next);
      localStorage.setItem('theme', next);
    });
  }

  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) apply(e.matches ? 'light' : 'dark');
  });
})();

// ---------- Sticky nav background ----------
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 20);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// ---------- Mobile menu ----------
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
  const setOpen = (open) => {
    navLinks.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  menuToggle.addEventListener('click', () =>
    setOpen(!navLinks.classList.contains('is-open'))
  );
  navLinks.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => setOpen(false))
  );
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
}

// ---------- Typewriter (hero roles) ----------
(function typewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const roles = [
    'Agentic AI Systems',
    'RAG Pipelines',
    'LLM Applications',
    'Computer Vision',
    'Full-Stack Engineering',
  ];
  if (reduced) {
    el.textContent = 'AI Engineer · Full-Stack Developer';
    return;
  }

  let roleIdx = 0;
  let charIdx = 0;
  let deleting = false;

  const tick = () => {
    const word = roles[roleIdx];
    charIdx += deleting ? -1 : 1;
    el.textContent = word.slice(0, charIdx);

    let delay = deleting ? 40 : 75;
    if (!deleting && charIdx === word.length) {
      delay = 2000;
      deleting = true;
    } else if (deleting && charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      delay = 400;
    }
    setTimeout(tick, delay);
  };
  tick();
})();

// ---------- Reveal on scroll (staggered among siblings) ----------
(function revealOnScroll() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('reveal-visible'));
    return;
  }
  // Stagger elements that share a parent so groups animate as choreography.
  const groups = new Map();
  els.forEach((el) => {
    const parent = el.parentElement;
    const idx = groups.get(parent) || 0;
    el.style.setProperty('--reveal-delay', `${Math.min(idx * 0.09, 0.45)}s`);
    groups.set(parent, idx + 1);
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );
  els.forEach((el) => io.observe(el));
})();

// ---------- Scrollspy (active nav link) ----------
(function scrollSpy() {
  const sections = document.querySelectorAll('main section[id]');
  const links = document.querySelectorAll('.nav__link[href^="#"]');
  if (!sections.length || !links.length) return;

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) =>
          a.classList.toggle('is-active', a.getAttribute('href') === `#${entry.target.id}`)
        );
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );
  sections.forEach((s) => spy.observe(s));
})();

// ---------- Shared motion gates ----------
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// ---------- Scroll progress bar ----------
(function scrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
})();

// ---------- Text scramble: "entropy" resolves out of noise ----------
(function scramble() {
  const el = document.getElementById('scrambleWord');
  if (!el || prefersReducedMotion) return;

  const word = el.dataset.word || el.textContent;
  const glyphs = '!<>-_\/[]{}—=+*^?#·∆';
  let frame = 0;
  let raf = null;

  const run = () => {
    cancelAnimationFrame(raf);
    frame = 0;
    const total = word.length * 6;
    const step = () => {
      frame++;
      const settled = Math.floor((frame / total) * word.length);
      el.textContent = word
        .split('')
        .map((ch, i) =>
          i < settled ? ch : glyphs[Math.floor(Math.random() * glyphs.length)]
        )
        .join('');
      if (settled < word.length) raf = requestAnimationFrame(step);
      else el.textContent = word;
    };
    raf = requestAnimationFrame(step);
  };

  // Resolve once on load, and re-scramble on hover — chaos, briefly.
  setTimeout(run, 600);
  if (finePointer) el.addEventListener('mouseenter', run);
})();

// ---------- Cursor spotlight on cards ----------
(function cardSpotlight() {
  if (!finePointer) return;
  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
})();

// ---------- Magnetic buttons ----------
(function magnetic() {
  if (!finePointer || prefersReducedMotion) return;
  document.querySelectorAll('.btn--magnetic').forEach((btn) => {
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.18;
      const y = (e.clientY - r.top - r.height / 2) * 0.28;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('pointerleave', () => {
      btn.style.transform = '';
    });
  });
})();

// ---------- Hero photo tilt ----------
(function photoTilt() {
  const wrap = document.getElementById('photoTilt');
  if (!wrap || !finePointer || prefersReducedMotion) return;
  wrap.addEventListener('pointermove', (e) => {
    const r = wrap.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -7;
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 9;
    wrap.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  wrap.addEventListener('pointerleave', () => {
    wrap.style.transform = '';
  });
})();
