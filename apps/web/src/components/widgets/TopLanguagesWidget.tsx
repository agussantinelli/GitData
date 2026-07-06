import React from 'react';
import { Card } from '../ui/Card';
import { FaCode } from 'react-icons/fa';
import { dictionaries, type Language } from '../../locales/dictionaries';
import './styles/TopLanguagesWidget.css';

interface TopLanguagesWidgetProps {
  languages: { name: string; percentage: number }[];
  theme?: 'light' | 'dark';
  lang?: Language;
}

export const TopLanguagesWidget: React.FC<TopLanguagesWidgetProps> = ({ 
  languages, 
  theme = 'dark', 
  lang = 'es' 
}) => {
  const t = dictionaries[lang];

  // We only care about the top 5
  const top5 = languages.slice(0, 5);

  // Determine colors based on rank
  const getRankColor = (index: number) => {
    const colors = ['#eab308', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6'];
    return colors[index] || '#a0a0a0';
  };



  return (
    <div className={`theme-${theme}`}>
      <Card className="widget-top-languages">
        
        <div className="widget-languages-header">
          <FaCode style={{ fontSize: '1.5rem', color: '#ec4899' }} />
          <h2>{t.topLanguages}</h2>
        </div>

        <div className="languages-list">
          {top5.map((language, idx) => (
            <div key={language.name} className="language-item">
              <div className="language-rank">{idx + 1}</div>
              <div className="language-info">
                <div className="language-name-row">
                  <FaCode className="language-icon" style={{ color: getRankColor(idx) }} />
                  <h3 className="language-name">{language.name}</h3>
                  <span style={{ marginLeft: 'auto', fontWeight: 'bold', color: 'var(--text-color)' }}>
                    {language.percentage}%
                  </span>
                </div>
                <div className="language-progress-track">
                  <div 
                    className="language-progress-bar" 
                    style={{ 
                      width: `${language.percentage}%`,
                      backgroundColor: getRankColor(idx)
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
          
          {top5.length === 0 && (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', margin: '2rem 0' }}>
              No language data available.
            </p>
          )}
        </div>

      </Card>
    </div>
  );
};
