import React from 'react';
import { Card } from '../ui/Card';
import { FaGlobe, FaHistory, FaCodeBranch, FaStar, FaUserFriends } from 'react-icons/fa';
import { dictionaries, type Language } from '../../locales/dictionaries';
import './styles/GlobalStatsWidget.css';

interface ProfileStats {
  commits: number;
  prs: number;
  issues: number;
  stars: number;
}

interface GlobalStatsWidgetProps {
  stats: ProfileStats;
  followers: number;
  theme?: 'light' | 'dark';
  lang?: Language;
}

export const GlobalStatsWidget: React.FC<GlobalStatsWidgetProps> = ({ 
  stats, 
  followers,
  theme = 'dark', 
  lang = 'es' 
}) => {
  const t = dictionaries[lang];

  return (
    <div className={`theme-${theme}`}>
      <Card className="widget-global-stats">
        
        <div className="widget-global-stats-header">
          <FaGlobe style={{ fontSize: '1.5rem', color: '#10b981' }} />
          <h2>{t.globalStats}</h2>
        </div>

        <div className="global-stats-grid">
          
          <div className="kpi-card">
            <FaHistory className="kpi-icon" style={{ color: '#ec4899' }} />
            <h3 className="kpi-value">{stats.commits.toLocaleString(lang)}</h3>
            <p className="kpi-label">{t.commits}</p>
          </div>

          <div className="kpi-card">
            <FaStar className="kpi-icon" style={{ color: '#eab308' }} />
            <h3 className="kpi-value">{stats.stars.toLocaleString(lang)}</h3>
            <p className="kpi-label">{t.stars}</p>
          </div>

          <div className="kpi-card">
            <FaCodeBranch className="kpi-icon" style={{ color: '#3b82f6' }} />
            <h3 className="kpi-value">{stats.prs.toLocaleString(lang)}</h3>
            <p className="kpi-label">{t.prs}</p>
          </div>

          <div className="kpi-card">
            <FaUserFriends className="kpi-icon" style={{ color: '#8b5cf6' }} />
            <h3 className="kpi-value">{followers.toLocaleString(lang)}</h3>
            <p className="kpi-label">{t.followers}</p>
          </div>

        </div>

      </Card>
    </div>
  );
};
