import { renderCardWrapper } from './CardWrapper';
import { icons } from './icons';
import { type SVGTheme } from './themes';
import { dictionaries, type Language } from './locales';

export interface CodeLifeBalance {
  weekdays: number;
  weekends: number;
}

export interface CodeLifeBalanceSVGProps {
  balance: CodeLifeBalance;
  theme: SVGTheme;
  lang: Language;
}

export const renderCodeLifeBalanceSVG = ({ balance, theme, lang }: CodeLifeBalanceSVGProps): string => {
  const t = dictionaries[lang] as any;
  const total = balance.weekdays + balance.weekends;
  const weekdaysPerc = total > 0 ? Math.round((balance.weekdays / total) * 100) : 0;
  const weekendsPerc = total > 0 ? Math.round((balance.weekends / total) * 100) : 0;

  const width = 850;
  let currentY = 0;

  const headerSvg = `
    <!-- Header -->
    <g transform="translate(0, ${currentY})">
      <svg x="0" y="-2" width="28" height="28" viewBox="${icons.balanceScale.viewBox}" fill="#f43f5e">
        ${icons.balanceScale.path}
      </svg>
      <g transform="translate(40, 16)">
        <text x="0" y="0" font-size="20px" font-weight="700" fill="${theme.titleColor}">${t.codeLifeBalance}</text>
        <text x="0" y="20" font-size="12px" fill="${theme.textMutedColor}">${t.codeLifeDesc}</text>
      </g>
      <!-- Divider -->
      <line x1="0" y1="56" x2="${width - 48}" y2="56" stroke="${theme.glassBorder}" stroke-width="1" />
    </g>
  `;
  currentY += 80;

  // Content area
  const contentWidth = width - 48;
  const barHeight = 24;

  const barDef = `
    <linearGradient id="weekdaysGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2ca3f5"/>
      <stop offset="100%" stop-color="rgba(44, 163, 245, 0.6)"/>
    </linearGradient>
    <linearGradient id="weekendsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f52d8c"/>
      <stop offset="100%" stop-color="rgba(245, 45, 140, 0.6)"/>
    </linearGradient>
  `;

  // We have a left stat (weekdays), the bar in the middle, and a right stat (weekends)
  // Let's divide: left stat 150px, bar area (contentWidth - 300), right stat 150px
  const statWidth = 140;
  const barAreaWidth = contentWidth - (statWidth * 2) - 40; // 40px gap

  const getWeekdaysBarWidth = () => Math.max(0, (weekdaysPerc / 100) * barAreaWidth);
  const getWeekendsBarWidth = () => Math.max(0, (weekendsPerc / 100) * barAreaWidth);

  const contentSvg = `
    <g transform="translate(0, ${currentY})">
      <defs>${barDef}</defs>
      
      <!-- Weekdays Stat -->
      <g transform="translate(0, 0)">
        <text x="0" y="16" font-size="14px" font-weight="600" fill="${theme.textColor}">${t.weekdays}</text>
        <text x="0" y="44" font-size="24px" font-weight="700" fill="#2ca3f5">${weekdaysPerc}%</text>
      </g>

      <!-- Bar Container -->
      <g transform="translate(${statWidth + 20}, 16)">
        <rect x="0" y="0" width="${barAreaWidth}" height="${barHeight}" rx="12" fill="${theme.glassBorder}" />
        <!-- Weekdays Bar -->
        ${weekdaysPerc > 0 ? `<rect x="0" y="0" width="${getWeekdaysBarWidth()}" height="${barHeight}" rx="12" fill="url(#weekdaysGradient)" />` : ''}
        <!-- Weekends Bar -->
        ${weekendsPerc > 0 ? `<rect x="${getWeekdaysBarWidth()}" y="0" width="${getWeekendsBarWidth()}" height="${barHeight}" rx="12" fill="url(#weekendsGradient)" />` : ''}
      </g>

      <!-- Weekends Stat -->
      <g transform="translate(${contentWidth - statWidth}, 0)">
        <text x="${statWidth}" y="16" font-size="14px" font-weight="600" fill="${theme.textColor}" text-anchor="end">${t.weekends}</text>
        <text x="${statWidth}" y="44" font-size="24px" font-weight="700" fill="#f52d8c" text-anchor="end">${weekendsPerc}%</text>
      </g>
    </g>
  `;
  currentY += 60;

  const innerSvg = `
    ${headerSvg}
    ${contentSvg}
  `;

  const totalHeight = 24 + currentY + 24;

  return renderCardWrapper({
    width,
    height: totalHeight,
    theme,
    children: innerSvg
  });
};
