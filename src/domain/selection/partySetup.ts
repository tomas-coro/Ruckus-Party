import type { Result } from '../../application/result';
import type { ContentCategory, ResourceId } from '../game/gameDefinition';

export type PartyDuration = 'short' | 'standard' | 'long' | 'endless';

export interface PartySetup {
  readonly duration: PartyDuration;
  readonly resources: readonly ResourceId[];
  readonly contentCategories: readonly ContentCategory[];
}

export function createDefaultSetup(): PartySetup {
  return {
    duration: 'standard',
    resources: ['phone'],
    contentCategories: ['general'],
  };
}

export function validatePartySetup(setup: PartySetup): Result<PartySetup> {
  if (setup.resources.length === 0) {
    return {
      ok: false,
      error: { type: 'invalid-input', code: 'SETUP_RESOURCE', field: 'resources' },
    };
  }

  return { ok: true, value: setup };
}
