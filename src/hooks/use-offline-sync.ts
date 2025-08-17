import { useState, useEffect, useCallback } from 'react';

interface OfflineData {
  id: string;
  type: 'order' | 'delivery' | 'message' | 'location' | 'photo' | 'profile';
  data: any;
  timestamp: string;
  syncStatus: 'pending' | 'syncing' | 'synced' | 'failed';
  retryCount: number;
  action: 'create' | 'update' | 'delete';
}

interface OfflineSyncOptions {
  maxRetries?: number;
  retryDelay?: number;
  syncOnConnect?: boolean;
  enableCompression?: boolean;
}

interface UseOfflineSyncReturn {
  isOnline: boolean;
  pendingItems: OfflineData[];
  syncProgress: number;
  queueData: (data: Omit<OfflineData, 'id' | 'timestamp' | 'syncStatus' | 'retryCount'>) => void;
  syncAll: () => Promise<void>;
  clearSynced: () => void;
  getQueueSize: () => number;
  retryFailed: () => Promise<void>;
}

const STORAGE_KEY = 'mypartsrunner_offline_queue';
const MAX_QUEUE_SIZE = 1000;
const DEFAULT_OPTIONS: Required<OfflineSyncOptions> = {
  maxRetries: 3,
  retryDelay: 5000,
  syncOnConnect: true,
  enableCompression: false
};

