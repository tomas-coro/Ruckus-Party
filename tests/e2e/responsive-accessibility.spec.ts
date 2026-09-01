import { expect, startTwoPlayerParty, test } from './fixtures';

test('mantiene layout, target principali e reduced motion nei limiti', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const actionBox = await page.getByTestId('dominant-action').boundingBox();
  expect(actionBox?.height ?? 0).toBeGreaterThanOrEqual(44);
  expect(actionBox?.width ?? 0).toBeGreaterThanOrEqual(44);
  await startTwoPlayerParty(page);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const activeAnimations = await page.evaluate(() => document.getAnimations().filter((animation) => animation.playState === 'running').length);
  expect(activeAnimations).toBe(0);
});
