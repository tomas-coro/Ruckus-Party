import type { Translator } from '../../content/translations/translator';
import type { ResourceId } from '../../domain/game/gameDefinition';
import type { PartyDuration } from '../../domain/selection/partySetup';

const durationKeys = {
  short: 'setup.preferences.short',
  standard: 'setup.preferences.standard',
  long: 'setup.preferences.long',
  endless: 'setup.preferences.endless',
} as const;

const resourceKeys = {
  phone: 'setup.preferences.phoneOnly',
  'french-deck': 'setup.preferences.frenchDeck',
  'italian-deck': 'setup.preferences.italianDeck',
  'paper-and-pens': 'setup.preferences.paperAndPens',
} as const;

export function durationLabel(translator: Translator, duration: PartyDuration): string {
  return translator.translate(durationKeys[duration]);
}

export function resourceLabel(translator: Translator, resource: ResourceId): string {
  return translator.translate(resourceKeys[resource]);
}
