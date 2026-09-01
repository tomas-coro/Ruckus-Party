import { useEffect, useState } from 'react';

import type { Translator } from '../../content/translations/translator';
import { Button } from '../../ui/components/Button';
import styles from './ReadyRevealScreen.module.css';

interface RevealState {
  readonly playerId: string;
  readonly visible: boolean;
  readonly hasRevealed: boolean;
}

export interface ReadyRevealScreenProps {
  readonly translator: Translator;
  readonly playerId: string;
  readonly playerName: string;
  readonly secret: string;
  readonly onMemorized: () => void;
}

export function ReadyRevealScreen({
  translator,
  playerId,
  playerName,
  secret,
  onMemorized,
}: ReadyRevealScreenProps) {
  const [state, setState] = useState<RevealState>({
    playerId,
    visible: false,
    hasRevealed: false,
  });
  const isCurrentPlayer = state.playerId === playerId;
  const visible = isCurrentPlayer && state.visible;
  const hasRevealed = isCurrentPlayer && state.hasRevealed;

  function reveal() {
    setState({ playerId, visible: true, hasRevealed: true });
  }

  function hide() {
    setState((current) => ({
      playerId,
      visible: false,
      hasRevealed: current.playerId === playerId && current.hasRevealed,
    }));
  }

  useEffect(() => {
    const hideOnBlur = () => { hide(); };
    const hideWhenDocumentIsHidden = () => {
      if (document.visibilityState === 'hidden') hide();
    };
    window.addEventListener('blur', hideOnBlur);
    document.addEventListener('visibilitychange', hideWhenDocumentIsHidden);
    return () => {
      window.removeEventListener('blur', hideOnBlur);
      document.removeEventListener('visibilitychange', hideWhenDocumentIsHidden);
    };
  });

  return (
    <section className={styles.screen} aria-labelledby="ready-player">
      <p id="ready-player" className={styles.player}>{playerName}</p>
      <div className={styles.secretStage} aria-live="polite">
        {visible ? (
          <p className={styles.secret}>{secret}</p>
        ) : (
          <p className={styles.hidden}>{translator.translate('secretSignals.secretHidden')}</p>
        )}
      </div>
      <Button
        className={styles.hold}
        data-testid="hold-reveal"
        onPointerDown={reveal}
        onPointerUp={hide}
        onPointerCancel={hide}
        onPointerLeave={hide}
      >
        {translator.translate('secretSignals.holdToReveal')}
      </Button>
      <Button
        variant="secondary"
        aria-pressed={visible}
        onClick={() => {
          if (visible) hide();
          else reveal();
        }}
      >
        {translator.translate('secretSignals.tapToReveal')}
      </Button>
      <Button
        disabled={!hasRevealed}
        onClick={() => {
          setState({ playerId, visible: false, hasRevealed: true });
          onMemorized();
        }}
      >
        {translator.translate('secretSignals.memorized')}
      </Button>
    </section>
  );
}
