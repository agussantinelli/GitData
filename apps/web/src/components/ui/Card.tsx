import React from 'react';
import './Card.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      className={`glass-panel gitdata-card ${onClick ? 'gitdata-card-interactive' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
