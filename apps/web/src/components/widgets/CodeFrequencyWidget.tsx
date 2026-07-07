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

  // Calcular estadísticas de rachas
  let currentStreak = 0;
  let maxStreak = 0;
  let totalPeriod = 0;
  let tempStreak = 0;

  visibleContributions.forEach(day => {
    totalPeriod += day.count;
    if (day.count > 0) {
      tempStreak++;
      if (tempStreak > maxStreak) {
        maxStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  });
  currentStreak = tempStreak;

  return (
    <div className={`theme-${theme}`}>
      <Card className="widget-code-frequency">
        <div className="widget-frequency-header">
          <FaCodeBranch className="frequency-icon" />
          <div className="frequency-title-area">
            <h2>{t.codeFrequency}</h2>
            <p className="frequency-desc">{t.codeFreqDesc}</p>
          </div>
        </div>

        <div className="frequency-stats">
          <div className="frequency-stat-item">
            <span className="frequency-stat-value gradient-text">{totalPeriod}</span>
            <span className="frequency-stat-label">{t.totalPeriod}</span>
          </div>
          <div className="frequency-stat-item">
            <span className="frequency-stat-value">{currentStreak}</span>
            <span className="frequency-stat-label">{t.currentStreak}</span>
          </div>
          <div className="frequency-stat-item">
            <span className="frequency-stat-value">{maxStreak}</span>
            <span className="frequency-stat-label">{t.longestStreak}</span>
          </div>
        </div>

        <div className="frequency-heatmap-container">
          <div className="frequency-heatmap">
            {visibleContributions.map((day, idx) => (
              <div 
                key={idx} 
                className={`heatmap-cell level-${getIntensityLevel(day.count)}`} 
                title={`${day.date}: ${day.count} commits`}
              />
            ))}
            
            {visibleContributions.length === 0 && (
              <p className="no-data">{t.noFreqData}</p>
            )}
          </div>
          
          {visibleContributions.length > 0 && (
            <div className="heatmap-legend">
              <span className="legend-text">{t.less}</span>
              <div className="legend-cells">
                <div className="heatmap-cell level-0" />
                <div className="heatmap-cell level-1" />
                <div className="heatmap-cell level-2" />
                <div className="heatmap-cell level-3" />
                <div className="heatmap-cell level-4" />
              </div>
              <span className="legend-text">{t.more}</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
