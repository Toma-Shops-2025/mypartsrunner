import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trash2, Minus, Plus, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAppContext } from '@/contexts/AppContext';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, loading, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { isAuthenticated } = useAppContext();

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = async (productId: string) => {
    await removeFromCart(productId);
  };

  const handleClearCart = async () => {
    await clearCart();
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // Navigate to checkout page (to be implemented)
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/browse');
  };

  if (loading) {
    return (
      <div className="min-h-screen animated-bg flex items-center justify-center">
        <div className="glass-card p-8 border border-cyan-400/30 glow-card">
          <div className="flex items-center gap-4">
            <div className="neon-spinner w-8 h-8"></div>
            <span className="text-white text-lg">Loading your cart...</span>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen animated-bg flex items-center justify-center">
        <div className="glass-card p-12 border border-cyan-400/30 glow-card text-center max-w-md">
          <ShoppingCart className="h-20 w-20 mx-auto text-cyan-400 mb-6 pulse-neon" />
          <h2 className="text-3xl font-bold text-white mb-4">
            <span className="gradient-text">Your cart is empty</span>
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Looks like you haven't added any items to your cart yet. Start browsing our amazing auto parts!
          </p>
          <Button onClick={handleContinueShopping} className="neon-button text-base px-8 py-3 h-auto">
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-bg">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-cyan-400 rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-10 animate-pulse animation-delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mr-4 text-gray-300 hover:text-cyan-400 hover:bg-cyan-400/20 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
                    <h1 className="text-4xl font-bold">
            <span className="gradient-text">Shopping</span>{' '}
            <span className="neon-text">Cart</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Cart Items ({items.length})</CardTitle>
                  <Button variant="outline" size="sm" onClick={handleClearCart}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Cart
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.product?.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.product?.description}
                        </p>
                        <div className="flex items-center mt-2">
                          <Badge variant="secondary" className="mr-2">
                            {item.product?.category}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            SKU: {item.product?.sku || 'N/A'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value) && value > 0) {
                              handleQuantityChange(item.productId, value);
                            }
                          }}
                          className="w-16 text-center"
                          min="1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold">
                          ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ${(item.product?.price || 0).toFixed(2)} each
                        </p>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.productId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({getCartTotal().toFixed(2)} items)</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8.25%)</span>
                    <span>${(getCartTotal() * 0.0825).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>$5.99</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${(getCartTotal() * 1.0825 + 5.99).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleCheckout}
                    disabled={!isAuthenticated}
                  >
                    {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleContinueShopping}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage; 