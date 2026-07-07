import { renderCardWrapper } from './CardWrapper';
import { icons } from './icons';
import { type SVGTheme } from './themes';
import { dictionaries, type Language } from './locales';
import type { TechRadar } from '../../domain/entities/Profile';

export interface TechRadarSVGProps {
  techRadar: TechRadar;
  theme: SVGTheme;
  lang: Language;
}

export const renderTechRadarSVG = ({ techRadar, theme, lang }: TechRadarSVGProps): string => {
  const t = dictionaries[lang] as any;

  const total = techRadar.frontend + techRadar.backend + techRadar.devops;
  const getPercent = (val: number) => total === 0 ? 0 : Math.round((val / total) * 100);
  
  const pFront = getPercent(techRadar.frontend);
  const pBack = getPercent(techRadar.backend);
  const pDev = getPercent(techRadar.devops);

  const width = 850;
  let currentY = 0;

  const headerSvg = `
    <!-- Header -->
    <g transform="translate(0, ${currentY})">
      <svg x="0" y="-4" width="24" height="24" viewBox="${icons.networkWired.viewBox}" fill="${theme.primaryColor}">
        ${icons.networkWired.path}
      </svg>
      <text x="36" y="16" font-size="20px" font-weight="700" fill="${theme.titleColor}">${t.techRadar}</text>
      <!-- Divider -->
      <line x1="0" y1="40" x2="${width - 48}" y2="40" stroke="${theme.glassBorder}" stroke-width="1" />
    </g>
  `;
  currentY += 80;

  const renderBar = (label: string, percent: number, fillColors: string[], yPos: number) => {
    const barWidth = width - 48;
    const fillWidth = (barWidth * percent) / 100;
    const gradientId = `grad-${label.replace(/\s+/g, '')}`;
    
    return `
      <g transform="translate(0, ${yPos})">
        <text x="0" y="0" font-size="14px" font-weight="600" fill="${theme.titleColor}">${label}</text>
        <text x="${barWidth}" y="0" font-size="14px" font-weight="700" fill="${theme.textColor}" text-anchor="end">${percent}%</text>
        
        <defs>
          <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="${fillColors[0]}" />
            <stop offset="100%" stop-color="${fillColors[1]}" />
          </linearGradient>
        </defs>
        
        <rect x="0" y="12" width="${barWidth}" height="12" rx="6" fill="${theme.glassBg}" />
        <rect x="0" y="12" width="${fillWidth}" height="12" rx="6" fill="url(#${gradientId})" />
      </g>
    `;
  };

  const frontColors = ['#f472b6', '#db2777'];
  const backColors = ['#38bdf8', '#0284c7'];
  const devColors = ['#34d399', '#059669'];

  const barsSvg = `
    <g transform="translate(0, ${currentY})">
      ${renderBar('Frontend', pFront, frontColors, 0)}
      ${renderBar('Backend', pBack, backColors, 50)}
      ${renderBar('DevOps & Data', pDev, devColors, 100)}
    </g>
  `;
  currentY += 140;

  const innerSvg = `
    ${headerSvg}
    ${barsSvg}
  `;

  const totalHeight = 24 + currentY + 24;

  return renderCardWrapper({
    width,
    height: totalHeight,
    theme,
    children: innerSvg
  });
};
