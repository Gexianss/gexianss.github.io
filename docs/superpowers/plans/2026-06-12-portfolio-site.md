# 個人求職網站實作計畫

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 依 `docs/superpowers/specs/2026-06-12-portfolio-site-design.md` 建出可部署到 GitHub Pages 的日系風格求職網站（橫向 slider 首頁＋直向內頁＋雙語＋PWA＋AI 可讀履歷）。

**Architecture:** Vite + React（JavaScript）SPA。首頁用命令式 rAF lerp 實作橫向捲動（已在 `prototypes/homepage-v1.html` 驗證），樣式用 CSS Modules + `design-system/tokens.css` 變數。文案全部住在 react-i18next 字典，`resume.json`/`llms.txt` 由字典同源產生。

**Tech Stack:** react ^19、vite ^7（刻意避開 v8，noodle-pos 踩過雷）、react-router-dom ^7、react-i18next、framer-motion ^12、vite-plugin-pwa、node:test、@playwright/test

**慣例：**
- 所有 commit 訊息結尾加 `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`
- 元件檔一律 `src/components/<區>/<名>.jsx` ＋同名 `.module.css`
- 文案禁止寫死在元件，一律 `t('key')`

---

### Task 1: 腳手架與設計 token

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `eslint.config.js`
- Create: `src/main.jsx`, `src/App.jsx`
- Create: `src/styles/global.css`
- Copy: `design-system/tokens.css` → `src/styles/tokens.css`

- [ ] **Step 1: 建 package.json**

```json
{
  "name": "gexianss.github.io",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "prebuild": "node scripts/gen-resume.mjs",
    "build": "vite build && node scripts/copy-404.mjs",
    "preview": "vite preview",
    "lint": "eslint src",
    "test": "node --test tests/",
    "smoke": "playwright test"
  }
}
```

- [ ] **Step 2: 安裝依賴**

```bash
npm i react@^19 react-dom@^19 react-router-dom@^7 i18next react-i18next framer-motion@^12
npm i -D vite@^7 @vitejs/plugin-react eslint @eslint/js eslint-plugin-react-hooks globals vite-plugin-pwa @playwright/test
```

Expected: 安裝成功，`vite` 版本為 7.x（`npx vite --version` 確認，**不能是 8.x**）。

- [ ] **Step 3: vite.config.js**（PWA 設定 Task 9 再加）

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

- [ ] **Step 4: eslint.config.js**

```js
import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.jsx', 'src/**/*.js'],
    plugins: { 'react-hooks': reactHooks },
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
];
```

- [ ] **Step 5: index.html**

```html
<!DOCTYPE html>
<html lang="zh-Hant" data-theme="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="張溦珊 — 前端工程師。React、Node.js、WebSocket 即時系統、GCP 部署與 AI 驅動開發。" />
    <meta property="og:title" content="張溦珊｜前端工程師" />
    <meta property="og:description" content="履歷與作品集：Noodle POS、project-handbook、IoT 監控系統。" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@300;400;600&family=Noto+Sans+TC:wght@300;400;500&display=swap" rel="stylesheet" />
    <title>張溦珊｜前端工程師</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 6: 複製 tokens 並建 global.css**

`src/styles/tokens.css`＝`design-system/tokens.css` 原封複製（單一事實來源搬進 src，design-system/ 保留作設計文件）。

`src/styles/global.css`:

```css
@import './tokens.css';

* { box-sizing: border-box; }
html, body, #root { margin: 0; height: 100%; }
body {
  background: var(--color-bg);
  color: var(--color-ink);
  font-family: var(--font-sans);
  transition: background 0.4s ease, color 0.4s ease;
}
a { color: inherit; }
button { font-family: var(--font-sans); cursor: pointer; }
```

注意：tokens.css 內的變數名是 `--color-bg`、`--color-ink`、`--color-accent`、`--color-accent-soft`、`--color-line`、`--color-surface`、`--color-ink-muted`、`--color-ink-faint`、`--font-serif`、`--font-sans`（後續所有 CSS module 都用這組名字，**不是**原型裡的縮寫 `--bg`/`--ink`）。

- [ ] **Step 7: src/main.jsx 與暫時的 App.jsx**

```jsx
// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

```jsx
// src/App.jsx（暫時，Task 7 換成 Router）
export default function App() {
  return <h1>張溦珊。</h1>;
}
```

- [ ] **Step 8: 驗證 dev server**

Run: `npm run dev` → 開 http://localhost:5173 看到「張溦珊。」、無 console 錯誤。`npm run lint` 通過。
（`npm run build` 此時會失敗——`scripts/gen-resume.mjs` 尚未存在，Task 8 補上，先不管。）

- [ ] **Step 9: Commit**

```bash
git add -A && git commit -m "feat: Vite+React 腳手架與設計 tokens"
```

---

### Task 2: i18n 字典與一致性測試（TDD）

**Files:**
- Create: `tests/i18n-parity.test.mjs`
- Create: `src/i18n/zh.json`, `src/i18n/en.json`, `src/i18n/index.js`

- [ ] **Step 1: 先寫失敗測試**

