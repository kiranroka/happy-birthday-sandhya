const body = document.body;
const loadingScreen = document.querySelector('.loading-screen');
const heroSection = document.querySelector('#hero');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
const videoCards = document.querySelectorAll('.video-card');
const imageModal = document.getElementById('imageModal');
const videoModal = document.getElementById('videoModal');
const modalImage = document.getElementById('modalImage');
const modalVideo = document.getElementById('modalVideo');
const closeButtons = document.querySelectorAll('.close-btn');
const prevImageButton = document.getElementById('prevImageBtn');
const nextImageButton = document.getElementById('nextImageBtn');
const musicButton = document.getElementById('musicButton');
const audio = document.getElementById('birthdayAudio');
const confettiLayer = document.getElementById('confettiLayer');
let currentImageIndex = 0;

function initLoading() {
  body.classList.add('loading');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
      body.classList.remove('loading');
    }, 900);
  });
}

function createDecor() {
  const decorCount = window.innerWidth < 700 ? 18 : 32;
  for (let i = 0; i < decorCount; i += 1) {
    const spark = document.createElement('span');
    spark.className = 'sparkle';
    spark.style.left = `${Math.random() * 100}%`;
    spark.style.top = `${Math.random() * 100}%`;
    spark.style.animationDelay = `${Math.random() * 2}s`;
    heroSection.appendChild(spark);
  }

  for (let i = 0; i < 8; i += 1) {
    const heart = document.createElement('span');
    heart.className = 'heart';
    heart.textContent = '💖';
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.top = `${Math.random() * 100}%`;
    heart.style.animationDelay = `${Math.random() * 4}s`;
    heroSection.appendChild(heart);
  }

  for (let i = 0; i < 24; i += 1) {
    const p = document.createElement('span');
    p.className = 'floating-particle';
    p.style.left = `${Math.random() * 100}%`;
    p.style.top = `${Math.random() * 100}%`;
    p.style.background = ['#ffb6c1', '#c8a2ff', '#a7d8ff', '#ffd700'][i % 4];
    p.style.animationDelay = `${Math.random() * 3}s`;
    heroSection.appendChild(p);
  }
}

function createConfetti() {
  for (let i = 0; i < 60; i += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = ['#ffb6c1', '#c8a2ff', '#a7d8ff', '#ffd700', '#ffffff'][i % 5];
    piece.style.setProperty('--drift', `${(Math.random() - 0.5) * 240}px`);
    piece.style.animationDuration = `${2.8 + Math.random() * 1.2}s`;
    piece.style.animationDelay = `${Math.random() * 0.2}s`;
    confettiLayer.appendChild(piece);
    setTimeout(() => piece.remove(), 4200);
  }
}

function setupTabs() {
  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.tab;
      tabButtons.forEach((btn) => btn.classList.remove('active'));
      tabPanels.forEach((panel) => panel.classList.remove('active'));
      button.classList.add('active');
      const activePanel = document.getElementById(target);
      if (activePanel) activePanel.classList.add('active');
    });
  });
}

function openImageModal(index) {
  currentImageIndex = (index + galleryItems.length) % galleryItems.length;
  const selectedItem = galleryItems[currentImageIndex];
  modalImage.src = selectedItem.dataset.image;
  modalImage.alt = selectedItem.dataset.caption;
  imageModal.classList.add('open');
}

function showNextImage(direction) {
  openImageModal(currentImageIndex + direction);
}

function setupGallery() {
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      openImageModal(index);
    });

    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openImageModal(index);
      }
    });
  });

  prevImageButton.addEventListener('click', () => showNextImage(-1));
  nextImageButton.addEventListener('click', () => showNextImage(1));

  videoCards.forEach((card) => {
    card.addEventListener('click', () => {
      modalVideo.src = card.dataset.video;
      modalVideo.load();
      videoModal.classList.add('open');
    });

    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        modalVideo.src = card.dataset.video;
        modalVideo.load();
        videoModal.classList.add('open');
      }
    });
  });
}

function closeModal() {
  imageModal.classList.remove('open');
  videoModal.classList.remove('open');
  modalVideo.pause();
  modalVideo.removeAttribute('src');
}

function setupModals() {
  closeButtons.forEach((button) => {
    button.addEventListener('click', closeModal);
  });

  [imageModal, videoModal].forEach((modal) => {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal();
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
    if (imageModal.classList.contains('open') && event.key === 'ArrowLeft') showNextImage(-1);
    if (imageModal.classList.contains('open') && event.key === 'ArrowRight') showNextImage(1);
  });
}

function setupReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.2 });

  reveals.forEach((item) => observer.observe(item));
}

async function toggleMusic() {
  if (audio.paused) {
    try {
      await audio.play();
      musicButton.textContent = '⏸ Pause';
      musicButton.setAttribute('aria-pressed', 'true');
    } catch (error) {
      musicButton.textContent = '▶ Play';
    }
  } else {
    audio.pause();
    musicButton.textContent = '▶ Play';
    musicButton.setAttribute('aria-pressed', 'false');
  }
}

function setupMusic() {
  audio.volume = 0.3;
  audio.loop = true;
  musicButton.addEventListener('click', toggleMusic);
}

function init() {
  initLoading();
  createDecor();
  createConfetti();
  setupTabs();
  setupGallery();
  setupModals();
  setupReveal();
  setupMusic();
  setInterval(createConfetti, 5000);
}

init();
