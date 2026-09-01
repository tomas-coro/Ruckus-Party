import { describe, expect, it } from 'vitest';

import { createSeededRandom } from '../../random/seededRandom';
import { secretSignalsContent } from '../../../content/games/secretSignalsContent';
import { createSecretSignalsState, type SecretSignalsState } from './secretSignals';
import { reduceSecretSignals } from './secretSignalsReducer';

const playerIds = ['p1', 'p2', 'p3'] as const;

describe('Secret Signals', () => {
  it('creates deterministic content-key assignments for every player', () => {
    const first = createSecretSignalsState(
      playerIds,
      createSeededRandom({ seed: 123, position: 0 }),
      secretSignalsContent,
    );
    const replay = createSecretSignalsState(
      playerIds,
      createSeededRandom({ seed: 123, position: 0 }),
      secretSignalsContent,
    );

    expect(first).toEqual(replay);
    expect(first.assignments.map(({ playerId }) => playerId)).toEqual(playerIds);
    expect(first.assignments.every(({ signalKey }) => signalKey.startsWith('signal.'))).toBe(true);
  });

  it('advances reveal only for the expected player and then enters the shared round', () => {
    let state: SecretSignalsState = createSecretSignalsState(
      playerIds,
      createSeededRandom({ seed: 9, position: 0 }),
      secretSignalsContent,
    );

    const wrongPlayer = reduceSecretSignals(state, { type: 'complete-reveal', playerId: 'p2' });
    expect(wrongPlayer).toMatchObject({
      ok: false,
      error: { type: 'invalid-transition', code: 'COMMAND_NOT_ALLOWED' },
    });

    for (const playerId of playerIds) {
      const next = reduceSecretSignals(state, { type: 'complete-reveal', playerId });
      expect(next.ok).toBe(true);
      if (!next.ok) throw new Error('Expected reveal transition to succeed');
      state = next.value;
    }

    expect(state).toMatchObject({ phase: 'shared-round' });
  });

  it('records, corrects and confirms the first correct accuser', () => {
    const assigning = createSecretSignalsState(
      ['p1', 'p2'],
      createSeededRandom({ seed: 7, position: 0 }),
      secretSignalsContent,
    );
    const firstReveal = reduceSecretSignals(assigning, {
      type: 'complete-reveal',
      playerId: 'p1',
    });
    if (!firstReveal.ok) throw new Error('Expected first reveal to succeed');
    const secondReveal = reduceSecretSignals(firstReveal.value, {
      type: 'complete-reveal',
      playerId: 'p2',
    });
    if (!secondReveal.ok) throw new Error('Expected second reveal to succeed');

    const accused = reduceSecretSignals(secondReveal.value, {
      type: 'record-accusation',
      correctAccuserId: 'p1',
    });
    expect(accused).toMatchObject({
      ok: true,
      value: { phase: 'result-pending', winnerId: 'p1', correctAccuserId: 'p1' },
    });
    if (!accused.ok) throw new Error('Expected accusation to succeed');

    const corrected = reduceSecretSignals(accused.value, {
      type: 'correct-result',
      correctAccuserId: 'p2',
    });
    expect(corrected).toMatchObject({
      ok: true,
      value: { phase: 'result-pending', winnerId: 'p2', correctAccuserId: 'p2' },
    });
    if (!corrected.ok) throw new Error('Expected correction to succeed');

    const confirmed = reduceSecretSignals(corrected.value, { type: 'confirm-result' });
    expect(confirmed).toEqual({ ok: true, value: { phase: 'confirmed', winnerId: 'p2' } });
    if (!confirmed.ok) throw new Error('Expected confirmation to succeed');

    expect(
      reduceSecretSignals(confirmed.value, {
        type: 'correct-result',
        correctAccuserId: 'p1',
      }),
    ).toMatchObject({ ok: false, error: { type: 'invalid-transition' } });
  });
});
