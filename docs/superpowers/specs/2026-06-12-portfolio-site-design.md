# 個人求職網站設計規格（張溦珊 Portfolio）

日期：2026-06-12
狀態：已驗證原型（`prototypes/homepage-v1.html`），待實作

## 1. 目標與定位

前端工程師張溦珊的求職網站：**履歷＋作品集**。網站本身就是作品——repo、CI、動畫實作都會被面試官檢視。風格為日系沉靜留白＋克制的動畫亮點，互動模式參考 hiraomakoto.jp（橫向 slider 首頁＋直向內頁），配色與排印走自己的系統。

## 2. 已定案決策

| 項目 | 決定 |
|------|------|
| 技術棧 | React + Vite（**JavaScript**，不用 TS）+ Framer Motion + react-router-dom |
| 樣式 | CSS Modules + CSS 變數 design tokens（`design-system/tokens.css` 為單一事實來源） |
| 首頁 | 橫向 slider（滾輪/方向鍵/拖曳驅動），手機退化為直向滾動 |
| 主題 | 深淺色切換（`data-theme`）。未手動切換時：首頁預設深色、內頁預設淺色；一旦手動切換，全站固定該主題並存入 localStorage |
| 語言 | 中英雙語切換，使用 **react-i18next**（`zh.json`/`en.json`，localStorage 記憶，同步 `<html lang>`） |
| 強調色 | 靛藍：淺色 `#2D4D8E`／深色 `#7E9CD8` |
| 字型 | Noto Serif TC（標題）＋ Noto Sans TC（內文），Google Fonts |
| PWA | vite-plugin-pwa：manifest＋icon＋離線預快取，可安裝 |
| 部署 | GitHub Pages，repo 名 `gexianss.github.io`，GitHub Actions（lint → test → build → deploy-pages） |
| 網域 | 暫用 `gexianss.github.io`，之後可在 Cloudflare Registrar 買網域加 CNAME |

## 3. 資訊架構

```
/            首頁＝橫向 slider
             Panel: Hero → About → Works×3 → Contact
             固定四角 UI：左上印章 logo「張」、右上導航（履歷・作品・聯絡｜EN/中｜主題鈕）、
             左下 GitHub、右下 SCROLL → 提示、底部靛藍進度線

/resume      履歷頁（直向）＝給 HR 的快速通道
             完整經歷時間軸（無限創意 2024.07–2026.06、佳帝科技 2024.01–2024.06）、
             技能分類表、其他亮點；含 print CSS（Ctrl+P 即排版好的 PDF）

/works/:slug 作品詳情頁（直向，全版轉場進出）
             分類 label → 宋體大標 → meta（年份/角色/技術）→ 截圖 → 兩欄內文 → 技術亮點
             左右邊緣直書「前一個/下一個」作品切換
```

作品三件：`noodle-pos`（POS System — Side Project）、`project-handbook`（Open Source — Claude Code Plugin）、`iot-monitoring`（IoT Monitoring — Professional Work，無公開 code，以說明與架構圖呈現）。

## 4. 設計語言

- 色彩 tokens 見 `design-system/tokens.css`：淺色 `#F7F4EF`/`#2B2A26`、深色 `#1C1B19`/`#EDEAE3`、靛藍強調；對比符合 WCAG AA
- Hero：宋體大字「張溦珊。」＋描邊英文名「CHANG WEI-SHAN — FRONTEND ENGINEER」刻意溢出右緣（暗示橫向內容）；直書座右銘「每個重複的任務，都值得被自動化」；背景 2-3 個模糊靛藍圓形緩慢漂移（16-24s）
- 區塊標題：中文宋體大標＋英文小型 label＋帶 48px 靛藍短線的細分隔線
- 動畫：panel 進入視口時逐元素淡入上移（0.7s、stagger 0.12s）；作品縮圖 hover scale 1.025；換頁全版轉場（AnimatePresence）；全部尊重 `prefers-reduced-motion`
- **開場掀頁動畫**：首次進入首頁時，一片帶印章 logo 的全版簾幕由下而上掀開（約 1.2s）露出 Hero；每個 session 只播一次（sessionStorage），reduced-motion 時跳過
- **光暈延伸整條 slider**：背景光暈不只在 Hero——獨立的固定定位光暈層鋪在軌道後方，以約 0.3× 的視差速度跟隨橫向捲動，沿途配置 5-6 個圓，滑到尾端仍有氛圍

