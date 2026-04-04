let darkmode = localStorage.getItem('darkmode');
const themeSwitch = document.getElementById('theme-switch');

function enabledarkmode() {
  document.body.classList.add('darkmode');
  localStorage.setItem('darkmode', 'active');
}

function disabledarkmode() {
  document.body.classList.remove('darkmode');
  localStorage.setItem('darkmode', null);
}

if (darkmode === 'active') enabledarkmode();

themeSwitch.addEventListener('click', () => {
  darkmode = localStorage.getItem('darkmode');
  darkmode !== 'active' ? enabledarkmode() : disabledarkmode();
});

const navbarToggler = document.querySelector('.navbar-toggler');
const linksMenu = document.getElementById('links');
const nav_close = document.querySelector('.nav-close');
const drop_down_btn = document.querySelector('.drop-down');
const drop_down_list = document.querySelector('.drop-down-list');

// فتح / غلق عند الضغط على الهامبرغر
navbarToggler.addEventListener('click', () => {
  linksMenu.classList.toggle('show');
});

nav_close.addEventListener('click', () => {
  linksMenu.classList.toggle('show');
});

linksMenu.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    if (link.closest('.drop-down')) return;

    linksMenu.classList.remove('show');
  });
});

// غلق عند الضغط خارج القائمة
document.addEventListener('click', (e) => {
  if (!linksMenu.contains(e.target) && !navbarToggler.contains(e.target)) {
    linksMenu.classList.remove('show');
  }
});

drop_down_btn.addEventListener('click', () => {
  drop_down_list.classList.toggle('active');
});

document.addEventListener('click', (e) => {
  if (!drop_down_list.contains(e.target) && !drop_down_btn.contains(e.target)) {
    drop_down_list.classList.remove('active');
  }
});

function moveLoginButton() {
  const loginBtn = document.querySelector('.login-btn');
  const linksMenu = document.getElementById('links');
  const loginMobile = document.querySelector('.login-mobile a');

  if (window.innerWidth <= 991) {
    // Move button to sidebar
    loginMobile.textContent = loginBtn.textContent;
    loginMobile.parentElement.style.display = 'block';
    loginBtn.style.display = 'none';
  } else {
    // Move button back to navbar
    loginBtn.style.display = 'flex';
    loginMobile.parentElement.style.display = 'none';
  }
}

// Initial check
moveLoginButton();

// Update on resize
window.addEventListener('resize', moveLoginButton);

// search

const searchInput = document.getElementById('search-input');

if (searchInput) {
  searchInput.addEventListener('keyup', function () {
    fetch(`/search/?q=${this.value}`)
      .then((res) => res.json())
      .then((data) => {
        let results = document.getElementById('search-results');

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
  });
}

// scroll to top

const topBtn = document.getElementById('myBtn');

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

if (topBtn) {
  const toggleTopBtn = () => {
    topBtn.style.display = window.scrollY > 200 ? 'block' : 'none';
  };

  window.addEventListener('scroll', toggleTopBtn);
  topBtn.addEventListener('click', scrollToTop);
  toggleTopBtn();
}

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
    if (!image) return 'img/hero.png';
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

// home latest posts (first 3 from blog JSON)

const homeLatestPosts = document.getElementById('homeLatestPosts');

if (homeLatestPosts) {
  const blogDataUrl = 'data/blog-data.json';

  const resolveImagePath = (image) => {
    if (!image) return 'img/hero.png';
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
    })
    .catch(() => {
      renderMessage('تعذّر تحميل المقالات الآن.');
    });
}

const container = document.getElementById('videosContainer');
const modal = document.getElementById('videoModal');
const frame = document.getElementById('videoFrame');
const close = document.querySelector('.close');

const closeVideoModal = () => {
  if (!modal || !frame) return;
  modal.style.display = 'none';
  frame.src = '';
};

if (close) {
  close.addEventListener('click', closeVideoModal);
}

if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeVideoModal();
    }
  });
}

