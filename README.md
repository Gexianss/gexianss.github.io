# 張溦珊 ｜ 個人網站

[![Deploy](https://github.com/Gexianss/gexianss.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/Gexianss/gexianss.github.io/actions/workflows/deploy.yml)

> 嗨，我是張溦珊，一位前端工程師。這是我的個人網站，也是我的履歷與作品集。

**🌐 Live:** https://gexianss.github.io

整個網站走日系沉靜留白風格：首頁是橫向 slider（致敬 [hiraomakoto.jp](https://hiraomakoto.jp/) 的互動模式），
作品點進去切換成直向內頁。支援中英雙語、深淺色主題，是一個可安裝、離線也能看的 PWA，
並提供給 AI 工具直接讀取的機器可讀履歷。

這個 repo 本身就是我的一份作品——從設計系統、元件拆分到 CI/CD，都是我平常的工作方式。

## ✨ 特色

- **橫向 slider 首頁** — 滾輪／方向鍵驅動，背景光暈隨捲動視差移動，開場有掀頁動畫
- **中英雙語** — react-i18next，文案全部集中在字典檔，一鍵切換
- **深淺色主題** — 首頁預設深色、內頁預設淺色，手動切換後全站記住
- **PWA** — 可加入主畫面、離線可用
- **AI 可讀履歷** — [`llms.txt`](https://gexianss.github.io/llms.txt)（給 AI 的網站導覽）＋ [`resume.json`](https://gexianss.github.io/resume.json)（JSON Resume 標準格式），由 i18n 字典同源產生

## 🛠 技術

React 19 · Vite 7 · react-i18next · Framer Motion · vite-plugin-pwa · CSS Modules + design tokens（純 JavaScript）

部署在 GitHub Pages，透過 GitHub Actions 自動 lint → test → build → deploy。

## 📁 專案結構

```
src/components/      依職責分區的 React 元件
  home/              首頁橫向 slider（HomePage、各 Panel、GlowLayer）
  work/              作品詳情頁
  resume/            履歷頁
  layout/            固定 UI、掀頁開場
  common/            共用小元件
src/hooks/           自訂 hooks（橫向捲動、主題、reduced-motion）
src/i18n/            zh / en 雙語字典

design-system/       設計系統原稿（色票、字型、元件）
prototypes/          設計階段的可動原型
docs/superpowers/    設計規格（specs）與實作計畫（plans）
```

## 💻 在本機開發

```bash
npm install
npm run dev      # 開發伺服器（http://localhost:5173）
npm test         # 單元測試
npm run smoke    # Playwright E2E 測試
npm run pdf      # 重新生成履歷 PDF（履歷內容改動後執行並 commit）
npm run build    # 產出 dist/（含 resume.json、llms.txt、404.html）
```

## 📮 聯絡我

- Email：shiaushen@gmail.com
- GitHub：[@Gexianss](https://github.com/Gexianss)
