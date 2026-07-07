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
    const languages = Object.keys(dictionaries) as (keyof typeof dictionaries)[];
    
    for (const lang of languages) {
      if (lang === 'es') continue;
      const keysLang = Object.keys(dictionaries[lang]).sort();
      expect(keysLang).toEqual(keysEs);
    }
  });

  it('translates common keys correctly in English', () => {
    expect(dictionaries.en.commits).toBe('Commits');
    expect(dictionaries.en.stars).toBe('Stars');
  });

  it('translates common keys correctly in Spanish', () => {
    expect(dictionaries.es.commits).toBe('Commits');
    expect(dictionaries.es.stars).toBe('Estrellas');
  });

  it('translates common keys correctly in Portuguese', () => {
    expect(dictionaries.pt.commits).toBe('Commits');
    expect(dictionaries.pt.stars).toBe('Estrelas');
  });

  it('translates common keys correctly in French', () => {
    expect(dictionaries.fr.commits).toBe('Commits');
    expect(dictionaries.fr.stars).toBe('Étoiles');
  });

  it('translates common keys correctly in Italian', () => {
    expect(dictionaries.it.commits).toBe('Commits');
    expect(dictionaries.it.stars).toBe('Stelle');
  });

  it('contains correctly formatted long strings', () => {
    expect(dictionaries.es.codeFreqDesc.length).toBeGreaterThan(10);
    expect(dictionaries.en.hourlyActivityDesc.length).toBeGreaterThan(10);
  });

  it('has no empty translations', () => {
    const languages = Object.keys(dictionaries) as (keyof typeof dictionaries)[];
    for (const lang of languages) {
      for (const value of Object.values(dictionaries[lang])) {
        expect(value).not.toBe('');
        expect(value).not.toBeNull();
      }
    }
  });

  it('has identical count of translations across all languages', () => {
    const countEs = Object.keys(dictionaries.es).length;
    expect(Object.keys(dictionaries.en).length).toBe(countEs);
    expect(Object.keys(dictionaries.pt).length).toBe(countEs);
    expect(Object.keys(dictionaries.fr).length).toBe(countEs);
    expect(Object.keys(dictionaries.it).length).toBe(countEs);
  });
});
