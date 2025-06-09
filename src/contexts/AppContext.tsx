import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '../lib/database.types';
import { supabase } from '../lib/supabase';

type Store = Database['public']['Tables']['stores']['Row'];
type Product = Database['public']['Tables']['products']['Row'];
type Order = Database['public']['Tables']['orders']['Row'];

interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  thumbnail_url: string | null;
}

interface AppState {
  cart: CartItem[];
  selectedStore: Store | null;
  currentOrder: Order | null;
  userLocation: { lat: number; lng: number } | null;
  likedProducts: string[];
}

type AppAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: string } }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_STORE'; payload: Store }
  | { type: 'SET_CURRENT_ORDER'; payload: Order | null }
  | { type: 'SET_USER_LOCATION'; payload: { lat: number; lng: number } }
  | { type: 'TOGGLE_LIKE'; payload: { productId: string } };

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setStore: (store: Store) => void;
  setCurrentOrder: (order: Order | null) => void;
  setUserLocation: (location: { lat: number; lng: number }) => void;
  toggleLike: (productId: string) => void;
  shareProduct: (product: Product) => void;
  cartTotal: number;
  likedProducts: string[];
}

const initialState: AppState = {
  cart: [],
  selectedStore: null,
  currentOrder: null,
  userLocation: null,
  likedProducts: []
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(
        item => item.productId === action.payload.product.id
      );
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.productId === action.payload.product.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, {
          id: uuidv4(),
          productId: action.payload.product.id,
          title: action.payload.product.title,
          price: action.payload.product.price,
          quantity: action.payload.quantity,
          thumbnail_url: action.payload.product.thumbnail_url
        }],
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload.productId && item.productId !== action.payload.productId),
      };

    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.productId || item.productId === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
      };

    case 'SET_STORE':
      return {
        ...state,
        selectedStore: action.payload,
      };

    case 'SET_CURRENT_ORDER':
      return {
        ...state,
        currentOrder: action.payload,
      };

    case 'SET_USER_LOCATION':
      return {
        ...state,
        userLocation: action.payload,
      };

    case 'TOGGLE_LIKE':
      return {
        ...state,
        likedProducts: state.likedProducts.includes(action.payload.productId)
          ? state.likedProducts.filter(id => id !== action.payload.productId)
          : [...state.likedProducts, action.payload.productId]
      };

    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { user } = useAuth();

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          dispatch({
            type: 'SET_USER_LOCATION',
            payload: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        },
        error => {
          console.error('Error getting location:', error);
        }
      );
    }

    // Load current order if exists
    if (user) {
      const loadCurrentOrder = async () => {
        const { data: order, error } = await supabase
          .from('orders')
          .select('*')
          .eq('customer_id', user.id)
          .eq('status', 'pending')
          .single();

        if (!error && order) {
          dispatch({ type: 'SET_CURRENT_ORDER', payload: order });
        }
      };

      loadCurrentOrder();
    }
  }, [user]);

  const addToCart = (product: Product, quantity: number = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
    toast({ title: 'Added to Cart', description: `${product.title} added to cart` });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { productId } });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const setStore = (store: Store) => {
    dispatch({ type: 'SET_STORE', payload: store });
  };

  const setCurrentOrder = (order: Order | null) => {
    dispatch({ type: 'SET_CURRENT_ORDER', payload: order });
  };

  const setUserLocation = (location: { lat: number; lng: number }) => {
    dispatch({ type: 'SET_USER_LOCATION', payload: location });
  };

  const toggleLike = (productId: string) => {
    dispatch({ type: 'TOGGLE_LIKE', payload: { productId } });
  };

  const shareProduct = async (product: Product) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.title,
          text: product.description || '',
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({ title: 'Link Copied', description: 'Product link copied to clipboard' });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const value = {
    state,
    dispatch,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    setStore,
    setCurrentOrder,
    setUserLocation,
    toggleLike,
    shareProduct,
    cartTotal: state.cart.reduce((total, item) => total + item.price * item.quantity, 0),
    likedProducts: state.likedProducts
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

export { AppProvider, useAppContext };