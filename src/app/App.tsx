import { useEffect, useState } from 'react';

import type { Result } from '../application/result';
import { createTranslator } from '../content/translations/translator';
import type { AppError } from '../domain/errors';
import type { Locale } from '../domain/localization/translationKey';
import { RecoveryScreen } from '../features/recovery/RecoveryScreen';
import { resetAllData } from '../infrastructure/persistence/indexedDbRepository';
import { usePwaLifecycle } from '../infrastructure/pwa/usePwaLifecycle';
import type { BootstrapState, ReadyBootstrapState } from './bootstrap';
import { AppErrorBoundary } from './AppErrorBoundary';
import { AppServicesProvider, useAppServices } from './providers/AppServicesContext';
import { PartyNightProvider, usePartyNight } from './providers/PartyNightContext';
import { parseHash } from './routing/hashRouter';
import type { Route } from './routing/route';
import { RouteView } from './routing/RouteView';

export interface RecoveryActions {
  readonly retry: () => void;
  readonly exportDiagnostics: (error: AppError) => Promise<void>;
  readonly resetAllData: () => Promise<Result<void>>;
}

const browserRecoveryActions: RecoveryActions = {
  retry: () => { window.location.reload(); },
  exportDiagnostics: (error) => {
    const blob = new Blob([
      JSON.stringify({ code: error.code, type: error.type }, null, 2),
    ], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'ruckus-party-diagnostics.json';
    anchor.click();
    URL.revokeObjectURL(url);
    return Promise.resolve();
  },
  resetAllData,
};

function ReadyApp({ recoveryActions }: { readonly recoveryActions: RecoveryActions }) {
  const { settings, settingsRepository, updatePort, offlineReady } = useAppServices();
  const partyNight = usePartyNight();
  const [locale, setLocale] = useState<Locale>(settings.locale);
  const [localeError, setLocaleError] = useState(false);
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  const [operationFailure, setOperationFailure] = useState<{
    readonly error: AppError;
    readonly retry: () => Promise<Result<unknown>>;
  } | null>(null);
  const translator = createTranslator(locale);

  async function execute(action: () => Promise<Result<unknown>>) {
    const result = await action();
    if (result.ok) {
      setOperationFailure(null);
    } else {
      setOperationFailure({ error: result.error, retry: action });
    }
  }

  async function persistLocale(nextLocale: Locale) {
    setLocaleError(false);
    const result = await settingsRepository.save({ locale: nextLocale });
    if (!result.ok) {
      setLocaleError(true);
      return;
    }
    setLocale(nextLocale);
  }

  useEffect(() => {
    const updateRoute = () => {
      setRoute(parseHash(window.location.hash));
    };
    window.addEventListener('hashchange', updateRoute);
    return () => {
      window.removeEventListener('hashchange', updateRoute);
    };
  }, []);

  if (operationFailure !== null) {
    return (
      <RecoveryScreen
        translator={translator}
        error={operationFailure.error}
        onRetry={() => { void execute(operationFailure.retry); }}
        onExportDiagnostics={() => recoveryActions.exportDiagnostics(operationFailure.error)}
        onResetAllData={recoveryActions.resetAllData}
      />
    );
  }

  return (
    <RouteView
      route={route}
      session={partyNight.session}
      translator={translator}
      locale={locale}
      onStartParty={() => {
        void execute(() => partyNight.startFreeNight());
      }}
      onLocaleChange={setLocale}
      onHomeLocaleChange={(nextLocale) => { void persistLocale(nextLocale); }}
      localeError={localeError}
      settingsRepository={settingsRepository}
      updatePort={updatePort}
      online={navigator.onLine}
      offlineReady={offlineReady}
      onSessionCommand={(command) => { void execute(() => partyNight.dispatch(command)); }}
      onCancelParty={() => { void execute(() => partyNight.cancelPartyNight()); }}
    />
  );
}

function ReadyRoot({
  bootstrapState,
  recoveryActions,
}: {
  readonly bootstrapState: ReadyBootstrapState;
  readonly recoveryActions: RecoveryActions;
}) {
  const { updatePort, offlineReady } = usePwaLifecycle();

  return (
    <AppServicesProvider
      services={bootstrapState}
      updatePort={updatePort}
      offlineReady={offlineReady}
    >
      <AppErrorBoundary
        fallback={(
          <RecoveryScreen
            translator={createTranslator(bootstrapState.settings.locale)}
            error={{ type: 'unexpected-ui-error', code: 'UNEXPECTED_UI_ERROR' }}
            onRetry={recoveryActions.retry}
            onExportDiagnostics={() => recoveryActions.exportDiagnostics({
              type: 'unexpected-ui-error',
              code: 'UNEXPECTED_UI_ERROR',
            })}
            onResetAllData={recoveryActions.resetAllData}
          />
        )}
        onUnexpected={(code) => {
          void bootstrapState.diagnostics.record({
            code,
            occurredAt: bootstrapState.clock.now(),
            context: { status: 'unexpected-ui-error' },
          }).catch(() => {
            console.error('Could not record unexpected UI diagnostics.');
          });
        }}
      >
        <PartyNightProvider>
          <ReadyApp recoveryActions={recoveryActions} />
        </PartyNightProvider>
      </AppErrorBoundary>
    </AppServicesProvider>
  );
}

export interface AppProps {
  readonly bootstrapState?: BootstrapState;
  readonly recoveryActions?: RecoveryActions;
}

export function App({ bootstrapState, recoveryActions = browserRecoveryActions }: AppProps) {
  if (bootstrapState?.status === 'recovery') {
    const translator = createTranslator('it');
    return (
      <main aria-label="Ruckus Party">
        <RecoveryScreen
          translator={translator}
          error={bootstrapState.error}
          onRetry={recoveryActions.retry}
          onExportDiagnostics={() => recoveryActions.exportDiagnostics(bootstrapState.error)}
          onResetAllData={recoveryActions.resetAllData}
        />
      </main>
    );
  }

  if (bootstrapState?.status !== 'ready') {
    return <main aria-label="Ruckus Party" />;
  }

  return (
    <main aria-label="Ruckus Party">
      <ReadyRoot bootstrapState={bootstrapState} recoveryActions={recoveryActions} />
    </main>
  );
}
