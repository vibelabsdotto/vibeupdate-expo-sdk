import { describe, expect, it } from 'vitest';
import { dictionaries, resolveStrings, resolveUiLocale, supportedLocales } from '../src/locales.js';

describe('UI locale resolution', () => {
  it.each([
    ['de-DE', 'de'],
    ['pt-BR', 'pt-BR'],
    ['pt-PT', 'en'],
    ['zh-CN', 'zh-Hans'],
    ['zh-SG', 'zh-Hans'],
    ['zh-TW', 'zh-Hant'],
    ['zh-HK', 'zh-Hant'],
    ['zh-Hans-CN', 'zh-Hans'],
    ['zh-Hant-TW', 'zh-Hant'],
    ['xx-ZZ', 'en'],
  ] as const)('resolves %s to %s', (input, expected) => {
    expect(resolveUiLocale(input)).toBe(expected);
  });

  it('contains exactly 20 complete dictionaries', () => {
    expect(supportedLocales).toHaveLength(20);
    expect(Object.keys(dictionaries).sort()).toEqual([...supportedLocales].sort());
    const requiredKeys = Object.keys(dictionaries.en).sort();
    for (const locale of supportedLocales) {
      expect(Object.keys(dictionaries[locale]).sort()).toEqual(requiredKeys);
      expect(Object.values(dictionaries[locale]).every((value) => value.trim().length > 0)).toBe(true);
    }
  });

  it('applies local string overrides last', () => {
    expect(resolveStrings('de', { updateNow: 'Los gehts' }).updateNow).toBe('Los gehts');
  });
});
