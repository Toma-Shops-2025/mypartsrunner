import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { CartProvider } from "@/contexts/CartContext";
import { MessagingProvider } from "@/contexts/MessagingContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";

import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/DashboardPage";
import BrowsePage from "@/pages/BrowsePage";
import CartPage from "@/pages/CartPage";
import WishlistPage from "@/pages/WishlistPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderConfirmationPage from "@/pages/OrderConfirmationPage";
import MapPage from "@/pages/MapPage";
import NotFound from "@/pages/NotFound";
import HowItWorksPage from "@/pages/HowItWorksPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import TermsOfServicePage from "@/pages/TermsOfServicePage";
import AddProductPage from "@/pages/AddProductPage";
import StoreSettingsPage from "@/pages/StoreSettingsPage";
import SafetyGuidePage from "@/pages/SafetyGuidePage";
import CustomerGuidePage from "@/pages/CustomerGuidePage";
import DriverGuidePage from "@/pages/DriverGuidePage";
import MerchantGuidePage from "@/pages/MerchantGuidePage";
import AdminGuidePage from "@/pages/AdminGuidePage";
import ShippingHandlingPage from "@/pages/ShippingHandlingPage";
import MerchantIntegrationPage from "@/pages/MerchantIntegrationPage";
import DriverApplicationPage from "@/pages/DriverApplicationPage";
import MerchantApplicationPage from "@/pages/MerchantApplicationPage";
import AdminDriverReviewPage from "@/pages/AdminDriverReviewPage";
import HelpPage from "@/pages/HelpPage";
import MerchantStripeOnboardingPage from "@/pages/MerchantStripeOnboardingPage";
import DriverStripeOnboardingPage from "@/pages/DriverStripeOnboardingPage";
import { useState, useEffect } from "react";
import Logo from "@/components/Logo";
import AppLayout from "@/components/AppLayout";
import MessagingWidget from "@/components/MessagingWidget";

export default function App() {
  const [globalError, setGlobalError] = useState<string | null>(null);

  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      setGlobalError('An unexpected error occurred. Please refresh the page.');
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      setGlobalError('An unexpected error occurred. Please refresh the page.');
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (globalError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="mb-4">
            <Logo />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{globalError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            🔄 Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <AppProvider>
        <CartProvider>
          <MessagingProvider>
            <TooltipProvider>
              <BrowserRouter>
                <AppLayout>
                  <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/browse" element={<BrowsePage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                  <Route path="/map" element={<MapPage />} />
                  <Route path="/how-it-works" element={<HowItWorksPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                  <Route path="/add-product" element={<AddProductPage />} />
                  <Route path="/store-settings" element={<StoreSettingsPage />} />
                  <Route path="/safety-guide" element={<SafetyGuidePage />} />
                  <Route path="/customer-guide" element={<CustomerGuidePage />} />
                  <Route path="/driver-guide" element={<DriverGuidePage />} />
                  <Route path="/merchant-guide" element={<MerchantGuidePage />} />
                  <Route path="/admin-guide" element={<AdminGuidePage />} />
                  <Route path="/shipping-handling" element={<ShippingHandlingPage />} />
                  <Route path="/merchant-integration" element={<MerchantIntegrationPage />} />
                  <Route path="/driver-application" element={<DriverApplicationPage />} />
                  <Route path="/admin/driver-review" element={<AdminDriverReviewPage />} />
                  <Route path="/merchant-application" element={<MerchantApplicationPage />} />
                  <Route path="/merchant-stripe-onboarding" element={<MerchantStripeOnboardingPage />} />
                  <Route path="/driver-stripe-onboarding" element={<DriverStripeOnboardingPage />} />
                  <Route path="/help" element={<HelpPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AppLayout>
              <MessagingWidget />
            </BrowserRouter>
          </TooltipProvider>
        </MessagingProvider>
      </CartProvider>
    </AppProvider>
    </div>
  );
}
