/* ============================ DATA ============================ */
const CAPS = [
  { img: "assets/icon-product.png", label: "Product Strategy", pos: "tr",
    exp: "全聯電商 PO：0→1 建置 LINE 生態系，分析 PXPay 會員狀態，設計階段性綁定 Roadmap 與「功能解鎖」機制，橫向推動產品落地。" },
  { img: "assets/icon-flow.png", label: "User flow & experience optimization", pos: "l",
    exp: "Traiwan 旅宿 SaaS：撰寫 PRD、以 MVP 思維排序需求，重做 UI/UX 與低 friction 綁定流程，提升易用性與轉換。" },
  { img: "assets/icon-growth.png", label: "Data-driven Growth", pos: "bl",
    exp: "LINE 渠道收益 360萬 → 3,000萬、綁定率 13% → 42%；建立 Persona × 標籤策略回傳 Data Warehouse，支援 CRM 分眾與 LLM 選品。" },
  { img: "assets/icon-collab.png", label: "Cross-team collaboration", pos: "br",
    exp: "橫跨 IT、行銷、運營與外部廠商：需求拆解、後台欄位規劃、UAT 驗證到上線，多方對齊推動交付。" },
];

// position config: angle (deg, 0=right, clockwise) + popover direction
const CAP_POS = {
  tr: { ang: -42, dir: "below" },
  l:  { ang: 200, dir: "below" },
  bl: { ang: 138, dir: "above" },
  br: { ang: 40,  dir: "above" },
};

// chat answers: string OR array of segments {t, pre} (pre = ms pause before this bubble)
const CHAT_BTNS = [
  { btn: "三個 emoji 形容 Silvia", q: "用三個 emoji 形容 Silvia",
    a: [
      { t: "🧩👀✨☕️" },
      { t: "代表什麼意思？", pre: 800 },
      { t: "🧩 一直在學習，也一直在探索，每段經驗都在拼湊下一階段的自己\n👀 對世界保持高度好奇與觀察\n✨ 相信好的定義不只追求 60 分，而是能讓人眼睛一亮\n☕️ 喜歡聊天、觀察人、交換觀點，很多想法都是在對話中長出來的", pre: 600 },
    ] },
  { btn: "朋友都找你聊什麼？", q: "朋友都找你聊什麼？",
    a: "很有趣的是，朋友常常會跑來問我一些有爭議的問題。可能是感情、職涯、社會議題，甚至是一些大家很容易吵起來的話題。\n\n我不一定認同對方的觀點，但總是好奇：「你為什麼會這樣想？」\n\n所以很多時候觀點不同，最後不一定被對方說服，但彼此可以互相理解。我相信這也是 PM 跨團隊溝通、面對不同利害關係人的重要技能。" },
  { btn: "最近一次改變想法是？", q: "最近一次改變想法是什麼時候？",
    a: "這題我可能需要從幾個角度來看。\n\n過去我比較傾向相信「準備好再開始」，但最近的經驗讓我開始更接受「邊做邊學」。尤其是在接觸 AI、Vibe Coding、以及開始嘗試做個人作品集網站之後，我發現很多東西其實不是想清楚才開始，而是開始之後才會變清楚。\n\n這個轉變讓我慢慢從「想把事情做完美」，變成「先把東西做出來再迭代」。" },
  { btn: "為什麼想當 PM", q: "為什麼想當 PM？",
    a: "老實說，我後來才發現自己好像一直都在做 PM 的事情。不管是做 UI/UX、行銷規劃，還是 CRM 專案，我最有興趣的部分通常都不是執行本身，而是：「使用者真正遇到什麼問題？」、「我們到底想解決什麼？」、「怎麼讓不同角色一起把事情做好？」\n\n我喜歡從模糊的需求開始，一路定義問題、拆解目標、協調資源，最後看到產品或專案真的被做出來。\n\n所以與其說我想轉職 PM，我更像是在替自己找到一個更貼近本質的職稱。" },
];

// context for the Claude-powered free input
const BIO = "Silvia Yang，產品/成長/體驗設計背景。現任全聯全電商數據行銷專員，以 Product Owner 角色 0→1 建置 LINE 生態系會員數據閉環，讓 LINE 渠道收益從 360 萬成長到 3000 萬、綁定率從 13% 提升到 42%。曾在 take! Martech 做 B2B 行銷企劃（KOC 口碑、Sales Kit），在 Traiwan 做旅宿 SaaS 的 UIUX 設計與 PRD。擅長把模糊需求定義成問題、跨團隊協調、用數據驗證。個性好奇、愛觀察人、喜歡把混亂整理清楚，下班會運動打沙包紓壓。擁有 Google AI Essentials、紅點設計概念獎入圍、IPAS 色彩規劃管理師。";
const FALLBACK_REPLY = "這題可能交給 Silvia 本人回答最準 🙂\n👉 sy.peix@gmail.com";