if (
  container &&
  modal &&
  frame &&
  close &&
  !document.getElementById('videosPagination')
) {
  fetch('data/random-videos.json')
    .then((res) => res.json())
    .then((data) => {
      data.forEach((video) => {
        const card = document.createElement('div');

        card.className = 'col-lg-3 col-md-6 mb-4';

        card.innerHTML = `
    
      <div class="course-card">

        <div class="img-container">
          <img src="${video.thumbnail}" class="course-img" alt="${video.title}" loading="lazy" decoding="async">
        </div>

        <div class="course-content">

          <h5 class="course-title">${video.title}</h5>

          <p class="course-desc">
            ${video.desc}
          </p>

        </div>

      </div>
      
    `;

        card.onclick = function () {
          frame.src = video.video;

          modal.style.display = 'flex';
        };

        container.appendChild(card);
      });
    });
}

const video_container = document.getElementById('videosContainer');
const video_modal = document.getElementById('videoModal');
const video_frame = document.getElementById('videoFrame');

const videosPagination = document.getElementById('videosPagination');
const videosPrev = document.getElementById('videosPrev');
const videosNext = document.getElementById('videosNext');

if (video_container && videosPagination) {
  const pageSize = 8;
  let currentPage = 1;
  let videoItems = [];

  fetch('data/random-videos.json')
    .then((res) => res.json())
    .then((data) => {
      video_container.innerHTML = '';

      const fragment = document.createDocumentFragment();

      data.forEach((video) => {
        const col = document.createElement('div');
        col.className = 'col-lg-3 col-md-6 mb-4 video-item';

        col.innerHTML = `

<div class="course-card">

  <div class="img-container">
    <img src="${video.thumbnail}" class="course-img" alt="${video.title}" loading="lazy" decoding="async">
  </div>

  <div class="course-content">

    <h5 class="course-title">${video.title}</h5>

    <p class="course-desc">${video.desc || ''}</p>

  </div>

</div>
`;

        col.onclick = () => {
          video_frame.src = video.video;
          video_modal.style.display = 'flex';
        };

        fragment.appendChild(col);
      });

      video_container.appendChild(fragment);

      videoItems = Array.from(video_container.querySelectorAll('.video-item'));

      renderVideos();
      renderPagination();
    });

  function renderVideos() {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;

    videoItems.forEach((item, index) => {
      item.style.display = index >= start && index < end ? '' : 'none';
    });
  }

  function renderPagination() {
    const totalPages = Math.ceil(videoItems.length / pageSize);

    videosPagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement('li');
      li.className = 'page-item';

      if (i === currentPage) li.classList.add('active');

      li.innerHTML = `
<a class="page-link" href="#" data-page="${i}">
${i}
</a>
`;

      videosPagination.appendChild(li);
    }

    videosPrev.classList.toggle('disabled', currentPage === 1);
    videosNext.classList.toggle('disabled', currentPage === totalPages);
  }

  // بعد renderPagination() و renderVideos()
  videosPrev.addEventListener('click', function (e) {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      renderVideos();
      renderPagination();
      video_container.scrollIntoView({ behavior: 'smooth' });
    }
  });

  videosNext.addEventListener('click', function (e) {
    e.preventDefault();
    const totalPages = Math.ceil(videoItems.length / pageSize);
    if (currentPage < totalPages) {
      currentPage++;
      renderVideos();
      renderPagination();
      video_container.scrollIntoView({ behavior: 'smooth' });
    }
  });

  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-page]');

    if (!target) return;

    e.preventDefault();

    const page = Number(target.dataset.page);

    if (!page || page === currentPage) return;

    currentPage = page;

    renderVideos();
    renderPagination();

    video_container.scrollIntoView({ behavior: 'smooth' });
  });
}

// projects library

const projectsGrid = document.getElementById('projectsGrid');
const projectFilters = document.getElementById('projectFilters');
const projectSearch = document.getElementById('projectSearch');
const projectsEmpty = document.getElementById('projectsEmpty');
const projectsCount = document.getElementById('projectsCount');
const projectsCategories = document.getElementById('projectsCategories');
const projectsFiles = document.getElementById('projectsFiles');
const projectsUpdated = document.getElementById('projectsUpdated');

