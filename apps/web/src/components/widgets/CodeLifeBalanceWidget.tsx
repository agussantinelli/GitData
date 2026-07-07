import React from 'react';
import { Card } from '../ui/Card';
import { FaBalanceScale } from 'react-icons/fa';
import { dictionaries, type Language } from '../../locales/dictionaries';
import './styles/CodeLifeBalanceWidget.css';

interface CodeLifeBalance {
  weekdays: number;
  weekends: number;
}

interface CodeLifeBalanceWidgetProps {
  balance: CodeLifeBalance;
  theme?: 'light' | 'dark';
  lang?: Language;
}

export const CodeLifeBalanceWidget: React.FC<CodeLifeBalanceWidgetProps> = ({ 
  balance, 
  theme = 'dark', 
  lang = 'es' 
}) => {
  const t = dictionaries[lang];
  const total = balance.weekdays + balance.weekends;
  const weekdaysPerc = total > 0 ? Math.round((balance.weekdays / total) * 100) : 0;
  const weekendsPerc = total > 0 ? Math.round((balance.weekends / total) * 100) : 0;

  return (
    <div className={`theme-${theme}`}>
      <Card className="widget-codelife">
        <div className="widget-codelife-header">
          <FaBalanceScale className="codelife-icon" />
          <div className="codelife-title-area">
            <h2>{t.codeLifeBalance}</h2>
            <span className="codelife-desc">{t.codeLifeDesc}</span>
          </div>
        </div>

        <div className="codelife-content">
          <div className="codelife-stat">
            <span className="codelife-label">{t.weekdays}</span>
            <span className="codelife-value">{weekdaysPerc}%</span>
          </div>
          
          <div className="codelife-bar-container">
            <div className="codelife-bar weekdays-bar" style={{ width: `${weekdaysPerc}%` }}></div>
            <div className="codelife-bar weekends-bar" style={{ width: `${weekendsPerc}%` }}></div>
          </div>
          
          <div className="codelife-stat">
            <span className="codelife-label">{t.weekends}</span>
            <span className="codelife-value">{weekendsPerc}%</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
