import React from 'react';
import { Card } from '../ui/Card';
import { FaFlagCheckered } from 'react-icons/fa';
import { dictionaries, type Language } from '../../locales/dictionaries';
import './styles/MilestonesWidget.css';

interface Milestone {
  id: string;
  date: string;
  title: string;
  description: string;
  meta?: any;
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
            milestones.map((ms, idx) => {
              const title = ms.title;
              let desc = ms.description;

              if (ms.meta) {
                if (ms.meta.repo) desc = desc.replace('{repo}', ms.meta.repo);
                if (ms.meta.stars) desc = desc.replace('{stars}', ms.meta.stars.toString());
                if (ms.meta.size) desc = desc.replace('{size}', ms.meta.size.toString());
              }

              return (
                <div key={idx} className="milestone-item">
                  <div className="milestone-year-bubble">{getYear(ms.date)}</div>
                  <div className="milestone-content">
                    <h4 className="milestone-title">{title}</h4>
                    <p className="milestone-desc">{desc}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="no-data">{t.noMilestones}</p>
          )}
        </div>
      </Card>
    </div>
  );
};
