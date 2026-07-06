import React from 'react';
import { Card } from '../ui/Card';
import { FaClock } from 'react-icons/fa';
import { dictionaries, type Language } from '../../locales/dictionaries';
import './styles/TimeOfDayWidget.css';

interface TimeOfDay {
  morning: number;
  afternoon: number;
  night: number;
}

interface TimeOfDayWidgetProps {
  timeOfDay: TimeOfDay;
  theme?: 'light' | 'dark';
  lang?: Language;
}

export const TimeOfDayWidget: React.FC<TimeOfDayWidgetProps> = ({ 
  timeOfDay, 
  theme = 'dark', 
  lang = 'es' 
}) => {
  const t = dictionaries[lang];
  const total = timeOfDay.morning + timeOfDay.afternoon + timeOfDay.night;

  const getPercent = (val: number) => {
    return total === 0 ? 0 : Math.round((val / total) * 100);
  };

  const pMorning = getPercent(timeOfDay.morning);
  const pAfternoon = getPercent(timeOfDay.afternoon);
  const pNight = getPercent(timeOfDay.night);

  return (
    <div className={`theme-${theme}`}>
      <Card className="widget-timeofday">
        <div className="widget-timeofday-header">
          <FaClock className="timeofday-icon" />
          <h2>{t.timeOfDay}</h2>
        </div>

        <div className="timeofday-content">
          <div className="time-bar-container">
            <div className="time-bar morning" style={{ height: `${pMorning}%` }}>
              <span className="time-percent">{pMorning}%</span>
            </div>
            <div className="time-label">🌅 6-12h</div>
          </div>
          
          <div className="time-bar-container">
            <div className="time-bar afternoon" style={{ height: `${pAfternoon}%` }}>
              <span className="time-percent">{pAfternoon}%</span>
            </div>
            <div className="time-label">☀️ 12-20h</div>
          </div>
          
          <div className="time-bar-container">
            <div className="time-bar night" style={{ height: `${pNight}%` }}>
              <span className="time-percent">{pNight}%</span>
            </div>
            <div className="time-label">🦉 20-6h</div>
          </div>
        </div>
      </Card>
    </div>
  );
};
