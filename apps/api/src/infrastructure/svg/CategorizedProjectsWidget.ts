import { renderCardWrapper } from './CardWrapper';
import { icons } from './icons';
import { type SVGTheme } from './themes';
import { dictionaries, type Language } from './locales';
import type { Project } from './PopularProjectsWidget';

export interface CategorizedProjectsSVGProps {
  projects: Project[];
  theme: SVGTheme;
  lang: Language;
}

export const renderCategorizedProjectsSVG = ({ projects, theme, lang }: CategorizedProjectsSVGProps): string => {
  const t = dictionaries[lang] as any;

  // Sorting Logic
  const topStars = [...projects].sort((a, b) => b.stars - a.stars).slice(0, 3);
  const recentUpdates = [...projects].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 3);
  const mostCommits = [...projects].sort((a, b) => b.totalCommits - a.totalCommits).slice(0, 3);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  };

  const width = 850;
  let currentY = 0;

  const headerSvg = `
    <!-- Header -->
    <g transform="translate(0, ${currentY})">
      <svg x="0" y="-4" width="24" height="24" viewBox="${icons.folderOpen.viewBox}" fill="#8b5cf6">
        ${icons.folderOpen.path}
      </svg>
      <text x="36" y="16" font-size="20px" font-weight="700" fill="${theme.titleColor}">${t.projectOverview}</text>
      <!-- Divider -->
      <line x1="0" y1="40" x2="${width - 48}" y2="40" stroke="${theme.glassBorder}" stroke-width="1" />
    </g>
  `;
  currentY += 80;

  // Three columns
  const colWidth = (width - 48 - 40) / 3; // 40px gap total (20px each)
  
  const renderItem = (repo: Project, highlight: 'stars' | 'date' | 'commits', yPos: number) => {
    const maxNameLen = 18;
    const displayName = repo.name.length > maxNameLen ? repo.name.substring(0, maxNameLen) + '...' : repo.name;
    const langLabel = repo.primaryLanguage || t.unknown;
    
    let iconSvg = '';
    let statText = '';
    
    if (highlight === 'stars') {
      iconSvg = `<svg x="0" y="-12" width="14" height="14" viewBox="${icons.star.viewBox}" fill="#eab308">${icons.star.path}</svg>`;
      statText = repo.stars.toString();
    } else if (highlight === 'date') {
      iconSvg = `<svg x="0" y="-12" width="14" height="14" viewBox="${icons.clock.viewBox}" fill="#3b82f6">${icons.clock.path}</svg>`;
      statText = formatDate(repo.updatedAt);
    } else {
      iconSvg = `<svg x="0" y="-12" width="14" height="14" viewBox="${icons.history.viewBox}" fill="#10b981">${icons.history.path}</svg>`;
      statText = repo.totalCommits.toString();
    }

    return `
      <g transform="translate(0, ${yPos})">
        <rect x="0" y="0" width="${colWidth}" height="80" rx="8" fill="${theme.glassBorder}" />
        
        <text x="16" y="24" font-size="14px" font-weight="700" fill="${theme.titleColor}">${displayName}</text>
        <text x="16" y="44" font-size="12px" fill="${theme.textMutedColor}">${langLabel}</text>
        
        <g transform="translate(16, 64)">
          ${iconSvg}
          <text x="20" y="0" font-size="12px" font-weight="600" fill="${theme.textColor}">${statText}</text>
        </g>
      </g>
    `;
  };

  const renderSection = (title: string, iconObj: any, iconColor: string, repos: Project[], highlight: 'stars' | 'date' | 'commits', xOffset: number) => {
    let itemsSvg = repos.map((repo, idx) => renderItem(repo, highlight, 40 + (idx * 96))).join('');
    
    return `
      <g transform="translate(${xOffset}, 0)">
        <svg x="0" y="-14" width="16" height="16" viewBox="${iconObj.viewBox}" fill="${iconColor}">
          ${iconObj.path}
        </svg>
        <text x="24" y="0" font-size="16px" font-weight="700" fill="${theme.titleColor}">${title}</text>
        ${itemsSvg}
      </g>
    `;
  };

  const sectionsSvg = `
    <g transform="translate(0, ${currentY})">
      ${renderSection(t.topStars, icons.star, '#eab308', topStars, 'stars', 0)}
      ${renderSection(t.recentlyUpdated, icons.clock, '#3b82f6', recentUpdates, 'date', colWidth + 20)}
      ${renderSection(t.mostCommits, icons.history, '#10b981', mostCommits, 'commits', (colWidth * 2) + 40)}
    </g>
  `;
  
  // Title (40) + 3 items (80 + 16 gap = 96) * 3 = 288 + 40 = 328
  currentY += 328;

  const innerSvg = `
    ${headerSvg}
    ${sectionsSvg}
  `;

  const totalHeight = 24 + currentY + 24;

  return renderCardWrapper({
    width,
    height: totalHeight,
    theme,
    children: innerSvg
  });
};
