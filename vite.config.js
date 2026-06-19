import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const SITE = 'https://gexianss.github.io';

// 從 i18n 字典生成 schema.org/Person 結構化資料，build/dev 時 inline 進 <head>。
// 與履歷同源，姓名/職稱/技能改了會自動同步。
function personJsonLd() {
  return {
    name: 'inject-person-jsonld',
    transformIndexHtml() {
      const zh = JSON.parse(readFileSync('src/i18n/zh.json', 'utf8'));
      const en = JSON.parse(readFileSync('src/i18n/en.json', 'utf8'));
      const skills = [...new Set(zh.resume.skillGroups.flatMap((g) => g.items.split(' · ')))];
      const person = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: zh.resume.title,
        alternateName: en.resume.title,
        jobTitle: zh.resume.subtitle.split(/[／/]/)[0].trim(),
        description: zh.resume.summary,
        email: zh.contact.email,
        url: SITE,
        sameAs: ['https://github.com/Gexianss'],
        knowsAbout: skills,
      };
      return [
        {
          tag: 'script',
          attrs: { type: 'application/ld+json' },
          children: JSON.stringify(person),
          injectTo: 'head',
        },
      ];
    },
  };
}

export default defineConfig({
  server: {
    port: 3001,        
    strictPort: true,  // 被占用就直接報錯，不要自動跳號
  },
  plugins: [
    react(),
    personJsonLd(),
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
