import type { SelectableGameDefinition } from './gameDefinition';

export class GameRegistry {
  readonly #games: ReadonlyMap<string, SelectableGameDefinition>;

  constructor(games: readonly SelectableGameDefinition[]) {
    this.#games = new Map(games.map((game) => [game.id, game]));
  }

  list(): readonly SelectableGameDefinition[] {
    return [...this.#games.values()];
  }

  find(id: string): SelectableGameDefinition | undefined {
    return this.#games.get(id);
  }
}
