import type { Translator } from '../../content/translations/translator';
import { Button } from './Button';
import styles from './UpdatePrompt.module.css';

export type UpdateStatus =
  | 'idle'
  | 'checking'
  | 'current'
  | 'ready'
  | 'offline'
  | 'error'
  | 'deferred';

export interface UpdatePromptProps {
  readonly translator: Translator;
  readonly status: UpdateStatus;
  readonly hasActiveSession: boolean;
  readonly onCheck: () => void;
  readonly onActivate: () => void;
  readonly onDefer: () => void;
}

function statusKey(status: Exclude<UpdateStatus, 'idle' | 'ready' | 'error'>) {
  const keys = {
    checking: 'settings.updateChecking',
    current: 'settings.updateCurrent',
    offline: 'settings.updateOffline',
    deferred: 'settings.updateDeferred',
  } as const;
  return keys[status];
}

export function UpdatePrompt({
  translator,
  status,
  hasActiveSession,
  onCheck,
  onActivate,
  onDefer,
}: UpdatePromptProps) {
  if (status === 'error') {
    return (
      <div className={styles.feedback} role="alert">
        <p>{translator.translate('settings.updateError')}</p>
        <Button variant="secondary" onClick={onCheck}>
          {translator.translate('action.retry')}
        </Button>
      </div>
    );
  }

  if (status === 'ready') {
    return (
      <div className={styles.feedback} role="status">
        <p>{translator.translate('settings.updateReady')}</p>
        <Button onClick={hasActiveSession ? onDefer : onActivate}>
          {translator.translate(
            hasActiveSession ? 'settings.installAfterParty' : 'settings.installRestart',
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.feedback}>
      {status !== 'idle' && (
        <p role="status" aria-live="polite">{translator.translate(statusKey(status))}</p>
      )}
      <Button
        variant="secondary"
        onClick={onCheck}
        disabled={status === 'checking'}
      >
        {translator.translate('settings.checkUpdates')}
      </Button>
    </div>
  );
}
