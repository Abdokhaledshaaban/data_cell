// Blog Page
// blog pagination + data loading

const blogPostsContainer = document.getElementById('blogPosts');
const blogPagination = document.getElementById('blogPagination');
const blogPrev = document.getElementById('blogPrev');
const blogNext = document.getElementById('blogNext');
const blogFeaturedTitle = document.getElementById('blogFeaturedTitle');
const blogFeaturedExcerpt = document.getElementById('blogFeaturedExcerpt');
const blogFeaturedDate = document.getElementById('blogFeaturedDate');
const blogFeaturedLink = document.getElementById('blogFeaturedLink');

if (blogPostsContainer && blogPagination) {
  const pageSize = 8;
  let currentPage = 1;
  let postItems = [];
  const paginationWrap = blogPagination.closest('.blog-pagination-wrap');
  const paginationBar = blogPagination.closest('.blog-pagination');
  const blogDataUrl = 'data/blog-data.json';

  const resolveImagePath = (image) => {
    if (!image) return 'img/hero.webp';
    if (/^https?:\/\//i.test(image)) return image;
    return image;
  };

  const setFeatured = (featured) => {
    if (!featured) return;

    if (blogFeaturedTitle) {
      blogFeaturedTitle.textContent = featured.title || '';
    }
    if (blogFeaturedExcerpt) {
      blogFeaturedExcerpt.textContent = featured.excerpt || '';
    }
    if (blogFeaturedDate) {
      blogFeaturedDate.textContent = featured.dateLabel || featured.date || '';
    }
    if (blogFeaturedLink) {
      const link = featured.url || '#latest';
      const isExternal = /^https?:\/\//i.test(link);
      blogFeaturedLink.href = link;
      if (isExternal) {
        blogFeaturedLink.target = '_blank';
        blogFeaturedLink.rel = 'noopener noreferrer';
      } else {
        blogFeaturedLink.removeAttribute('target');
        blogFeaturedLink.removeAttribute('rel');
      }
    }
  };

  const buildPostItem = (post) => {
    const col = document.createElement('div');
    col.className = 'col-lg-3 col-md-6 blog-post-item';

    const tag = post.tag || '';
    const tagHtml = tag ? `<span class="post-tag">${tag}</span>` : '';
    const dateText = post.dateLabel || post.date || '';
    const imageSrc = resolveImagePath(post.image);
    const imageAlt = post.imageAlt || post.title || 'مقال من المدونة';
    const link = post.url || '#latest';
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
    </div>
    <a href="${link}" class="post-btn"${linkAttrs}>اقرأ المقال</a>
  </div>
</article>
`;

    return col;
  };

  const renderPage = () => {
    if (postItems.length === 0) return;
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;

    postItems.forEach((item, index) => {
      item.style.display = index >= start && index < end ? '' : 'none';
    });
  };

  const createNumberItem = (page) => {
    const li = document.createElement('li');
    li.className = 'page-item';

    if (page === currentPage) {
      li.classList.add('active');
      li.setAttribute('aria-current', 'page');
      const span = document.createElement('span');
      span.className = 'page-link';
      span.textContent = page;
      li.appendChild(span);
      return li;
    }

    const link = document.createElement('a');
    link.className = 'page-link';
    link.href = '#';
    link.dataset.page = page;
    link.textContent = page;
    li.appendChild(link);
    return li;
  };

  const updatePrevNext = (totalPages) => {
    if (!blogPrev || !blogNext) return;

    const prevDisabled = totalPages <= 1 || currentPage === 1;
    const nextDisabled = totalPages <= 1 || currentPage === totalPages;

    blogPrev.classList.toggle('disabled', prevDisabled);
    blogPrev.setAttribute('aria-disabled', prevDisabled ? 'true' : 'false');
    if (prevDisabled) {
      blogPrev.removeAttribute('data-page');
    } else {
      blogPrev.dataset.page = String(currentPage - 1);
    }

    blogNext.classList.toggle('disabled', nextDisabled);
    blogNext.setAttribute('aria-disabled', nextDisabled ? 'true' : 'false');
    if (nextDisabled) {
      blogNext.removeAttribute('data-page');
    } else {
      blogNext.dataset.page = String(currentPage + 1);
    }
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(postItems.length / pageSize);

    if (paginationWrap) {
      paginationWrap.style.display = totalPages <= 1 ? 'none' : '';
    }

    blogPagination.innerHTML = '';
    if (totalPages <= 1) {
      updatePrevNext(totalPages);
      return;
    }

    for (let page = 1; page <= totalPages; page++) {
      blogPagination.appendChild(createNumberItem(page));
    }

    updatePrevNext(totalPages);
  };

  const handlePaginationClick = (event) => {
    const target = event.target.closest('[data-page]');
    if (!target) return;

    event.preventDefault();
    const nextPage = Number(target.dataset.page);
    if (!nextPage || nextPage === currentPage) return;

    currentPage = nextPage;
    renderPage();
    renderPagination();
    blogPostsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const renderMessage = (message) => {
    blogPostsContainer.innerHTML = `
<div class="col-12 text-center text-secondary py-5">${message}</div>
`;
    postItems = [];
    if (paginationWrap) {
      paginationWrap.style.display = 'none';
    }
  };

  const loadPosts = () => {
    fetch(blogDataUrl)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load blog data');
        return res.json();
      })
      .then((data) => {
        const posts = Array.isArray(data) ? data : data.posts;
        setFeatured(data.featured);

        if (!Array.isArray(posts) || posts.length === 0) {
          renderMessage('لا توجد مقالات الآن.');
          return;
        }

        blogPostsContainer.innerHTML = '';
        const fragment = document.createDocumentFragment();
        posts.forEach((post) => {
          fragment.appendChild(buildPostItem(post));
        });
        blogPostsContainer.appendChild(fragment);
        postItems = Array.from(
          blogPostsContainer.querySelectorAll('.blog-post-item')
        );
        if (window.applyAosAttributes) {
          window.applyAosAttributes();
        }
        if (window.AOS) {
          window.AOS.refreshHard();
        }
        currentPage = 1;
        renderPage();
        renderPagination();
      })
      .catch(() => {
        renderMessage('تعذّر تحميل المقالات الآن.');
      });
  };

  if (paginationBar) {
    paginationBar.addEventListener('click', handlePaginationClick);
  } else {
    blogPagination.addEventListener('click', handlePaginationClick);
  }

  loadPosts();
}
