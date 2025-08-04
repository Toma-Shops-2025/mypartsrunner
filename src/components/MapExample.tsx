import React, { useState } from 'react';
import { Map } from '@/components/ui/map';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation } from 'lucide-react';

interface Location {
  name: string;
  longitude: number;
  latitude: number;
  description: string;
}

const MapExample: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  
  const locations: Location[] = [
    {
      name: 'Auto Parts Store',
      longitude: -96.7,
      latitude: 32.8,
      description: 'Main auto parts supplier with wide inventory'
    },
    {
      name: 'Hardware Supply',
      longitude: -96.75,
      latitude: 32.78,
      description: 'Hardware and tools for all your needs'
    },
    {
      name: 'Delivery Hub',
      longitude: -96.8,
      latitude: 32.75,
      description: 'Central delivery and distribution center'
    }
  ];

  const markers = locations.map(loc => ({
    longitude: loc.longitude,
    latitude: loc.latitude,
    color: selectedLocation?.name === loc.name ? '#4F46E5' : '#EF4444',
    popup: loc.name
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Find Parts & Delivery Options</CardTitle>
          <CardDescription>
            View available stores and delivery routes on the map
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Map 
            markers={markers}
            initialViewState={{
              longitude: -96.75,
              latitude: 32.78,
              zoom: 11
            }}
            className="mb-4"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {locations.map((location) => (
              <Button 
                key={location.name}
                variant={selectedLocation?.name === location.name ? "default" : "outline"}
                className="flex items-center justify-start gap-2 h-auto py-3"
                onClick={() => setSelectedLocation(location)}
              >
                <MapPin className="h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium">{location.name}</div>
                </div>
              </Button>
            ))}
          </div>
          
          {selectedLocation && (
            <div className="mt-4 p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <Navigation className="h-5 w-5 text-primary" />
                <h3 className="font-medium">{selectedLocation.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{selectedLocation.description}</p>
              <div className="mt-2 text-sm">
                <span className="font-medium">Coordinates:</span> {selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MapExample;
