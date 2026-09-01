import { expect, startTwoPlayerParty, test } from './fixtures';

test('ricarica la shell offline e avvia una Party Night senza rete', async ({
  page,
  context,
  browserName,
}) => {
  test.skip(
    browserName === 'webkit',
    'Playwright WebKit cannot emulate an offline service-worker navigation without an internal error.',
  );
  await page.goto('./');
  await expect(page.getByText('Disponibile anche offline')).toBeVisible();
  await expect.poll(() => page.evaluate(async () => Boolean((await navigator.serviceWorker.getRegistration())?.active))).toBe(true);
  await page.reload();
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: 'Ruckus Party' })).toBeVisible();
  await startTwoPlayerParty(page);
  await expect(page.getByRole('heading', { name: 'Pronti per iniziare' })).toBeVisible();
});
