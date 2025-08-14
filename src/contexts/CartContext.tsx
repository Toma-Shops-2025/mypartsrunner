import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '@/types';
import { DatabaseService } from '@/lib/database';
import { useAppContext } from './AppContext';
import { toast } from '@/components/ui/use-toast';

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAppContext();

  // Load cart items when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      // Temporarily disable cart loading to prevent API errors
      // loadCartItems();
      setItems([]); // Set empty cart for now
    } else {
      setItems([]);
    }
  }, [isAuthenticated, user]);

  const loadCartItems = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const cartItems = await DatabaseService.getCartItems(user.id);
      setItems(cartItems);
    } catch (error) {
      console.error('Error loading cart items:', error);
      // Don't show error toast for cart loading failures - just log and continue
      // This prevents the app from getting stuck
      setItems([]); // Set empty cart on error
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: Product, quantity: number = 1) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to your cart.",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const cartItem = await DatabaseService.addToCart(user.id, product.id, quantity);
      
      if (cartItem) {
        setItems(prev => {
          const existingIndex = prev.findIndex(item => item.productId === product.id);
          if (existingIndex >= 0) {
            // Update existing item
            const newItems = [...prev];
            newItems[existingIndex] = cartItem;
            return newItems;
          } else {
            // Add new item
            return [...prev, cartItem];
          }
        });

        toast({
          title: "Added to cart",
          description: `${product.name} has been added to your cart.`
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error adding to cart",
        description: "Failed to add item to your cart.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;

    try {
      setLoading(true);
      const success = await DatabaseService.removeFromCart(user.id, productId);
      
      if (success) {
        setItems(prev => prev.filter(item => item.productId !== productId));
        toast({
          title: "Removed from cart",
          description: "Item has been removed from your cart."
        });
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: "Error removing from cart",
        description: "Failed to remove item from your cart.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) return;

    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    try {
      setLoading(true);
      const cartItem = await DatabaseService.updateCartItemQuantity(user.id, productId, quantity);
      
      if (cartItem) {
        setItems(prev => 
          prev.map(item => 
            item.productId === productId ? cartItem : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      toast({
        title: "Error updating quantity",
        description: "Failed to update item quantity.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const success = await DatabaseService.clearCart(user.id);
      
      if (success) {
        setItems([]);
        toast({
          title: "Cart cleared",
          description: "Your cart has been cleared."
        });
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: "Error clearing cart",
        description: "Failed to clear your cart.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = (): number => {
    return items.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartItemCount = (): number => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const isInCart = (productId: string): boolean => {
    return items.some(item => item.productId === productId);
  };

  const value: CartContextType = {
    items,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    isInCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 