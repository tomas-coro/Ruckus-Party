import type { TranslationKey } from '../localization/translationKey';
import type { RandomSource } from '../random/randomSource';
import type { Result } from '../../application/result';

export type ResourceId = 'phone' | 'french-deck' | 'italian-deck' | 'paper-and-pens';
export type ContentCategory = 'general' | 'romantic' | 'alcohol' | 'bold';
export type GameSupport = 'physical' | 'virtual';

export interface SelectableGameDefinition {
  readonly id: string;
  readonly nameKey: TranslationKey;
  readonly descriptionKey: TranslationKey;
  readonly rulesKey: TranslationKey;
  readonly minPlayers: number;
  readonly maxPlayers: number;
  readonly requiredResources: readonly ResourceId[];
  readonly support: readonly GameSupport[];
  readonly contentCategories: readonly ContentCategory[];
  readonly resultType: 'single-winner';
  readonly supportsConsequences: boolean;
  readonly supportsHandicaps: boolean;
}

export interface GameDefinition<TState> extends SelectableGameDefinition {
  createState(playerIds: readonly string[], random: RandomSource): TState;
}

export interface GameRuntime<TState, TCommand> extends GameDefinition<TState> {
  reduceState(state: TState, command: TCommand): Result<TState>;
}
