import { useState } from 'react';

import type { Translator } from '../../content/translations/translator';
import type { ResourceId } from '../../domain/game/gameDefinition';
import type { PartyDuration, PartySetup } from '../../domain/selection/partySetup';
import { Button } from '../../ui/components/Button';
import { durationLabel, resourceLabel } from './setupLabels';
import styles from './PreferencesScreen.module.css';

const durations: readonly PartyDuration[] = ['short', 'standard', 'long', 'endless'];
const resources: readonly ResourceId[] = ['phone', 'french-deck', 'italian-deck', 'paper-and-pens'];

export interface PreferencesScreenProps {
  readonly translator: Translator;
  readonly setup: PartySetup;
  readonly onSubmit: (setup: PartySetup) => void;
  readonly onBack: () => void;
}

export function PreferencesScreen({ translator, setup, onSubmit, onBack }: PreferencesScreenProps) {
  const [duration, setDuration] = useState(setup.duration);
  const [selectedResources, setSelectedResources] = useState<readonly ResourceId[]>(setup.resources);

  function toggleResource(resource: ResourceId) {
    setSelectedResources((current) => current.includes(resource)
      ? current.filter((item) => item !== resource)
      : [...current, resource]);
  }

  return (
    <section className={styles.screen} aria-labelledby="preferences-title">
      <header className={styles.header}>
        <Button variant="ghost" onClick={onBack}>{translator.translate('nav.back')}</Button>
        <h1 id="preferences-title">{translator.translate('setup.preferences.title')}</h1>
      </header>

      <fieldset className={styles.panel}>
        <legend>{translator.translate('setup.preferences.duration')}</legend>
        <div className={styles.options}>
          {durations.map((option) => (
            <label key={option}>
              <input
                type="radio"
                name="duration"
                checked={duration === option}
                onChange={() => { setDuration(option); }}
              />
              <span>{durationLabel(translator, option)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.panel}>
        <legend>{translator.translate('setup.preferences.resources')}</legend>
        <div className={styles.resourceList}>
          {resources.map((resource) => (
            <label key={resource}>
              <input
                type="checkbox"
                checked={selectedResources.includes(resource)}
                onChange={() => { toggleResource(resource); }}
              />
              <span>{resourceLabel(translator, resource)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <Button
        disabled={selectedResources.length === 0}
        onClick={() => {
          onSubmit({ duration, resources: selectedResources, contentCategories: ['general'] });
        }}
      >
        {translator.translate('setup.preferences.continue')}
      </Button>
    </section>
  );
}
