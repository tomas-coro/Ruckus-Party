import type { ReactNode } from 'react';

import type { Locale } from '../../domain/localization/translationKey';
import { LanguageSwitch } from '../components/LanguageSwitch';
import styles from './AppShell.module.css';

export interface AppShellProps {
  readonly locale: Locale;
  readonly settingsLabel: string;
  readonly onLocaleChange: (locale: Locale) => void;
  readonly onSettings: () => void;
  readonly children: ReactNode;
}

function BrandIcon() {
  return (
    <svg className={styles.brandIcon} viewBox="0 0 100 100" role="img" aria-label="Ruckus Party">
      <rect width="100" height="100" fill="#132824" />
      <path d="M0 28h31l16 22-16 22H0l18-22Z" fill="#6fd2b8" />
      <path d="M100 28H69L53 50l16 22h31L82 50Z" fill="#ff643b" />
      <rect x="22" y="14" width="56" height="72" rx="11" fill="#f7c64b" stroke="#132824" strokeWidth="4" />
      <text x="50" y="68" textAnchor="middle" fill="#132824" fontFamily="Archivo Black, sans-serif" fontSize="50">R</text>
    </svg>
  );
}

export function AppShell({
  locale,
  settingsLabel,
  onLocaleChange,
  onSettings,
  children,
}: AppShellProps) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <BrandIcon />
        <span className={styles.brandName}>Ruckus Party</span>
        <button
          type="button"
          className={styles.settings}
          aria-label={settingsLabel}
          onClick={onSettings}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
          </svg>
        </button>
        <LanguageSwitch locale={locale} onChange={onLocaleChange} />
      </header>
      {children}
    </div>
  );
}
