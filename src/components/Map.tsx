import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { useMap } from '@/contexts/MapContext';
import { Location } from '@/types/map';

interface MapProps {
  center?: [number, number];
  zoom?: number;
  markers?: Location[];
  route?: Location[];
}

export function Map({ center = [-74.5, 40], zoom = 9, markers = [], route = [] }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { map, addMarker, removeMarker, drawRoute, clearRoute, fitBounds } = useMap();
  const markersRef = useRef<Location[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center,
      zoom
    });

    return () => {
      mapInstance.remove();
    };
  }, [center, zoom]);

  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach(location => {
      if (location.marker) {
        removeMarker(location.marker);
      }
    });

    // Add new markers
    const newMarkers = markers.map(location => {
      const marker = addMarker(location);
      return { ...location, marker };
    });

    markersRef.current = newMarkers;
  }, [map, markers, addMarker, removeMarker]);

  useEffect(() => {
    if (!map || !route.length) return;

    // Create bounds
    const bounds = new mapboxgl.LngLatBounds();

    // Extend bounds with all route points
    route.forEach(point => {
      bounds.extend([point.lng, point.lat]);
    });

    // Draw route
    drawRoute(route[0], route[route.length - 1], route.slice(1, -1));

    // Fit map to bounds
    fitBounds(bounds);

    return () => {
      clearRoute();
    };
  }, [map, route, drawRoute, clearRoute, fitBounds]);

  return <div ref={mapContainer} className="w-full h-full" />;
} 