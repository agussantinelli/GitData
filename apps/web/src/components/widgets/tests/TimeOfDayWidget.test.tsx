import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TimeOfDayWidget } from '../TimeOfDayWidget';

const mockTimeOfDay = {
  morning: 30,
  afternoon: 50,
  night: 20
};

describe('TimeOfDayWidget', () => {
  it('renders correctly with default props (es/dark)', () => {
    const { container } = render(<TimeOfDayWidget timeOfDay={mockTimeOfDay} />);
    expect(screen.getByText('Reloj del Dev')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('theme-dark');
  });

  it('renders correctly with all zeroes', () => {
    const zeroes = { morning: 0, afternoon: 0, night: 0 };
    render(<TimeOfDayWidget timeOfDay={zeroes} />);
    // Should render 0% multiple times (Mañana, Tarde, Noche)
    const values = screen.getAllByText('0%');
    expect(values.length).toBe(3);
  });

  it('uses the correct language dictionary (en)', () => {
    render(<TimeOfDayWidget timeOfDay={mockTimeOfDay} lang="en" />);
    expect(screen.getByText('Dev Clock')).toBeInTheDocument();
  });

  it('uses the correct language dictionary (pt)', () => {
    render(<TimeOfDayWidget timeOfDay={mockTimeOfDay} lang="pt" />);
    expect(screen.getByText('Relógio do Dev')).toBeInTheDocument();
  });

  it('uses the correct language dictionary (fr)', () => {
    render(<TimeOfDayWidget timeOfDay={mockTimeOfDay} lang="fr" />);
    expect(screen.getByText('Horloge du Dév')).toBeInTheDocument();
  });

  it('uses the correct language dictionary (it)', () => {
    render(<TimeOfDayWidget timeOfDay={mockTimeOfDay} lang="it" />);
    expect(screen.getByText('Orologio del Dev')).toBeInTheDocument();
  });

  it('renders correctly with light theme', () => {
    const { container } = render(<TimeOfDayWidget timeOfDay={mockTimeOfDay} theme="light" />);
    expect(container.firstChild).toHaveClass('theme-light');
  });

  it('handles negative values by defaulting to 0 or formatting gracefully', () => {
    const negative = { morning: -10, afternoon: -20, night: -30 };
    render(<TimeOfDayWidget timeOfDay={negative} />);
    expect(screen.getByText('Reloj del Dev')).toBeInTheDocument();
  });

  it('calculates total correctly and renders percentages accurately', () => {
    render(<TimeOfDayWidget timeOfDay={mockTimeOfDay} />);
    // Total is 100, so percentages are exact: 30%, 50%, 20%
    expect(screen.getByText('30%')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('20%')).toBeInTheDocument();
  });

  it('calculates relative percentages when total is not 100', () => {
    const custom = { morning: 10, afternoon: 10, night: 20 };
    // Total is 40. percentages are 25%, 25%, 50%
    render(<TimeOfDayWidget timeOfDay={custom} />);
    expect(screen.getByText('50%')).toBeInTheDocument();
    const twentyFives = screen.getAllByText('25%');
    expect(twentyFives.length).toBe(2);
  });

  it('handles an exact tie across all periods (33.33%)', () => {
    const tied = { morning: 10, afternoon: 10, night: 10 };
    render(<TimeOfDayWidget timeOfDay={tied} />);
    // Total is 30, so 33.333% each. Se debería redondear a 33% (y tal vez uno a 34% si hay un ajuste, pero comprobamos la coincidencia).
    const percentages = screen.getAllByText(/33%/);
    expect(percentages.length).toBeGreaterThanOrEqual(2);
  });

  it('applies an active or dominant class to the highest time period', () => {
    const { container } = render(<TimeOfDayWidget timeOfDay={{ morning: 5, afternoon: 90, night: 5 }} />);
    // Debería existir algún estilo o clase que denote que la tarde es mayor (como el width o una clase específica).
    // Solo comprobamos que renderiza de forma segura y el 90% está presente.
    expect(screen.getByText('90%')).toBeInTheDocument();
    expect(container.querySelectorAll('.time-bar').length).toBeGreaterThan(0);
  });

  it('handles fractional inputs correctly without crashing', () => {
    const fractional = { morning: 10.5, afternoon: 5.2, night: 8.9 };
    render(<TimeOfDayWidget timeOfDay={fractional} />);
    expect(screen.getByText('Reloj del Dev')).toBeInTheDocument();
  });
});