## 5. 首頁橫向 slider 實作要點

原型已驗證的機制，正式版移植到 React：

- wheel 的 deltaY 累加到 target，rAF 迴圈以 lerp(0.075) 平滑趨近，`translateX` 應用到軌道（Framer Motion `useMotionValue`＋`useAnimationFrame`）
- 鍵盤左右方向鍵 ±0.9 viewport；導航錨點換算為橫向位置
- 進度線寬度 = current/max
- panel 中心進入視口 ±20% 時加 `active` 觸發 reveal
- `max-width: 768px` 停用劫持、軌道改直向排列（原型同款 CSS fallback）
- Hero panel 寬 130vw 讓溢出效果成立

## 6. 內容資料

- 履歷內容全部住在 i18n 字典（`zh.json`/`en.json`），元件不含文案；來源為 `resume_RD.pdf`（2026-06 版）
- 作品資料 `works.js`：slug、標題、分類 label、描述、技術 tags、截圖路徑、GitHub 連結
- 對外公開資訊：email、GitHub；**電話號碼不放網站**（避免爬蟲騷擾，履歷 PDF 才有）

## 7. 擴充功能

**本次範圍**（使用者指定優先）：

| 功能 | 對應履歷技能 | 說明 |
|------|------------|------|
| AI 可讀履歷 | MCP/AI 整合 | 輸出 `resume.json`（JSON Resume 格式）＋`llms.txt`，內容由 i18n 字典同源產生 |

**後續批次**（不在本次範圍）：D3.js 技能視覺化、`/resume` print CSS、Lighthouse CI badge。
第二階段（另立 spec）：WebSocket 即時訪客足跡（Cloud Run）、可觀測性儀表板、AI 履歷問答。

## 7.5 元件切分原則

遵守 React 慣例，嚴禁單檔巨石。預計結構：

```
src/
├─ components/
│  ├─ layout/    FixedUI（Logo/Nav/ThemeToggle/LangToggle/GitHubLink）、ProgressLine、PageReveal
│  ├─ home/      HorizontalSlider、GlowLayer、HeroPanel、AboutPanel、WorkPanel、ContactPanel
│  ├─ resume/    Timeline、SkillTable
│  ├─ work/      WorkDetail、WorkPager（前/後作品直書切換）
│  └─ common/    SectionHead、Reveal、Tag
├─ hooks/        useHorizontalScroll、useTheme、useReducedMotion
├─ i18n/         index.js、zh.json、en.json
├─ data/         works.js
└─ styles/       tokens.css、global.css
```

每個元件單一職責、props 介面清楚；文案一律走 i18n，元件內不寫死字串。

## 8. 測試與品質

- ESLint＋build 進 CI
- 字典 key 一致性測試：zh/en 兩份字典的 key 集合必須相等（node:test）
- works 資料完整性測試：每筆必有 slug/標題/描述/tags
- Playwright smoke：首頁載入、橫向滑動有位移、主題切換、/resume 與詳情頁可達

## 9. 已知風險

- 滾動劫持的無障礙性：保留鍵盤操作與導航直達；`prefers-reduced-motion` 時 lerp 改為直接跳轉
- GitHub Pages SPA 路由：build 後複製 `index.html` 為 `404.html`
- Vite 與舊套件相容性（noodle-pos 踩過）：新依賴先小規模驗證再採用
