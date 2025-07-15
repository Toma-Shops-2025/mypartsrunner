import { Product } from './product';

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  description?: string;
  price: number;
  quantity: number;
  thumbnail_url: string | null;
}

export interface CartContextType {
  items: CartItem[];
  total: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  getItemQuantity: (productId: string) => number;
  clearCart: () => void;
}

export interface CartProviderProps {
  children: React.ReactNode;
} 