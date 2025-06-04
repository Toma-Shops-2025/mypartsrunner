export interface AdPricing {
  daily_rate: number;
  min_days: number;
  max_days: number;
}

export interface LocationPricing {
  [size: string]: AdPricing;
}

export interface AdPricingConfig {
  [location: string]: LocationPricing;
}

export const adPricing: AdPricingConfig = {
  sidebar: {
    small: {
      daily_rate: 9.99,
      min_days: 7,
      max_days: 30
    },
    medium: {
      daily_rate: 14.99,
      min_days: 7,
      max_days: 30
    }
  },
  header: {
    medium: {
      daily_rate: 19.99,
      min_days: 7,
      max_days: 30
    },
    large: {
      daily_rate: 29.99,
      min_days: 7,
      max_days: 30
    }
  },
  footer: {
    small: {
      daily_rate: 7.99,
      min_days: 7,
      max_days: 30
    },
    medium: {
      daily_rate: 12.99,
      min_days: 7,
      max_days: 30
    }
  },
  content: {
    medium: {
      daily_rate: 24.99,
      min_days: 7,
      max_days: 30
    },
    large: {
      daily_rate: 34.99,
      min_days: 7,
      max_days: 30
    }
  }
};

export const getAdPrice = (location: string, size: string): number => {
  return adPricing[location]?.[size]?.daily_rate || 0;
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}; 