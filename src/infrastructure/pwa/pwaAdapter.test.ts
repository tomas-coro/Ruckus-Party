import { describe, expect, it, vi } from 'vitest';

import { createPwaAdapter } from './pwaAdapter';

describe('createPwaAdapter', () => {
  it('waits for an installing worker before reporting an update ready', async () => {
    const installing = new EventTarget() as ServiceWorker;
    Object.defineProperty(installing, 'state', { value: 'installing', configurable: true });
    const update = vi.fn<() => Promise<ServiceWorkerRegistration>>();
    const registration = {
      installing,
      waiting: null,
      update,
    } as unknown as ServiceWorkerRegistration;
    update.mockResolvedValue(registration);
    const port = createPwaAdapter({
      registration: () => registration,
      needsRefresh: () => false,
      activateWaitingWorker: () => Promise.resolve(),
    });

    const resultPromise = port.check();
    Object.defineProperty(registration, 'waiting', { value: {}, configurable: true });
    Object.defineProperty(installing, 'state', { value: 'installed' });
    installing.dispatchEvent(new Event('statechange'));

    await expect(resultPromise).resolves.toEqual({ ok: true, value: 'ready' });
  });
});
