# Silvia Portfolio — Vibe Coding Spec
> 給 AI coding 工具使用的完整規格文件

---

## 0. 全域設定

```
Font: Plus Jakarta Sans (Google Fonts)
Accent color: #2d6a5f (teal)
Background: white (#ffffff)
Ambient blobs: magenta / purple / cyan / peach 漸層，position: fixed，z-index: 0，pointer-events: none
Max content width: 1200px，水平置中
Spacing system: 8pt grid（8 / 16 / 24 / 32 / 48px）
Layout: 單頁垂直捲動（首頁）
「view the project」按鈕預留 href 連結，暫時指向 #（待 case study 頁完成後替換）
Case study 頁：各專案獨立 HTML 檔，規格另行補充
```

---

## 1. Navigation Bar

**位置與觸發**
- 頁面初始載入時：隱藏（opacity: 0）
- 當使用者滾動離開 Hero section（scroll Y > 視窗高度 80%）時：Navigation bar 淡入固定於頂部（position: sticky / fixed top: 0）

**視覺樣式**
```
背景: backdrop-filter: blur(16px)，背景色 rgba(255,255,255,0.6)
邊框: 底部 1px solid rgba(0,0,0,0.06)
高度: 56px
內容: 左側 logo 文字「Silvia」，右側連結 About / Project / Contact
連結樣式: 14px，letter-spacing 略寬，hover 時底線滑入動畫
進場動畫: opacity 0→1，translateY -8px→0，duration 300ms ease
```

---

## 2. Hero Section — Chatbot 互動區

**整體容器**
```
寬度: 480px，圓角 16px
背景: rgba(255,255,255,0.72)，backdrop-filter: blur(12px)
邊框: 1px solid rgba(0,0,0,0.08)
padding: 24px
```

**標題列**
```
文字: "Not a Resume. Just Curious? 👋"
字級: 13px，color: #888，margin-bottom: 16px
```

**Preset Chips（第一層）**
顯示六個快速提問按鈕，初始全部顯示：

| chip 文字 |
|---|
| 三個 emoji 介紹 Silvia |
| 為什麼想當 PM |
| 朋友都找你聊什麼？ |
| 最近一次改變想法是什麼時候？ |

```
Chip 樣式: 圓角 pill，border 1px solid #e0e0e0，背景白，hover 時 border-color: #2d6a5f，transition 200ms
排列: flex wrap，gap: 8px
```

**Chip 對應回答內容（點擊後逐字顯示，模擬 typing effect）**

**chip: 三個 emoji 介紹 Silvia**
回答分三段，依序顯示：
```
第一段:
🧩👀✨☕️

第二段（停頓 800ms 後出現）:
代表什麼意思？

第三段（再停頓 600ms 後逐條出現）:
🧩 一直在學習，也一直在探索，每段經驗都在拼湊下一階段的自己
👀 對世界保持高度好奇與觀察
✨ 相信好的定義不只是只追求 60 分，而是能讓人眼睛一亮
☕️ 喜歡聊天、觀察人、交換觀點，很多想法都是在對話中長出來的
```

**chip: 為什麼想當 PM**
```
老實說，我後來才發現自己好像一直都在做 PM 的事情。不管是做 UI/UX、行銷規劃，還是 CRM 專案，我最有興趣的部分通常都不是執行本身，而是：「使用者真正遇到什麼問題？」、「我們到底想解決什麼？」、「怎麼讓不同角色一起把事情做好？」

我喜歡從模糊的需求開始，一路定義問題、拆解目標、協調資源，最後看到產品或專案真的被做出來。

所以比起說我想轉職 PM，我更像是在替自己找到一個更貼近本質的職稱。
```

**chip: 朋友都找你聊什麼？**
```
很有趣的是，朋友常常會跑來問我一些有爭議的問題。可能是感情、職涯、社會議題，甚至是一些大家很容易吵起來的話題。

我不一定認同對方的觀點，但總是好奇：「你為什麼會這樣想？」

所以很多時候觀點不同，最後不一定被對方說服，但彼此可以互相理解。相信這也是 PM 跨團隊溝通、不同利害關係人的重要技能。
```

