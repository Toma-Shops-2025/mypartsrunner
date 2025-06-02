export interface AdPricing {
  daily_rate: number;
  min_days: number;
  max_days: number;
}

export const adPricing: Record<string, Record<string, AdPricing>> = {
  sidebar: {
    small: {
      daily_rate: 4.99,
      min_days: 7,
      max_days: 30
    },
    medium: {
      daily_rate: 7.99,
      min_days: 7,
      max_days: 30
    }
  },
  header: {
    medium: {
      daily_rate: 9.99,
      min_days: 7,
      max_days: 30
    },
    large: {
      daily_rate: 14.99,
      min_days: 7,
      max_days: 30
    }
  },
  content: {
    medium: {
      daily_rate: 12.99,
      min_days: 7,
      max_days: 30
    },
    large: {
      daily_rate: 19.99,
      min_days: 7,
      max_days: 30
    }
  },
  footer: {
    small: {
      daily_rate: 3.99,
      min_days: 7,
      max_days: 30
    },
    medium: {
      daily_rate: 5.99,
      min_days: 7,
      max_days: 30
    }
  }
}; 