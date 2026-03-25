/**
 * =====================================================
 *  ELEGANZA — Main UI Script
 *  Navigation, Scroll effects, Countdown, Filters,
 *  Scroll-reveal, WhatsApp helper, Back-to-top
 * =====================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Init Lucide Icons ── */
  if (window.lucide) lucide.createIcons();

  /* ── Footer Year ── */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Announcement Bar Close ── */
  const annBar   = document.getElementById('announcement-bar');
  const annClose = document.getElementById('announcement-close');
  if (annClose && annBar) {
    annClose.addEventListener('click', () => {
      annBar.style.maxHeight = annBar.scrollHeight + 'px';
      requestAnimationFrame(() => {
        annBar.style.transition = 'max-height .3s ease, opacity .3s ease';
        annBar.style.maxHeight  = '0';
        annBar.style.opacity    = '0';
        annBar.style.overflow   = 'hidden';
        annBar.style.padding    = '0';
      });
    });
  }

  /* ── Sticky Header Shadow on Scroll ── */
  const header = document.getElementById('header');
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 10) header.classList.add('scrolled');
    else                      header.classList.remove('scrolled');

    /* Back to top visibility */
    const btn = document.getElementById('back-to-top');
    if (btn) {
      if (window.scrollY > 400) btn.classList.add('visible');
      else                       btn.classList.remove('visible');
    }

    /* Active nav link highlight */
    updateActiveNav();
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Back to Top ── */
  const backTopBtn = document.getElementById('back-to-top');
  if (backTopBtn) {
    backTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Mobile Hamburger ── */
  const hamburger = document.getElementById('hamburger');
  const navMobile = document.getElementById('nav-mobile');
  if (hamburger && navMobile) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMobile.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    /* Close mobile nav when a link is clicked */
    navMobile.querySelectorAll('.nav-link-mobile').forEach(link => {
      link.addEventListener('click', () => {
        navMobile.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Smooth scroll for ALL anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = header ? header.offsetHeight + 12 : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── Active Nav Link ── */
  const sections   = ['hero', 'new-arrivals', 'offers', 'services', 'contact'];
  const navLinks   = document.querySelectorAll('.nav-link');
  const mNavLinks  = document.querySelectorAll('.nav-link-mobile');

  function updateActiveNav() {
    let current = '';
    sections.forEach(id => {
      const sec = document.getElementById(id);
      if (sec) {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= 120) current = id;
      }
    });
    navLinks.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
    mNavLinks.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  }

  /* ── Product Filter Tabs ── */
  const filterTabs  = document.querySelectorAll('.filter-tab');
  const productCards = document.querySelectorAll('.product-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      /* Update active tab */
      filterTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.dataset.filter;

      productCards.forEach(card => {
        const categories = (card.dataset.category || '').toLowerCase();
        if (filter === 'all' || categories.includes(filter)) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeInCard .35s ease both';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ── Countdown Timer ── */
  function updateCountdown() {
    const deadlineStr = (typeof ADMIN_DATA !== 'undefined')
      ? ADMIN_DATA.offerDeadline
      : null;
    if (!deadlineStr) return;

    const deadline = new Date(deadlineStr).getTime();

    function tick() {
      const now  = Date.now();
      const diff = deadline - now;

      if (diff <= 0) {
        document.getElementById('cd-days-num').textContent  = '00';
        document.getElementById('cd-hours-num').textContent = '00';
        document.getElementById('cd-mins-num').textContent  = '00';
        document.getElementById('cd-secs-num').textContent  = '00';
        return;
      }

      const days  = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins  = Math.floor((diff % 3600000)  / 60000);
      const secs  = Math.floor((diff % 60000)    / 1000);

      const pad = n => String(n).padStart(2, '0');

      document.getElementById('cd-days-num').textContent  = pad(days);
      document.getElementById('cd-hours-num').textContent = pad(hours);
      document.getElementById('cd-mins-num').textContent  = pad(mins);
      document.getElementById('cd-secs-num').textContent  = pad(secs);
    }

    tick();
    setInterval(tick, 1000);
  }

  /* Delay countdown init until ADMIN_DATA is ready */
  setTimeout(updateCountdown, 100);

  /* ── Scroll-Reveal (IntersectionObserver) ── */
  const revealEls = document.querySelectorAll(
    '.product-card, .offer-card, .service-card, .testimonial-card, .feature-item, .contact-item, .section-header'
  );

  /* Add reveal class */
  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        /* Stagger sibling animations */
        const siblings = entry.target.parentElement
          ? Array.from(entry.target.parentElement.children).filter(c => c.classList.contains('reveal'))
          : [];
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ── Product card CSS animation keyframe (injected once) ── */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInCard {
      from { opacity:0; transform:translateY(16px); }
      to   { opacity:1; transform:translateY(0); }
    }
  `;
  document.head.appendChild(style);

  /* ── Hero image parallax (subtle) ── */
  const heroImg = document.getElementById('hero-main-img');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      const offset = window.scrollY * 0.12;
      heroImg.style.transform = `translateY(${offset}px)`;
    }, { passive: true });
  }

  /* ── Keyboard: ESC closes admin panel ── */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const overlay = document.getElementById('admin-overlay');
      if (overlay && overlay.classList.contains('open')) {
        if (typeof closeAdminPanel === 'function') closeAdminPanel();
      }
    }
  });

  console.log('%c✨ Eleganza Website Loaded', 'color:#7c3aed;font-weight:700;font-size:16px;');
  console.log('%cAdmin panel: click the ⚙ gear icon (bottom-left)', 'color:#d97706;font-size:12px;');
});

/* ── WhatsApp Helper (global, used by buttons in HTML) ── */
function openWhatsApp(product) {
  const msg = product
    ? `Hi Eleganza! I'm interested in: *${product}*. Could you share more details?`
    : `Hi Eleganza! I'd like to enquire about your products.`;
  const url = 'https://wa.me/94777669391?text=' + encodeURIComponent(msg);
  window.open(url, '_blank', 'noopener,noreferrer');
}
