import { describe, expect, it } from 'vitest';

import { en } from './en';
import { it as italian } from './it';
import { createTranslator } from './translator';

describe('local translations', () => {
  it('keeps Italian and English dictionaries in exact key parity', () => {
    expect(Object.keys(italian).sort()).toEqual(Object.keys(en).sort());
  });

  it('formats lists and numbers with the selected locale', () => {
    const itTranslator = createTranslator('it');
    const enTranslator = createTranslator('en');

    expect(itTranslator.list(['Ada', 'Luca'])).toBe('Ada e Luca');
    expect(enTranslator.list(['Ada', 'Luca'])).toBe('Ada and Luca');
    expect(itTranslator.number(12345)).toBe('12.345');
    expect(enTranslator.number(12345)).toBe('12,345');
  });
});
