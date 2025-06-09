export interface Store {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  logo?: string;
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  rating: number;
  reviewCount: number;
  categories: string[];
  isOpen: boolean;
  deliveryFee: number;
  minimumOrder: number;
  estimatedDeliveryTime: string;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  image?: string;
  category: string;
  subcategory?: string;
  brand?: string;
  sku: string;
  stockQuantity: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'in' | 'cm';
  };
  tags: string[];
  isAvailable: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
} 