if (projectsGrid) {
  const projectsDataUrl = 'data/projects.json';
  let allProjects = [];
  let activeFilter = 'all';

  const normalizeText = (value) => (value || '').toString().toLowerCase();

  const buildProjectCard = (project) => {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6 project-item';

    const accent = project.accent || '#2563eb';
    const tools = Array.isArray(project.tools) ? project.tools : [];
    const category = project.category || '';
    const tags = Array.from(
      new Set([category, ...tools].filter((tag) => tag && tag.trim()))
    );

    const fileName = project.file || '';
    const fileUrl =
      project.fileUrl || (fileName ? `project_files/${fileName}` : '#');
    const downloadAttr = fileName ? 'download' : '';

    const level = project.level
      ? `<span><i class="fa-solid fa-layer-group"></i> ${project.level}</span>`
      : '';
    const duration = project.duration
      ? `<span><i class="fa-solid fa-clock"></i> ${project.duration}</span>`
      : '';
    const size = project.size
      ? `<span><i class="fa-solid fa-database"></i> ${project.size}</span>`
      : '';

    const iconClass = project.icon || 'fa-file-excel';

    const tagsHtml = tags.length
      ? `<div class="project-tags">${tags
          .map((tag) => `<span>${tag}</span>`)
          .join('')}</div>`
      : '';

    col.innerHTML = `
<article class="project-file-card h-100" style="--project-accent: ${accent};">
  <div class="project-file-top">
    <div class="project-file-icon">
      <i class="fa-solid ${iconClass}"></i>
    </div>
    <div class="project-file-title">
      <h3>${project.title || ''}</h3>
      <p>${project.description || ''}</p>
    </div>
  </div>
  <div class="project-file-meta">
    ${level}
    ${duration}
    ${size}
  </div>
  ${tagsHtml}
  <div class="project-file-actions">
    <a class="btn btn-primary" href="${fileUrl}" ${downloadAttr}>تحميل الملف</a>
    <a class="btn btn-outline-primary" href="#download-guide">طريقة الاستخدام</a>
  </div>
</article>
`;

    return col;
  };

  const renderProjects = (items) => {
    projectsGrid.innerHTML = '';

    if (!items.length) {
      if (projectsEmpty) {
        projectsEmpty.textContent = 'لا توجد مشاريع مطابقة للبحث حالياً.';
      }
      return;
    }

    if (projectsEmpty) {
      projectsEmpty.textContent = '';
    }

    const fragment = document.createDocumentFragment();
    items.forEach((project) => {
      fragment.appendChild(buildProjectCard(project));
    });
    projectsGrid.appendChild(fragment);
  };

  const applyFilters = () => {
    const query = projectSearch ? normalizeText(projectSearch.value) : '';

    const filtered = allProjects.filter((project) => {
      const matchesFilter =
        activeFilter === 'all' ||
        normalizeText(project.category) === normalizeText(activeFilter);

      const searchText = normalizeText(
        [
          project.title,
          project.description,
          project.level,
          project.category,
          ...(project.tools || []),
        ].join(' ')
      );

      const matchesSearch = !query || searchText.includes(query);
      return matchesFilter && matchesSearch;
    });

    renderProjects(filtered);
  };

  const setActiveFilter = (filterValue) => {
    activeFilter = filterValue;
    if (projectFilters) {
      projectFilters.querySelectorAll('.project-filter-btn').forEach((btn) => {
        const isActive = btn.dataset.filter === filterValue;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
    }
    applyFilters();
  };

  const buildFilters = (categories) => {
    if (!projectFilters) return;

    projectFilters.innerHTML = '';
    const filterValues = ['الكل', ...categories];

    filterValues.forEach((label, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `project-filter-btn${index === 0 ? ' active' : ''}`;
      btn.dataset.filter = label === 'الكل' ? 'all' : label;
      btn.textContent = label;
      btn.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
      projectFilters.appendChild(btn);
    });
  };

  const updateStats = (data, projects) => {
    if (projectsCount) {
      projectsCount.textContent = projects.length;
    }

    const categories = Array.from(
      new Set(projects.map((project) => project.category).filter(Boolean))
    );

    if (projectsCategories) {
      projectsCategories.textContent = categories.length;
    }

    if (projectsFiles) {
      projectsFiles.textContent = projects.length;
    }

    const updated = data && (data.updated || data.lastUpdated);
    if (projectsUpdated && updated) {
      const date = new Date(updated);
      if (!Number.isNaN(date.getTime())) {
        projectsUpdated.textContent = `آخر تحديث: ${date.toLocaleDateString(
          'ar-EG',
          {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }
        )}`;
      } else {
        projectsUpdated.textContent = `آخر تحديث: ${updated}`;
      }
    }
  };

  if (projectSearch) {
    projectSearch.addEventListener('input', applyFilters);
  }

  if (projectFilters) {
    projectFilters.addEventListener('click', (event) => {
      const button = event.target.closest('.project-filter-btn');
      if (!button) return;
      setActiveFilter(button.dataset.filter || 'all');
    });
  }

  fetch(projectsDataUrl)
    .then((res) => {
      if (!res.ok) throw new Error('Failed to load projects data');
      return res.json();
    })
    .then((data) => {
      const projects = Array.isArray(data) ? data : data.projects;
      if (!Array.isArray(projects) || projects.length === 0) {
        if (projectsEmpty) {
          projectsEmpty.textContent = 'لا توجد مشاريع متاحة حالياً.';
        }
        return;
      }

      allProjects = projects;
      const categories = Array.from(
        new Set(projects.map((project) => project.category).filter(Boolean))
      );
      buildFilters(categories);
      updateStats(data, projects);
      renderProjects(projects);
    })
    .catch(() => {
      if (projectsEmpty) {
        projectsEmpty.textContent = 'تعذر تحميل المشاريع حالياً.';
      }
    });
}

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

// quiz

const quizData = {
  excel: {
    title: 'اختبار Excel',
    subtitle: 'أسئلة مركزة على الدوال، المراجع، والجداول المحورية.',
    level: 'مبتدئ - متوسط',
    time: '12 دقيقة',
    accent: '#16a34a',
    questions: [
      {
        q: 'ما وظيفة الدالة SUMIFS في Excel؟',
        options: [
          'تجمع القيم بشرط واحد فقط',
          'تجمع القيم بناءً على عدة شروط',
          'تحسب المتوسط لقائمة قيم',
          'تجمع القيم النصية فقط',
        ],
        answer: 1,
        explain: 'SUMIFS بتجمع القيم مع إمكانية تحديد أكثر من شرط.',
      },
      {
        q: 'مرجع الخلية $A$1 يعني أن المرجع:',
        options: [
          'نسبي للصف والعمود',
          'ثابت للصف والعمود',
          'ثابت للصف فقط',
          'ثابت للعمود فقط',
        ],
        answer: 1,
        explain: 'علامة $ تثبت العمود والصف معًا.',
      },
      {
        q: 'أفضل أداة لتلخيص البيانات بسرعة هي:',
        options: [
          'Conditional Formatting',
          'Pivot Table',
          'Data Validation',
          'Text to Columns',
        ],
        answer: 1,
        explain: 'Pivot Table بتلخص وتعرض البيانات في ثواني.',
      },
      {
        q: 'أي نوع مخطط مناسب لمقارنة القيم بين فئات مختلفة؟',
        options: ['Line Chart', 'Pie Chart', 'Column Chart', 'Scatter Plot'],
        answer: 2,
        explain: 'Column Chart واضح جدًا لمقارنة الفئات.',
      },
    ],
  },
  powerbi: {
    title: 'اختبار Power BI',
    subtitle: 'ركز على نمذجة البيانات وواجهات التقارير.',
    level: 'متوسط',
    time: '10 دقائق',
    accent: '#f59e0b',
    questions: [
      {
        q: 'الفرق الأساسي بين Measure وCalculated Column هو:',
        options: [
          'الـ Measure يتغير مع الفلترة والـ Column ثابتة',
          'الـ Column أسرع في الحساب دائمًا',
          'الـ Measure لا يستخدم DAX',
          'الـ Column تُستخدم فقط في الرسوم',
        ],
        answer: 0,
        explain: 'الـ Measure يعتمد على السياق، بينما العمود ثابت لكل صف.',
      },
      {
        q: 'أفضل مكان لإدارة العلاقات بين الجداول هو:',
        options: [
          'Data View',
          'Model View',
          'Report View',
          'Power Query Editor',
        ],
        answer: 1,
        explain: 'Model View هو المكان المخصص للعلاقات.',
      },
      {
        q: 'أداة Slicer تُستخدم لـ:',
        options: [
          'تصفية البيانات بصريًا',
          'تحويل البيانات',
          'إنشاء KPI',
          'ربط الجداول',
        ],
        answer: 0,
        explain: 'Slicer تسمح بتصفية التقارير بسهولة.',
      },
      {
        q: 'أفضل نوع علاقة بين جدول وقيم مرجعية هو:',
        options: [
          'Many-to-Many',
          'One-to-Many',
          'Many-to-One',
          'One-to-One دائمًا',
        ],
        answer: 1,
        explain: 'One-to-Many هو النموذج الأكثر استخدامًا.',
      },
    ],
  },
  powerquery: {
    title: 'اختبار Power Query',
    subtitle: 'تنضيف البيانات وتحويلها بطريقة احترافية.',
    level: 'مبتدئ - متوسط',
    time: '9 دقائق',
    accent: '#0ea5e9',
    questions: [
      {
        q: 'الخطوة المستخدمة لتغيير نوع البيانات هي:',
        options: [
          'Remove Rows',
          'Change Type',
          'Merge Queries',
          'Split Column',
        ],
        answer: 1,
        explain: 'Change Type هي الخطوة التي تحدد نوع العمود.',
      },
      {
        q: 'الفرق بين Append وMerge هو:',
        options: [
          'Append يدمج الصفوف، Merge يربط الأعمدة',
          'Merge يضيف الصفوف فقط',
          'Append يستخدم العلاقات',
          'لا يوجد فرق',
        ],
        answer: 0,
        explain: 'Append للصفوف المتشابهة، Merge للربط بين جداول.',
      },
      {
        q: 'لغة البرمجة المستخدمة في Power Query هي:',
        options: ['Python', 'DAX', 'M Language', 'SQL'],
        answer: 2,
        explain: 'Power Query يعتمد على لغة M.',
      },
      {
        q: 'أفضل خطوة لإزالة الأعمدة غير المطلوبة:',
        options: [
          'Remove Other Columns',
          'Keep Rows',
          'Group By',
          'Replace Values',
        ],
        answer: 0,
        explain: 'Remove Other Columns تسيب الأعمدة المهمة فقط.',
      },
    ],
  },
  analysis: {
    title: 'اختبار تحليل البيانات',
    subtitle: 'أساسيات التحليل الإحصائي واستخلاص الرؤى.',
    level: 'متوسط',
    time: '11 دقيقة',
    accent: '#0f766e',
    questions: [
      {
        q: 'ما معنى KPI في التحليل؟',
        options: [
          'مؤشر الأداء الرئيسي',
          'بيانات خام',
          'نوع من الرسوم البيانية',
          'خطأ في البيانات',
        ],
        answer: 0,
        explain: 'KPI هو مؤشر يقيس الأداء.',
      },
      {
        q: 'القيمة الشاذة (Outlier) هي:',
        options: [
          'قيمة في منتصف البيانات',
          'قيمة بعيدة جدًا عن باقي القيم',
          'قيمة مكررة',
          'قيمة مفقودة',
        ],
        answer: 1,
        explain: 'Outlier تختلف بشكل كبير عن نمط البيانات.',
      },
      {
        q: 'الارتباط (Correlation) يعني:',
        options: [
          'سبب ونتيجة',
          'علاقة بين متغيرين',
          'تكرار البيانات',
          'تنظيف البيانات',
        ],
        answer: 1,
        explain: 'Correlation يقيس العلاقة بين متغيرين بدون إثبات السبب.',
      },
      {
        q: 'أفضل خطوة قبل التحليل هي:',
        options: [
          'تصميم التقرير النهائي',
          'جمع البيانات وتنظيفها',
          'تحديد الألوان',
          'كتابة الاستنتاجات',
        ],
        answer: 1,
        explain: 'تنظيف البيانات خطوة أساسية قبل أي تحليل.',
      },
    ],
  },
};

const quizTitle = document.getElementById('quizTitle');
const quizSubtitle = document.getElementById('quizSubtitle');
const quizLevel = document.getElementById('quizLevel');
const quizCount = document.getElementById('quizCount');
const quizTime = document.getElementById('quizTime');
const quizTimer = document.getElementById('quizTimer');
const quizList = document.getElementById('quizList');
const quizProgress = document.getElementById('quizProgress');
const quizResult = document.getElementById('quizResult');
const quizHint = document.getElementById('quizHint');
const quizShell = document.getElementById('quizShell');
const quizStartBanner = document.getElementById('quizStartBanner');
const startQuiz = document.getElementById('startQuiz');
const submitQuiz = document.getElementById('submitQuiz');
const resetQuiz = document.getElementById('resetQuiz');
const prevQuestion = document.getElementById('prevQuestion');
const nextQuestion = document.getElementById('nextQuestion');
const topicButtons = document.querySelectorAll('.quiz-topic-btn');

const storageKey = 'datacellQuizState';

const getStoredData = () => {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : { activeTopic: 'excel', topics: {} };
  } catch (error) {
    return { activeTopic: 'excel', topics: {} };
  }
};

const setStoredData = (data) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch (error) {
    // ignore storage errors
  }
};

