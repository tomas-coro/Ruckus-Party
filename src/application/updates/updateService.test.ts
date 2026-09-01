import { describe, expect, it, vi } from 'vitest';

import type { UpdatePort } from '../ports';
import { createUpdateService } from './updateService';

function createPort() {
  const check = vi.fn(() => Promise.resolve({ ok: true, value: 'current' } as const));
  const activate = vi.fn(() => Promise.resolve({ ok: true, value: undefined } as const));
  const defer = vi.fn(() => Promise.resolve());
  const port: UpdatePort = { check, activate, defer };
  return { port, check, activate, defer };
}

describe('UpdateService', () => {
  it('returns a typed offline error without checking the service worker', async () => {
    const { port, check } = createPort();
    const service = createUpdateService(port);

    expect(await service.check({ online: false })).toEqual({
      ok: false,
      error: { type: 'update-offline', code: 'UPDATE_OFFLINE' },
    });
    expect(check).not.toHaveBeenCalled();
  });

  it('keeps an automatic current check silent and publishes ready only when needed', async () => {
    const { port } = createPort();
    const onReady = vi.fn();
    const service = createUpdateService(port);

    await service.checkAutomatically({ online: true, onReady });
    expect(onReady).not.toHaveBeenCalled();

    port.check = vi.fn(() => Promise.resolve({ ok: true, value: 'ready' } as const));
    await service.checkAutomatically({ online: true, onReady });
    expect(onReady).toHaveBeenCalledOnce();
  });

  it('activates without a session and defers while a session is active', async () => {
    const { port, activate, defer } = createPort();
    const service = createUpdateService(port);

    expect(await service.activate({ hasActiveSession: false })).toEqual({
      ok: true,
      value: 'activated',
    });
    expect(activate).toHaveBeenCalledOnce();

    expect(await service.activate({ hasActiveSession: true })).toEqual({
      ok: true,
      value: 'deferred',
    });
    expect(activate).toHaveBeenCalledOnce();
    expect(defer).toHaveBeenCalledOnce();
  });
});
