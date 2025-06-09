import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { AppProvider } from "./contexts/AppContext";
import { AuthProvider } from "./contexts/AuthContext";
// import TomaBot from "./components/TomaBot/TomaBot";
import ErrorBoundary from "./pages/ErrorBoundary";
import Index from "./pages/Index";
import VideoFeed from "./pages/VideoFeed";
import SellItem from "./pages/SellItem";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import HowItWorks from "./pages/HowItWorks";
import WhyChoose from "./pages/WhyChoose";
import FAQ from "./pages/FAQ";
import SafetyGuide from "./pages/SafetyGuide";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Shipping from "./pages/Shipping";
import ProjectHelp from "./pages/ProjectHelp";
import ProjectLocation from "./pages/ProjectLocation";
import AndroidDownloads from "./pages/AndroidDownloads";
import CodeAccess from "./pages/CodeAccess";
import ProjectSaverPage from "./pages/ProjectSaver";
import StripeSettings from "./pages/StripeSettings";
import Admin from "./pages/Admin";
import PaymentTesting from "./pages/PaymentTesting";
import AdSpaceMarketplace from "./components/AdSpaceMarketplace";
import AdvertiserDashboard from "./components/AdvertiserDashboard";
import Advertise from './pages/Advertise';
import { Suspense, lazy } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { MapProvider } from './contexts/MapContext';
import { Metadata } from './components/Metadata';
import { Layout } from './components/Layout';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { CartProvider } from './contexts/CartContext';
import { Header } from './components/Header';
import { ErrorFallback } from './components/ErrorBoundary';
import { NotificationProvider } from './contexts/NotificationContext';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

const queryClient = new QueryClient();

// Lazy-loaded components
const Home = lazy(() => import('./pages/Home'));
const CustomerDashboard = lazy(() => import('./pages/customer/Dashboard'));
const MerchantDashboard = lazy(() => import('./pages/merchant/Dashboard'));
const RunnerDashboard = lazy(() => import('./pages/runner/Dashboard'));

const App = () => (
  <ReactErrorBoundary FallbackComponent={ErrorFallback}>
    <ThemeProvider defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          <CartProvider>
            <HelmetProvider>
              <AuthProvider>
                <AppProvider>
                  <MapProvider>
                    <Metadata />
                    <TooltipProvider>
                      <Toaster />
                      <Sonner />
                      <Router>
                        <Layout>
                          <Suspense fallback={
                            <div className="flex items-center justify-center min-h-screen">
                              <LoadingSpinner size="lg" />
                            </div>
                          }>
                            <Routes>
                              {/* Public Routes */}
                              <Route path="/" element={<Home />} />
                              
                              {/* Customer Routes */}
                              <Route path="/customer/*" element={<CustomerDashboard />} />
                              
                              {/* Merchant Routes */}
                              <Route path="/merchant/*" element={<MerchantDashboard />} />
                              
                              {/* Runner Routes */}
                              <Route path="/runner/*" element={<RunnerDashboard />} />
                            </Routes>
                          </Suspense>
                        </Layout>
                      </Router>
                    </TooltipProvider>
                  </MapProvider>
                </AppProvider>
              </AuthProvider>
            </HelmetProvider>
          </CartProvider>
        </NotificationProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </ReactErrorBoundary>
);

export default App;