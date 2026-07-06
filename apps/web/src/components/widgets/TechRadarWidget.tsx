import React from 'react';
import { Card } from '../ui/Card';
import { FaNetworkWired } from 'react-icons/fa';
import { dictionaries, type Language } from '../../locales/dictionaries';
import './styles/TechRadarWidget.css';

interface TechRadar {
  frontend: number;
  backend: number;
  devops: number;
}

interface TechRadarWidgetProps {
  techRadar: TechRadar;
  theme?: 'light' | 'dark';
  lang?: Language;
}

export const TechRadarWidget: React.FC<TechRadarWidgetProps> = ({ 
  techRadar, 
  theme = 'dark', 
  lang = 'es' 
}) => {
  const t = dictionaries[lang];
  const total = techRadar.frontend + techRadar.backend + techRadar.devops;
  
  const getPercent = (val: number) => total === 0 ? 0 : Math.round((val / total) * 100);
  const pFront = getPercent(techRadar.frontend);
  const pBack = getPercent(techRadar.backend);
  const pDev = getPercent(techRadar.devops);

  return (
    <div className={`theme-${theme}`}>
      <Card className="widget-tech-radar">
        <div className="widget-tech-radar-header">
          <FaNetworkWired className="tech-radar-icon" />
          <h2>{t.techRadar}</h2>
        </div>

        <div className="tech-radar-content">
          <div className="radar-bar-wrapper">
            <div className="radar-label">Frontend</div>
            <div className="radar-bar-bg">
              <div className="radar-bar-fill frontend-fill" style={{ width: `${pFront}%` }}></div>
            </div>
            <div className="radar-percent">{pFront}%</div>
          </div>

          <div className="radar-bar-wrapper">
            <div className="radar-label">Backend</div>
            <div className="radar-bar-bg">
              <div className="radar-bar-fill backend-fill" style={{ width: `${pBack}%` }}></div>
            </div>
            <div className="radar-percent">{pBack}%</div>
          </div>

          <div className="radar-bar-wrapper">
            <div className="radar-label">DevOps & Data</div>
            <div className="radar-bar-bg">
              <div className="radar-bar-fill devops-fill" style={{ width: `${pDev}%` }}></div>
            </div>
            <div className="radar-percent">{pDev}%</div>
          </div>
        </div>
      </Card>
    </div>
  );
};
