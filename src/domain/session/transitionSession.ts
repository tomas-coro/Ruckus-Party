import type { Clock } from '../../application/ports';
import type { Result } from '../../application/result';
import type { GameRuntime } from '../game/gameDefinition';
import type { SecretSignalsState } from '../game/secret-signals/secretSignals';
import type { SecretSignalsCommand } from '../game/secret-signals/secretSignalsReducer';
import { validatePlayers } from '../player/validatePlayers';
import { createSeededRandom } from '../random/seededRandom';
import { rankStandings } from '../scoring/standings';
import { validatePartySetup } from '../selection/partySetup';
import type { ActiveSession, SessionCommon } from './activeSession';
import type { SessionCommand } from './sessionCommand';

export interface SessionTransitionDependencies {
  readonly clock: Clock;
  readonly game: GameRuntime<SecretSignalsState, SecretSignalsCommand>;
}

function common(session: ActiveSession, updatedAt: number): SessionCommon {
  return {
    schemaVersion: session.schemaVersion,
    contentVersion: session.contentVersion,
    id: session.id,
    players: session.players,
    setup: session.setup,
    scores: session.scores,
    random: session.random,
    createdAt: session.createdAt,
    updatedAt,
  };
}

function commandNotAllowed(session: ActiveSession): Result<never> {
  return {
    ok: false,
    error: {
      type: 'invalid-transition',
      code: 'COMMAND_NOT_ALLOWED',
      phase: session.phase,
    },
  };
}

function isPlayer(session: ActiveSession, playerId: string): boolean {
  return session.players.some((player) => player.id === playerId);
}

function assertNever(value: never): never {
  throw new Error(`Unhandled session command: ${JSON.stringify(value)}`);
}

