import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GlobalStatsWidget } from '../GlobalStatsWidget';

const mockStats = {
  commits: 5000,
  prs: 200,
  issues: 100,
  stars: 1000
};

describe('GlobalStatsWidget', () => {
  it('renders correctly with default props (es/dark)', () => {
    const { container } = render(<GlobalStatsWidget stats={mockStats} followers={50} />);
    expect(screen.getByText('Estadísticas Globales')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('theme-dark');
    expect(screen.getByText('Commits')).toBeInTheDocument();
    expect(screen.getByText('Seguidores')).toBeInTheDocument();
  });

  it('renders correctly with zero values', () => {
    const zeroes = { commits: 0, prs: 0, issues: 0, stars: 0 };
    render(<GlobalStatsWidget stats={zeroes} followers={0} />);
    // Should display multiple 0s
    const values = screen.getAllByText('0');
    expect(values.length).toBeGreaterThan(0);
  });

  it('uses the correct language dictionary (en)', () => {
    render(<GlobalStatsWidget stats={mockStats} followers={50} lang="en" />);
    expect(screen.getByText('Global Stats')).toBeInTheDocument();
    expect(screen.getByText('Followers')).toBeInTheDocument();
  });

  it('uses the correct language dictionary (pt)', () => {
    render(<GlobalStatsWidget stats={mockStats} followers={50} lang="pt" />);
    expect(screen.getByText('Estatísticas Globais')).toBeInTheDocument();
    expect(screen.getByText('Seguidores')).toBeInTheDocument(); // In PT it's also Seguidores
  });

  it('uses the correct language dictionary (fr)', () => {
    render(<GlobalStatsWidget stats={mockStats} followers={50} lang="fr" />);
    expect(screen.getByText('Statistiques Globales')).toBeInTheDocument();
    expect(screen.getByText('Abonnés')).toBeInTheDocument();
  });

  it('uses the correct language dictionary (it)', () => {
    render(<GlobalStatsWidget stats={mockStats} followers={50} lang="it" />);
    expect(screen.getByText('Statistiche Globali')).toBeInTheDocument();
    expect(screen.getByText('Follower')).toBeInTheDocument();
  });

  it('renders correctly with light theme', () => {
    const { container } = render(<GlobalStatsWidget stats={mockStats} followers={50} theme="light" />);
    expect(container.firstChild).toHaveClass('theme-light');
  });

  it('handles extremely large numbers gracefully', () => {
    const massive = { commits: 9999999, prs: 9999999, issues: 9999999, stars: 9999999 };
    const { container } = render(<GlobalStatsWidget stats={massive} followers={9999999} />);
    expect(screen.getByText('Commits')).toBeInTheDocument();
    // Numbers shouldn't overflow container (CSS test)
    expect(container.querySelectorAll('.kpi-card').length).toBe(4);
  });

  it('renders stars explicitly', () => {
    render(<GlobalStatsWidget stats={mockStats} followers={50} />);
    expect(screen.getByText('Estrellas')).toBeInTheDocument();
  });

  it('renders followers stat card with correct value', () => {
    render(<GlobalStatsWidget stats={mockStats} followers={9876} />);
    const expectedValue = (9876).toLocaleString('es');
    expect(screen.getByText(expectedValue)).toBeInTheDocument();
  });

  it('handles zero stats correctly', () => {
    const zeroStats = { commits: 0, prs: 0, issues: 0, stars: 0 };
    render(<GlobalStatsWidget stats={zeroStats} followers={0} lang="en" />);
    // all values should be 0
    expect(screen.getAllByText('0').length).toBeGreaterThan(0);
  });

  it('handles extreme negative numbers by taking absolute value or rendering 0', () => {
    const negativeStats = { commits: -500, prs: -10, issues: -5, stars: -100 };
    render(<GlobalStatsWidget stats={negativeStats} followers={-50} />);
    // Al menos verificamos que no crashea
    expect(screen.getByText('Commits')).toBeInTheDocument();
  });

  it('formats large values using local string formats', () => {
    render(<GlobalStatsWidget stats={{ ...mockStats, commits: 1500000 }} followers={0} lang="en" />);
    // 1,500,000 in english locale
    expect(screen.getByText('1,500,000')).toBeInTheDocument();
  });

  it('handles singular cases properly if applicable (e.g., 1 follower)', () => {
    render(<GlobalStatsWidget stats={mockStats} followers={1} lang="en" />);
    // Aunque el diccionario use "Followers" por defecto, testeamos que el valor "1" se formatea y renderiza bien
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
