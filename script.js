/* ===================================
   SINGTEL INFOTECH — SCRIPT.JS
   =================================== */

// ─── NAVBAR: Scroll + Toggle ───────
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  navToggle.setAttribute('aria-expanded', isOpen);
  navToggle.style.opacity = isOpen ? '0.6' : '1';
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.style.opacity = '1';
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    navLinks.classList.remove('open');
    navToggle.style.opacity = '1';
  }
});

// ─── SMOOTH SCROLL for anchor links ─
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ─── INTERSECTION OBSERVER: Reveal ──
const revealEls = document.querySelectorAll(
  '.section-title, .section-sub, .section-label, .wallet-card, .feature-card, ' +
  '.project-card, .loan-card, .term-item, .cap-card, .spec-row, .roi-hero-card, ' +
  '.levels-table-wrap, .levels-pyramid, .wd-card, .wd-specs, .supported-wallets, ' +
  '.about-grid, .capping-section'
);

revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 80 * i);
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.08,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => observer.observe(el));

// ─── ACTIVE NAV LINK on scroll ──────
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

const activateNav = () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY + 100 >= sec.offsetTop) current = sec.id;
  });
  navItems.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = 'var(--teal)';
    }
  });
};

window.addEventListener('scroll', activateNav);

// ─── HERO STATS: Count-up animation ─
const countUp = (el, target, suffix = '') => {
  const duration = 2000;
  const step     = target / (duration / 16);
  let   current  = 0;
  const isDecimal = String(target).includes('.');

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = (isDecimal ? current.toFixed(2) : Math.floor(current)) + suffix;
  }, 16);
};

// Animate ROI big number when in view
const roiBigNumber = document.querySelector('.roi-big-number');
if (roiBigNumber) {
  const roiObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      roiBigNumber.innerHTML = '0.00<span>%</span>';
      const textNode = roiBigNumber.childNodes[0];
      let current = 0;
      const interval = setInterval(() => {
        current += 0.01;
        if (current >= 0.33) { current = 0.33; clearInterval(interval); }
        textNode.textContent = current.toFixed(2);
      }, 30);
      roiObserver.unobserve(roiBigNumber);
    }
  }, { threshold: 0.5 });
  roiObserver.observe(roiBigNumber);
}

// ─── PYRAMID BARS: animate width on scroll ─
const pyramidBars = document.querySelectorAll('.py-bar');
if (pyramidBars.length) {
  const pyObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      pyramidBars.forEach((bar, i) => {
        bar.style.width = '0';
        setTimeout(() => {
          bar.style.width = bar.style.getPropertyValue('--w') || getComputedStyle(bar).getPropertyValue('--w');
        }, 100 + i * 60);
      });
      pyObserver.disconnect();
    }
  }, { threshold: 0.3 });
  pyObserver.observe(document.querySelector('.levels-pyramid'));
}

// ─── LEVEL TABLE ROWS: stagger ───────
document.querySelectorAll('.level-row').forEach((row, i) => {
  row.style.opacity = '0';
  row.style.transform = 'translateX(-12px)';

  const rowObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      setTimeout(() => {
        row.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        row.style.opacity    = '1';
        row.style.transform  = 'translateX(0)';
      }, i * 60);
      rowObserver.unobserve(row);
    }
  }, { threshold: 0.2 });
  rowObserver.observe(row);
});


// ─── CONTACT FORM VALIDATION ────────────────────
(function () {
  const form    = document.getElementById('contactForm');
  if (!form) return;

  const nameEl    = document.getElementById('cf-name');
  const phoneEl   = document.getElementById('cf-phone');
  const emailEl   = document.getElementById('cf-email');
  const msgEl     = document.getElementById('cf-message');
  const submitBtn = document.getElementById('contactSubmit');
  const successEl = document.getElementById('contactSuccess');
  const charEl    = document.getElementById('charCount');

  // ── Char counter ──────────────────────────────
  if (msgEl && charEl) {
    msgEl.addEventListener('input', () => {
      const n = msgEl.value.length;
      charEl.textContent = `${n} / 500`;
      charEl.className = 'contact-char-count' +
        (n > 480 ? ' over' : n > 380 ? ' near' : '');
    });
  }

  // ── Helpers ───────────────────────────────────
  function setError(input, errId, show) {
    const err = document.getElementById(errId);
    if (!input || !err) return;
    input.classList.toggle('is-error', show);
    err.classList.toggle('visible', show);
  }

  function clearOnInput(input, errId) {
    if (!input) return;
    input.addEventListener('input', () => setError(input, errId, false));
  }

  clearOnInput(nameEl,  'err-name');
  clearOnInput(phoneEl, 'err-phone');
  clearOnInput(emailEl, 'err-email');
  clearOnInput(msgEl,   'err-message');

  // ── Validation ────────────────────────────────
  function validate() {
    let ok = true;

    // Name: at least 2 characters
    const name = nameEl ? nameEl.value.trim() : '';
    if (name.length < 2) { setError(nameEl, 'err-name', true); ok = false; }
    else                  { setError(nameEl, 'err-name', false); }

    // Phone: at least 7 digits, only digits/spaces/+/dashes/parens
    const phone  = phoneEl ? phoneEl.value.trim() : '';
    const digits = phone.replace(/\D/g, '');
    const phoneOk = phone.length > 0 && digits.length >= 7 && /^[+\d\s\-(). ]+$/.test(phone);
    if (!phoneOk) { setError(phoneEl, 'err-phone', true); ok = false; }
    else          { setError(phoneEl, 'err-phone', false); }

    // Email: standard format
    const email   = emailEl ? emailEl.value.trim() : '';
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRe.test(email)) { setError(emailEl, 'err-email', true); ok = false; }
    else                      { setError(emailEl, 'err-email', false); }

    // Message: at least 10 chars
    const msg = msgEl ? msgEl.value.trim() : '';
    if (msg.length < 10) { setError(msgEl, 'err-message', true); ok = false; }
    else                 { setError(msgEl, 'err-message', false); }

    return ok;
  }

  // ── Submit ────────────────────────────────────
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Show spinner
    const textSpan    = submitBtn.querySelector('.contact-submit-text');
    const spinnerSpan = submitBtn.querySelector('.contact-submit-spinner');
    if (textSpan)    textSpan.style.display    = 'none';
    if (spinnerSpan) spinnerSpan.style.display = 'inline-flex';
    submitBtn.disabled = true;

    // Simulate async — 1.4s then show success
    setTimeout(() => {
      // Reset
      form.reset();
      if (charEl) { charEl.textContent = '0 / 500'; charEl.className = 'contact-char-count'; }

      // Restore button
      if (textSpan)    textSpan.style.display    = '';
      if (spinnerSpan) spinnerSpan.style.display = 'none';
      submitBtn.disabled = false;

      // Show success banner
      if (successEl) {
        successEl.style.display = 'flex';
        successEl.style.animation = 'slideInRight 0.5s ease both';
        // Hide after 6 s
        setTimeout(() => { successEl.style.display = 'none'; }, 6000);
      }
    }, 1400);
  });

  // ── Scroll reveal for contact section elements ──
  const contactRevealEls = document.querySelectorAll('.contact-info-card, .contact-form-card');
  contactRevealEls.forEach(el => el.classList.add('reveal'));
  contactRevealEls.forEach(el => observer.observe(el));

})();
