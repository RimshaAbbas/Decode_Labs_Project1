/* ============================================================
   DECODELABS PROJECT 1 — app.js
   Pure vanilla JS. Zero external libraries.
   Techniques: querySelector, addEventListener, classList,
               IntersectionObserver, state objects/arrays.
   ============================================================ */

'use strict';

/* ============================================================
   0. SCROLL-TRIGGERED ANIMATIONS
   ============================================================ */
(function initScrollAnimations() {
  // Check if user prefers reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  // Elements to animate on scroll
  const animatedElements = document.querySelectorAll(`
    .hero-content > *,
    .hero-visual,
    .stats-bar .stat-item,
    .section-header,
    .dashboard-card,
    .feature-card,
    .team-card,
    .contact-form,
    .footer-brand
  `);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Add animation class
        entry.target.classList.add('animate-on-scroll');
        // Trigger the visible state
        requestAnimationFrame(() => {
          entry.target.classList.add('is-visible');
        });
        
        // Stop observing this element
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '-50px 0px'
  });

  animatedElements.forEach((el) => {
    // Add initial animation class
    el.classList.add('animate-on-scroll');
    observer.observe(el);
  });
})();

/* ============================================================
   0.1. PAGE LOAD ANIMATIONS
   ============================================================ */
(function initPageLoadAnimations() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  // Animate header on page load
  const header = document.querySelector('.site-header');
  if (header) {
    header.style.transform = 'translateY(-100%)';
    header.style.transition = 'transform 0.6s var(--ease-natural)';
    
    window.addEventListener('load', () => {
      setTimeout(() => {
        header.style.transform = 'translateY(0)';
      }, 100);
    });
  }

  // Stagger hero content animations
  const heroElements = document.querySelectorAll('.hero-content > *');
  heroElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s var(--ease-natural) ${index * 150}ms, transform 0.6s var(--ease-natural) ${index * 150}ms`;
    
    window.addEventListener('load', () => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 300 + (index * 150));
    });
  });

  // Animate hero visual
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    heroVisual.style.opacity = '0';
    heroVisual.style.transform = 'scale(0.8) rotateY(15deg)';
    heroVisual.style.transition = 'opacity 0.8s var(--ease-natural) 600ms, transform 0.8s var(--ease-natural) 600ms';
    
    window.addEventListener('load', () => {
      setTimeout(() => {
        heroVisual.style.opacity = '1';
        heroVisual.style.transform = 'scale(1) rotateY(0deg)';
      }, 700);
    });
  }
})();

/* ============================================================
   1. HAMBURGER MENU
   ============================================================ */
(function initHamburger() {
  const header     = document.querySelector('.site-header');
  const toggle     = document.querySelector('.menu-toggle');
  const navLinks   = document.querySelector('.nav-links');

  if (!toggle || !navLinks) return;

  function openMenu() {
    header.classList.add('is-open');
    navLinks.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    header.classList.remove('is-open');
    navLinks.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  function toggleMenu() {
    const isOpen = header.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  }

  toggle.addEventListener('click', toggleMenu);

  // Close when a nav link is tapped (mobile UX)
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && header.classList.contains('is-open')) {
      closeMenu();
      toggle.focus();
    }
  });

  // Close when clicking outside the nav
  document.addEventListener('click', e => {
    if (
      header.classList.contains('is-open') &&
      !header.contains(e.target)
    ) {
      closeMenu();
    }
  });
})();


/* ============================================================
   2. ACTIVE NAV LINK — highlight on scroll via IntersectionObserver
   ============================================================ */
(function initActiveNav() {
  const sections  = document.querySelectorAll('main section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === '#' + entry.target.id
          );
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(sec => observer.observe(sec));
})();


/* ============================================================
   3. ANIMATED STAT COUNTER
      Counts up from 0 to data-target when the element enters view
   ============================================================ */
(function initStatCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1500; // ms - increased for more dramatic effect
    const start    = performance.now();

    // Add pulsing effect during count
    el.classList.add('animate-pulse');

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic with bounce
      const eased    = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(eased * target);
      
      el.textContent = currentValue;
      
      // Add special effects for milestones
      if (currentValue === target) {
        el.classList.remove('animate-pulse');
        el.classList.add('animate-bounce-in');
        // Remove bounce class after animation
        setTimeout(() => {
          el.classList.remove('animate-bounce-in');
        }, 800);
      }
      
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  // Stagger the stat animations
  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add staggered delay
        setTimeout(() => {
          animateCounter(entry.target);
        }, index * 200);
        observer.unobserve(entry.target); // only run once
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();


/* ============================================================
   4. DASHBOARD — card data, render, and tab filter
   ============================================================ */
const CARD_DATA = [
  {
    id: 1,
    title: 'HTML Structure',
    description: 'Semantic HTML5 document with ARIA roles, skip link, and proper heading hierarchy.',
    status: 'done',
    progress: 100,
  },
  {
    id: 2,
    title: 'CSS Design Tokens',
    description: 'Custom property system covering palette, typography scale, spacing, radii, and shadows.',
    status: 'done',
    progress: 100,
  },
  {
    id: 3,
    title: 'Mobile-First Layout',
    description: 'Single-column mobile base with min-width breakpoints scaling to tablet and desktop.',
    status: 'done',
    progress: 100,
  },
  {
    id: 4,
    title: 'Hamburger Navigation',
    description: 'Accessible toggle with animated X, keyboard trap, and outside-click dismissal.',
    status: 'active',
    progress: 80,
  },
  {
    id: 5,
    title: 'Form Validation',
    description: 'Real-time vanilla JS validation with ARIA live regions for screen reader feedback.',
    status: 'active',
    progress: 65,
  },
  {
    id: 6,
    title: 'Lighthouse Audit',
    description: 'Performance, accessibility, best-practices, and SEO audits targeting 100/100.',
    status: 'pending',
    progress: 30,
  },
];

// State
let activeFilter = 'all';

function getBadgeClass(status) {
  return { active: 'badge-active', pending: 'badge-pending', done: 'badge-done' }[status] || '';
}

function renderCards() {
  const container = document.getElementById('cards-container');
  if (!container) return;

  const filtered = activeFilter === 'all'
    ? CARD_DATA
    : CARD_DATA.filter(c => c.status === activeFilter);

  if (!filtered.length) {
    container.innerHTML = `
      <p style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding: var(--space-8) 0;">
        No items found for this filter.
      </p>`;
    return;
  }

  // Add fade-out effect before replacing content
  container.style.opacity = '0';
  container.style.transform = 'translateY(10px)';

  setTimeout(() => {
    container.innerHTML = filtered.map((card, index) => `
      <article class="dashboard-card hover-lift" 
               role="listitem" 
               data-id="${card.id}" 
               data-status="${card.status}"
               style="animation-delay: ${index * 100}ms;">
        <div class="card-header">
          <span class="card-title">${card.title}</span>
          <span class="card-badge ${getBadgeClass(card.status)}">${card.status}</span>
        </div>
        <p class="card-desc">${card.description}</p>
        <div>
          <div class="card-progress-label">
            <span>Progress</span>
            <span>${card.progress}%</span>
          </div>
          <div class="progress-track" role="progressbar"
               aria-valuenow="${card.progress}"
               aria-valuemin="0" aria-valuemax="100"
               aria-label="${card.title} progress">
            <div class="progress-fill" style="width: 0%"
                 data-width="${card.progress}%"></div>
          </div>
        </div>
      </article>
    `).join('');

    // Fade container back in
    container.style.transition = 'opacity 0.4s var(--ease-natural), transform 0.4s var(--ease-natural)';
    container.style.opacity = '1';
    container.style.transform = 'translateY(0)';

    // Add entrance animation to cards
    requestAnimationFrame(() => {
      const cards = container.querySelectorAll('.dashboard-card');
      cards.forEach((card, index) => {
        card.classList.add('animate-fade-in-up');
      });

      // Animate progress bars after cards appear
      setTimeout(() => {
        container.querySelectorAll('.progress-fill').forEach((bar, index) => {
          setTimeout(() => {
            bar.style.transition = 'width 0.8s var(--ease-spring)';
            bar.style.width = bar.dataset.width;
          }, index * 150);
        });
      }, 300);
    });
  }, 200);
}

(function initDashboard() {
  renderCards();

  const tabBar = document.querySelector('.tab-bar');
  if (!tabBar) return;

  tabBar.addEventListener('click', e => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;

    tabBar.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });

    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    activeFilter = btn.dataset.filter;
    renderCards();
  });
})();



/* ============================================================
   5. CONTACT FORM VALIDATION
   ============================================================ */
(function initContactForm() {
  const form        = document.getElementById('contact-form');
  const successMsg  = document.getElementById('form-success');
  const charCount   = document.getElementById('cf-char-count');
  const textarea    = document.getElementById('cf-message');
  const MAX_CHARS   = 500;

  if (!form) return;

  // Rules: each field id -> validation function -> error message
  const RULES = [
    {
      id:      'cf-name',
      errorId: 'cf-name-error',
      validate: v => v.trim().length >= 2,
      message:  'Please enter your full name (at least 2 characters).',
    },
    {
      id:      'cf-email',
      errorId: 'cf-email-error',
      validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      message:  'Please enter a valid email address.',
    },
    {
      id:      'cf-subject',
      errorId: 'cf-subject-error',
      validate: v => v.trim().length >= 3,
      message:  'Subject must be at least 3 characters.',
    },
    {
      id:      'cf-message',
      errorId: 'cf-message-error',
      validate: v => v.trim().length >= 10 && v.trim().length <= MAX_CHARS,
      message:  `Message must be between 10 and ${MAX_CHARS} characters.`,
    },
  ];

  // Show/clear a single field's error state
  function setFieldState(rule, isValid) {
    const field = document.getElementById(rule.id);
    const error = document.getElementById(rule.errorId);
    if (!field || !error) return;

    if (isValid) {
      field.classList.remove('is-invalid');
      field.classList.add('is-valid');
      field.setAttribute('aria-invalid', 'false');
      
      // Smooth error message fade out
      error.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      error.style.opacity = '0';
      error.style.transform = 'translateY(-10px)';
      
      setTimeout(() => {
        error.textContent = '';
      }, 300);
    } else {
      field.classList.remove('is-valid');
      field.classList.add('is-invalid');
      field.setAttribute('aria-invalid', 'true');
      
      // Set error message and animate in
      error.textContent = rule.message;
      error.style.opacity = '0';
      error.style.transform = 'translateY(-10px)';
      error.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      
      requestAnimationFrame(() => {
        error.style.opacity = '1';
        error.style.transform = 'translateY(0)';
      });
      
      // Add shake animation to field
      field.style.animation = 'none';
      requestAnimationFrame(() => {
        field.style.animation = 'shake 0.5s ease-in-out';
      });
    }
  }

  // Validate one rule, return boolean
  function validateField(rule) {
    const field = document.getElementById(rule.id);
    if (!field) return true;
    const valid = rule.validate(field.value);
    setFieldState(rule, valid);
    return valid;
  }

  // Real-time validation on blur (after user leaves a field)
  RULES.forEach(rule => {
    const field = document.getElementById(rule.id);
    if (!field) return;
    field.addEventListener('blur', () => validateField(rule));
    // Also re-validate on input after first blur so errors clear live
    field.addEventListener('input', () => {
      if (field.classList.contains('is-invalid') || field.classList.contains('is-valid')) {
        validateField(rule);
      }
    });
  });

  // Character counter for textarea
  if (textarea && charCount) {
    textarea.addEventListener('input', () => {
      const len = textarea.value.length;
      charCount.textContent = `${len} / ${MAX_CHARS}`;
      charCount.style.color = len > MAX_CHARS
        ? 'var(--error)'
        : 'var(--text-muted)';
    });
  }

  // Submit handler
  form.addEventListener('submit', e => {
    e.preventDefault();

    // Validate all fields
    const allValid = RULES.map(validateField).every(Boolean);
    if (!allValid) {
      // Focus the first invalid field for accessibility
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) {
        firstInvalid.focus();
        // Scroll to field smoothly
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Simulate async submit with enhanced animations
    const submitBtn = document.getElementById('submit-btn');
    
    // Add loading animation
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    submitBtn.classList.add('shimmer');
    submitBtn.style.background = 'linear-gradient(90deg, var(--mocha-mousse) 25%, var(--mocha-dark) 50%, var(--mocha-mousse) 75%)';
    submitBtn.style.backgroundSize = '200% 100%';

    // Add form disable overlay
    form.style.position = 'relative';
    form.style.pointerEvents = 'none';
    form.style.opacity = '0.7';

    setTimeout(() => {
      // Reset form with animation
      const formGroups = form.querySelectorAll('.form-group');
      formGroups.forEach((group, index) => {
        setTimeout(() => {
          const field = group.querySelector('input, textarea');
          const error = group.querySelector('.field-error');
          
          if (field) {
            field.value = '';
            field.classList.remove('is-valid', 'is-invalid');
            field.style.animation = 'fadeInUp 0.3s ease forwards';
          }
          if (error) {
            error.textContent = '';
          }
        }, index * 100);
      });

      if (charCount) charCount.textContent = `0 / ${MAX_CHARS}`;

      // Show success message with animation
      successMsg.removeAttribute('hidden');
      successMsg.style.opacity = '0';
      successMsg.style.transform = 'scale(0.8)';
      successMsg.style.transition = 'opacity 0.5s var(--ease-spring), transform 0.5s var(--ease-spring)';
      
      requestAnimationFrame(() => {
        successMsg.style.opacity = '1';
        successMsg.style.transform = 'scale(1)';
      });
      
      successMsg.focus();

      // Reset submit button
      form.style.pointerEvents = '';
      form.style.opacity = '1';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
      submitBtn.classList.remove('shimmer');
      submitBtn.style.background = '';
      submitBtn.style.backgroundSize = '';

      // Hide success message after 5 seconds with fade out
      setTimeout(() => {
        successMsg.style.opacity = '0';
        successMsg.style.transform = 'scale(0.8)';
        setTimeout(() => {
          successMsg.setAttribute('hidden', '');
        }, 500);
      }, 5000);
    }, 1200);
  });
})();


/* ============================================================
   6. SCROLL-TO-TOP BUTTON
      Appears after user scrolls 400px, smooth-scrolls back to top
   ============================================================ */
(function initScrollToTop() {
  // Create button dynamically — no extra HTML needed
  const btn = document.createElement('button');
  btn.className          = 'scroll-top-btn';
  btn.setAttribute('aria-label', 'Scroll back to top');
  btn.innerHTML          = '&#8679;'; // ↑ arrow
  btn.setAttribute('hidden', '');
  document.body.appendChild(btn);

  // Inject minimal styles via a <style> tag
  const style = document.createElement('style');
  style.textContent = `
    .scroll-top-btn {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--mocha-mousse);
      color: #fff;
      font-size: 1.4rem;
      line-height: 1;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(44,37,32,0.18);
      transition: background 150ms ease, transform 150ms ease, opacity 250ms ease;
      z-index: 200;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .scroll-top-btn:hover { background: var(--mocha-dark); transform: translateY(-2px); }
    .scroll-top-btn:focus-visible { outline: 3px solid var(--mocha-mousse); outline-offset: 3px; }
    .scroll-top-btn[hidden] { display: none; }
  `;
  document.head.appendChild(style);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.removeAttribute('hidden');
    } else {
      btn.setAttribute('hidden', '');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();



/* ============================================================
   7. 3D PARALLAX TILT
      Tracks mouse position relative to each card's center and
      applies a proportional rotateX / rotateY transform.
      Uses --ease-natural spring easing via CSS transition.
      Respects prefers-reduced-motion.
   ============================================================ */
(function initParallaxTilt() {
  // Honour reduced-motion preference — skip entirely if set
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  // Target every tiltable card type
  const TILT_SELECTORS = '.dashboard-card, .feature-card, .hero-card, .team-card';
  const MAX_ROTATION   = 10;   // degrees — keep it subtle
  const SCALE          = 1.03; // slight lift on hover

  function applyTilt(card, e) {
    const rect = card.getBoundingClientRect();

    // Normalised cursor offset from card centre: -0.5 → +0.5
    const x = (e.clientX - rect.left)  / rect.width  - 0.5;
    const y = (e.clientY - rect.top)   / rect.height - 0.5;

    const rotateX = (-y * MAX_ROTATION).toFixed(2);
    const rotateY = ( x * MAX_ROTATION).toFixed(2);

    card.style.transform =
      `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${SCALE},${SCALE},${SCALE})`;
  }

  function resetTilt(card) {
    card.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    card.classList.remove('is-tilting');
  }

  // Use event delegation so dynamically-rendered dashboard cards are covered
  document.addEventListener('mousemove', e => {
    const card = e.target.closest(TILT_SELECTORS);
    if (!card) return;
    card.classList.add('is-tilting'); // pauses float animation on hero cards
    applyTilt(card, e);
  });

  document.addEventListener('mouseleave', e => {
    const card = e.target.closest(TILT_SELECTORS);
    if (card) resetTilt(card);
  }, true); // capture phase so it fires even when cursor leaves card fast

  // Also reset on touchstart (mobile — no hover state)
  document.addEventListener('touchstart', e => {
    const card = e.target.closest(TILT_SELECTORS);
    if (card) resetTilt(card);
  }, { passive: true });
})();


/* ============================================================
   8. COMPONENT API BRIDGE
      Connects the frontend form to the backend REST API.
      Techniques: fetch(), async/await, JSON.stringify,
                  DOM manipulation, error handling.

      Backend must be running at http://localhost:3000
      Start it with:  cd Decode_Labs_P2_Backend && npm run dev
   ============================================================ */
(function initComponentAPI() {

  const API_URL    = 'http://localhost:3000/api/components';
  const form       = document.getElementById('component-form');
  const submitBtn  = document.getElementById('comp-submit-btn');
  const successMsg = document.getElementById('comp-success');
  const errorMsg   = document.getElementById('comp-error');
  const feedGrid   = document.getElementById('api-cards-container');

  // All four elements must be in the DOM to proceed
  if (!form || !feedGrid) return;

  // ── Helpers ──────────────────────────────────────────────

  function showError(text) {
    if (!errorMsg) return;
    errorMsg.textContent = text;
    errorMsg.style.display = 'block';
    errorMsg.style.opacity = '0';
    requestAnimationFrame(() => {
      errorMsg.style.transition = 'opacity 0.3s ease';
      errorMsg.style.opacity = '1';
    });
  }

  function hideError() {
    if (!errorMsg) return;
    errorMsg.style.display = 'none';
    errorMsg.textContent = '';
  }

  function showSuccess() {
    if (!successMsg) return;
    successMsg.removeAttribute('hidden');
    successMsg.style.opacity = '0';
    requestAnimationFrame(() => {
      successMsg.style.transition = 'opacity 0.4s ease';
      successMsg.style.opacity = '1';
    });
    setTimeout(() => {
      successMsg.style.opacity = '0';
      setTimeout(() => successMsg.setAttribute('hidden', ''), 400);
    }, 3000);
  }

  // Accent colour per layout engine — maps to CSS custom property
  const LAYOUT_ACCENTS = {
    'CSS Grid':             '#38bdf8',   // cyan
    'Flexbox':              '#a78bfa',   // violet
    'CSS Grid + Flexbox':   '#34d399',   // emerald
    'Absolute Positioning': '#fbbf24',   // amber
  };
  const DEFAULT_ACCENT = '#fb7185';      // coral fallback

  // Build a single card DOM element from a component object
  function buildCard(comp) {
    const accent = LAYOUT_ACCENTS[comp.layout] || DEFAULT_ACCENT;

    const card = document.createElement('article');
    card.className = 'api-card';
    card.setAttribute('role', 'listitem');
    card.setAttribute('data-id', comp.id);
    // Wire the CSS variable so ::before bar and hover border use it
    card.style.setProperty('--api-card-accent', accent);

    // Meta row: layout badge + ID
    const meta = document.createElement('div');
    meta.className = 'api-card-meta';

    const layoutBadge = document.createElement('span');
    layoutBadge.className = 'api-card-layout';
    // Tint the badge background to match accent
    layoutBadge.style.background  = `${accent}18`;  // 10% opacity hex
    layoutBadge.style.color        = accent;
    layoutBadge.textContent        = comp.layout;

    const idSpan = document.createElement('span');
    idSpan.className = 'api-card-id';
    idSpan.textContent = `#${comp.id}`;

    meta.appendChild(layoutBadge);
    meta.appendChild(idSpan);

    // Title
    const title = document.createElement('div');
    title.className = 'api-card-title';
    title.textContent = comp.title;   // textContent = XSS-safe

    // Purpose
    const purpose = document.createElement('div');
    purpose.className = 'api-card-purpose';
    purpose.textContent = comp.purpose;

    card.appendChild(meta);
    card.appendChild(title);
    card.appendChild(purpose);

    return card;
  }

  // ── 1. Fetch & Render ──────────────────────────────────────
  // Pulls the full components array from the backend and rebuilds
  // the #api-cards-container DOM each time it's called.

  async function fetchAndRenderComponents() {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const components = await response.json(); // plain array from the API

      feedGrid.innerHTML = ''; // clear previous state

      if (components.length === 0) {
        feedGrid.innerHTML = `
          <div class="api-empty">
            <div class="api-empty-icon">📭</div>
            <p>No components in server state yet.</p>
            <p style="margin-top:0.4rem; font-size:0.8rem;">Submit the form above to transmit the first one.</p>
          </div>`;
        return;
      }

      components.forEach((comp, index) => {
        const card = buildCard(comp);
        // Staggered entrance animation matching the dashboard section style
        card.style.opacity = '0';
        card.style.transform = 'translateY(16px)';
        card.style.transition = `opacity 0.4s ease ${index * 80}ms, transform 0.4s ease ${index * 80}ms`;
        feedGrid.appendChild(card);

        // Trigger animation on next frame
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        });
      });

    } catch (err) {
      console.error('Synaptic link broken — could not reach backend:', err);
      feedGrid.innerHTML = `
        <div class="api-error">
          <span style="font-size:1.4rem">⚠</span>
          <span>Failed to reach backend server. Make sure it is running at
          <code style="background:rgba(251,113,133,0.15);color:inherit;padding:1px 5px;border-radius:3px;">http://localhost:3000</code></span>
        </div>`;
    }
  }

  // ── 2. Form Submission → POST ──────────────────────────────
  // Collects form values, sends a JSON payload to POST /api/components,
  // handles the Gatekeeper rejection (400) and success (201).

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const payload = {
      title:   document.getElementById('compTitle').value.trim(),
      purpose: document.getElementById('compDesc').value.trim(),
      layout:  document.getElementById('compLayout').value
    };

    // Client-side pre-check mirrors the Gatekeeper so we give instant feedback
    if (!payload.title || !payload.purpose || !payload.layout) {
      showError('All three fields are required before transmission.');
      return;
    }

    // Loading state
    submitBtn.disabled    = true;
    submitBtn.textContent = 'Transmitting…';

    try {
      const response = await fetch(API_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload)
      });

      if (!response.ok) {
        // Gatekeeper rejected the payload — show the server's message
        const errData = await response.json();
        showError(`Gatekeeper Rejection: ${errData.message}`);
        return;
      }

      // Success — reset the form and refresh the live feed
      form.reset();
      showSuccess();
      fetchAndRenderComponents(); // pull fresh state from the server

    } catch (err) {
      console.error('Transmission breakdown:', err);
      showError('Network error — could not reach the backend. Is the server running?');
    } finally {
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Transmit Component';
    }
  });

  // ── Initial load ───────────────────────────────────────────
  // Run immediately on page load so the live feed populates
  // with whatever the server already holds in its data store.
  fetchAndRenderComponents();

})();
