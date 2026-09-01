import type { Translator } from '../../content/translations/translator';
import type { Locale } from '../../domain/localization/translationKey';
import { Button } from '../../ui/components/Button';
import { AppShell } from '../../ui/layout/AppShell';
import styles from './HomeScreen.module.css';

export interface HomeScreenProps {
  readonly translator: Translator;
  readonly locale: Locale;
  readonly hasActiveSession: boolean;
  readonly offlineReady: boolean;
  readonly localeError: boolean;
  readonly onStart: () => void;
  readonly onResume: () => void;
  readonly onLocaleChange: (locale: Locale) => void;
  readonly onSettings: () => void;
}

function PassTheRLogo() {
  return (
    <h1 className={styles.logo} aria-label="Ruckus Party">
      <svg className={styles.signal} viewBox="0 0 390 150" aria-hidden="true">
        <path className={styles.carrier} d="M8 31h132l54 44-54 44H8l51-44Z" fill="#6fd2b8" />
        <path className={styles.challenger} d="M382 31H250l-54 44 54 44h132l-51-44Z" fill="#ff643b" />
        <g className={styles.tile}>
          <rect x="151" y="31" width="88" height="88" rx="12" fill="#f7c64b" stroke="#132824" strokeWidth="6" />
          <text x="195" y="98" textAnchor="middle" fill="#132824" fontFamily="Archivo Black, sans-serif" fontSize="64">R</text>
        </g>
        <g className={styles.impact} fill="none" stroke="#fff0d1" strokeWidth="5">
          <path d="M195 13V4M195 146v-9M130 75h-12M272 75h-12" />
          <path d="m146 27-9-10m116 115-9-10m0-95 9-10M137 132l9-10" />
        </g>
      </svg>
      <span className={styles.wordmark} aria-hidden="true">
        <strong className={styles.wordmarkStrong}>Ruckus</strong>
        <b className={styles.party}>Party</b>
      </span>
    </h1>
  );
}

export function HomeScreen({
  translator,
  locale,
  hasActiveSession,
  offlineReady,
  localeError,
  onStart,
  onResume,
  onLocaleChange,
  onSettings,
}: HomeScreenProps) {
  const action = hasActiveSession ? onResume : onStart;
  const actionTitle = translator.translate(
    hasActiveSession ? 'home.resumeParty' : 'home.startParty',
  );
  const actionDescription = translator.translate(
    hasActiveSession ? 'home.resumeDescription' : 'home.startDescription',
  );

  return (
    <AppShell
      locale={locale}
      settingsLabel={translator.translate('nav.settings')}
      onLocaleChange={onLocaleChange}
      onSettings={onSettings}
    >
      <section className={styles.screen} aria-label={translator.translate('nav.home')}>
        <div className={styles.brandStage}>
          <PassTheRLogo />
          <p className={styles.promise}>{translator.translate('home.promise')}</p>
        </div>
        <div className={styles.actionZone}>
          <Button
            className={styles.primaryAction}
            onClick={action}
            aria-label={actionTitle}
            data-testid="dominant-action"
          >
            <span className={styles.actionTitle}>{actionTitle}</span>
            <span className={styles.actionDescription}>{actionDescription}</span>
          </Button>
          <p className={styles.offline} aria-live="polite">
            {translator.translate(
              offlineReady ? 'home.offlineReady' : 'home.offlineUnavailable',
            )}
          </p>
          {localeError && (
            <p className={styles.localeError} role="alert">
              {translator.translate('error.writeFailed')} {translator.translate('error.statePreserved')}
            </p>
          )}
        </div>
      </section>
    </AppShell>
  );
}
