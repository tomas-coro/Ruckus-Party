import { createPartyNightService, type PartyNightService } from '../application/party-night/partyNightService';
import { resumeActiveSession } from '../application/party-night/resumeActiveSession';
import type {
  Clock,
  DiagnosticsPort,
  LocalSettings,
  SeedSource,
  SessionRepository,
  SettingsRepository,
} from '../application/ports';
import type { AppError } from '../domain/errors';
import type { GameRuntime } from '../domain/game/gameDefinition';
import type { SecretSignalsState } from '../domain/game/secret-signals/secretSignals';
import type { SecretSignalsCommand } from '../domain/game/secret-signals/secretSignalsReducer';
import type { ActiveSession } from '../domain/session/activeSession';
import { secretSignalsDefinition } from '../content/games/secretSignalsDefinition';
import { LocalDiagnostics } from '../infrastructure/diagnostics/localDiagnostics';
import {
  IndexedDbSessionRepository,
  IndexedDbSettingsRepository,
} from '../infrastructure/persistence/indexedDbRepository';
import { openRuckusDatabase } from '../infrastructure/persistence/schema';
import { CryptoSeedSource } from '../infrastructure/random/cryptoSeedSource';

export interface BootstrapDependencies {
  readonly sessionRepository: SessionRepository<ActiveSession>;
  readonly settingsRepository: SettingsRepository;
  readonly diagnostics: DiagnosticsPort;
  readonly clock: Clock;
  readonly seedSource: SeedSource;
  readonly game: GameRuntime<SecretSignalsState, SecretSignalsCommand>;
}

export interface ReadyBootstrapState {
  readonly status: 'ready';
  readonly session: ActiveSession | null;
  readonly settings: LocalSettings;
  readonly service: PartyNightService;
  readonly diagnostics: DiagnosticsPort;
  readonly settingsRepository: SettingsRepository;
  readonly clock: Clock;
}

export interface RecoveryBootstrapState {
  readonly status: 'recovery';
  readonly error: AppError;
  readonly actions: readonly ['retry', 'export-diagnostics', 'reset-data'];
  readonly primaryAction: 'retry';
}

export type BootstrapState = ReadyBootstrapState | RecoveryBootstrapState;

async function createBrowserDependencies(): Promise<BootstrapDependencies> {
  const testFault = import.meta.env.MODE === 'test' ? window.__RUCKUS_TEST_FAULT__ : undefined;
  if (testFault === 'migration-failure') {
    throw new DOMException('Injected migration failure', 'VersionError');
  }
  const database = await openRuckusDatabase();
  const databasePromise = Promise.resolve(database);
  const sessionRepository = new IndexedDbSessionRepository(databasePromise);
  const settingsRepository = new IndexedDbSettingsRepository(databasePromise);
  const storageError = {
    type: 'storage-unavailable',
    code: 'INJECTED_STORAGE_UNAVAILABLE',
    safeState: 'preserved',
  } as const;
  const writeError = {
    type: 'write-failed',
    code: 'INJECTED_WRITE_FAILURE',
    safeState: 'preserved',
  } as const;
  return {
    sessionRepository: testFault === 'storage-unavailable' ? {
      load: () => Promise.resolve({ ok: false, error: storageError }),
      save: (session) => sessionRepository.save(session),
      clear: () => sessionRepository.clear(),
    } : testFault === 'write-failure' ? {
      load: () => sessionRepository.load(),
      save: () => Promise.resolve({ ok: false, error: writeError }),
      clear: () => sessionRepository.clear(),
    } : sessionRepository,
    settingsRepository,
    diagnostics: new LocalDiagnostics(databasePromise, '0.0.0'),
    clock: { now: () => Date.now() },
    seedSource: new CryptoSeedSource(),
    game: secretSignalsDefinition,
  };
}

declare global {
  interface Window {
    __RUCKUS_TEST_FAULT__?: 'write-failure' | 'migration-failure' | 'storage-unavailable';
  }
}

function recovery(error: AppError): RecoveryBootstrapState {
  return {
    status: 'recovery',
    error,
    actions: ['retry', 'export-diagnostics', 'reset-data'],
    primaryAction: 'retry',
  };
}

export async function bootstrapApp(
  providedDependencies?: BootstrapDependencies,
): Promise<BootstrapState> {
  let dependencies: BootstrapDependencies;
  try {
    dependencies = providedDependencies ?? await createBrowserDependencies();
  } catch (error: unknown) {
    return recovery({
      type: 'migration-failed',
      code: error instanceof DOMException ? error.name : 'DATABASE_OPEN_FAILED',
      safeState: 'preserved',
    });
  }

  const loadedSession = await dependencies.sessionRepository.load();
  if (!loadedSession.ok) return recovery(loadedSession.error);

  const loadedSettings = await dependencies.settingsRepository.load();
  if (!loadedSettings.ok) return recovery(loadedSettings.error);

  const session = resumeActiveSession(loadedSession.value);
  const service = createPartyNightService({
    repository: dependencies.sessionRepository,
    clock: dependencies.clock,
    seedSource: dependencies.seedSource,
    diagnostics: dependencies.diagnostics,
    game: dependencies.game,
    initialSession: session,
  });

  return {
    status: 'ready',
    session,
    settings: loadedSettings.value,
    service,
    diagnostics: dependencies.diagnostics,
    settingsRepository: dependencies.settingsRepository,
    clock: dependencies.clock,
  };
}
