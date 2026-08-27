/**
 * Monica Singh Portfolio — Main JavaScript Application
 * Handles navigation, stats animation, interactive calendar, FAQs, and scroll triggers.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initStatsCounter();
  initFaqAccordion();
  initScrollEffects();
  initGalleryPage();
});

/* ==========================================================================
   1. Header & WhatsApp Scroll Effects
   ========================================================================== */
function initHeader() {
  const header = document.getElementById('site-header');
  const whatsappBtn = document.getElementById('floating-whatsapp');

  const onScroll = () => {
    const isScrolled = window.scrollY > 80;
    if (header) {
      if (isScrolled) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    if (whatsappBtn) {
      if (isScrolled) {
        whatsappBtn.classList.add('visible');
      } else {
        whatsappBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initScrollEffects() {
  // Reveal on scroll elements with progressive enhancement
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }
}

/* ==========================================================================
   2. Mobile Drawer Navigation
   ========================================================================== */
function initMobileMenu() {
  const openBtn = document.getElementById('mobile-menu-open');
  const closeBtn = document.getElementById('mobile-menu-close');
  const drawer = document.getElementById('mobile-drawer');
  const links = drawer ? drawer.querySelectorAll('a') : [];

  if (!drawer) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (openBtn) openBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  links.forEach(link => link.addEventListener('click', closeDrawer));
}

/* ==========================================================================
   3. Animated Stats Counter
   ========================================================================== */
function initStatsCounter() {
  const statsSection = document.getElementById('stats-section');
  const statYearsEl = document.getElementById('stat-years');
  const statEventsEl = document.getElementById('stat-events');

  if (!statsSection || !statYearsEl || !statEventsEl) return;

  let animated = false;

  const runCounter = () => {
    if (animated) return;
    animated = true;

    const duration = 1400;
    const start = performance.now();
    const targetYears = 10;
    const targetEvents = 1500;

    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const easeOutP = 1 - Math.pow(1 - p, 3);

      statYearsEl.textContent = Math.round(targetYears * easeOutP) + '+';
      statEventsEl.textContent = Math.round(targetEvents * easeOutP) + '+';

      if (p < 1) {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        runCounter();
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    observer.observe(statsSection);
  } else {
    runCounter();
  }
}

/* ==========================================================================
   5. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    item.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      faqItems.forEach(other => other.classList.remove('active'));
      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   6. Gallery Page — Category Filtering + Lightbox
   ========================================================================== */
function initGalleryPage() {
  const grid = document.getElementById('gallery-full-grid');
  if (!grid) return;

  const items = Array.from(grid.querySelectorAll('.gallery-full-item'));
  const pills = Array.from(document.querySelectorAll('.filter-pill'));
  const emptyState = document.getElementById('gallery-empty-state');
  const totalStatEl = document.getElementById('gallery-stat-total');

  const lightbox = document.getElementById('lightbox-overlay');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let visibleItems = items;
  let currentIndex = 0;

  if (totalStatEl) totalStatEl.textContent = items.length;

  // Populate each pill with a live count badge, e.g. "Corporate (4)"
  pills.forEach(pill => {
    const filter = pill.dataset.filter;
    const count = filter === 'all' ? items.length : items.filter(i => i.dataset.category === filter).length;
    const countEl = document.createElement('span');
    countEl.className = 'filter-count';
    countEl.textContent = count;
    pill.appendChild(countEl);
  });

  function applyFilter(filter, updateUrl) {
    let matched = 0;
    items.forEach(item => {
      const show = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('hidden-item', !show);
      if (show) matched++;
    });

    visibleItems = items.filter(item => !item.classList.contains('hidden-item'));

    pills.forEach(pill => {
      pill.classList.toggle('active', pill.dataset.filter === filter);
    });

    if (emptyState) {
      emptyState.classList.toggle('visible', matched === 0);
    }

    if (updateUrl) {
      const url = new URL(window.location.href);
      if (filter === 'all') {
        url.searchParams.delete('filter');
      } else {
        url.searchParams.set('filter', filter);
      }
      window.history.replaceState({}, '', url);
    }
  }

  pills.forEach(pill => {
    pill.addEventListener('click', () => applyFilter(pill.dataset.filter, true));
  });

  const initialFilter = new URLSearchParams(window.location.search).get('filter') || 'all';
  const validFilters = pills.map(p => p.dataset.filter);
  applyFilter(validFilters.includes(initialFilter) ? initialFilter : 'all', false);

  function openLightbox(item) {
    if (!lightbox || !lightboxImg) return;
    currentIndex = visibleItems.indexOf(item);
    const img = item.querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    if (lightboxCaption) lightboxCaption.textContent = item.dataset.caption || img.alt;
    if (lightboxCounter) lightboxCounter.textContent = `${currentIndex + 1} / ${visibleItems.length}`;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showByOffset(offset) {
    if (!visibleItems.length) return;
    currentIndex = (currentIndex + offset + visibleItems.length) % visibleItems.length;
    openLightbox(visibleItems[currentIndex]);
  }

  items.forEach(item => {
    item.addEventListener('click', () => openLightbox(item));
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => showByOffset(-1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => showByOffset(1));

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showByOffset(-1);
    if (e.key === 'ArrowRight') showByOffset(1);
  });
}
