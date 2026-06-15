/* ── entrance + scroll reveal ── */
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

/* ── embedded charts (real LINE OA data) ── */
const MONTHS = ["Jan '26", "Feb '26", "Mar '26", "Apr '26", "May '26"];
const FRIENDS = [62438, 104148, 111761, 124198, 140982];
const BOUND   = [8343, 19821, 26912, 39941, 58799];
const RATE    = [13.4, 19.0, 24.1, 32.2, 41.7];

if (window.Chart) {
  Chart.defaults.color = '#908D87';
  Chart.defaults.font.family = "'Plus Jakarta Sans', 'Noto Sans TC', sans-serif";
  Chart.defaults.font.size = 11;
  const GRID = { color: 'rgba(214,208,194,.45)' };

  function start() {
    const rc = document.getElementById('cBindRate');
    const fc = document.getElementById('cFriendBound');
    if (!rc || !fc) return;

    new Chart(rc, {
      type: 'line',
      data: { labels: MONTHS, datasets: [{
        label: '綁定率', data: RATE,
        borderColor: '#3A77B4', backgroundColor: 'rgba(151,194,236,.22)',
        fill: true, tension: .4, pointRadius: 5, pointBackgroundColor: '#3A77B4', pointBorderColor: '#fff', pointBorderWidth: 2,
      }]},
      options: { responsive: true, plugins: { legend: { display: false },
        tooltip: { callbacks: { label: c => ` 綁定率: ${c.parsed.y}%` } } },
        scales: { x: { grid: { display: false } }, y: { grid: GRID, ticks: { callback: v => v + '%' }, suggestedMin: 0, suggestedMax: 50 } } }
    });

    new Chart(fc, {
      type: 'bar',
      data: { labels: MONTHS, datasets: [
        { label: '好友總數', data: FRIENDS, backgroundColor: '#97C2EC', borderRadius: 5, borderSkipped: false },
        { label: '綁定數', data: BOUND, backgroundColor: '#1F1F1F', borderRadius: 5, borderSkipped: false },
      ]},
      options: { responsive: true, plugins: { legend: { display: false },
        tooltip: { callbacks: { label: c => ` ${c.dataset.label}: ${c.parsed.y.toLocaleString()}` } } },
        scales: { x: { grid: { display: false } }, y: { grid: GRID, ticks: { callback: v => v >= 1000 ? Math.round(v/1000) + 'K' : v } } } }
    });
  }
  start();
}
