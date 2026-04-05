// Courses Page
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

      if (window.applyAosAttributes) {
        window.applyAosAttributes();
      }
      if (window.AOS) {
        window.AOS.refreshHard();
      }
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
      if (window.applyAosAttributes) {
        window.applyAosAttributes();
      }
      if (window.AOS) {
        window.AOS.refreshHard();
      }

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
