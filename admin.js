/**
 * =====================================================
 *  ELEGANZA — Admin Data & Dashboard
 *  ─────────────────────────────────────────────────
 *  HOW TO UPDATE CONTENT WITHOUT THE ADMIN PANEL:
 *  1. Edit ADMIN_DATA below directly.
 *  2. Save this file — changes reflect instantly on reload.
 *
 *  HOW TO USE THE ADMIN PANEL (in-browser):
 *  1. Click the ⚙ gear icon (bottom-left corner).
 *  2. Enter password: eleganza2025
 *  3. Manage offers, arrivals info, social links & announcement.
 *  ─────────────────────────────────────────────────
 *  Admin Password: eleganza2025  (change below)
 * =====================================================
 */

const ADMIN_PASSWORD = 'eleganza2025';

/* ─── Default Data ─── */
const DEFAULT_DATA = {

  announcement: '✨ Free delivery on orders over Rs. 3,500 — <strong>Limited time offer!</strong>',

  /* Offer deadline — ISO string. Set to a future date. */
  offerDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),

  /* Weekly Offers ─ add/remove objects freely */
  offers: [
    {
      id: 'offer-1',
      name: 'End of Season Sale',
      discount: 'Up to 40% OFF',
      description: 'Selected newborn & toddler sets at massive discounts. Limited stock — grab yours now!',
      imgUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80&auto=format&fit=crop',
      emoji: '🎀'
    },
    {
      id: 'offer-2',
      name: 'Buy 2 Get 1 Free',
      discount: 'FREE Item',
      description: 'Purchase any 2 baby clothing items and get a third of equal or lesser value absolutely free.',
      imgUrl: '',
      emoji: '🎁'
    },
    {
      id: 'offer-3',
      name: 'Gift Set Bundle',
      discount: '25% OFF',
      description: 'Our bestselling baby gift hampers are now 25% off! Perfect for baby showers & christenings.',
      imgUrl: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80&auto=format&fit=crop',
      emoji: '✨'
    }
  ],

  /* Social Links ─ add TikTok, Email, etc. without code changes */
  socials: [
    {
      id: 'social-instagram',
      name: 'Instagram',
      url: 'https://www.instagram.com/eleganza.lk',
      icon: 'instagram',
      styleClass: 'instagram'
    },
    {
      id: 'social-facebook',
      name: 'Facebook',
      url: 'https://www.facebook.com/p/Eleganzalk-61550948635261',
      icon: 'facebook',
      styleClass: 'facebook'
    }
  ]
};

