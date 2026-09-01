import { expect, type Page, type Response } from '@playwright/test';

export interface BrowserGuard {
  assertClean(): void;
}

export function guardBrowser(page: Page): BrowserGuard {
  const errors: string[] = [];

  page.on('pageerror', (error) => { errors.push(`pageerror: ${error.message}`); });
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().includes('ERR_INTERNET_DISCONNECTED')) {
      errors.push(`console: ${message.text()}`);
    }
  });
  page.on('response', (response: Response) => {
    if (response.status() === 404) errors.push(`404: ${response.url()}`);
  });

  return {
    assertClean() {
      expect(errors, errors.join('\n')).toEqual([]);
    },
  };
}