const getTopicState = (topicKey) => {
  const data = getStoredData();
  return data.topics && data.topics[topicKey] ? data.topics[topicKey] : null;
};

const saveState = () => {
  const data = getStoredData();
  data.activeTopic = currentTopic;
  if (!data.topics) {
    data.topics = {};
  }
  data.topics[currentTopic] = {
    index: currentIndex,
    answers: userAnswers,
    locked: isLocked,
    remainingSeconds,
    started: hasStarted,
    resultMessage: quizResult ? quizResult.textContent : '',
  };
  setStoredData(data);
};

const clearTopicState = (topicKey) => {
  const data = getStoredData();
  if (data.topics && data.topics[topicKey]) {
    delete data.topics[topicKey];
  }
  data.activeTopic = topicKey;
  setStoredData(data);
};

let currentTopic = 'excel';
let currentIndex = 0;
let userAnswers = [];
let isLocked = false;
let hasStarted = false;
let timerId = null;
let remainingSeconds = 0;

const setAccent = (color) => {
  document.documentElement.style.setProperty('--quiz-accent', color);
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

const updateTimerDisplay = () => {
  if (!quizTimer) return;
  quizTimer.textContent = `الوقت المتبقي: ${formatTime(remainingSeconds)}`;
  const timerItem = quizTimer.closest('.quiz-meta-item');
  if (timerItem) {
    timerItem.classList.toggle(
      'is-urgent',
      remainingSeconds <= 30 && !isLocked
    );
  }
};

const showReadyTimer = () => {
  if (!quizTimer) return;
  quizTimer.textContent = 'جاهز للبدء';
  const timerItem = quizTimer.closest('.quiz-meta-item');
  if (timerItem) {
    timerItem.classList.remove('is-urgent');
  }
};

const updateStartUI = () => {
  const isPaused = !hasStarted && !isLocked;
  if (quizShell) {
    quizShell.classList.toggle('is-paused', isPaused);
  }
  if (startQuiz) {
    startQuiz.classList.toggle('d-none', !isPaused);
  }
  if (submitQuiz) {
    submitQuiz.disabled = isPaused || isLocked;
  }
};

const clearTimer = () => {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
};

const startTimer = (seconds) => {
  clearTimer();
  remainingSeconds = seconds;
  updateTimerDisplay();
  timerId = setInterval(() => {
    if (isLocked) {
      return;
    }
    remainingSeconds -= 1;
    if (remainingSeconds <= 0) {
      remainingSeconds = 0;
      updateTimerDisplay();
      clearTimer();
      gradeQuiz(true);
      return;
    }
    updateTimerDisplay();
    saveState();
  }, 1000);
};

const updateProgress = () => {
  const total = quizData[currentTopic].questions.length;
  const answered = userAnswers.filter((ans) => ans !== null).length;
  const percent = Math.round((answered / total) * 100);
  quizProgress.style.width = `${percent}%`;
};

const getScoreSummary = (topic) => {
  let correct = 0;
  let answered = 0;

  topic.questions.forEach((item, index) => {
    const selectedValue = userAnswers[index];
    if (selectedValue !== null) {
      answered += 1;
      if (selectedValue === item.answer) {
        correct += 1;
      }
    }
  });

  const total = topic.questions.length;
  const percent = Math.round((correct / total) * 100);
  const unanswered = total - answered;

  let message = `نتيجتك: ${correct} من ${total} (${percent}%).`;
  if (unanswered > 0) {
    message += ` عندك ${unanswered} سؤال بدون إجابة.`;
  }

  if (percent >= 75) {
    message += ' ممتاز! مستواك قوي.';
  } else if (percent >= 50) {
    message += ' كويس جدًا، ركز على الملاحظات.';
  } else {
    message += ' محتاج شوية مراجعة، ابدأ بالكورسات الأساسية.';
  }

  return { message, percent, correct, total, unanswered };
};

const updateNavButtons = () => {
  const total = quizData[currentTopic].questions.length;
  const isPaused = !hasStarted && !isLocked;
  prevQuestion.disabled = isPaused || currentIndex === 0;
  nextQuestion.disabled = isPaused || currentIndex === total - 1;
};

const renderQuestion = () => {
  const topic = quizData[currentTopic];
  const item = topic.questions[currentIndex];

  const options = item.options
    .map((opt, optIndex) => {
      return `
                <label class="quiz-option" data-index="${optIndex}">
                  <input type="radio" name="q-${currentIndex}" value="${optIndex}">
                  <span class="custom-radio"></span>
                  <span>${opt}</span>
                </label>
              `;
    })
    .join('');

  quizList.innerHTML = `
            <div class="quiz-question" id="question-${currentIndex}">
              <h5>${currentIndex + 1}. ${item.q}</h5>
              <div class="quiz-options">${options}</div>
              <p class="quiz-explain">${item.explain}</p>
            </div>
          `;

  const selectedValue = userAnswers[currentIndex];
  if (selectedValue !== null) {
    const selectedInput = quizList.querySelector(
      `input[value="${selectedValue}"]`
    );
    if (selectedInput) {
      selectedInput.checked = true;
    }
  }

  const inputs = quizList.querySelectorAll('input[type="radio"]');
  const shouldDisable = isLocked || !hasStarted;
  if (shouldDisable) {
    inputs.forEach((input) => {
      input.disabled = true;
    });
  }

  if (isLocked) {
    const correctOption = quizList.querySelector(
      `.quiz-option[data-index="${item.answer}"]`
    );
    if (correctOption) {
      correctOption.classList.add('correct');
    }

    if (selectedValue !== null && selectedValue !== item.answer) {
      const wrongOption = quizList.querySelector(
        `.quiz-option[data-index="${selectedValue}"]`
      );
      if (wrongOption) {
        wrongOption.classList.add('wrong');
      }
    }

    const questionEl = quizList.querySelector('.quiz-question');
    if (questionEl) {
      questionEl.classList.add('show-explain');
    }
  }

  updateNavButtons();
};

const renderQuiz = (topicKey) => {
  const topic = quizData[topicKey];
  if (!topic) return;
  currentTopic = topicKey;

  const total = topic.questions.length;
  const durationSeconds = (parseInt(topic.time, 10) || 10) * 60;
  const stored = getTopicState(topicKey);
  let storedResultMessage = '';

  if (
    stored &&
    Array.isArray(stored.answers) &&
    stored.answers.length === total
  ) {
    currentIndex = Math.min(stored.index ?? 0, total - 1);
    userAnswers = stored.answers.map((value) =>
      value === null || typeof value === 'number' ? value : null
    );
    isLocked = !!stored.locked;
    hasStarted =
      typeof stored.started === 'boolean' ? stored.started : isLocked;
    storedResultMessage = stored.resultMessage || '';
    const storedRemaining =
      typeof stored.remainingSeconds === 'number'
        ? stored.remainingSeconds
        : durationSeconds;
    if (storedRemaining > 0) {
      remainingSeconds = storedRemaining;
    } else {
      remainingSeconds = isLocked ? 0 : durationSeconds;
    }
  } else {
    currentIndex = 0;
    userAnswers = Array(total).fill(null);
    isLocked = false;
    hasStarted = false;
    remainingSeconds = durationSeconds;
  }

  if (isLocked) {
    hasStarted = true;
  }

  topicButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.topic === topicKey);
  });

  setAccent(topic.accent);

  quizTitle.textContent = topic.title;
  quizSubtitle.textContent = topic.subtitle;
  quizLevel.textContent = topic.level;
  quizCount.textContent = `${topic.questions.length} أسئلة`;
  quizTime.textContent = topic.time;

  quizResult.classList.remove('show');
  quizResult.textContent = '';
  quizHint.textContent = !hasStarted && !isLocked
    ? 'اضغط ابدأ الامتحان لبدء العد والإجابة على الأسئلة.'
    : 'اختار إجابة لكل سؤال علشان النتيجة تكون دقيقة.';

  if (isLocked) {
    const { message } = getScoreSummary(topic);
    quizResult.textContent = storedResultMessage || message;
    quizResult.classList.add('show');
    quizHint.textContent = 'تم اظهار الإجابات الصحيحة باللون الأخضر.';
    submitQuiz.disabled = true;
    resetQuiz.classList.remove('d-none');
    clearTimer();
    updateTimerDisplay();
  } else {
    submitQuiz.disabled = !hasStarted;
    resetQuiz.classList.add('d-none');
    if (hasStarted) {
      startTimer(remainingSeconds);
    } else {
      clearTimer();
      showReadyTimer();
    }
  }

  updateProgress();
  renderQuestion();
  updateStartUI();
  saveState();
};

