import { describe, expect, it } from 'vitest';

import type { ActiveSession } from '../../domain/session/activeSession';
import { resumeActiveSession } from './resumeActiveSession';

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
  random: { seed: 5, position: 2 },
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

describe('resumeActiveSession', () => {
  it('covers a private reveal that was ready when the app stopped', () => {
    expect(resumeActiveSession(readySession)).toEqual({
      ...readySession,
      phase: 'privateRevealCovered',
    });
  });

  it('preserves every other phase and null', () => {
    const covered = { ...readySession, phase: 'privateRevealCovered' } as const;

    expect(resumeActiveSession(covered)).toBe(covered);
    expect(resumeActiveSession(null)).toBeNull();
  });
});
