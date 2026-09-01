import type { Locale, TranslationKey } from '../../domain/localization/translationKey';
import { en } from './en';
import { it } from './it';

const dictionaries = { en, it } satisfies Record<Locale, Record<TranslationKey, string>>;
const intlLocales = { en: 'en-US', it: 'it-IT' } satisfies Record<Locale, string>;

export interface Translator {
  translate(key: TranslationKey): string;
  list(values: readonly string[]): string;
  number(value: number): string;
  pluralCategory(value: number): Intl.LDMLPluralRule;
}

export function createTranslator(locale: Locale): Translator {
  const intlLocale = intlLocales[locale];
  const listFormatter = new Intl.ListFormat(intlLocale, {
    style: 'long',
    type: 'conjunction',
  });
  const numberFormatter = new Intl.NumberFormat(intlLocale);
  const pluralRules = new Intl.PluralRules(intlLocale);

  return {
    translate: key => dictionaries[locale][key],
    list: values => listFormatter.format(values),
    number: value => numberFormatter.format(value),
    pluralCategory: value => pluralRules.select(value),
  };
}
