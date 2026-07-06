import React from 'react';
import { Card } from '../ui/Card';
import { FaCodeBranch } from 'react-icons/fa';
import { dictionaries, type Language } from '../../locales/dictionaries';
import './styles/CodeFrequencyWidget.css';

interface ContributionDay {
  date: string;
  count: number;
}

interface CodeFrequencyWidgetProps {
  contributions: ContributionDay[];
  theme?: 'light' | 'dark';
  lang?: Language;
}

export const CodeFrequencyWidget: React.FC<CodeFrequencyWidgetProps> = ({ 
  contributions, 
  theme = 'dark', 
  lang = 'es' 
}) => {
  const t = dictionaries[lang];

  // Mostramos solo los últimos ~147 días (21 semanas) para que entre en el widget
  const visibleContributions = contributions.slice(-147);

  // Calcula el nivel de intensidad (0 a 4) basado en el número de commits
  const getIntensityLevel = (count: number) => {
    if (count === 0) return 0;
    if (count >= 1 && count <= 3) return 1;
    if (count >= 4 && count <= 6) return 2;
    if (count >= 7 && count <= 10) return 3;
    return 4;
  };

  return (
    <div className={`theme-${theme}`}>
      <Card className="widget-code-frequency">
        <div className="widget-frequency-header">
          <FaCodeBranch className="frequency-icon" />
          <h2>{t.codeFrequency}</h2>
        </div>

        <div className="frequency-heatmap">
          {visibleContributions.map((day, idx) => (
            <div 
              key={idx} 
              className={`heatmap-cell level-${getIntensityLevel(day.count)}`} 
              title={`${day.date}: ${day.count} commits`}
            />
          ))}
          
          {visibleContributions.length === 0 && (
            <p className="no-data">No hay datos de frecuencia disponibles.</p>
          )}
        </div>
      </Card>
    </div>
  );
};
