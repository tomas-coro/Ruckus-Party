import { expect, readActiveSession, revealFor, startTwoPlayerParty, test } from './fixtures';

test('completa una Party Night in italiano e assegna un solo punto dopo conferma', async ({ page }) => {
  await startTwoPlayerParty(page);
  await expect(page.getByRole('heading', { name: 'Pronti per iniziare' })).toBeVisible();
  await page.getByRole('button', { name: 'Conferma setup' }).click();
  await expect(page.getByRole('heading', { name: 'Segnali segreti' })).toBeVisible();
  await page.getByRole('button', { name: 'Inizia gioco' }).click();

  await revealFor(page, 'Ada');
  await revealFor(page, 'Luca');

  await expect(page.getByRole('heading', { name: 'I segreti sono nascosti' })).toBeVisible();
  await page.getByLabel('Ada').check();
  await page.getByRole('button', { name: 'Conferma accusa' }).click();
  await expect(page.getByRole('heading', { name: 'Ada' })).toBeVisible();
  await expect(page.getByText('0 punti')).toBeVisible();

  await page.getByRole('button', { name: 'Correggi risultato' }).click();
  await page.getByLabel('Luca').check();
  await page.getByRole('button', { name: 'Salva correzione' }).click();
  await expect(page.getByRole('heading', { name: 'Luca' })).toBeVisible();
  await expect(page.getByText('0 punti')).toBeVisible();
  await page.getByRole('button', { name: 'Conferma risultato' }).click();

  await expect(page.getByRole('heading', { name: 'Classifica' })).toBeVisible();
  await expect(page.getByRole('listitem').filter({ hasText: 'Luca' })).toContainText('1 punto');
  await expect(page.getByRole('listitem').filter({ hasText: 'Ada' })).toContainText('0 punti');
});

test('cambia lingua senza alterare la sessione e raggiunge lo stesso risultato in inglese', async ({ page }) => {
  await startTwoPlayerParty(page);
  const before = await readActiveSession(page);

  await page.goto('./#/settings');
  await page.getByRole('button', { name: 'English' }).click();
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
  await page.getByRole('button', { name: 'Back' }).click();
  const after = await readActiveSession(page);
  expect(after).toEqual(before);

  await page.getByRole('button', { name: 'Confirm setup' }).click();
  await page.getByRole('button', { name: 'Start game' }).click();
  for (const player of ['Ada', 'Luca']) {
    await expect(page.getByRole('heading', { name: 'Content hidden' })).toBeVisible();
    await page.getByRole('button', { name: `I am ${player}` }).click();
    await page.getByRole('button', { name: 'Tap to show or hide your secret' }).click();
    await page.getByRole('button', { name: 'I memorized it' }).click();
  }
  await expect(page.getByRole('heading', { name: 'The secrets are hidden' })).toBeVisible();
  await page.getByLabel('Luca').check();
  await page.getByRole('button', { name: 'Confirm accusation' }).click();
  await expect(page.getByText('0 points')).toBeVisible();
  await page.getByRole('button', { name: 'Confirm result' }).click();
  await expect(page.getByRole('heading', { name: 'Standings' })).toBeVisible();
  await expect(page.getByRole('listitem').filter({ hasText: 'Luca' })).toContainText('1 point');
});
