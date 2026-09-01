import { useMemo, useRef, useState } from 'react';

import type { Translator } from '../../content/translations/translator';
import type { Player } from '../../domain/player/player';
import { validatePlayers } from '../../domain/player/validatePlayers';
import { Button } from '../../ui/components/Button';
import styles from './PlayersScreen.module.css';

export interface PlayersScreenProps {
  readonly translator: Translator;
  readonly players: readonly Player[];
  readonly onSubmit: (players: readonly Player[]) => void;
  readonly onBack: () => void;
}

function initialPlayers(players: readonly Player[]): Player[] {
  if (players.length >= 2) return players.map((player) => ({ ...player }));
  return [
    { id: 'player-1', name: '' },
    { id: 'player-2', name: '' },
  ];
}

export function PlayersScreen({ translator, players, onSubmit, onBack }: PlayersScreenProps) {
  const [draft, setDraft] = useState<Player[]>(() => initialPlayers(players));
  const nextId = useRef(draft.length + 1);
  const validation = useMemo(() => validatePlayers(draft), [draft]);
  const nameError = !validation.ok && validation.error.code === 'PLAYER_NAME';
  const showNameError = nameError && draft.some((player) => player.name.length > 0);

  function updateName(id: string, name: string) {
    setDraft((current) => current.map((player) => player.id === id ? { ...player, name } : player));
  }

  function addPlayer() {
    if (draft.length >= 6) return;
    const id = `player-${String(nextId.current)}`;
    nextId.current += 1;
    setDraft((current) => [...current, { id, name: '' }]);
  }

  function removePlayer(id: string) {
    if (draft.length <= 2) return;
    setDraft((current) => current.filter((player) => player.id !== id));
  }

  return (
    <section className={styles.screen} aria-labelledby="players-title">
      <header className={styles.header}>
        <Button variant="ghost" onClick={onBack}>{translator.translate('nav.back')}</Button>
        <div>
          <h1 id="players-title">{translator.translate('setup.players.title')}</h1>
          <p>{translator.translate('setup.players.instructions')}</p>
        </div>
      </header>

      <div className={styles.list}>
        {draft.map((player, index) => (
          <div className={styles.player} key={player.id}>
            <label htmlFor={`player-${player.id}`}>
              {translator.translate('setup.players.nameLabel')} {translator.number(index + 1)}
            </label>
            <div className={styles.row}>
              <input
                id={`player-${player.id}`}
                value={player.name}
                aria-describedby="players-error"
                aria-invalid={nameError}
                autoComplete="off"
                onChange={(event) => { updateName(player.id, event.target.value); }}
              />
              <Button
                variant="ghost"
                disabled={draft.length <= 2}
                aria-label={translator.translate('setup.players.remove')}
                onClick={() => { removePlayer(player.id); }}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" width="22" height="22">
                  <path d="M5 12h14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <p id="players-error" className={styles.message} aria-live="polite">
        {showNameError ? translator.translate('setup.players.nameError') : '\u00a0'}
      </p>
      <div className={styles.actions}>
        <Button variant="secondary" disabled={draft.length >= 6} onClick={addPlayer}>
          {translator.translate('setup.players.add')}
        </Button>
        <Button
          disabled={!validation.ok}
          onClick={() => {
            if (validation.ok) {
              onSubmit(validation.value.map((player) => ({ ...player, name: player.name.trim() })));
            }
          }}
        >
          {translator.translate('setup.players.continue')}
        </Button>
      </div>
    </section>
  );
}
