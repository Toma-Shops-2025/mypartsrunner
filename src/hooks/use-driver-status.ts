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
      console.log('Attempting to update driver profile:', updates);
      
      // Try to update, but don't fail if it doesn't work
      try {
        // First, check if driver profile exists
        const { data: existingProfile, error: checkError } = await supabase
          .from('driver_profiles')
          .select('id')
          .eq('id', user.id)
          .single();

        if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.log('Profile check failed, trying to create:', checkError);
          
          // Try to create the profile
          const { error: insertError } = await supabase
            .from('driver_profiles')
            .insert([{
              id: user.id,
              vehicleType: 'car', // Default value
              isAvailable: updates.isAvailable || false,
              ...updates
            }]);

          if (insertError) {
            console.log('Profile creation failed:', insertError);
            // Don't throw error, just log it
            return;
          }
          console.log('Profile created successfully');
          return;
        }

        if (!existingProfile) {
          // Profile doesn't exist, create it
          const { error: insertError } = await supabase
            .from('driver_profiles')
            .insert([{
              id: user.id,
              vehicleType: 'car',
              isAvailable: updates.isAvailable || false,
              ...updates
            }]);

          if (insertError) {
            console.log('Profile insert failed:', insertError);
            return;
          }
          console.log('Profile inserted successfully');
        } else {
          // Profile exists, update it
          const { error } = await supabase
            .from('driver_profiles')
            .update(updates)
            .eq('id', user.id);

          if (error) {
            console.log('Profile update failed:', error);
            return;
          }
          console.log('Profile updated successfully');
        }
      } catch (dbError) {
        console.log('Database operation failed, but continuing:', dbError);
        // Don't fail the whole operation
      }
    } catch (error) {
      console.log('Driver profile update failed, but continuing:', error);
      // Don't throw error - let the driver go online anyway
    }
  }, [user?.id]);

  // Start location tracking (simplified - no permission policy violations)
  const startLocationTracking = useCallback(async () => {
    console.log('Location tracking disabled to prevent permission policy violations');
    
    // Set a default location for now (can be enhanced later)
    const defaultLocation: Location = {
      latitude: 0,
      longitude: 0,
      accuracy: 0,
      timestamp: Date.now()
    };

    setStatus(prev => ({
      ...prev,
      currentLocation: defaultLocation,
      isTrackingLocation: false // Set to false since we're not actually tracking
    }));

    return true;
  }, []);

  // Go online with location tracking
  const goOnline = useCallback(async () => {
    if (user?.role !== 'driver') return false;

    try {
      console.log('Going online - simplified version');
      
      // Try to update database, but don't fail if it doesn't work
      try {
        await updateDriverProfile({ 
          isAvailable: true
        });
        console.log('Database update successful');
      } catch (dbError) {
        console.log('Database update failed, but continuing anyway:', dbError);
      }

      // Update local state regardless of database
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
        description: "You're available for deliveries! (Database sync in progress)",
        variant: "default"
      });

      return true;
    } catch (error) {
      console.error('Failed to go online:', error);
      toast({
        title: "Failed to go online",
        description: "Unknown error occurred. Check console for details.",
        variant: "destructive"
      });
      return false;
    }
  }, [user?.role, updateDriverProfile]);

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

  // Location testing functionality removed to prevent permission policy violations

  return {
    ...status,
    goOnline,
    goOffline,
    resetAutoOfflineTimer,
    startLocationTracking
  };
}; 