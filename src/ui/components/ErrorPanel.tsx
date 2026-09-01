import type { Translator } from '../../content/translations/translator';
import type { AppError } from '../../domain/errors';
import { Button } from './Button';
import styles from './ErrorPanel.module.css';

export interface ErrorPanelProps {
  readonly translator: Translator;
  readonly error: AppError;
  readonly onRetry: () => void;
}

function errorKey(error: AppError) {
  switch (error.type) {
    case 'storage-unavailable': return 'error.storageUnavailable';
    case 'read-failed': return 'error.readFailed';
    case 'write-failed': return 'error.writeFailed';
    case 'migration-failed': return 'error.migrationFailed';
    case 'missing-content': return 'error.missingContent';
    case 'missing-translation': return 'error.missingTranslation';
    case 'unknown-route': return 'error.unknownRoute';
    case 'update-offline': return 'settings.updateOffline';
    case 'update-check-failed': return 'settings.updateError';
    case 'unexpected-ui-error': return 'error.unexpectedUi';
    case 'invalid-input':
    case 'invalid-transition':
    case 'confirmation-required':
      return 'error.writeFailed';
  }
}

export function ErrorPanel({ translator, error, onRetry }: ErrorPanelProps) {
  const statePreserved = 'safeState' in error;
  return (
    <section className={styles.panel} role="alert">
      <h1>{translator.translate(errorKey(error))}</h1>
      {statePreserved && <p>{translator.translate('error.statePreserved')}</p>}
      <code>{error.code}</code>
      <Button onClick={onRetry}>{translator.translate('action.retry')}</Button>
    </section>
  );
}
