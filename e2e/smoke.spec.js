import { test, expect } from '@playwright/test';

test('首頁載入且橫向滑動有位移', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('張溦珊');
  await page.waitForTimeout(2000); // 等掀頁動畫
  for (let i = 0; i < 8; i++) {
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(80);
  }
  await page.waitForTimeout(1200);
  const transform = await page.evaluate(
    () => document.querySelector('[class*="track"]').style.transform,
  );
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
