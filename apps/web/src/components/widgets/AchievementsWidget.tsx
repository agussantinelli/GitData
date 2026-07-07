import React from 'react';
import { Card } from '../ui/Card';
import { FaTrophy } from 'react-icons/fa';
import { dictionaries, type Language } from '../../locales/dictionaries';
import './styles/AchievementsWidget.css';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface AchievementsWidgetProps {
  achievements: Achievement[];
  theme?: 'light' | 'dark';
  lang?: Language;
}

export const AchievementsWidget: React.FC<AchievementsWidgetProps> = ({ 
  achievements, 
  theme = 'dark', 
  lang = 'es' 
}) => {
  const t = dictionaries[lang];

  return (
    <div className={`theme-${theme}`}>
      <Card className="widget-achievements">
        <div className="widget-achievements-header">
          <FaTrophy className="achievements-icon" />
          <h2>{t.achievements}</h2>
        </div>

        <div className="achievements-grid">
          {achievements.length > 0 ? (
            achievements.map((ach) => {
              const achData = (t as any).achievementsData[ach.id];
              const title = achData ? achData.title : ach.title;
              const desc = achData ? achData.desc : ach.description;

              return (
                <div key={ach.id} className="achievement-item" title={desc}>
                  <div className="achievement-icon-wrapper">
                    <span className="achievement-emoji">{ach.icon}</span>
                  </div>
                  <div className="achievement-info">
                    <span className="achievement-title">{title}</span>
                    <span className="achievement-desc">{desc}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="no-data">Aún no hay logros desbloqueados.</p>
          )}
        </div>
      </Card>
    </div>
  );
};
