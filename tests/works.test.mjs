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
