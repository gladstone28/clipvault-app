// SECTION: State
const STORAGE_KEY = 'clipvault_videos_v1';
const CATEGORY_KEY = 'clipvault_categories_v1';

let videos = [];
let categories = [];
let activeCategoryId = 'all';
let activeVideoId = null;

// SECTION: Elements
const categoryListEl = document.getElementById('categoryList');
const categorySelectEl = document.getElementById('categorySelect');
const activeCategoryLabelEl = document.getElementById('activeCategoryLabel');
const videoListEl = document.getElementById('videoList');
const videoEmptyStateEl = document.getElementById('videoEmptyState');
const searchInputEl = document.getElementById('searchInput');
const videoFormEl = document.getElementById('videoForm');
const titleInputEl = document.getElementById('titleInput');
const urlInputEl = document.getElementById('urlInput');
const notesInputEl = document.getElementById('notesInput');
const accentSelectEl = document.getElementById('accentSelect');
const newCategoryButtonEl = document.getElementById('newCategoryButton');
const nowPlayingLabelEl = document.getElementById('nowPlayingLabel');
const viewerFrameEl = document.getElementById('viewerFrame');
const viewerMetaEl = document.getElementById('viewerMeta');
const qrShellEl = document.getElementById('qrShell');
const copyLinkButtonEl = document.getElementById('copyLinkButton');
const copyFeedbackEl = document.getElementById('copyFeedback');

// SECTION: Storage helpers
function loadFromStorage() {
  try {
    const storedVideos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const storedCategories = JSON.parse(
      localStorage.getItem(CATEGORY_KEY) || '[]'
    );
    videos = Array.isArray(storedVideos) ? storedVideos : [];
    categories = Array.isArray(storedCategories) ? storedCategories : [];
  } catch (e) {
    videos = [];
    categories = [];
  }

  // Seed with defaults if empty
  if (categories.length === 0) {
    categories = [
      { id: 'work', name: 'Work', color: 'accent-blue' },
      { id: 'family', name: 'Family', color: 'accent-amber' },
      { id: 'events', name: 'Events', color: 'accent-violet' },
    ];
  }

  saveCategories();
  saveVideos();
}

function saveVideos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
}

function saveCategories() {
  localStorage.setItem(CATEGORY_KEY, JSON.stringify(categories));
}

// SECTION: Rendering – Categories
function renderCategories() {
  categoryListEl.innerHTML = '';

  // "All" pill
  const allPill = document.createElement('button');
  allPill.type = 'button';
  allPill.className = 'category-pill' + (activeCategoryId === 'all' ? ' is-active' : '');
  allPill.innerHTML = `<span class="category-dot"></span><span>All</span><span class="category-count">${videos.length}</span>`;
  allPill.addEventListener('click', () => {
    activeCategoryId = 'all';
    renderAll();
  });
  categoryListEl.appendChild(allPill);

  categories.forEach((cat) => {
    const count = videos.filter((v) => v.categoryId === cat.id).length;
    const pill = document.createElement('button');
    pill.type = 'button';
    pill.className =
      'category-pill' + (activeCategoryId === cat.id ? ' is-active' : '');
    pill.innerHTML = `
      <span class="category-dot"></span>
      <span>${cat.name}</span>
      <span class="category-count">${count}</span>
    `;
    pill.addEventListener('click', () => {
      activeCategoryId = cat.id;
      renderAll();
    });
    categoryListEl.appendChild(pill);
  });

  // update select
  categorySelectEl.innerHTML = '';
  categories.forEach((cat) => {
    const option = document.createElement('option');
    option.value = cat.id;
    option.textContent = cat.name;
    categorySelectEl.appendChild(option);
  });
}

// SECTION: Rendering – Videos
function getFilteredVideos() {
  const term = searchInputEl.value.trim().toLowerCase();
  return videos.filter((video) => {
    const matchesCategory =
      activeCategoryId === 'all' || video.categoryId === activeCategoryId;
    if (!matchesCategory) return false;

    if (!term) return true;
    const haystack = `${video.title} ${video.notes || ''}`.toLowerCase();
    return haystack.includes(term);
  });
}

