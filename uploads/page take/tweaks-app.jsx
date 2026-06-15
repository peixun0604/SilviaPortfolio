// Tweaks app — renders the panel and applies values to the page's CSS custom properties.
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#E8593C",
  "font": "'Plus Jakarta Sans', 'Noto Sans TC', sans-serif",
  "maxWidth": 820,
  "rhythm": 104,
  "heroMotion": true
}/*EDITMODE-END*/;

// derive a soft tint + mid from any accent hex
function tintFrom(hex, mix) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substr(0, 2), 16), g = parseInt(h.substr(2, 2), 16), b = parseInt(h.substr(4, 2), 16);
  const m = (c) => Math.round(c + (255 - c) * mix);
  return `rgb(${m(r)}, ${m(g)}, ${m(b)})`;
}

function TakeTweaks() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    const root = document.documentElement.style;
    root.setProperty('--orange', t.accent);
    root.setProperty('--orange-light', tintFrom(t.accent, 0.92));
    root.setProperty('--orange-mid', tintFrom(t.accent, 0.55));
    root.setProperty('--font-body', t.font);
    root.setProperty('--max-w', t.maxWidth + 'px');
    root.setProperty('--section-gap', t.rhythm + 'px');
    const hero = document.querySelector('.hero-graphic');
    if (hero) hero.classList.toggle('anim', !!t.heroMotion);
  }, [t]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="色彩" />
      <TweakColor label="主點綴色" value={t.accent}
        options={['#E8593C', '#C9472E', '#D98324', '#B4523F']}
        onChange={(v) => setTweak('accent', v)} />
      <TweakSection label="字體排版" />
      <TweakSelect label="內文字體" value={t.font}
        options={[
          { value: "'Plus Jakarta Sans', 'Noto Sans TC', sans-serif", label: 'Plus Jakarta Sans' },
          { value: "'Manrope', 'Noto Sans TC', sans-serif", label: 'Manrope' },
          { value: "'IBM Plex Sans', 'Noto Sans TC', sans-serif", label: 'IBM Plex Sans' }
        ]}
        onChange={(v) => setTweak('font', v)} />
      <TweakSection label="版面" />
      <TweakSlider label="內容寬度" value={t.maxWidth} min={680} max={960} step={20} unit="px"
        onChange={(v) => setTweak('maxWidth', v)} />
      <TweakSlider label="區塊間距" value={t.rhythm} min={72} max={144} step={8} unit="px"
        onChange={(v) => setTweak('rhythm', v)} />
      <TweakSection label="動態" />
      <TweakToggle label="Hero 圓環飄移" value={t.heroMotion}
        onChange={(v) => setTweak('heroMotion', v)} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<TakeTweaks />);