/* ─── Load from localStorage (admin edits persist across sessions) ─── */
function loadData() {
  try {
    const saved = localStorage.getItem('eleganza_admin_data');
    if (saved) return JSON.parse(saved);
  } catch(e) {}
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

function saveData(data) {
  localStorage.setItem('eleganza_admin_data', JSON.stringify(data));
}

let ADMIN_DATA = loadData();

/* ─── Render: Offers Section ─── */
function renderOffers() {
  const grid = document.getElementById('offers-grid');
  if (!grid) return;
  grid.innerHTML = '';

  if (!ADMIN_DATA.offers || ADMIN_DATA.offers.length === 0) {
    grid.innerHTML = '<p style="text-align:center;color:var(--gray-400);grid-column:1/-1;">No active offers at the moment. Check back soon!</p>';
    return;
  }

  ADMIN_DATA.offers.forEach(offer => {
    const card = document.createElement('div');
    card.className = 'offer-card reveal';
    card.id = 'card-' + offer.id;
    card.innerHTML = `
      ${offer.imgUrl
        ? `<img src="${offer.imgUrl}" alt="${offer.name}" class="offer-card-img" loading="lazy"/>`
        : `<div class="offer-card-img-placeholder">${offer.emoji || '🎀'}</div>`
      }
      <div class="offer-card-body">
        <span class="offer-discount-badge">${offer.discount}</span>
        <h3 class="offer-card-name">${offer.name}</h3>
        <p class="offer-card-desc">${offer.description}</p>
      </div>
      <div class="offer-card-actions">
        <button class="btn-primary btn-sm btn-full" onclick="openWhatsApp('${offer.name}')">
          <i data-lucide="message-circle" style="width:14px;height:14px;"></i>
          Enquire Now
        </button>
      </div>`;
    grid.appendChild(card);
  });

  if (window.lucide) lucide.createIcons();
}

/* ─── Render: Social Links ─── */
function renderSocials() {
  const contactSocials = document.getElementById('social-links');
  const footerSocials  = document.getElementById('footer-social-list');

  const socials = ADMIN_DATA.socials || [];

  if (contactSocials) {
    contactSocials.innerHTML = socials.map(s => `
      <a href="${s.url}" target="_blank" rel="noopener noreferrer"
         class="social-link-btn ${s.styleClass || 'default'}"
         id="social-btn-${s.id}" aria-label="${s.name}">
        <i data-lucide="${s.icon}" style="width:16px;height:16px;"></i>
        ${s.name}
      </a>`).join('');
  }

  if (footerSocials) {
    footerSocials.innerHTML = socials.map(s => `
      <li><a href="${s.url}" target="_blank" rel="noopener noreferrer" id="footer-${s.id}">${s.name}</a></li>`
    ).join('');
  }

  if (window.lucide) lucide.createIcons();
}

/* ─── Render: Announcement ─── */
function renderAnnouncement() {
  const el = document.getElementById('announcement-text');
  if (el) el.innerHTML = ADMIN_DATA.announcement || DEFAULT_DATA.announcement;
}

/* ─── Admin Panel UI ─── */
function openAdminPanel() {
  document.getElementById('admin-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeAdminPanel() {
  document.getElementById('admin-overlay').classList.remove('open');
  document.getElementById('admin-dashboard').style.display = 'none';
  document.getElementById('admin-login-screen').style.display = 'block';
  document.getElementById('admin-password-input').value = '';
  document.getElementById('admin-login-error').style.display = 'none';
  document.body.style.overflow = '';
}

function switchAdminTab(tabName) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.admin-panel').forEach(p => p.style.display = 'none');
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  document.getElementById(`apanel-${tabName}`).style.display = 'block';

  if (tabName === 'offers')       renderAdminOffersList();
  if (tabName === 'socials')      renderAdminSocialsList();
  if (tabName === 'announcement') {
    document.getElementById('announcement-input').value = ADMIN_DATA.announcement || '';
  }
  if (tabName === 'offers') {
    const deadline = ADMIN_DATA.offerDeadline;
    if (deadline) {
      const local = new Date(deadline);
      const pad = n => String(n).padStart(2, '0');
      const iso = `${local.getFullYear()}-${pad(local.getMonth()+1)}-${pad(local.getDate())}T${pad(local.getHours())}:${pad(local.getMinutes())}`;
      document.getElementById('offer-deadline-input').value = iso;
    }
  }
}

/* Admin: Offers List */
function renderAdminOffersList() {
  const list = document.getElementById('admin-offers-list');
  if (!list) return;
  list.innerHTML = '';
  (ADMIN_DATA.offers || []).forEach(offer => {
    const item = document.createElement('div');
    item.className = 'admin-offer-item';
    item.innerHTML = `
      <span class="admin-offer-item-name">${offer.emoji || '🎀'} ${offer.name} <em style="color:var(--gold-600);font-size:.8rem;">· ${offer.discount}</em></span>
      <button class="admin-remove-btn" data-offer-id="${offer.id}">Remove</button>`;
    item.querySelector('.admin-remove-btn').addEventListener('click', () => {
      ADMIN_DATA.offers = ADMIN_DATA.offers.filter(o => o.id !== offer.id);
      saveData(ADMIN_DATA);
      renderOffers();
      renderAdminOffersList();
      showSaveStatus();
    });
    list.appendChild(item);
  });
}

/* Admin: Socials List */
function renderAdminSocialsList() {
  const list = document.getElementById('admin-socials-list');
  if (!list) return;
  list.innerHTML = '';
  (ADMIN_DATA.socials || []).forEach(s => {
    const item = document.createElement('div');
    item.className = 'admin-social-item';
    item.innerHTML = `
      <span class="admin-social-item-name">${s.name}<em style="color:var(--gray-400);font-size:.8rem;margin-left:8px;">${s.url}</em></span>
      <button class="admin-remove-btn" data-social-id="${s.id}">Remove</button>`;
    item.querySelector('.admin-remove-btn').addEventListener('click', () => {
      ADMIN_DATA.socials = ADMIN_DATA.socials.filter(x => x.id !== s.id);
      saveData(ADMIN_DATA);
      renderSocials();
      renderAdminSocialsList();
      showSaveStatus();
    });
    list.appendChild(item);
  });
}

function showSaveStatus() {
  const el = document.getElementById('admin-save-status');
  if (!el) return;
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 3000);
}