export function transitionSession(
  session: ActiveSession,
  command: SessionCommand,
  dependencies: SessionTransitionDependencies,
): Result<ActiveSession> {
  switch (command.type) {
    case 'set-players': {
      if (session.phase !== 'setupPlayers') return commandNotAllowed(session);
      const validation = validatePlayers(command.players);
      if (!validation.ok) return validation;
      const scores = Object.fromEntries(command.players.map(({ id }) => [id, 0]));
      return {
        ok: true,
        value: {
          ...common(session, dependencies.clock.now()),
          players: command.players,
          scores,
          phase: 'setupPreferences',
        },
      };
    }
    case 'set-setup': {
      if (session.phase !== 'setupPreferences') return commandNotAllowed(session);
      const validation = validatePartySetup(command.setup);
      if (!validation.ok) return validation;
      return {
        ok: true,
        value: {
          ...common(session, dependencies.clock.now()),
          setup: command.setup,
          phase: 'setupReview',
        },
      };
    }
    case 'confirm-setup':
      if (session.phase !== 'setupReview') return commandNotAllowed(session);
      if (command.gameId !== dependencies.game.id) {
        return {
          ok: false,
          error: { type: 'missing-content', code: 'GAME_NOT_FOUND', key: command.gameId },
        };
      }
      return {
        ok: true,
        value: {
          ...common(session, dependencies.clock.now()),
          phase: 'proposal',
          gameId: command.gameId,
        },
      };
    case 'start-game': {
      if (session.phase !== 'proposal' || session.gameId !== dependencies.game.id) {
        return commandNotAllowed(session);
      }
      const random = createSeededRandom(session.random);
      const gameState = dependencies.game.createState(
        session.players.map(({ id }) => id),
        random,
      );
      if (gameState.phase !== 'assigning') return commandNotAllowed(session);
      return {
        ok: true,
        value: {
          ...common(session, dependencies.clock.now()),
          random: random.state(),
          phase: 'privateRevealCovered',
          gameId: session.gameId,
          gameState,
        },
      };
    }
    case 'prepare-private-reveal': {
      if (session.phase !== 'privateRevealCovered') return commandNotAllowed(session);
      const expected = session.gameState.assignments[session.gameState.currentIndex];
      if (expected?.playerId !== command.playerId) return commandNotAllowed(session);
      return {
        ok: true,
        value: {
          ...common(session, dependencies.clock.now()),
          phase: 'privateRevealReady',
          gameId: session.gameId,
          gameState: session.gameState,
        },
      };
    }
    case 'complete-private-reveal': {
      if (session.phase !== 'privateRevealReady') return commandNotAllowed(session);
      const reduced = dependencies.game.reduceState(session.gameState, {
        type: 'complete-reveal',
        playerId: command.playerId,
      });
      if (!reduced.ok) return reduced;
      if (reduced.value.phase === 'assigning') {
        return {
          ok: true,
          value: {
            ...common(session, dependencies.clock.now()),
            phase: 'privateRevealCovered',
            gameId: session.gameId,
            gameState: reduced.value,
          },
        };
      }
      if (reduced.value.phase === 'shared-round') {
        return {
          ok: true,
          value: {
            ...common(session, dependencies.clock.now()),
            phase: 'sharedRound',
            gameId: session.gameId,
            gameState: reduced.value,
          },
        };
      }
      return commandNotAllowed(session);
    }
    case 'record-accusation': {
      if (session.phase !== 'sharedRound' || !isPlayer(session, command.correctAccuserId)) {
        return commandNotAllowed(session);
      }
      const reduced = dependencies.game.reduceState(session.gameState, command);
      if (!reduced.ok) return reduced;
      if (reduced.value.phase !== 'result-pending') return commandNotAllowed(session);
      return {
        ok: true,
        value: {
          ...common(session, dependencies.clock.now()),
          phase: 'resultPendingConfirmation',
          gameId: session.gameId,
          gameState: reduced.value,
        },
      };
    }
    case 'correct-result': {
      if (
        session.phase !== 'resultPendingConfirmation'
        || !isPlayer(session, command.correctAccuserId)
      ) {
        return commandNotAllowed(session);
      }
      const reduced = dependencies.game.reduceState(session.gameState, command);
      if (!reduced.ok) return reduced;
      if (reduced.value.phase !== 'result-pending') return commandNotAllowed(session);
      return {
        ok: true,
        value: {
          ...common(session, dependencies.clock.now()),
          phase: 'resultPendingConfirmation',
          gameId: session.gameId,
          gameState: reduced.value,
        },
      };
    }
    case 'confirm-result': {
      if (session.phase !== 'resultPendingConfirmation') return commandNotAllowed(session);
      const reduced = dependencies.game.reduceState(session.gameState, command);
      if (!reduced.ok) return reduced;
      if (reduced.value.phase !== 'confirmed') return commandNotAllowed(session);
      const scores = {
        ...session.scores,
        [reduced.value.winnerId]: (session.scores[reduced.value.winnerId] ?? 0) + 1,
      };
      return {
        ok: true,
        value: {
          ...common(session, dependencies.clock.now()),
          scores,
          phase: 'standings',
          gameId: session.gameId,
          gameState: reduced.value,
          standings: rankStandings(scores),
        },
      };
    }
    case 'back':
      if (session.phase === 'setupPreferences') {
        return {
          ok: true,
          value: { ...common(session, dependencies.clock.now()), phase: 'setupPlayers' },
        };
      }
      if (session.phase === 'setupReview') {
        return {
          ok: true,
          value: { ...common(session, dependencies.clock.now()), phase: 'setupPreferences' },
        };
      }
      if (session.phase === 'proposal') {
        return {
          ok: true,
          value: { ...common(session, dependencies.clock.now()), phase: 'setupPreferences' },
        };
      }
      return commandNotAllowed(session);
    case 'request-exit':
      if (command.hasUnsavedChanges) {
        return {
          ok: false,
          error: { type: 'confirmation-required', code: 'DISCARD_UNSAVED_SETUP' },
        };
      }
      return { ok: true, value: session };
    default:
      return assertNever(command);
  }
}
