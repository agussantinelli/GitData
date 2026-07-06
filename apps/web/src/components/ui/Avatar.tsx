import React from 'react';
import './Avatar.css';

interface AvatarProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 64, className = '' }) => {
  return (
    <img 
      src={src} 
      alt={alt} 
      width={size} 
      height={size} 
      className={`gitdata-avatar ${className}`} 
    />
  );
};