```js
// tests/i18n-parity.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

function keysOf(obj, prefix = '') {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' && !Array.isArray(v)
      ? keysOf(v, `${prefix}${k}.`)
      : [`${prefix}${k}`],
  );
}

const zh = JSON.parse(readFileSync('src/i18n/zh.json', 'utf8'));
const en = JSON.parse(readFileSync('src/i18n/en.json', 'utf8'));

test('zh/en 字典 key 完全一致', () => {
  assert.deepEqual(keysOf(zh).sort(), keysOf(en).sort());
});

test('字典沒有空字串', () => {
  for (const dict of [zh, en]) {
    for (const key of keysOf(dict)) {
      const val = key.split('.').reduce((o, k) => o[k], dict);
      if (typeof val === 'string') assert.notEqual(val.trim(), '', `${key} 是空的`);
    }
  }
});
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `npm test`
Expected: FAIL（找不到 `src/i18n/zh.json`）

- [ ] **Step 3: 寫字典**

`src/i18n/zh.json`:

```json
{
  "nav": { "resume": "履歷", "works": "作品", "contact": "聯絡", "lang": "EN", "themeDark": "深色 ◐", "themeLight": "淺色 ◑" },
  "hero": {
    "greet": "こんにちは — 你好，我是",
    "name": "張溦珊",
    "enName": "CHANG WEI-SHAN — FRONTEND ENGINEER",
    "role": "前端工程師 — FRONTEND × FULL-STACK × AI TOOLING ／ REMOTE-FIRST, TAIWAN",
    "motto": "每個重複的任務，都值得被自動化",
    "scrollHint": "SCROLL →"
  },
  "about": {
    "zh": "關於", "en": "About",
    "text": "2.5 年開發經驗，從前端出發、往全端與 DevOps 延伸：React 與 Node.js 是日常，WebSocket 即時系統與 IoT 監控是擅長的戰場，產品從第一行程式碼到 GCP 上雲、CI/CD 零停機部署都能獨立完成。同時深度投入 AI 驅動開發——用 Claude Code、MCP 與自動化工作流，把半天的工作變成十分鐘。",
    "keywords": ["React / Vite", "Node.js / Express", "WebSocket", "GCP / Docker / CI·CD", "Grafana / ELK", "D3.js", "MQTT / Modbus", "Claude Code / MCP"]
  },
  "works": {
    "zh": "作品", "en": "Works",
    "prev": "前一個作品", "next": "下一個作品", "back": "← 作品一覽",
    "noodle-pos": {
      "label": "POS System — Side Project",
      "title": "Noodle POS",
      "desc": "為實體麵店打造的點餐＋出單系統：前台點餐、廚房三單制出單、每日報表看板。從需求訪談、UI token 設計到熱感印表機整合，一人完成。",
      "detail": "從零打造的完整 POS：React 前端＋Node.js 後端，WebSocket 推播出單、ESC/POS 熱感印表機三單制（內場/外帶/客存根）、Recharts 報表看板支援拖曳排版。重視設計系統——字級階梯與顏色語義 token 全站貫徹，對比符合 AA。"
    },
    "project-handbook": {
      "label": "Open Source — Claude Code Plugin",
      "title": "project-handbook",
      "desc": "雙受眾專案手冊產生器：掃描程式碼健康度、依賴與測試缺口，訪談補足程式碼外的知識，輸出給人看的 HTML 手冊＋給 AI 讀的結構化資料。",
      "detail": "第一個公開發布的 Claude Code plugin。核心設計：模板與資料分離、diff 驅動稽核（manifest 記錄基準 commit 以節省 token）、每頁新鮮度標記。同一份資料同時輸出人類可讀的 HTML 與 AI 可讀的 markdown/JSON。"
    },
    "iot-monitoring": {
      "label": "IoT Monitoring — Professional Work",
      "title": "IoT 監控系統 ×3",
      "desc": "半年內獨立交付三套大型監控系統：WebSocket 即時數據、JSMpeg 影像串流、D3.js 即時圖表，整合 MQTT 與 Modbus 通訊協定。",
      "detail": "包含電表監控（Modbus 上傳、前端即時呈現，兩天完成原估一週的升級）與智慧燈光控制（WebSocket 廣播鎖定機制解決多使用者搶控衝突）。公司專案無公開原始碼，以架構說明呈現。"
    }
  },
  "contact": {
    "zh": "聯絡", "en": "Contact",
    "line": "一起做點什麼吧",
    "email": "shiaushen@gmail.com",
    "github": "github.com/Gexianss"
  },
  "resume": {
    "zh": "履歷", "en": "Resume",
    "title": "張溦珊",
    "subtitle": "前端工程師 ／ 全端開發 ／ AI 工具整合",
    "summary": "擁有 2.5 年前端開發經驗，技術橫跨前端（React / SCSS / Vite）、後端（Node.js / Express）及雲端部署（GCP Cloud Run / GitLab CI/CD）。熟悉 WebSocket 即時通訊系統開發與 IoT 監控應用，具備完整的 DevOps 與可觀測性（Grafana、ELK）實戰能力。積極擁抱 AI 工具，深度掌握 Claude Code、MCP Server、Agent/Hook 開發。",
    "jobs": [
      {
        "company": "無限創意有限公司", "title": "前端工程師（前後端／DevOps）", "period": "2024.07 — 2026.06",
        "points": [
          "維運多項產品：React、Node.js、Express、WebSocket、Redis、SCSS、Vite、Webpack",
          "主導首個產品上雲：K3s 開發測試環境＋GCP Cloud Run 正式環境，GitLab CI/CD + Docker 零停機自動部署",
          "將上雲流程系統化為 Claude Code Skill，後續產品上雲時間從一個月縮短至 3～5 天",
          "導入 Grafana + ELK 日誌可視化；以 Pino 取代 Jaeger 降低監控資源成本",
          "主導公司內部 Claude Code 教育訓練；建立 Figma MCP 協助設計流程轉換；以 Skill/MCP 將半天任務縮短至 10 分鐘內"
        ]
      },
      {
        "company": "佳帝科技有限公司", "title": "前端工程師", "period": "2024.01 — 2024.06",
        "points": [
          "半年內獨立完成 3 套大型 IoT 監控系統：WebSocket、JSMpeg 影像串流、D3.js 即時圖表",
          "整合 MQTT 與 Modbus 通訊協定，負責通訊設定與前端資料展示",
          "電表監控系統升級原估一週、兩天交付；設計 WebSocket 廣播鎖定機制解決多使用者搶控衝突"
        ]
      }
    ],
    "skillGroups": [
      { "name": "前端", "items": "React · SCSS · Vite · Webpack · jQuery" },
      { "name": "後端 / API", "items": "Node.js · Express · WebSocket · Redis · REST API" },
      { "name": "雲端 / DevOps", "items": "GCP Cloud Run · K3s · Docker · GitLab CI/CD" },
      { "name": "監控 / 日誌", "items": "Grafana · ELK Stack · Filebeat · Logstash · Pino" },
      { "name": "IoT 通訊", "items": "MQTT · Modbus · JSMpeg" },
      { "name": "資料視覺化", "items": "D3.js" },
      { "name": "AI 工具", "items": "Claude Code · MCP Server · Agent · Hook · Figma MCP" },
      { "name": "版本控制", "items": "Git · GitLab · git-flow" }
    ]
  },
  "reveal": { "aria": "頁面載入中" }
}
```

`src/i18n/en.json`（key 結構必須一模一樣）:

```json
{
  "nav": { "resume": "Resume", "works": "Works", "contact": "Contact", "lang": "中", "themeDark": "Dark ◐", "themeLight": "Light ◑" },
  "hero": {
    "greet": "Hello — I'm",
    "name": "Chang Wei-Shan",
    "enName": "CHANG WEI-SHAN — FRONTEND ENGINEER",
    "role": "Frontend Engineer — FRONTEND × FULL-STACK × AI TOOLING / REMOTE-FIRST, TAIWAN",
    "motto": "Every repetitive task deserves automation",
    "scrollHint": "SCROLL →"
  },
  "about": {
    "zh": "About", "en": "About",
    "text": "2.5 years of development experience, growing from frontend into full-stack and DevOps: React and Node.js are my daily tools, WebSocket real-time systems and IoT monitoring are my home turf, and I can take a product from its first line of code to GCP deployment with zero-downtime CI/CD on my own. I'm also deep into AI-driven development — using Claude Code, MCP and automated workflows to turn half-day tasks into ten minutes.",
    "keywords": ["React / Vite", "Node.js / Express", "WebSocket", "GCP / Docker / CI·CD", "Grafana / ELK", "D3.js", "MQTT / Modbus", "Claude Code / MCP"]
  },
  "works": {
    "zh": "Works", "en": "Works",
    "prev": "Previous work", "next": "Next work", "back": "← All works",
    "noodle-pos": {
      "label": "POS System — Side Project",
      "title": "Noodle POS",
      "desc": "An ordering and kitchen-ticket system built for a real noodle shop: front-of-house ordering, three-ticket kitchen printing, daily report dashboard. Requirements interviews, UI token design and thermal printer integration — all done solo.",
      "detail": "A complete POS built from scratch: React frontend + Node.js backend, WebSocket-pushed ticket printing, three-ticket ESC/POS thermal printing (kitchen / takeout / customer stub), and a drag-and-drop Recharts report dashboard. Built on a disciplined design system — type scale and semantic color tokens throughout, AA contrast compliant."
    },
    "project-handbook": {
      "label": "Open Source — Claude Code Plugin",
      "title": "project-handbook",
      "desc": "A dual-audience project handbook generator: scans code health, dependencies and test gaps, interviews for knowledge outside the code, and outputs an HTML handbook for humans plus structured data for AI.",
      "detail": "My first published Claude Code plugin. Core design: template/data separation, diff-driven audits (a manifest records the baseline commit to save tokens), and per-page freshness markers. One data source renders both human-readable HTML and AI-readable markdown/JSON."
    },
    "iot-monitoring": {
      "label": "IoT Monitoring — Professional Work",
      "title": "IoT Monitoring ×3",
      "desc": "Three large monitoring systems delivered independently within six months: WebSocket real-time data, JSMpeg video streaming, D3.js live charts, integrating MQTT and Modbus protocols.",
      "detail": "Includes a power-meter monitor (Modbus upload with real-time frontend display — a one-week upgrade estimate delivered in two days) and a smart lighting controller (a WebSocket broadcast locking mechanism that resolves multi-user control conflicts). Company projects without public source; presented as architecture walkthroughs."
    }
  },
  "contact": {
    "zh": "Contact", "en": "Contact",
    "line": "Let's build something",
    "email": "shiaushen@gmail.com",
    "github": "github.com/Gexianss"
  },
  "resume": {
    "zh": "Resume", "en": "Resume",
    "title": "Chang Wei-Shan",
    "subtitle": "Frontend Engineer / Full-Stack / AI Tooling",
    "summary": "2.5 years of frontend development experience spanning frontend (React / SCSS / Vite), backend (Node.js / Express) and cloud deployment (GCP Cloud Run / GitLab CI/CD). Experienced in WebSocket real-time systems and IoT monitoring, with hands-on DevOps and observability (Grafana, ELK). An early adopter of AI tooling with deep command of Claude Code, MCP servers, and Agent/Hook development.",
    "jobs": [
      {
        "company": "Infinite Creativity Co., Ltd.", "title": "Frontend Engineer (Full-stack / DevOps)", "period": "2024.07 — 2026.06",
        "points": [
          "Maintained multiple products: React, Node.js, Express, WebSocket, Redis, SCSS, Vite, Webpack",
          "Led the company's first cloud migration: K3s for dev/test, GCP Cloud Run for production, zero-downtime deploys via GitLab CI/CD + Docker",
          "Systematized the migration into a Claude Code Skill, cutting later products' cloud migration from one month to 3–5 days",
          "Introduced Grafana + ELK log visualization; replaced Jaeger with Pino to cut monitoring resource costs",
          "Led internal Claude Code training; built Figma MCP for the design team; packaged repetitive work into Skills/MCP, turning half-day tasks into under 10 minutes"
        ]
      },
      {
        "company": "Jiadi Technology Co., Ltd.", "title": "Frontend Engineer", "period": "2024.01 — 2024.06",
        "points": [
          "Independently delivered 3 large IoT monitoring systems in six months: WebSocket, JSMpeg video streaming, D3.js live charts",
          "Integrated MQTT and Modbus protocols, owning comms configuration and frontend data display",
          "Delivered a one-week power-meter upgrade in two days; designed a WebSocket broadcast lock to resolve multi-user control conflicts"
        ]
      }
    ],
    "skillGroups": [
      { "name": "Frontend", "items": "React · SCSS · Vite · Webpack · jQuery" },
      { "name": "Backend / API", "items": "Node.js · Express · WebSocket · Redis · REST API" },
      { "name": "Cloud / DevOps", "items": "GCP Cloud Run · K3s · Docker · GitLab CI/CD" },
      { "name": "Monitoring / Logs", "items": "Grafana · ELK Stack · Filebeat · Logstash · Pino" },
      { "name": "IoT Protocols", "items": "MQTT · Modbus · JSMpeg" },
      { "name": "Data Viz", "items": "D3.js" },
      { "name": "AI Tooling", "items": "Claude Code · MCP Server · Agent · Hook · Figma MCP" },
      { "name": "Version Control", "items": "Git · GitLab · git-flow" }
    ]
  },
  "reveal": { "aria": "Loading" }
}
```

- [ ] **Step 4: i18n 初始化**

```js
// src/i18n/index.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zh from './zh.json';
import en from './en.json';

