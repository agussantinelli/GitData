import { renderCardWrapper } from './CardWrapper';
import { icons } from './icons';
import { type SVGTheme } from './themes';
import { dictionaries, type Language } from './locales';
import type { Milestone } from '../../domain/entities/Profile';

export interface MilestonesSVGProps {
  milestones: Milestone[];
  theme: SVGTheme;
  lang: Language;
}

export const renderMilestonesSVG = ({ milestones, theme, lang }: MilestonesSVGProps): string => {
  const t = dictionaries[lang] as any;

  const width = 850;
  let currentY = 0;

  const headerSvg = `
    <!-- Header -->
    <g transform="translate(0, ${currentY})">
      <svg x="0" y="-4" width="24" height="24" viewBox="${icons.flagCheckered.viewBox}" fill="${theme.primaryColor}">
        ${icons.flagCheckered.path}
      </svg>
      <text x="36" y="16" font-size="20px" font-weight="700" fill="${theme.titleColor}">${t.milestones}</text>
      <!-- Divider -->
      <line x1="0" y1="40" x2="${width - 48}" y2="40" stroke="${theme.glassBorder}" stroke-width="1" />
    </g>
  `;
  currentY += 60;

  let timelineSvg = '';

  if (milestones.length > 0) {
    const getYear = (dateStr: string) => new Date(dateStr).getFullYear();

    timelineSvg = milestones.map((ms, idx) => {
      let title = ms.title;
      let desc = ms.description;

      if (ms.meta) {
        if (ms.meta.repo) desc = desc.replace('{repo}', ms.meta.repo);
        if (ms.meta.stars) desc = desc.replace('{stars}', ms.meta.stars.toString());
        if (ms.meta.size) desc = desc.replace('{size}', ms.meta.size.toString());
      }

      const itemY = idx * 80;

      return `
        <g transform="translate(0, ${itemY})">
          <!-- Connector line -->
          ${idx !== milestones.length - 1 ? `<line x1="28" y1="28" x2="28" y2="80" stroke="${theme.glassBorder}" stroke-width="2" />` : ''}
          
          <!-- Year Bubble -->
          <g transform="translate(0, 0)">
            <rect x="0" y="0" width="56" height="28" rx="14" fill="${theme.primaryColor}22" stroke="${theme.primaryColor}" stroke-width="1" />
            <text x="28" y="19" font-size="12px" font-weight="700" fill="${theme.primaryColor}" text-anchor="middle">${getYear(ms.date)}</text>
          </g>

          <!-- Content Bubble -->
          <g transform="translate(76, -10)">
            <rect x="0" y="0" width="${width - 48 - 76}" height="48" rx="8" fill="${theme.glassBg}" stroke="${theme.glassBorder}" stroke-width="1" />
            <text x="16" y="20" font-size="14px" font-weight="700" fill="${theme.titleColor}">${title}</text>
            <text x="16" y="38" font-size="12px" fill="${theme.textMutedColor}">${desc}</text>
          </g>
        </g>
      `;
    }).join('');

    currentY += milestones.length * 80;
  } else {
    timelineSvg = `
      <text x="${(width - 48) / 2}" y="${currentY + 20}" font-size="14px" fill="${theme.textMutedColor}" text-anchor="middle">No hay hitos disponibles.</text>
    `;
    currentY += 40;
  }

  const innerSvg = `
    ${headerSvg}
    <g transform="translate(0, ${currentY - (milestones.length * 80)})">
      ${timelineSvg}
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
