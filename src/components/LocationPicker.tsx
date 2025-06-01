import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';

interface LocationPickerProps {
  onLocationSelect: (location: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    state: string;
    country: string;
  }) => void;
  initialLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

export function LocationPicker({ onLocationSelect, initialLocation }: LocationPickerProps) {
  const [manualLocation, setManualLocation] = useState(initialLocation?.address || '');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  const handleManualLocationSubmit = () => {
    if (manualLocation.trim()) {
      const parts = manualLocation.split(',').map(p => p.trim());
      const city = parts[0] || '';
      const state = parts[1] || '';
      
      onLocationSelect({
        latitude: 0,
        longitude: 0,
        address: manualLocation,
        city,
        state,
        country: 'United States'
      });
    }
  };

  const handleCurrentLocation = () => {
    setUseCurrentLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Try to get address from coordinates using a free service
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            
            const address = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            const city = data.address?.city || data.address?.town || data.address?.village || '';
            const state = data.address?.state || '';
            
            onLocationSelect({
              latitude,
              longitude,
              address,
              city,
              state,
              country: 'United States'
            });
          } catch (error) {
            // Fallback to coordinates
            onLocationSelect({
              latitude,
              longitude,
              address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
              city: '',
              state: '',
              country: 'United States'
            });
          }
          setUseCurrentLocation(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setUseCurrentLocation(false);
        }
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="manual-location">Enter Location</Label>
        <div className="flex gap-2">
          <Input
            id="manual-location"
            placeholder="City, State (e.g., New York, NY)"
            value={manualLocation}
            onChange={(e) => setManualLocation(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleManualLocationSubmit()}
          />
          <Button onClick={handleManualLocationSubmit} variant="outline">
            <MapPin className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-center">
        <Button
          onClick={handleCurrentLocation}
          disabled={useCurrentLocation}
          variant="outline"
          className="w-full"
        >
          {useCurrentLocation ? 'Getting Location...' : 'Use Current Location'}
        </Button>
      </div>
      
      <p className="text-sm text-muted-foreground text-center">
        Enter your location manually or use your current location
      </p>
    </div>
  );
}