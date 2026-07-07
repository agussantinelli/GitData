import { renderCardWrapper } from './CardWrapper';
import { icons } from './icons';
import { type SVGTheme } from './themes';
import { dictionaries, type Language } from './locales';

export interface TopLanguagesSVGProps {
  languages: { name: string; percentage: number }[];
  theme: SVGTheme;
  lang: Language;
}

export const renderTopLanguagesSVG = ({ languages, theme, lang }: TopLanguagesSVGProps): string => {
  const t = dictionaries[lang];

  // Colors based on rank (matching React)
  const getRankColor = (index: number) => {
    const colors = ['#eab308', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6'];
    return colors[index] || '#a0a0a0';
  };

  const top5 = languages.slice(0, 5);
  
  // Dimensions
  const width = 600; 
  let currentY = 0;

  const headerSvg = `
    <!-- Header -->
    <g transform="translate(0, ${currentY})">
      <svg x="0" y="0" width="24" height="24" viewBox="${icons.code.viewBox}" fill="#ec4899">
        ${icons.code.path}
      </svg>
      <text x="36" y="18" class="header-title">${t.topLanguages}</text>
      
      <!-- Divider -->
      <line x1="0" y1="40" x2="${width - 48}" y2="40" stroke="${theme.glassBorder}" stroke-width="1" />
    </g>
  `;
  currentY += 64; // header height + gap

  const listItems = top5.map((lang, idx) => {
    const itemColor = getRankColor(idx);
    const itemWidth = width - 48; // padding left and right is 24
    const itemHeight = 72; // Approx height with padding
    
    const trackBg = theme.glassBorder;
    const trackWidth = itemWidth - 112; 
    
    const svg = `
      <g transform="translate(0, ${currentY})">
        <!-- Item Background -->
        <rect width="${itemWidth}" height="${itemHeight}" rx="12" fill="${theme.glassBg}" stroke="${theme.glassBorder}" stroke-width="1" />
        
        <!-- Rank Number -->
        <text x="48" y="48" font-size="32px" font-weight="800" fill="${theme.textMutedColor}" opacity="0.5" text-anchor="end">${idx + 1}</text>
        
        <!-- Language Info Container -->
        <g transform="translate(72, 24)">
          <svg x="0" y="-14" width="16" height="16" viewBox="${icons.code.viewBox}" fill="${itemColor}">
            ${icons.code.path}
          </svg>
          <text x="24" y="0" font-size="18px" font-weight="600" fill="${theme.textColor}">${lang.name}</text>
          <text x="${trackWidth}" y="0" font-size="16px" font-weight="bold" fill="${theme.textColor}" text-anchor="end">${lang.percentage}%</text>
          
          <!-- Progress bar track -->
          <rect x="0" y="16" width="${trackWidth}" height="6" rx="3" fill="${trackBg}" />
          <!-- Progress bar fill -->
          <rect x="0" y="16" width="${trackWidth * (lang.percentage / 100)}" height="6" rx="3" fill="${itemColor}" />
        </g>
      </g>
    `;
    currentY += itemHeight + 16; // item height + gap
    return svg;
  }).join('');

  const emptyState = top5.length === 0 ? `
    <text x="${(width - 48) / 2}" y="${currentY + 30}" font-size="16px" fill="${theme.textMutedColor}" text-anchor="middle">
      No language data available.
    </text>
  ` : '';
  
  if (top5.length === 0) currentY += 60;

  const innerSvg = `
    ${headerSvg}
    ${listItems}
    ${emptyState}
  `;

  // Height is currentY (which includes bottom gap, so we subtract it) + top/bottom padding
  const totalHeight = 24 + (currentY > 64 ? currentY - 16 : currentY) + 24;

  return renderCardWrapper({
    width,
    height: totalHeight,
    theme,
    children: innerSvg
  });
};
