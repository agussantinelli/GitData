import { renderCardWrapper } from './CardWrapper';
import { icons } from './icons';
import { type SVGTheme } from './themes';
import { dictionaries, type Language } from './locales';

export interface Project {
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

export interface PopularProjectsSVGProps {
  projects: Project[];
  theme: SVGTheme;
  lang: Language;
}

export const renderPopularProjectsSVG = ({ projects, theme, lang }: PopularProjectsSVGProps): string => {
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

  const width = 850;
  let currentY = 0;

  const headerSvg = `
    <!-- Header -->
    <g transform="translate(0, ${currentY})">
      <svg x="0" y="0" width="24" height="24" viewBox="${icons.fire.viewBox}" fill="#ff5e00">
        ${icons.fire.path}
      </svg>
      <text x="36" y="18" class="header-title">${t.popularProjects}</text>
      
      <!-- Divider -->
      <line x1="0" y1="40" x2="${width - 48}" y2="40" stroke="${theme.glassBorder}" stroke-width="1" />
    </g>
  `;
  currentY += 64; // header height + gap

  const listItems = topProjects.map((repo) => {
    const itemWidth = width - 48; // padding left and right is 24
    const itemHeight = 90; 
    
    // Create language badge if exists
    let badgeSvg = '';
    if (repo.primaryLanguage) {
      badgeSvg = `
        <rect x="${itemWidth - 100}" y="20" width="80" height="24" rx="12" fill="transparent" stroke="${theme.glassBorder}" stroke-width="1" />
        <text x="${itemWidth - 60}" y="36" font-size="12px" fill="${theme.textMutedColor}" text-anchor="middle">${repo.primaryLanguage}</text>
      `;
    }

    // Stats row
    const statsY = 64;
    const statItem = (x: number, iconObj: { viewBox: string, path: string }, text: string) => `
      <g transform="translate(${x}, ${statsY})">
        <svg x="0" y="-12" width="14" height="14" viewBox="${iconObj.viewBox}" fill="${theme.iconColor}">
          ${iconObj.path}
        </svg>
        <text x="20" y="0" font-size="12px" fill="${theme.textMutedColor}">${text}</text>
      </g>
    `;

    const statsRow = `
      ${statItem(20, icons.star, repo.stars.toString())}
      ${statItem(90, icons.branch, repo.forks.toString())}
      ${statItem(160, icons.history, repo.totalCommits.toString())}
      ${statItem(230, icons.archive, formatSize(repo.sizeKb))}
      ${statItem(320, icons.clock, `${t.updated} ${formatDate(repo.updatedAt)}`)}
    `;
    
    const svg = `
      <g transform="translate(0, ${currentY})">
        <!-- Item Background -->
        <rect width="${itemWidth}" height="${itemHeight}" rx="12" fill="${theme.glassBg}" stroke="${theme.glassBorder}" stroke-width="1" />
        
        <!-- Project Name -->
        <text x="20" y="36" font-size="18px" font-weight="600" fill="${theme.textColor}">${repo.name}</text>
        
        ${badgeSvg}
        ${statsRow}
      </g>
    `;
    currentY += itemHeight + 16;
    return svg;
  }).join('');

  const emptyState = topProjects.length === 0 ? `
    <text x="${(width - 48) / 2}" y="${currentY + 30}" font-size="16px" fill="${theme.textMutedColor}" text-anchor="middle">
      ${t.noProjects}
    </text>
  ` : '';
  
  if (topProjects.length === 0) currentY += 60;

  const innerSvg = `
    ${headerSvg}
    ${listItems}
    ${emptyState}
  `;

  const totalHeight = 24 + (currentY > 64 ? currentY - 16 : currentY) + 24;

  return renderCardWrapper({
    width,
    height: totalHeight,
    theme,
    children: innerSvg
  });
};
