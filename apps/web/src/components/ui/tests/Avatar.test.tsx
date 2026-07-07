import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar } from '../Avatar';

describe('Avatar', () => {
  it('renders correctly with default props', () => {
    render(<Avatar src="https://example.com/avatar.png" alt="User avatar" />);
    
    const img = screen.getByAltText('User avatar') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toBe('https://example.com/avatar.png');
    expect(img.getAttribute('width')).toBe('64');
    expect(img.getAttribute('height')).toBe('64');
    expect(img).toHaveClass('gitdata-avatar');
  });

  it('renders correctly with custom props', () => {
    render(
      <Avatar 
        src="https://example.com/custom.png" 
        alt="Custom avatar" 
        size={128} 
        className="custom-class" 
      />
    );
    
    const img = screen.getByAltText('Custom avatar') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toBe('https://example.com/custom.png');
    expect(img.getAttribute('width')).toBe('128');
    expect(img.getAttribute('height')).toBe('128');
    expect(img).toHaveClass('gitdata-avatar', 'custom-class');
  });
});
