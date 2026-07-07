import { renderCardWrapper } from './CardWrapper';
import { icons } from './icons';
import { type SVGTheme } from './themes';
import { dictionaries, type Language } from './locales';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface AchievementsSVGProps {
  achievements: Achievement[];
  theme: SVGTheme;
  lang: Language;
}

export const renderAchievementsSVG = ({ achievements, theme, lang }: AchievementsSVGProps): string => {
  const t = dictionaries[lang] as any;

  // Map icon strings to actual SVG paths (replacing emojis)
  const getIcon = (id: string) => {
    switch (id) {
      case 'pull-shark': return { ...icons.code, color: '#3b82f6' };
      case 'bug-hunter': return { ...icons.checkCircle, color: '#10b981' };
      case 'influencer': return { ...icons.star, color: '#eab308' };
      case 'night-owl': return { ...icons.moon, color: '#8b5cf6' };
      case 'early-bird': return { ...icons.sun, color: '#f59e0b' };
      default: return { ...icons.medal, color: '#ec4899' };
    }
  };

  const width = 850;
  let currentY = 0;

  const headerSvg = `
    <!-- Header -->
    <g transform="translate(0, ${currentY})">
      <svg x="0" y="-4" width="28" height="28" viewBox="${icons.trophy.viewBox}" fill="#fbbf24">
        ${icons.trophy.path}
      </svg>
      <text x="40" y="18" class="header-title">${t.achievements}</text>
      
      <!-- Divider -->
      <line x1="0" y1="40" x2="${width - 48}" y2="40" stroke="${theme.glassBorder}" stroke-width="1" />
    </g>
  `;
  currentY += 64;

  const columns = 5;
  const gap = 24;
  const itemWidth = 141; // (850 - 48 (padding) - 4 * 24 (gap)) / 5 = 141.2
  const itemHeight = 150; 

  const listItems = achievements.map((ach, idx) => {
    const title = ach.title;
    const desc = ach.description;
    const iconObj = getIcon(ach.id);

    const row = Math.floor(idx / columns);
    const col = idx % columns;
    const x = col * (itemWidth + gap);
    const y = currentY + row * (itemHeight + gap);

    // Wrapper background
    const wrapperBg = theme.glassBorder;

    // Word wrap desc for SVG (max 2 lines roughly)
    const words = desc.split(' ');
    const line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
    const line2 = words.slice(Math.ceil(words.length / 2)).join(' ');

    return `
      <g transform="translate(${x}, ${y})">
        <!-- Item Background -->
        <rect width="${itemWidth}" height="${itemHeight}" rx="12" fill="${theme.glassBg}" stroke="${theme.glassBorder}" stroke-width="1" />
        
        <!-- Icon Wrapper -->
        <g transform="translate(${(itemWidth - 50) / 2}, 16)">
          <circle cx="25" cy="25" r="25" fill="${wrapperBg}" stroke="${theme.glassBorder}" stroke-width="1" />
          <svg x="11" y="11" width="28" height="28" viewBox="${iconObj.viewBox}" fill="${iconObj.color}">
            ${iconObj.path}
          </svg>
        </g>
        
        <!-- Text -->
        <text x="${itemWidth / 2}" y="94" font-size="13px" font-weight="600" fill="${theme.textColor}" text-anchor="middle">${title}</text>
        <text x="${itemWidth / 2}" y="116" font-size="11px" fill="${theme.textMutedColor}" text-anchor="middle">${line1}</text>
        <text x="${itemWidth / 2}" y="130" font-size="11px" fill="${theme.textMutedColor}" text-anchor="middle">${line2}</text>
      </g>
    `;
  }).join('');

  const numRows = Math.ceil(achievements.length / columns);
  if (achievements.length > 0) {
    currentY += numRows * (itemHeight + gap) - gap;
  }

  const emptyState = achievements.length === 0 ? `
    <text x="${(width - 48) / 2}" y="${currentY + 30}" font-size="16px" fill="${theme.textMutedColor}" text-anchor="middle">
      Aún no hay logros desbloqueados.
    </text>
  ` : '';
  
  if (achievements.length === 0) currentY += 60;

  const innerSvg = `
    ${headerSvg}
    ${listItems}
    ${emptyState}
  `;

  const totalHeight = 24 + currentY + 24;

  return renderCardWrapper({
    width,
    height: totalHeight,
    theme,
    children: innerSvg
  });
};