const PROJECTS = [
  {
    meta: "2026 · Product Owner",
    h: '如果用戶已經存在，<br/>為什麼 <span class="accent">User Flow</span> 還在<br/>假設他們是新客？',
    lede: "從會員行為數據找到切入點，<br/>重新定義 TA、設計階段性低摩擦路徑。",
    metric: { label: "Binding Rate", from: "13%", to: "42%", sub: "· 4 months" },
    art: "assets/cover-1.svg",
    link: "case-px/PX Case Study.html",
  },
  {
    meta: "2023–2024 · Marketing",
    h: '所有答案都在簡報裡<br/>但<span class="accent">沒有人看見</span>',
    lede: "跑了幾場提案會議之後，從觀察品牌痛點到重整提案內容，<br/>一份 B2B Sales Kit 的完整改造。",
    art: "assets/cover-2.svg",
    link: "case-take/Take Case Study.html",
  },
  {
    meta: "2023–2024 · UIUX Design",
    h: 'UI 升級了<br/><span class="accent">照片</span>卻還是十年前的',
    lede: "從介面設計到攝影方案，<br/>補足 SaaS 官網模版的最後一塊缺口。",
    art: "assets/cover-3.svg",
    link: "case-traiwan/Traiwan Case Study.html",
  },
];

/* ============================ helpers ============================ */
const $ = (s, r = document) => r.querySelector(s);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rand = (a, b) => a + Math.random() * (b - a);
function escapeHtml(s) { const d = document.createElement("div"); d.textContent = s; return d.innerHTML; }

/* ============================ RING ============================ */
function buildRing() {
  const stage = $("#ringStage");
  CAPS.forEach((c, i) => {
    const cfg = CAP_POS[c.pos];
    const el = document.createElement("div");
    el.className = "clabel " + cfg.dir;
    el.innerHTML =
      '<div class="chip">' + (c.img ? '<img class="cic" src="' + c.img + '" alt="" />' : '') + '<span>' + c.label + '</span></div>' +
      '<div class="pop"><div class="h">' + c.label + '</div>' + c.exp + '</div>';
    stage.appendChild(el);
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      document.querySelectorAll(".clabel.open").forEach((o) => { if (o !== el) o.classList.remove("open"); });
      el.classList.toggle("open");
    });
  });

  placeRing();
  window.addEventListener("resize", placeRing);

  function placeRing() {
    const size = stage.clientWidth;
    const cx = size / 2, cy = size / 2, r = size * 0.5;
    stage.querySelectorAll(".clabel").forEach((el, i) => {
      const ang = (CAP_POS[CAPS[i].pos].ang * Math.PI) / 180;
      el.style.left = (cx + r * Math.cos(ang)) + "px";
      el.style.top = (cy + r * Math.sin(ang)) + "px";
    });
  }
}
document.addEventListener("click", () => {
  document.querySelectorAll(".clabel.open").forEach((o) => o.classList.remove("open"));
});

function triggerRing() {
  $("#aboutInner").classList.add("in");
}

/* ============================ CHAT ============================ */
let typing = false;
const queue = [];
let chatStarted = false;

function msgsEl() { return $("#msgs"); }
function startChat() {
  if (chatStarted) return;
  chatStarted = true;
  msgsEl().classList.add("active");
}
function addBubble(role, html) {
  const d = document.createElement("div");
  d.className = "msg " + role;
  const b = document.createElement("div");
  b.className = "bubble";
  b.innerHTML = html;
  d.appendChild(b);
  msgsEl().appendChild(d);
  scrollChat();
  return b;
}
function scrollChat() { const m = msgsEl(); m.scrollTop = m.scrollHeight; }

