import { describe, expect, it } from 'vitest';

import { secretSignalsDefinition } from '../../content/games/secretSignalsDefinition';
import type { Clock } from '../../application/ports';
import { createActiveSession, type ActiveSession } from './activeSession';
import { transitionSession, type SessionTransitionDependencies } from './transitionSession';

const players = [
  { id: 'p1', name: 'Ada' },
  { id: 'p2', name: 'Luca' },
] as const;

function createDeps(): SessionTransitionDependencies {
  let now = 100;
  const clock: Clock = { now: () => ++now };
  return {
    clock,
    game: secretSignalsDefinition,
  };
}

function advance<TPhase extends ActiveSession['phase']>(
  session: ActiveSession,
  command: Parameters<typeof transitionSession>[1],
  deps: SessionTransitionDependencies,
  phase: TPhase,
): Extract<ActiveSession, { phase: TPhase }> {
  const result = transitionSession(session, command, deps);
  expect(result).toMatchObject({ ok: true, value: { phase } });
  if (!result.ok) throw new Error(`Expected transition to ${phase}`);
  return result.value as Extract<ActiveSession, { phase: TPhase }>;
}

function sessionAtResultPending(): {
  session: Extract<ActiveSession, { phase: 'resultPendingConfirmation' }>;
  deps: SessionTransitionDependencies;
} {
  const deps = createDeps();
  let session: ActiveSession = createActiveSession({
    id: 'session-1',
    contentVersion: 1,
    random: { seed: 123, position: 0 },
    createdAt: 100,
  });
  session = advance(session, { type: 'set-players', players }, deps, 'setupPreferences');
  session = advance(
    session,
    {
      type: 'set-setup',
      setup: { duration: 'standard', resources: ['phone'], contentCategories: ['general'] },
    },
    deps,
    'setupReview',
  );
  session = advance(
    session,
    { type: 'confirm-setup', gameId: 'secret-signals' },
    deps,
    'proposal',
  );
  session = advance(session, { type: 'start-game' }, deps, 'privateRevealCovered');
  session = advance(
    session,
    { type: 'prepare-private-reveal', playerId: 'p1' },
    deps,
    'privateRevealReady',
  );
  session = advance(
    session,
    { type: 'complete-private-reveal', playerId: 'p1' },
    deps,
    'privateRevealCovered',
  );
  session = advance(
    session,
    { type: 'prepare-private-reveal', playerId: 'p2' },
    deps,
    'privateRevealReady',
  );
  session = advance(
    session,
    { type: 'complete-private-reveal', playerId: 'p2' },
    deps,
    'sharedRound',
  );
  session = advance(
    session,
    { type: 'record-accusation', correctAccuserId: 'p1' },
    deps,
    'resultPendingConfirmation',
  );
  return { session, deps };
}

describe('transitionSession', () => {
  it('runs the approved vertical slice through every persisted phase', () => {
    const { session } = sessionAtResultPending();

    expect(session.gameState).toMatchObject({
      phase: 'result-pending',
      winnerId: 'p1',
    });
  });

  it('does not award a point before result confirmation', () => {
    const { session, deps } = sessionAtResultPending();

    expect(session.scores.p1).toBe(0);
    const confirmed = transitionSession(session, { type: 'confirm-result' }, deps);

    expect(confirmed).toMatchObject({
      ok: true,
      value: { phase: 'standings', scores: { p1: 1, p2: 0 } },
    });
  });

  it('allows correction before confirmation and awards only the corrected winner', () => {
    const { session, deps } = sessionAtResultPending();
    const corrected = transitionSession(
      session,
      { type: 'correct-result', correctAccuserId: 'p2' },
      deps,
    );
    if (!corrected.ok) throw new Error('Expected result correction to succeed');

    const confirmed = transitionSession(corrected.value, { type: 'confirm-result' }, deps);

    expect(confirmed).toMatchObject({
      ok: true,
      value: { phase: 'standings', scores: { p1: 0, p2: 1 } },
    });
  });

  it('rejects commands outside their phase and prevents double scoring', () => {
    const { session, deps } = sessionAtResultPending();
    expect(transitionSession(session, { type: 'start-game' }, deps)).toMatchObject({
      ok: false,
      error: { type: 'invalid-transition', code: 'COMMAND_NOT_ALLOWED' },
    });
    const confirmed = transitionSession(session, { type: 'confirm-result' }, deps);
    if (!confirmed.ok) throw new Error('Expected confirmation to succeed');

    expect(transitionSession(confirmed.value, { type: 'confirm-result' }, deps)).toMatchObject({
      ok: false,
      error: { type: 'invalid-transition' },
    });
  });

  it('supports setup back navigation and requires confirmation for unsaved exit', () => {
    const deps = createDeps();
    const initial = createActiveSession({
      id: 'session-2',
      contentVersion: 1,
      random: { seed: 4, position: 0 },
      createdAt: 100,
    });
    const preferences = advance(
      initial,
      { type: 'set-players', players },
      deps,
      'setupPreferences',
    );

    expect(transitionSession(preferences, { type: 'back' }, deps)).toMatchObject({
      ok: true,
      value: { phase: 'setupPlayers' },
    });
    expect(
      transitionSession(preferences, { type: 'request-exit', hasUnsavedChanges: true }, deps),
    ).toEqual({
      ok: false,
      error: { type: 'confirmation-required', code: 'DISCARD_UNSAVED_SETUP' },
    });

    const review = advance(
      preferences,
      {
        type: 'set-setup',
        setup: { duration: 'standard', resources: ['phone'], contentCategories: ['general'] },
      },
      deps,
      'setupReview',
    );
    const proposal = advance(
      review,
      { type: 'confirm-setup', gameId: 'secret-signals' },
      deps,
      'proposal',
    );
    expect(transitionSession(proposal, { type: 'back' }, deps)).toMatchObject({
      ok: true,
      value: { phase: 'setupPreferences' },
    });
  });
});
