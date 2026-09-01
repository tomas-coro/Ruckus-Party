import { expect, test } from './fixtures';

for (const fault of ['storage-unavailable', 'migration-failure'] as const) {
  test(`mostra recovery esplicita per ${fault}`, async ({ page }) => {
    await page.addInitScript((value) => { window.__RUCKUS_TEST_FAULT__ = value; }, fault);
    await page.goto('./');
    await expect(page.getByRole('alert')).toContainText('Lo stato precedente è al sicuro.');
    await expect(page.getByRole('button', { name: 'Riprova' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Esporta diagnostica' })).toBeVisible();
  });
}

test('un write failure conserva lo stato e il reset richiede conferma', async ({ page }) => {
  await page.addInitScript(() => { window.__RUCKUS_TEST_FAULT__ = 'write-failure'; });
  await page.goto('./');
  await page.getByRole('button', { name: 'Inizia serata' }).click();
  await expect(page.getByRole('alert')).toContainText('Salvataggio non riuscito.');
  await page.getByRole('button', { name: 'Riprova' }).click();
  await expect(page.getByRole('alert')).toContainText('Lo stato precedente è al sicuro.');

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Esporta diagnostica' }).click();
  expect((await downloadPromise).suggestedFilename()).toBe('ruckus-party-diagnostics.json');

  await page.getByRole('button', { name: 'Reimposta dati' }).click();
  await expect(page.getByRole('dialog')).toContainText('verranno eliminate');
  await page.getByRole('button', { name: 'Annulla' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

declare global {
  interface Window {
    __RUCKUS_TEST_FAULT__?: 'write-failure' | 'migration-failure' | 'storage-unavailable';
  }
}
