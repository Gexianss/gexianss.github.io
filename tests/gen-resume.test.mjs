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
