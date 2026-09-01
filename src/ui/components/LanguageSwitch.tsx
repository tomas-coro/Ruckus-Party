import type { Locale } from '../../domain/localization/translationKey';
import styles from './LanguageSwitch.module.css';

export interface LanguageSwitchProps {
  readonly locale: Locale;
  readonly onChange: (locale: Locale) => void;
}

export function LanguageSwitch({ locale, onChange }: LanguageSwitchProps) {
  const nextLocale = locale === 'it' ? 'en' : 'it';
  const label = locale === 'it' ? 'Passa all’inglese' : 'Switch to Italian';
  return (
    <button
      type="button"
      className={styles.switch}
      aria-label={label}
      onClick={() => {
        onChange(nextLocale);
      }}
    >
      {locale === 'it' ? 'ITA' : 'EN'}
    </button>
  );
}
