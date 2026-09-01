import type { Result } from '../../../application/result';
import type { SecretSignalsState } from './secretSignals';

export type SecretSignalsCommand =
  | { readonly type: 'complete-reveal'; readonly playerId: string }
  | { readonly type: 'record-accusation'; readonly correctAccuserId: string }
  | { readonly type: 'correct-result'; readonly correctAccuserId: string }
  | { readonly type: 'confirm-result' };

function commandNotAllowed(phase: SecretSignalsState['phase']): Result<never> {
  return {
    ok: false,
    error: { type: 'invalid-transition', code: 'COMMAND_NOT_ALLOWED', phase },
  };
}

export function reduceSecretSignals(
  state: SecretSignalsState,
  command: SecretSignalsCommand,
): Result<SecretSignalsState> {
  switch (command.type) {
    case 'complete-reveal': {
      if (state.phase !== 'assigning') return commandNotAllowed(state.phase);
      const expected = state.assignments[state.currentIndex];
      if (expected?.playerId !== command.playerId) return commandNotAllowed(state.phase);

      const nextIndex = state.currentIndex + 1;
      if (nextIndex === state.assignments.length) {
        return {
          ok: true,
          value: { phase: 'shared-round', assignments: state.assignments },
        };
      }
      return { ok: true, value: { ...state, currentIndex: nextIndex } };
    }
    case 'record-accusation': {
      if (state.phase !== 'shared-round') return commandNotAllowed(state.phase);
      const isPlayer = state.assignments.some(
        ({ playerId }) => playerId === command.correctAccuserId,
      );
      if (!isPlayer) return commandNotAllowed(state.phase);
      return {
        ok: true,
        value: {
          phase: 'result-pending',
          winnerId: command.correctAccuserId,
          correctAccuserId: command.correctAccuserId,
        },
      };
    }
    case 'correct-result':
      if (state.phase !== 'result-pending') return commandNotAllowed(state.phase);
      return {
        ok: true,
        value: {
          phase: 'result-pending',
          winnerId: command.correctAccuserId,
          correctAccuserId: command.correctAccuserId,
        },
      };
    case 'confirm-result':
      if (state.phase !== 'result-pending') return commandNotAllowed(state.phase);
      return { ok: true, value: { phase: 'confirmed', winnerId: state.winnerId } };
  }
}
