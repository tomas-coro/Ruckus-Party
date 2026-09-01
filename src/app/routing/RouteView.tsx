import type { ActiveSession } from '../../domain/session/activeSession';
import type { SessionCommand } from '../../domain/session/sessionCommand';
import type { SettingsRepository, UpdatePort } from '../../application/ports';
import { secretSignalsDefinition } from '../../content/games/secretSignalsDefinition';
import type { Translator } from '../../content/translations/translator';
import type { Locale } from '../../domain/localization/translationKey';
import { HomeScreen } from '../../features/home/HomeScreen';
import { SettingsScreen } from '../../features/settings/SettingsScreen';
import { GameRegistry } from '../../domain/game/gameRegistry';
import { PlayersScreen } from '../../features/party-setup/PlayersScreen';
import { PreferencesScreen } from '../../features/party-setup/PreferencesScreen';
import { ReviewScreen } from '../../features/party-setup/ReviewScreen';
import { ProposalScreen } from '../../features/proposal/ProposalScreen';
import { CoveredRevealScreen } from '../../features/secret-signals/CoveredRevealScreen';
import { ReadyRevealScreen } from '../../features/secret-signals/ReadyRevealScreen';
import { SharedRoundScreen } from '../../features/secret-signals/SharedRoundScreen';
import { ResultConfirmationScreen } from '../../features/result/ResultConfirmationScreen';
import { StandingsScreen } from '../../features/standings/StandingsScreen';
import { navigate } from './hashRouter';
import type { Route } from './route';

const registry = new GameRegistry([secretSignalsDefinition]);

export interface RouteViewProps {
  readonly route: Route;
  readonly session: ActiveSession | null;
  readonly translator: Translator;
  readonly locale: Locale;
  readonly onStartParty: () => void;
  readonly onLocaleChange: (locale: Locale) => void;
  readonly onHomeLocaleChange: (locale: Locale) => void;
  readonly localeError: boolean;
  readonly settingsRepository: SettingsRepository;
  readonly updatePort: UpdatePort;
  readonly online: boolean;
  readonly offlineReady: boolean;
  readonly onSessionCommand: (command: SessionCommand) => void;
  readonly onCancelParty: () => void;
}

export function RouteView({
  route,
  session,
  translator,
  locale,
  onStartParty,
  onLocaleChange,
  onHomeLocaleChange,
  localeError,
  settingsRepository,
  updatePort,
  online,
  offlineReady,
  onSessionCommand,
  onCancelParty,
}: RouteViewProps) {
  if (route.type === 'settings') {
    return (
      <SettingsScreen
        translator={translator}
        locale={locale}
        session={session}
        settingsRepository={settingsRepository}
        updatePort={updatePort}
        online={online}
        offlineReady={offlineReady}
        onLocaleChange={onLocaleChange}
        onBack={() => { navigate({ type: 'home' }); }}
      />
    );
  }

  if (session !== null) {
    switch (session.phase) {
      case 'setupPlayers':
        return (
          <PlayersScreen
            translator={translator}
            players={session.players}
            onSubmit={(players) => { onSessionCommand({ type: 'set-players', players }); }}
            onBack={onCancelParty}
          />
        );
      case 'setupPreferences':
        return (
          <PreferencesScreen
            translator={translator}
            setup={session.setup}
            onSubmit={(setup) => { onSessionCommand({ type: 'set-setup', setup }); }}
            onBack={() => { onSessionCommand({ type: 'back' }); }}
          />
        );
      case 'setupReview':
        return (
          <ReviewScreen
            translator={translator}
            players={session.players}
            setup={session.setup}
            onConfirm={() => {
              onSessionCommand({ type: 'confirm-setup', gameId: secretSignalsDefinition.id });
            }}
            onBack={() => { onSessionCommand({ type: 'back' }); }}
          />
        );
      case 'proposal':
        return (
          <ProposalScreen
            translator={translator}
            registry={registry}
            playerCount={session.players.length}
            setup={session.setup}
            onStart={() => { onSessionCommand({ type: 'start-game' }); }}
            onModifySetup={() => { onSessionCommand({ type: 'back' }); }}
          />
        );
      case 'privateRevealCovered':
      case 'privateRevealReady': {
        const assignment = session.gameState.assignments[session.gameState.currentIndex];
        const player = session.players.find((candidate) => candidate.id === assignment?.playerId);
        if (assignment === undefined || player === undefined) {
          return <section role="alert">{translator.translate('error.missingContent')}</section>;
        }
        if (session.phase === 'privateRevealCovered') {
          return (
            <CoveredRevealScreen
              translator={translator}
              playerName={player.name}
              onConfirmPlayer={() => {
                onSessionCommand({ type: 'prepare-private-reveal', playerId: player.id });
              }}
              onWrongPlayer={() => undefined}
            />
          );
        }
        return (
          <ReadyRevealScreen
            key={player.id}
            translator={translator}
            playerId={player.id}
            playerName={player.name}
            secret={translator.translate(assignment.signalKey)}
            onMemorized={() => {
              onSessionCommand({ type: 'complete-private-reveal', playerId: player.id });
            }}
          />
        );
      }
      case 'sharedRound':
        return (
          <SharedRoundScreen
            translator={translator}
            players={session.players}
            onConfirmAccusation={(playerId) => {
              onSessionCommand({ type: 'record-accusation', correctAccuserId: playerId });
            }}
          />
        );
      case 'resultPendingConfirmation':
        return (
          <ResultConfirmationScreen
            translator={translator}
            players={session.players}
            winnerId={session.gameState.winnerId}
            scores={session.scores}
            onCorrect={(playerId) => {
              onSessionCommand({ type: 'correct-result', correctAccuserId: playerId });
            }}
            onConfirm={() => { onSessionCommand({ type: 'confirm-result' }); }}
          />
        );
      case 'standings':
        return (
          <StandingsScreen
            translator={translator}
            players={session.players}
            standings={session.standings}
          />
        );
    }
  }

  switch (route.type) {
    case 'home':
      return (
        <HomeScreen
          translator={translator}
          locale={locale}
          hasActiveSession={false}
          offlineReady={offlineReady}
          localeError={localeError}
          onStart={onStartParty}
          onResume={onStartParty}
          onLocaleChange={onHomeLocaleChange}
          onSettings={() => {
            navigate({ type: 'settings' });
          }}
        />
      );
    case 'unknown':
      return (
        <section role="alert">
          <p>Route not found.</p>
          <button type="button" onClick={() => {
            navigate({ type: 'home' });
          }}>Home</button>
        </section>
      );
  }
}
