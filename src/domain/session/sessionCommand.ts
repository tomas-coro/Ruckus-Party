import type { Player } from '../player/player';
import type { PartySetup } from '../selection/partySetup';

export type SessionCommand =
  | { readonly type: 'set-players'; readonly players: readonly Player[] }
  | { readonly type: 'set-setup'; readonly setup: PartySetup }
  | { readonly type: 'confirm-setup'; readonly gameId: string }
  | { readonly type: 'start-game' }
  | { readonly type: 'prepare-private-reveal'; readonly playerId: string }
  | { readonly type: 'complete-private-reveal'; readonly playerId: string }
  | { readonly type: 'record-accusation'; readonly correctAccuserId: string }
  | { readonly type: 'correct-result'; readonly correctAccuserId: string }
  | { readonly type: 'confirm-result' }
  | { readonly type: 'back' }
  | { readonly type: 'request-exit'; readonly hasUnsavedChanges: boolean };
