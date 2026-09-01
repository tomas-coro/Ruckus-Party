import { useState } from 'react';

import type { Translator } from '../../content/translations/translator';
import { Button } from '../../ui/components/Button';
import styles from './CoveredRevealScreen.module.css';

export interface CoveredRevealScreenProps {
  readonly translator: Translator;
  readonly playerName: string;
  readonly onConfirmPlayer: () => void;
  readonly onWrongPlayer: () => void;
}

export function CoveredRevealScreen({
  translator,
  playerName,
  onConfirmPlayer,
  onWrongPlayer,
}: CoveredRevealScreenProps) {
  const [wrongPlayer, setWrongPlayer] = useState(false);

  return (
    <section className={styles.screen} aria-labelledby="covered-title">
      <div className={styles.cover}>
        <div className={styles.shield} aria-hidden="true">
          <svg viewBox="0 0 64 64">
            <path d="M32 6 53 14v15c0 14-8 24-21 30C19 53 11 43 11 29V14Z" fill="#f7c64b" stroke="#132824" strokeWidth="4" />
            <path d="M22 32h20M32 22v20" stroke="#132824" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
        <h1 id="covered-title">{translator.translate('secretSignals.coveredTitle')}</h1>
        <p>{translator.translate('secretSignals.passPhone')}: <strong>{playerName}</strong></p>
        {wrongPlayer && (
          <p className={styles.notice} role="status">
            {translator.translate('secretSignals.passPhone')}: {playerName}
          </p>
        )}
        <div className={styles.actions}>
          <Button onClick={onConfirmPlayer}>
            {translator.translate('secretSignals.iAm')} {playerName}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setWrongPlayer(true);
              onWrongPlayer();
            }}
          >
            {translator.translate('secretSignals.wrongPlayer')}
          </Button>
        </div>
      </div>
    </section>
  );
}
