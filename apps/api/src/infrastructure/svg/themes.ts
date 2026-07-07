export interface SVGTheme {
  background: string;
  borderColor: string;
  titleColor: string;
  textColor: string;
  textMutedColor: string;
  iconColor: string;
  primaryColor: string;
  glassBg: string;
  glassBorder: string;
}

export const themes: Record<string, SVGTheme> = {
  dark: {
    background: 'url(#bg-dark)',
    borderColor: 'rgba(255,255,255,0.1)',
    titleColor: '#ffffff',
    textColor: '#e0e0e0',
    textMutedColor: '#9ca3af',
    iconColor: '#9ca3af',
    primaryColor: '#8b5cf6',
    glassBg: 'rgba(255, 255, 255, 0.03)',
    glassBorder: 'rgba(255, 255, 255, 0.05)'
  },
  light: {
    background: 'url(#bg-light)',
    borderColor: 'rgba(0,0,0,0.1)',
    titleColor: '#111827',
    textColor: '#374151',
    textMutedColor: '#6b7280',
    iconColor: '#6b7280',
    primaryColor: '#8b5cf6',
    glassBg: 'rgba(255, 255, 255, 0.95)',
    glassBorder: 'rgba(0, 0, 0, 0.1)'
  }
};

export const getTheme = (themeStr: string = 'dark'): SVGTheme => {
  return themes[themeStr] || themes.dark;
};
