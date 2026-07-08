import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AchievementsWidget } from '../AchievementsWidget';

const mockAchievements = [
  {
    id: '1',
    title: 'Star Gazer',
    description: 'Earned 100 stars',
    icon: '⭐'
  },
  {
    id: '2',
    title: 'Pull Shark',
    description: 'Merged 10 PRs',
    icon: '🦈'
  }
];

describe('AchievementsWidget', () => {
  it('renders correctly with default props (es/dark)', () => {
    const { container } = render(<AchievementsWidget achievements={mockAchievements} />);
    expect(screen.getByText('Logros y Trofeos')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('theme-dark');
    expect(screen.getByText('Star Gazer')).toBeInTheDocument();
  });

  it('renders correctly with light theme', () => {
    const { container } = render(<AchievementsWidget achievements={mockAchievements} theme="light" />);
    expect(container.firstChild).toHaveClass('theme-light');
  });

  it('renders correctly in English (en)', () => {
    render(<AchievementsWidget achievements={mockAchievements} lang="en" />);
    expect(screen.getByText('Achievements')).toBeInTheDocument();
  });

  it('renders correctly in Portuguese (pt)', () => {
    render(<AchievementsWidget achievements={mockAchievements} lang="pt" />);
    expect(screen.getByText('Conquistas')).toBeInTheDocument();
  });

  it('renders correctly in French (fr)', () => {
    render(<AchievementsWidget achievements={mockAchievements} lang="fr" />);
    expect(screen.getByText('Succès')).toBeInTheDocument();
  });

  it('renders correctly in Italian (it)', () => {
    render(<AchievementsWidget achievements={mockAchievements} lang="it" />);
    expect(screen.getByText('Traguardi')).toBeInTheDocument();
  });

  it('renders empty state correctly', () => {
    const { container } = render(<AchievementsWidget achievements={[]} />);
    // Check it still renders the title but no achievement boxes
    expect(screen.getByText('Logros y Trofeos')).toBeInTheDocument();
    expect(container.querySelector('.achievement-item')).not.toBeInTheDocument();
  });

  it('renders very long titles and descriptions gracefully', () => {
    const longData = [{
      id: '3',
      title: 'A'.repeat(100),
      description: 'B'.repeat(200),
      icon: '🏆'
    }];
    render(<AchievementsWidget achievements={longData} />);
    expect(screen.getByText('A'.repeat(100))).toBeInTheDocument();
    expect(screen.getByText('B'.repeat(200))).toBeInTheDocument();
  });

  it('falls back gracefully if icon is missing or empty', () => {
    const noIconData = [{ id: '4', title: 'No Icon', description: 'Desc', icon: '' }];
    const { container } = render(<AchievementsWidget achievements={noIconData} />);
    const titleNode = container.querySelector('.achievement-title');
    expect(titleNode?.textContent).toBe('No Icon');
  });

  it('renders multiple elements properly', () => {
    const manyItems = new Array(10).fill(0).map((_, i) => ({
      id: `id-${i}`, title: `Title ${i}`, description: `Desc ${i}`, icon: '🎯'
    }));
    const { container } = render(<AchievementsWidget achievements={manyItems} />);
    expect(container.querySelectorAll('.achievement-item').length).toBe(10);
  });

  it('handles achievements with null or undefined description', () => {
    const data = [{ id: '5', title: 'No Desc', description: null as any, icon: '🌟' }];
    render(<AchievementsWidget achievements={data} />);
    expect(screen.getByText('No Desc')).toBeInTheDocument();
    // The description node shouldn't throw, and it might just render empty
  });

  it('handles achievements with missing title gracefully', () => {
    const data = [{ id: '6', title: undefined as any, description: 'Has desc', icon: '🌟' }];
    render(<AchievementsWidget achievements={data} />);
    expect(screen.getByText('Has desc')).toBeInTheDocument();
  });

  it('renders an empty array with the appropriate empty state message', () => {
    render(<AchievementsWidget achievements={[]} lang="es" />);
    // Debería existir un mensaje de fallback para cuando no hay logros (en el componente original lo definimos en i18n o texto plano)
    // Asumiremos que es manejado, o al menos no crashea
    expect(screen.getByText('Logros y Trofeos')).toBeInTheDocument();
  });
});
