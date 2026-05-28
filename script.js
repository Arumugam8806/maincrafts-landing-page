/* =========================================
   MAINCRAFTS — script.js
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
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run on load


  /* ----------------------------------------
     2. HAMBURGER — mobile nav toggle
  ---------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const nav       = document.getElementById('nav');

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    nav.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close nav on link click (mobile)
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 680) {
        hamburger.classList.remove('open');
        nav.classList.remove('open');
      }
    });
  });


  /* ----------------------------------------
     3. DROPDOWN — mobile tap toggle
  ---------------------------------------- */
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 680) {
        e.preventDefault();
        const parent = toggle.closest('.dropdown');
        parent.classList.toggle('open');
      }
    });
  });


  /* ----------------------------------------
     4. ACTIVE NAV LINK — on scroll
  ---------------------------------------- */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link[href^="#"]');

  const activateLink = () => {
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', activateLink, { passive: true });
  activateLink();


  /* ----------------------------------------
     5. FEATURE CARDS — IntersectionObserver
  ---------------------------------------- */
  const featureCards = document.querySelectorAll('.feature-card');

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        cardObserver.unobserve(entry.target); // once only
      }
    });
  }, { threshold: 0.15 });

  featureCards.forEach(card => cardObserver.observe(card));


  /* ----------------------------------------
     6. CTA FORM — email submission + toast
  ---------------------------------------- */
  const form  = document.getElementById('cta-form');
  const toast = document.getElementById('toast');

  let toastTimer = null;

  const showToast = () => {
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 4000);
  };

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (!input.value.trim()) return;

      // Simulate async submit
      const btn = form.querySelector('button');
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting…';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        input.value = '';
        showToast();
      }, 1200);
    });
  }


  /* ----------------------------------------
     7. SMOOTH SCROLL — anchor links
  ---------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80; // header height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ----------------------------------------
     8. SERVICE ITEMS — hover ripple effect
  ---------------------------------------- */
  const serviceItems = document.querySelectorAll('.service-item');

  serviceItems.forEach(item => {
    item.addEventListener('click', () => {
      item.style.transition = 'none';
      item.style.background = 'rgba(245,166,35,0.06)';
      setTimeout(() => {
        item.style.transition = '';
        item.style.background = '';
      }, 300);
    });
  });


  /* ----------------------------------------
     9. HERO STATS — count-up animation
  ---------------------------------------- */
  const stats = document.querySelectorAll('.stat-num');

  const countUp = (el) => {
    const target   = el.textContent;
    const isPercent = target.includes('%');
    const isX       = target.includes('×');
    const isPlus    = target.includes('+');
    const num       = parseFloat(target.replace(/[^0-9.]/g, ''));

    if (isNaN(num)) return;

    const duration = 1400;
    const start    = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      const current  = Math.round(eased * num * 10) / 10;

      let display = current % 1 === 0 ? current : current.toFixed(0);
      if (isPercent) display += '%';
      if (isX)       display += '×';
      if (isPlus)    display += '+';
      el.textContent = display;

      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(stat => statsObserver.observe(stat));


  /* ----------------------------------------
     10. PARALLAX — subtle hero orb movement
  ---------------------------------------- */
  const orbs = document.querySelectorAll('.hero-bg .orb');

  let ticking = false;

  document.addEventListener('mousemove', (e) => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const cx = window.innerWidth  / 2;
        const cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx;
        const dy = (e.clientY - cy) / cy;

        orbs.forEach((orb, i) => {
          const factor = (i + 1) * 12;
          orb.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
        });

        ticking = false;
      });
      ticking = true;
    }
  });


  /* ----------------------------------------
     11. RESIZE — close mobile nav cleanly
  ---------------------------------------- */
  window.addEventListener('resize', () => {
    if (window.innerWidth > 680) {
      hamburger.classList.remove('open');
      nav.classList.remove('open');
    }
  });

});
