import type { GameRuntime } from '../../domain/game/gameDefinition';
import {
  createSecretSignalsState,
  type SecretSignalsState,
} from '../../domain/game/secret-signals/secretSignals';
import {
  reduceSecretSignals,
  type SecretSignalsCommand,
} from '../../domain/game/secret-signals/secretSignalsReducer';
import { secretSignalsContent } from './secretSignalsContent';

export const secretSignalsDefinition = {
  id: 'secret-signals',
  nameKey: 'secretSignals.name',
  descriptionKey: 'secretSignals.description',
  rulesKey: 'secretSignals.rules',
  minPlayers: 2,
  maxPlayers: 6,
  requiredResources: ['phone'],
  support: ['virtual'],
  contentCategories: ['general'],
  resultType: 'single-winner',
  supportsConsequences: true,
  supportsHandicaps: true,
  createState(playerIds, random): SecretSignalsState {
    return createSecretSignalsState(playerIds, random, secretSignalsContent);
  },
  reduceState: reduceSecretSignals,
} as const satisfies GameRuntime<SecretSignalsState, SecretSignalsCommand>;
