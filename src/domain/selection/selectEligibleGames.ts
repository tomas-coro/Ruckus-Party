import type {
  ContentCategory,
  ResourceId,
  SelectableGameDefinition,
} from '../game/gameDefinition';
import type { PartySetup } from './partySetup';

export type GameRejection =
  | { readonly gameId: string; readonly requirement: 'player-count' }
  | { readonly gameId: string; readonly requirement: 'resource'; readonly value: ResourceId }
  | {
      readonly gameId: string;
      readonly requirement: 'content-category';
      readonly value: ContentCategory;
    };

export interface GameSelectionResult {
  readonly eligible: readonly SelectableGameDefinition[];
  readonly rejections: readonly GameRejection[];
}

export function selectEligibleGames(
  games: readonly SelectableGameDefinition[],
  playerCount: number,
  setup: PartySetup,
): GameSelectionResult {
  const resources = new Set(setup.resources);
  const categories = new Set(setup.contentCategories);
  const eligible: SelectableGameDefinition[] = [];
  const rejections: GameRejection[] = [];

  for (const game of games) {
    if (playerCount < game.minPlayers || playerCount > game.maxPlayers) {
      rejections.push({ gameId: game.id, requirement: 'player-count' });
      continue;
    }

    const missingResource = game.requiredResources.find((resource) => !resources.has(resource));
    if (missingResource !== undefined) {
      rejections.push({ gameId: game.id, requirement: 'resource', value: missingResource });
      continue;
    }

    const disabledCategory = game.contentCategories.find((category) => !categories.has(category));
    if (disabledCategory !== undefined) {
      rejections.push({
        gameId: game.id,
        requirement: 'content-category',
        value: disabledCategory,
      });
      continue;
    }

    eligible.push(game);
  }

  return { eligible, rejections };
}
