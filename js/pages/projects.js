// Projects Page
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

    if (window.applyAosAttributes) {
      window.applyAosAttributes();
    }
    if (window.AOS) {
      window.AOS.refreshHard();
    }
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
