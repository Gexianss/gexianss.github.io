// 從 i18n 字典生成列印優化的履歷 PDF（中／英各一份）。
// 對應 scripts/gen-icons.py 的角色：本機用 Playwright 生成二進位、commit 進 repo、CI 不重跑。
// 內容改動後執行 `npm run pdf` 重新生成並 commit。
import { readFileSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const zh = JSON.parse(readFileSync('src/i18n/zh.json', 'utf8'));
const en = JSON.parse(readFileSync('src/i18n/en.json', 'utf8'));

const LANGS = [
  { code: 'zh', dict: zh, expHead: '經歷', skillHead: '技能' },
  { code: 'en', dict: en, expHead: 'Experience', skillHead: 'Skills' },
];

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

function template({ dict, expHead, skillHead }) {
  const r = dict.resume;
  const c = dict.contact;

  const jobs = r.jobs
    .map(
      (job) => `
      <article class="job">
        <div class="period">${esc(job.period)}</div>
        <div class="job-body">
          <h2 class="job-title">${esc(job.title)}</h2>
          <div class="company">${esc(job.company)}</div>
          <ul class="points">
            ${job.points.map((p) => `<li>${esc(p)}</li>`).join('')}
          </ul>
        </div>
      </article>`,
    )
    .join('');

  const skills = r.skillGroups
    .map(
      (g) => `
      <tr>
        <th>${esc(g.name)}</th>
        <td>${esc(g.items)}</td>
      </tr>`,
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="${dict === zh ? 'zh-Hant' : 'en'}">
<head>
<meta charset="UTF-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;600&family=Noto+Sans+TC:wght@300;400;500&display=swap" rel="stylesheet" />
<style>
  :root {
    --ink: #2b2a26;
    --ink-muted: rgba(43, 42, 38, 0.66);
    --ink-faint: rgba(43, 42, 38, 0.5);
    --line: rgba(43, 42, 38, 0.18);
    --accent: #2d4d8e;
    --serif: 'Noto Serif TC', serif;
    --sans: 'Noto Sans TC', sans-serif;
  }
  @page { size: A4; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: var(--sans);
    color: var(--ink);
    font-size: 11px;
    line-height: 1.85;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .contact {
    display: flex;
    gap: 18px;
    font-size: 10.5px;
    letter-spacing: 0.04em;
    color: var(--ink-muted);
    margin-bottom: 18px;
  }
  .contact .accent { color: var(--accent); }
  .name {
    font-family: var(--serif);
    font-weight: 600;
    font-size: 30px;
    letter-spacing: 0.06em;
    margin: 0 0 6px;
  }
  .name .dot { color: var(--accent); }
  .subtitle {
    font-size: 12px;
    letter-spacing: 0.18em;
    color: var(--ink-muted);
    margin: 0 0 16px;
  }
  .summary {
    font-size: 11px;
    line-height: 1.95;
    color: var(--ink-muted);
    margin: 0 0 18px;
  }
  .sec-head {
    display: flex;
    align-items: baseline;
    gap: 10px;
    border-top: 1px solid var(--line);
    padding-top: 8px;
    margin-bottom: 4px;
  }
  .sec-head .zh {
    font-family: var(--serif);
    font-weight: 600;
    font-size: 16px;
    letter-spacing: 0.18em;
  }
  .sec-head .en {
    font-size: 9px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--ink-faint);
  }
  .job {
    display: grid;
    grid-template-columns: 96px 1fr;
    gap: 18px;
    padding: 11px 0;
    break-inside: avoid;
  }
  .period { font-size: 10px; letter-spacing: 0.08em; color: var(--ink-faint); padding-top: 3px; }
  .job-title { font-family: var(--serif); font-weight: 600; font-size: 14px; margin: 0 0 2px; }
  .company { font-size: 11px; color: var(--accent); margin-bottom: 8px; }
  .points { margin: 0; padding-left: 16px; }
  .points li { margin-bottom: 3px; }
  .skills { width: 100%; border-collapse: collapse; margin-top: 6px; }
  .skills th {
    text-align: left;
    vertical-align: top;
    width: 110px;
    padding: 6px 14px 6px 0;
    font-weight: 500;
    letter-spacing: 0.06em;
    color: var(--accent);
    border-top: 1px solid var(--line);
  }
  .skills td { padding: 6px 0; color: var(--ink-muted); border-top: 1px solid var(--line); }
  .block { margin-bottom: 18px; }
</style>
</head>
<body>
  <div class="contact">
    <span><span class="accent">✉</span> ${esc(c.email)}</span>
    <span><span class="accent">⌥</span> ${esc(c.github)}</span>
  </div>
  <h1 class="name">${esc(r.title)}<span class="dot">。</span></h1>
  <div class="subtitle">${esc(r.subtitle)}</div>
  <p class="summary">${esc(r.summary)}</p>

  <div class="block">
    <div class="sec-head"><span class="zh">${esc(expHead)}</span><span class="en">Experience</span></div>
    ${jobs}
  </div>

  <div class="block">
    <div class="sec-head"><span class="zh">${esc(skillHead)}</span><span class="en">Skills</span></div>
    <table class="skills"><tbody>${skills}</tbody></table>
  </div>
</body>
</html>`;
}

mkdirSync('public', { recursive: true });
const browser = await chromium.launch();
try {
  for (const lang of LANGS) {
    const page = await browser.newPage();
    await page.setContent(template(lang), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({
      path: `public/resume-${lang.code}.pdf`,
      format: 'A4',
      printBackground: true,
      margin: { top: '16mm', bottom: '14mm', left: '16mm', right: '16mm' },
    });
    await page.close();
    console.log(`public/resume-${lang.code}.pdf generated`);
  }
} finally {
  await browser.close();
}
