import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { FaFire, FaStar, FaCodeBranch, FaArchive, FaClock } from 'react-icons/fa';
import { dictionaries, type Language } from '../../locales/dictionaries';
import './styles/PopularProjectsWidget.css';

interface Project {
  name: string;
  description: string | null;
  stars: number;
  forks: number;
  url: string;
  primaryLanguage: string | null;
  sizeKb: number;
  updatedAt: string;
}

interface PopularProjectsWidgetProps {
  projects: Project[];
  theme?: 'light' | 'dark';
  lang?: Language;
}

export const PopularProjectsWidget: React.FC<PopularProjectsWidgetProps> = ({ 
  projects, 
  theme = 'dark', 
  lang = 'es' 
}) => {
  const t = dictionaries[lang];
  const topProjects = projects.slice(0, 5);

  const formatSize = (kb: number) => {
    if (kb > 1024) return `${(kb / 1024).toFixed(1)} MB`;
    return `${kb} KB`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(lang, { month: 'short', year: 'numeric' }).format(date);
  };

  return (
    <div className={`theme-${theme}`}>
      <Card className="widget-projects">
        <div className="widget-projects-header">
          <FaFire style={{ fontSize: '1.5rem', color: '#ff5e00' }} />
          <h2>{t.popularProjects}</h2>
        </div>

        <div className="projects-list">
          {topProjects.map((repo) => (
            <div key={repo.name} className="project-item">
              <div className="project-title-row">
                <h3 className="project-name">{repo.name}</h3>
                {repo.primaryLanguage && (
                  <Badge variant="outline">{repo.primaryLanguage}</Badge>
                )}
              </div>
              
              <p className="project-description">
                {repo.description || 'No description provided.'}
              </p>

              <div className="project-footer">
                <span className="project-stat">
                  <FaStar className="project-stat-icon" />
                  {repo.stars}
                </span>
                <span className="project-stat">
                  <FaCodeBranch className="project-stat-icon" />
                  {repo.forks}
                </span>
                <span className="project-stat">
                  <FaArchive className="project-stat-icon" />
                  {formatSize(repo.sizeKb)}
                </span>
                <span className="project-stat">
                  <FaClock className="project-stat-icon" />
                  {t.updated} {formatDate(repo.updatedAt)}
                </span>
                <a href={repo.url} target="_blank" rel="noopener noreferrer" className="project-link">
                  {t.viewCode} ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
