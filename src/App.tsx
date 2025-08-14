import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AppProvider } from "@/contexts/AppContext";
import { CartProvider } from "@/contexts/CartContext";
import AppLayout from "@/components/AppLayout";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import HowItWorksPage from "@/pages/HowItWorksPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import TermsOfServicePage from "@/pages/TermsOfServicePage";
import SafetyGuidePage from "@/pages/SafetyGuidePage";
import ShippingHandlingPage from "@/pages/ShippingHandlingPage";
import NotFound from "@/pages/NotFound";
import RegisterPage from "@/pages/RegisterPage";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import MapPage from "@/pages/MapPage";
import AddProductPage from "@/pages/AddProductPage";
import StoreSettingsPage from "@/pages/StoreSettingsPage";
import WishlistPage from "@/pages/WishlistPage";
import BrowsePage from "@/pages/BrowsePage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderConfirmationPage from "@/pages/OrderConfirmationPage";
import CustomerGuidePage from "@/pages/CustomerGuidePage";
import DriverGuidePage from "@/pages/DriverGuidePage";
import MerchantGuidePage from "@/pages/MerchantGuidePage";
import AdminGuidePage from "@/pages/AdminGuidePage";
import DriverApplicationPage from "@/pages/DriverApplicationPage";
import DriverStatusPage from "@/pages/DriverStatusPage";
import AdminDriverReviewPage from "@/pages/AdminDriverReviewPage";
import MerchantApplicationPage from "@/pages/MerchantApplicationPage";
import HelpPage from "@/pages/HelpPage";
import StripeConnectTestPage from "@/pages/StripeConnectTestPage";
import { useState, useEffect } from "react";
import Logo from "@/components/Logo";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [globalError, setGlobalError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading time and ensure everything is ready
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Add global error handler
    const handleGlobalError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      setGlobalError('Something went wrong. Please refresh the page.');
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      setGlobalError('Something went wrong. Please refresh the page.');
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  if (globalError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-6 flex justify-center">
            <Logo size="large" withText={true} />
          </div>
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Oops! Something went wrong</h2>
          <p className="text-muted-foreground mb-6">{globalError}</p>
          <button
            onClick={handleRefresh}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <Logo size="large" withText={true} />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading MyPartsRunner...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="light">
      <AppProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppLayout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/how-it-works" element={<HowItWorksPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                  <Route path="/safety-guide" element={<SafetyGuidePage />} />
                  <Route path="/shipping-handling" element={<ShippingHandlingPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/map" element={<MapPage />} />
                  <Route path="/add-product" element={<AddProductPage />} />
                  <Route path="/store-settings" element={<StoreSettingsPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/browse" element={<BrowsePage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                  <Route path="/customer-guide" element={<CustomerGuidePage />} />
                  <Route path="/driver-guide" element={<DriverGuidePage />} />
                  <Route path="/merchant-guide" element={<MerchantGuidePage />} />
                  <Route path="/admin-guide" element={<AdminGuidePage />} />
                  <Route path="/driver-application" element={<DriverApplicationPage />} />
                  <Route path="/driver-status" element={<DriverStatusPage />} />
                  <Route path="/admin/driver-review" element={<AdminDriverReviewPage />} />
                  <Route path="/merchant-application" element={<MerchantApplicationPage />} />
                  <Route path="/help" element={<HelpPage />} />
                  <Route path="/stripe-connect-test" element={<StripeConnectTestPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AppLayout>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AppProvider>
    </ThemeProvider>
  );
};

export default App;