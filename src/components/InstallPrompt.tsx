import { useState, useEffect } from 'react';
import { isAppInstalled } from '@/utils/pwa';
import { Button } from './ui/button';

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Only show if not already installed
    if (!isAppInstalled()) {
      const handler = () => {
        if (window.deferredPrompt) {
          setShowPrompt(true);
        }
      };

      window.addEventListener('beforeinstallprompt', handler);
      
      // Check if we already have a deferred prompt
      if (window.deferredPrompt) {
        setShowPrompt(true);
      }

      return () => {
        window.removeEventListener('beforeinstallprompt', handler);
      };
    }
  }, []);

  const handleInstall = async () => {
    const promptEvent = window.deferredPrompt;
    
    if (promptEvent) {
      // Show the install prompt
      await promptEvent.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await promptEvent.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      // Clear the deferredPrompt
      window.deferredPrompt = null;
      setShowPrompt(false);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-lg shadow-lg p-4 border border-gray-200 animate-slide-up">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">Install MyPartsRunner</h3>
          <p className="text-muted-foreground text-sm">
            Install our app for a better experience with quick access and offline capabilities.
          </p>
        </div>
        <button
          onClick={() => setShowPrompt(false)}
          className="text-gray-400 hover:text-gray-500"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="mt-4 flex gap-3">
        <Button
          onClick={handleInstall}
          className="flex-1 bg-brand-blue hover:bg-brand-blue-dark text-white"
        >
          Install Now
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowPrompt(false)}
          className="flex-1"
        >
          Maybe Later
        </Button>
      </div>
    </div>
  );
} 