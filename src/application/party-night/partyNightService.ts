import type {
  Clock,
  DiagnosticsPort,
  SeedSource,
  SessionRepository,
} from '../ports';
import type { Result } from '../result';
import type { GameRuntime } from '../../domain/game/gameDefinition';
import type { SecretSignalsState } from '../../domain/game/secret-signals/secretSignals';
import type { SecretSignalsCommand } from '../../domain/game/secret-signals/secretSignalsReducer';
import { createActiveSession, type ActiveSession } from '../../domain/session/activeSession';
import type { SessionCommand } from '../../domain/session/sessionCommand';
import { transitionSession } from '../../domain/session/transitionSession';

export interface PartyNightServiceDependencies {
  readonly repository: SessionRepository<ActiveSession>;
  readonly clock: Clock;
  readonly seedSource: SeedSource;
  readonly diagnostics: DiagnosticsPort;
  readonly game: GameRuntime<SecretSignalsState, SecretSignalsCommand>;
  readonly onTransition?: () => void;
  readonly initialSession?: ActiveSession | null;
}

export interface PartyNightService {
  startFreeNight(): Promise<Result<ActiveSession>>;
  cancelPartyNight(): Promise<Result<void>>;
  dispatch(command: SessionCommand): Promise<Result<ActiveSession>>;
  subscribe(subscriber: () => void): () => void;
  getSnapshot(): ActiveSession | null;
}

export function createPartyNightService(
  dependencies: PartyNightServiceDependencies,
): PartyNightService {
  let snapshot: ActiveSession | null = dependencies.initialSession ?? null;
  const subscribers = new Set<() => void>();

  async function persistAndPublish(candidate: ActiveSession): Promise<Result<ActiveSession>> {
    dependencies.onTransition?.();
    const saved = await dependencies.repository.save(candidate);
    if (!saved.ok) {
      await dependencies.diagnostics.record({
        code: saved.error.code,
        occurredAt: dependencies.clock.now(),
        context: { phase: candidate.phase },
      });
      return saved;
    }

    snapshot = candidate;
    subscribers.forEach((subscriber) => {
      subscriber();
    });
    return { ok: true, value: candidate };
  }

  return {
    async startFreeNight(): Promise<Result<ActiveSession>> {
      const createdAt = dependencies.clock.now();
      const seed = dependencies.seedSource.createSeed();
      const candidate = createActiveSession({
        id: `party-${String(createdAt)}-${String(seed)}`,
        contentVersion: 1,
        random: { seed, position: 0 },
        createdAt,
      });
      return persistAndPublish(candidate);
    },

    async cancelPartyNight(): Promise<Result<void>> {
      const cleared = await dependencies.repository.clear();
      if (!cleared.ok) {
        await dependencies.diagnostics.record({
          code: cleared.error.code,
          occurredAt: dependencies.clock.now(),
          context: { phase: snapshot?.phase ?? 'no-active-session' },
        });
        return cleared;
      }
      snapshot = null;
      subscribers.forEach((subscriber) => {
        subscriber();
      });
      return { ok: true, value: undefined };
    },

    async dispatch(command: SessionCommand): Promise<Result<ActiveSession>> {
      if (snapshot === null) {
        return {
          ok: false,
          error: {
            type: 'invalid-transition',
            code: 'COMMAND_NOT_ALLOWED',
            phase: 'no-active-session',
          },
        };
      }

      const transitioned = transitionSession(snapshot, command, {
        clock: dependencies.clock,
        game: dependencies.game,
      });
      if (!transitioned.ok) return transitioned;
      return persistAndPublish(transitioned.value);
    },

    subscribe(subscriber: () => void): () => void {
      subscribers.add(subscriber);
      return () => subscribers.delete(subscriber);
    },

    getSnapshot(): ActiveSession | null {
      return snapshot;
    },
  };
}
