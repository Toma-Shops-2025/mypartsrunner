import { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

interface DriverStatus {
  isOnline: boolean;
  lastActive: Date;
  currentLocation: Location | null;
  isTrackingLocation: boolean;
  autoOfflineTimer: NodeJS.Timeout | null;
}

const AUTO_OFFLINE_DELAY = 30 * 60 * 1000; // 30 minutes
const LOCATION_UPDATE_INTERVAL = 30000; // 30 seconds
const LOCATION_ACCURACY_THRESHOLD = 100; // 100 meters

export const useDriverStatus = () => {
  const { user, updateUserProfile } = useAppContext();
  const [status, setStatus] = useState<DriverStatus>({
    isOnline: false,
    lastActive: new Date(),
    currentLocation: null,
    isTrackingLocation: false,
    autoOfflineTimer: null,
  });

  // Update driver profile in database
  const updateDriverProfile = useCallback(async (updates: any) => {
    if (!user?.id) return;

    try {
      // First, check if driver profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('driver_profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking driver profile:', checkError);
        throw checkError;
      }

      if (!existingProfile) {
        // Create driver profile if it doesn't exist
        const { error: insertError } = await supabase
          .from('driver_profiles')
          .insert([{
            id: user.id,
            vehicleType: 'car', // Default value, can be updated later
            isAvailable: false
          }]);

        if (insertError) {
          console.error('Error creating driver profile:', insertError);
          throw insertError;
        }
      }

      // Now update the profile
      const { error } = await supabase
        .from('driver_profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        console.error('Error updating driver profile:', error);
        throw error;
      }
    } catch (error) {
      console.error('Failed to update driver profile:', error);
      throw error;
    }
  }, [user?.id]);

  // Start location tracking
  const startLocationTracking = useCallback(async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support location tracking",
        variant: "destructive"
      });
      return false;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        // Add timeout to prevent infinite waiting
        const timeoutId = setTimeout(() => {
          reject(new Error('Location request timed out'));
        }, 15000); // 15 second timeout

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            clearTimeout(timeoutId);
            resolve(pos);
          },
          (error) => {
            clearTimeout(timeoutId);
            reject(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          }
        );
      });

      const location: Location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy || 0,
        timestamp: Date.now()
      };

      setStatus(prev => ({
        ...prev,
        currentLocation: location,
        isTrackingLocation: true
      }));

      return true;
    } catch (error: any) {
      console.error('Location access error:', error);
      
      // Handle specific error types
      let errorMessage = "Please enable location access to go online";
      if (error.code === 1) {
        errorMessage = "Location access denied. Please enable in browser settings.";
      } else if (error.code === 2) {
        errorMessage = "Location unavailable. Please try again.";
      } else if (error.code === 3) {
        errorMessage = "Location request timed out. Please try again.";
      }

      toast({
        title: "Location access failed",
        description: errorMessage,
        variant: "destructive"
      });
      
      return false;
    }
  }, []);

  // Go online with location tracking
  const goOnline = useCallback(async () => {
    if (user?.role !== 'driver') return false;

    try {
      // First try to get location permission
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        if (permission.state === 'denied') {
          toast({
            title: "Location Access Required",
            description: "Please enable location access in your browser settings to go online.",
            variant: "destructive"
          });
          return false;
        }
      }

      const locationStarted = await startLocationTracking();
      if (!locationStarted) {
        // If location fails, still allow going online but with a warning
        toast({
          title: "Location Access Failed",
          description: "You can go online without location tracking, but won't receive nearby deliveries.",
          variant: "destructive"
        });
        
        // Still update driver profile to online
        await updateDriverProfile({ 
          isAvailable: true
        });

        setStatus(prev => ({
          ...prev,
          isOnline: true,
          lastActive: new Date()
        }));

        toast({
          title: "You're now Online! 🚗",
          description: "Location tracking disabled. You're available for deliveries.",
          variant: "default"
        });

        return true;
      }

      // Update driver profile with availability and location
      await updateDriverProfile({ 
        isAvailable: true,
        currentLocationLatitude: status.currentLocation?.latitude || null,
        currentLocationLongitude: status.currentLocation?.longitude || null
      });

      setStatus(prev => ({
        ...prev,
        isOnline: true,
        lastActive: new Date()
      }));

      // Start auto-offline timer
      const timer = setTimeout(() => {
        toast({
          title: "Auto-offline reminder",
          description: "You've been inactive for 30 minutes. Going offline automatically.",
          variant: "default"
        });
        goOffline();
      }, AUTO_OFFLINE_DELAY);

      setStatus(prev => ({
        ...prev,
        autoOfflineTimer: timer
      }));

      toast({
        title: "You're now Online! 🚗",
        description: "Location tracking active. You're available for deliveries.",
        variant: "default"
      });

      return true;
    } catch (error) {
      console.error('Failed to go online:', error);
      toast({
        title: "Failed to go online",
        description: "Please try again or check your connection.",
        variant: "destructive"
      });
      return false;
    }
  }, [user?.role, startLocationTracking, updateDriverProfile, status.currentLocation]);

  // Go offline
  const goOffline = useCallback(async () => {
    if (user?.role !== 'driver') return;

    try {
      // Update driver profile to offline
      await updateDriverProfile({ 
        isAvailable: false
      });

      // Clear auto-offline timer
      if (status.autoOfflineTimer) {
        clearTimeout(status.autoOfflineTimer);
      }

      setStatus(prev => ({
        ...prev,
        isOnline: false,
        isTrackingLocation: false,
        autoOfflineTimer: null
      }));

      toast({
        title: "You're now Offline",
        description: "Location tracking stopped. You're not available for deliveries.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Failed to go offline",
        description: "Please try again",
        variant: "destructive"
      });
    }
  }, [user?.role, status.autoOfflineTimer, updateDriverProfile]);

  // Reset auto-offline timer when driver is active
  const resetAutoOfflineTimer = useCallback(() => {
    if (!status.isOnline || user?.role !== 'driver') return;

    // Clear existing timer
    if (status.autoOfflineTimer) {
      clearTimeout(status.autoOfflineTimer);
    }

    // Start new timer
    const timer = setTimeout(() => {
      toast({
        title: "Auto-offline reminder",
        description: "You've been inactive for 30 minutes. Going offline automatically.",
        variant: "default"
      });
      goOffline();
    }, AUTO_OFFLINE_DELAY);

    setStatus(prev => ({
      ...prev,
      autoOfflineTimer: timer,
      lastActive: new Date()
    }));
  }, [status.isOnline, status.autoOfflineTimer, user?.role, goOffline]);

  // Activity detection
  useEffect(() => {
    const handleActivity = () => {
      resetAutoOfflineTimer();
    };

    if (status.isOnline) {
      window.addEventListener('mousedown', handleActivity);
      window.addEventListener('keydown', handleActivity);
      window.addEventListener('touchstart', handleActivity);
      window.addEventListener('scroll', handleActivity);

      return () => {
        window.removeEventListener('mousedown', handleActivity);
        window.removeEventListener('keydown', handleActivity);
        window.removeEventListener('touchstart', handleActivity);
        window.removeEventListener('scroll', handleActivity);
      };
    }
  }, [status.isOnline, resetAutoOfflineTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (status.autoOfflineTimer) {
        clearTimeout(status.autoOfflineTimer);
      }
    };
  }, [status.autoOfflineTimer]);

  return {
    ...status,
    goOnline,
    goOffline,
    resetAutoOfflineTimer,
    startLocationTracking
  };
}; 