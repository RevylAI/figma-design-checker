export const colors = {
  bg: '#07080A',
  map: '#121722',
  mapLine: '#2A3548',
  mapGlow: '#2E3A52',
  surface: '#141820',
  surfaceRaised: '#1B2130',
  border: '#2A3344',
  text: '#F5F7FA',
  textMuted: '#9AA3B5',
  textDim: '#6B7385',
  red: '#FF2D2D',
  redSoft: '#FF5A5A',
  yellow: '#F5C518',
  green: '#2EE59D',
  blue: '#4C8DFF',
  orange: '#FF8A3D',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0,0,0,0.55)',
};

export const severityColor = {
  critical: colors.red,
  active: colors.yellow,
  stale: '#8B93A7',
} as const;

export const categoryLabel: Record<string, string> = {
  police: 'Police Activity',
  fire: 'Fire',
  medical: 'Medical',
  traffic: 'Traffic',
  assault: 'Assault',
  theft: 'Theft',
  missing: 'Missing Person',
  other: 'Incident',
};

export const categoryEmoji: Record<string, string> = {
  police: '🚨',
  fire: '🔥',
  medical: '🚑',
  traffic: '🚗',
  assault: '⚠',
  theft: '🎒',
  missing: '👤',
  other: '📍',
};
