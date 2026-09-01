import { useMemo, useState } from 'react';

import type { SettingsRepository, UpdatePort } from '../../application/ports';
import { createUpdateService } from '../../application/updates/updateService';
import type { Translator } from '../../content/translations/translator';
import type { Locale } from '../../domain/localization/translationKey';
import type { ActiveSession } from '../../domain/session/activeSession';
import { Button } from '../../ui/components/Button';
import { OfflineStatus } from '../../ui/components/OfflineStatus';
import { UpdatePrompt, type UpdateStatus } from '../../ui/components/UpdatePrompt';
import styles from './SettingsScreen.module.css';

export interface SettingsScreenProps {
  readonly translator: Translator;
  readonly locale: Locale;
  readonly session: ActiveSession | null;
  readonly settingsRepository: SettingsRepository;
  readonly updatePort: UpdatePort;
  readonly online: boolean;
  readonly offlineReady: boolean;
  readonly onLocaleChange: (locale: Locale) => void;
  readonly onBack: () => void;
}

export function SettingsScreen({
  translator,
  locale,
  session,
  settingsRepository,
  updatePort,
  online,
  offlineReady,
  onLocaleChange,
  onBack,
}: SettingsScreenProps) {
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>('idle');
  const [languageError, setLanguageError] = useState(false);
  const [savingLanguage, setSavingLanguage] = useState(false);
  const updateService = useMemo(() => createUpdateService(updatePort), [updatePort]);

  async function changeLocale(nextLocale: Locale) {
    if (nextLocale === locale || savingLanguage) return;
    setSavingLanguage(true);
    setLanguageError(false);
    const result = await settingsRepository.save({ locale: nextLocale });
    setSavingLanguage(false);
    if (!result.ok) {
      setLanguageError(true);
      return;
    }
    onLocaleChange(nextLocale);
  }

  async function checkForUpdates() {
    if (updateStatus === 'checking') return;
    setUpdateStatus('checking');
    const result = await updateService.check({ online });
    setUpdateStatus(result.ok
      ? result.value
      : result.error.type === 'update-offline' ? 'offline' : 'error');
  }

  async function activateUpdate() {
    const result = await updateService.activate({ hasActiveSession: false });
    if (!result.ok) setUpdateStatus('error');
  }

  async function deferUpdate() {
    const result = await updateService.activate({ hasActiveSession: session !== null });
    setUpdateStatus(result.ok ? 'deferred' : 'error');
  }

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <Button variant="ghost" onClick={onBack}>{translator.translate('nav.back')}</Button>
        <h1>{translator.translate('settings.title')}</h1>
      </header>

      <section className={styles.panel} aria-labelledby="language-title">
        <h2 id="language-title">{translator.translate('settings.language')}</h2>
        <div className={styles.languageChoices}>
          {(['it', 'en'] as const).map((choice) => (
            <Button
              key={choice}
              variant={choice === locale ? 'primary' : 'secondary'}
              aria-pressed={choice === locale}
              disabled={savingLanguage}
              onClick={() => { void changeLocale(choice); }}
            >
              {translator.translate(choice === 'it' ? 'settings.italian' : 'settings.english')}
            </Button>
          ))}
        </div>
        {languageError && (
          <p className={styles.error} role="alert">
            {translator.translate('error.writeFailed')} {translator.translate('error.statePreserved')}
          </p>
        )}
      </section>

      <section className={styles.panel} aria-labelledby="updates-title">
        <h2 id="updates-title">{translator.translate('settings.checkUpdates')}</h2>
        <OfflineStatus
          ready={offlineReady}
          readyLabel={translator.translate('home.offlineReady')}
          unavailableLabel={translator.translate('home.offlineUnavailable')}
        />
        <UpdatePrompt
          translator={translator}
          status={updateStatus}
          hasActiveSession={session !== null}
          onCheck={() => { void checkForUpdates(); }}
          onActivate={() => { void activateUpdate(); }}
          onDefer={() => { void deferUpdate(); }}
        />
      </section>
    </div>
  );
}
