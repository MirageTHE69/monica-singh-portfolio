/**
 * Monica Singh Portfolio — Client Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Navigation & View Router
  const views = {
    home: document.getElementById('view-home'),
    wedding: document.getElementById('view-wedding'),
    sangeet: document.getElementById('view-sangeet'),
    corporate: document.getElementById('view-corporate'),
    about: document.getElementById('view-about'),
    contact: document.getElementById('view-contact')
  };

  const fullscreenMenu = document.getElementById('fullscreen-menu');
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const menuCloseBtn = document.getElementById('menu-close-btn');
  const menuNavItems = document.querySelectorAll('.menu-nav-item');

  let currentPage = 'home';

  function navigateTo(pageId, updateHash = true) {
    if (!views[pageId]) {
      pageId = 'home';
    }

    // Hide all views, show targeted view
    Object.keys(views).forEach(key => {
      if (views[key]) {
        views[key].classList.remove('active');
      }
    });

    if (views[pageId]) {
      views[pageId].classList.add('active');
    }

    currentPage = pageId;

    // Update active states in menu
    menuNavItems.forEach(item => {
      if (item.dataset.page === pageId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Close menu if open
    closeMenu();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update URL hash
    if (updateHash) {
      history.pushState(null, '', `#${pageId}`);
    }
  }

  // Handle URL hash on load and hashchange
  function handleHashRoute() {
    const hash = window.location.hash.replace('#', '').trim();
    if (hash && views[hash]) {
      navigateTo(hash, false);
    } else {
      navigateTo('home', false);
    }
  }

  window.addEventListener('hashchange', handleHashRoute);

  // Bind all nav links and buttons with data-navigate
  document.addEventListener('click', (e) => {
    const navEl = e.target.closest('[data-navigate]');
    if (navEl) {
      e.preventDefault();
      const targetPage = navEl.getAttribute('data-navigate');
      navigateTo(targetPage);
    }
  });

  // Menu Open / Close logic
  function openMenu() {
    if (fullscreenMenu) {
      fullscreenMenu.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMenu() {
    if (fullscreenMenu) {
      fullscreenMenu.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  if (menuToggleBtn) {
    menuToggleBtn.addEventListener('click', openMenu);
  }

  if (menuCloseBtn) {
    menuCloseBtn.addEventListener('click', closeMenu);
  }

  // ESC key to close menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });

  // Video Reel Playback Overlay Logic
  const videoCards = document.querySelectorAll('.video-card-container');
  videoCards.forEach(container => {
    const video = container.querySelector('video');
    const overlay = container.querySelector('.video-play-overlay');

    if (video && overlay) {
      overlay.addEventListener('click', () => {
        if (video.paused) {
          video.play().then(() => {
            overlay.classList.add('playing');
          }).catch(err => {
            console.log('Video playback note:', err);
          });
        } else {
          video.pause();
          overlay.classList.remove('playing');
        }
      });

      video.addEventListener('pause', () => {
        overlay.classList.remove('playing');
      });

      video.addEventListener('play', () => {
        overlay.classList.add('playing');
      });
    }
  });

  // Contact Quote Form Submission Handling
  const quoteForm = document.getElementById('quote-form');
  const formSuccessBox = document.getElementById('form-success-box');
  const resetFormBtn = document.getElementById('reset-form-btn');

  if (quoteForm && formSuccessBox) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Collect data (for potential CRM / email integration)
      const formData = new FormData(quoteForm);
      const data = Object.fromEntries(formData.entries());
      console.log('Form submission received:', data);

      // Show success screen
      quoteForm.style.display = 'none';
      formSuccessBox.style.display = 'block';
    });

    if (resetFormBtn) {
      resetFormBtn.addEventListener('click', () => {
        quoteForm.reset();
        formSuccessBox.style.display = 'none';
        quoteForm.style.display = 'block';
      });
    }
  }

  // Initial Route Check
  handleHashRoute();
});
