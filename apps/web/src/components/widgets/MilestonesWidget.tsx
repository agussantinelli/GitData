import React from 'react';
import { Card } from '../ui/Card';
import { FaFlagCheckered } from 'react-icons/fa';
import { dictionaries, type Language } from '../../locales/dictionaries';
import './styles/MilestonesWidget.css';

interface Milestone {
  date: string;
  title: string;
  description: string;
}

interface MilestonesWidgetProps {
  milestones: Milestone[];
  theme?: 'light' | 'dark';
  lang?: Language;
}

export const MilestonesWidget: React.FC<MilestonesWidgetProps> = ({ 
  milestones, 
  theme = 'dark', 
  lang = 'es' 
}) => {
  const t = dictionaries[lang];

  const getYear = (dateStr: string) => {
    return new Date(dateStr).getFullYear();
  };

  return (
    <div className={`theme-${theme}`}>
      <Card className="widget-milestones">
        <div className="widget-milestones-header">
          <FaFlagCheckered className="milestones-icon" />
          <h2>{t.milestones}</h2>
        </div>

        <div className="milestones-timeline">
          {milestones.length > 0 ? (
            milestones.map((ms, idx) => (
              <div key={idx} className="milestone-item">
                <div className="milestone-year-bubble">{getYear(ms.date)}</div>
                <div className="milestone-content">
                  <h4 className="milestone-title">{ms.title}</h4>
                  <p className="milestone-desc">{ms.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-data">No hay hitos disponibles.</p>
          )}
        </div>
      </Card>
    </div>
  );
};
