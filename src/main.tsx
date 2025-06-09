import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { registerServiceWorker, listenForInstallPrompt } from './utils/pwa';

// Register service worker
registerServiceWorker();

// Store the install prompt for later use
let deferredPrompt: BeforeInstallPromptEvent | null = null;

// Listen for install prompt
listenForInstallPrompt((e) => {
  deferredPrompt = e;
  // You can show your install button/prompt here
  // For example: showInstallPrompt();
});

// Make deferredPrompt available globally for use in components
declare global {
  interface Window {
    deferredPrompt: BeforeInstallPromptEvent | null;
  }
}
window.deferredPrompt = deferredPrompt;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);