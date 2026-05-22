// Shared page chrome — call ATMO.renderShell({ active }) at top of each page.
// Renders nav into #nav-root and footer into #footer-root with consistent links.
window.ATMO = window.ATMO || {};

window.ATMO.NAV_LINKS = [
  { id: 'home',      label: 'Главная',    href: 'index.html' },
  { id: 'catalog',   label: 'Каталог',    href: 'catalog.html' },
  { id: 'courses',   label: 'Мои курсы',  href: 'courses.html' },
  { id: 'account',   label: 'Кабинет',    href: 'account.html' },
];

window.ATMO.renderShell = function ({ active }) {
  const nav = document.getElementById('nav-root');
  if (nav) {
    const linksHTML = ATMO.NAV_LINKS.map(l =>
      `<a class="nav-link${l.id === active ? ' active' : ''}" href="${l.href}">${l.label}</a>`
    ).join('');
    const drawerLinksHTML = ATMO.NAV_LINKS.map(l =>
      `<a class="${l.id === active ? 'active' : ''}" href="${l.href}">${l.label}</a>`
    ).join('');
    nav.innerHTML = `
      <nav class="page-nav">
        <div class="container page-nav-row">
          <a class="brand-mark" href="index.html">
            <svg width="24" height="24" viewBox="0 0 36 36" fill="none" aria-hidden="true" style="flex-shrink:0">
              <line x1="18" y1="6" x2="27" y2="28" stroke="var(--primary)" stroke-width="7.5" stroke-linecap="round"/>
              <line x1="18" y1="6" x2="6" y2="31" stroke="var(--secondary)" stroke-width="9" stroke-linecap="round"/>
              <circle cx="6" cy="31" r="4.5" fill="var(--primary)"/>
            </svg>
            <span class="brand-name">atmo</span>
            <span class="brand-sub">studio</span>
          </a>
          <div class="nav-links">${linksHTML}</div>
          <div style="display:flex;align-items:center;gap:8px">
            <a class="cart-btn" href="cart.html" aria-label="Корзина">
              <span>Корзина</span>
              <span class="cart-count" id="nav-cart-count">1</span>
            </a>
            <button class="nav-burger" id="nav-burger" aria-label="Меню" aria-expanded="false" aria-controls="nav-drawer">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>
    `;

    // Mobile drawer
    document.body.insertAdjacentHTML('beforeend', `
      <div class="nav-drawer" id="nav-drawer" role="dialog" aria-modal="true" aria-label="Навигация">
        <div class="nav-drawer-overlay" id="nav-drawer-overlay"></div>
        <div class="nav-drawer-panel" role="document">
          <div class="nav-drawer-header">
            <a class="brand-mark" href="index.html">
              <svg width="22" height="22" viewBox="0 0 36 36" fill="none" aria-hidden="true" style="flex-shrink:0">
                <line x1="18" y1="6" x2="27" y2="28" stroke="var(--primary)" stroke-width="7.5" stroke-linecap="round"/>
                <line x1="18" y1="6" x2="6" y2="31" stroke="var(--secondary)" stroke-width="9" stroke-linecap="round"/>
                <circle cx="6" cy="31" r="4.5" fill="var(--primary)"/>
              </svg>
              <span class="brand-name">atmo</span>
              <span class="brand-sub">studio</span>
            </a>
            <button class="nav-drawer-close" id="nav-drawer-close" aria-label="Закрыть меню">✕</button>
          </div>
          <div class="nav-drawer-links">
            ${drawerLinksHTML}
            <div class="drawer-sep"></div>
            <a href="auth.html">Войти</a>
          </div>
          <div class="nav-drawer-foot">
            <a class="btn btn-primary btn-block" href="cart.html" style="gap:10px">
              Корзина <span id="nav-drawer-cart-count" style="background:rgba(0,0,0,0.15);border-radius:999px;padding:1px 8px;font-size:12px">1</span>
            </a>
          </div>
        </div>
      </div>
    `);

    // Drawer toggle logic
    const burger  = document.getElementById('nav-burger');
    const drawer  = document.getElementById('nav-drawer');
    const overlay = document.getElementById('nav-drawer-overlay');
    const closeBtn = document.getElementById('nav-drawer-close');

    function openDrawer() {
      drawer.classList.add('open');
      burger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
    function closeDrawer() {
      drawer.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    burger.addEventListener('click', openDrawer);
    overlay.addEventListener('click', closeDrawer);
    closeBtn.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
  }
  const foot = document.getElementById('footer-root');
  if (foot) {
    foot.innerHTML = `
      <footer class="page-footer">
        <div class="container">
          <div class="footer-grid">
            <div>
              <div style="display:inline-flex;align-items:center;gap:10px;margin-bottom:14px">
                <svg width="22" height="22" viewBox="0 0 36 36" fill="none" aria-hidden="true" style="flex-shrink:0">
                  <line x1="18" y1="6" x2="27" y2="28" stroke="var(--primary)" stroke-width="7.5" stroke-linecap="round"/>
                  <line x1="18" y1="6" x2="6" y2="31" stroke="var(--secondary)" stroke-width="9" stroke-linecap="round"/>
                  <circle cx="6" cy="31" r="4.5" fill="var(--primary)"/>
                </svg>
                <span class="serif" style="font-size:24px;line-height:1;letter-spacing:-0.02em">atmo</span>
              </div>
              <p style="margin:0;font-size:14px;color:var(--ink-soft);line-height:1.55;max-width:280px">
                Спокойные структурированные программы для тела, в котором приятно жить.
              </p>
            </div>
            <div class="footer-col">
              <div class="footer-col-title">Программы</div>
              <ul>
                <li><a href="catalog.html">Каталог</a></li>
                <li><a href="courses.html">Мои курсы</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <div class="footer-col-title">Кабинет</div>
              <ul>
                <li><a href="account.html">Мой аккаунт</a></li>
                <li><a href="cart.html">Корзина</a></li>
                <li><a href="auth.html">Вход / Регистрация</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <div class="footer-col-title">Студия</div>
              <ul>
                <li><a href="trainer.html">Тренер и метод</a></li>
                <li><a href="https://www.instagram.com/atmo.by/" target="_blank" rel="noopener">Instagram</a></li>
                <li><span style="color:var(--ink-soft)">Контакты</span></li>
              </ul>
            </div>
          </div>
          <div class="footer-base">
            <div class="mono" style="font-size:11px;color:var(--ink-mute);text-transform:uppercase;letter-spacing:0.1em">
              © 2015 — 2026 ATMO Studio
            </div>
            <div style="display:flex;gap:18px">
              <a href="terms.html" style="font-size:13px;color:var(--ink-soft);text-decoration:none">Условия</a>
              <a href="privacy.html" style="font-size:13px;color:var(--ink-soft);text-decoration:none">Политика</a>
            </div>
          </div>
        </div>
      </footer>
    `;
  }
};

window.ATMO.head = `
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=DM+Sans:ital,opsz,wght@0,9..40,300..700;1,9..40,300..700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="shared/styles.css">
`;

/* Goal figure SVGs — one per goal, consistent line-art style */
window.ATMO.goalIcon = function(goal) {
  const S = 'stroke="rgba(26,26,31,0.22)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"';
  const wrap = (inner) =>
    `<svg class="ph-fig" viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" ${S}>${inner}</svg>`;

  const figures = {
    // running / stride — diagonal posture, arms & legs spread
    energy: wrap(`
      <circle cx="80" cy="18" r="9"/>
      <line x1="76" y1="27" x2="62" y2="48"/>
      <line x1="70" y1="34" x2="83" y2="44"/>
      <line x1="70" y1="34" x2="54" y2="24"/>
      <line x1="62" y1="48" x2="44" y2="72"/>
      <line x1="62" y1="48" x2="74" y2="66"/>
    `),
    // arm-overhead stretch — one arm sweeps up in a curve
    mobility: wrap(`
      <circle cx="60" cy="14" r="9"/>
      <line x1="60" y1="23" x2="60" y2="48"/>
      <path d="M60 30 C52 24 42 20 32 18"/>
      <line x1="60" y1="32" x2="78" y2="44"/>
      <line x1="60" y1="48" x2="46" y2="72"/>
      <line x1="60" y1="48" x2="74" y2="72"/>
    `),
    // power pose — elbows-out bent arms, wide stance
    strength: wrap(`
      <circle cx="60" cy="14" r="9"/>
      <line x1="60" y1="23" x2="60" y2="48"/>
      <polyline points="60,30 44,24 40,38"/>
      <polyline points="60,30 76,24 80,38"/>
      <line x1="60" y1="48" x2="40" y2="72"/>
      <line x1="60" y1="48" x2="80" y2="72"/>
    `),
    // seated cross-legged — curved spine, resting arms, arc base
    recovery: wrap(`
      <circle cx="60" cy="14" r="9"/>
      <path d="M60 23 C58 34 58 42 60 46"/>
      <line x1="60" y1="32" x2="44" y2="44"/>
      <line x1="60" y1="32" x2="76" y2="44"/>
      <path d="M36 60 C44 50 76 50 84 60"/>
      <line x1="34" y1="60" x2="46" y2="70"/>
      <line x1="86" y1="60" x2="74" y2="70"/>
    `),
  };
  return figures[goal] || figures.energy;
};

window.ATMO.pillClass = function(subtitle) {
  if (subtitle === 'Новинка') return 'pill-teal';
  if (subtitle === 'Скидка')  return 'pill-rose';
  return 'pill-ink';
};

window.ATMO.productCardHTML = function (p) {
  const goal = ATMO.GOALS[p.goal];
  return `
    <a class="product-card" href="product.html?id=${p.id}">
      <div class="ph ${p.tint}" style="aspect-ratio: 4/3">
        ${ATMO.goalIcon(p.goal)}
        <span class="ph-label">${p.title.toLowerCase()}</span>
        ${p.subtitle ? `<span class="pill ${ATMO.pillClass(p.subtitle)}" style="position:absolute;top:14px;left:14px">${p.subtitle}</span>` : ''}
      </div>
      <div class="product-card-body">
        <div class="product-card-meta">
          <span style="width:6px;height:6px;border-radius:999px;background:${goal.accent}"></span>
          ${goal.label} · ${p.duration} · ${p.sessionLen}
        </div>
        <h3 class="product-card-title">${p.title}</h3>
        <p style="margin:0;color:var(--ink-soft);font-size:14px;line-height:1.5">${p.summary}</p>
        <div class="product-card-foot">
          <div class="product-card-price">
            <span class="amount">${ATMO.formatPrice(p.price)}</span>
            ${p.oldPrice ? `<span class="strike">${ATMO.formatPrice(p.oldPrice)}</span>` : ''}
          </div>
          <span class="product-card-arrow">→</span>
        </div>
      </div>
    </a>
  `;
};
