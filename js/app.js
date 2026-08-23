/**
 * Monica Singh Portfolio — Main JavaScript Application
 * Handles navigation, stats animation, interactive calendar, FAQs, and scroll triggers.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initStatsCounter();
  initCalendar();
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
    const targetEvents = 300;

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
   4. Live Interactive Availability Calendar
   ========================================================================== */
function initCalendar() {
  const calContainer = document.getElementById('availability-calendar');
  if (!calContainer) return;

  const bookingsData = [
    { date: '2026-08-22', event: 'Sangeet — Shah Wedding', city: 'Ahmedabad', time: '7:00 PM – 12:00 AM', status: 'Booked' },
    { date: '2026-08-23', event: 'Reception — Shah Wedding', city: 'Ahmedabad', time: '8:00 PM – 11:30 PM', status: 'Booked' },
    { date: '2026-08-29', event: 'Dealership Launch', city: 'Vadodara', time: '11:00 AM – 2:00 PM', status: 'Partly held' },
    { date: '2026-09-05', event: 'Annual Meet', city: 'Surat', time: '10:00 AM – 4:00 PM', status: 'Booked' },
    { date: '2026-09-12', event: 'Haldi & Mehendi', city: 'Ahmedabad', time: '9:00 AM – 1:00 PM', status: 'Partly held' },
    { date: '2026-09-19', event: 'Sangeet — Patel Wedding', city: 'Rajkot', time: '7:30 PM – 12:30 AM', status: 'Booked' },
    { date: '2026-09-26', event: 'Award Night', city: 'Ahmedabad', time: '6:30 PM – 11:00 PM', status: 'Booked' },
    { date: '2026-10-03', event: 'Engagement', city: 'Ahmedabad', time: '7:00 PM – 11:00 PM', status: 'Partly held' },
    { date: '2026-10-10', event: 'Sangeet — Mehta Wedding', city: 'Ahmedabad', time: '7:00 PM – 1:00 AM', status: 'Booked' },
    { date: '2026-10-17', event: 'Product Launch', city: 'Vadodara', time: '12:00 PM – 3:00 PM', status: 'Booked' },
  ];

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  let calYear = 2026;
  let calMonth = 7; // August (0-indexed: 7)
  let selectedDate = null;

  const monthTitleEl = document.getElementById('cal-month-title');
  const daysGridEl = document.getElementById('cal-days-grid');
  const prevBtn = document.getElementById('cal-prev-btn');
  const nextBtn = document.getElementById('cal-next-btn');
  const panelTitleEl = document.getElementById('cal-panel-title');
  const panelContentEl = document.getElementById('cal-panel-content');

  function renderCalendar() {
    if (!daysGridEl || !monthTitleEl) return;

    monthTitleEl.textContent = `${monthNames[calMonth]} ${calYear}`;

    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const totalDays = new Date(calYear, calMonth + 1, 0).getDate();

    daysGridEl.innerHTML = '';

    // Empty cells before month start
    for (let i = 0; i < firstDay; i++) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'cal-cell cal-cell-empty';
      daysGridEl.appendChild(emptyDiv);
    }

    // Days of month
    for (let d = 1; d <= totalDays; d++) {
      const iso = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const booking = bookingsData.find(b => b.date === iso);
      const isSelected = selectedDate === iso;

      const cell = document.createElement('button');
      cell.className = 'cal-cell';
      cell.textContent = String(d);
      cell.setAttribute('aria-label', `${d} ${monthNames[calMonth]} ${calYear}`);

      if (booking) {
        if (booking.status === 'Booked') {
          cell.classList.add('cal-cell-booked');
        } else {
          cell.classList.add('cal-cell-partly');
        }
      } else {
        cell.classList.add('cal-cell-open');
      }

      if (isSelected) {
        cell.classList.add('cal-cell-selected');
      }

      cell.addEventListener('click', () => {
        selectedDate = selectedDate === iso ? null : iso;
        renderCalendar();
        renderPanel();
      });

      daysGridEl.appendChild(cell);
    }
  }

  function renderPanel() {
    if (!panelTitleEl || !panelContentEl) return;

    const prefix = `${calYear}-${String(calMonth + 1).padStart(2, '0')}`;
    let visibleList = [];
    let selectedLabel = '';

    if (selectedDate) {
      const [y, m, d] = selectedDate.split('-').map(Number);
      selectedLabel = `${d} ${monthNames[m - 1]} ${y}`;
      visibleList = bookingsData.filter(b => b.date === selectedDate);
      panelTitleEl.textContent = selectedLabel;
    } else {
      visibleList = bookingsData.filter(b => b.date.startsWith(prefix));
      panelTitleEl.textContent = `Booked in ${monthNames[calMonth]} ${calYear}`;
    }

    if (visibleList.length > 0) {
      let html = '<div class="booking-list">';
      visibleList.forEach(b => {
        const [, m, d] = b.date.split('-').map(Number);
        const monthShort = monthNames[m - 1].slice(0, 3);
        const isBooked = b.status === 'Booked';
        const accentColor = isBooked ? '#7A2331' : '#c98a7d';

        html += `
          <div class="booking-item-card" style="border-left: 3px solid ${accentColor};">
            <div class="booking-date-badge">
              <div class="booking-day-num">${d}</div>
              <div class="booking-month-name">${monthShort}</div>
            </div>
            <div>
              <div class="booking-event-title">${b.event}</div>
              <div class="booking-event-city">${b.city}</div>
            </div>
            <div style="text-align: right;">
              <div class="booking-event-time">${b.time}</div>
              <div class="booking-event-status" style="color: ${accentColor};">${b.status}</div>
            </div>
          </div>
        `;
      });
      html += '</div>';
      panelContentEl.innerHTML = html;
    } else {
      const openDateLabel = selectedLabel || 'this date';
      panelContentEl.innerHTML = `
        <div class="booking-empty-box">
          <div class="booking-empty-title">This date is open</div>
          <p class="booking-empty-desc">Nothing held on ${openDateLabel}. Send the details and Monica will confirm.</p>
          <a href="#contact" class="btn-primary" style="padding: 14px 30px; font-size: 13px;">Request this date</a>
        </div>
      `;
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      calMonth--;
      if (calMonth < 0) {
        calMonth = 11;
        calYear--;
      }
      selectedDate = null;
      renderCalendar();
      renderPanel();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      calMonth++;
      if (calMonth > 11) {
        calMonth = 0;
        calYear++;
      }
      selectedDate = null;
      renderCalendar();
      renderPanel();
    });
  }

  renderCalendar();
  renderPanel();
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