const saved = localStorage.getItem('lang') || 'zh';

i18n.use(initReactI18next).init({
  resources: { zh: { translation: zh }, en: { translation: en } },
  lng: saved,
  fallbackLng: 'zh',
  interpolation: { escapeValue: false },
  returnObjects: true,
});

document.documentElement.lang = saved === 'zh' ? 'zh-Hant' : 'en';

export function toggleLang() {
  const next = i18n.language === 'zh' ? 'en' : 'zh';
  i18n.changeLanguage(next);
  localStorage.setItem('lang', next);
  document.documentElement.lang = next === 'zh' ? 'zh-Hant' : 'en';
}

export default i18n;
```

並在 `src/main.jsx` 的 global.css import 後面加一行 `import './i18n/index.js';`

- [ ] **Step 5: 跑測試確認通過**

Run: `npm test`
Expected: PASS ×2

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: react-i18next 雙語字典＋key 一致性測試"
```

---

### Task 3: 作品資料（TDD）

**Files:**
- Create: `tests/works.test.mjs`
- Create: `src/data/works.js`

- [ ] **Step 1: 先寫失敗測試**

```js
// tests/works.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { works } from '../src/data/works.js';

test('每筆作品欄位完整', () => {
  assert.ok(works.length >= 3);
  for (const w of works) {
    for (const field of ['slug', 'glyph', 'tags']) {
      assert.ok(w[field], `${w.slug || '?'} 缺 ${field}`);
    }
    assert.ok(Array.isArray(w.tags) && w.tags.length > 0);
  }
});

test('slug 不重複', () => {
  const slugs = works.map((w) => w.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});
```

- [ ] **Step 2: 跑測試確認失敗** — `npm test` → FAIL（找不到 works.js）

- [ ] **Step 3: 實作**

```js
// src/data/works.js
// 文案住在 i18n 字典 works.<slug>.*，這裡只放非文案資料
export const works = [
  {
    slug: 'noodle-pos',
    glyph: '麵',
    tags: ['React', 'Node.js', 'ESC/POS', 'Recharts'],
    github: 'https://github.com/Gexianss/Noodle-pos',
  },
  {
    slug: 'project-handbook',
    glyph: '冊',
    tags: ['Node.js', 'CLI', 'Claude Code'],
    github: 'https://github.com/Gexianss/project-handbook',
  },
  {
    slug: 'iot-monitoring',
    glyph: '監',
    tags: ['WebSocket', 'D3.js', 'MQTT', 'JSMpeg'],
    github: null,
  },
];
```

- [ ] **Step 4: 跑測試確認通過** — `npm test` → PASS
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: 作品資料與完整性測試"`

---

### Task 4: 主題系統與共用小元件

**Files:**
- Create: `src/hooks/useTheme.js`
- Create: `src/hooks/useReducedMotion.js`
- Create: `src/components/common/SectionHead.jsx` + `.module.css`
- Create: `src/components/common/Tag.jsx` + `.module.css`

- [ ] **Step 1: useTheme**

```js
// src/hooks/useTheme.js
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [manual, setManual] = useState(() => localStorage.getItem('theme')); // 'dark' | 'light' | null
  const { pathname } = useLocation();
  const defaultTheme = pathname === '/' ? 'dark' : 'light';
  const theme = manual || defaultTheme;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggle = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setManual(next);
    localStorage.setItem('theme', next);
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
```

（注意：含 JSX 的檔案副檔名要是 `.jsx` —— 實際存成 `src/hooks/useTheme.jsx`。）

- [ ] **Step 2: useReducedMotion**

```js
// src/hooks/useReducedMotion.js
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
```

- [ ] **Step 3: SectionHead 與 Tag**

```jsx
// src/components/common/SectionHead.jsx
import styles from './SectionHead.module.css';

export default function SectionHead({ zh, en }) {
  return (
    <div className={styles.head}>
      <div className={styles.zh}>{zh}</div>
      <div className={styles.en}>{en}</div>
      <div className={styles.line} />
    </div>
  );
}
```

```css
/* src/components/common/SectionHead.module.css */
.head { margin-bottom: 36px; }
.zh { font-family: var(--font-serif); font-weight: 600; font-size: 30px; letter-spacing: 0.2em; }
.en { font-size: 10px; letter-spacing: 0.32em; text-transform: uppercase; color: var(--color-ink-faint); margin-top: 6px; }
.line { width: 48px; height: 1px; background: var(--color-accent); margin-top: 14px; }
```

```jsx
// src/components/common/Tag.jsx
import styles from './Tag.module.css';

export default function Tag({ children }) {
  return <span className={styles.tag}>{children}</span>;
}
```

```css
/* src/components/common/Tag.module.css */
.tag {
  font-size: 10px; letter-spacing: 0.12em; color: var(--color-accent);
  background: var(--color-accent-soft); border-radius: 3px; padding: 4px 10px;
}
```

- [ ] **Step 4: lint＋commit**

Run: `npm run lint` → 通過
`git add -A && git commit -m "feat: 主題系統與共用元件 SectionHead/Tag"`

---

### Task 5: FixedUI 與 PageReveal

**Files:**
- Create: `src/components/layout/FixedUI.jsx` + `.module.css`
- Create: `src/components/layout/PageReveal.jsx` + `.module.css`

- [ ] **Step 1: FixedUI**

