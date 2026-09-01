import type { SecretSignalsState } from '../game/secret-signals/secretSignals';
import type { Player } from '../player/player';
import type { RandomState } from '../random/randomSource';
import type { Standing } from '../scoring/standings';
import { createDefaultSetup, type PartySetup } from '../selection/partySetup';

export interface SessionCommon {
  readonly schemaVersion: 1;
  readonly contentVersion: number;
  readonly id: string;
  readonly players: readonly Player[];
  readonly setup: PartySetup;
  readonly scores: Readonly<Record<string, number>>;
  readonly random: RandomState;
  readonly createdAt: number;
  readonly updatedAt: number;
}

export type ActiveSession = SessionCommon & (
  | { readonly phase: 'setupPlayers' }
  | { readonly phase: 'setupPreferences' }
  | { readonly phase: 'setupReview' }
  | { readonly phase: 'proposal'; readonly gameId: string }
  | {
      readonly phase: 'privateRevealCovered' | 'privateRevealReady';
      readonly gameId: string;
      readonly gameState: Extract<SecretSignalsState, { phase: 'assigning' }>;
    }
  | {
      readonly phase: 'sharedRound';
      readonly gameId: string;
      readonly gameState: Extract<SecretSignalsState, { phase: 'shared-round' }>;
    }
  | {
      readonly phase: 'resultPendingConfirmation';
      readonly gameId: string;
      readonly gameState: Extract<SecretSignalsState, { phase: 'result-pending' }>;
    }
  | {
      readonly phase: 'standings';
      readonly gameId: string;
      readonly gameState: Extract<SecretSignalsState, { phase: 'confirmed' }>;
      readonly standings: readonly Standing[];
    }
);

export interface CreateActiveSessionInput {
  readonly id: string;
  readonly contentVersion: number;
  readonly random: RandomState;
  readonly createdAt: number;
}

export function createActiveSession(input: CreateActiveSessionInput): ActiveSession {
  return {
    schemaVersion: 1,
    contentVersion: input.contentVersion,
    id: input.id,
    players: [],
    setup: createDefaultSetup(),
    scores: {},
    random: input.random,
    createdAt: input.createdAt,
    updatedAt: input.createdAt,
    phase: 'setupPlayers',
  };
}
