export const colors = {
  // Brand Colors
  primary: {
    light: '#6FD7D7',
    DEFAULT: '#0097B2',
    dark: '#007A8F',
  },
  
  // UI Colors
  background: {
    light: '#FFFFFF',
    DEFAULT: '#F8FAFC',
    dark: '#1E293B',
  },
  
  // Text Colors
  text: {
    primary: '#1E293B',
    secondary: '#64748B',
    light: '#94A3B8',
  },
  
  // Status Colors
  status: {
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  
  // Brand Specific
  runner: {
    package: '#8B6B4D',
    skin: '#FFB6A6',
    uniform: '#2B80FF',
  },

  brand: {
    blue: '#6FD7D7',
    'blue-dark': '#0097B2',
    brown: '#8B4513',
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
  },
} as const;

export const gradients = {
  primary: 'linear-gradient(to right, var(--color-brand-blue), var(--color-brand-blue-dark))',
  dark: 'linear-gradient(to right, var(--color-gray-800), var(--color-gray-900))',
} as const; 