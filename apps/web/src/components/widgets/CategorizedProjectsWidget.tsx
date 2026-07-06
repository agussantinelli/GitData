import React, { useMemo } from 'react';
import { Card } from '../ui/Card';
import { FaStar, FaClock, FaHistory, FaFolderOpen } from 'react-icons/fa';
import { dictionaries, type Language } from '../../locales/dictionaries';
import './styles/CategorizedProjectsWidget.css';

interface Project {
  name: string;
  description: string | null;
  stars: number;
  forks: number;
  url: string;
  primaryLanguage: string | null;
  sizeKb: number;
  updatedAt: string;
  totalCommits: number;
}

interface CategorizedProjectsWidgetProps {
  projects: Project[];
  theme?: 'light' | 'dark';
  lang?: Language;
}

export const CategorizedProjectsWidget: React.FC<CategorizedProjectsWidgetProps> = ({ 
  projects, 
  theme = 'dark', 
  lang = 'es' 
}) => {
  const t = dictionaries[lang];

  // Logic to categorize projects
  const { topStars, recentUpdates, mostCommits } = useMemo(() => {
    // Top 3 by Stars (Assuming the API already sorted them by stars, but we sort again just to be safe)
    const byStars = [...projects].sort((a, b) => b.stars - a.stars).slice(0, 3);
    
    // Top 3 by Recently Updated
    const byDate = [...projects].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 3);
    
    // Top 3 by Commits
    const byCommits = [...projects].sort((a, b) => b.totalCommits - a.totalCommits).slice(0, 3);

    return { topStars: byStars, recentUpdates: byDate, mostCommits: byCommits };
  }, [projects]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  };

  const renderProjectItem = (repo: Project, highlight: 'stars' | 'date' | 'commits') => (
    <a key={`${highlight}-${repo.name}`} href={repo.url} target="_blank" rel="noopener noreferrer" className="category-item">
      <div className="category-item-main">
        <h4 className="category-item-name">{repo.name}</h4>
        <span className="category-item-meta">{repo.primaryLanguage || 'Unknown'}</span>
        <div className="category-item-stat">
          {highlight === 'stars' && <><FaStar style={{color: '#eab308'}} /> {repo.stars}</>}
          {highlight === 'date' && <><FaClock style={{color: '#3b82f6'}} /> {formatDate(repo.updatedAt)}</>}
          {highlight === 'commits' && <><FaHistory style={{color: '#10b981'}} /> {repo.totalCommits}</>}
        </div>
      </div>
    </a>
  );

  return (
    <div className={`theme-${theme}`}>
      <Card className="widget-categories-card">
        
        <div className="widget-categories-header">
          <FaFolderOpen style={{ fontSize: '1.5rem', color: '#8b5cf6' }} />
          <h2>{t.projectOverview}</h2>
        </div>

        <div className="widget-categories-grid">
          {/* Top Stars Section */}
          <section className="category-section">
            <h3 className="category-title"><FaStar style={{color: '#eab308'}} /> {t.topStars}</h3>
            <div className="category-list">
              {topStars.map(repo => renderProjectItem(repo, 'stars'))}
            </div>
          </section>

          {/* Recently Updated Section */}
          <section className="category-section">
            <h3 className="category-title"><FaClock style={{color: '#3b82f6'}} /> {t.recentlyUpdated}</h3>
            <div className="category-list">
              {recentUpdates.map(repo => renderProjectItem(repo, 'date'))}
            </div>
          </section>

          {/* Most Commits Section */}
          <section className="category-section">
            <h3 className="category-title"><FaHistory style={{color: '#10b981'}} /> {t.mostCommits}</h3>
            <div className="category-list">
              {mostCommits.map(repo => renderProjectItem(repo, 'commits'))}
            </div>
          </section>
        </div>

      </Card>
    </div>
  );
};
