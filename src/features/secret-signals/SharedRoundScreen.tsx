import { useState } from 'react';

import type { Translator } from '../../content/translations/translator';
import type { Player } from '../../domain/player/player';
import { Button } from '../../ui/components/Button';
import styles from './SharedRoundScreen.module.css';

export interface SharedRoundScreenProps {
  readonly translator: Translator;
  readonly players: readonly Player[];
  readonly onConfirmAccusation: (playerId: string) => void;
}

export function SharedRoundScreen({
  translator,
  players,
  onConfirmAccusation,
}: SharedRoundScreenProps) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  return (
    <section className={styles.screen} aria-labelledby="shared-title">
      <div className={styles.mark} aria-hidden="true">R</div>
      <h1 id="shared-title">{translator.translate('secretSignals.sharedReady')}</h1>
      <p>{translator.translate('secretSignals.chooseAccuser')}</p>
      <fieldset className={styles.players}>
        <legend>{translator.translate('secretSignals.accusationTitle')}</legend>
        {players.map((player) => (
          <label key={player.id}>
            <input
              type="radio"
              name="correct-accuser"
              checked={selectedPlayerId === player.id}
              onChange={() => { setSelectedPlayerId(player.id); }}
            />
            <span>{player.name}</span>
          </label>
        ))}
      </fieldset>
      <Button
        disabled={selectedPlayerId === null}
        onClick={() => {
          if (selectedPlayerId !== null) onConfirmAccusation(selectedPlayerId);
        }}
      >
        {translator.translate('secretSignals.confirmAccusation')}
      </Button>
    </section>
  );
}
