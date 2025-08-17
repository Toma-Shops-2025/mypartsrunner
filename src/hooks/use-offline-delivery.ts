import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';

interface DeliveryUpdate {
  id: string;
  deliveryId: string;
  status: 'picked_up' | 'in_transit' | 'delivered' | 'failed';
  timestamp: number;
  location?: {
    latitude: number;
    longitude: number;
  };
  photos?: string[];
  notes?: string;
  signature?: string;
  synced: boolean;
}

interface OfflineDelivery {
  id: string;
  customerName: string;
  pickupAddress: string;
  deliveryAddress: string;
  items: string[];
  payAmount: number;
  tips: number;
  status: string;
  localUpdates: DeliveryUpdate[];
  lastSynced: number;
}

const STORAGE_KEY = 'driver_offline_deliveries';
const UPDATES_KEY = 'driver_pending_updates';

export const useOfflineDelivery = () => {
  const [offlineDeliveries, setOfflineDeliveries] = useState<OfflineDelivery[]>([]);
  const [pendingUpdates, setPendingUpdates] = useState<DeliveryUpdate[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const { toast } = useToast();

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Back Online",
        description: "Syncing pending updates...",
      });
      syncPendingUpdates();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Offline Mode",
        description: "Your updates will be saved locally and synced when back online.",
        variant: "destructive"
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  // Load offline data on mount
  useEffect(() => {
    loadOfflineData();
  }, []);

  // Auto-sync when online
  useEffect(() => {
    if (isOnline && pendingUpdates.length > 0) {
      syncPendingUpdates();
    }
  }, [isOnline, pendingUpdates.length]);

  const loadOfflineData = useCallback(() => {
    try {
      const deliveriesData = localStorage.getItem(STORAGE_KEY);
      const updatesData = localStorage.getItem(UPDATES_KEY);

      if (deliveriesData) {
        setOfflineDeliveries(JSON.parse(deliveriesData));
      }

      if (updatesData) {
        setPendingUpdates(JSON.parse(updatesData));
      }
    } catch (error) {
      console.error('Failed to load offline data:', error);
    }
  }, []);

  const saveOfflineData = useCallback((deliveries: OfflineDelivery[], updates: DeliveryUpdate[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(deliveries));
      localStorage.setItem(UPDATES_KEY, JSON.stringify(updates));
    } catch (error) {
      console.error('Failed to save offline data:', error);
      toast({
        title: "Storage Error",
        description: "Failed to save data locally. Please free up storage space.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const cacheDelivery = useCallback(async (delivery: any) => {
    const offlineDelivery: OfflineDelivery = {
      id: delivery.id,
      customerName: delivery.customerName,
      pickupAddress: delivery.pickupAddress,
      deliveryAddress: delivery.deliveryAddress,
      items: delivery.items || [],
      payAmount: delivery.payAmount || 0,
      tips: delivery.tips || 0,
      status: delivery.status,
      localUpdates: [],
      lastSynced: Date.now()
    };

    const updated = [...offlineDeliveries.filter(d => d.id !== delivery.id), offlineDelivery];
    setOfflineDeliveries(updated);
    saveOfflineData(updated, pendingUpdates);

    return offlineDelivery;
  }, [offlineDeliveries, pendingUpdates, saveOfflineData]);

  const updateDeliveryStatus = useCallback(async (
    deliveryId: string,
    status: DeliveryUpdate['status'],
    options: {
      location?: { latitude: number; longitude: number };
      photos?: string[];
      notes?: string;
      signature?: string;
    } = {}
  ) => {
    const update: DeliveryUpdate = {
      id: `update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      deliveryId,
      status,
      timestamp: Date.now(),
      location: options.location,
      photos: options.photos,
      notes: options.notes,
      signature: options.signature,
      synced: false
    };

    // Update local delivery
    const updatedDeliveries = offlineDeliveries.map(delivery => {
      if (delivery.id === deliveryId) {
        return {
          ...delivery,
          status,
          localUpdates: [...delivery.localUpdates, update]
        };
      }
      return delivery;
    });

    const updatedPendingUpdates = [...pendingUpdates, update];

    setOfflineDeliveries(updatedDeliveries);
    setPendingUpdates(updatedPendingUpdates);
    saveOfflineData(updatedDeliveries, updatedPendingUpdates);

    toast({
      title: `Delivery ${status.replace('_', ' ')}`,
      description: isOnline ? "Syncing with server..." : "Saved locally, will sync when online"
    });

    // Try to sync immediately if online
    if (isOnline) {
      try {
        await syncSingleUpdate(update);
      } catch (error) {
        console.error('Failed to sync update:', error);
      }
    }

    return update;
  }, [offlineDeliveries, pendingUpdates, saveOfflineData, isOnline, toast]);

  const syncSingleUpdate = useCallback(async (update: DeliveryUpdate) => {
    try {
      const response = await fetch('/api/driver/deliveries/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(update)
      });

      if (response.ok) {
        // Mark as synced
        const updatedPendingUpdates = pendingUpdates.map(u => 
          u.id === update.id ? { ...u, synced: true } : u
        ).filter(u => !u.synced);

        setPendingUpdates(updatedPendingUpdates);
        saveOfflineData(offlineDeliveries, updatedPendingUpdates);

        return true;
      }
      throw new Error(`Sync failed: ${response.status}`);
    } catch (error) {
      console.error('Failed to sync update:', error);
      return false;
    }
  }, [pendingUpdates, offlineDeliveries, saveOfflineData]);

  const syncPendingUpdates = useCallback(async () => {
    if (syncInProgress || pendingUpdates.length === 0) return;

    setSyncInProgress(true);
    let syncedCount = 0;

    try {
      for (const update of pendingUpdates.filter(u => !u.synced)) {
        const success = await syncSingleUpdate(update);
        if (success) {
          syncedCount++;
        }
      }

      if (syncedCount > 0) {
        toast({
          title: "Sync Complete",
          description: `${syncedCount} update(s) synced successfully`
        });
      }
    } catch (error) {
      console.error('Sync failed:', error);
      toast({
        title: "Sync Failed",
        description: "Some updates could not be synced. Will retry automatically.",
        variant: "destructive"
      });
    } finally {
      setSyncInProgress(false);
    }
  }, [syncInProgress, pendingUpdates, syncSingleUpdate, toast]);

  const takeDeliveryPhoto = useCallback(async (deliveryId: string): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      // Create a file input for camera access
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment'; // Use rear camera

      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) {
          reject(new Error('No file selected'));
          return;
        }

        try {
          // Convert to base64 for offline storage
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result as string;
            
            // Store photo locally
            const photoKey = `delivery_photo_${deliveryId}_${Date.now()}`;
            try {
              localStorage.setItem(photoKey, base64);
              resolve([photoKey]);
            } catch (error) {
              console.error('Failed to store photo:', error);
              reject(error);
            }
          };
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        } catch (error) {
          reject(error);
        }
      };

      input.click();
    });
  }, []);

  const getStoredPhoto = useCallback((photoKey: string): string | null => {
    try {
      return localStorage.getItem(photoKey);
    } catch (error) {
      console.error('Failed to retrieve photo:', error);
      return null;
    }
  }, []);

  const clearOfflineData = useCallback(() => {
    setOfflineDeliveries([]);
    setPendingUpdates([]);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(UPDATES_KEY);
    
    // Clear photos
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('delivery_photo_')) {
        localStorage.removeItem(key);
      }
    }
  }, []);

  const getDeliveryById = useCallback((deliveryId: string) => {
    return offlineDeliveries.find(d => d.id === deliveryId);
  }, [offlineDeliveries]);

  const getPendingUpdatesCount = useCallback(() => {
    return pendingUpdates.filter(u => !u.synced).length;
  }, [pendingUpdates]);

  return {
    // State
    offlineDeliveries,
    pendingUpdates: pendingUpdates.filter(u => !u.synced),
    isOnline,
    syncInProgress,
    
    // Actions
    cacheDelivery,
    updateDeliveryStatus,
    syncPendingUpdates,
    takeDeliveryPhoto,
    getStoredPhoto,
    clearOfflineData,
    getDeliveryById,
    getPendingUpdatesCount,
    
    // Utilities
    hasUnsyncedData: pendingUpdates.some(u => !u.synced),
    lastSyncTime: Math.max(...offlineDeliveries.map(d => d.lastSynced), 0)
  };
}; 