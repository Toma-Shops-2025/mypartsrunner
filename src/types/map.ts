import mapboxgl from 'mapbox-gl';

export interface Location {
  lat: number;
  lng: number;
  marker?: mapboxgl.Marker;
}

export interface MapContextType {
  map: mapboxgl.Map | null;
  addMarker: (location: Location, options?: mapboxgl.MarkerOptions) => mapboxgl.Marker;
  removeMarker: (marker: mapboxgl.Marker) => void;
  drawRoute: (start: Location, end: Location, waypoints?: Location[]) => void;
  clearRoute: () => void;
  fitBounds: (bounds: mapboxgl.LngLatBounds) => void;
}

export interface MapProviderProps {
  children: React.ReactNode;
} 