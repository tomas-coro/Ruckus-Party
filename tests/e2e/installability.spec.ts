import { expect, test } from './fixtures';

test('espone manifest, icone installabili e un service worker controllante', async ({
  page,
  request,
}) => {
  await page.goto('./');
  await expect.poll(() => page.evaluate(async () => Boolean((await navigator.serviceWorker.getRegistration())?.active))).toBe(true);
  await page.reload();
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);

  const manifestHref = await page.locator('link[rel="manifest"]').getAttribute('href');
  expect(manifestHref).toBe('/Ruckus-Party/manifest.webmanifest');
  const manifest = await (await request.get(manifestHref ?? '')).json() as { icons: { src: string }[] };
  for (const icon of [...manifest.icons, { src: 'icons/apple-touch-icon-180.png' }]) {
    const response = await request.get(new URL(icon.src, page.url()).toString());
    expect(response.status(), icon.src).toBe(200);
  }
});