const gradeQuiz = (auto = false) => {
  if (isLocked) return;
  if (!hasStarted && !auto) return;
  clearTimer();

  const topic = quizData[currentTopic];
  const { message } = getScoreSummary(topic);

  quizResult.textContent = message;
  quizResult.classList.add('show');
  quizHint.textContent = 'تم اظهار الإجابات الصحيحة باللون الأخضر.';
  if (auto && quizTimer) {
    quizTimer.textContent = 'انتهى الوقت';
    const timerItem = quizTimer.closest('.quiz-meta-item');
    if (timerItem) {
      timerItem.classList.remove('is-urgent');
    }
  }

  isLocked = true;
  hasStarted = true;
  submitQuiz.disabled = true;
  resetQuiz.classList.remove('d-none');
  renderQuestion();
  updateStartUI();
  saveState();
};

const resetQuizState = () => {
  clearTopicState(currentTopic);
  renderQuiz(currentTopic);
};

topicButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    renderQuiz(btn.dataset.topic);
    window.scrollTo({
      top: document.getElementById('quizSection').offsetTop - 70,
      behavior: 'smooth',
    });
  });
});

quizList.addEventListener('change', (e) => {
  if (isLocked || !hasStarted) return;
  if (e.target.matches('input[type="radio"]')) {
    userAnswers[currentIndex] = parseInt(e.target.value, 10);
    updateProgress();
    saveState();
  }
});

