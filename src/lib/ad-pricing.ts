interface PricingConfig {
  [key: string]: {
    [key: string]: number;
  };
}

export const adPricing: PricingConfig = {
  sidebar: {
    small: 3.99,
    medium: 9.99,
    large: 19.99,
  },
  header: {
    small: 4.99,
    medium: 12.99,
    large: 24.99,
  },
  footer: {
    small: 3.99,
    medium: 9.99,
    large: 19.99,
  },
  content: {
    small: 5.99,
    medium: 14.99,
    large: 29.99,
  },
};

export const getAdPrice = (location: string, size: string): number => {
  return adPricing[location]?.[size] || 0;
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}; 