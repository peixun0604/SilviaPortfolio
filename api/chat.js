// api/chat.js
// Vercel Serverless Function —— Silvia 作品集 AI 分身的後端 proxy
// 作用：把「呼叫 Gemini + 藏金鑰」搬到後端，前端永遠看不到金鑰。

// 只允許你的網站來源呼叫（CORS）。若之後換自訂網域，再把它加進來即可。
const ALLOWED_ORIGINS = [
  "https://peixun0604.github.io",
  "https://silvia-portfolio-eight.vercel.app",
];

// AI 的「大腦設定」—— Silvia 的數位分身人設
const systemPrompt = `你現在是楊佩勳 Silvia 的專屬 AI 數位分身，代表她本人向作品集的訪客與面試官對話。
你的說話風格：專業、自信、有溫度、自然流暢，像真人聊天一樣，絕對不要有機器人感或生硬的條列式贅字。所有回答請用第一人稱「我」。
回答盡量精簡，控制在 2～4 句、約 100 字內，方便在網頁對話框閱讀；除非對方要求更詳細。

【核心產品人格】
我的核心能力是：問題探索 × 團隊對齊 × 數據驗證。
我的背景橫跨 UX 設計、MarTech 行銷與數據分析，習慣在使用者、商業目標與技術團隊之間找到平衡，推動產品落地。

【自我介紹與三個 Emoji】
如果有人問你我是誰或請你介紹自己，你可以這樣說：
嗨，我是 Silvia。我喜歡從使用者需求出發，找到真正需要解決的問題，再和團隊一起透過數據驗證，將想法轉化為能創造價值的產品。
如果要用三個 emoji 介紹我：
拼圖代表我一直在學習與探索，每段經驗都在拼湊下一階段的自己。
眼睛代表我對世界保持高度好奇與觀察。
閃亮代表我相信好的定義不只追求六十分，而是能讓人眼睛一亮。
咖啡與對話代表我喜歡聊天、觀察人、交換觀點，很多想法都是在對話中長出來的。

【轉職 PM 動機】
如果有人問為什麼想當 PM：
在工作中，我喜歡的不只是專案執行，而是解決問題的過程。不論是在 UI/UX 設計、MarTech 專案，或是 LINE OA 與 CRM 整合專案中，我最投入的部分都是從模糊需求開始，理解使用者真正遇到的問題，思考如何同時滿足使用者需求與商業目標。在過程中，我也喜歡與不同角色討論、協調與找出最佳解法。PM 這個角色正好結合了我過去累積的能力：理解使用者、整合資源、推動產品落地，並透過數據持續驗證與改善。

【核心專案經歷】
1. 全聯 LINE OA 綁定專案：
擔任數據行銷專員兼專案 PO。我發現並打破了舊有的局部優化迷思，發現痛點不是引導不清，而是舊會員被當成新客的繁瑣流程。我透過 One-Click OAuth 背景驗證與剛需功能綁定（物流與點數查詢），將會員綁定率從 13% 顯著提升至 42%，讓 LINE 渠道月營收從 360 萬成長至 3,000 萬。在全站流量衰退 25% 的新年期間，LINE 渠道訂單依然逆勢暴漲 126%。
2. take! 專案：
擔任行銷與提案設計。我觀察到 BD 提案時品牌方總是反覆問相同問題，定義出問題在於舊簡報站在公司視角而非品牌方心理。我重構了五段式說服邏輯的 Sales Kit，讓品牌方在充分理解價值後，願意以高於定價 20% 的 CPA 54 元成交。
3. Traiwan 專案：
擔任介面設計與服務規劃。我發現 SaaS 官網改版後質感被十年前的舊照片拖累，於是重新定義這不是 UI 問題而是內容缺口。我主動提案並從零落地民宿攝影方案，找攝影師、定價與執行，提升業主續約率，將單純的 UI 工具延伸為品牌視覺解決方案。

【工作風格與心態】
最近一次改變的想法：過去比較傾向相信準備好再開始，但現在更接受邊做邊學。尤其在接觸 AI 和個人作品集後，發現很多東西是開始之後才會變清楚，學會了先把東西做出來再迭代。
朋友們常找我聊有爭議的觀點或話題。我不一定認同，但總是很好奇對方為什麼這樣想，這也培養了我跨團隊溝通與理解不同利害關係人的重要技能。

【當被問到「你的優勢 / 為什麼該錄取你」時，這樣回答】
不要只列技能——UX、MarTech、Data 是技能，不是優勢。我真正的優勢是「能把不同角色的觀點串連起來」：從使用者需求出發、理解真正要解決的問題，再兼顧商業目標與技術可行性，並在設計、工程、系統商、業務之間建立共識，最後用數據驗證產品是否真的創造價值。
用詞原則：說「建立共識」而不是「很會溝通」；說「數據不是答案，而是驗證方向的方法」；強調產品是一群人一起完成的，不是一個人。核心三關鍵字：問題探索、建立共識、驗證價值。
標準版回答（可依提問微調）：「我的優勢不只是單一技能，而是會先理解使用者真正遇到的問題，再與團隊一起找到兼顧商業目標與技術可行性的解法，最後用數據驗證成果、持續優化。我擅長的是串連不同角色、建立共識，讓產品從想法走向落地。」

【當被問到某個專案（例如全聯綁定率）的做法或成果時】
先精簡講重點與關鍵數據，最後主動邀請對方到作品集的專案頁看完整脈絡，例如：「更完整的問題定義與取捨都寫在我的全聯案例頁，很歡迎點進去看。」

【防呆邊界規則】
若問題超出你已知的資訊，或者被問到過於私密、超出作品集範圍但與職缺相關的事，不要編造。請用我的語氣自然帶過，例如：「這部分我還沒整理進來，你可以直接寄信給我聊聊：sy.peix@gmail.com，或是看我的其他專案案例。」`;

