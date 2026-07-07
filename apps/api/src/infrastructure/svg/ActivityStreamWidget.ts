import { renderCardWrapper } from './CardWrapper';
import { icons } from './icons';
import { type SVGTheme } from './themes';
import { dictionaries, type Language } from './locales';
import type { ActivityEvent } from '../../domain/entities/Profile';

export interface ActivityStreamSVGProps {
  activityStream: ActivityEvent[];
  theme: SVGTheme;
  lang: Language;
}

export const renderActivityStreamSVG = ({ activityStream, theme, lang }: ActivityStreamSVGProps): string => {
  const t = dictionaries[lang] as any;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat(lang, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
  };

  const width = 850;
  let currentY = 0;

  const headerSvg = `
    <!-- Header -->
    <g transform="translate(0, ${currentY})">
      <svg x="0" y="-4" width="24" height="24" viewBox="${icons.history.viewBox}" fill="${theme.primaryColor}">
        ${icons.history.path}
      </svg>
      <text x="36" y="16" font-size="20px" font-weight="700" fill="${theme.titleColor}">${t.activityStream}</text>
      <!-- Divider -->
      <line x1="0" y1="40" x2="${width - 48}" y2="40" stroke="${theme.glassBorder}" stroke-width="1" />
    </g>
  `;
  currentY += 60;

  let streamSvg = '';

  if (activityStream.length > 0) {
    streamSvg = activityStream.map((event, idx) => {
      const itemY = idx * 56;
      
      const maxRepoLen = 30;
      const repoName = event.repo.length > maxRepoLen ? event.repo.substring(0, maxRepoLen) + '...' : event.repo;

      return `
        <g transform="translate(0, ${itemY})">
          <!-- Dot -->
          <circle cx="6" cy="12" r="4" fill="${theme.primaryColor}" />
          <!-- Connector line -->
          ${idx !== activityStream.length - 1 ? `<line x1="6" y1="20" x2="6" y2="52" stroke="${theme.glassBorder}" stroke-width="2" />` : ''}
          
          <!-- Content -->
          <text x="24" y="16" font-size="14px" fill="${theme.titleColor}">${event.description} <tspan font-weight="600" fill="${theme.primaryColor}">on</tspan> <tspan font-weight="700">${repoName}</tspan></text>
          <text x="24" y="36" font-size="12px" fill="${theme.textMutedColor}">${formatDate(event.date)}</text>
        </g>
      `;
    }).join('');

    currentY += activityStream.length * 56;
  } else {
    streamSvg = `
      <text x="${(width - 48) / 2}" y="${currentY + 20}" font-size="14px" fill="${theme.textMutedColor}" text-anchor="middle">No hay actividad reciente disponible.</text>
    `;
    currentY += 40;
  }

  const innerSvg = `
    ${headerSvg}
    <g transform="translate(0, ${currentY - (activityStream.length * 56)})">
      ${streamSvg}
    </g>
  `;

  const totalHeight = 24 + currentY + 24;

  return renderCardWrapper({
    width,
    height: totalHeight,
    theme,
    children: innerSvg
  });
};
