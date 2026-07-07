import { renderCardWrapper } from './CardWrapper';
import { icons } from './icons';
import { type SVGTheme } from './themes';
import { dictionaries, type Language } from './locales';

export interface TimeOfDay {
  morning: number;
  afternoon: number;
  night: number;
}

export interface TimeOfDaySVGProps {
  timeOfDay: TimeOfDay;
  theme: SVGTheme;
  lang: Language;
}

export const renderTimeOfDaySVG = ({ timeOfDay, theme, lang }: TimeOfDaySVGProps): string => {
  const t = dictionaries[lang] as any;
  const total = timeOfDay.morning + timeOfDay.afternoon + timeOfDay.night;

  const getPercent = (val: number) => {
    return total === 0 ? 0 : Math.round((val / total) * 100);
  };

  const pMorning = getPercent(timeOfDay.morning);
  const pAfternoon = getPercent(timeOfDay.afternoon);
  const pNight = getPercent(timeOfDay.night);

  const width = 850;
  let currentY = 0;

  const headerSvg = `
    <!-- Header -->
    <g transform="translate(0, ${currentY})">
      <svg x="0" y="-4" width="24" height="24" viewBox="${icons.clock.viewBox}" fill="#38bdf8">
        ${icons.clock.path}
      </svg>
      <text x="36" y="16" font-size="20px" font-weight="700" fill="${theme.titleColor}">${t.timeOfDay}</text>
      
      <!-- Divider -->
      <line x1="0" y1="40" x2="${width - 48}" y2="40" stroke="${theme.glassBorder}" stroke-width="1" />
    </g>
  `;
  currentY += 60;

  // Chart area
  const chartHeight = 150;
  const colWidth = (width - 48) / 3;

  const barDef = `
    <linearGradient id="morningGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="rgba(245, 158, 11, 0.2)"/>
    </linearGradient>
    <linearGradient id="afternoonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="rgba(56, 189, 248, 0.2)"/>
    </linearGradient>
    <linearGradient id="nightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="rgba(139, 92, 246, 0.2)"/>
    </linearGradient>
  `;

  const drawBar = (xOffset: number, percent: number, gradientId: string, iconObj: any, iconColor: string, timeLabel: string) => {
    // min-height roughly 20px, max roughly chartHeight - 40
    const availableH = chartHeight - 40;
    const barH = Math.max(20, (percent / 100) * availableH);
    const barW = 40;
    const yTop = chartHeight - 30 - barH;

    // center bar in column
    const barX = xOffset + (colWidth - barW) / 2;

    return `
      <!-- Bar Background -->
      <path d="M ${barX} ${yTop} 
               q 0 -8 8 -8 
               h ${barW - 16} 
               q 8 0 8 8 
               v ${barH} 
               h -${barW} Z" fill="url(#${gradientId})" />
      
      <!-- Percent Label -->
      <text x="${barX + barW / 2}" y="${yTop + 16}" font-size="12px" font-weight="700" fill="white" text-anchor="middle">${percent}%</text>
      
      <!-- Time Label Wrapper -->
      <g transform="translate(${xOffset + colWidth / 2 - 35}, ${chartHeight - 10})">
        <svg x="0" y="-12" width="14" height="14" viewBox="${iconObj.viewBox}" fill="${iconColor}">
          ${iconObj.path}
        </svg>
        <text x="20" y="0" font-size="11.2px" font-weight="600" fill="${theme.textMutedColor}">${timeLabel}</text>
      </g>
    `;
  };

  const chartSvg = `
    <g transform="translate(0, ${currentY})">
      <defs>${barDef}</defs>
      ${drawBar(0, pMorning, 'morningGradient', icons.sun, '#f59e0b', '6-12h')}
      ${drawBar(colWidth, pAfternoon, 'afternoonGradient', icons.sun, '#38bdf8', '12-20h')}
      ${drawBar(colWidth * 2, pNight, 'nightGradient', icons.moon, '#8b5cf6', '20-6h')}
    </g>
  `;
  currentY += chartHeight;

  const innerSvg = `
    ${headerSvg}
    ${chartSvg}
  `;

  const totalHeight = 24 + currentY + 24;

  return renderCardWrapper({
    width,
    height: totalHeight,
    theme,
    children: innerSvg
  });
};