function enqueue(q, a) {
  startChat();
  queue.push({ q, a });
  if (!typing) runQueue();
}
async function runQueue() {
  if (!queue.length) { typing = false; setControls(true); return; }
  typing = true; setControls(false);
  const { q, a } = queue.shift();
  addBubble("user", escapeHtml(q));
  // resolve async answers (Claude)
  let answer = a;
  if (typeof a === "function") {
    const thinking = addBubble("bot", '<span class="dots"><i></i><i></i><i></i></span>');
    await sleep(rand(500, 800));
    try { answer = await a(); } catch (e) { answer = FALLBACK_REPLY; }
    thinking.closest(".msg").remove();
  }
  const segs = Array.isArray(answer) ? answer : [{ t: answer }];
  for (const seg of segs) {
    if (seg.pre) await sleep(seg.pre);
    const bubble = addBubble("bot", '<span class="dots"><i></i><i></i><i></i></span>');
    await sleep(rand(600, 900));
    bubble.textContent = "";
    await typeInto(bubble, seg.t);
  }
  runQueue();
}
async function typeInto(el, text) {
  for (const ch of text) {
    el.textContent += ch;
    scrollChat();
    let d = rand(20, 55);
    if ("，、".includes(ch)) d += 300;
    else if ("。！？）)".includes(ch)) d += 550;
    await sleep(d);
  }
}
function setControls(on) {
  $("#sendBtn").disabled = !on;
  document.querySelectorAll("#chips button").forEach((b) => (b.disabled = !on));
}

// free-input: Claude in preview, canned fallback when unavailable (e.g. GitHub Pages)
function aiAnswer(q) {
  return async () => {
    if (window.claude && typeof window.claude.complete === "function") {
      const prompt =
        "你是 Silvia 的朋友，用輕鬆自然的第一人稱（我）代替她回答訪客的問題，風格親切、口語、不正式，使用繁體中文，控制在 2–4 句。\n\n" +
        "關於 Silvia：" + BIO + "\n\n訪客問：「" + q + "」\n\n用 Silvia 的第一人稱回答：";
      const text = await window.claude.complete(prompt);
      return (text || "").trim() || FALLBACK_REPLY;
    }
    return FALLBACK_REPLY;
  };
}

function buildChips() {
  const wrap = $("#chips");
  CHAT_BTNS.forEach((c) => {
    const b = document.createElement("button");
    b.textContent = c.btn;
    b.addEventListener("click", () => enqueue(c.q, c.a));
    wrap.appendChild(b);
  });
}
function initChatForm() {
  const form = $("#chatForm"), input = $("#chatInput");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = input.value.trim();
    if (!v || typing) return;
    enqueue(v, aiAnswer(v));
    input.value = "";
  });
  input.addEventListener("focus", () => form.classList.add("focus"));
  input.addEventListener("blur", () => form.classList.remove("focus"));
}

/* ============================ PROJECTS (sticky page-turn) ============================ */
let pcards = [];
function buildProjects() {
  const track = $("#projTrack"), dots = $("#projDots");
  PROJECTS.forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "pcard" + (i === 0 ? " active" : "");
    let metricHtml = "";
    if (p.metric) {
      metricHtml =
        '<div class="metric"><div class="ml">' + p.metric.label + '</div>' +
        '<div class="mv">' + p.metric.from + '<span class="ar">→</span>' + p.metric.to +
        '<span class="sub">' + p.metric.sub + '</span></div></div>';
    }
    var viewHref = p.link || "#";
    var viewLabel = p.link ? 'view the project <span>↗</span>' : 'coming soon';
    card.innerHTML =
      '<div class="pcard-card">' +
        '<div class="pcard-content">' +
          '<div class="meta">' + p.meta + '</div>' +
          '<h3>' + p.h + '</h3>' +
          '<p class="lede">' + p.lede + '</p>' +
          '<div class="row">' +
            '<a class="view-btn' + (p.link ? '' : ' disabled') + '" href="' + viewHref + '">' + viewLabel + '</a>' +
            metricHtml +
          '</div>' +
        '</div>' +
        '<div class="pcard-art">' + artHtml(p.art) + '</div>' +
      '</div>';
    track.appendChild(card);
    pcards.push(card);

    const dot = document.createElement("button");
    dot.className = "proj-dot" + (i === 0 ? " on" : "");
    if (i === 0) dot.classList.add("on");
    dot.setAttribute("aria-label", "project " + (i + 1));
    dots.appendChild(dot);
  });
}
function artHtml(kind) {
  return '<img class="cover-img" src="' + kind + '" alt="" />';
}

