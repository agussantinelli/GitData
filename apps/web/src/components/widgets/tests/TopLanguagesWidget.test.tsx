import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TopLanguagesWidget } from '../TopLanguagesWidget';

const mockLanguages = [
  { name: 'TypeScript', percentage: 70 },
  { name: 'JavaScript', percentage: 20 },
  { name: 'Rust', percentage: 10 }
];

describe('TopLanguagesWidget', () => {
  it('renders correctly with default props (es/dark)', () => {
    const { container } = render(<TopLanguagesWidget languages={mockLanguages} />);
    expect(screen.getByText('Lenguajes Principales')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('theme-dark');
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Rust')).toBeInTheDocument();
  });

  it('renders empty state correctly in default lang', () => {
    render(<TopLanguagesWidget languages={[]} />);
    // Translation for no language data
    expect(screen.getByText('No hay datos de lenguajes disponibles.')).toBeInTheDocument();
  });

  it('uses the correct language dictionary (en)', () => {
    render(<TopLanguagesWidget languages={mockLanguages} lang="en" />);
    expect(screen.getByText('Top Languages')).toBeInTheDocument();
  });

  it('uses the correct language dictionary (pt)', () => {
    render(<TopLanguagesWidget languages={mockLanguages} lang="pt" />);
    expect(screen.getByText('Principais Linguagens')).toBeInTheDocument();
  });

  it('uses the correct language dictionary (fr)', () => {
    render(<TopLanguagesWidget languages={mockLanguages} lang="fr" />);
    expect(screen.getByText('Langages Principaux')).toBeInTheDocument();
  });

  it('uses the correct language dictionary (it)', () => {
    render(<TopLanguagesWidget languages={mockLanguages} lang="it" />);
    expect(screen.getByText('Linguaggi Principali')).toBeInTheDocument();
  });

  it('renders correctly with light theme', () => {
    const { container } = render(<TopLanguagesWidget languages={mockLanguages} theme="light" />);
    expect(container.firstChild).toHaveClass('theme-light');
  });

  it('limits to top 5 languages only', () => {
    const manyLangs = [
      { name: '1', percentage: 10 }, { name: '2', percentage: 10 }, { name: '3', percentage: 10 },
      { name: '4', percentage: 10 }, { name: '5', percentage: 10 }, { name: '6', percentage: 10 },
    ];
    const { container } = render(<TopLanguagesWidget languages={manyLangs} />);
    expect(container.querySelectorAll('.language-item').length).toBe(5);
  });

  it('renders percentages accurately', () => {
    render(<TopLanguagesWidget languages={mockLanguages} />);
    expect(screen.getByText('70%')).toBeInTheDocument();
    expect(screen.getByText('20%')).toBeInTheDocument();
  });

  it('handles negative percentages by mapping them as strings without crashing', () => {
    const negativeLangs = [{ name: 'BadLang', percentage: -5 }];
    render(<TopLanguagesWidget languages={negativeLangs} />);
    expect(screen.getByText('-5%')).toBeInTheDocument();
  });

  it('provides a fallback color for unknown languages', () => {
    const unknownLang = [{ name: 'SomeObscureLang2025', percentage: 100 }];
    const { container } = render(<TopLanguagesWidget languages={unknownLang} />);
    // Check that it doesn't crash and renders the dot
    const icon = container.querySelector('.language-icon');
    expect(icon).toBeInTheDocument();
    // Color might be an inline style with a fallback gray/random color
  });

  it('renders a 100% monolithic repository correctly', () => {
    const monoRepo = [{ name: 'JavaScript', percentage: 100 }];
    const { container } = render(<TopLanguagesWidget languages={monoRepo} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
    // La barra debería no tener divisiones u otros colores
    const barSections = container.querySelectorAll('.language-progress-bar');
    expect(barSections.length).toBe(1);
  });

  it('handles small fractional percentages (< 1%) without collapsing the UI', () => {
    const fractions = [
      { name: 'TypeScript', percentage: 99.9 },
      { name: 'Rust', percentage: 0.1 }
    ];
    render(<TopLanguagesWidget languages={fractions} />);
    expect(screen.getByText('99.9%')).toBeInTheDocument();
    expect(screen.getByText('0.1%')).toBeInTheDocument();
  });
});
