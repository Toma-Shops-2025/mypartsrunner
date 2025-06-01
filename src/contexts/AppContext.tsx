import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface CartItem {
  id: string;
  productId?: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  cartItems: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  updateCartItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  likedProducts: string[];
  toggleLike: (productId: string) => void;
  shareProduct: (product: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [likedProducts, setLikedProducts] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`cart_${user.id}`);
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
          setCartItems([]);
        }
      }
      
      const savedLikes = localStorage.getItem(`likes_${user.id}`);
      if (savedLikes) {
        try {
          setLikedProducts(JSON.parse(savedLikes));
        } catch (error) {
          console.error('Error loading likes from localStorage:', error);
          setLikedProducts([]);
        }
      }
    } else {
      setCartItems([]);
      setLikedProducts([]);
    }
  }, [user]);

  useEffect(() => {
    if (user && cartItems.length >= 0) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  useEffect(() => {
    if (user && likedProducts.length >= 0) {
      localStorage.setItem(`likes_${user.id}`, JSON.stringify(likedProducts));
    }
  }, [likedProducts, user]);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const addToCart = (product: any) => {
    if (!user) {
      toast({ title: 'Please sign in', description: 'You need to be signed in to add items to cart', variant: 'destructive' });
      return;
    }

    try {
      const existingItem = cartItems.find(item => item.productId === product.id || item.id === product.id);
      if (existingItem) {
        setCartItems(cartItems.map(item => 
          (item.productId === product.id || item.id === product.id)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        const newItem: CartItem = {
          id: product.id || uuidv4(),
          productId: product.id,
          title: product.title,
          price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
          quantity: product.quantity || 1,
          image: product.thumbnail_url || product.image_url || product.image || '/placeholder.svg'
        };
        setCartItems(prev => [...prev, newItem]);
      }
      toast({ title: 'Added to cart', description: `${product.title} added to cart` });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({ title: 'Error', description: 'Failed to add item to cart', variant: 'destructive' });
    }
  };

  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id && item.productId !== id));
    toast({ title: 'Removed from cart', description: 'Item removed from cart' });
  };

  const updateCartItemQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setCartItems(cartItems.map(item => 
      (item.id === id || item.productId === id)
        ? { ...item, quantity }
        : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
    if (user) {
      localStorage.removeItem(`cart_${user.id}`);
    }
  };

  const cartTotal = cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  const toggleLike = (productId: string) => {
    if (!user) {
      toast({ title: 'Please sign in', description: 'You need to be signed in to like products', variant: 'destructive' });
      return;
    }

    const isLiked = likedProducts.includes(productId);
    setLikedProducts(prev => 
      isLiked 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
    toast({ 
      title: isLiked ? 'Removed from favorites' : 'Added to favorites'
    });
  };

  const shareProduct = (product: any) => {
    try {
      const productUrl = `${window.location.origin}/product/${product.id}`;
      
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(productUrl).then(() => {
          toast({ title: 'Link copied to clipboard', description: 'Share this product with others!' });
        }).catch(() => {
          toast({ title: 'Share failed', description: 'Unable to copy link', variant: 'destructive' });
        });
      } else {
        toast({ title: 'Share not supported', description: 'Your browser does not support sharing' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to share product', variant: 'destructive' });
    }
  };

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        cartTotal,
        likedProducts,
        toggleLike,
        shareProduct,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};