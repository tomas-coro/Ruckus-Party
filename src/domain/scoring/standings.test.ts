import { describe, expect, it } from 'vitest';

import { rankStandings } from './standings';

describe('rankStandings', () => {
  it('sorts by score and preserves shared ranks for ties', () => {
    expect(rankStandings({ p1: 2, p2: 1, p3: 2 })).toEqual([
      { playerId: 'p1', score: 2, rank: 1 },
      { playerId: 'p3', score: 2, rank: 1 },
      { playerId: 'p2', score: 1, rank: 3 },
    ]);
  });

  it('does not mutate the score record', () => {
    const scores = { p1: 0, p2: 1 };
    const snapshot = structuredClone(scores);

    rankStandings(scores);

    expect(scores).toEqual(snapshot);
  });
});