/* ─── Init Admin Events ─── */
function initAdminEvents() {
  /* Open/Close */
  document.getElementById('admin-trigger').addEventListener('click', openAdminPanel);
  document.getElementById('admin-login-close').addEventListener('click', closeAdminPanel);
  document.getElementById('admin-close-btn').addEventListener('click', closeAdminPanel);
  document.getElementById('admin-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('admin-overlay')) closeAdminPanel();
  });

  /* Login */
  const loginBtn = document.getElementById('admin-login-btn');
  const pwInput  = document.getElementById('admin-password-input');

  function attemptLogin() {
    if (pwInput.value === ADMIN_PASSWORD) {
      document.getElementById('admin-login-screen').style.display = 'none';
      document.getElementById('admin-dashboard').style.display = 'block';
      document.getElementById('admin-login-error').style.display = 'none';
      switchAdminTab('offers');
    } else {
      document.getElementById('admin-login-error').style.display = 'block';
      pwInput.value = '';
      pwInput.focus();
    }
  }

  loginBtn.addEventListener('click', attemptLogin);
  pwInput.addEventListener('keydown', e => { if (e.key === 'Enter') attemptLogin(); });

  /* Tab switching */
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => switchAdminTab(tab.dataset.tab));
  });

  /* Add Offer */
  const addOfferBtn    = document.getElementById('add-offer-btn');
  const offerForm      = document.getElementById('admin-offer-form');
  const cancelOfferBtn = document.getElementById('cancel-offer-btn');
  const saveOfferBtn   = document.getElementById('save-offer-btn');

  addOfferBtn.addEventListener('click', () => {
    offerForm.style.display = 'flex';
    addOfferBtn.style.display = 'none';
  });
  cancelOfferBtn.addEventListener('click', () => {
    offerForm.style.display = 'none';
    addOfferBtn.style.display = 'inline-flex';
  });
  saveOfferBtn.addEventListener('click', () => {
    const name     = document.getElementById('offer-name-input').value.trim();
    const discount = document.getElementById('offer-discount-input').value.trim();
    const desc     = document.getElementById('offer-desc-input').value.trim();
    const imgUrl   = document.getElementById('offer-img-input').value.trim();
    if (!name || !discount) return;
    const newOffer = { id: 'offer-' + Date.now(), name, discount, description: desc, imgUrl, emoji: '🎀' };
    ADMIN_DATA.offers.push(newOffer);
    saveData(ADMIN_DATA);
    renderOffers();
    renderAdminOffersList();
    offerForm.style.display = 'none';
    addOfferBtn.style.display = 'inline-flex';
    ['offer-name-input','offer-discount-input','offer-desc-input','offer-img-input'].forEach(id => {
      document.getElementById(id).value = '';
    });
    showSaveStatus();
  });

  /* Offer Deadline */
  document.getElementById('save-deadline-btn').addEventListener('click', () => {
    const val = document.getElementById('offer-deadline-input').value;
    if (val) {
      ADMIN_DATA.offerDeadline = new Date(val).toISOString();
      saveData(ADMIN_DATA);
      showSaveStatus();
    }
  });

  /* Add Social */
  const addSocialBtn    = document.getElementById('add-social-btn');
  const socialForm      = document.getElementById('admin-social-form');
  const cancelSocialBtn = document.getElementById('cancel-social-btn');
  const saveSocialBtn   = document.getElementById('save-social-btn');

  addSocialBtn.addEventListener('click', () => {
    socialForm.style.display = 'flex';
    addSocialBtn.style.display = 'none';
  });
  cancelSocialBtn.addEventListener('click', () => {
    socialForm.style.display = 'none';
    addSocialBtn.style.display = 'inline-flex';
  });
  saveSocialBtn.addEventListener('click', () => {
    const name = document.getElementById('social-name-input').value.trim();
    const url  = document.getElementById('social-url-input').value.trim();
    const icon = document.getElementById('social-icon-input').value.trim() || 'link';
    if (!name || !url) return;
    const styleClass = name.toLowerCase().replace(/\s+/g, '-');
    ADMIN_DATA.socials.push({ id: 'social-' + Date.now(), name, url, icon, styleClass });
    saveData(ADMIN_DATA);
    renderSocials();
    renderAdminSocialsList();
    socialForm.style.display = 'none';
    addSocialBtn.style.display = 'inline-flex';
    ['social-name-input','social-url-input','social-icon-input'].forEach(id => {
      document.getElementById(id).value = '';
    });
    showSaveStatus();
  });

  /* Announcement */
  document.getElementById('save-announcement-btn').addEventListener('click', () => {
    const val = document.getElementById('announcement-input').value.trim();
    if (val) {
      ADMIN_DATA.announcement = val;
      saveData(ADMIN_DATA);
      renderAnnouncement();
      showSaveStatus();
    }
  });
}

/* ─── Bootstrap ─── */
document.addEventListener('DOMContentLoaded', () => {
  renderAnnouncement();
  renderOffers();
  renderSocials();
  initAdminEvents();
});
