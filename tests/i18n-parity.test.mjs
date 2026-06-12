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
