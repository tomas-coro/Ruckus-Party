import { expect, revealFor, startTwoPlayerParty, test } from './fixtures';

test('riprende tutte le fasi persistite e ricopre sempre il reveal privato', async ({ page }) => {
  await startTwoPlayerParty(page);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Pronti per iniziare' })).toBeVisible();

  await page.getByRole('button', { name: 'Conferma setup' }).click();
  await expect(page.getByRole('heading', { name: 'Segnali segreti' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Segnali segreti' })).toBeVisible();

  await page.getByRole('button', { name: 'Inizia gioco' }).click();
  await page.getByRole('button', { name: 'Sono Ada' }).click();
  await page.getByRole('button', { name: 'Tocca per mostrare o nascondere il segreto' }).click();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Contenuto nascosto' })).toBeVisible();
  await revealFor(page, 'Ada');
  await revealFor(page, 'Luca');

  await page.reload();
  await expect(page.getByRole('heading', { name: 'I segreti sono nascosti' })).toBeVisible();
  await page.getByLabel('Ada').check();
  await page.getByRole('button', { name: 'Conferma accusa' }).click();
  await expect(page.getByRole('heading', { name: 'Ada' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Ada' })).toBeVisible();
  await expect(page.getByText('0 punti')).toBeVisible();

  await page.getByRole('button', { name: 'Conferma risultato' }).click();
  await expect(page.getByRole('heading', { name: 'Classifica' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Classifica' })).toBeVisible();
  await expect(page.getByRole('listitem').filter({ hasText: 'Ada' })).toContainText('1 punto');
});
