(() => {
  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const supportsHover =
    window.matchMedia && window.matchMedia('(hover: hover)').matches;

  const isMotionAllowed = !prefersReducedMotion;

  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const homeLatestPosts = document.getElementById('homeLatestPosts');

  const CARD_SELECTOR =
    '.course-card, .feature-tile, .post-card, .most-course-card, .all-coursers, .journey-step';

  const markCinematicCards = (scope = document) => {
    scope.querySelectorAll(CARD_SELECTOR).forEach((card) => {
      card.classList.add('cinematic-card');
    });
  };

  const setupCardTilt = (scope = document) => {
    scope
      .querySelectorAll(`${CARD_SELECTOR}.cinematic-card`)
      .forEach((card) => {
        if (card.dataset.tiltBound === 'true') return;
        card.dataset.tiltBound = 'true';

        card.addEventListener('pointerenter', () => {
          card.classList.add('is-active-tilt');
          card.style.setProperty('--card-glow-opacity', '1');
        });

        card.addEventListener('pointermove', (event) => {
          const rect = card.getBoundingClientRect();
          if (!rect.width || !rect.height) return;

          const px = ((event.clientX - rect.left) / rect.width) * 100;
          const py = ((event.clientY - rect.top) / rect.height) * 100;

          const rotateX = ((py - 50) / 50) * -6.5;
          const rotateY = ((px - 50) / 50) * 7.5;

          setRX(`${rotateX.toFixed(2)}deg`);
          setRY(`${rotateY.toFixed(2)}deg`);
          setGX(`${px.toFixed(2)}%`);
          setGY(`${py.toFixed(2)}%`);
        });
      });

    const splitHeroTitleWords = () => {
      const title = document.querySelector('.hero-title');
      if (!title || title.dataset.wordsSplit === 'true') return [];

      const text = title.textContent.replace(/\s+/g, ' ').trim();
      if (!text) return [];

      title.textContent = '';

      text.split(' ').forEach((word, index, words) => {
        const wrap = document.createElement('span');
        wrap.className = 'hero-word-wrap';

        const span = document.createElement('span');
        span.className = 'hero-word';
        span.textContent = word;

        wrap.appendChild(span);
        title.appendChild(wrap);

        if (index < words.length - 1) {
          title.appendChild(document.createTextNode(' '));
        }
      });

      title.dataset.wordsSplit = 'true';
      return Array.from(title.querySelectorAll('.hero-word'));
    };

    const smoothScrollTo = (targetY, duration = 820) => {
      const startY = window.pageYOffset;
      const distance = targetY - startY;
      const startTime = performance.now();

      if (!isMotionAllowed || Math.abs(distance) < 2) {
        window.scrollTo(0, targetY);
        return;
      }

      const easeInOut = (t) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const tick = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeInOut(progress);
        window.scrollTo(0, startY + distance * eased);
        if (progress < 1) {
          window.requestAnimationFrame(tick);
        }
      };

      window.requestAnimationFrame(tick);
    };

    const setupSmoothAnchorScroll = () => {
      const anchors = document.querySelectorAll(
        'a[href^="#"], a[href*="index.html#"]'
      );
      if (!anchors.length) return;

      const nav = document.querySelector('.premium-navbar');

      anchors.forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
          const href = anchor.getAttribute('href');
          if (!href) return;

          const hashIndex = href.indexOf('#');
          if (hashIndex === -1) return;

          const hash = href.slice(hashIndex);
          if (!hash || hash === '#') return;

          const target = document.querySelector(hash);
          if (!target) return;

          event.preventDefault();
          const navOffset = nav ? nav.offsetHeight + 14 : 12;
          const targetY =
            target.getBoundingClientRect().top + window.pageYOffset - navOffset;

          smoothScrollTo(Math.max(0, targetY));
        });
      });
    };

    const setupSearch = () => {
      if (!searchInput || !searchResults) return;

      let searchTimeout;

      const hideResults = () => {
        searchResults.innerHTML = '';
        searchResults.style.display = 'none';
      };

      const renderResults = (items) => {
        if (!Array.isArray(items) || items.length === 0) {
          hideResults();
          return;
        }

        searchResults.innerHTML = '';
        const fragment = document.createDocumentFragment();

        items.forEach((item) => {
          const entry = document.createElement('div');
          entry.className = 'result-item';
          entry.textContent = item.title || '';

          if (item.url) {
            entry.addEventListener('click', () => {
              window.location.href = item.url;
            });
          }

          fragment.appendChild(entry);
        });

        searchResults.appendChild(fragment);
        searchResults.style.display = 'block';
      };

      searchInput.addEventListener('keyup', function handleSearch() {
        const query = this.value.trim();
        clearTimeout(searchTimeout);

        if (!query) {
          hideResults();
          return;
        }

        searchTimeout = window.setTimeout(() => {
          fetch(`/search/?q=${encodeURIComponent(query)}`)
            .then((res) => {
              if (!res.ok) throw new Error('Search fetch failed');
              return res.json();
            })
            .then((data) => {
              renderResults(data);
            })
            .catch(() => {
              hideResults();
            });
        }, 250);
      });

      document.addEventListener('click', (event) => {
        if (
          !searchResults.contains(event.target) &&
          event.target !== searchInput
        ) {
          hideResults();
        }
      });
    };

    const setupLatestPosts = () => {
      if (!homeLatestPosts) return;

      const blogDataUrl = 'data/blog-data.json';

      const resolveImagePath = (image) => {
        if (!image) return 'img/hero.webp';
        if (/^https?:\/\//i.test(image)) return image;
        return image;
      };

      const renderMessage = (message) => {
        homeLatestPosts.innerHTML = `<div class="col-12 text-center text-secondary py-4">${message}</div>`;
      };

      const buildHomePost = (post) => {
        const col = document.createElement('div');
        col.className = 'col-lg-4 col-md-6';

        const tag = post.tag || '';
        const tagHtml = tag
          ? `<span class="most-course-tag">${tag}</span>`
          : '';
        const dateText = post.dateLabel || post.date || '';
        const readTime = post.readTime
          ? `<span><i class="fa-solid fa-clock"></i> ${post.readTime}</span>`
          : '';
        const imageSrc = resolveImagePath(post.image);
        const imageAlt = post.imageAlt || post.title || 'مقال من المدونة';
        const link = post.url || 'blog.html';
        const isExternal = /^https?:\/\//i.test(link);
        const linkAttrs = isExternal
          ? ' target="_blank" rel="noopener noreferrer"'
          : '';

        col.innerHTML = `
<article class="post-card card h-100">
  <div class="post-media">
    <img src="${imageSrc}" alt="${imageAlt}" loading="lazy" decoding="async">
    ${tagHtml}
  </div>
  <div class="post-body card-body">
    <h5>${post.title || ''}</h5>
    <p>${post.excerpt || ''}</p>
    <div class="post-meta">
      <span><i class="fa-solid fa-calendar"></i> ${dateText}</span>
      ${readTime}
    </div>
    <a href="${link}" class="post-btn"${linkAttrs}>اقرأ المقال</a>
  </div>
</article>
`;

        return col;
      };

      fetch(blogDataUrl)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to load blog data');
          return res.json();
        })
        .then((data) => {
          const posts = Array.isArray(data) ? data : data.posts;

          if (!Array.isArray(posts) || posts.length === 0) {
            renderMessage('لا توجد مقالات الآن.');
            return;
          }

          const topPosts = posts.slice(0, 3);
          homeLatestPosts.innerHTML = '';

          const fragment = document.createDocumentFragment();
          topPosts.forEach((post) => {
            fragment.appendChild(buildHomePost(post));
          });

          homeLatestPosts.appendChild(fragment);

          markCinematicCards(homeLatestPosts);
          setupCardTilt(homeLatestPosts);
          setupMagneticButtons(homeLatestPosts);
          animateLatestPosts();
        })
        .catch(() => {
          renderMessage('تعذّر تحميل المقالات الآن.');
        });
    };

    markCinematicCards(document);
    setupCardTilt(document);
    setupMagneticButtons(document);

    setupSearch();
    setupSmoothAnchorScroll();
    setupLatestPosts();
  };
})();
