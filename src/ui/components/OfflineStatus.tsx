import styles from './OfflineStatus.module.css';

export interface OfflineStatusProps {
  readonly ready: boolean;
  readonly readyLabel: string;
  readonly unavailableLabel: string;
}

export function OfflineStatus({ ready, readyLabel, unavailableLabel }: OfflineStatusProps) {
  return (
    <p className={styles.status} role="status" data-ready={ready}>
      <span className={styles.indicator} aria-hidden="true" />
      {ready ? readyLabel : unavailableLabel}
    </p>
  );
}
