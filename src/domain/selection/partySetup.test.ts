import { describe, expect, it } from 'vitest';

import { secretSignalsDefinition } from '../../content/games/secretSignalsDefinition';
import { createDefaultSetup, validatePartySetup } from './partySetup';
import { selectEligibleGames } from './selectEligibleGames';

describe('Party Night setup', () => {
  it('creates the approved defaults', () => {
    expect(createDefaultSetup()).toEqual({
      duration: 'standard',
      resources: ['phone'],
      contentCategories: ['general'],
    });
  });

  it('rejects a setup without available resources', () => {
    expect(
      validatePartySetup({
        duration: 'standard',
        resources: [],
        contentCategories: ['general'],
      }),
    ).toMatchObject({
      ok: false,
      error: { type: 'invalid-input', code: 'SETUP_RESOURCE' },
    });
  });
});

describe('selectEligibleGames', () => {
  it.each([2, 6])('includes Secret Signals for %i players with a phone', (playerCount) => {
    const setup = createDefaultSetup();

    expect(selectEligibleGames([secretSignalsDefinition], playerCount, setup)).toEqual({
      eligible: [secretSignalsDefinition],
      rejections: [],
    });
  });

  it.each([1, 7])('excludes Secret Signals for %i players', (playerCount) => {
    const result = selectEligibleGames(
      [secretSignalsDefinition],
      playerCount,
      createDefaultSetup(),
    );

    expect(result.eligible).toEqual([]);
    expect(result.rejections).toEqual([
      { gameId: 'secret-signals', requirement: 'player-count' },
    ]);
  });

  it('reports a missing resource without mutating the setup filters', () => {
    const setup = {
      ...createDefaultSetup(),
      resources: ['french-deck'] as const,
    };
    const original = structuredClone(setup);

    const result = selectEligibleGames([secretSignalsDefinition], 2, setup);

    expect(result).toEqual({
      eligible: [],
      rejections: [{ gameId: 'secret-signals', requirement: 'resource', value: 'phone' }],
    });
    expect(setup).toEqual(original);
  });
});
