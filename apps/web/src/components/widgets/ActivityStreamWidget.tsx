import React from 'react';
import { Card } from '../ui/Card';
import { FaHistory } from 'react-icons/fa';
import { dictionaries, type Language } from '../../locales/dictionaries';
import './styles/ActivityStreamWidget.css';

interface ActivityEvent {
  id: string;
  type: string;
  repo: string;
  date: string;
  description: string;
}

interface ActivityStreamWidgetProps {
  activityStream: ActivityEvent[];
  theme?: 'light' | 'dark';
  lang?: Language;
}

export const ActivityStreamWidget: React.FC<ActivityStreamWidgetProps> = ({ 
  activityStream, 
  theme = 'dark', 
  lang = 'es' 
}) => {
  const t = dictionaries[lang];

  // Helper to format date relative or just simple
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`theme-${theme}`}>
      <Card className="widget-activity-stream">
        <div className="widget-activity-header">
          <FaHistory className="activity-icon" />
          <h2>{t.activityStream}</h2>
        </div>

        <div className="activity-list">
          {activityStream.length > 0 ? (
            activityStream.map((event, index) => (
              <div key={index} className="activity-item">
                <div className="activity-dot"></div>
                <div className="activity-content">
                  <p className="activity-desc">
                    <span className="activity-type">{event.description}</span> on <span className="activity-repo">{event.repo}</span>
                  </p>
                  <span className="activity-date">{formatDate(event.date)}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="no-data">{t.noActivity}</p>
          )}
        </div>
      </Card>
    </div>
  );
};
