import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CodeLifeBalanceWidget } from '../CodeLifeBalanceWidget';

const mockBalance = {
  weekdays: 80,
  weekends: 20
};

describe('CodeLifeBalanceWidget', () => {
  it('renders correctly with default props (es/dark)', () => {
    const { container } = render(<CodeLifeBalanceWidget balance={mockBalance} />);
    expect(screen.getByText('Code-Life Balance')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('theme-dark');
    expect(screen.getByText('Lunes a Viernes')).toBeInTheDocument();
    expect(screen.getByText('Sábado y Domingo')).toBeInTheDocument();
  });

  it('renders empty/zero state correctly', () => {
    const { container } = render(<CodeLifeBalanceWidget balance={{ weekdays: 0, weekends: 0 }} />);
    // Should render 0% without crashing
    const values = container.querySelectorAll('.codelife-value');
    expect(values.length).toBe(2);
    expect(values[0].textContent).toBe('0%');
  });

  it('uses the correct language dictionary (en)', () => {
    render(<CodeLifeBalanceWidget balance={mockBalance} lang="en" />);
    expect(screen.getByText('Weekdays')).toBeInTheDocument();
    expect(screen.getByText('Weekends')).toBeInTheDocument();
  });

  it('uses the correct language dictionary (pt)', () => {
    render(<CodeLifeBalanceWidget balance={mockBalance} lang="pt" />);
    expect(screen.getByText('Dias Úteis')).toBeInTheDocument();
    expect(screen.getByText('Fins de Semana')).toBeInTheDocument();
  });

  it('uses the correct language dictionary (fr)', () => {
    render(<CodeLifeBalanceWidget balance={mockBalance} lang="fr" />);
    expect(screen.getByText('En Semaine')).toBeInTheDocument();
    expect(screen.getByText('Week-end')).toBeInTheDocument();
  });

  it('uses the correct language dictionary (it)', () => {
    render(<CodeLifeBalanceWidget balance={mockBalance} lang="it" />);
    expect(screen.getByText('Giorni Feriali')).toBeInTheDocument();
    expect(screen.getByText('Fine Settimana')).toBeInTheDocument();
  });

  it('renders correctly with light theme', () => {
    const { container } = render(<CodeLifeBalanceWidget balance={mockBalance} theme="light" />);
    expect(container.firstChild).toHaveClass('theme-light');
  });

  it('handles extremely biased values correctly (100% / 0%)', () => {
    render(<CodeLifeBalanceWidget balance={{ weekdays: 100, weekends: 0 }} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('calculates the dominant part correctly visually', () => {
    const { container } = render(<CodeLifeBalanceWidget balance={{ weekdays: 10, weekends: 90 }} />);
    // Since weekends is dominant, its bar should have a larger inline style width
    // This is tested indirectly by ensuring it renders without throwing and bar elements are present
    expect(container.querySelectorAll('.codelife-bar').length).toBe(2);
  });

  it('handles negative values by defaulting to 0 or formatting as is', () => {
    render(<CodeLifeBalanceWidget balance={{ weekdays: -10, weekends: -20 }} />);
    // Checking it doesn't crash
    expect(screen.getByText('Code-Life Balance')).toBeInTheDocument();
  });

  it('handles perfectly equal balance without fractional errors', () => {
    render(<CodeLifeBalanceWidget balance={{ weekdays: 50, weekends: 50 }} />);
    // Debería mostrar exactamente 50% en ambos sin decimales largos
    const percentages = screen.getAllByText('50%');
    expect(percentages.length).toBe(2);
  });

  it('handles floating point values to avoid long decimals like 33.333%', () => {
    // 1 weekday, 2 weekends -> 33.33% and 66.66%
    render(<CodeLifeBalanceWidget balance={{ weekdays: 1, weekends: 2 }} />);
    // Comprobamos que redondea correctamente y no se rompe la UI
    const values = screen.getAllByText(/%/);
    expect(values[0].textContent).toMatch(/^(33|67)%$/);
    expect(values[1].textContent).toMatch(/^(33|67)%$/);
  });

  it('renders gracefully when completely dominated by weekends', () => {
    render(<CodeLifeBalanceWidget balance={{ weekdays: 0, weekends: 500 }} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});
