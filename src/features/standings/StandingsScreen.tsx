import type { Translator } from '../../content/translations/translator';
import type { Player } from '../../domain/player/player';
import type { Standing } from '../../domain/scoring/standings';
import styles from './StandingsScreen.module.css';

export interface StandingsScreenProps {
  readonly translator: Translator;
  readonly players: readonly Player[];
  readonly standings: readonly Standing[];
}

function pointsLabel(translator: Translator, score: number): string {
  const key = translator.pluralCategory(score) === 'one'
    ? 'standings.points.one'
    : 'standings.points.other';
  return translator.translate(key).replace('{count}', translator.number(score));
}

export function StandingsScreen({ translator, players, standings }: StandingsScreenProps) {
  const rows = standings.map((standing) => ({
    ...standing,
    player: players.find((candidate) => candidate.id === standing.playerId),
  }));
  if (rows.some(({ player }) => player === undefined)) {
    return <section role="alert">{translator.translate('error.missingContent')}</section>;
  }

  return (
    <section className={styles.screen} aria-labelledby="standings-title">
      <h1 id="standings-title">{translator.translate('standings.title')}</h1>
      <ol className={styles.list}>
        {rows.map(({ playerId, player, rank, score }) => (
          <li key={playerId}>
            <span className={styles.rank}>{translator.number(rank)}</span>
            <strong>{player?.name}</strong>
            <span>{pointsLabel(translator, score)}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
