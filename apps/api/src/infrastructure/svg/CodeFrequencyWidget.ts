import { renderCardWrapper } from './CardWrapper';
import { icons } from './icons';
import { type SVGTheme } from './themes';
import { dictionaries, type Language } from './locales';
import type { ContributionDay } from '../../domain/entities/Profile';

export interface CodeFrequencySVGProps {
  contributions: ContributionDay[];
  theme: SVGTheme;
  lang: Language;
}

export const renderCodeFrequencySVG = ({ contributions, theme, lang }: CodeFrequencySVGProps): string => {
  const t = dictionaries[lang] as any;

  const visibleContributions = contributions.slice(-147);

  const getIntensityLevel = (count: number) => {
    if (count === 0) return 0;
    if (count >= 1 && count <= 3) return 1;
    if (count >= 4 && count <= 6) return 2;
    if (count >= 7 && count <= 10) return 3;
    return 4;
  };

  const getCellColor = (level: number, isLight: boolean) => {
    if (isLight) {
      if (level === 0) return 'rgba(0, 0, 0, 0.04)';
      if (level === 1) return '#c4b5fd';
      if (level === 2) return '#8b5cf6';
      if (level === 3) return '#6d28d9';
      return '#0d9488';
    } else {
      if (level === 0) return 'rgba(255, 255, 255, 0.03)';
      if (level === 1) return '#312e81';
      if (level === 2) return '#5b21b6';
      if (level === 3) return '#8b5cf6';
      return '#2dd4bf';
    }
  };

  let currentStreak = 0;
  let maxStreak = 0;
  let totalPeriod = 0;
  let tempStreak = 0;

  visibleContributions.forEach(day => {
    totalPeriod += day.count;
    if (day.count > 0) {
      tempStreak++;
      if (tempStreak > maxStreak) {
        maxStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  });
  currentStreak = tempStreak;

  const width = 850;
  let currentY = 0;
  const isLight = theme.glassBorder === 'rgba(0, 0, 0, 0.1)';

  const headerSvg = `
    <g transform="translate(0, ${currentY})">
      <defs>
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#8b5cf6" />
          <stop offset="100%" stop-color="#3b82f6" />
        </linearGradient>
      </defs>
      <svg x="0" y="-4" width="24" height="24" viewBox="${icons.branch.viewBox}" fill="${theme.primaryColor}">
        ${icons.branch.path}
      </svg>
      <text x="36" y="16" font-size="20px" font-weight="700" fill="${theme.titleColor}">${t.codeFrequency}</text>
      <text x="36" y="36" font-size="12px" fill="${theme.textMutedColor}">${t.codeFreqDesc}</text>
      <line x1="0" y1="56" x2="${width - 48}" y2="56" stroke="${theme.glassBorder}" stroke-width="1" />
    </g>
  `;
  currentY += 80;

  // Stats Grid
  const statBoxW = (width - 48 - 40) / 3;
  const statBoxH = 70;
  
  const drawStat = (x: number, value: number, label: string, isGradient: boolean = false) => `
    <g transform="translate(${x}, 0)">
      <rect x="0" y="0" width="${statBoxW}" height="${statBoxH}" rx="12" fill="${theme.glassBg}" stroke="${theme.glassBorder}" stroke-width="1" />
      <text x="${statBoxW / 2}" y="32" font-size="20px" font-weight="700" font-family="'Outfit', sans-serif" fill="${isGradient ? 'url(#textGradient)' : theme.titleColor}" text-anchor="middle">${value}</text>
      <text x="${statBoxW / 2}" y="52" font-size="11.2px" text-transform="uppercase" font-weight="600" letter-spacing="0.05em" fill="${theme.textMutedColor}" text-anchor="middle">${label}</text>
    </g>
  `;

  const statsSvg = `
    <g transform="translate(0, ${currentY})">
      ${drawStat(0, totalPeriod, t.totalPeriod, true)}
      ${drawStat(statBoxW + 20, currentStreak, t.currentStreak)}
      ${drawStat((statBoxW + 20) * 2, maxStreak, t.longestStreak)}
    </g>
  `;
  currentY += statBoxH + 20;

  // Heatmap
  const cellS = 14;
  const gap = 4;
  const heatmapHeight = (7 * cellS) + (6 * gap); // 7 rows
  
  const heatmapSvg = visibleContributions.map((day, idx) => {
    const col = Math.floor(idx / 7);
    const row = idx % 7;
    const x = col * (cellS + gap);
    const y = row * (cellS + gap);
    const level = getIntensityLevel(day.count);
    const color = getCellColor(level, isLight);
    
    return `<rect x="${x}" y="${y}" width="${cellS}" height="${cellS}" rx="4" fill="${color}" />`;
  }).join('');

  const legendY = heatmapHeight + 20;
  const legendX = (width - 48) - 150;
  const legendSvg = `
    <g transform="translate(${legendX}, ${legendY})">
      <text x="0" y="10" font-size="12px" fill="${theme.textMutedColor}" font-weight="500">Menos</text>
      <rect x="40" y="0" width="${cellS}" height="${cellS}" rx="4" fill="${getCellColor(0, isLight)}" />
      <rect x="58" y="0" width="${cellS}" height="${cellS}" rx="4" fill="${getCellColor(1, isLight)}" />
      <rect x="76" y="0" width="${cellS}" height="${cellS}" rx="4" fill="${getCellColor(2, isLight)}" />
      <rect x="94" y="0" width="${cellS}" height="${cellS}" rx="4" fill="${getCellColor(3, isLight)}" />
      <rect x="112" y="0" width="${cellS}" height="${cellS}" rx="4" fill="${getCellColor(4, isLight)}" />
      <text x="132" y="10" font-size="12px" fill="${theme.textMutedColor}" font-weight="500">Más</text>
    </g>
  `;

  const heatmapWrapper = `
    <g transform="translate(0, ${currentY})">
      ${heatmapSvg}
      ${legendSvg}
    </g>
  `;
  
  currentY += legendY + 20;

  const totalHeight = 24 + currentY + 24;

  return renderCardWrapper({
    width,
    height: totalHeight,
    theme,
    children: headerSvg + statsSvg + heatmapWrapper
  });
};
