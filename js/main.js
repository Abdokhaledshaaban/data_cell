// ============================================
// GLOBAL ANIMATIONS & FUNCTIONALITY
// ============================================

// ============================================
// DARK MODE MANAGEMENT
// ============================================
let darkmode = localStorage.getItem('darkmode');
const themeSwitch = document.getElementById('theme-switch');

function enabledarkmode() {
  document.body.classList.add('darkmode');
  localStorage.setItem('darkmode', 'active');
}

function disabledarkmode() {
  document.body.classList.remove('darkmode');
  localStorage.setItem('darkmode', 'inactive');
}

if (!darkmode) {
  darkmode = 'active';
  localStorage.setItem('darkmode', 'active');
}

if (darkmode === 'active') {
  enabledarkmode();
} else {
  disabledarkmode();
}

if (themeSwitch) {
  themeSwitch.setAttribute(
    'aria-pressed',
    darkmode === 'active' ? 'true' : 'false'
  );
  themeSwitch.addEventListener('click', () => {
    darkmode = localStorage.getItem('darkmode');
    if (darkmode !== 'active') {
      enabledarkmode();
      themeSwitch.setAttribute('aria-pressed', 'true');
    } else {
      disabledarkmode();
      themeSwitch.setAttribute('aria-pressed', 'false');
    }
  });
}

// ============================================
// NAVBAR MANAGEMENT & SCROLL EFFECTS
// ============================================
const navbarToggler = document.querySelector('.navbar-toggler');
const linksMenu = document.getElementById('links');
const nav_close = document.querySelector('.nav-close');
const drop_down_btn = document.querySelector('.drop-down');
const drop_down_list = document.querySelector('.drop-down-list');
const navbar = document.querySelector('.navbar');

const setMenuState = (isOpen) => {
  if (!linksMenu || !navbarToggler) return;
  linksMenu.classList.toggle('show', isOpen);
  navbarToggler.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
};

if (navbarToggler && linksMenu) {
  navbarToggler.addEventListener('click', () => {
    const isOpen = linksMenu.classList.contains('show');
    setMenuState(!isOpen);
  });
}

if (nav_close) {
  nav_close.addEventListener('click', () => {
    setMenuState(false);
  });
}

if (linksMenu) {
  linksMenu.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      if (link.closest('.drop-down')) return;
      setMenuState(false);
    });
  });
}

document.addEventListener('click', (e) => {
  if (!linksMenu || !navbarToggler) return;
  if (!linksMenu.contains(e.target) && !navbarToggler.contains(e.target)) {
    setMenuState(false);
  }
});

if (drop_down_btn && drop_down_list) {
  const setDropdownState = (isOpen) => {
    drop_down_list.classList.toggle('active', isOpen);
    drop_down_btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    drop_down_list.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
  };

  setDropdownState(false);

  drop_down_btn.addEventListener('click', () => {
    const isOpen = drop_down_list.classList.contains('active');
    setDropdownState(!isOpen);
  });

  document.addEventListener('click', (e) => {
    if (
      !drop_down_list.contains(e.target) &&
      !drop_down_btn.contains(e.target)
    ) {
      setDropdownState(false);
    }
  });
}

// Navbar scroll effect
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  });
}

// ============================================
// BACK TO TOP BUTTON WITH SMOOTH ANIMATION
// ============================================
const backToTopBtn = document.getElementById('myBtn');

if (backToTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.style.opacity = '1';
      backToTopBtn.style.pointerEvents = 'auto';
    } else {
      backToTopBtn.style.opacity = '0';
      backToTopBtn.style.pointerEvents = 'none';
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}

// ============================================
// GLOBAL SMOOTH SCROLL FALLBACK
// ============================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    // Skip if handled by page-specific script (index.js)
    if (document.body.classList.contains('premium-home')) {
      return;
    }

    e.preventDefault();
    const target = document.querySelector(href);
  });
});

// ============================================
// ENHANCED ACCESSIBILITY
// ============================================
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
const scrollRevealElements = document.querySelectorAll(
  '.course-card, .post-card, .feature-tile, .journey-step, .most-course-card'
);

// ============================================
// MOUSE POSITION TRACKING FOR PARALLAX
// ============================================
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// FAQ loader

const faqAccordions = document.querySelectorAll('.faq-accordion[data-faq-url]');

faqAccordions.forEach((accordion, accordionIndex) => {
  const dataUrl = accordion.dataset.faqUrl;
  if (!dataUrl) return;

  if (!accordion.id) {
    accordion.id = `faqAccordion-${accordionIndex + 1}`;
  }

  const section = accordion.closest('section') || accordion.parentElement;
  const titleEl = section ? section.querySelector('[data-faq-title]') : null;
  const subtitleEl = section
    ? section.querySelector('[data-faq-subtitle]')
    : null;
  const emptyEl = section ? section.querySelector('[data-faq-empty]') : null;

  const openFirst = accordion.dataset.faqOpenFirst === 'true';

  const buildFaqItem = (item, index) => {
    const isOpen = openFirst && index === 0;
    const question = item.question || item.title || `???? ${index + 1}`;
    const answer = item.answer || item.content || '';

    const headingId = `faqHeading-${accordionIndex}-${index}`;
    const collapseId = `faqCollapse-${accordionIndex}-${index}`;

    const accordionItem = document.createElement('div');
    accordionItem.className = 'accordion-item';

    const header = document.createElement('h2');
    header.className = 'accordion-header';
    header.id = headingId;

    const button = document.createElement('button');
    button.className = `accordion-button${isOpen ? '' : ' collapsed'}`;
    button.type = 'button';
    button.setAttribute('data-bs-toggle', 'collapse');
    button.setAttribute('data-bs-target', `#${collapseId}`);
    button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    button.setAttribute('aria-controls', collapseId);
    button.textContent = question;

    const collapse = document.createElement('div');
    collapse.id = collapseId;
    collapse.className = `accordion-collapse collapse${isOpen ? ' show' : ''}`;
    collapse.setAttribute('aria-labelledby', headingId);
    collapse.setAttribute('data-bs-parent', `#${accordion.id}`);

    const body = document.createElement('div');
    body.className = 'accordion-body';
    body.textContent = answer;

    header.appendChild(button);
    collapse.appendChild(body);
    accordionItem.appendChild(header);
    accordionItem.appendChild(collapse);

    return accordionItem;
  };

  const renderFaq = (items) => {
    accordion.innerHTML = '';
    const fragment = document.createDocumentFragment();
    items.forEach((item, index) => {
      fragment.appendChild(buildFaqItem(item, index));
    });
    accordion.appendChild(fragment);
  };

  fetch(dataUrl)
    .then((res) => {
      if (!res.ok) throw new Error('Failed to load faq data');
      return res.json();
    })
    .then((data) => {
      const items = Array.isArray(data) ? data : data.items;

      if (titleEl && data && data.title) {
        titleEl.textContent = data.title;
      }
      if (subtitleEl && data && data.subtitle) {
        subtitleEl.textContent = data.subtitle;
      }

      if (!Array.isArray(items) || items.length === 0) {
        if (emptyEl) {
          emptyEl.textContent = '?? ???? ????? ????? ??????.';
        }
        return;
      }

      if (emptyEl) {
        emptyEl.textContent = '';
      }

      renderFaq(items);
    })
    .catch(() => {
      if (emptyEl) {
        emptyEl.textContent = '???? ????? ??????? ??????? ??????.';
      }
    });
});

// scroll to top
