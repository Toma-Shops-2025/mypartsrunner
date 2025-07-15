import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '@/types/product';
import { CartContextType, CartItem } from '@/types/cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const initialState: CartState = {
  items: []
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(item => item.productId === product.id);

      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        };
      }

      return {
        ...state,
        items: [...state.items, {
          id: uuidv4(),
          productId: product.id,
          title: product.title,
          description: product.description,
          price: product.price,
          quantity,
          thumbnail_url: product.thumbnail_url
        }]
      };
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.productId !== action.payload.productId)
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.productId === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      parsedCart.items.forEach((item: CartItem) => {
        dispatch({
          type: 'ADD_TO_CART',
          payload: {
            product: {
              id: item.productId,
              title: item.title,
              description: item.description || '',
              price: item.price,
              images: [],
              video_url: '',
              thumbnail_url: item.thumbnail_url || '',
              status: 'active',
              category_id: '',
              seller_id: '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            quantity: item.quantity
          }
        });
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  const addToCart = (product: Product, quantity: number = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { productId } });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const getItemQuantity = (productId: string) => {
    const item = state.items.find(item => item.productId === productId);
    return item?.quantity || 0;
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value: CartContextType = {
    items: state.items,
    total,
    addToCart,
    removeFromCart,
    updateQuantity,
    getItemQuantity,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 