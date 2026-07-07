import { describe, it, expect } from 'vitest';
import { dictionaries, Language } from '../locales';

describe('locales (SVG)', () => {
  it('should export dictionaries for es, en, pt, it, fr', () => {
    expect(dictionaries).toHaveProperty('es');
    expect(dictionaries).toHaveProperty('en');
    expect(dictionaries).toHaveProperty('pt');
    expect(dictionaries).toHaveProperty('it');
    expect(dictionaries).toHaveProperty('fr');
  });

  it('should have the exact same keys in all languages', () => {
    const keysEs = Object.keys(dictionaries.es).sort();
    const languages = Object.keys(dictionaries) as Language[];
    
    for (const lang of languages) {
      const keys = Object.keys(dictionaries[lang]).sort();
      expect(keys).toEqual(keysEs);
    }
  });

  it('should not contain empty translation strings', () => {
    const languages = Object.keys(dictionaries) as Language[];
    for (const lang of languages) {
      for (const value of Object.values(dictionaries[lang])) {
        expect(value).not.toBe('');
        expect(typeof value).toBe('string');
      }
    }
  });

  it('has valid translation for commits in english', () => {
    expect(dictionaries.en.commits).toBe('Commits');
  });

  it('has valid translation for projects in spanish', () => {
    expect(dictionaries.es.popularProjects).toBe('Proyectos Destacados');
  });

  it('has valid translation for stats in portuguese', () => {
    expect(dictionaries.pt.globalStats).toBe('Estatísticas Globais');
  });

  it('has valid translation for views in italian', () => {
    expect(dictionaries.it.viewCode).toBe('Vedi Codice');
  });

  it('has valid translation for followers in french', () => {
    expect(dictionaries.fr.followers).toBe('Abonnés');
  });

  it('contains correctly formatted descriptive strings', () => {
    // Checking strings that might have punctuation
    expect(dictionaries.es.yearsExp).toContain('.');
    expect(dictionaries.en.codeFreqDesc).toContain('.');
  });

  it('provides fallback unknown strings safely', () => {
    expect(dictionaries.en.unknown).toBe('Unknown');
    expect(dictionaries.es.unknown).toBe('Desconocido');
  });
});
