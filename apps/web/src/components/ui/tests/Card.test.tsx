import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Card } from '../Card';

describe('Card', () => {
  it('renders children correctly', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('applies default classes', () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.firstChild).toHaveClass('glass-panel', 'gitdata-card');
  });

  it('applies custom classes', () => {
    const { container } = render(<Card className="my-card">Content</Card>);
    expect(container.firstChild).toHaveClass('my-card');
  });

  it('handles click events and adds interactive class', () => {
    const handleClick = vi.fn();
    const { container } = render(<Card onClick={handleClick}>Clickable</Card>);
    
    expect(container.firstChild).toHaveClass('gitdata-card-interactive');
    
    fireEvent.click(screen.getByText('Clickable'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
