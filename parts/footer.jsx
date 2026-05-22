function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--line)',
      padding: '56px 0 36px',
      background: 'var(--bg)',
    }} data-screen-label="05 Footer">
      <div className="container">
        <div style={{
          display: 'grid', gap: 32,
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          marginBottom: 48,
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <AtmoMark size={22} />
              <span className="serif" style={{ fontSize: 24, lineHeight: 1, letterSpacing: '-0.02em' }}>atmo</span>
            </div>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.55, maxWidth: 280 }}>
              Спокойные структурированные программы для женщин, которые возвращают тело, в котором приятно жить.
            </p>
          </div>

          <FooterCol title="Программы" links={[
            { label: 'Каталог', href: 'catalog.html' },
            { label: 'Мои курсы', href: 'courses.html' },
          ]} />
          <FooterCol title="Кабинет" links={[
            { label: 'Мой аккаунт', href: 'account.html' },
            { label: 'Корзина', href: 'cart.html' },
            { label: 'Вход / Регистрация', href: 'auth.html' },
          ]} />
          <FooterCol title="Студия" links={[
            { label: 'Тренер и метод', href: 'trainer.html' },
            { label: 'Instagram', href: 'https://www.instagram.com/atmo.by/' },
            { label: 'Контакты', href: '#', disabled: true },
          ]} />
        </div>

        <div style={{
          paddingTop: 24, borderTop: '1px solid var(--line)',
          display: 'flex', flexWrap: 'wrap', gap: 16,
          justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div className="mono" style={{
            fontSize: 11, color: 'var(--ink-mute)',
            textTransform: 'uppercase', letterSpacing: '0.1em',
          }}>
            © 2015 — 2026 ATMO Studio
          </div>
          <div style={{ display: 'flex', gap: 18 }}>
            <a href="terms.html" style={footerLink}>Условия</a>
            <a href="privacy.html" style={footerLink}>Политика</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

const footerLink = {
  fontSize: 13, color: 'var(--ink-soft)',
  textDecoration: 'none',
};

function FooterCol({ title, links }) {
  return (
    <div>
      <div className="mono" style={{
        fontSize: 11, color: 'var(--ink-mute)',
        textTransform: 'uppercase', letterSpacing: '0.12em',
        marginBottom: 14,
      }}>{title}</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
        {links.map((l, i) => (
          <li key={i}>
            <a href={l.href || '#'} style={{ fontSize: 14, color: 'var(--ink)', textDecoration: 'none' }}>{l.label || l}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

window.Footer = Footer;
