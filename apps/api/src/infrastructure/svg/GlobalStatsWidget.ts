import { SVGTheme } from './themes';
import { renderCardWrapper } from './CardWrapper';
import { icons } from './icons';
import { dictionaries, type Language } from './locales';

interface ProfileStats {
  commits: number;
  prs: number;
  issues: number;
  stars: number;
}

interface GlobalStatsSVGProps {
  stats: ProfileStats;
  followers: number;
  theme: SVGTheme;
  lang: Language;
}

export const renderGlobalStatsSVG = ({ stats, followers, theme, lang }: GlobalStatsSVGProps): string => {
  const t = dictionaries[lang];
  const formatNumber = (num: number) => num.toLocaleString(lang);

  // Exact sizes to match React component (4 columns)
  const cardWidth = 188;
  const cardHeight = 120;
  
  // KPI Card Template
  const kpiCard = (x: number, y: number, iconObj: { viewBox: string, path: string }, color: string, value: string, label: string) => `
    <g transform="translate(${x}, ${y})">
      <rect width="${cardWidth}" height="${cardHeight}" rx="12" fill="${theme.glassBg}" stroke="${theme.glassBorder}" stroke-width="1" />
      <g transform="translate(${cardWidth / 2}, 30)">
        <svg x="-14" y="-14" width="28" height="28" viewBox="${iconObj.viewBox}" fill="${color}">
          ${iconObj.path}
        </svg>
      </g>
      <text x="${cardWidth / 2}" y="76" class="kpi-value" text-anchor="middle">${value}</text>
      <text x="${cardWidth / 2}" y="100" class="kpi-label" text-anchor="middle">${label}</text>
    </g>
  `;

  const innerSvg = `
    <!-- Header -->
    <g transform="translate(0, 0)">
      <svg x="0" y="0" width="28" height="28" viewBox="${icons.globe.viewBox}" fill="#10b981">
        ${icons.globe.path}
      </svg>
      <text x="40" y="22" class="header-title">${t.globalStats}</text>
      
      <!-- Divider -->
      <line x1="0" y1="44" x2="800" y2="44" stroke="${theme.glassBorder}" stroke-width="1" />
    </g>

    <!-- Grid (4 columns in 1 row) -->
    <!-- Card 1 -->
    ${kpiCard(0, 68, icons.history, '#ec4899', formatNumber(stats.commits), t.commits)}
    <!-- Card 2 -->
    ${kpiCard(204, 68, icons.star, '#eab308', formatNumber(stats.stars), t.stars)}
    <!-- Card 3 -->
    ${kpiCard(408, 68, icons.branch, '#3b82f6', formatNumber(stats.prs), t.prs)}
    <!-- Card 4 -->
    ${kpiCard(612, 68, icons.users, '#8b5cf6', formatNumber(followers), t.followers)}
  `;

  return renderCardWrapper({
    width: 848,  // 24 + (4 * 188) + (3 * 16) + 24
    height: 236, // 24 + 44 (header) + 24 (gap) + 120 (card) + 24
    theme,
    children: innerSvg
  });
};
