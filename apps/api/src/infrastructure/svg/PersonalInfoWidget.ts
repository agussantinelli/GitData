import { renderCardWrapper } from './CardWrapper';
import { type SVGTheme } from './themes';
import { dictionaries, type Language } from './locales';

export interface ProfileData {
  name: string | null;
  username: string;
  bio: string | null;
  location: string | null;
  followers: number;
  createdAt: string;
  stats: {
    commits: number;
    prs: number;
    issues: number;
    stars: number;
  };
  topLanguages: { name: string; percentage: number }[];
}

export interface PersonalInfoSVGProps {
  data: ProfileData;
  theme: SVGTheme;
  lang: Language;
  avatarBase64: string;
}

export const renderPersonalInfoSVG = ({ data, theme, lang, avatarBase64 }: PersonalInfoSVGProps): string => {
  const t = dictionaries[lang] as any;
  const yearsExp = new Date().getFullYear() - new Date(data.createdAt).getFullYear();

  const width = 850;
  let currentY = 0;

  // Emulate React CSS classes
  const gradientDef = `
    <linearGradient id="cyberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2ca3f5"/>
      <stop offset="100%" stop-color="#f52d8c"/>
    </linearGradient>
    <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2ca3f5"/>
      <stop offset="100%" stop-color="#f52d8c"/>
    </linearGradient>
  `;

  // Header (Avatar + Name)
  const headerSvg = `
    <!-- Header -->
    <g transform="translate(0, ${currentY})">
      <defs>
        ${gradientDef}
        <clipPath id="avatarClip">
          <circle cx="44" cy="44" r="40" />
        </clipPath>
      </defs>
      <!-- Avatar with Gradient Border -->
      <circle cx="44" cy="44" r="42" fill="none" stroke="url(#cyberGradient)" stroke-width="3" />
      <image href="${avatarBase64}" x="4" y="4" width="80" height="80" clip-path="url(#avatarClip)" preserveAspectRatio="xMidYMid slice" />
      
      <g transform="translate(108, 38)">
        <text x="0" y="0" font-size="24px" font-weight="700" font-family="'Outfit', sans-serif" fill="${theme.titleColor}">${data.name || data.username}</text>
        <text x="0" y="24" font-size="14px" fill="${theme.textMutedColor}">
          <tspan fill="url(#textGradient)">@${data.username}</tspan> • ${data.location || 'Unknown'} • ${yearsExp} ${t.yearsExp}
        </text>
      </g>
    </g>
  `;
  currentY += 108;

  // Bio
  const bioSvg = `
    <g transform="translate(0, ${currentY})">
      <text x="0" y="0" font-size="15px" fill="${theme.textMutedColor}" width="${width - 48}">
        ${data.bio || ''}
      </text>
    </g>
  `;
  currentY += 36;

  // Badges (Skills)
  // gitdata-badge.secondary: background: rgba(245, 45, 140, 0.15); color: #f52d8c; border: 1px solid rgba(245, 45, 140, 0.3);
  let badgeX = 0;
  const skillsSvg = data.topLanguages.map((lang, idx) => {
    const text = lang.name.toUpperCase();
    const badgeWidth = text.length * 8 + 24; // Approx width
    const svg = `
      <g transform="translate(${badgeX}, ${currentY})">
        <rect width="${badgeWidth}" height="26" rx="13" fill="rgba(245, 45, 140, 0.15)" stroke="rgba(245, 45, 140, 0.3)" stroke-width="1" />
        <text x="${badgeWidth / 2}" y="17" font-size="11px" font-weight="600" letter-spacing="0.05em" fill="#f52d8c" text-anchor="middle">${text}</text>
      </g>
    `;
    badgeX += badgeWidth + 12; // Gap 12px (0.75rem)
    return svg;
  }).join('');
  currentY += 48;

  // Divider
  const dividerSvg = `
    <line x1="0" y1="${currentY}" x2="${width - 48}" y2="${currentY}" stroke="${theme.glassBorder}" stroke-width="1" />
  `;
  currentY += 48; // Increased spacing below divider

  // Stats Grid (4 items)
  // className="stat-value gradient-text" (first one)
  const statItem = (x: number, value: string | number, label: string, isGradient: boolean = false) => `
    <g transform="translate(${x}, ${currentY})">
      <text x="40" y="0" font-size="26px" font-weight="700" font-family="'Outfit', sans-serif" fill="${isGradient ? 'url(#textGradient)' : theme.titleColor}" text-anchor="middle">${value}</text>
      <text x="40" y="22" font-size="11px" font-weight="600" letter-spacing="0.05em" fill="${theme.textMutedColor}" text-transform="uppercase" text-anchor="middle">${label.toUpperCase()}</text>
    </g>
  `;

  // Total width: 850 - 48 = 802. For 4 items, gap is roughly 802 / 4 = 200
  const colWidth = (width - 48) / 4;
  const statsSvg = `
    ${statItem(colWidth * 0.5 - 40, data.stats.commits, t.commits, true)}
    ${statItem(colWidth * 1.5 - 40, data.stats.stars, t.stars)}
    ${statItem(colWidth * 2.5 - 40, data.stats.prs, t.prs)}
    ${statItem(colWidth * 3.5 - 40, data.followers, t.followers)}
  `;
  currentY += 40;

  const innerSvg = `
    ${headerSvg}
    ${bioSvg}
    ${skillsSvg}
    ${dividerSvg}
    ${statsSvg}
  `;

  const totalHeight = 24 + currentY + 24;

  return renderCardWrapper({
    width,
    height: totalHeight,
    theme,
    children: innerSvg
  });
};