```jsx
// src/components/layout/FixedUI.jsx
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme.jsx';
import { toggleLang } from '../../i18n/index.js';
import styles from './FixedUI.module.css';

export default function FixedUI({ onNavigateSection }) {
  const { t } = useTranslation();
  const { theme, toggle } = useTheme();
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  const sectionLink = (id, label) =>
    isHome ? (
      <a href={`#${id}`} onClick={(e) => { e.preventDefault(); onNavigateSection?.(id); }}>{label}</a>
    ) : (
      <Link to={`/#${id}`}>{label}</Link>
    );

  return (
    <>
      <Link to="/" className={styles.logo} aria-label="Home">張</Link>
      <nav className={styles.nav}>
        <Link to="/resume">{t('nav.resume')}</Link>
        {sectionLink('works', t('nav.works'))}
        {sectionLink('contact', t('nav.contact'))}
        <span className={styles.sep} />
        <button className={styles.pill} onClick={toggleLang}>{t('nav.lang')}</button>
        <button className={styles.pill} onClick={toggle}>
          {theme === 'dark' ? t('nav.themeDark') : t('nav.themeLight')}
        </button>
      </nav>
      <a className={styles.github} href="https://github.com/Gexianss" target="_blank" rel="noreferrer">
        GITHUB — GEXIANSS
      </a>
    </>
  );
}
```

```css
/* src/components/layout/FixedUI.module.css */
.logo {
  position: fixed; z-index: 50; top: 24px; left: 28px; width: 34px; height: 34px;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-serif); font-weight: 600; font-size: 16px; text-decoration: none;
  border-radius: 4px; background: var(--color-accent); color: var(--color-on-accent);
}
.nav {
  position: fixed; z-index: 50; top: 28px; right: 28px; display: flex; align-items: center;
  gap: 20px; font-size: 12px; letter-spacing: 0.18em;
}
.nav a { text-decoration: none; opacity: 0.7; transition: opacity 0.2s; }
.nav a:hover { opacity: 1; }
.sep { width: 1px; height: 12px; background: var(--color-line); }
.pill {
  background: none; border: 1px solid var(--color-line); color: var(--color-ink);
  font-size: 11px; letter-spacing: 0.12em; border-radius: 99px; padding: 5px 12px;
  transition: border-color 0.2s;
}
.pill:hover { border-color: var(--color-accent); }
.github {
  position: fixed; z-index: 50; bottom: 26px; left: 28px; font-size: 11px;
  letter-spacing: 0.2em; color: var(--color-ink-faint); text-decoration: none;
}
.github:hover { color: var(--color-accent); }
@media (max-width: 768px) { .github { display: none; } }
```

- [ ] **Step 2: PageReveal（掀頁開場）**

```jsx
// src/components/layout/PageReveal.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { prefersReducedMotion } from '../../hooks/useReducedMotion.js';
import styles from './PageReveal.module.css';

