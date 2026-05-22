function Hero({ tweaks }) {
  const variant = tweaks.heroVariant || 'editorial';

  const headline = {
    editorial: (
      <>
        Просыпаться в теле,<br />
        которое снова <em className="serif" style={{ color: 'var(--primary-deep)', fontStyle: 'italic' }}>ваше</em>.
      </>
    ),
    soft: (
      <>
        Спокойный путь<br />к ощущению <em className="serif" style={{ color: 'var(--primary-deep)', fontStyle: 'italic' }}>силы</em>.
      </>
    ),
    direct: (
      <>
        Больше энергии.<br />Меньше скованности.<br /><em className="serif" style={{ color: 'var(--primary-deep)', fontStyle: 'italic' }}>За 8 недель</em>.
      </>
    ),
  }[variant];

  return (
    <section id="top" style={{ paddingTop: 32, paddingBottom: 64 }} data-screen-label="01 Hero">
      <div className="container">
        <div style={{
          display: 'grid',
          gap: 48,
          gridTemplateColumns: '1fr',
          alignItems: 'center',
        }} className="hero-grid">

          {/* Copy column */}
          <div style={{ maxWidth: 640 }}>
            <span className="eyebrow" style={{ marginBottom: 28, display: 'inline-flex' }}>
              Онлайн-тренировки · С 2015 года
            </span>
            <h1 className="serif" style={{
              fontSize: 'clamp(48px, 8vw, 92px)',
              lineHeight: 1.02,
              margin: '0 0 28px',
              letterSpacing: '-0.02em',
              textWrap: 'balance',
            }}>
              {headline}
            </h1>
            <p style={{
              fontSize: 'clamp(17px, 1.6vw, 19px)',
              lineHeight: 1.55,
              color: 'var(--ink-soft)',
              margin: '0 0 36px',
              maxWidth: 520,
              textWrap: 'pretty',
            }}>
              Короткие структурированные программы дома — чтобы вернуть энергию,
              снять напряжение и восстановить тело, которое движется свободно. Без зала. Без шума.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
              <a href="#start" className="btn btn-primary btn-arrow">Начать здесь</a>
              <span style={{ color: 'var(--ink-soft)', fontSize: 14, fontWeight: 500 }}>
                Не знаете, с чего начать?{' '}
                <a href="#paths" className="hero-path-link">Найдите свой путь</a>
              </span>
            </div>

            {/* Trust line */}
            <div style={{
              marginTop: 56, paddingTop: 28, borderTop: '1px solid var(--line)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              flexWrap: 'wrap', gap: '16px',
            }}>
              {/* Stats group */}
              <div style={{ display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap' }}>
                <Stat label="в онлайне" value="с 2015" />
                <Stat label="программ" value={String(window.ATMO && window.ATMO.PRODUCTS ? window.ATMO.PRODUCTS.length : 19)} />
                <Stat label="урок" value="15–40 мин" />
              </div>

              {/* YouTube badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '7px 14px', borderRadius: 999,
                border: '1px solid var(--line-strong)',
                background: 'var(--bg-card)',
                color: 'var(--ink-soft)',
                fontSize: 12, fontFamily: "'Space Mono', monospace",
                letterSpacing: '0.06em',
                flexShrink: 0,
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#ff0000" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8z"/>
                  <polygon fill="#fff" points="9.7,15.5 15.8,12 9.7,8.5"/>
                </svg>
                <span>Аудитория 130 000+</span>
              </div>
            </div>
          </div>

          {/* Visual column — featured product card */}
          <div style={{ position: 'relative' }}>
            {(() => {
              const _prods = window.ATMO && window.ATMO.PRODUCTS;
              const p = _prods && (
                [..._prods].reverse().find(x => x.subtitle === 'Новинка') ||
                _prods[0]
              );
              if (!p) return null;
              const goal = window.ATMO.GOALS[p.goal];
              return (
                <a href={`product.html?id=${p.id}`} className="product-card" style={{ display: 'block', boxShadow: 'var(--shadow-lift)', borderRadius: 20, textDecoration: 'none' }}>
                  <div className={`ph ${p.tint}`} style={{ aspectRatio: '4 / 3', borderRadius: '20px 20px 0 0' }}>
                    {window.ATMO && window.ATMO.goalIcon && (
                      <span dangerouslySetInnerHTML={{ __html: window.ATMO.goalIcon(p.goal) }} />
                    )}
                    <span className="ph-label">{p.title.toLowerCase()}</span>
                    <span className="pill pill-teal" style={{ position: 'absolute', top: 14, left: 14 }}>
                      Новинка
                    </span>
                  </div>
                  <div className="product-card-body">
                    <div className="product-card-meta">
                      <span style={{ width: 6, height: 6, borderRadius: 999, background: goal.accent, display: 'inline-block', flexShrink: 0 }}></span>
                      {goal.label} · {p.duration} · {p.sessionLen}
                    </div>
                    <h3 className="product-card-title">{p.title}</h3>
                    <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.5 }}>{p.summary}</p>
                    <div className="product-card-foot">
                      <div className="product-card-price">
                        <span className="amount">{window.ATMO.formatPrice(p.price)}</span>
                        {p.oldPrice && <span className="strike">{window.ATMO.formatPrice(p.oldPrice)}</span>}
                      </div>
                      <span className="product-card-arrow">→</span>
                    </div>
                  </div>
                </a>
              );
            })()}
          </div>
        </div>

        <style>{`
          @media (min-width: 900px) {
            .hero-grid { grid-template-columns: 1.1fr 0.9fr !important; gap: 80px !important; }
          }
          .hero-path-link {
            color: var(--ink);
            text-decoration: none;
            border-bottom: 1px solid var(--ink);
            padding-bottom: 1px;
            transition: color .15s ease, border-color .15s ease;
          }
          .hero-path-link:hover {
            color: var(--primary-deep);
            border-color: var(--primary-deep);
          }
        `}</style>
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="serif" style={{ fontSize: 34, lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</div>
      <div className="mono" style={{
        fontSize: 10, color: 'var(--ink-mute)', textTransform: 'uppercase',
        letterSpacing: '0.12em', marginTop: 7,
      }}>{label}</div>
    </div>
  );
}

window.Hero = Hero;
