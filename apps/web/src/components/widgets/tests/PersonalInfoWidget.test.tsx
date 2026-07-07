import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PersonalInfoWidget } from '../PersonalInfoWidget';

const mockProfileData = {
  name: 'Agustin Santinelli',
  username: 'agussantinelli',
  bio: 'Software Engineer',
  location: 'Argentina',
  followers: 120,
  createdAt: '2020-01-01T00:00:00Z',
  stats: {
    commits: 1500,
    prs: 50,
    issues: 20,
    stars: 300,
  },
  topLanguages: [
    { name: 'TypeScript', percentage: 80 },
    { name: 'JavaScript', percentage: 20 },
  ],
};

describe('PersonalInfoWidget', () => {
  it('renders correctly with default props', () => {
    const { container } = render(<PersonalInfoWidget data={mockProfileData} />);
    
    // Check main elements
    expect(screen.getByText('Agustin Santinelli')).toBeInTheDocument();
    expect(screen.getByText('@agussantinelli')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    
    // Check if the theme wrapper is applied (default is dark)
    expect(container.firstChild).toHaveClass('theme-dark');
  });

  it('renders correctly with light theme', () => {
    const { container } = render(<PersonalInfoWidget data={mockProfileData} theme="light" />);
    expect(container.firstChild).toHaveClass('theme-light');
  });

  it('uses the correct language dictionary (en)', () => {
    render(<PersonalInfoWidget data={mockProfileData} lang="en" />);
    // "years exp." comes from the english dictionary
    expect(screen.getByText(/years exp\./i)).toBeInTheDocument();
  });

  it('uses the correct language dictionary (es)', () => {
    render(<PersonalInfoWidget data={mockProfileData} lang="es" />);
    // "años exp." comes from the spanish dictionary
    expect(screen.getByText(/años exp\./i)).toBeInTheDocument();
  });
});
