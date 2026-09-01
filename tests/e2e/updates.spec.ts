import { spawn, type ChildProcess } from 'node:child_process';

import { expect, test } from './fixtures';

let server: ChildProcess | undefined;

test.beforeAll(async () => {
  server = spawn(process.execPath, ['scripts/pwa-test-server.mjs'], { cwd: process.cwd() });
  await expect.poll(async () => fetch('http://127.0.0.1:4174/Ruckus-Party/').then((response) => response.ok).catch(() => false)).toBe(true);
});

test.afterAll(() => { server?.kill(); });

test('rileva v2, non ricarica e rinvia l update durante una sessione', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium-375', 'Update fixture covered once in Chromium');
  await page.goto('http://127.0.0.1:4174/Ruckus-Party/');
  await expect.poll(() => page.evaluate(async () => Boolean((await navigator.serviceWorker.getRegistration())?.active))).toBe(true);
  await page.reload();
  await page.getByRole('button', { name: 'Inizia serata' }).click();
  await expect(page.getByRole('heading', { name: 'Chi gioca?' })).toBeVisible();
  const sessionId = await page.evaluate(async () => new Promise<string>((resolve, reject) => {
    const request = indexedDB.open('ruckus-party');
    request.onerror = () => { reject(request.error ?? new Error('Could not open IndexedDB')); };
    request.onsuccess = () => {
      const get = request.result.transaction('activeSession').objectStore('activeSession').get('current');
      get.onerror = () => { reject(get.error ?? new Error('Could not read session')); };
      get.onsuccess = () => { resolve((get.result as { id: string }).id); };
    };
  }));
  await page.evaluate(() => fetch('/__test/switch-to-v2', { method: 'POST' }));
  await page.goto('http://127.0.0.1:4174/Ruckus-Party/#/settings');
  await page.getByRole('button', { name: 'Controlla aggiornamenti' }).click();
  await expect(page.getByText('Aggiornamento pronto')).toBeVisible();
  await page.getByRole('button', { name: 'Installa dopo la Party Night' }).click();
  await expect(page.getByText('L’aggiornamento verrà installato dopo la Party Night')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.dataset.appVersion)).toBe('v1');
  expect(await page.evaluate(async () => new Promise<string>((resolve) => {
    const request = indexedDB.open('ruckus-party');
    request.onsuccess = () => {
      const get = request.result.transaction('activeSession').objectStore('activeSession').get('current');
      get.onsuccess = () => { resolve((get.result as { id: string }).id); };
    };
  }))).toBe(sessionId);
});