**chip: 最近一次改變想法是什麼時候？**
```
這題我可能需要從幾個角度來看。

過去比較傾向相信「準備好再開始」，但最近的經驗讓我開始更接受「邊做邊學」。尤其是在接觸 AI、Vibe Coding、以及開始嘗試做個人作品集網站之後，我發現很多東西其實不是想清楚才開始，而是開始之後才會變清楚。

這個轉變讓我慢慢從「想把事情做完美」，變成「先把東西做出來再迭代」。
```

**自由輸入框**
```
placeholder: "What would you like to know more?"
樣式: 底部 border-bottom only，無外框，focus 時 border-color: #2d6a5f
右側送出按鈕: 圓形，背景 #1a1a1a，icon 向上箭頭，hover 背景 #2d6a5f
自由輸入連接 Anthropic API（claude-sonnet），system prompt 設定為「你是 Silvia 的朋友，用輕鬆自然的第一人稱代替她回答問題，風格親切不正式」
```

---

## 3. About Section — Core Strengths 圓形動畫

**觸發條件**
```
使用 IntersectionObserver，當 .about-section 進入畫面（threshold: 0.3）時觸發動畫
```

**圓形描邊展開動畫**
```
元素: SVG circle，strokeDasharray 設為圓周長，初始 strokeDashoffset = 圓周長（完全隱藏）
動畫: strokeDashoffset → 0，duration: 1200ms，easing: cubic-bezier(0.4, 0, 0.2, 1)
同時: 圓形整體從 rotate(-90deg) 開始旋轉至 0deg（順時針描邊展開效果）
描邊顏色: 漸層，從 magenta → cyan → teal
```

**中心文字**
```
「Core Strengths」文字
進場: opacity 0 → 1，delay 800ms（圓形快描完時才出現）
字型: Plus Jakarta Sans，weight 500，14px
```

**外圈光暈**
```
圓形描邊展開完成後，加一圈 box-shadow / filter: blur 的脈衝動畫（pulse）
keyframes: scale 1 → 1.05 → 1，opacity 0.6 → 0 → 0.6，duration 2.5s，infinite
```

---

## 4. Project Cards — Scroll-driven Animation

**整體行為**
```
三張 project card（全聯 LINE OA / B2B Sales Kit / SaaS UI）
排列在同一個高度固定的容器內（position: sticky）
使用者向下滾動時，card 在容器內「切換」，視覺上像換頁而非捲動
```

**切換動畫（Fade + Slide）**
```
當下一張 card 進入：
  - 從 translateY(40px) opacity(0) → translateY(0) opacity(1)
  - duration: 600ms，easing: ease-out

當前一張 card 離開：
  - 從 translateY(0) opacity(1) → translateY(-40px) opacity(0)
  - duration: 400ms，easing: ease-in

兩者交疊 100ms，避免空白感
```

**實作方式**
```
使用 ScrollTimeline API 或 IntersectionObserver + scroll 事件計算進度
每張 card 對應一個 scroll 區間（每段約 100vh）
容器本身 position: sticky，卡片內容絕對定位疊在一起
```

**進度指示（可選）**
```
右側或底部小點點（3個），目前顯示哪張 card 時對應小點亮起
```

---

## 5. 全站捲動動畫通則

```
所有區塊進場：IntersectionObserver（threshold: 0.15）觸發
預設進場動畫：opacity 0 → 1，translateY 24px → 0，duration 500ms，staggered delay（每個子元素間隔 80ms）
不使用 scroll-snap，讓滾動保持自然流暢
```

---

## 6. 技術堆疊建議

```
純 HTML + CSS + Vanilla JS（無框架依賴）
Chatbot 自由輸入：fetch Anthropic API /v1/messages
字型：Google Fonts CDN（Plus Jakarta Sans）
動畫：CSS keyframes + JS IntersectionObserver，不引入額外動畫函式庫
部署：GitHub Pages
```
