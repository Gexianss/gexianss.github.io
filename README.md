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
