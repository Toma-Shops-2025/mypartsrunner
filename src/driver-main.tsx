import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '@/contexts/AppContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import DriverApp from './DriverApp';
import DriverLogin from './components/DriverLogin';
import DriverDashboard from './pages/DriverDashboardPage';
import DriverDeliveries from './pages/DriverDeliveriesPage';
import DriverEarnings from './pages/DriverEarningsPage';
import DriverProfile from './pages/DriverProfilePage';
import DriverSupport from './pages/DriverSupportPage';
import DriverNavigation from './pages/DriverNavigationPage';
import './index.css';

// Driver PWA Main Application
const DriverPWA: React.FC = () => {
  return (
    <AppProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            {/* Driver Authentication */}
            <Route path="/login" element={<DriverLogin />} />
            
            {/* Driver App Routes */}
            <Route path="/" element={<DriverApp />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DriverDashboard />} />
              <Route path="deliveries" element={<DriverDeliveries />} />
              <Route path="earnings" element={<DriverEarnings />} />
              <Route path="profile" element={<DriverProfile />} />
              <Route path="navigation" element={<DriverNavigation />} />
              <Route path="support" element={<DriverSupport />} />
            </Route>
            
            {/* Catch all - redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  );
};

// Initialize Driver PWA
const container = document.getElementById('driver-root');
if (container) {
  const root = createRoot(container);
  root.render(<DriverPWA />);
} else {
  console.error('Driver root element not found');
}

// Driver PWA specific initialization
console.log('MyPartsRunner Driver PWA initialized');

// Handle PWA install prompt
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('Driver PWA install prompt ready');
});

// Register for push notifications (future feature)
if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Push notifications supported in Driver PWA');
}

// Handle app shortcuts
const urlParams = new URLSearchParams(window.location.search);
const action = urlParams.get('action');
const view = urlParams.get('view');
const tool = urlParams.get('tool');
const page = urlParams.get('page');

if (action === 'go-online') {
  console.log('Driver PWA opened with go-online shortcut');
}
if (view === 'earnings') {
  console.log('Driver PWA opened with earnings shortcut');
}
if (tool === 'gps') {
  console.log('Driver PWA opened with GPS shortcut');
}
if (page === 'support') {
  console.log('Driver PWA opened with support shortcut');
} 