prevQuestion.addEventListener('click', () => {
  if (!hasStarted) return;
  if (currentIndex > 0) {
    currentIndex -= 1;
    renderQuestion();
    saveState();
  }
});

nextQuestion.addEventListener('click', () => {
  if (!hasStarted) return;
  const total = quizData[currentTopic].questions.length;
  if (currentIndex < total - 1) {
    currentIndex += 1;
    renderQuestion();
    saveState();
  }
});

submitQuiz.addEventListener('click', gradeQuiz);
resetQuiz.addEventListener('click', resetQuizState);
if (startQuiz) {
  startQuiz.addEventListener('click', () => {
    if (isLocked) return;
    if (!hasStarted) {
      hasStarted = true;
      if (remainingSeconds <= 0) {
        const topic = quizData[currentTopic];
        remainingSeconds = (parseInt(topic.time, 10) || 10) * 60;
      }
      startTimer(remainingSeconds);
      quizHint.textContent = 'اختار إجابة لكل سؤال علشان النتيجة تكون دقيقة.';
      updateStartUI();
      renderQuestion();
      saveState();
    }
  });
}

const storedData = getStoredData();
if (storedData.activeTopic && quizData[storedData.activeTopic]) {
  currentTopic = storedData.activeTopic;
}

renderQuiz(currentTopic);
