import { Platform } from 'react-native';

export const Colors = {
  stickerGreen: '#2AD85C',
  mangoOrange: '#FF8000',
  mangoYellow: '#FFD500',
  inkBlack: '#080808',
  paperWhite: '#FCFCFC',
  halftone: 'rgba(0,0,0,0.15)',
  gray: '#999',
  lightGray: '#F0F0F0',
  cardBg: '#F4F4F4',
  priceGray: '#444',
};

export const Spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
};

export const Radius = {
  sticker: 24,
  s: 8,
  m: 16,
  pill: 999,
};

export const Fonts = {
  display: 'Fraunces_900Black',
  body: Platform.OS === 'ios' ? 'Courier' : 'monospace',
};
