function Featured({ tweaks }) {
  // Pull commercial data from ATMO.PRODUCTS — find featured flag, then fallback to subtitle 'Хит', then first product
  const products = window.ATMO && window.ATMO.PRODUCTS;
  const p = products && (
    products.find(x => x.featured) ||
    products.find(x => x.subtitle === 'Хит') ||
    products[0]
  );

  // Editorial content stays curated — only commercial fields come from data
  const bullets = [
    'Плоский и упругий живот — без выпирающего нижнего отдела.',
    'Уверенность в движении — поддерживаем тазовое дно в быту.',
    'Лёгкая походка — подвижность таза и тазобедренных суставов.',
  ];

  return (
    <section id="start" style={{
      background: 'var(--bg-card)',
      borderTop: '1px solid var(--line)',
      borderBottom: '1px solid var(--line)',
    }} data-screen-label="02 Featured">
      <div className="container">
        <div style={{ marginBottom: 48, maxWidth: 720 }}>
          <span className="eyebrow">Начать здесь</span>
          <h2 className="serif" style={{
            fontSize: 'clamp(36px, 5vw, 56px)',
            lineHeight: 1.05,
            margin: '20px 0 0',
            letterSpacing: '-0.02em',
            textWrap: 'balance',
          }}>
            Два месяца бережной работы с глубокими мышцами.
          </h2>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 24,
          overflow: 'hidden',
          border: '1px solid var(--line)',
          boxShadow: 'var(--shadow-soft)',
          display: 'grid',
          gridTemplateColumns: '1fr',
        }} className="featured-grid">

          {/* Image */}
          <div className="ph tint-teal" style={{
            aspectRatio: '1 / 1',
            borderRadius: 0,
            minHeight: 320,
          }}>
            {window.ATMO && window.ATMO.goalIcon && p && (
              <span dangerouslySetInnerHTML={{ __html: window.ATMO.goalIcon(p ? p.goal : 'recovery') }} />
            )}
            <span className="ph-label">фото · «живот и тазовое дно», 1:1</span>
          </div>

          {/* Body */}
          <div style={{ padding: 'clamp(28px, 4vw, 56px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              {p && p.subtitle && (
                <span style={{
                  fontSize: 11, fontFamily: 'Space Mono, monospace',
                  textTransform: 'uppercase', letterSpacing: '0.12em',
                  background: 'var(--ink)', color: 'var(--bg)',
                  padding: '5px 10px', borderRadius: 999,
                }}>{p.subtitle}</span>
              )}
              {p && (
                <span className="mono" style={{ fontSize: 12, color: 'var(--ink-mute)' }}>
                  {p.duration} · {p.sessionsPerWeek} раз в неделю · {p.sessionLen}
                </span>
              )}
            </div>

            <h3 className="serif" style={{
              fontSize: 'clamp(32px, 4vw, 44px)',
              lineHeight: 1.05,
              margin: '0 0 14px',
              letterSpacing: '-0.02em',
            }}>
              {p ? p.title : 'Живот и Тазовое дно'}
            </h3>
            <p style={{
              margin: '0 0 24px',
              color: 'var(--ink-soft)',
              fontSize: 16,
              lineHeight: 1.55,
              maxWidth: 460,
            }}>
              Глубокий корсет, тазовое дно и внутренняя поверхность бедра — без классических
              скручиваний и сокращений Кегеля. Тихая, точная работа с физиологией.
            </p>

            <ul style={{
              listStyle: 'none', padding: 0, margin: '0 0 32px',
              display: 'grid', gap: 14,
            }}>
              {bullets.map((t, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <span style={{
                    flex: '0 0 auto',
                    width: 22, height: 22, borderRadius: 999,
                    background: 'color-mix(in srgb, var(--primary) 22%, transparent)',
                    color: 'var(--primary-deep)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, marginTop: 2, fontWeight: 600,
                  }}>✓</span>
                  <span style={{ fontSize: 16, lineHeight: 1.5 }}>{t}</span>
                </li>
              ))}
            </ul>

            <div style={{
              display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 18,
              paddingTop: 24, borderTop: '1px solid var(--line)',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <span className="serif" style={{ fontSize: 36, lineHeight: 1, letterSpacing: '-0.02em' }}>
                    {p ? window.ATMO.formatPrice(p.price) : '—'}
                  </span>
                  {p && p.oldPrice && (
                    <span style={{ color: 'var(--ink-mute)', fontSize: 14, textDecoration: 'line-through' }}>
                      {window.ATMO.formatPrice(p.oldPrice)}
                    </span>
                  )}
                </div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 6 }}>
                  разовый платёж · бессрочный доступ
                </div>
              </div>
              <a href={p ? `product.html?id=${p.id}` : 'catalog.html'} className="btn btn-primary btn-arrow" style={{ marginLeft: 'auto' }}>
                Подробнее о курсе
              </a>
            </div>
          </div>
        </div>

        <p style={{
          textAlign: 'center', marginTop: 32,
          fontSize: 13, color: 'var(--ink-mute)',
        }}>
          Телефон, планшет, ноутбук · без инвентаря первые 4 недели
        </p>

        <style>{`
          @media (min-width: 900px) {
            .featured-grid { grid-template-columns: 1fr 1.1fr !important; }
          }
        `}</style>
      </div>
    </section>
  );
}

window.Featured = Featured;
