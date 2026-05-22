function Paths({ tweaks }) {
  const G = window.ATMO && window.ATMO.GOALS;
  const paths = [
    {
      tag: 'Путь 01',
      title: 'Постоянная усталость',
      desc: 'Мало сил, поверхностный сон, тяжёлые утра. Мягкая программа, которая возвращает энергию без выгорания.',
      product: 'Кардио с Нуля',
      price: '389 zł',
      tint: 'tint-teal',
      goal: 'energy',
      href: 'product.html?id=cardio-zero',
    },
    {
      tag: 'Путь 02',
      title: 'Скованность и боль',
      desc: 'Зажатые бёдра, ноющая спина, плечи в напряжении. Курс на мобильность — чтобы снова двигаться легко.',
      product: 'Живот и Тазовое дно',
      price: '399 zł',
      tint: 'tint-warm',
      goal: 'recovery',
      href: 'product.html?id=belly-floor',
    },
    {
      tag: 'Путь 03',
      title: 'Хочешь видеть форму',
      desc: 'Самочувствие в порядке — но хочется тело, которое нравится в зеркале. Сила и тонус, спокойно и постепенно.',
      product: 'LevelUp: Твоя Сила',
      price: '399 zł',
      tint: 'tint-purple',
      goal: 'strength',
      href: 'product.html?id=levelup-power',
    },
  ].map(p => ({
    ...p,
    accent: G ? G[p.goal].accent : 'var(--ink-mute)',
    accentDeep: G ? G[p.goal].accentDeep : 'var(--ink)',
  }));

  return (
    <section id="paths" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }} data-screen-label="03 Paths">
      <div className="container">
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 24, marginBottom: 56,
        }}>
          <div style={{ maxWidth: 600 }}>
            <span className="eyebrow">Если это не про вас</span>
            <h2 className="serif" style={{
              fontSize: 'clamp(36px, 5vw, 56px)',
              lineHeight: 1.05,
              margin: '20px 0 0',
              letterSpacing: '-0.02em',
              textWrap: 'balance',
            }}>
              Ещё три точки входа.
            </h2>
          </div>
          <p style={{
            color: 'var(--ink-soft)', maxWidth: 360, margin: 0,
            fontSize: 15, lineHeight: 1.55,
          }}>
            Выберите то, что больше всего похоже на вашу неделю сейчас. Программу всегда можно поменять — все они стоят на одной основе.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gap: 20,
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        }}>
          {paths.map((p, i) => (
            <a key={i} href={p.href || '#'} className="path-card" style={{
              '--card-accent': p.accent,
              '--card-accent-deep': p.accentDeep,
              display: 'flex', flexDirection: 'column',
              background: 'var(--bg-card)',
              border: '1px solid var(--line)',
              borderRadius: 20,
              overflow: 'hidden',
              textDecoration: 'none',
              color: 'var(--ink)',
              transition: 'transform .25s ease, box-shadow .25s ease, border-color .25s ease',
            }}>
              <div className={`ph ${p.tint}`} style={{
                aspectRatio: '4 / 3', borderRadius: 0,
                background: !p.tint ? `repeating-linear-gradient(135deg, rgba(26,26,31,0.04) 0 1px, transparent 1px 14px), color-mix(in srgb, ${p.accent} 14%, var(--bg-warm))` : undefined,
              }}>
                <span className="ph-label">фото · {p.title.toLowerCase()}</span>
              </div>
              <div style={{ padding: 28, display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: 999, background: p.accent,
                  }}></span>
                  <span className="mono" style={{
                    fontSize: 11, color: 'var(--ink-mute)',
                    textTransform: 'uppercase', letterSpacing: '0.12em',
                  }}>{p.tag}</span>
                </div>
                <h3 className="serif" style={{
                  fontSize: 28, lineHeight: 1.1, margin: '0 0 12px',
                  letterSpacing: '-0.01em',
                }}>{p.title}</h3>
                <p style={{
                  margin: '0 0 24px', color: 'var(--ink-soft)',
                  fontSize: 15, lineHeight: 1.55, flex: 1,
                }}>{p.desc}</p>

                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  paddingTop: 20, borderTop: '1px solid var(--line)',
                }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{p.product}</div>
                    <div className="mono" style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 4 }}>
                      от {p.price}
                    </div>
                  </div>
                  <span className="path-arrow" style={{
                    width: 36, height: 36, borderRadius: 999,
                    border: '1px solid var(--line-strong)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--ink)', fontSize: 16,
                    transition: 'background .2s ease, color .2s ease, border-color .2s ease',
                  }}>→</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        <style>{`
          .path-card:hover {
            transform: translateY(-3px);
            box-shadow: var(--shadow-lift);
            border-color: var(--line-strong);
          }
          .path-card:hover .path-arrow {
            background: var(--card-accent); color: #fff; border-color: var(--card-accent);
          }
        `}</style>
      </div>
    </section>
  );
}

window.Paths = Paths;
