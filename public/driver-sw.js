const CACHE_NAME = 'mypartsrunner-driver-v1.0.0';
const OFFLINE_URL = '/drivers.html';

// Assets to cache for offline functionality
const CACHE_URLS = [
  '/drivers.html',
  '/driver-manifest.json',
  '/src/driver-main.tsx',
  '/src/DriverApp.tsx',
  '/icons/driver-icon-192x192.png',
  '/icons/driver-icon-512x512.png',
  '/favicon.png',
  // Add other critical assets
];

// Critical API endpoints to cache
const API_CACHE_URLS = [
  '/api/driver/profile',
  '/api/driver/earnings',
  '/api/driver/deliveries'
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('Driver SW: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Driver SW: Caching critical resources');
        return cache.addAll(CACHE_URLS);
      })
      .then(() => {
        console.log('Driver SW: Skip waiting');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Driver SW: Cache installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Driver SW: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName.startsWith('mypartsrunner-driver-')) {
              console.log('Driver SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Driver SW: Claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached content and implement caching strategies
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);
  
  // Handle driver app navigation
  if (url.pathname.startsWith('/drivers') || url.pathname === '/') {
    event.respondWith(
      caches.match('/drivers.html')
        .then((response) => {
          return response || fetch(event.request);
        })
        .catch(() => {
          return caches.match('/drivers.html');
        })
    );
    return;
  }

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful API responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached version if network fails
          return caches.match(event.request)
            .then((response) => {
              if (response) {
                console.log('Driver SW: Serving cached API response');
                return response;
              }
              // Return offline indicator for failed API calls
              return new Response(
                JSON.stringify({ 
                  error: 'Offline', 
                  message: 'API unavailable offline',
                  cached: false 
                }),
                { 
                  status: 503, 
                  headers: { 'Content-Type': 'application/json' } 
                }
              );
            });
        })
    );
    return;
  }

  // Handle static assets with cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        
        return fetch(event.request)
          .then((response) => {
            // Cache valid responses
            if (response.ok && response.headers.get('content-type')) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return response;
          })
          .catch((error) => {
            console.log('Driver SW: Fetch failed, serving offline page');
            // For navigation requests, serve the offline page
            if (event.request.mode === 'navigate') {
              return caches.match('/drivers.html');
            }
            throw error;
          });
      })
  );
});

// Background sync for delivery updates
self.addEventListener('sync', (event) => {
  console.log('Driver SW: Background sync triggered:', event.tag);
  
  if (event.tag === 'delivery-update') {
    event.waitUntil(syncDeliveryUpdates());
  }
  
  if (event.tag === 'location-update') {
    event.waitUntil(syncLocationUpdate());
  }
  
  if (event.tag === 'earnings-sync') {
    event.waitUntil(syncEarningsData());
  }
});

// Push notifications for delivery alerts
self.addEventListener('push', (event) => {
  console.log('Driver SW: Push notification received');
  
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'MyPartsRunner Driver', body: event.data.text() };
    }
  }

  const options = {
    title: data.title || 'MyPartsRunner Driver',
    body: data.body || 'New notification',
    icon: '/icons/driver-icon-192x192.png',
    badge: '/icons/driver-icon-96x96.png',
    tag: data.tag || 'driver-notification',
    data: data.data || {},
    actions: [
      {
        action: 'accept',
        title: 'Accept',
        icon: '/icons/check-icon.png'
      },
      {
        action: 'decline',
        title: 'Decline',
        icon: '/icons/x-icon.png'
      }
    ],
    requireInteraction: data.urgent || false,
    silent: false
  };

  event.waitUntil(
    self.registration.showNotification(options.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Driver SW: Notification clicked:', event.notification.tag);
  
  event.notification.close();
  
  const data = event.notification.data || {};
  let url = '/drivers.html';
  
  // Route to specific pages based on notification type
  if (data.type === 'delivery') {
    url = '/drivers.html#/deliveries';
  } else if (data.type === 'earnings') {
    url = '/drivers.html#/earnings';
  } else if (data.type === 'support') {
    url = '/drivers.html#/support';
  }
  
  // Handle action buttons
  if (event.action === 'accept' && data.deliveryId) {
    // Accept delivery request
    event.waitUntil(
      fetch('/api/driver/deliveries/accept', {
        method: 'POST',
        body: JSON.stringify({ deliveryId: data.deliveryId }),
        headers: { 'Content-Type': 'application/json' }
      }).catch(console.error)
    );
    url = '/drivers.html#/deliveries';
  } else if (event.action === 'decline' && data.deliveryId) {
    // Decline delivery request
    event.waitUntil(
      fetch('/api/driver/deliveries/decline', {
        method: 'POST',
        body: JSON.stringify({ deliveryId: data.deliveryId }),
        headers: { 'Content-Type': 'application/json' }
      }).catch(console.error)
    );
  }

  // Open or focus the app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes('/drivers') && 'focus' in client) {
            client.navigate(url);
            return client.focus();
          }
        }
        // Open new window if app not open
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

// Background sync functions
async function syncDeliveryUpdates() {
  try {
    console.log('Driver SW: Syncing delivery updates...');
    
    // Get pending delivery updates from IndexedDB
    const pendingUpdates = await getPendingDeliveryUpdates();
    
    for (const update of pendingUpdates) {
      try {
        const response = await fetch('/api/driver/deliveries/update', {
          method: 'POST',
          body: JSON.stringify(update),
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
          await removePendingUpdate(update.id);
          console.log('Driver SW: Delivery update synced:', update.id);
        }
      } catch (error) {
        console.error('Driver SW: Failed to sync delivery update:', error);
      }
    }
  } catch (error) {
    console.error('Driver SW: Delivery sync failed:', error);
  }
}

async function syncLocationUpdate() {
  try {
    console.log('Driver SW: Syncing location update...');
    
    // Get current location and sync with server
    const location = await getCurrentLocation();
    
    const response = await fetch('/api/driver/location', {
      method: 'POST',
      body: JSON.stringify(location),
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
      console.log('Driver SW: Location synced');
    }
  } catch (error) {
    console.error('Driver SW: Location sync failed:', error);
  }
}

async function syncEarningsData() {
  try {
    console.log('Driver SW: Syncing earnings data...');
    
    const response = await fetch('/api/driver/earnings/sync', {
      method: 'POST'
    });
    
    if (response.ok) {
      console.log('Driver SW: Earnings data synced');
    }
  } catch (error) {
    console.error('Driver SW: Earnings sync failed:', error);
  }
}

// Helper functions for IndexedDB operations
async function getPendingDeliveryUpdates() {
  // In a real implementation, this would use IndexedDB
  return [];
}

async function removePendingUpdate(id) {
  // Remove from IndexedDB
  console.log('Driver SW: Removed pending update:', id);
}

async function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: Date.now()
        });
      },
      (error) => reject(error),
      { timeout: 10000, enableHighAccuracy: true }
    );
  });
}

// Message handling for communication with main app
self.addEventListener('message', (event) => {
  console.log('Driver SW: Received message:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
  
  if (event.data && event.data.type === 'CACHE_DELIVERY_DATA') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        cache.put('/api/driver/deliveries', new Response(
          JSON.stringify(event.data.deliveries),
          { headers: { 'Content-Type': 'application/json' } }
        ));
      })
    );
  }
});

console.log('Driver SW: Service Worker loaded successfully'); 