import type { SecretSignalKey } from '../../../content/games/secretSignalsContent';
import type { RandomSource } from '../../random/randomSource';

export interface SecretAssignment {
  readonly playerId: string;
  readonly signalKey: SecretSignalKey;
}

export type SecretSignalsState =
  | {
      readonly phase: 'assigning';
      readonly assignments: readonly SecretAssignment[];
      readonly currentIndex: number;
    }
  | { readonly phase: 'shared-round'; readonly assignments: readonly SecretAssignment[] }
  | { readonly phase: 'result-pending'; readonly winnerId: string; readonly correctAccuserId: string }
  | { readonly phase: 'confirmed'; readonly winnerId: string };

export function createSecretSignalsState(
  playerIds: readonly string[],
  random: RandomSource,
  content: readonly SecretSignalKey[],
): Extract<SecretSignalsState, { phase: 'assigning' }> {
  if (playerIds.length === 0) {
    throw new RangeError('Secret Signals requires at least one player.');
  }
  if (content.length < playerIds.length) {
    throw new RangeError('Secret Signals requires one signal per player.');
  }

  const availableSignals = [...content];
  const assignments = playerIds.map((playerId) => {
    const signalIndex = random.nextInt(availableSignals.length);
    const [signalKey] = availableSignals.splice(signalIndex, 1);
    if (signalKey === undefined) {
      throw new RangeError('Secret Signals content was exhausted.');
    }
    return { playerId, signalKey };
  });

  return { phase: 'assigning', assignments, currentIndex: 0 };
}
