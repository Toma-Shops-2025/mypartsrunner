export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/',
      });

      if (registration.installing) {
        console.log('Service worker installing');
      } else if (registration.waiting) {
        console.log('Service worker installed');
      } else if (registration.active) {
        console.log('Service worker active');
      }

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, show update prompt
              showUpdatePrompt();
            }
          });
        }
      });
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  }
}

export async function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.unregister();
      console.log('Service worker unregistered');
    } catch (error) {
      console.error('Service worker unregistration failed:', error);
    }
  }
}

export function showUpdatePrompt() {
  // You can implement your own UI for this
  const shouldUpdate = window.confirm(
    'A new version of MyPartsRunner is available. Would you like to update?'
  );

  if (shouldUpdate) {
    window.location.reload();
  }
}

export async function requestNotificationPermission() {
  if ('Notification' in window) {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        subscribeToPushNotifications();
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  }
}

async function subscribeToPushNotifications() {
  try {
    const registration = await navigator.serviceWorker.ready;
    
    // Replace with your VAPID public key
    const publicKey = process.env.VITE_VAPID_PUBLIC_KEY;
    
    if (publicKey) {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      // Send the subscription to your server
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });
    }
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
  }
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Check if the app is installed
export function isAppInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches;
}

// Listen for beforeinstallprompt event
export function listenForInstallPrompt(callback: (event: BeforeInstallPromptEvent) => void) {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    callback(e as BeforeInstallPromptEvent);
  });
} 