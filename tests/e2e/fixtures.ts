import { test as base, expect } from '@playwright/test';

import { guardBrowser, type BrowserGuard } from './consoleGuard';

interface RuckusFixtures {
  readonly browserGuard: BrowserGuard;
}

export const test = base.extend<RuckusFixtures>({
  browserGuard: [async ({ page }, provide) => {
    const guard = guardBrowser(page);
    await provide(guard);
    guard.assertClean();
  }, { auto: true }],
});

export { expect };

export async function startTwoPlayerParty(page: import('@playwright/test').Page) {
  await page.goto('./');
  await page.getByRole('button', { name: 'Inizia serata' }).click();
  await page.getByLabel('Nome giocatore 1').fill('Ada');
  await page.getByLabel('Nome giocatore 2').fill('Luca');
  await page.getByRole('button', { name: 'Continua' }).click();
  await page.getByRole('button', { name: 'Continua' }).click();
  await expect(page.getByRole('heading', { name: 'Pronti per iniziare' })).toBeVisible();
}

export async function revealFor(page: import('@playwright/test').Page, playerName: string) {
  await expect(page.getByRole('heading', { name: 'Contenuto nascosto' })).toBeVisible();
  await page.getByRole('button', { name: `Sono ${playerName}` }).click();
  await page.getByRole('button', { name: 'Tocca per mostrare o nascondere il segreto' }).click();
  const memorized = page.getByRole('button', { name: 'Ho memorizzato' });
  await memorized.click();
  await expect(memorized).not.toBeVisible();
}

export async function readActiveSession(page: import('@playwright/test').Page) {
  return page.evaluate(async () => new Promise<unknown>((resolve, reject) => {
    const request = indexedDB.open('ruckus-party');
    request.onerror = () => { reject(request.error ?? new Error('Could not open IndexedDB')); };
    request.onsuccess = () => {
      const transaction = request.result.transaction('activeSession', 'readonly');
      const get = transaction.objectStore('activeSession').get('current');
      get.onerror = () => { reject(get.error ?? new Error('Could not read active session')); };
      get.onsuccess = () => { resolve(get.result); };
    };
  }));
}
