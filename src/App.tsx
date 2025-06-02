import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/AuthContext";
import TomaBot from "@/components/TomaBot/TomaBot";
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

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/video-feed" element={<VideoFeed />} />
                <Route path="/feed" element={<VideoFeed />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/sell" element={<SellItem />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/why-choose" element={<WhyChoose />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/safety" element={<SafetyGuide />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/shipping" element={<Shipping />} />
                <Route path="/project-help" element={<ProjectHelp />} />
                <Route path="/project-location" element={<ProjectLocation />} />
                <Route path="/android-downloads" element={<AndroidDownloads />} />
                <Route path="/code-access" element={<CodeAccess />} />
                <Route path="/project-saver" element={<ProjectSaverPage />} />
                <Route path="/stripe-settings" element={<StripeSettings />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/payment-testing" element={<PaymentTesting />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <TomaBot />
            </BrowserRouter>
          </TooltipProvider>
        </AppProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;