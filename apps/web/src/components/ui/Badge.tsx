import React from 'react';
import './styles/Badge.css';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', className = '' }) => {
  return (
    <span className={`gitdata-badge ${variant} ${className}`}>
      {children}
    </span>
  );
};
