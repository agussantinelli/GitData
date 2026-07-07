import { renderCardWrapper } from './CardWrapper';
import { type SVGTheme } from './themes';
import { dictionaries, type Language } from './locales';

export interface ProfileData {
  name: string;
  username: string;
  bio: string;
  location: string;
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
}

export const renderPersonalInfoSVG = ({ data, theme, lang }: PersonalInfoSVGProps): string => {
  const t = dictionaries[lang] as any;
  const yearsExp = new Date().getFullYear() - new Date(data.createdAt).getFullYear();

  const width = 850;
  let currentY = 0;

  // Header (Avatar + Name)
  const headerSvg = `
    <!-- Header -->
    <g transform="translate(0, ${currentY})">
      <!-- Avatar with clipping circle -->
      <defs>
        <clipPath id="avatarClip">
          <circle cx="40" cy="40" r="40" />
        </clipPath>
      </defs>
      <image href="https://github.com/${data.username}.png" x="0" y="0" width="80" height="80" clip-path="url(#avatarClip)" />
      
      <g transform="translate(100, 30)">
        <text x="0" y="0" font-size="28px" font-weight="700" fill="${theme.textColor}">${data.name}</text>
        <text x="0" y="24" font-size="14px" fill="${theme.textMutedColor}">
          <tspan fill="${theme.primaryColor}" font-weight="600">@${data.username}</tspan> • ${data.location} • ${yearsExp} ${t.yearsExp}
        </text>
      </g>
    </g>
  `;
  currentY += 100;

  // Bio
  const bioSvg = `
    <g transform="translate(0, ${currentY})">
      <text x="0" y="0" font-size="16px" fill="${theme.textMutedColor}" width="${width - 48}">
        ${data.bio}
      </text>
    </g>
  `;
  currentY += 40;

  // Badges (Skills)
  const skillsSvg = data.topLanguages.map((lang, idx) => {
    const badgeX = idx * 100; // Simplified layout, fixed width badges for now
    return `
      <g transform="translate(${badgeX}, ${currentY})">
        <rect width="90" height="28" rx="14" fill="${theme.glassBg}" stroke="${theme.glassBorder}" stroke-width="1" />
        <text x="45" y="19" font-size="13px" fill="${theme.textColor}" text-anchor="middle">${lang.name}</text>
      </g>
    `;
  }).join('');
  currentY += 50;

  // Divider
  const dividerSvg = `
    <line x1="0" y1="${currentY}" x2="${width - 48}" y2="${currentY}" stroke="${theme.glassBorder}" stroke-width="1" />
  `;
  currentY += 30;

  // Stats Grid (4 items)
  const statItem = (x: number, value: string | number, label: string, isGradient: boolean = false) => `
    <g transform="translate(${x}, ${currentY})">
      <text x="0" y="0" font-size="32px" font-weight="700" fill="${isGradient ? theme.primaryColor : theme.textColor}">${value}</text>
      <text x="0" y="24" font-size="14px" fill="${theme.textMutedColor}">${label}</text>
    </g>
  `;

  const gap = (width - 48) / 4;
  const statsSvg = `
    ${statItem(0, data.stats.commits, t.commits, true)}
    ${statItem(gap, data.stats.stars, t.stars)}
    ${statItem(gap * 2, data.stats.prs, t.prs)}
    ${statItem(gap * 3, data.followers, t.followers)}
  `;
  currentY += 60;

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
