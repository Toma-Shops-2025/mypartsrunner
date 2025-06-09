import { useEffect, useRef } from 'react';
import { useMap } from '../contexts/MapContext';

interface MapProps {
  className?: string;
  markers?: Array<{
    coordinates: [number, number];
    color?: string;
    popup?: {
      title: string;
      description?: string;
    };
  }>;
  route?: Array<[number, number]>;
  fitMarkers?: boolean;
  onMarkerClick?: (coordinates: [number, number]) => void;
}

export default function Map({
  className = '',
  markers = [],
  route,
  fitMarkers = true,
  onMarkerClick,
}: MapProps) {
  const { map, addMarker, removeMarker, drawRoute, clearRoute, fitBounds } = useMap();
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    // Clear existing markers
    markersRef.current.forEach(marker => removeMarker(marker));
    markersRef.current = [];

    // Add new markers
    markers.forEach(({ coordinates, color = '#0066FF', popup }) => {
      const marker = addMarker(coordinates, {
        color,
      });

      if (popup) {
        const popupContent = document.createElement('div');
        popupContent.innerHTML = `
          <h3 class="font-medium">${popup.title}</h3>
          ${popup.description ? `<p class="text-sm text-gray-600">${popup.description}</p>` : ''}
        `;

        marker.setPopup(new mapboxgl.Popup().setDOMContent(popupContent));
      }

      if (onMarkerClick) {
        marker.getElement().addEventListener('click', () => {
          onMarkerClick(coordinates);
        });
      }

      markersRef.current.push(marker);
    });

    // Fit markers within view
    if (fitMarkers && markers.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      markers.forEach(({ coordinates }) => {
        bounds.extend(coordinates);
      });
      fitBounds(bounds, { padding: 50 });
    }

    // Draw route if provided
    if (route) {
      drawRoute(route);
    } else {
      clearRoute();
    }

    return () => {
      markersRef.current.forEach(marker => removeMarker(marker));
      markersRef.current = [];
      clearRoute();
    };
  }, [markers, route, fitMarkers, onMarkerClick]);

  return <div className={`relative ${className}`} />;
} 