import type { Result } from '../../application/result';
import type { Player } from './player';

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 6;

function normalizeName(name: string): string {
  return name.trim().toLocaleLowerCase();
}

export function validatePlayers(players: readonly Player[]): Result<readonly Player[]> {
  if (players.length < MIN_PLAYERS || players.length > MAX_PLAYERS) {
    return {
      ok: false,
      error: { type: 'invalid-input', code: 'PLAYERS_COUNT' },
    };
  }

  const names = new Set<string>();
  for (const player of players) {
    const normalizedName = normalizeName(player.name);
    if (normalizedName.length === 0 || names.has(normalizedName)) {
      return {
        ok: false,
        error: {
          type: 'invalid-input',
          code: 'PLAYER_NAME',
          field: player.id,
        },
      };
    }
    names.add(normalizedName);
  }

  return { ok: true, value: players };
}
