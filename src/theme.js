import { Platform } from 'react-native';
import { useApp } from './state';

export const PALETTES = {
  light: {
    sand:    '#F4EFE6',
    sandDim: '#EBE4D5',
    sandDk:  '#E0D7C3',
    ink:     '#1F2A2E',
    inkSoft: '#3D4A50',
    kelp:    '#4A6B6E',
    kelpDk:  '#2F4A4D',
    coral:   '#C96442',
    mute:    'rgba(31,42,46,0.55)',
    muteLo:  'rgba(31,42,46,0.35)',
    line:    'rgba(31,42,46,0.10)',
    lineStr: 'rgba(31,42,46,0.20)',
    overlay: 'rgba(0,0,0,0.35)',
  },
  dark: {
    sand:    '#1A1815',
    sandDim: '#242220',
    sandDk:  '#2E2C29',
    ink:     '#F4EFE6',
    inkSoft: '#C4BEB2',
    kelp:    '#7BA3A6',
    kelpDk:  '#9FC4C7',
    coral:   '#E48864',
    mute:    'rgba(244,239,230,0.55)',
    muteLo:  'rgba(244,239,230,0.30)',
    line:    'rgba(244,239,230,0.08)',
    lineStr: 'rgba(244,239,230,0.15)',
    overlay: 'rgba(0,0,0,0.55)',
  },
};

export const FONTS = {
  display: Platform.select({ ios: 'Georgia', default: 'serif' }),
  body:    Platform.select({ ios: 'System',  default: 'sans-serif' }),
  mono:    Platform.select({ ios: 'Menlo',   default: 'monospace' }),
};

export const mono = {
  fontFamily: FONTS.mono,
  fontVariant: ['tabular-nums'],
};

export function useTheme() {
  const { theme } = useApp();
  return PALETTES[theme] || PALETTES.light;
}
