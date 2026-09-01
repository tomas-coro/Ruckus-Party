import { Button } from './Button';
import { Modal } from './Modal';
import styles from './ConfirmationModal.module.css';

export interface ConfirmationModalProps {
  readonly title: string;
  readonly body: string;
  readonly confirmLabel: string;
  readonly cancelLabel: string;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}

export function ConfirmationModal({
  title,
  body,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  return (
    <Modal open title={title} onClose={onCancel}>
      <p className={styles.body}>{body}</p>
      <div className={styles.actions}>
        <Button variant="secondary" onClick={onCancel}>{cancelLabel}</Button>
        <Button onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}
