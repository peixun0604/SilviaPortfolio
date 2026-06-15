/* ── entrance: stagger hero + scroll reveal ── */
requestAnimationFrame(() => document.body.classList.add('loaded'));

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 70);
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.fade-up').forEach(el => io.observe(el));

/* ── bridge mockup: gentle scroll parallax ── */
(function () {
  const mock = document.getElementById('bridgeMock');
  if (!mock) return;
  let ticking = false;
  function update() {
    const r = mock.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    // progress: -1 (below view) → 1 (above view), 0 when centered
    const prog = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
    const clamped = Math.max(-1, Math.min(1, prog));
    mock.style.transform = 'translateY(' + (clamped * -26).toFixed(1) + 'px)';
    ticking = false;
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();

/* ── before/after drag compare (+ auto-demo) ── */
(function () {
  const cmp = document.getElementById('baCompare');
  if (!cmp) return;
  let dragging = false;
  let demoed = false;
  let demoTimers = [];

  function set(pct) { cmp.style.setProperty('--pos', Math.max(2, Math.min(98, pct)) + '%'); }
  function setFromX(clientX) {
    const r = cmp.getBoundingClientRect();
    set(((clientX - r.left) / r.width) * 100);
  }

  function stopDemo() {
    demoTimers.forEach(clearTimeout); demoTimers = [];
    cmp.classList.remove('demoing', 'hinting');
  }
  function userTakeover() {
    stopDemo();
    cmp.classList.add('touched');   // fade out hint pill
  }

  // auto-demo: sweep the divider once when scrolled into view
  function runDemo() {
    if (demoed) return; demoed = true;
    cmp.classList.add('demoing', 'hinting');
    const seq = [[82, 350], [18, 1450], [55, 2550], [50, 3650]];
    seq.forEach(([pos, t]) => demoTimers.push(setTimeout(() => set(pos), t)));
    // drop the smooth-transition class after the sweep so dragging stays snappy
    demoTimers.push(setTimeout(() => cmp.classList.remove('demoing'), 4750));
  }
  const demoIO = new IntersectionObserver((ents) => {
    ents.forEach((e) => { if (e.isIntersecting) { runDemo(); demoIO.disconnect(); } });
  }, { threshold: 0.2 });
  demoIO.observe(cmp);

  cmp.addEventListener('pointerdown', (e) => {
    dragging = true; userTakeover();
    cmp.setPointerCapture(e.pointerId);
    setFromX(e.clientX);
  });
  cmp.addEventListener('pointermove', (e) => { if (dragging) setFromX(e.clientX); });
  cmp.addEventListener('pointerup', (e) => { dragging = false; try { cmp.releasePointerCapture(e.pointerId); } catch (_) {} });
  cmp.addEventListener('pointercancel', () => { dragging = false; });
  // also dismiss hint on first hover
  cmp.addEventListener('pointerenter', () => cmp.classList.add('touched'), { once: true });
})();