export const useOfflineSync = (options: OfflineSyncOptions = {}): UseOfflineSyncReturn => {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingItems, setPendingItems] = useState<OfflineData[]>([]);
  const [syncProgress, setSyncProgress] = useState(0);

  // Load queue from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const queue = JSON.parse(saved) as OfflineData[];
        setPendingItems(queue);
      } catch (error) {
        console.error('Failed to load offline queue:', error);
      }
    }
  }, []);

  // Save queue to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pendingItems));
  }, [pendingItems]);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (config.syncOnConnect) {
        syncAll();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [config.syncOnConnect]);

  // Generate unique ID
  const generateId = (): string => {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Queue data for offline sync
  const queueData = useCallback((data: Omit<OfflineData, 'id' | 'timestamp' | 'syncStatus' | 'retryCount'>) => {
    const item: OfflineData = {
      ...data,
      id: generateId(),
      timestamp: new Date().toISOString(),
      syncStatus: 'pending',
      retryCount: 0
    };

    setPendingItems(prev => {
      // Check queue size limit
      if (prev.length >= MAX_QUEUE_SIZE) {
        console.warn('Offline queue is full, removing oldest items');
        return [...prev.slice(1), item];
      }
      return [...prev, item];
    });

    // Try immediate sync if online
    if (isOnline) {
      syncItem(item);
    }
  }, [isOnline]);

  // Sync individual item
  const syncItem = async (item: OfflineData): Promise<boolean> => {
    try {
      setPendingItems(prev => 
        prev.map(p => p.id === item.id ? { ...p, syncStatus: 'syncing' } : p)
      );

      // Simulate API call based on item type and action
      const success = await performSync(item);

      if (success) {
        setPendingItems(prev => 
          prev.map(p => p.id === item.id ? { ...p, syncStatus: 'synced' } : p)
        );
        return true;
      } else {
        throw new Error('Sync failed');
      }
    } catch (error) {
      console.error(`Failed to sync item ${item.id}:`, error);
      
      setPendingItems(prev => 
        prev.map(p => p.id === item.id ? { 
          ...p, 
          syncStatus: 'failed',
          retryCount: p.retryCount + 1
        } : p)
      );
      return false;
    }
  };

  // Perform actual sync operation
  const performSync = async (item: OfflineData): Promise<boolean> => {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    // Simulate network delay
    await delay(Math.random() * 1000 + 500);

    switch (item.type) {
      case 'order':
        return await syncOrder(item);
      case 'delivery':
        return await syncDelivery(item);
      case 'message':
        return await syncMessage(item);
      case 'location':
        return await syncLocation(item);
      case 'photo':
        return await syncPhoto(item);
      case 'profile':
        return await syncProfile(item);
      default:
        console.warn('Unknown sync type:', item.type);
        return false;
    }
  };

  // Sync specific data types
  const syncOrder = async (item: OfflineData): Promise<boolean> => {
    try {
      // In production, make actual API call
      console.log('Syncing order:', item.data);
      
      // Simulate success/failure
      return Math.random() > 0.1; // 90% success rate
    } catch (error) {
      return false;
    }
  };

  const syncDelivery = async (item: OfflineData): Promise<boolean> => {
    try {
      console.log('Syncing delivery:', item.data);
      return Math.random() > 0.05; // 95% success rate
    } catch (error) {
      return false;
    }
  };

  const syncMessage = async (item: OfflineData): Promise<boolean> => {
    try {
      console.log('Syncing message:', item.data);
      return Math.random() > 0.02; // 98% success rate
    } catch (error) {
      return false;
    }
  };

  const syncLocation = async (item: OfflineData): Promise<boolean> => {
    try {
      console.log('Syncing location:', item.data);
      return Math.random() > 0.01; // 99% success rate
    } catch (error) {
      return false;
    }
  };

  const syncPhoto = async (item: OfflineData): Promise<boolean> => {
    try {
      console.log('Syncing photo:', item.data);
      // Photos might fail more often due to size
      return Math.random() > 0.15; // 85% success rate
    } catch (error) {
      return false;
    }
  };

  const syncProfile = async (item: OfflineData): Promise<boolean> => {
    try {
      console.log('Syncing profile:', item.data);
      return Math.random() > 0.03; // 97% success rate
    } catch (error) {
      return false;
    }
  };

  // Sync all pending items
  const syncAll = useCallback(async (): Promise<void> => {
    if (!isOnline) {
      console.log('Cannot sync: offline');
      return;
    }

    const itemsToSync = pendingItems.filter(item => 
      item.syncStatus === 'pending' || 
      (item.syncStatus === 'failed' && item.retryCount < config.maxRetries)
    );

    if (itemsToSync.length === 0) {
      setSyncProgress(100);
      return;
    }

    setSyncProgress(0);
    let completed = 0;

    // Sync items in batches to avoid overwhelming the server
    const batchSize = 5;
    for (let i = 0; i < itemsToSync.length; i += batchSize) {
      const batch = itemsToSync.slice(i, i + batchSize);
      
      await Promise.allSettled(
        batch.map(async (item) => {
          const success = await syncItem(item);
          if (!success && item.retryCount < config.maxRetries) {
            // Schedule retry
            setTimeout(() => {
              syncItem(item);
            }, config.retryDelay * (item.retryCount + 1));
          }
          completed++;
          setSyncProgress((completed / itemsToSync.length) * 100);
        })
      );

      // Small delay between batches
      if (i + batchSize < itemsToSync.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }, [isOnline, pendingItems, config.maxRetries, config.retryDelay]);

  // Clear synced items
  const clearSynced = useCallback(() => {
    setPendingItems(prev => prev.filter(item => item.syncStatus !== 'synced'));
  }, []);

  // Get queue size
  const getQueueSize = useCallback(() => {
    return pendingItems.length;
  }, [pendingItems]);

  // Retry failed items
  const retryFailed = useCallback(async (): Promise<void> => {
    const failedItems = pendingItems.filter(item => item.syncStatus === 'failed');
    
    for (const item of failedItems) {
      if (item.retryCount < config.maxRetries) {
        await syncItem(item);
      }
    }
  }, [pendingItems, config.maxRetries]);

  return {
    isOnline,
    pendingItems,
    syncProgress,
    queueData,
    syncAll,
    clearSynced,
    getQueueSize,
    retryFailed
  };
};

// Hook for offline storage with automatic sync
export const useOfflineStorage = <T>(key: string, defaultValue: T) => {
  const [data, setData] = useState<T>(defaultValue);
  const { queueData } = useOfflineSync();

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        setData(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load from offline storage:', error);
    }
  }, [key]);

  // Save to localStorage and queue for sync
  const updateData = useCallback((newData: T) => {
    setData(newData);
    localStorage.setItem(key, JSON.stringify(newData));
    
    // Queue for sync
    queueData({
      type: 'profile',
      data: { key, value: newData },
      action: 'update'
    });
  }, [key, queueData]);

  return [data, updateData] as const;
};

// Hook for offline delivery tracking
export const useOfflineDeliveryTracking = () => {
  const { queueData, isOnline } = useOfflineSync();
  const [trackingData, setTrackingData] = useState<any[]>([]);

  const trackLocation = useCallback((location: { lat: number; lng: number; timestamp?: string }) => {
    const tracking = {
      ...location,
      timestamp: location.timestamp || new Date().toISOString(),
      id: `location_${Date.now()}`
    };

    setTrackingData(prev => [...prev, tracking]);

    queueData({
      type: 'location',
      data: tracking,
      action: 'create'
    });
  }, [queueData]);

  const trackDeliveryEvent = useCallback((event: {
    deliveryId: string;
    eventType: 'pickup' | 'delivery' | 'failed' | 'returned';
    timestamp?: string;
    notes?: string;
    photos?: string[];
  }) => {
    const trackingEvent = {
      ...event,
      timestamp: event.timestamp || new Date().toISOString(),
      id: `event_${Date.now()}`
    };

    queueData({
      type: 'delivery',
      data: trackingEvent,
      action: 'create'
    });
  }, [queueData]);

  return {
    trackLocation,
    trackDeliveryEvent,
    trackingData,
    isOnline
  };
};

export default useOfflineSync; 