function renderVideoList() {
  const filtered = getFilteredVideos();
  videoListEl.innerHTML = '';

  if (filtered.length === 0) {
    videoEmptyStateEl.style.display = 'block';
  } else {
    videoEmptyStateEl.style.display = 'none';
  }

  filtered.forEach((video) => {
    const li = document.createElement('li');
    li.className =
      'video-item' + (video.id === activeVideoId ? ' is-active' : '');

    const main = document.createElement('div');
    main.className = 'video-item-main';
    const titleEl = document.createElement('p');
    titleEl.className = 'video-title';
    titleEl.textContent = video.title;
    const notesEl = document.createElement('p');
    notesEl.className = 'video-notes';
    notesEl.textContent = video.notes || '';
    main.appendChild(titleEl);
    main.appendChild(notesEl);

    const right = document.createElement('div');
    right.className = 'video-meta';
    const cat = categories.find((c) => c.id === video.categoryId);

    const tag = document.createElement('span');
    tag.className = `video-tag ${video.accent || 'accent-blue'}`;
    tag.textContent = cat ? cat.name : 'Clip';

    const time = document.createElement('span');
    time.textContent = new Date(video.createdAt).toLocaleDateString();

    right.appendChild(tag);
    right.appendChild(time);

    li.appendChild(main);
    li.appendChild(right);

    li.addEventListener('click', () => {
      activeVideoId = video.id;
      renderAll();
      scrollViewerIntoView();
    });

    videoListEl.appendChild(li);
  });

  const activeCategoryLabel =
    activeCategoryId === 'all'
      ? `All clips · ${filtered.length} shown`
      : `${
          categories.find((c) => c.id === activeCategoryId)?.name || 'Collection'
        } · ${filtered.length} clip${filtered.length === 1 ? '' : 's'}`;
  activeCategoryLabelEl.textContent = activeCategoryLabel;
}

// SECTION: Rendering – Viewer & QR
function renderViewer() {
  const video = videos.find((v) => v.id === activeVideoId);

  if (!video) {
    nowPlayingLabelEl.textContent = 'Select a video from your list.';
    viewerFrameEl.innerHTML = `
      <div class="viewer-placeholder">
        <span class="viewer-badge">Preview</span>
        <p>Pick a video to see it here.</p>
      </div>
    `;
    viewerMetaEl.innerHTML = '';
    renderQRPlaceholder('No video selected');
    copyLinkButtonEl.disabled = true;
    return;
  }

  nowPlayingLabelEl.textContent = video.title;

  const embedHtml = getEmbedHtml(video.url);
  viewerFrameEl.innerHTML = embedHtml
    ? embedHtml
    : `
      <div class="viewer-placeholder">
        <span class="viewer-badge">External link</span>
        <p>This link can't be embedded, but it will still work when shared.</p>
      </div>
    `;

  const cat = categories.find((c) => c.id === video.categoryId);
  viewerMetaEl.innerHTML = `
    <h3 class="viewer-meta-title">${video.title}</h3>
    ${video.notes ? `<p class="viewer-meta-notes">${video.notes}</p>` : ''}
    <div class="viewer-meta-row">
      <span>${cat ? cat.name : 'Unsorted'}</span>
      <span>Saved ${new Date(video.createdAt).toLocaleString()}</span>
    </div>
  `;

  renderQRForUrl(video.url);
  copyLinkButtonEl.disabled = false;
}

function getEmbedHtml(url) {
  if (!url) return '';
  try {
    const u = new URL(url);

    // YouTube watch
    if (
      u.hostname.includes('youtube.com') &&
      (u.pathname === '/watch' || u.pathname === '/watch/')
    ) {
      const v = u.searchParams.get('v');
      if (v) {
        return `<iframe src="https://www.youtube.com/embed/${v}" allowfullscreen loading="lazy"></iframe>`;
      }
    }

    // YouTube share / short
    if (u.hostname === 'youtu.be') {
      const id = u.pathname.replace('/', '');
      if (id) {
        return `<iframe src="https://www.youtube.com/embed/${id}" allowfullscreen loading="lazy"></iframe>`;
      }
    }

    // Vimeo basic support
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean)[0];
      if (id) {
        return `<iframe src="https://player.vimeo.com/video/${id}" allowfullscreen loading="lazy"></iframe>`;
      }
    }
  } catch (e) {
    return '';
  }

  return '';
}

