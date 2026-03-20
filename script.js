// === DARK MODE ===
const html = document.documentElement;
const toggleBtn = document.getElementById('theme-toggle');

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) {
    applyTheme(saved);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  } else {
    applyTheme('light');
  }
}

toggleBtn.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

initTheme();

// === NAV: FROSTED GLASS ON SCROLL ===
const nav = document.getElementById('main-nav');

// === NAV: ACTIVE LINK ON SCROLL ===
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(section => sectionObserver.observe(section));

// === SCROLL REVEAL ===
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
      const index = siblings.indexOf(entry.target);
      const target = entry.target;
      setTimeout(() => {
        target.classList.add('visible');
        revealObserver.unobserve(target);
      }, index * 80);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// === HERO BLUR ON SCROLL ===
const heroBg = document.querySelector('.hero-bg');
const heroSection = document.getElementById('hero');

// === SCROLL HANDLER: NAV + HERO BLUR ===
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  nav.classList.toggle('scrolled', scrolled > 40);
  const heroHeight = heroSection.offsetHeight;
  const progress = Math.min(scrolled / heroHeight, 1);
  heroBg.style.filter = `blur(${progress * 12}px)`;
}, { passive: true });

// === MODAL ===
const modalOverlay  = document.getElementById('modal-overlay');
const modalClose    = document.getElementById('modal-close');
const modalImg      = document.getElementById('modal-img');
const modalTags     = document.getElementById('modal-tags');
const modalTitle    = document.getElementById('modal-title');
const modalRole     = document.getElementById('modal-role');
const modalDesc     = document.getElementById('modal-desc');
const modalLinks    = document.getElementById('modal-links');
const modalContent  = document.getElementById('modal-content');

function openModal(card) {
  const title   = card.dataset.title   || '';
  const role    = card.dataset.role    || '';
  const img     = card.dataset.img     || '';
  const tags    = card.dataset.tags    || '';
  const desc    = card.dataset.descFull || '';
  const link1L  = card.dataset.link1Label || '';
  const link1U  = card.dataset.link1Url   || '';
  const link2L  = card.dataset.link2Label || '';
  const link2U  = card.dataset.link2Url   || '';

  // Populate image
  const safeImg = img.replace(/'/g, '');
  modalImg.style.backgroundImage = safeImg ? `url('${safeImg}')` : '';
  modalImg.style.backgroundSize = card.dataset.imgFit === 'contain' ? 'contain' : 'cover';
  modalImg.style.backgroundRepeat = 'no-repeat';

  // Populate tags
  modalTags.innerHTML = '';
  tags.split(',').map(t => t.trim()).filter(Boolean).forEach(t => {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = t;
    modalTags.appendChild(span);
  });

  // Populate title
  modalTitle.textContent = title;

  // Populate role (hide if absent)
  modalRole.textContent = role;
  modalRole.style.display = role ? 'block' : 'none';

  // Populate description paragraphs
  modalDesc.innerHTML = '';
  desc.split('\\n\\n').filter(Boolean).forEach(chunk => {
    const p = document.createElement('p');
    p.textContent = chunk;
    modalDesc.appendChild(p);
  });

  // Populate links (only if URL is a safe http/https URL)
  function isSafeUrl(url) { return /^https?:\/\//i.test(url); }
  const linkEls = [];
  [[link1U, link1L], [link2U, link2L]].forEach(([url, label]) => {
    if (url && isSafeUrl(url)) {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = label || url;
      linkEls.push(a);
    }
  });
  modalLinks.innerHTML = '';
  linkEls.forEach(a => modalLinks.appendChild(a));
  modalLinks.style.display = linkEls.length ? 'flex' : 'none';

  // Reset scroll
  modalContent.scrollTop = 0;

  // Lock body scroll without layout shift (compensate for scrollbar width)
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = `${scrollbarWidth}px`;
  nav.style.paddingRight = `${scrollbarWidth}px`;

  // Show modal
  modalOverlay.setAttribute('aria-hidden', 'false');
  modalOverlay.classList.add('is-open');
}

function closeModal() {
  modalOverlay.classList.remove('is-open');
  modalOverlay.addEventListener('transitionend', () => {
    if (!modalOverlay.classList.contains('is-open')) {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      nav.style.paddingRight = '';
      modalOverlay.setAttribute('aria-hidden', 'true');
    }
  }, { once: true });
}

// Card click listeners
document.querySelectorAll('.project-card, .leadership-card').forEach(card => {
  card.addEventListener('click', (e) => openModal(e.currentTarget));
});

// Close on backdrop click
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

// Close button
modalClose.addEventListener('click', closeModal);

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (modalOverlay.classList.contains('is-open')) closeModal();
    if (certOverlay.classList.contains('is-open')) closeCert();
  }
});

// === CERT LIGHTBOX ===
const certOverlay = document.getElementById('cert-overlay');
const certImg     = document.getElementById('cert-img');
const certClose   = document.getElementById('cert-close');

function openCert(src) {
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  certImg.src = src;
  certImg.alt = 'Certificate';
  certOverlay.setAttribute('aria-hidden', 'false');
  certOverlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = `${scrollbarWidth}px`;
  nav.style.paddingRight = `${scrollbarWidth}px`;
}

function closeCert() {
  certOverlay.classList.remove('is-open');
  certOverlay.addEventListener('transitionend', () => {
    if (!certOverlay.classList.contains('is-open')) {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      nav.style.paddingRight = '';
      certOverlay.setAttribute('aria-hidden', 'true');
      certImg.src = '';
    }
  }, { once: true });
}

document.querySelectorAll('.award-view-btn').forEach(btn => {
  btn.addEventListener('click', () => openCert(btn.dataset.certImg));
});

certOverlay.addEventListener('click', (e) => {
  if (e.target === certOverlay) closeCert();
});

certClose.addEventListener('click', closeCert);