export default function PageReveal() {
  const [done, setDone] = useState(
    () => sessionStorage.getItem('revealed') === '1' || prefersReducedMotion(),
  );
  if (done) return null;
  return (
    <AnimatePresence>
      <motion.div
        className={styles.curtain}
        initial={{ y: 0 }}
        animate={{ y: '-100%' }}
        transition={{ delay: 0.7, duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        onAnimationComplete={() => { sessionStorage.setItem('revealed', '1'); setDone(true); }}
      >
        <motion.div
          className={styles.stamp}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45 }}
        >
          張
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
```

```css
/* src/components/layout/PageReveal.module.css */
.curtain {
  position: fixed; inset: 0; z-index: 100; background: var(--color-accent);
  display: flex; align-items: center; justify-content: center;
}
.stamp {
  width: 72px; height: 72px; border-radius: 8px; background: var(--color-on-accent);
  color: var(--color-accent); font-family: var(--font-serif); font-weight: 600;
  font-size: 34px; display: flex; align-items: center; justify-content: center;
}
```

- [ ] **Step 3: lint＋commit** — `npm run lint` 通過後 `git add -A && git commit -m "feat: 固定四角 UI 與掀頁開場動畫"`

---

### Task 6: 首頁橫向 slider

**Files:**
- Create: `src/hooks/useHorizontalScroll.js`
- Create: `src/components/home/GlowLayer.jsx` + `.module.css`
- Create: `src/components/home/HomePage.jsx` + `.module.css`
- Create: `src/components/home/HeroPanel.jsx` + `.module.css`
- Create: `src/components/home/AboutPanel.jsx` + `.module.css`
- Create: `src/components/home/WorkPanel.jsx` + `.module.css`
- Create: `src/components/home/ContactPanel.jsx` + `.module.css`

- [ ] **Step 1: useHorizontalScroll（移植已驗證的原型機制）**

```js
// src/hooks/useHorizontalScroll.js
import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from './useReducedMotion.js';

const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

// trackRef: 橫向軌道；barRef: 進度條；glowRef: 視差光暈層（0.3×）
export function useHorizontalScroll({ trackRef, barRef, glowRef }) {
  const targetRef = useRef(0);

  // 導航用：滑到指定元素
  const scrollToEl = (el) => {
    if (!el) return;
    if (isMobile()) { el.scrollIntoView({ behavior: 'smooth' }); return; }
    targetRef.current = Math.max(0, el.offsetLeft - window.innerWidth * 0.04);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let current = 0;
    let raf;
    const reduced = prefersReducedMotion();
    const max = () => Math.max(0, track.scrollWidth - window.innerWidth);

    const onWheel = (e) => {
      if (isMobile()) return;
      targetRef.current = Math.min(max(), Math.max(0, targetRef.current + e.deltaY));
    };
    const onKey = (e) => {
      if (isMobile()) return;
      if (e.key === 'ArrowRight') targetRef.current = Math.min(max(), targetRef.current + window.innerWidth * 0.9);
      if (e.key === 'ArrowLeft') targetRef.current = Math.max(0, targetRef.current - window.innerWidth * 0.9);
    };

    const tick = () => {
      if (!isMobile()) {
        current += (targetRef.current - current) * (reduced ? 1 : 0.075);
        track.style.transform = `translateX(${-current}px)`;
        if (glowRef.current) glowRef.current.style.transform = `translateX(${-current * 0.3}px)`;
        if (barRef.current) barRef.current.style.width = `${max() ? (current / max()) * 100 : 0}%`;
        for (const p of track.children) {
          const mid = p.offsetLeft + p.offsetWidth / 2 - current;
          p.classList.toggle('active', mid > -window.innerWidth * 0.2 && mid < window.innerWidth * 1.1);
        }
      }
      raf = requestAnimationFrame(tick);
    };

    addEventListener('wheel', onWheel, { passive: true });
    addEventListener('keydown', onKey);
    raf = requestAnimationFrame(tick);
    return () => {
      removeEventListener('wheel', onWheel);
      removeEventListener('keydown', onKey);
      cancelAnimationFrame(raf);
    };
  }, [trackRef, barRef, glowRef]);

  return { scrollToEl };
}
```

- [ ] **Step 2: GlowLayer（全程光暈，視差 0.3×）**

```jsx
// src/components/home/GlowLayer.jsx
import { forwardRef } from 'react';
import styles from './GlowLayer.module.css';

// 6 顆光暈鋪滿約 400vw 的軌道長度，視差移動由 useHorizontalScroll 控制
const GLOWS = [
  { size: 340, left: '52vw', bottom: '-130px' },
  { size: 200, left: '70vw', top: '-70px' },
  { size: 130, left: '10vw', bottom: '4vh' },
  { size: 300, left: '150vw', top: '10vh' },
  { size: 240, left: '230vw', bottom: '-80px' },
  { size: 320, left: '330vw', top: '-60px' },
];

const GlowLayer = forwardRef(function GlowLayer(_, ref) {
  return (
    <div className={styles.layer} ref={ref} aria-hidden="true">
      {GLOWS.map((g, i) => (
        <div
          key={i}
          className={`${styles.circle} ${styles[`c${(i % 3) + 1}`]}`}
          style={{ width: g.size, height: g.size, left: g.left, top: g.top, bottom: g.bottom }}
        />
      ))}
    </div>
  );
});
export default GlowLayer;
```

```css
/* src/components/home/GlowLayer.module.css */
.layer { position: fixed; inset: 0; z-index: 0; pointer-events: none; width: 400vw; }
.circle { position: absolute; border-radius: 50%; filter: blur(44px); background: var(--color-accent-soft); }
.c1 { animation: drift1 16s ease-in-out infinite alternate; }
.c2 { animation: drift2 20s ease-in-out infinite alternate; }
.c3 { opacity: 0.6; animation: drift1 24s ease-in-out infinite alternate-reverse; }
@keyframes drift1 { from { transform: translate(0, 0); } to { transform: translate(-44px, -28px); } }
@keyframes drift2 { from { transform: translate(0, 0); } to { transform: translate(34px, 22px); } }
@media (prefers-reduced-motion: reduce) { .c1, .c2, .c3 { animation: none; } }
@media (max-width: 768px) { .layer { width: 100vw; } }
```

- [ ] **Step 3: HomePage（組裝）**

```jsx
// src/components/home/HomePage.jsx
import { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useHorizontalScroll } from '../../hooks/useHorizontalScroll.js';
import FixedUI from '../layout/FixedUI.jsx';
import PageReveal from '../layout/PageReveal.jsx';
import GlowLayer from './GlowLayer.jsx';
import HeroPanel from './HeroPanel.jsx';
import AboutPanel from './AboutPanel.jsx';
import WorkPanel from './WorkPanel.jsx';
import ContactPanel from './ContactPanel.jsx';
import { works } from '../../data/works.js';
import styles from './HomePage.module.css';

export default function HomePage() {
  const trackRef = useRef(null);
  const barRef = useRef(null);
  const glowRef = useRef(null);
  const { scrollToEl } = useHorizontalScroll({ trackRef, barRef, glowRef });
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) scrollToEl(document.querySelector(hash));
  }, [hash]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles.viewport}>
      <PageReveal />
      <FixedUI onNavigateSection={(id) => scrollToEl(document.getElementById(id))} />
      <GlowLayer ref={glowRef} />
      <div className={styles.track} ref={trackRef}>
        <HeroPanel />
        <AboutPanel />
        {works.map((w, i) => (
          <WorkPanel key={w.slug} work={w} id={i === 0 ? 'works' : undefined} />
        ))}
        <ContactPanel id="contact" />
      </div>
      <div className={styles.progress}><div className={styles.bar} ref={barRef} /></div>
      <div className={styles.hint} aria-hidden="true">SCROLL →</div>
    </div>
  );
}
```

```css
/* src/components/home/HomePage.module.css */
.viewport { height: 100vh; overflow: hidden; position: relative; }
.track { display: flex; height: 100vh; will-change: transform; position: relative; z-index: 1; }
.progress { position: fixed; bottom: 0; left: 0; height: 2px; width: 100%; z-index: 60; background: var(--color-line); }
.bar { height: 100%; width: 0; background: var(--color-accent); }
.hint {
  position: fixed; bottom: 26px; right: 28px; z-index: 50; font-size: 11px;
  letter-spacing: 0.3em; color: var(--color-ink-faint);
  animation: hint 2.4s ease-in-out infinite;
}
@keyframes hint { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(8px); } }
@media (max-width: 768px) {
  .viewport { height: auto; overflow: visible; }
  .track { display: block; height: auto; transform: none !important; }
  .hint { display: none; }
}
@media (prefers-reduced-motion: reduce) { .hint { animation: none; } }
```

- [ ] **Step 4: 四個 Panel 元件**

共用的 panel/reveal CSS 放 global.css 尾端（panel 的 active reveal 是跨元件機制）:

```css
/* 追加到 src/styles/global.css */
.panel { flex: none; height: 100vh; position: relative; padding: 0 6vw; display: flex; flex-direction: column; justify-content: center; }
.rv { opacity: 0; transform: translateY(24px); transition: opacity 0.7s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.7s cubic-bezier(0.25, 0.1, 0.25, 1); }
.panel.active .rv { opacity: 1; transform: none; }
.panel.active .rv:nth-child(2) { transition-delay: 0.12s; }
.panel.active .rv:nth-child(3) { transition-delay: 0.24s; }
.panel.active .rv:nth-child(4) { transition-delay: 0.36s; }
@media (max-width: 768px) {
  .panel { width: 100% !important; height: auto; min-height: 70vh; padding: 18vw 8vw; }
  .rv { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) { .rv { transition: none; opacity: 1; transform: none; } }
```

```jsx
// src/components/home/HeroPanel.jsx
import { useTranslation } from 'react-i18next';
import styles from './HeroPanel.module.css';

export default function HeroPanel() {
  const { t } = useTranslation();
  return (
    <section className={`panel ${styles.hero}`}>
      <div className={`rv ${styles.greet}`}>{t('hero.greet')}</div>
      <h1 className={`rv ${styles.name}`}>{t('hero.name')}<span className={styles.dot}>。</span></h1>
      <div className={`rv ${styles.enName}`}>{t('hero.enName')}</div>
      <div className={`rv ${styles.role}`}>{t('hero.role')}</div>
      <div className={styles.motto}>{t('hero.motto')}</div>
    </section>
  );
}
```

```css
/* src/components/home/HeroPanel.module.css */
.hero { width: 130vw; }
.greet { font-size: 13px; letter-spacing: 0.45em; color: var(--color-ink-muted); margin-bottom: 20px; }
.name { font-family: var(--font-serif); font-weight: 600; white-space: nowrap; font-size: clamp(72px, 13vw, 170px); line-height: 1.1; margin: 0 0 18px; letter-spacing: 0.06em; }
.dot { color: var(--color-accent); }
.enName { font-weight: 700; white-space: nowrap; font-size: clamp(56px, 8.5vw, 110px); letter-spacing: 0.06em; line-height: 1.1; margin: 0 0 26px; color: transparent; -webkit-text-stroke: 1px var(--color-ink-faint); }
.role { font-size: 15px; letter-spacing: 0.28em; color: var(--color-ink-muted); }
.motto { position: absolute; right: 34vw; top: 12vh; writing-mode: vertical-rl; font-family: var(--font-serif); font-size: 13px; letter-spacing: 0.5em; color: var(--color-ink-faint); }
@media (max-width: 768px) {
  .name { white-space: normal; font-size: 17vw; }
  .enName { white-space: normal; font-size: 9vw; }
  .motto { display: none; }
}
```

```jsx
// src/components/home/AboutPanel.jsx
import { useTranslation } from 'react-i18next';
import SectionHead from '../common/SectionHead.jsx';
import styles from './AboutPanel.module.css';

export default function AboutPanel() {
  const { t } = useTranslation();
  const keywords = t('about.keywords', { returnObjects: true });
  return (
    <section className="panel" style={{ width: '100vw' }}>
      <div className="rv"><SectionHead zh={t('about.zh')} en={t('about.en')} /></div>
      <div className={`rv ${styles.grid}`}>
        <p className={styles.text}>{t('about.text')}</p>
        <div className={styles.kw}>
          {keywords.map((k) => <span key={k}>{k}</span>)}
        </div>
      </div>
    </section>
  );
}
```

```css
/* src/components/home/AboutPanel.module.css */
.grid { display: flex; gap: 6vw; align-items: flex-start; }
.text { max-width: 460px; font-size: 14px; line-height: 2.1; letter-spacing: 0.04em; color: var(--color-ink-muted); margin: 0; }
.kw { display: flex; flex-wrap: wrap; gap: 10px; max-width: 380px; }
.kw span { font-size: 12px; letter-spacing: 0.08em; border: 1px solid var(--color-line); border-radius: 99px; padding: 7px 16px; color: var(--color-ink-muted); transition: all 0.25s; }
.kw span:hover { border-color: var(--color-accent); color: var(--color-accent); }
@media (max-width: 768px) { .grid { flex-direction: column; } }
```

```jsx
// src/components/home/WorkPanel.jsx
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Tag from '../common/Tag.jsx';
import styles from './WorkPanel.module.css';

export default function WorkPanel({ work, id }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <section
      id={id}
      className={`panel ${styles.work}`}
      onClick={() => navigate(`/works/${work.slug}`)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/works/${work.slug}`)}
    >
      <div className={styles.row}>
        <div>
          <div className={`rv ${styles.label}`}>{t(`works.${work.slug}.label`)}</div>
          <h2 className={`rv ${styles.title}`}>{t(`works.${work.slug}.title`)}</h2>
          <p className={`rv ${styles.desc}`}>{t(`works.${work.slug}.desc`)}</p>
          <div className={`rv ${styles.meta}`}>
            {work.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
          </div>
        </div>
        <div className={`rv ${styles.thumb}`}><div className={styles.ph}>{work.glyph}</div></div>
      </div>
    </section>
  );
}
```

```css
/* src/components/home/WorkPanel.module.css */
.work { width: 92vw; cursor: pointer; }
.row { display: flex; gap: 5vw; align-items: center; }
.label { font-size: 10px; letter-spacing: 0.34em; text-transform: uppercase; color: var(--color-accent); margin-bottom: 16px; }
.title { font-family: var(--font-serif); font-weight: 600; font-size: clamp(34px, 4.6vw, 58px); letter-spacing: 0.08em; margin: 0 0 14px; }
.desc { font-size: 13px; line-height: 2; color: var(--color-ink-muted); max-width: 420px; margin: 0 0 18px; }
.meta { display: flex; gap: 8px; }
.thumb { width: min(52vw, 680px); height: min(30vw, 380px); border-radius: 8px; overflow: hidden; background: linear-gradient(135deg, var(--color-accent-soft), var(--color-line)); position: relative; transition: transform 0.45s cubic-bezier(0.25, 0.1, 0.25, 1); flex: none; }
.work:hover .thumb { transform: scale(1.025); }
.ph { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: var(--font-serif); font-size: 40px; color: var(--color-ink-faint); letter-spacing: 0.2em; }
@media (max-width: 768px) { .row { flex-direction: column; align-items: flex-start; } .thumb { width: 100%; height: 52vw; } }
```

```jsx
// src/components/home/ContactPanel.jsx
import { useTranslation } from 'react-i18next';
import SectionHead from '../common/SectionHead.jsx';
import styles from './ContactPanel.module.css';

export default function ContactPanel({ id }) {
  const { t } = useTranslation();
  return (
    <section id={id} className={`panel ${styles.contact}`}>
      <div className="rv"><SectionHead zh={t('contact.zh')} en={t('contact.en')} /></div>
      <p className={`rv ${styles.line}`}>{t('contact.line')}<span className={styles.dot}>。</span></p>
      <div className={`rv ${styles.links}`}>
        <a href={`mailto:${t('contact.email')}`}>{t('contact.email')}</a>
        <a href="https://github.com/Gexianss" target="_blank" rel="noreferrer">{t('contact.github')}</a>
      </div>
    </section>
  );
}
```

```css
/* src/components/home/ContactPanel.module.css */
.contact { width: 100vw; align-items: flex-start; }
.line { font-family: var(--font-serif); font-size: clamp(26px, 3.2vw, 44px); letter-spacing: 0.12em; margin: 0 0 28px; }
.dot { color: var(--color-accent); }
.links { display: flex; flex-direction: column; gap: 14px; font-size: 14px; letter-spacing: 0.1em; }
.links a { color: var(--color-ink-muted); text-decoration: none; border-bottom: 1px solid var(--color-line); padding-bottom: 4px; width: fit-content; transition: all 0.25s; }
.links a:hover { color: var(--color-accent); border-color: var(--color-accent); }
```

- [ ] **Step 5: 手動驗證**

`src/App.jsx` 暫時改成直接渲染 HomePage 包 Router（Task 7 會正式化）:

```jsx
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme.jsx';
import HomePage from './components/home/HomePage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <HomePage />
      </ThemeProvider>
    </BrowserRouter>
  );
}
```

Run: `npm run dev` → 確認：掀頁開場一次、滾輪橫向滑動、光暈全程都在（視差較慢）、進度線、深淺色切換、EN/中切換即時生效、視窗縮到 <768px 變直向。

- [ ] **Step 6: Commit** — `git add -A && git commit -m "feat: 首頁橫向 slider（panels/光暈視差/進度線）"`

---

### Task 7: 路由、作品詳情頁、履歷頁

**Files:**
- Modify: `src/App.jsx`
- Create: `src/components/work/WorkDetail.jsx` + `.module.css`
- Create: `src/components/resume/ResumePage.jsx` + `.module.css`
- Create: `scripts/copy-404.mjs`

- [ ] **Step 1: App.jsx 正式路由＋轉場**

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './hooks/useTheme.jsx';
import HomePage from './components/home/HomePage.jsx';
import WorkDetail from './components/work/WorkDetail.jsx';
import ResumePage from './components/resume/ResumePage.jsx';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/works/:slug" element={<WorkDetail />} />
        <Route path="/resume" element={<ResumePage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AnimatedRoutes />
      </ThemeProvider>
    </BrowserRouter>
  );
}
```

- [ ] **Step 2: WorkDetail（直向內頁＋直書前後切換）**

```jsx
// src/components/work/WorkDetail.jsx
import { useParams, Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import FixedUI from '../layout/FixedUI.jsx';
import Tag from '../common/Tag.jsx';
import { works } from '../../data/works.js';
import styles from './WorkDetail.module.css';

export default function WorkDetail() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const idx = works.findIndex((w) => w.slug === slug);
  if (idx === -1) return <Navigate to="/" replace />;
  const work = works[idx];
  const prev = works[(idx - 1 + works.length) % works.length];
  const next = works[(idx + 1) % works.length];

  return (
    <motion.main
      className={styles.page}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <FixedUI />
      <Link to="/" className={styles.back}>{t('works.back')}</Link>
      <div className={styles.label}>{t(`works.${slug}.label`)}</div>
      <h1 className={styles.title}>{t(`works.${slug}.title`)}</h1>
      <div className={styles.meta}>{work.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</div>
      <div className={styles.thumb}><span>{work.glyph}</span></div>
      <div className={styles.body}>
        <p>{t(`works.${slug}.desc`)}</p>
        <p>{t(`works.${slug}.detail`)}</p>
      </div>
      {work.github && (
        <a className={styles.gh} href={work.github} target="_blank" rel="noreferrer">GitHub ↗</a>
      )}
      <Link to={`/works/${prev.slug}`} className={`${styles.pager} ${styles.prev}`}>{t('works.prev')}</Link>
      <Link to={`/works/${next.slug}`} className={`${styles.pager} ${styles.next}`}>{t('works.next')}</Link>
    </motion.main>
  );
}
```

```css
/* src/components/work/WorkDetail.module.css */
.page { min-height: 100vh; padding: 18vh 14vw 12vh; }
.back { display: inline-block; font-size: 12px; letter-spacing: 0.18em; color: var(--color-ink-muted); text-decoration: none; margin-bottom: 40px; }
.back:hover { color: var(--color-accent); }
.label { font-size: 10px; letter-spacing: 0.34em; text-transform: uppercase; color: var(--color-accent); margin-bottom: 14px; }
.title { font-family: var(--font-serif); font-weight: 600; font-size: clamp(38px, 5vw, 64px); letter-spacing: 0.08em; margin: 0 0 18px; }
.meta { display: flex; gap: 8px; margin-bottom: 36px; }
.thumb { height: clamp(220px, 38vw, 460px); border-radius: 8px; background: linear-gradient(135deg, var(--color-accent-soft), var(--color-line)); display: flex; align-items: center; justify-content: center; font-family: var(--font-serif); font-size: 56px; color: var(--color-ink-faint); margin-bottom: 48px; }
.body { columns: 2; column-gap: 5vw; font-size: 14px; line-height: 2.1; color: var(--color-ink-muted); }
.body p { margin: 0 0 1.5em; break-inside: avoid; }
.gh { display: inline-block; margin-top: 28px; font-size: 13px; letter-spacing: 0.15em; color: var(--color-accent); text-decoration: none; border-bottom: 1px solid var(--color-accent); padding-bottom: 3px; }
.pager { position: fixed; top: 50%; writing-mode: vertical-rl; font-size: 12px; letter-spacing: 0.4em; color: var(--color-ink-faint); text-decoration: none; transform: translateY(-50%); z-index: 40; }
.pager:hover { color: var(--color-accent); }
.prev { left: 18px; }
.next { right: 18px; }
@media (max-width: 768px) { .body { columns: 1; } .pager { display: none; } .page { padding: 16vh 8vw 10vh; } }
```

- [ ] **Step 3: ResumePage**

```jsx
// src/components/resume/ResumePage.jsx
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import FixedUI from '../layout/FixedUI.jsx';
import SectionHead from '../common/SectionHead.jsx';
import styles from './ResumePage.module.css';

export default function ResumePage() {
  const { t } = useTranslation();
  const jobs = t('resume.jobs', { returnObjects: true });
  const skillGroups = t('resume.skillGroups', { returnObjects: true });
  return (
    <motion.main
      className={styles.page}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <FixedUI />
      <header className={styles.header}>
        <h1 className={styles.name}>{t('resume.title')}<span className={styles.dot}>。</span></h1>
        <p className={styles.subtitle}>{t('resume.subtitle')}</p>
        <p className={styles.summary}>{t('resume.summary')}</p>
      </header>

      <SectionHead zh={t('nav.resume')} en="Experience" />
      <div className={styles.timeline}>
        {jobs.map((job) => (
          <article key={job.company} className={styles.job}>
            <div className={styles.period}>{job.period}</div>
            <div>
              <h2 className={styles.jobTitle}>{job.title}</h2>
              <div className={styles.company}>{job.company}</div>
              <ul className={styles.points}>
                {job.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
          </article>
        ))}
      </div>

      <SectionHead zh="技能" en="Skills" />
      <table className={styles.skills}>
        <tbody>
          {skillGroups.map((g) => (
            <tr key={g.name}><th>{g.name}</th><td>{g.items}</td></tr>
          ))}
        </tbody>
      </table>
    </motion.main>
  );
}
```

```css
/* src/components/resume/ResumePage.module.css */
.page { max-width: 860px; margin: 0 auto; padding: 16vh 6vw 12vh; }
.name { font-family: var(--font-serif); font-weight: 600; font-size: clamp(40px, 6vw, 64px); margin: 0 0 8px; letter-spacing: 0.08em; }
.dot { color: var(--color-accent); }
.subtitle { font-size: 14px; letter-spacing: 0.2em; color: var(--color-ink-muted); margin: 0 0 24px; }
.summary { font-size: 14px; line-height: 2.1; color: var(--color-ink-muted); margin: 0 0 64px; }
.timeline { margin-bottom: 64px; }
.job { display: grid; grid-template-columns: 140px 1fr; gap: 24px; padding: 28px 0; border-top: 1px solid var(--color-line); }
.period { font-size: 12px; letter-spacing: 0.1em; color: var(--color-ink-faint); }
.jobTitle { font-family: var(--font-serif); font-size: 19px; margin: 0 0 4px; }
.company { font-size: 13px; color: var(--color-accent); margin-bottom: 14px; }
.points { margin: 0; padding-left: 18px; font-size: 13px; line-height: 2; color: var(--color-ink-muted); }
.skills { width: 100%; border-collapse: collapse; font-size: 13px; }
.skills th { text-align: left; padding: 12px 16px 12px 0; width: 130px; font-weight: 500; color: var(--color-accent); vertical-align: top; letter-spacing: 0.08em; }
.skills td { padding: 12px 0; color: var(--color-ink-muted); border-top: 1px solid var(--color-line); }
.skills tr th { border-top: 1px solid var(--color-line); }
@media (max-width: 768px) { .job { grid-template-columns: 1fr; gap: 6px; } }
```

- [ ] **Step 4: SPA 404 fallback**

```js
// scripts/copy-404.mjs
import { copyFileSync } from 'node:fs';
copyFileSync('dist/index.html', 'dist/404.html');
console.log('dist/404.html created');
```

- [ ] **Step 5: 手動驗證**

`npm run dev`：點作品卡 → 轉場進詳情頁（淺色預設）、直書前/後切換、`/resume` 時間軸與技能表、瀏覽器返回鍵正常、手動切主題後跨頁面保持。

- [ ] **Step 6: lint＋commit** — `npm run lint` 通過後 `git add -A && git commit -m "feat: 路由轉場、作品詳情頁、履歷頁"`

---

### Task 8: AI 可讀履歷（TDD）

**Files:**
- Create: `tests/gen-resume.test.mjs`
- Create: `scripts/gen-resume.mjs`

- [ ] **Step 1: 先寫失敗測試**

```js
// tests/gen-resume.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';

execSync('node scripts/gen-resume.mjs');

test('resume.json 是合法 JSON Resume 且含核心欄位', () => {
  const r = JSON.parse(readFileSync('public/resume.json', 'utf8'));
  assert.equal(r.basics.name, '張溦珊');
  assert.equal(r.basics.email, 'shiaushen@gmail.com');
  assert.ok(r.work.length >= 2);
  assert.ok(r.skills.length >= 5);
  assert.ok(r.projects.length >= 3);
});

test('llms.txt 存在且含網站結構說明', () => {
  assert.ok(existsSync('public/llms.txt'));
  const txt = readFileSync('public/llms.txt', 'utf8');
  assert.match(txt, /resume\.json/);
  assert.match(txt, /張溦珊/);
});
```

- [ ] **Step 2: 跑測試確認失敗** — `npm test` → FAIL（gen-resume.mjs 不存在）

- [ ] **Step 3: 實作產生器（從字典同源產出）**

```js
// scripts/gen-resume.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const zh = JSON.parse(readFileSync('src/i18n/zh.json', 'utf8'));
const en = JSON.parse(readFileSync('src/i18n/en.json', 'utf8'));
const { works } = await import('../src/data/works.js');

const SITE = 'https://gexianss.github.io';

const resume = {
  $schema: 'https://raw.githubusercontent.com/jsonresume/resume-schema/master/schema.json',
  basics: {
    name: zh.resume.title,
    label: zh.resume.subtitle,
    email: zh.contact.email,
    url: SITE,
    summary: zh.resume.summary,
    location: { countryCode: 'TW' },
    profiles: [{ network: 'GitHub', username: 'Gexianss', url: 'https://github.com/Gexianss' }],
  },
  work: zh.resume.jobs.map((j, i) => ({
    name: j.company,
    position: j.title,
    startDate: j.period.split(' — ')[0].replace('.', '-'),
    endDate: j.period.split(' — ')[1].replace('.', '-'),
    highlights: j.points,
    summary: en.resume.jobs[i].points.join(' / '),
  })),
  skills: zh.resume.skillGroups.map((g) => ({
    name: g.name,
    keywords: g.items.split(' · '),
  })),
  projects: works.map((w) => ({
    name: zh.works[w.slug].title,
    description: zh.works[w.slug].desc,
    keywords: w.tags,
    url: w.github || `${SITE}/works/${w.slug}`,
  })),
  languages: [
    { language: '中文（繁體）', fluency: 'Native' },
    { language: 'English', fluency: 'Professional' },
  ],
  meta: { canonical: `${SITE}/resume.json`, lastModified: new Date().toISOString().slice(0, 10) },
};

const llms = `# ${zh.resume.title}（Chang Wei-Shan）— 前端工程師

> 這是張溦珊的個人求職網站。本檔案供 AI 工具快速理解網站結構與內容。

## 我是誰
${zh.resume.summary}

## 網站結構
- ${SITE}/ — 首頁（橫向 slider：自介、作品、聯絡）
- ${SITE}/resume — 完整履歷（經歷時間軸＋技能表）
- ${works.map((w) => `${SITE}/works/${w.slug} — ${zh.works[w.slug].title}：${zh.works[w.slug].desc}`).join('\n- ')}

## 機器可讀資料
- ${SITE}/resume.json — JSON Resume 標準格式的完整履歷

## 聯絡
- Email: ${zh.contact.email}
- GitHub: https://github.com/Gexianss
`;

mkdirSync('public', { recursive: true });
writeFileSync('public/resume.json', JSON.stringify(resume, null, 2));
writeFileSync('public/llms.txt', llms);
console.log('public/resume.json + public/llms.txt generated');
```

- [ ] **Step 4: 跑測試確認通過** — `npm test` → 全部 PASS
- [ ] **Step 5: 把 `public/resume.json`、`public/llms.txt` 加進 `.gitignore`**（它們是 build 產物，prebuild 會重新生成）：在 `.gitignore` 追加兩行 `public/resume.json`、`public/llms.txt`
- [ ] **Step 6: Commit** — `git add -A && git commit -m "feat: AI 可讀履歷（resume.json + llms.txt 字典同源產生）"`

---

### Task 9: PWA

**Files:**
- Modify: `vite.config.js`
- Create: `public/icons/icon-192.png`, `public/icons/icon-512.png`（用既有 Python+Playwright 產生）
- Create: `scripts/gen-icons.py`

- [ ] **Step 1: 產 icon（印章 logo 風格）**

```python
# scripts/gen-icons.py
import os
from playwright.sync_api import sync_playwright

os.makedirs('public/icons', exist_ok=True)
HTML = """
<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@600&display=swap');
body { margin:0; } .icon { width:512px; height:512px; background:#2D4D8E; border-radius:96px;
display:flex; align-items:center; justify-content:center;
font-family:'Noto Serif TC',serif; font-weight:600; font-size:280px; color:#F7F4EF; }
</style></head><body><div class="icon">張</div></body></html>
"""
with sync_playwright() as p:
    browser = p.chromium.launch()
    for size in (512, 192):
        page = browser.new_page(viewport={'width': size, 'height': size})
        page.set_content(HTML.replace('512px', f'{size}px').replace('96px', f'{size*96//512}px').replace('280px', f'{size*280//512}px'))
        page.wait_for_timeout(1500)
        page.screenshot(path=f'public/icons/icon-{size}.png')
    browser.close()
print('icons generated')
```

Run: `python scripts/gen-icons.py` → 確認兩個 PNG 存在且打開是靛藍底白「張」。

- [ ] **Step 2: vite.config.js 加 PWA**

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['llms.txt', 'resume.json'],
      manifest: {
        name: '張溦珊｜前端工程師',
        short_name: '張溦珊',
        description: '張溦珊的履歷與作品集',
        lang: 'zh-Hant',
        start_url: '/',
        display: 'standalone',
        background_color: '#1C1B19',
        theme_color: '#2D4D8E',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,json,txt}'],
        runtimeCaching: [{
          urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/,
          handler: 'CacheFirst',
          options: { cacheName: 'google-fonts', expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 } },
        }],
      },
    }),
  ],
});
```

- [ ] **Step 3: 驗證**

Run: `npm run build && npm run preview` → DevTools Application 分頁確認 manifest 正確、service worker 註冊成功；離線勾選後重整仍可瀏覽。

- [ ] **Step 4: Commit** — `git add -A && git commit -m "feat: PWA（manifest/SW/離線快取/印章 icon）"`

---

### Task 10: Playwright smoke 測試

**Files:**
- Create: `playwright.config.js`
- Create: `e2e/smoke.spec.js`

- [ ] **Step 1: 設定**

```js
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  use: { baseURL: 'http://localhost:4173' },
  webServer: {
    command: 'npm run build && npm run preview',
    port: 4173,
    reuseExistingServer: true,
    timeout: 120000,
  },
});
```

- [ ] **Step 2: smoke 測試**

```js
// e2e/smoke.spec.js
import { test, expect } from '@playwright/test';

test('首頁載入且橫向滑動有位移', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('張溦珊');
  await page.waitForTimeout(2000); // 等掀頁動畫
  for (let i = 0; i < 8; i++) { await page.mouse.wheel(0, 400); await page.waitForTimeout(80); }
  await page.waitForTimeout(1200);
  const transform = await page.evaluate(() => document.querySelector('[class*="track"]').style.transform);
  expect(transform).toMatch(/translateX\(-\d+/);
});

test('主題切換生效', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(2000);
  expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe('dark');
  await page.getByRole('button', { name: /深色|Dark/ }).click();
  expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe('light');
});

test('語言切換生效', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await expect(page.locator('h1')).toContainText('Chang Wei-Shan');
});

test('履歷頁與作品頁可達', async ({ page }) => {
  await page.goto('/resume');
  await expect(page.locator('h1')).toContainText('張溦珊');
  await page.goto('/works/noodle-pos');
  await expect(page.locator('h1')).toContainText('Noodle POS');
});
```

- [ ] **Step 3: 跑測試**

Run: `npx playwright install chromium`（若未裝）→ `npm run smoke`
Expected: 4 passed

- [ ] **Step 4: Commit** — `git add -A && git commit -m "test: Playwright smoke（slider/主題/語言/路由）"`

---

### Task 11: CI/CD 與 README

**Files:**
- Create: `.github/workflows/deploy.yml`
- Create: `README.md`

- [ ] **Step 1: workflow**

```yaml
name: Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: README.md**

```markdown
# 張溦珊｜前端工程師 — 個人網站

[![Deploy](https://github.com/Gexianss/gexianss.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/Gexianss/gexianss.github.io/actions/workflows/deploy.yml)

日系沉靜留白風格的履歷＋作品集網站。橫向 slider 首頁（致敬 hiraomakoto.jp 的互動模式）、
直向內頁、中英雙語、深淺色主題、PWA 離線可用，並提供 AI 可讀履歷。

**Live:** https://gexianss.github.io ｜ **AI 入口:** [llms.txt](https://gexianss.github.io/llms.txt) · [resume.json](https://gexianss.github.io/resume.json)

## 技術

React 19 + Vite 7（JavaScript）· react-i18next · framer-motion · vite-plugin-pwa · CSS Modules + design tokens

## 開發

```bash
npm i
npm run dev      # 開發
npm test         # 單元測試（字典一致性、作品資料、AI 履歷產生器）
npm run smoke    # Playwright E2E
npm run build    # 產出 dist/（含 resume.json/llms.txt/404.html）
```

設計規格與決策見 `docs/superpowers/specs/`，design tokens 見 `src/styles/tokens.css`。
```

- [ ] **Step 3: 本機全綠驗證**

Run: `npm run lint && npm test && npm run build`
Expected: 全部通過、dist/ 含 index.html、404.html、resume.json、llms.txt、manifest

- [ ] **Step 4: Commit** — `git add -A && git commit -m "ci: GitHub Actions 部署流程與 README"`

---

### Task 12: 發布

- [ ] **Step 1:** 在 GitHub 建立 repo `Gexianss/gexianss.github.io`（Public）
- [ ] **Step 2:** `git remote add origin https://github.com/Gexianss/gexianss.github.io.git && git push -u origin main`
- [ ] **Step 3:** GitHub repo Settings → Pages → Source 選 **GitHub Actions**
- [ ] **Step 4:** 確認 Actions 跑綠、`https://gexianss.github.io` 上線、手機開啟可「加入主畫面」
- [ ] **Step 5:** 用 Playwright 對線上網址跑一次 smoke（改 baseURL）確認部署版本行為一致

---

## Self-Review 紀錄

- Spec 覆蓋：§2 決策表（Task 1/2/9/11）、§3 資訊架構（Task 6/7）、§4-5 設計語言與 slider（Task 6）、§6 內容（Task 2/3）、§7 AI 可讀履歷（Task 8）、§7.5 元件切分（Task 4-7 結構）、§8 測試（Task 2/3/8/10）、§9 風險（vite 7 鎖版、404 fallback、reduced-motion）✓
- 電話號碼未出現在任何字典/產出 ✓（spec §6）
- 型別/命名一致性：`useTheme.jsx`（含 JSX）、tokens 用全名 `--color-*` ✓
