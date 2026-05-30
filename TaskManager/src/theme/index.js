import { Platform } from 'react-native';

export const lightTheme = {
  background: '#F8FAFC',
  card: '#FFFFFF',
  text: '#1E293B',
  textSecondary: '#64748B',
  primary: '#6366F1',
  primaryLight: '#EEF2FF',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  border: '#E2E8F0',
};

export const darkTheme = {
  background: '#0F172A',
  card: '#1E293B',
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  primary: '#818CF8',
  primaryLight: '#312E81',
  success: '#34D399',
  danger: '#F87171',
  warning: '#FBBF24',
  border: '#334155',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 24,
  full: 999,
};

export const fontSize = {
  caption: 12,
  body: 14,
  subtitle: 16,
  title: 20,
  hero: 28,
};

export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const shadow = Platform.select({
  ios: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
    },
  },
  android: {
    small: { elevation: 2 },
    medium: { elevation: 4 },
    large: { elevation: 8 },
  },
});
