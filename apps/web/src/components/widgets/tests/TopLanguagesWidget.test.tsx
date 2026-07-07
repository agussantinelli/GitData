import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TopLanguagesWidget } from '../TopLanguagesWidget';

const mockLanguages = [
  { name: 'TypeScript', percentage: 70 },
  { name: 'JavaScript', percentage: 20 },
  { name: 'Rust', percentage: 10 }
];

describe('TopLanguagesWidget', () => {
  it('renders correctly with default props', () => {
    const { container } = render(<TopLanguagesWidget languages={mockLanguages} />);
    
    // Check title
    expect(screen.getByText('Lenguajes Principales')).toBeInTheDocument();
    
    // Check if the theme wrapper is applied
    expect(container.firstChild).toHaveClass('theme-dark');

    // Check content
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Rust')).toBeInTheDocument();
  });

  it('renders empty state correctly', () => {
    render(<TopLanguagesWidget languages={[]} />);
    expect(screen.getByText('No language data available.')).toBeInTheDocument();
  });

  it('uses the correct language dictionary (en)', () => {
    render(<TopLanguagesWidget languages={mockLanguages} lang="en" />);
    // English title
    expect(screen.getByText('Top Languages')).toBeInTheDocument();
  });
});
