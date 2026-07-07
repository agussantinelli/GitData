import { renderCardWrapper } from './CardWrapper';
import { icons } from './icons';
import { type SVGTheme } from './themes';
import { dictionaries, type Language } from './locales';

export interface HourlyFrequencySVGProps {
  hourlyFrequency: number[];
  theme: SVGTheme;
  lang: Language;
}

export const renderHourlyFrequencySVG = ({ hourlyFrequency, theme, lang }: HourlyFrequencySVGProps): string => {
  const t = dictionaries[lang] as any;

  const width = 850;
  let currentY = 0;

  const headerSvg = `
    <!-- Header -->
    <g transform="translate(0, ${currentY})">
      <svg x="0" y="-4" width="24" height="24" viewBox="${icons.clock.viewBox}" fill="#06b6d4">
        ${icons.clock.path}
      </svg>
      <text x="36" y="16" font-size="20px" font-weight="700" fill="${theme.titleColor}">${t.hourlyActivity}</text>
      <text x="36" y="36" font-size="12px" fill="${theme.textMutedColor}">${t.hourlyActivityDesc}</text>
      
      <!-- Divider -->
      <line x1="0" y1="56" x2="${width - 48}" y2="56" stroke="${theme.glassBorder}" stroke-width="1" />
    </g>
  `;
  currentY += 80;

  // Chart area
  const chartHeight = 160;
  const maxCommits = Math.max(...hourlyFrequency, 1);
  const chartWidth = width - 48;
  const gap = 2;
  const barWidth = (chartWidth - (23 * gap)) / 24;

  const chartDef = `
    <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4"/>
      <stop offset="100%" stop-color="rgba(6, 182, 212, 0.4)"/>
    </linearGradient>
  `;

  const barsSvg = hourlyFrequency.map((count, hour) => {
    const heightPercent = count / maxCommits;
    const barH = heightPercent * (chartHeight - 20); // 20px for label
    const x = hour * (barWidth + gap);
    const label = hour.toString().padStart(2, '0');
    const yTop = chartHeight - 20 - barH;

    return `
      <g transform="translate(${x}, 0)">
        <!-- Bar background -->
        <rect x="0" y="0" width="${barWidth}" height="${chartHeight - 20}" rx="4" fill="${theme.glassBorder}" />
        <!-- Bar fill -->
        <rect x="0" y="${yTop}" width="${barWidth}" height="${barH}" rx="4" fill="url(#barGradient)" />
        <!-- Label -->
        <text x="${barWidth / 2}" y="${chartHeight}" font-size="9.6px" font-weight="600" fill="${theme.textMutedColor}" text-anchor="middle">${label}</text>
      </g>
    `;
  }).join('');

  const chartSvg = `
    <g transform="translate(0, ${currentY})">
      <defs>${chartDef}</defs>
      ${barsSvg}
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
