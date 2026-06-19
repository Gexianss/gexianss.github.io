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

// robots.txt + sitemap.xml（與 works 同源，永不漂移）
const routes = ['/', '/resume', ...works.map((w) => `/works/${w.slug}`)];
const robots = `User-agent: *
Allow: /

# 機器可讀履歷與 AI 導覽
# ${SITE}/resume.json
# ${SITE}/llms.txt

Sitemap: ${SITE}/sitemap.xml
`;
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((r) => `  <url><loc>${SITE}${r}</loc></url>`).join('\n')}
</urlset>
`;

mkdirSync('public', { recursive: true });
writeFileSync('public/resume.json', JSON.stringify(resume, null, 2));
writeFileSync('public/llms.txt', llms);
writeFileSync('public/robots.txt', robots);
writeFileSync('public/sitemap.xml', sitemap);
console.log('public/resume.json + llms.txt + robots.txt + sitemap.xml generated');