function initProjectScroll() {
  const scroll = $("#projScroll"), sticky = $("#projSticky");
  const bgs = document.querySelectorAll(".proj-bg");
  const dots = document.querySelectorAll("#projDots button");
  const n = PROJECTS.length;
  let cur = 0;
  const mobile = () => window.matchMedia("(max-width:720px)").matches;

  function setActive(idx) {
    if (idx === cur) return;
    pcards.forEach((c, i) => {
      c.classList.remove("active", "exit-up");
      if (i === idx) c.classList.add("active");
      else if (i < idx) c.classList.add("exit-up");
    });
    bgs.forEach((b, i) => (b.style.opacity = i === idx ? "1" : "0"));
    dots.forEach((d, i) => d.classList.toggle("on", i === idx));
    cur = idx;
  }
  function onScroll() {
    if (mobile()) return;
    const rect = scroll.getBoundingClientRect();
    const total = scroll.offsetHeight - window.innerHeight;
    const prog = Math.min(1, Math.max(0, -rect.top / total));
    const idx = Math.min(n - 1, Math.floor(prog * n + 0.0001));
    setActive(idx);
  }
  // dot click → scroll to that segment
  dots.forEach((d, i) => d.addEventListener("click", () => {
    if (mobile()) { pcards[i].scrollIntoView({ behavior: "smooth", block: "center" }); return; }
    const total = scroll.offsetHeight - window.innerHeight;
    const y = scroll.offsetTop + (i + 0.5) / n * total;
    window.scrollTo({ top: y, behavior: "smooth" });
  }));

  window.addEventListener("scroll", onScroll, true);
  window.addEventListener("resize", onScroll);
  onScroll();
}

/* ============================ NAV + REVEAL ============================ */
function initNav() {
  const nav = $("#nav"), hero = $("#hero");
  let ticking = false;
  function update() { nav.classList.toggle("show", hero.getBoundingClientRect().bottom < window.innerHeight * 0.2); }
  function onScroll() { if (ticking) return; ticking = true; requestAnimationFrame(() => { update(); ticking = false; }); }
  window.addEventListener("scroll", onScroll, true);
  window.addEventListener("resize", onScroll);
  update();
}
function initReveal() {
  const els = [].slice.call(document.querySelectorAll(".reveal"));
  let aboutDone = false;
  function check() {
    const vh = window.innerHeight;
    for (let i = els.length - 1; i >= 0; i--) {
      const r = els[i].getBoundingClientRect();
      if (r.top < vh * 0.88 && r.bottom > 0) { els[i].classList.add("in"); els.splice(i, 1); }
    }
    if (!aboutDone) {
      const a = $("#aboutInner").getBoundingClientRect();
      if (a.top < vh * 0.7 && a.bottom > vh * 0.3) { aboutDone = true; triggerRing(); }
    }
  }
  let ticking = false;
  function onScroll() { if (ticking) return; ticking = true; requestAnimationFrame(() => { check(); ticking = false; }); }
  check();
  window.addEventListener("scroll", onScroll, true);
  window.addEventListener("resize", onScroll);
  // safety nets
  setTimeout(() => { document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in")); }, 3000);
  setTimeout(() => { if (!aboutDone) { aboutDone = true; triggerRing(); } }, 3500);
}

/* ============ HERO+ABOUT mouse-tracking aurora ============ */
function initHeroGlow() {
  const wrap = document.querySelector(".hero-about-wrap");
  const peach = $("#igPeach");
  const pink = $("#igPink");
  if (!wrap || !peach || !pink) return;

  let tx, ty, x1, y1, x2, y2, visible = true, raf = null;

  function reset() {
    const r = wrap.getBoundingClientRect();
    tx = r.width * 0.82; ty = r.height * 0.12;
    x1 = tx; y1 = ty; x2 = tx; y2 = ty;
    render();
  }
  function render() {
    peach.style.transform = "translate(" + x1 + "px," + y1 + "px) translate(-50%,-50%)";
    pink.style.transform = "translate(" + x2 + "px," + y2 + "px) translate(-50%,-50%)";
  }
  wrap.addEventListener("mousemove", (e) => {
    const r = wrap.getBoundingClientRect();
    tx = e.clientX - r.left; ty = e.clientY - r.top;
    if (!raf && visible) loop();
  });
  function loop() {
    x1 += (tx - x1) * 0.09; y1 += (ty - y1) * 0.09;
    x2 += (tx - x2) * 0.045; y2 += (ty - y2) * 0.045;
    render();
    const settled = Math.abs(tx - x1) < 0.4 && Math.abs(ty - y1) < 0.4 && Math.abs(tx - x2) < 0.4 && Math.abs(ty - y2) < 0.4;
    raf = settled ? null : requestAnimationFrame(loop);
  }
  const io = new IntersectionObserver((es) => { visible = es[0].isIntersecting; }, { threshold: 0.01 });
  io.observe(wrap);
  window.addEventListener("resize", reset);
  reset();
}

/* ============================ INIT ============================ */
buildRing();
buildChips();
initChatForm();
buildProjects();
initProjectScroll();
initNav();
initReveal();
initHeroGlow();