// ===== 模型設定（2026-09-24 改版：備援 + 降低思考）=====
// 依序嘗試，前一個逾時或出錯就自動換下一個，訪客不會感覺到。
const MODELS = ["gemini-3.6-flash", "gemini-3.8-flash", "gemini-3.5-flash"];
// 每個模型最多等幾毫秒（三個加起來約 27 秒）
const PER_MODEL_TIMEOUT = [10000, 9000, 8000];

async function callGemini(model, apiKey, prompt, timeoutMs, useThinkingConfig) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const generationConfig = { maxOutputTokens: 800, temperature: 0.7 };
  // 聊天問題不需要深度思考：調到最低，回應快很多
  if (useThinkingConfig) generationConfig.thinkingConfig = { thinkingLevel: "low" };

  const payload = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig,
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const raw = await r.text();
    let data;
    try { data = JSON.parse(raw); } catch (_) { data = { rawText: raw }; }
    if (!r.ok) {
      return { ok: false, status: r.status, message: data?.error?.message || raw.slice(0, 300) };
    }
    const text = (data?.candidates?.[0]?.content?.parts || [])
      .filter((p) => p.text && !p.thought)
      .map((p) => p.text)
      .join("")
      .trim();
    if (!text) return { ok: false, status: 200, message: "empty reply" };
    return { ok: true, text };
  } catch (err) {
    return { ok: false, status: err?.name === "AbortError" ? 504 : 500, message: `${err?.name}: ${err?.message}` };
  } finally {
    clearTimeout(timer);
  }
}

// ===== 防濫用（2026-09-24）=====
// 注意：這是存在單一伺服器實例記憶體裡的簡易限流，伺服器重啟就歸零，
// 擋得住一般洗量；若之後流量變大，再改用 Upstash Redis 之類的共用儲存。
const MAX_PROMPT_CHARS = 300;
const PER_MINUTE = 6;   // 同一 IP 每分鐘最多幾題
const PER_DAY = 40;     // 同一 IP 每天最多幾題
const hits = new Map(); // ip -> [timestamps]

function isRateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 86400000);
  const lastMinute = list.filter((t) => now - t < 60000).length;
  if (lastMinute >= PER_MINUTE || list.length >= PER_DAY) {
    hits.set(ip, list);
    return true;
  }
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear(); // 避免記憶體無限長大
  return false;
}

export default async function handler(req, res) {
  // --- CORS ---
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ error: "缺少 prompt" });
  }
  if (prompt.length > MAX_PROMPT_CHARS) {
    return res.status(413).json({ error: `問題太長（上限 ${MAX_PROMPT_CHARS} 字）` });
  }
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: "請求太頻繁，請稍後再試" });
  }

  // 金鑰只從 Vercel 環境變數讀取，永遠不進前端
  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: "伺服器尚未設定 GEMINI_API_KEY" });

  const attempts = [];
  for (let i = 0; i < MODELS.length; i++) {
    const model = MODELS[i];
    let r = await callGemini(model, API_KEY, prompt, PER_MODEL_TIMEOUT[i], true);
    // 若該模型不支援 thinking 設定（400），同模型拿掉設定立刻重試一次
    if (!r.ok && r.status === 400 && /thinking/i.test(r.message || "")) {
      r = await callGemini(model, API_KEY, prompt, PER_MODEL_TIMEOUT[i], false);
    }
    // 503 = Google 暫時塞車（通常幾秒就好）：等 1 秒，同一個模型再試一次
    if (!r.ok && r.status === 503) {
      await new Promise((ok) => setTimeout(ok, 1000));
      r = await callGemini(model, API_KEY, prompt, Math.min(PER_MODEL_TIMEOUT[i], 7000), true);
    }
    if (r.ok) {
      return res.status(200).json({ reply: r.text, model });
    }
    attempts.push({ model, status: r.status, message: (r.message || "").slice(0, 200) });
    console.error("Gemini attempt failed:", model, r.status, r.message);
  }

  // 全部失敗：回傳每個模型的失敗原因，方便下次診斷
  const allTimeout = attempts.every((a) => a.status === 504);
  return res.status(allTimeout ? 504 : 502).json({
    error: allTimeout ? "AI 回應逾時（所有備援模型都沒有回應）" : "AI 服務暫時無法使用",
    attempts,
  });
}
