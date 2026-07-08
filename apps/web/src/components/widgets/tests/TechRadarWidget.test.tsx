import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TechRadarWidget } from '../TechRadarWidget';

const mockRadar = {
  frontend: 80,
  backend: 60,
  devops: 40
};

describe('TechRadarWidget', () => {
  it('renders correctly with default props (es/dark)', () => {
    const { container } = render(<TechRadarWidget techRadar={mockRadar} />);
    expect(screen.getByText('Radar Tecnológico')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('theme-dark');
  });

  it('renders correctly with all zero values', () => {
    const zeroes = { frontend: 0, backend: 0, devops: 0 };
    const { container } = render(<TechRadarWidget techRadar={zeroes} />);
    expect(screen.getByText('Radar Tecnológico')).toBeInTheDocument();
    expect(container.querySelectorAll('.radar-bar-wrapper').length).toBe(3);
  });

  it('uses the correct language dictionary (en)', () => {
    render(<TechRadarWidget techRadar={mockRadar} lang="en" />);
    expect(screen.getByText('Tech Radar')).toBeInTheDocument();
  });

  it('uses the correct language dictionary (pt)', () => {
    render(<TechRadarWidget techRadar={mockRadar} lang="pt" />);
    expect(screen.getByText('Radar de Tecnologia')).toBeInTheDocument();
  });

  it('uses the correct language dictionary (fr)', () => {
    render(<TechRadarWidget techRadar={mockRadar} lang="fr" />);
    expect(screen.getByText('Radar Technologique')).toBeInTheDocument();
  });

  it('uses the correct language dictionary (it)', () => {
    render(<TechRadarWidget techRadar={mockRadar} lang="it" />);
    expect(screen.getByText('Radar Tecnologico')).toBeInTheDocument();
  });

  it('renders correctly with light theme', () => {
    const { container } = render(<TechRadarWidget techRadar={mockRadar} theme="light" />);
    expect(container.firstChild).toHaveClass('theme-light');
  });

  it('renders radar labels correctly', () => {
    render(<TechRadarWidget techRadar={mockRadar} />);
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('Backend')).toBeInTheDocument();
    expect(screen.getByText('DevOps & Data')).toBeInTheDocument();
  });

  it('handles extremely high values (capped implicitly by structure)', () => {
    const massive = { frontend: 999, backend: 999, devops: 999 };
    const { container } = render(<TechRadarWidget techRadar={massive} />);
    expect(container.querySelectorAll('.radar-bar-wrapper').length).toBe(3);
  });

  it('contains radar graph structure', () => {
    const { container } = render(<TechRadarWidget techRadar={mockRadar} />);
    const bars = container.querySelectorAll('.radar-bar-fill');
    expect(bars.length).toBeGreaterThan(0);
  });

  it('handles absolute dominance in a single quadrant without distorting the SVG completely', () => {
    const skewed = { frontend: 1000, backend: 0, devops: 0 };
    const { container } = render(<TechRadarWidget techRadar={skewed} />);
    // Debería renderizar la UI sin errores, calculando 100% para frontend y 0 para el resto
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(container.querySelectorAll('.radar-bar-wrapper').length).toBe(3);
  });

  it('handles completely undefined or missing values gracefully', () => {
    const missing = { frontend: undefined as any, backend: undefined as any, devops: undefined as any };
    render(<TechRadarWidget techRadar={missing} />);
    // Debería fallback a 0 y no crashear
    expect(screen.getByText('Radar Tecnológico')).toBeInTheDocument();
  });

  it('handles negative or invalid values gracefully', () => {
    const negative = { frontend: -50, backend: NaN as any, devops: null as any };
    render(<TechRadarWidget techRadar={negative} />);
    expect(screen.getByText('Radar Tecnológico')).toBeInTheDocument();
  });
});
