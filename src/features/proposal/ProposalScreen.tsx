import type { Translator } from '../../content/translations/translator';
import type { GameRegistry } from '../../domain/game/gameRegistry';
import { selectEligibleGames } from '../../domain/selection/selectEligibleGames';
import type { PartySetup } from '../../domain/selection/partySetup';
import { Button } from '../../ui/components/Button';
import { resourceLabel } from '../party-setup/setupLabels';
import styles from './ProposalScreen.module.css';

export interface ProposalScreenProps {
  readonly translator: Translator;
  readonly registry: GameRegistry;
  readonly playerCount: number;
  readonly setup: PartySetup;
  readonly onStart: (gameId: string) => void;
  readonly onModifySetup: () => void;
}

export function ProposalScreen({
  translator,
  registry,
  playerCount,
  setup,
  onStart,
  onModifySetup,
}: ProposalScreenProps) {
  const selection = selectEligibleGames(registry.list(), playerCount, setup);
  const game = selection.eligible[0];

  if (game === undefined) {
    const missingResource = selection.rejections.find(
      (rejection) => rejection.requirement === 'resource',
    );
    return (
      <section className={styles.screen} aria-labelledby="no-match-title">
        <div className={styles.noMatch}>
          <h1 id="no-match-title">{translator.translate('proposal.noMatchTitle')}</h1>
          {missingResource?.requirement === 'resource' && (
            <p>
              {translator.translate('proposal.missingResource')} {' '}
              <strong>{resourceLabel(translator, missingResource.value)}</strong>
            </p>
          )}
          <Button onClick={onModifySetup}>{translator.translate('proposal.noMatchAction')}</Button>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.screen} aria-labelledby="proposal-game-title">
      <Button className={styles.back} variant="ghost" onClick={onModifySetup}>
        {translator.translate('nav.back')}
      </Button>
      <div className={styles.card}>
        <h1 id="proposal-game-title">{translator.translate(game.nameKey)}</h1>
        <p className={styles.description}>{translator.translate(game.descriptionKey)}</p>
        <ul className={styles.facts}>
          <li>{game.minPlayers}-{game.maxPlayers} {translator.translate('proposal.players')}</li>
          {game.requiredResources.map((resource) => (
            <li key={resource}>{resourceLabel(translator, resource)}</li>
          ))}
          <li>{translator.translate('proposal.virtual')}</li>
        </ul>
        <p className={styles.status}>{translator.translate('proposal.compatible')}</p>
        <p className={styles.reason}>{translator.translate('proposal.reason')}</p>
        <Button onClick={() => { onStart(game.id); }}>{translator.translate('proposal.start')}</Button>
      </div>
    </section>
  );
}
