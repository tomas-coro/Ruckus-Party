import type { Translator } from '../../content/translations/translator';
import type { Player } from '../../domain/player/player';
import type { PartySetup } from '../../domain/selection/partySetup';
import { Button } from '../../ui/components/Button';
import { durationLabel, resourceLabel } from './setupLabels';
import styles from './ReviewScreen.module.css';

export interface ReviewScreenProps {
  readonly translator: Translator;
  readonly players: readonly Player[];
  readonly setup: PartySetup;
  readonly onConfirm: () => void;
  readonly onBack: () => void;
}

export function ReviewScreen({ translator, players, setup, onConfirm, onBack }: ReviewScreenProps) {
  return (
    <section className={styles.screen} aria-labelledby="review-title">
      <header className={styles.header}>
        <Button variant="ghost" onClick={onBack}>{translator.translate('nav.back')}</Button>
        <h1 id="review-title">{translator.translate('setup.review.title')}</h1>
      </header>
      <div className={styles.summary}>
        <ol>{players.map((player) => <li key={player.id}>{player.name}</li>)}</ol>
        <dl>
          <div>
            <dt>{translator.translate('setup.preferences.duration')}</dt>
            <dd>{durationLabel(translator, setup.duration)}</dd>
          </div>
          <div>
            <dt>{translator.translate('setup.preferences.resources')}</dt>
            <dd>{translator.list(setup.resources.map((resource) => resourceLabel(translator, resource)))}</dd>
          </div>
        </dl>
      </div>
      <Button onClick={onConfirm}>{translator.translate('setup.review.confirm')}</Button>
    </section>
  );
}
