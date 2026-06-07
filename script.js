/* =========================================
   MAINCRAFTS — script.js
   Works across home.html, about.html, contact.html
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------
     1. HEADER — scroll class
  ---------------------------------------- */
  const header = document.getElementById('header');

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      // Keep scrolled on inner pages (about/contact have it set by default in HTML)
      if (!header.classList.contains('always-scrolled')) {
        header.classList.remove('scrolled');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();


  /* ----------------------------------------
     2. HAMBURGER — mobile nav toggle
  ---------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const nav       = document.getElementById('nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      nav.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a:not(.dropdown-toggle)').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 680) {
          hamburger.classList.remove('open');
          nav.classList.remove('open');
        }
      });
    });
  }


  /* ----------------------------------------
     3. DROPDOWN — mobile tap toggle
  ---------------------------------------- */
  document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 680) {
        e.preventDefault();
        toggle.closest('.dropdown').classList.toggle('open');
      }
    });
  });


  /* ----------------------------------------
     4. SMOOTH SCROLL — same-page anchors only
  ---------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ----------------------------------------
     5. FEATURE / VALUE / TEAM CARDS — reveal on scroll
  ---------------------------------------- */
  const animCards = document.querySelectorAll('.feature-card');

  if (animCards.length) {
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          cardObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    animCards.forEach(card => cardObserver.observe(card));
  }


  /* ----------------------------------------
     6. HERO STATS — count-up animation (home only)
  ---------------------------------------- */
  const stats = document.querySelectorAll('.hero-stats .stat-num');

  if (stats.length) {
    const countUp = (el) => {
      const target     = el.textContent;
      const isPercent  = target.includes('%');
      const isX        = target.includes('×');
      const isPlus     = target.includes('+');
      const rawNum     = parseFloat(target.replace(/[^0-9.]/g, ''));
      if (isNaN(rawNum)) return;

      const duration = 1400;
      const start    = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        let current    = Math.round(eased * rawNum * 10) / 10;
        let display    = current % 1 === 0 ? String(current) : current.toFixed(1);
        if (isPercent) display += '%';
        if (isX)       display += '×';
        if (isPlus)    display += '+';
        el.textContent = display;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const statsObs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { countUp(e.target); statsObs.unobserve(e.target); } });
    }, { threshold: 0.5 });

    stats.forEach(s => statsObs.observe(s));
  }


  /* ----------------------------------------
     7. ABOUT STATS COUNT-UP (about.html)
  ---------------------------------------- */
  const aboutStats = document.querySelectorAll('.about-stat .stat-num');

  if (aboutStats.length) {
    const countUpAbout = (el) => {
      const text    = el.textContent;
      const hasStar = text.includes('★');
      const rawNum  = parseFloat(text.replace(/[^0-9.]/g, ''));
      if (isNaN(rawNum)) return;

      const isPercent = text.includes('%');
      const isPlus    = text.includes('+');
      const isK       = text.includes('K');
      const duration  = 1600;
      const start     = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        let cur        = eased * rawNum;
        let display;
        if (rawNum % 1 !== 0) {
          display = (Math.round(cur * 10) / 10).toFixed(1);
        } else {
          display = String(Math.round(cur));
        }
        if (isK)       display += 'K+';
        else if (isPlus) display += '+';
        else if (isPercent) display += '%';
        if (hasStar)   display += '★';
        el.textContent = display;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const aboutStatsObs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { countUpAbout(e.target); aboutStatsObs.unobserve(e.target); } });
    }, { threshold: 0.4 });

    aboutStats.forEach(s => aboutStatsObs.observe(s));
  }


  /* ----------------------------------------
     8. PARALLAX — hero orbs on mouse move
  ---------------------------------------- */
  const orbs = document.querySelectorAll('.hero-bg .orb');
  if (orbs.length) {
    let ticking = false;
    document.addEventListener('mousemove', (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const cx = window.innerWidth  / 2;
          const cy = window.innerHeight / 2;
          const dx = (e.clientX - cx) / cx;
          const dy = (e.clientY - cy) / cy;
          orbs.forEach((orb, i) => {
            const f = (i + 1) * 12;
            orb.style.transform = `translate(${dx * f}px, ${dy * f}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    });
  }


  /* ----------------------------------------
     9. SERVICE ITEMS — click ripple
  ---------------------------------------- */
  document.querySelectorAll('.service-item').forEach(item => {
    item.addEventListener('click', () => {
      item.style.transition = 'none';
      item.style.background = 'rgba(245,166,35,0.05)';
      setTimeout(() => { item.style.transition = ''; item.style.background = ''; }, 300);
    });
  });


  /* ----------------------------------------
     10. TOAST helper
  ---------------------------------------- */
  const toast    = document.getElementById('toast');
  let toastTimer = null;

  const showToast = (msg) => {
    if (!toast) return;
    if (msg) toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${msg}`;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 4000);
  };


  /* ----------------------------------------
     11. HOME CTA EMAIL FORM
  ---------------------------------------- */
  const ctaForm = document.getElementById('cta-form');
  if (ctaForm) {
    ctaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = ctaForm.querySelector('input[type="email"]');
      if (!input || !input.value.trim()) return;

      const btn = ctaForm.querySelector('button[type="submit"]');
      const orig = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting…';
      btn.disabled  = true;

      setTimeout(() => {
        btn.innerHTML = orig;
        btn.disabled  = false;
        input.value   = '';
        showToast("You're on the list! We'll be in touch soon.");
      }, 1200);
    });
  }


  /* ----------------------------------------
     12. CONTACT FORM — full validation
  ---------------------------------------- */
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {

    /* --- Helper: show / clear a field error --- */
    const setError = (fieldId, errId, msg) => {
      const field   = document.getElementById(fieldId);
      const errEl   = document.getElementById(errId);
      const wrapper = field ? field.closest('.input-wrap') : null;

      if (msg) {
        if (errEl)   { errEl.textContent = msg; }
        if (wrapper) {
          const el = wrapper.querySelector('input, select, textarea');
          if (el) el.classList.add('error');
        }
        return false;
      } else {
        if (errEl)   { errEl.textContent = ''; }
        if (wrapper) {
          const el = wrapper.querySelector('input, select, textarea');
          if (el) el.classList.remove('error');
        }
        return true;
      }
    };

    /* --- Live clear-error on input --- */
    ['cf-name', 'cf-email', 'cf-message'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const errMap = { 'cf-name': 'err-name', 'cf-email': 'err-email', 'cf-message': 'err-message' };
      el.addEventListener('input', () => setError(id, errMap[id], ''));
    });

    /* --- Email format check --- */
    const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

    /* --- Submit handler --- */
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameEl    = document.getElementById('cf-name');
      const emailEl   = document.getElementById('cf-email');
      const msgEl     = document.getElementById('cf-message');
      const consentEl = document.getElementById('cf-consent');
      const errConsent = document.getElementById('err-consent');

      let valid = true;

      /* Name */
      if (!nameEl.value.trim()) {
        setError('cf-name', 'err-name', 'Full name is required.');
        valid = false;
      } else if (nameEl.value.trim().length < 2) {
        setError('cf-name', 'err-name', 'Name must be at least 2 characters.');
        valid = false;
      } else {
        setError('cf-name', 'err-name', '');
      }

      /* Email */
      if (!emailEl.value.trim()) {
        setError('cf-email', 'err-email', 'Email address is required.');
        valid = false;
      } else if (!isValidEmail(emailEl.value)) {
        setError('cf-email', 'err-email', 'Please enter a valid email address.');
        valid = false;
      } else {
        setError('cf-email', 'err-email', '');
      }

      /* Message */
      if (!msgEl.value.trim()) {
        setError('cf-message', 'err-message', 'Message cannot be empty.');
        valid = false;
      } else if (msgEl.value.trim().length < 10) {
        setError('cf-message', 'err-message', 'Message must be at least 10 characters.');
        valid = false;
      } else {
        setError('cf-message', 'err-message', '');
      }

      /* Consent */
      if (consentEl && !consentEl.checked) {
        if (errConsent) errConsent.textContent = 'You must agree to the Privacy Policy.';
        valid = false;
      } else {
        if (errConsent) errConsent.textContent = '';
      }

      if (!valid) {
        /* Scroll to first error */
        const firstErr = contactForm.querySelector('.error, .field-error:not(:empty)');
        if (firstErr) {
          firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      /* All good — simulate async submit */
      const submitBtn  = document.getElementById('contact-submit');
      const successBox = document.getElementById('form-success');
      const origHTML   = submitBtn.innerHTML;

      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
      submitBtn.disabled  = true;

      setTimeout(() => {
        submitBtn.style.display = 'none';
        if (successBox) successBox.classList.add('show');
        contactForm.reset();
        showToast('Message sent successfully!');
      }, 1400);
    });
  }


  /* ----------------------------------------
     13. FAQ ACCORDION (contact.html)
  ---------------------------------------- */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item    = btn.closest('.faq-item');
      const isOpen  = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
      });

      // Toggle clicked
      if (!isOpen) item.classList.add('open');
    });
  });


  /* ----------------------------------------
     14. RESIZE — reset mobile nav
  ---------------------------------------- */
  window.addEventListener('resize', () => {
    if (window.innerWidth > 680 && hamburger && nav) {
      hamburger.classList.remove('open');
      nav.classList.remove('open');
    }
  });

});