// SECTION: QR (simple placeholder pattern)
function renderQRPlaceholder(message) {
  qrShellEl.innerHTML = `
    <div class="qr-placeholder">
      <div class="qr-dots"></div>
      <p>${message}</p>
    </div>
  `;
}

// Builds a simple pseudo-random blocky pattern based on the URL hash
function renderQRForUrl(url) {
  const hash = Array.from(url).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const size = 21; // 21 x 21 grid

  const container = document.createElement('div');
  container.style.display = 'grid';
  container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  container.style.gridAutoRows = '1fr';
  container.style.gap = '1px';
  container.style.width = '160px';
  container.style.height = '160px';

  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement('div');
    const bit = (hash >> (i % 16)) & 1;
    const isEye =
      (i < 7 * size && i % size < 7) ||
      (i % size >= size - 7 && i < 7 * size) ||
      (i % size < 7 && i >= (size - 7) * size);

    if (isEye) {
      cell.style.background = 'white';
      if (
        i % size > 0 &&
        i % size < 6 &&
        Math.floor(i / size) % size > 0 &&
        Math.floor(i / size) % size < 6
      ) {
        cell.style.background = '#050712';
      }
    } else {
      cell.style.background = bit ? 'white' : 'transparent';
    }

    container.appendChild(cell);
  }

  qrShellEl.innerHTML = '';
  qrShellEl.appendChild(container);
}

// SECTION: Event Handlers
function handleNewCategory() {
  const name = window.prompt('Name your new collection');
  if (!name) return;

  const id = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!id) return;

  if (categories.some((c) => c.id === id)) {
    window.alert('A collection with that name already exists.');
    return;
  }

  const palette = ['accent-blue', 'accent-amber', 'accent-pink', 'accent-emerald', 'accent-violet'];
  const color = palette[categories.length % palette.length];

  categories.push({ id, name, color });
  saveCategories();
  renderCategories();

  categorySelectEl.value = id;
}

function handleAddVideo(evt) {
  evt.preventDefault();

  const title = titleInputEl.value.trim();
  const url = urlInputEl.value.trim();
  const notes = notesInputEl.value.trim();
  const categoryId = categorySelectEl.value;
  const accent = accentSelectEl.value;

  if (!title || !url || !categoryId) {
    return;
  }

  const video = {
    id: `v_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    title,
    url,
    notes,
    categoryId,
    accent,
    createdAt: Date.now(),
  };

  videos.unshift(video);
  saveVideos();

  activeCategoryId = 'all';
  activeVideoId = video.id;

  videoFormEl.reset();
  renderAll();
}

function handleCopyLink() {
  const video = videos.find((v) => v.id === activeVideoId);
  if (!video) return;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(video.url).then(
      () => {
        copyFeedbackEl.textContent = 'Link copied to clipboard.';
        setTimeout(() => {
          copyFeedbackEl.textContent = '';
        }, 1800);
      },
      () => {
        fallbackCopy(video.url);
      }
    );
  } else {
    fallbackCopy(video.url);
  }
}

// Simple fallback copy method
function fallbackCopy(text) {
  const temp = document.createElement('textarea');
  temp.value = text;
  temp.style.position = 'fixed';
  temp.style.left = '-9999px';
  document.body.appendChild(temp);
  temp.select();
  try {
    document.execCommand('copy');
    copyFeedbackEl.textContent = 'Link copied to clipboard.';
  } catch (e) {
    copyFeedbackEl.textContent = 'Copy not supported in this browser.';
  }
  document.body.removeChild(temp);
  setTimeout(() => {
    copyFeedbackEl.textContent = '';
  }, 1800);
}

function scrollViewerIntoView() {
  const rect = viewerFrameEl.getBoundingClientRect();
  if (
    rect.top < 0 ||
    rect.bottom > (window.innerHeight || document.documentElement.clientHeight)
  ) {
    viewerFrameEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// SECTION: Orchestration
function renderAll() {
  renderCategories();
  renderVideoList();
  renderViewer();
}

function init() {
  loadFromStorage();
  renderAll();

  newCategoryButtonEl.addEventListener('click', handleNewCategory);
  videoFormEl.addEventListener('submit', handleAddVideo);
  copyLinkButtonEl.addEventListener('click', handleCopyLink);
  searchInputEl.addEventListener('input', () => {
    renderVideoList();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
