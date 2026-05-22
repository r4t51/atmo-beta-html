const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroVariant": "editorial",
  "primaryColor": "#20bec4",
  "secondaryColor": "#7377e3"
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply color tweaks to CSS vars
  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary', tweaks.primaryColor);
    root.style.setProperty('--secondary', tweaks.secondaryColor);
  }, [tweaks.primaryColor, tweaks.secondaryColor]);

  return (
    <>
      <Nav tweaks={tweaks} />
      <Hero tweaks={tweaks} />
      <Featured tweaks={tweaks} />
      <Paths tweaks={tweaks} />
      <Social tweaks={tweaks} />
      <Footer />

      <TweaksPanel title="Настройки">
        <TweakSection title="Заголовок">
          <TweakRadio
            label="Тон"
            value={tweaks.heroVariant}
            onChange={(v) => setTweak('heroVariant', v)}
            options={[
              { value: 'editorial', label: 'Журнальный' },
              { value: 'soft', label: 'Мягкий' },
              { value: 'direct', label: 'Прямой' },
            ]}
          />
        </TweakSection>
        <TweakSection title="Палитра">
          <TweakColor
            label="Основной"
            value={tweaks.primaryColor}
            onChange={(v) => setTweak('primaryColor', v)}
            options={['#20bec4', '#3a8d7a', '#c89b6b', '#1a1a1f']}
          />
          <TweakColor
            label="Дополнительный"
            value={tweaks.secondaryColor}
            onChange={(v) => setTweak('secondaryColor', v)}
            options={['#7377e3', '#b07ac9', '#e09b6e', '#5a8a8d']}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
