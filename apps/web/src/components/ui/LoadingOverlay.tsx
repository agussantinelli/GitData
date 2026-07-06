import React from 'react';
import './styles/LoadingOverlay.css';

interface LoadingOverlayProps {
  message?: string;
  error?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  message = 'Cargando...', 
  error 
}) => {
  if (error) {
    return (
      <div className="loading-overlay" style={{background: 'rgba(50, 0, 0, 0.9)'}}>
        <div className="loading-error-icon">⚠️</div>
        <div className="loading-error-text">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
      <div>{message}</div>
    </div>
  );
};
