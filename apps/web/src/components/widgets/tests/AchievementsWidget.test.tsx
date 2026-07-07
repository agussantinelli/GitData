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
  it('renders correctly with default props', () => {
    const { container } = render(<AchievementsWidget achievements={mockAchievements} />);
    
    // Check title (default 'es')
    expect(screen.getByText('Logros y Trofeos')).toBeInTheDocument();
    
    // Check if the theme wrapper is applied (default is dark)
    expect(container.firstChild).toHaveClass('theme-dark');

    // Check content
    expect(screen.getByText('Star Gazer')).toBeInTheDocument();
    expect(screen.getByText('Pull Shark')).toBeInTheDocument();
  });

  it('renders correctly with light theme', () => {
    const { container } = render(<AchievementsWidget achievements={mockAchievements} theme="light" />);
    expect(container.firstChild).toHaveClass('theme-light');
  });

  it('uses the correct language dictionary (en)', () => {
    render(<AchievementsWidget achievements={mockAchievements} lang="en" />);
    // Title in English
    expect(screen.getByText('Achievements')).toBeInTheDocument();
  });
});
