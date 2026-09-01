import { describe, expect, it } from 'vitest';

import { validatePlayers } from './validatePlayers';

describe('validatePlayers', () => {
  it.each([0, 1, 7])('rejects %i players', (count) => {
    const players = Array.from({ length: count }, (_, index) => ({
      id: `p${String(index)}`,
      name: `P${String(index)}`,
    }));

    expect(validatePlayers(players)).toMatchObject({
      ok: false,
      error: { type: 'invalid-input', code: 'PLAYERS_COUNT' },
    });
  });

  it.each([2, 6])('accepts %i players', (count) => {
    const players = Array.from({ length: count }, (_, index) => ({
      id: `p${String(index)}`,
      name: `Player ${String(index + 1)}`,
    }));

    expect(validatePlayers(players)).toEqual({ ok: true, value: players });
  });

  it('rejects empty names after trimming whitespace', () => {
    expect(
      validatePlayers([
        { id: 'p1', name: 'Ada' },
        { id: 'p2', name: '   ' },
      ]),
    ).toMatchObject({
      ok: false,
      error: { type: 'invalid-input', code: 'PLAYER_NAME', field: 'p2' },
    });
  });

  it('rejects duplicate names after case and whitespace normalization', () => {
    expect(
      validatePlayers([
        { id: 'p1', name: ' Ada ' },
        { id: 'p2', name: 'ada' },
      ]),
    ).toMatchObject({
      ok: false,
      error: { type: 'invalid-input', code: 'PLAYER_NAME', field: 'p2' },
    });
  });
});
