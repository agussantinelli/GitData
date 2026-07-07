import { SVGTheme } from './themes';

interface CardWrapperProps {
  width: number;
  height: number;
  theme: SVGTheme;
  children: string;
}

export const renderCardWrapper = ({ width, height, theme, children }: CardWrapperProps): string => {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <!-- Dark Glassmorphism Gradient -->
        <linearGradient id="bg-dark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e1e24" />
          <stop offset="100%" stop-color="#0a0a0a" />
        </linearGradient>
        <!-- Light Glassmorphism Gradient -->
        <linearGradient id="bg-light" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="100%" stop-color="#f3f4f6" />
        </linearGradient>
        <!-- Custom Font: We use system fonts for SVGs as importing web fonts is spotty on GitHub -->
        <style>
          .svg-text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, 'Outfit', 'Inter'; }
          .header-title { font-size: 20px; font-weight: 600; fill: ${theme.textColor}; font-family: 'Outfit', sans-serif; }
          .kpi-value { font-size: 28px; font-weight: 800; fill: ${theme.textColor}; }
          .kpi-label { font-size: 12px; font-weight: 700; fill: ${theme.textMutedColor}; text-transform: uppercase; letter-spacing: 0.05em; }
        </style>
      </defs>
      
      <!-- Card Background -->
      <!-- Add a backdrop solid color in case GitHub strips the filter, to ensure the card isn't completely transparent -->
      <rect width="100%" height="100%" rx="16" fill="${theme.background}" />
      <rect width="100%" height="100%" rx="16" fill="${theme.glassBg}" stroke="${theme.glassBorder}" stroke-width="1.5" />
      
      <!-- Content -->
      <g transform="translate(24, 24)" class="svg-text">
        ${children}
      </g>
    </svg>
  `;
};
