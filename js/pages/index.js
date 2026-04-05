// Index Page
// search

const searchInput = document.getElementById('search-input');

if (searchInput) {
  let searchTimeout;
  searchInput.addEventListener('keyup', function () {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const query = this.value.trim();
      const results = document.getElementById('search-results');

      if (!query) {
        if (results) {
          results.innerHTML = '';
          results.style.display = 'none';
        }
        return;
      }

      fetch(`/search/?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          if (!results) return;
          results.innerHTML = '';

          data.forEach((item) => {
            results.innerHTML += `
<div class="result-item">
${item.title}
</div>
`;
          });

          results.style.display = 'block';
        });
    }, 250);
  });
}

// home latest posts (first 3 from blog JSON)

const homeLatestPosts = document.getElementById('homeLatestPosts');

if (homeLatestPosts) {
  const blogDataUrl = 'data/blog-data.json';

  const resolveImagePath = (image) => {
    if (!image) return 'img/hero.webp';
    if (/^https?:\/\//i.test(image)) return image;
    return image;
  };

  const renderMessage = (message) => {
    homeLatestPosts.innerHTML = `
<div class="col-12 text-center text-secondary py-4">${message}</div>
`;
  };

  const buildHomePost = (post) => {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6';

    const tag = post.tag || '';
    const tagHtml = tag ? `<span class="post-tag">${tag}</span>` : '';
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
      if (window.applyAosAttributes) {
        window.applyAosAttributes();
      }
      if (window.AOS) {
        window.AOS.refreshHard();
      }
    })
    .catch(() => {
      renderMessage('تعذّر تحميل المقالات الآن.');
    });
}
