import { useState } from 'react';

import type { Result } from '../../application/result';
import type { Translator } from '../../content/translations/translator';
import type { AppError } from '../../domain/errors';
import { Button } from '../../ui/components/Button';
import { ConfirmationModal } from '../../ui/components/ConfirmationModal';
import { ErrorPanel } from '../../ui/components/ErrorPanel';
import styles from './RecoveryScreen.module.css';

export interface RecoveryScreenProps {
  readonly translator: Translator;
  readonly error: AppError;
  readonly onRetry: () => void;
  readonly onExportDiagnostics: () => Promise<void>;
  readonly onResetAllData: () => Promise<Result<void>>;
}

export function RecoveryScreen({
  translator,
  error,
  onRetry,
  onExportDiagnostics,
  onResetAllData,
}: RecoveryScreenProps) {
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [resetError, setResetError] = useState(false);

  async function confirmReset() {
    setResetError(false);
    const result = await onResetAllData();
    if (!result.ok) {
      setResetError(true);
      setConfirmingReset(false);
    }
  }

  return (
    <div className={styles.screen}>
      <ErrorPanel translator={translator} error={error} onRetry={onRetry} />
      <div className={styles.secondaryActions}>
        <Button variant="secondary" onClick={() => { void onExportDiagnostics(); }}>
          {translator.translate('recovery.exportDiagnostics')}
        </Button>
        <Button variant="ghost" onClick={() => { setConfirmingReset(true); }}>
          {translator.translate('recovery.resetData')}
        </Button>
      </div>
      {resetError && (
        <p className={styles.resetError} role="alert">
          {translator.translate('error.writeFailed')} {translator.translate('error.statePreserved')}
        </p>
      )}
      {confirmingReset && (
        <ConfirmationModal
          title={translator.translate('recovery.resetConfirmTitle')}
          body={translator.translate('recovery.resetConfirmBody')}
          confirmLabel={translator.translate('recovery.resetConfirmAction')}
          cancelLabel={translator.translate('action.cancel')}
          onConfirm={() => { void confirmReset(); }}
          onCancel={() => { setConfirmingReset(false); }}
        />
      )}
    </div>
  );
}
