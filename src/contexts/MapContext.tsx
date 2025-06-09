import { createContext, useContext, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Replace with your Mapbox token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

interface Location {
  latitude: number;
  longitude: number;
}

export interface MapContextType {
  userLocation: Location | null;
  initializeMap: (containerId: string) => Promise<mapboxgl.Map>;
  addMarker: (map: mapboxgl.Map, location: Location, color?: string) => mapboxgl.Marker;
  drawRoute: (
    map: mapboxgl.Map,
    start: Location,
    end: Location
  ) => Promise<void>;
  geocodeAddress: (address: string) => Promise<Location>;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export function MapProvider({ children }: { children: React.ReactNode }) {
  const [userLocation, setUserLocation] = useState<Location | null>(null);

  useEffect(() => {
    // Get user's location on mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const initializeMap = async (containerId: string): Promise<mapboxgl.Map> => {
    const map = new mapboxgl.Map({
      container: containerId,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [userLocation?.longitude || -74.006, userLocation?.latitude || 40.7128],
      zoom: 12,
    });

    await new Promise((resolve) => map.on('load', resolve));
    return map;
  };

  const addMarker = (
    map: mapboxgl.Map,
    location: Location,
    color = '#FF0000'
  ): mapboxgl.Marker => {
    return new mapboxgl.Marker({ color })
      .setLngLat([location.longitude, location.latitude])
      .addTo(map);
  };

  const drawRoute = async (
    map: mapboxgl.Map,
    start: Location,
    end: Location
  ): Promise<void> => {
    try {
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
      );

      const json = await query.json();
      const data = json.routes[0];
      const route = data.geometry.coordinates;

      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route,
        },
      };

      if (map.getSource('route')) {
        (map.getSource('route') as mapboxgl.GeoJSONSource).setData(geojson as any);
      } else {
        map.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: geojson as any,
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#3b82f6',
            'line-width': 5,
            'line-opacity': 0.75,
          },
        });
      }
    } catch (error) {
      console.error('Error drawing route:', error);
    }
  };

  const geocodeAddress = async (address: string): Promise<Location> => {
    try {
      const query = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address
        )}.json?access_token=${mapboxgl.accessToken}`
      );

      const json = await query.json();
      const [longitude, latitude] = json.features[0].center;

      return { latitude, longitude };
    } catch (error) {
      console.error('Error geocoding address:', error);
      throw new Error('Failed to geocode address');
    }
  };

  return (
    <MapContext.Provider
      value={{
        userLocation,
        initializeMap,
        addMarker,
        drawRoute,
        geocodeAddress,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

export function useMap() {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
} 