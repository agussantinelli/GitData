import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Card } from '../Card';

describe('Card', () => {
  it('renders text children correctly', () => {
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

  it('does not add interactive class when onClick is absent', () => {
    const { container } = render(<Card>Not Clickable</Card>);
    expect(container.firstChild).not.toHaveClass('gitdata-card-interactive');
  });

  it('renders complex nested children', () => {
    render(
      <Card>
        <div data-testid="nested">Nested</div>
      </Card>
    );
    expect(screen.getByTestId('nested')).toBeInTheDocument();
  });

  it('handles multiple click events', () => {
    const handleClick = vi.fn();
    render(<Card onClick={handleClick}>Clickable</Card>);
    
    const card = screen.getByText('Clickable');
    fireEvent.click(card);
    fireEvent.click(card);
    fireEvent.click(card);
    
    expect(handleClick).toHaveBeenCalledTimes(3);
  });

  it('handles multiple custom classes correctly', () => {
    const { container } = render(<Card className="class1 class2 class3">Content</Card>);
    expect(container.firstChild).toHaveClass('glass-panel', 'gitdata-card', 'class1', 'class2', 'class3');
  });

  it('handles undefined className without adding "undefined" class', () => {
    const { container } = render(<Card className={undefined}>Content</Card>);
    expect(container.firstChild).not.toHaveClass('undefined');
  });

  it('renders empty children gracefully', () => {
    const { container } = render(<Card>{null}</Card>);
    expect(container.firstChild).toBeEmptyDOMElement();
  });
});
