import { useState } from 'react';

import type { Translator } from '../../content/translations/translator';
import type { Player } from '../../domain/player/player';
import { Button } from '../../ui/components/Button';
import styles from './ResultConfirmationScreen.module.css';

export interface ResultConfirmationScreenProps {
  readonly translator: Translator;
  readonly players: readonly Player[];
  readonly winnerId: string;
  readonly scores: Readonly<Record<string, number>>;
  readonly onCorrect: (playerId: string) => void;
  readonly onConfirm: () => void;
}

function pointsLabel(translator: Translator, score: number): string {
  const key = translator.pluralCategory(score) === 'one'
    ? 'standings.points.one'
    : 'standings.points.other';
  return translator.translate(key).replace('{count}', translator.number(score));
}

export function ResultConfirmationScreen({
  translator,
  players,
  winnerId,
  scores,
  onCorrect,
  onConfirm,
}: ResultConfirmationScreenProps) {
  const [correcting, setCorrecting] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState(winnerId);
  const winner = players.find((player) => player.id === winnerId);

  if (winner === undefined) {
    return <section role="alert">{translator.translate('error.missingContent')}</section>;
  }

  return (
    <section className={styles.screen} aria-labelledby="winner-name">
      <div className={styles.resultCard}>
        <p>{translator.translate('result.title')}</p>
        <h1 id="winner-name">{winner.name}</h1>
        <strong>{pointsLabel(translator, scores[winnerId] ?? 0)}</strong>
      </div>

      {correcting && (
        <fieldset className={styles.correction}>
          <legend>{translator.translate('result.correct')}</legend>
          {players.map((player) => (
            <label key={player.id}>
              <input
                type="radio"
                name="correct-winner"
                checked={selectedPlayerId === player.id}
                onChange={() => { setSelectedPlayerId(player.id); }}
              />
              <span>{player.name}</span>
            </label>
          ))}
          <Button
            variant="secondary"
            onClick={() => {
              onCorrect(selectedPlayerId);
              setCorrecting(false);
            }}
          >
            {translator.translate('result.saveCorrection')}
          </Button>
        </fieldset>
      )}

      <div className={styles.actions}>
        <Button variant="secondary" onClick={() => { setCorrecting(true); }}>
          {translator.translate('result.correct')}
        </Button>
        <Button onClick={onConfirm}>{translator.translate('result.confirm')}</Button>
      </div>
    </section>
  );
}
