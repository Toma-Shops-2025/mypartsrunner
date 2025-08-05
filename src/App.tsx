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
import MerchantApplicationPage from "@/pages/MerchantApplicationPage";

const App = () => (
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
                <Route path="/merchant-application" element={<MerchantApplicationPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AppProvider>
  </ThemeProvider>
);

export default App;