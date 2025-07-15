import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Location, MapContextType } from '@/types/map';

// Replace with your Mapbox token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapContext = createContext<MapContextType | undefined>(undefined);

export function MapProvider({ children }: { children: React.ReactNode }) {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const routeLayerRef = useRef<string | null>(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.VITE_MAPBOX_TOKEN || '';
  }, []);

  const addMarker = (location: Location, options?: mapboxgl.MarkerOptions) => {
    if (!map) throw new Error('Map not initialized');

    const marker = new mapboxgl.Marker(options)
      .setLngLat([location.lng, location.lat])
      .addTo(map);

    markersRef.current.push(marker);
    return marker;
  };

  const removeMarker = (marker: mapboxgl.Marker) => {
    marker.remove();
    markersRef.current = markersRef.current.filter(m => m !== marker);
  };

  const drawRoute = async (start: Location, end: Location, waypoints: Location[] = []) => {
    if (!map) throw new Error('Map not initialized');

    // Clear existing route
    clearRoute();

    // Convert locations to coordinates
    const coordinates = [
      [start.lng, start.lat],
      ...waypoints.map(point => [point.lng, point.lat]),
      [end.lng, end.lat]
    ];

    // Create GeoJSON object
    const geojson = {
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'LineString' as const,
        coordinates
      }
    };

    // Add the route to the map
    const layerId = 'route-' + Date.now();
    map.addLayer({
      id: layerId,
      type: 'line',
      source: {
        type: 'geojson',
        data: geojson
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#0066FF',
        'line-width': 4
      }
    });

    routeLayerRef.current = layerId;
  };

  const clearRoute = () => {
    if (!map || !routeLayerRef.current) return;

    if (map.getLayer(routeLayerRef.current)) {
      map.removeLayer(routeLayerRef.current);
    }
    if (map.getSource(routeLayerRef.current)) {
      map.removeSource(routeLayerRef.current);
    }

    routeLayerRef.current = null;
  };

  const fitBounds = (bounds: mapboxgl.LngLatBounds) => {
    if (!map) throw new Error('Map not initialized');

    map.fitBounds(bounds, {
      padding: 50,
      maxZoom: 15
    });
  };

  const value: MapContextType = {
    map,
    addMarker,
    removeMarker,
    drawRoute,
    clearRoute,
    fitBounds
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

export function useMap() {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
} 