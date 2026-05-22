function Social({ tweaks }) {
  const testimonials = [
    {
      quote: "Думала, дело будет в весе. А перестала бояться утра. Три недели — и я просто… легче.",
      name: 'Марта К.',
      meta: '«Живот и Тазовое дно» · 6-я неделя',
      tint: 'tint-teal',
    },
    {
      quote: "Поясница будила меня в 4 утра. Уже больше месяца — нет. Только ради этого стоило начать.",
      name: 'Аня П.',
      meta: '«Кардио с Нуля» · 8-я неделя',
      tint: '',
    },
    {
      quote: "Первая программа, которую я не бросила. Тренировки короткие — реально успеваешь — и эффект накапливается быстро.",
      name: 'Оля В.',
      meta: '«Быстрая Форма 2.0» · 10-я неделя',
      tint: 'tint-purple',
    },
  ];

  return (
    <section id="testimonials" style={{ background: 'var(--bg)', borderTop: '1px solid var(--line)' }} data-screen-label="04 Social">
      <div className="container">
        <div style={{ marginBottom: 56, maxWidth: 640 }}>
          <span className="eyebrow">Их словами</span>
          <h2 className="serif" style={{
            fontSize: 'clamp(36px, 5vw, 56px)',
            lineHeight: 1.05,
            margin: '20px 0 0',
            letterSpacing: '-0.02em',
            textWrap: 'balance',
          }}>
            Небольшие изменения. <em style={{ color: 'var(--secondary-deep)' }}>Настоящие.</em>
          </h2>
        </div>

        {/* Before/after row — текстовые карточки трансформации */}
        <div style={{
          display: 'grid',
          gap: 20,
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          marginBottom: 56,
        }}>
          {[
            {
              topic: 'энергия',
              before: 'Каждый день в 15:00 — стена. Кофе, телефон, жду вечера.',
              after: 'Тот же день, только без стены. Просто иду и делаю.',
            },
            {
              topic: 'утра',
              before: 'Звонок будильника как приговор. Встаю злой и уже уставшей.',
              after: 'Встаю раньше, чем нужно. Без злости. Непривычно.',
            },
            {
              topic: 'поясница',
              before: 'Наклониться за ключами — событие. Поясница фоном всегда.',
              after: 'Не думаю о пояснице. Вот и весь результат.',
            },
          ].map((b, i) => (
            <div key={i} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--line)',
              borderRadius: 20,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1 }}>
                {/* До */}
                <div style={{
                  padding: '20px 18px 24px',
                  borderRight: '1px solid var(--line)',
                  display: 'flex', flexDirection: 'column', gap: 12,
                }}>
                  <div className="mono" style={{
                    fontSize: 10, color: 'var(--ink-mute)',
                    textTransform: 'uppercase', letterSpacing: '0.12em',
                  }}>Неделя 1</div>
                  <p style={{
                    margin: 0, fontSize: 13, lineHeight: 1.5,
                    color: 'var(--ink-soft)',
                    fontStyle: 'italic',
                  }}>{b.before}</p>
                </div>
                {/* После */}
                <div style={{
                  padding: '20px 18px 24px',
                  background: 'color-mix(in srgb, var(--primary) 6%, var(--bg-card))',
                  display: 'flex', flexDirection: 'column', gap: 12,
                }}>
                  <div className="mono" style={{
                    fontSize: 10, color: 'var(--primary-deep)',
                    textTransform: 'uppercase', letterSpacing: '0.12em',
                  }}>Неделя 8</div>
                  <p style={{
                    margin: 0, fontSize: 13, lineHeight: 1.5,
                    color: 'var(--ink)',
                    fontWeight: 500,
                  }}>{b.after}</p>
                </div>
              </div>
              <div className="mono" style={{
                fontSize: 10, color: 'var(--ink-mute)',
                textTransform: 'uppercase', letterSpacing: '0.12em',
                padding: '11px 18px',
                borderTop: '1px solid var(--line)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--primary)', display: 'inline-block', flexShrink: 0 }}></span>
                {b.topic}
              </div>
            </div>
          ))}
        </div>

        {/* Quotes */}
        <div style={{
          display: 'grid', gap: 20,
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        }}>
          {testimonials.map((t, i) => (
            <figure key={i} style={{
              margin: 0,
              background: 'var(--bg-card)',
              border: '1px solid var(--line)',
              borderRadius: 20,
              padding: 28,
              display: 'flex', flexDirection: 'column', gap: 20,
            }}>
              <div className="serif" style={{ fontSize: 40, lineHeight: 0.6, color: 'var(--ink-mute)', height: 18 }}>“</div>
              <blockquote className="serif" style={{
                margin: 0, fontSize: 22, lineHeight: 1.3,
                letterSpacing: '-0.005em', flex: 1,
                textWrap: 'pretty',
              }}>
                {t.quote}
              </blockquote>
              <figcaption style={{
                display: 'flex', alignItems: 'center', gap: 12,
                paddingTop: 18, borderTop: '1px solid var(--line)',
              }}>
                <div className={`ph ${t.tint}`} style={{
                  width: 40, height: 40, borderRadius: 999, flexShrink: 0,
                }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{t.name}</div>
                  <div className="mono" style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {t.meta}
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Closing CTA strip */}
        <div style={{
          marginTop: 72,
          padding: 'clamp(32px, 5vw, 56px)',
          borderRadius: 24,
          background: 'var(--ink)',
          color: 'var(--bg)',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24,
          justifyContent: 'space-between',
        }}>
          <div style={{ maxWidth: 540 }}>
            <h3 className="serif" style={{
              fontSize: 'clamp(28px, 3.5vw, 40px)',
              lineHeight: 1.1, margin: 0,
              letterSpacing: '-0.01em',
              textWrap: 'balance',
            }}>
              Всё ещё читаете? <span style={{ color: 'var(--primary)' }}>Начните с диагностики.</span>
            </h3>
          </div>
          <a href="#start" className="btn btn-primary btn-arrow">Начать здесь</a>
        </div>
      </div>
    </section>
  );
}

window.Social = Social;
