import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_ACCESS_TOKEN, mapStyles } from '@/lib/mapbox';

interface MapProps {
  initialViewState?: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  markers?: Array<{
    longitude: number;
    latitude: number;
    color?: string;
    popup?: string;
  }>;
  className?: string;
  style?: React.CSSProperties;
  mapStyle?: string;
  onMapLoad?: (map: mapboxgl.Map) => void;
}

export function Map({
  initialViewState = {
    longitude: -96.7,
    latitude: 32.8,
    zoom: 9
  },
  markers = [],
  className = '',
  style = {},
  mapStyle = mapStyles.streets,
  onMapLoad
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [initialViewState.longitude, initialViewState.latitude],
      zoom: initialViewState.zoom
    });

    map.current.on('load', () => {
      setLoaded(true);
      if (onMapLoad && map.current) {
        onMapLoad(map.current);
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapStyle]);

  useEffect(() => {
    if (!loaded || !map.current) return;

    // Clear existing markers
    const existingMarkers = document.getElementsByClassName('mapboxgl-marker');
    while (existingMarkers[0]) {
      existingMarkers[0].remove();
    }

    // Add new markers
    markers.forEach(marker => {
      const el = document.createElement('div');
      el.className = 'mapboxgl-marker';
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = marker.color || '#FF0000';
      el.style.border = '2px solid white';
      el.style.cursor = 'pointer';

      const markerInstance = new mapboxgl.Marker(el)
        .setLngLat([marker.longitude, marker.latitude])
        .addTo(map.current!);

      if (marker.popup) {
        markerInstance.setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<p>${marker.popup}</p>`)
        );
      }
    });
  }, [markers, loaded]);

  return (
    <div 
      ref={mapContainer} 
      className={`h-96 rounded-lg ${className}`} 
      style={style}
    />
  );
}
