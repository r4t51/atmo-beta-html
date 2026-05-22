function Nav({ tweaks }) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    padding: '14px 0',
    background: scrolled ? 'color-mix(in srgb, var(--bg) 88%, transparent)' : 'transparent',
    backdropFilter: scrolled ? 'saturate(140%) blur(10px)' : 'none',
    WebkitBackdropFilter: scrolled ? 'saturate(140%) blur(10px)' : 'none',
    borderBottom: scrolled ? '1px solid var(--line)' : '1px solid transparent',
    transition: 'background .25s ease, border-color .25s ease',
  };

  return (
    <nav style={navStyle} data-screen-label="00 Nav">
      <div className="container page-nav-row">
        {/* Left: brand */}
        <a href="#top" className="brand-mark">
          <AtmoMark size={24} />
          <span className="brand-name">atmo</span>
          <span className="brand-sub">studio</span>
        </a>

        {/* Center: nav links */}
        <div className="nav-links">
          <a href="index.html" className="nav-link active">Главная</a>
          <a href="catalog.html" className="nav-link">Каталог</a>
          <a href="courses.html" className="nav-link">Мои курсы</a>
          <a href="account.html" className="nav-link">Кабинет</a>
        </div>

        {/* Right: cart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <a className="cart-btn" href="cart.html" aria-label="Корзина">
            <span>Корзина</span>
            <span className="cart-count">1</span>
          </a>
        </div>
      </div>
    </nav>
  );
}

const navLinkStyle = {
  color: 'var(--ink-soft)',
  textDecoration: 'none',
  fontSize: 14,
  fontWeight: 500,
};

// ATMO mark: letter-A form — two rounded strokes meeting at apex + teal dot accent.
// Rose = dominant left leg; teal = shorter right element + dot at foot.
// ViewBox 36×36 (square). Drawing order: teal right (behind) → rose left → teal dot.
function AtmoMark({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden="true"
         style={{ flexShrink: 0 }}>
      {/* Right element — teal, from apex down-right */}
      <line x1="18" y1="6" x2="27" y2="28"
            stroke="var(--primary)" strokeWidth="7.5" strokeLinecap="round"/>
      {/* Left leg — rose, dominant, from apex to lower-left */}
      <line x1="18" y1="6" x2="6" y2="31"
            stroke="var(--secondary)" strokeWidth="9" strokeLinecap="round"/>
      {/* Dot accent — teal circle at the foot of the left leg */}
      <circle cx="6" cy="31" r="4.5" fill="var(--primary)"/>
    </svg>
  );
}

window.Nav = Nav;
window.AtmoMark = AtmoMark;
