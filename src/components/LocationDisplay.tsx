import React from 'react';
import { MapPin, Truck, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LocationDisplayProps {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  shippingAvailable?: boolean;
  localPickup?: boolean;
  showShippingOptions?: boolean;
  compact?: boolean;
  showMap?: boolean;
}

export function LocationDisplay({
  address,
  city,
  state,
  country,
  latitude,
  longitude,
  shippingAvailable = true,
  localPickup = true,
  showShippingOptions = true,
  compact = false,
  showMap = false
}: LocationDisplayProps) {
  const formatLocation = () => {
    if (address) {
      return address;
    }
    
    const parts = [];
    if (city) parts.push(city);
    if (state) parts.push(state);
    if (country && country !== 'United States') parts.push(country);
    
    return parts.join(', ') || 'Location not specified';
  };

  const openInMaps = () => {
    if (latitude && longitude) {
      const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
      window.open(url, '_blank');
    } else if (address || (city && state)) {
      const query = encodeURIComponent(address || `${city}, ${state}`);
      const url = `https://www.google.com/maps/search/${query}`;
      window.open(url, '_blank');
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <MapPin className="h-3 w-3" />
        <span className="truncate">{city && state ? `${city}, ${state}` : 'Location TBD'}</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2">
        <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
        <div className="text-sm flex-1">
          <p className="font-medium">{formatLocation()}</p>
          {showMap && (latitude && longitude || address || (city && state)) && (
            <button
              onClick={openInMaps}
              className="text-blue-600 hover:text-blue-800 text-xs underline mt-1"
            >
              View on map
            </button>
          )}
        </div>
      </div>
      
      {showShippingOptions && (
        <div className="flex gap-2 flex-wrap">
          {shippingAvailable && (
            <Badge variant="secondary" className="text-xs">
              <Truck className="h-3 w-3 mr-1" />
              Ships nationwide
            </Badge>
          )}
          {localPickup && (
            <Badge variant="outline" className="text-xs">
              <Users className="h-3 w-3 mr-1" />
              Local pickup
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}