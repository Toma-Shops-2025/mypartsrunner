export interface Product {
  id: string;
  title: string;
  name?: string;
  description: string;
  price: number;
  images: string[];
  image?: string;
  image_url?: string;
  video_url: string;
  thumbnail_url: string;
  status: string;
  category_id: string;
  category?: string;
  seller_id: string;
  created_at: string;
  updated_at: string;
  quantity?: number;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
} 