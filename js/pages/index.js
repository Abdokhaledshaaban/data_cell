(() => {
  const isMobile = window.innerWidth < 768;

  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const homeLatestPosts = document.getElementById('homeLatestPosts');

  const CARD_SELECTOR =
    '.course-card, .feature-tile, .post-card, .most-course-card, .all-coursers, .journey-step';

  /* =========================
     LAZY LOAD IMAGES
  ========================= */
  const setupLazyImages = (scope = document) => {
    const imgs = scope.querySelectorAll('img[data-src]');

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        obs.unobserve(img);
      });
    });

    imgs.forEach((img) => observer.observe(img));
  };

  /* =========================
     SCROLL REVEAL (Intersection Observer)
  ========================= */
  const setupScrollReveal = () => {
    const items = document.querySelectorAll(CARD_SELECTOR);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: isMobile ? 0.1 : 0.2,
      }
    );

    items.forEach((el) => {
      el.classList.add('reveal');
      observer.observe(el);
    });
  };

  /* =========================
     BLOG LOADING (FIXED 100%)
  ========================= */
  const setupLatestPosts = async () => {
    if (!homeLatestPosts) return;

    try {
      const res = await fetch('data/blog-data.json');
      if (!res.ok) throw new Error('Fetch failed');

      const data = await res.json();
      const posts = Array.isArray(data) ? data : data.posts;

      if (!Array.isArray(posts)) throw new Error('Invalid data');

      homeLatestPosts.innerHTML = '';

      const fragment = document.createDocumentFragment();

      posts.slice(0, 3).forEach((post) => {
        const col = document.createElement('div');
        col.className = 'col-lg-4 col-md-6';

        const imageSrc = post.image || 'img/hero.webp';
        const imageAlt = post.imageAlt || post.title || '';
        const tagHtml = post.tag
          ? `<span class="most-course-tag">${post.tag}</span>`
          : '';

        const dateText = post.dateLabel || post.date || '';
        const link = post.url || '#';
        const isExternal = /^https?:\/\//i.test(link);
        const linkAttrs = isExternal
          ? ' target="_blank" rel="noopener noreferrer"'
          : '';

        col.innerHTML = `
          <article class="post-card card h-100 reveal">
            <div class="post-media">
              <img 
                src="${imageSrc}" 
                alt="${imageAlt}" 
                loading="lazy"
                decoding="async"
              >
              ${tagHtml}
            </div>

            <div class="post-body card-body">
              <h5>${post.title || ''}</h5>
              <p>${post.excerpt || ''}</p>

              <div class="post-meta">
                <span>
                  <i class="fa-solid fa-calendar"></i> ${dateText}
                </span>
              </div>

              <a href="${link}" class="post-btn"${linkAttrs}>
                اقرأ المقال
              </a>
            </div>
          </article>
        `;

        fragment.appendChild(col);
      });

      homeLatestPosts.appendChild(fragment);

      setupLazyImages(homeLatestPosts);
      setupScrollReveal();
    } catch (err) {
      console.error(err);
      homeLatestPosts.innerHTML = `<div class="text-center text-secondary py-4">تعذر تحميل المقالات</div>`;
    }
  };

  /* =========================
    INIT
  ========================= */
  const init = () => {
    setupLatestPosts();
  };

  init();
})();
