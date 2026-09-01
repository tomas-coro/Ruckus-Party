import { describe, expect, it } from 'vitest';

import type {
  DiagnosticsPort,
  LocalSettings,
  SessionRepository,
  SettingsRepository,
} from '../application/ports';
import type { Result } from '../application/result';
import { secretSignalsDefinition } from '../content/games/secretSignalsDefinition';
import type { ActiveSession } from '../domain/session/activeSession';
import { FakeClock } from '../test/fakes/fakeClock';
import { FakeSeedSource } from '../test/fakes/fakeSeedSource';
import { bootstrapApp, type BootstrapDependencies } from './bootstrap';

const diagnostics: DiagnosticsPort = {
  record: () => Promise.resolve(),
  export: () => Promise.resolve({ ok: true, value: new Blob() }),
};

const settingsRepository: SettingsRepository = {
  load: () => Promise.resolve({ ok: true, value: { locale: 'it' } }),
  save: () => Promise.resolve({ ok: true, value: undefined }),
};

function dependencies(
  load: () => Promise<Result<ActiveSession | null>>,
): BootstrapDependencies {
  const sessionRepository: SessionRepository<ActiveSession> = {
    load,
    save: () => Promise.resolve({ ok: true, value: undefined }),
    clear: () => Promise.resolve({ ok: true, value: undefined }),
  };
  return {
    sessionRepository,
    settingsRepository,
    diagnostics,
    clock: new FakeClock(100),
    seedSource: new FakeSeedSource(123),
    game: secretSignalsDefinition,
  };
}

describe('bootstrapApp', () => {
  it.each(['storage-unavailable', 'migration-failed'] as const)(
    'returns recovery actions for %s without creating a session',
    async (type) => {
      const result = await bootstrapApp(
        dependencies(() => Promise.resolve({
          ok: false,
          error: { type, code: 'BOOT_FAILED', safeState: 'preserved' },
        })),
      );

      expect(result).toEqual({
        status: 'recovery',
        error: { type, code: 'BOOT_FAILED', safeState: 'preserved' },
        actions: ['retry', 'export-diagnostics', 'reset-data'],
        primaryAction: 'retry',
      });
      expect(result).not.toHaveProperty('session');
    },
  );

  it('loads settings and covers a private reveal before publishing it', async () => {
    const readySession: ActiveSession = {
      schemaVersion: 1,
      contentVersion: 1,
      id: 'session-1',
      players: [
        { id: 'p1', name: 'Ada' },
        { id: 'p2', name: 'Luca' },
      ],
      setup: { duration: 'standard', resources: ['phone'], contentCategories: ['general'] },
      scores: { p1: 0, p2: 0 },
      random: { seed: 2, position: 2 },
      createdAt: 10,
      updatedAt: 20,
      phase: 'privateRevealReady',
      gameId: 'secret-signals',
      gameState: {
        phase: 'assigning',
        currentIndex: 0,
        assignments: [
          { playerId: 'p1', signalKey: 'signal.touch-left-ear' },
          { playerId: 'p2', signalKey: 'signal.touch-nose' },
        ],
      },
    };

    const result = await bootstrapApp(
      dependencies(() => Promise.resolve({ ok: true, value: readySession })),
    );

    expect(result).toMatchObject({
      status: 'ready',
      settings: { locale: 'it' } satisfies LocalSettings,
      session: { phase: 'privateRevealCovered' },
    });
    if (result.status !== 'ready') throw new Error('Expected ready bootstrap');
    expect(result.service.getSnapshot()?.phase).toBe('privateRevealCovered');
  });
});
