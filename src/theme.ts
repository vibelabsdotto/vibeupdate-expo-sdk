import type { ColorSchemeName } from 'react-native';
import type { VibeUpdateTheme, VibeUpdateThemeOverride } from './types.js';

const light: VibeUpdateTheme = {
  backdrop: 'rgba(21, 24, 31, 0.48)',
  surface: '#F9FAFC',
  elevatedSurface: '#F0F2F7',
  text: '#181B22',
  mutedText: '#626875',
  accent: '#5B55D9',
  accentText: '#FDFDFF',
  border: '#DEE1E9',
  pressed: '#4C46C4',
  cornerRadius: 24,
};

const dark: VibeUpdateTheme = {
  backdrop: 'rgba(7, 8, 12, 0.72)',
  surface: '#191A20',
  elevatedSurface: '#23252D',
  text: '#F1F1F5',
  mutedText: '#A7A9B3',
  accent: '#9690FF',
  accentText: '#171526',
  border: '#353741',
  pressed: '#AAA5FF',
  cornerRadius: 24,
};

export function resolveTheme(scheme: ColorSchemeName, override: VibeUpdateThemeOverride = {}): VibeUpdateTheme {
  return { ...(scheme === 'dark' ? dark : light), ...override };
}
