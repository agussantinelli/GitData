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
      <div className="loading-overlay">
        <div className="loading-error-inner">
          <div className="loading-error-icon">⚠️</div>
          <div className="loading-error-text">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="loading-overlay">
      <div className="loading-inner">
        <div className="spinner"></div>
        <div className="loading-message">{message}</div>
      </div>
    </div>
  );
};
