import { describe, it, expect } from 'vitest';
import { dictionaries } from '../dictionaries';

describe('Dictionaries', () => {
  it('contains dictionaries for all supported languages', () => {
    expect(dictionaries).toHaveProperty('es');
    expect(dictionaries).toHaveProperty('en');
    expect(dictionaries).toHaveProperty('pt');
    expect(dictionaries).toHaveProperty('it');
    expect(dictionaries).toHaveProperty('fr');
  });

  it('has identical keys in all dictionaries', () => {
    const keysEs = Object.keys(dictionaries.es).sort();
    
    // We expect every other language to have the exact same keys as 'es'
    const languages = Object.keys(dictionaries) as (keyof typeof dictionaries)[];
    
    for (const lang of languages) {
      if (lang === 'es') continue;
      const keysLang = Object.keys(dictionaries[lang]).sort();
      expect(keysLang).toEqual(keysEs);
    }
  });
});
