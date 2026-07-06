import React from 'react';
import { Card } from '../ui/Card';
import { FaClock } from 'react-icons/fa';
import { dictionaries, type Language } from '../../locales/dictionaries';
import './styles/HourlyFrequencyWidget.css';

interface HourlyFrequencyWidgetProps {
  hourlyFrequency: number[];
  theme?: 'light' | 'dark';
  lang?: Language;
}

export const HourlyFrequencyWidget: React.FC<HourlyFrequencyWidgetProps> = ({ 
  hourlyFrequency, 
  theme = 'dark', 
  lang = 'es' 
}) => {
  const t = dictionaries[lang];
  // Calculate max to scale the bars properly
  const maxCommits = Math.max(...hourlyFrequency, 1); // Avoid division by 0

  return (
    <div className={`theme-${theme}`}>
      <Card className="widget-hourly">
        <div className="widget-hourly-header">
          <FaClock className="hourly-icon" />
          <h2>{t.hourlyActivity}</h2>
        </div>

        <div className="hourly-chart-container">
          <div className="hourly-chart">
            {hourlyFrequency.map((count, hour) => {
              const heightPercent = (count / maxCommits) * 100;
              // Generate a label like "00", "01", ... "23"
              const label = hour.toString().padStart(2, '0');
              
              return (
                <div key={hour} className="hourly-bar-wrapper" title={`${label}:00 - ${count} events`}>
                  <div className="hourly-bar-bg">
                    <div 
                      className="hourly-bar-fill" 
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="hourly-label">{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
};
