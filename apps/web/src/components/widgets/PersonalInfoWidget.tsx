import React from 'react';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { dictionaries, type Language } from '../../locales/dictionaries';
import './styles/PersonalInfoWidget.css';

interface ProfileData {
  name: string;
  username: string;
  bio: string;
  location: string;
  followers: number;
  createdAt: string;
  stats: {
    commits: number;
    prs: number;
    issues: number;
    stars: number;
  };
  topLanguages: { name: string; percentage: number }[];
}

interface PersonalInfoWidgetProps {
  data: ProfileData;
  theme?: 'light' | 'dark';
  lang?: Language;
}

export const PersonalInfoWidget: React.FC<PersonalInfoWidgetProps> = ({ 
  data, 
  theme = 'dark', 
  lang = 'es' 
}) => {
  const t = dictionaries[lang];
  const yearsExp = new Date().getFullYear() - new Date(data.createdAt).getFullYear();

  return (
    <div className={`theme-${theme}`}>
      <Card className="widget-personal">
        <div className="widget-header">
          <Avatar src={`https://github.com/${data.username}.png`} alt={data.name} size={80} />
          <div className="widget-titles">
            <h2>{data.name}</h2>
            <p>
              <span className="gradient-text">@{data.username}</span> • {data.location} • {yearsExp} {t.yearsExp}
            </p>
          </div>
        </div>

        <p className="widget-bio">{data.bio}</p>

        <div className="widget-skills">
          {data.topLanguages.map((lang, idx) => (
            <Badge key={idx} variant="secondary">{lang.name}</Badge>
          ))}
        </div>

        <div className="widget-stats">
          <div className="stat-item">
            <span className="stat-value gradient-text">{data.stats.commits}</span>
            <span className="stat-label">{t.commits}</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{data.stats.stars}</span>
            <span className="stat-label">{t.stars}</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{data.stats.prs}</span>
            <span className="stat-label">{t.prs}</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{data.followers}</span>
            <span className="stat-label">{t.followers}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
