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

interface DriverApplication {
  id: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  created_at: string;
  updated_at: string;
  admin_notes?: string;
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

  const [locationWatchId, setLocationWatchId] = useState<number | null>(null);

  // Check driver application status
  const checkDriverApplicationStatus = useCallback(async (): Promise<DriverApplication | null> => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('driver_applications')
        .select('id, status, created_at, updated_at, admin_notes')
        .eq('applicant_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.log('No driver application found:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error checking driver application:', error);
      return null;
    }
  }, [user?.id]);

  // Update driver profile (existing function)
  const updateDriverProfile = useCallback(async (updates: any) => {
    if (!user?.id) return;

    try {
      const { data: existingProfile, error: fetchError } = await supabase
        .from('driver_profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (fetchError && fetchError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const { error: insertError } = await supabase
          .from('driver_profiles')
          .insert([{
            id: user.id,
            vehicleType: 'car',
            isAvailable: false,
            ...updates
          }]);

        if (insertError) {
          throw insertError;
        }
      } else if (fetchError) {
        throw fetchError;
      } else {
        // Profile exists, update it
        const { error: updateError } = await supabase
          .from('driver_profiles')
          .update({
            ...updates,
            updatedAt: new Date().toISOString()
          })
          .eq('id', user.id);

        if (updateError) {
          throw updateError;
        }
      }
    } catch (error) {
      console.error('Error updating driver profile:', error);
      throw error;
    }
  }, [user?.id]);

  // Start location tracking
  const startLocationTracking = useCallback(() => {
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported');
      return false;
    }

    if (locationWatchId !== null) {
      console.log('Location tracking already active');
      return true;
    }

    const options: PositionOptions = {
      enableHighAccuracy: false, // Use less battery-intensive location
      timeout: 15000, // Increased timeout
      maximumAge: 300000 // Cache location for 5 minutes
    };

    console.log('Starting location tracking with options:', options);

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const newLocation: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now()
        };

        console.log('Location update:', newLocation);

        setStatus(prev => ({
          ...prev,
          currentLocation: newLocation,
          isTrackingLocation: true,
          lastActive: new Date()
        }));

        // Update database location less frequently (only if significant change)
        try {
          const existingLocation = status.currentLocation;
          const shouldUpdate = !existingLocation || 
            Math.abs(existingLocation.latitude - newLocation.latitude) > 0.001 ||
            Math.abs(existingLocation.longitude - newLocation.longitude) > 0.001 ||
            Date.now() - existingLocation.timestamp > 600000; // 10 minutes

          if (shouldUpdate) {
            await updateDriverProfile({
              currentLocationLatitude: newLocation.latitude,
              currentLocationLongitude: newLocation.longitude,
              lastLocationUpdate: new Date().toISOString()
            });
          }
        } catch (error) {
          console.log('Failed to update location in database:', error);
        }
      },
      (error) => {
        console.error('Location error:', error);
        
        // Handle specific error cases
        if (error.code === error.PERMISSION_DENIED) {
          toast({
            title: "Location Access Denied",
            description: "Please enable location access to receive delivery requests.",
            variant: "destructive"
          });
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          toast({
            title: "Location Unavailable",
            description: "Unable to get your current location. Please check your GPS settings.",
            variant: "destructive"
          });
        }
        
        setStatus(prev => ({
          ...prev,
          isTrackingLocation: false
        }));
      },
      options
    );

    setLocationWatchId(watchId);
    console.log('Location tracking started with watch ID:', watchId);
    return true;
  }, [locationWatchId, updateDriverProfile, status.currentLocation]);

  // Go online with enhanced application status checking
  const goOnline = useCallback(async () => {
    if (user?.role !== 'driver') {
      toast({
        title: "Access Denied",
        description: "Only drivers can go online for deliveries.",
        variant: "destructive"
      });
      return false;
    }

    try {
      console.log('Checking driver application status...');
      
      // First, check if driver has an application and its status
      const application = await checkDriverApplicationStatus();
      
      if (!application) {
        // No application found - redirect to application page
        toast({
          title: "Application Required 📝",
          description: "You need to submit a driver application first. Redirecting you now...",
          variant: "default"
        });
        
        // Redirect to driver application page after a short delay
        setTimeout(() => {
          window.location.href = '/driver-application';
        }, 2000);
        
        return false;
      }

      // Check application status
      switch (application.status) {
        case 'pending':
        case 'under_review':
          toast({
            title: "Application Under Review 🔍",
            description: `Your driver application submitted on ${new Date(application.created_at).toLocaleDateString()} is currently being reviewed. You'll be notified once approved!`,
            variant: "default"
          });
          return false;

        case 'rejected':
          const rejectedMessage = application.admin_notes 
            ? `Reason: ${application.admin_notes}` 
            : 'Please contact support for more information.';
          
          toast({
            title: "Application Not Approved ❌",
            description: `Your driver application was not approved. ${rejectedMessage}`,
            variant: "destructive"
          });
          return false;

        case 'approved':
          // Application approved - proceed with going online
          console.log('Driver application approved - proceeding to go online');
          
          toast({
            title: "✅ Welcome, Approved Driver!",
            description: "Your application has been approved. Going online now...",
            variant: "default"
          });
          
          break;

        default:
          toast({
            title: "Unknown Application Status",
            description: "Please contact support for assistance.",
            variant: "destructive"
          });
          return false;
      }

      // If we get here, the driver is approved - proceed with going online
      console.log('Going online - driver is approved');
      
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

      // Ask user if they want to enable location tracking
      const enableLocation = window.confirm('Enable location tracking to receive nearby delivery requests? You can disable this later.');
      
      if (enableLocation) {
        console.log('User opted for location tracking');
        startLocationTracking();
      } else {
        console.log('User declined location tracking');
        toast({
          title: "Location Tracking Disabled",
          description: "You can enable location tracking later in settings to receive nearby requests.",
          variant: "default"
        });
      }

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

      // Success message for approved drivers
      toast({
        title: "You're now Online! 🚗",
        description: "You're available for deliveries! Customers can now request your services.",
        variant: "default"
      });

      return true;
    } catch (error) {
      console.error('Failed to go online:', error);
      toast({
        title: "Failed to go online",
        description: "Please try again or contact support if the problem persists.",
        variant: "destructive"
      });
      return false;
    }
  }, [user, checkDriverApplicationStatus, updateDriverProfile, startLocationTracking]);

  // Go offline
  const goOffline = useCallback(async () => {
    try {
      console.log('Going offline');
      
      // Stop location tracking
      if (locationWatchId !== null) {
        navigator.geolocation.clearWatch(locationWatchId);
        setLocationWatchId(null);
        console.log('Location tracking stopped');
      }

      // Clear auto-offline timer
      if (status.autoOfflineTimer) {
        clearTimeout(status.autoOfflineTimer);
      }

      // Try to update database
      try {
        await updateDriverProfile({ 
          isAvailable: false 
        });
      } catch (dbError) {
        console.log('Database update failed during offline:', dbError);
      }

      // Update local state
      setStatus(prev => ({
        ...prev,
        isOnline: false,
        isTrackingLocation: false,
        autoOfflineTimer: null,
        lastActive: new Date()
      }));

      toast({
        title: "You're now Offline",
        description: "You won't receive new delivery requests.",
        variant: "default"
      });

      return true;
    } catch (error) {
      console.error('Failed to go offline:', error);
      toast({
        title: "Failed to go offline",
        description: "Please try again.",
        variant: "destructive"
      });
      return false;
    }
  }, [locationWatchId, status.autoOfflineTimer, updateDriverProfile]);

  // Update activity timestamp
  const updateActivity = useCallback(() => {
    setStatus(prev => ({
      ...prev,
      lastActive: new Date()
    }));
  }, []);

  // Stop location tracking on component unmount
  useEffect(() => {
    return () => {
      if (locationWatchId !== null) {
        navigator.geolocation.clearWatch(locationWatchId);
      }
    };
  }, [locationWatchId]);

  return {
    status,
    goOnline,
    goOffline,
    startLocationTracking,
    updateActivity,
    checkDriverApplicationStatus
  };
}; 