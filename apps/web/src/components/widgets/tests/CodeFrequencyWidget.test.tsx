import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CodeFrequencyWidget } from '../CodeFrequencyWidget';

const mockContributions = [
  { date: '2023-01-01', count: 5 },
  { date: '2023-01-02', count: 0 },
  { date: '2023-01-03', count: 12 },
];

describe('CodeFrequencyWidget', () => {
  it('renders correctly with default props (es/dark)', () => {
    const { container } = render(<CodeFrequencyWidget contributions={mockContributions} />);
    expect(screen.getByText('Frecuencia de Código')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('theme-dark');
  });

  it('renders empty state correctly in default lang', () => {
    render(<CodeFrequencyWidget contributions={[]} />);
    expect(screen.getByText('No hay datos de frecuencia disponibles.')).toBeInTheDocument();
  });

  it('uses the correct language dictionary (en)', () => {
    render(<CodeFrequencyWidget contributions={mockContributions} lang="en" />);
    expect(screen.getByText('Code Frequency')).toBeInTheDocument();
  });

  it('uses the correct language dictionary (pt)', () => {
    render(<CodeFrequencyWidget contributions={mockContributions} lang="pt" />);
    expect(screen.getByText('Frequência de Código')).toBeInTheDocument();
  });

  it('uses the correct language dictionary (fr)', () => {
    render(<CodeFrequencyWidget contributions={mockContributions} lang="fr" />);
    expect(screen.getByText('Fréquence de Code')).toBeInTheDocument();
  });

  it('uses the correct language dictionary (it)', () => {
    render(<CodeFrequencyWidget contributions={mockContributions} lang="it" />);
    expect(screen.getByText('Frequenza del Codice')).toBeInTheDocument();
  });

  it('renders correctly with light theme', () => {
    const { container } = render(<CodeFrequencyWidget contributions={mockContributions} theme="light" />);
    expect(container.firstChild).toHaveClass('theme-light');
  });

  it('handles single contribution entry gracefully', () => {
    const single = [{ date: '2023-01-01', count: 100 }];
    const { container } = render(<CodeFrequencyWidget contributions={single} />);
    // Should still render without crashing and compute streak as 1
    const ones = screen.getAllByText('1');
    expect(ones.length).toBeGreaterThan(0);
    expect(container.querySelector('.frequency-chart')).toBeNull(); // it's frequency-heatmap, wait...
    expect(container.querySelector('.frequency-heatmap')).toBeInTheDocument();
  });

  it('handles very large counts and zero counts properly', () => {
    const extremes = [
      { date: '2023-01-01', count: 0 },
      { date: '2023-01-02', count: 99999 }
    ];
    render(<CodeFrequencyWidget contributions={extremes} />);
    expect(screen.getByText('99999')).toBeInTheDocument();
  });

  it('calculates streaks correctly for continuous days', () => {
    const continuous = [
      { date: '2023-01-01', count: 5 },
      { date: '2023-01-02', count: 3 },
      { date: '2023-01-03', count: 1 }
    ];
    render(<CodeFrequencyWidget contributions={continuous} />);
    // Current streak should be 3
    const values = screen.getAllByText('3');
    expect(values.length).toBeGreaterThan(0);
  });

  it('handles rendering correctly when all contributions are zero', () => {
    const zeroes = [
      { date: '2023-01-01', count: 0 },
      { date: '2023-01-02', count: 0 },
      { date: '2023-01-03', count: 0 }
    ];
    render(<CodeFrequencyWidget contributions={zeroes} />);
    // La racha y máximo deben ser 0
    expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(2);
  });

  it('handles identical non-zero values across the board', () => {
    const flat = [
      { date: '2023-01-01', count: 5 },
      { date: '2023-01-02', count: 5 },
      { date: '2023-01-03', count: 5 }
    ];
    const { container } = render(<CodeFrequencyWidget contributions={flat} />);
    // Verificamos que no divida por cero al escalar colores o max values
    const cells = container.querySelectorAll('.heatmap-cell');
    expect(cells.length).toBeGreaterThan(0);
  });

  it('handles negative or invalid counts gracefully', () => {
    const invalid = [
      { date: '2023-01-01', count: -10 },
      { date: '2023-01-02', count: NaN as any }
    ];
    render(<CodeFrequencyWidget contributions={invalid} />);
    // Al menos no debería explotar la vista
    expect(screen.getByText('Frecuencia de Código')).toBeInTheDocument();
  });
});
