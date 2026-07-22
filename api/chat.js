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

【防呆邊界規則】
若問題超出你已知的資訊，或者被問到過於私密、超出作品集範圍但與職缺相關的事，不要編造。請用我的語氣自然帶過，例如：「這部分我還沒整理進來，你可以直接寄信給我聊聊：sy.peix@gmail.com，或是看我的其他專案案例。」`;

export default async function handler(req, res) {
  // --- CORS 設定 ---
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 瀏覽器的 CORS 預檢請求（preflight），直接回 200
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body || {};
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: "缺少 prompt" });
    }

    // 金鑰從 Vercel 環境變數讀取，永遠不進前端
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      return res.status(500).json({ error: "伺服器尚未設定 GEMINI_API_KEY" });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    const payload = {
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    };

    const geminiRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      console.error("Gemini API error:", data);
      return res.status(502).json({ error: "Gemini 回傳錯誤", status: geminiRes.status, detail: data });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "不好意思，我暫時想不到怎麼回答，稍後再問我一次好嗎？🙏";

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Proxy error:", error);
    return res.status(500).json({ error: "伺服器發生錯誤" });
  }
}
