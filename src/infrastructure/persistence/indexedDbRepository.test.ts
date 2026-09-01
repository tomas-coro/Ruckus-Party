import 'fake-indexeddb/auto';

import { describe, expect, it } from 'vitest';

import { createActiveSession } from '../../domain/session/activeSession';
import {
  IndexedDbSessionRepository,
  IndexedDbSettingsRepository,
} from './indexedDbRepository';
import { openRuckusDatabase } from './schema';

let databaseSequence = 0;

function uniqueDbName(): string {
  databaseSequence += 1;
  return `ruckus-test-${String(databaseSequence)}`;
}

describe('IndexedDB v1', () => {
  it('creates only the four v1 stores', async () => {
    const db = await openRuckusDatabase({ name: uniqueDbName() });

    expect([...db.objectStoreNames]).toEqual([
      'activeSession',
      'diagnostics',
      'meta',
      'settings',
    ]);
    expect([...db.objectStoreNames]).not.toContain('extraGames');
    db.close();
  });

  it('round-trips one active session while keeping settings independent', async () => {
    const db = await openRuckusDatabase({ name: uniqueDbName() });
    const sessions = new IndexedDbSessionRepository(Promise.resolve(db));
    const settings = new IndexedDbSettingsRepository(Promise.resolve(db));
    const session = createActiveSession({
      id: 'session-1',
      contentVersion: 1,
      random: { seed: 4, position: 0 },
      createdAt: 10,
    });

    expect(await sessions.save(session)).toEqual({ ok: true, value: undefined });
    expect(await settings.save({ locale: 'en' })).toEqual({ ok: true, value: undefined });
    expect(await sessions.load()).toEqual({ ok: true, value: session });
    expect(await settings.load()).toEqual({ ok: true, value: { locale: 'en' } });

    const replacement = { ...session, updatedAt: 20 };
    await sessions.save(replacement);
    expect(await sessions.load()).toEqual({ ok: true, value: replacement });
    db.close();
  });

  it('returns explicit preserving errors when the database cannot be read or written', async () => {
    const failedDatabase = Promise.reject(new DOMException('blocked', 'InvalidStateError'));
    const sessions = new IndexedDbSessionRepository(failedDatabase);

    expect(await sessions.load()).toMatchObject({
      ok: false,
      error: { type: 'read-failed', safeState: 'preserved' },
    });
    expect(await sessions.save(createActiveSession({
      id: 'session-2',
      contentVersion: 1,
      random: { seed: 5, position: 0 },
      createdAt: 10,
    }))).toMatchObject({
      ok: false,
      error: { type: 'write-failed', safeState: 'preserved' },
    });
  });
});
