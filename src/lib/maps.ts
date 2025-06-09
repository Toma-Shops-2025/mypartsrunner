import mapboxgl from 'mapbox-gl';
import { LngLatBounds, LngLatLike } from 'mapbox-gl';
import config from '@/config';

// Initialize Mapbox
mapboxgl.accessToken = config.maps.mapboxToken;

export interface RouteOptions {
  profile?: 'driving' | 'walking' | 'cycling';
  alternatives?: boolean;
  steps?: boolean;
}

export interface DeliveryEstimate {
  distance: number; // in meters
  duration: number; // in seconds
  route: any; // GeoJSON route
}

class MapService {
  private map: mapboxgl.Map | null = null;

  // Initialize map on a container
  initializeMap(container: HTMLElement) {
    this.map = new mapboxgl.Map({
      container,
      style: config.maps.defaultStyle,
      center: [config.maps.defaultCenter.lng, config.maps.defaultCenter.lat],
      zoom: config.maps.defaultZoom
    });

    return this.map;
  }

  // Calculate delivery estimates between points
  async calculateDeliveryEstimates(
    origin: [number, number],
    destination: [number, number],
    options: RouteOptions = {}
  ): Promise<DeliveryEstimate> {
    const profile = options.profile || 'driving';
    const coordinates = `${origin[0]},${origin[1]};${destination[0]},${destination[1]}`;
    
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordinates}` +
      `?alternatives=${options.alternatives || false}` +
      `&steps=${options.steps || false}` +
      `&geometries=geojson` +
      `&access_token=${config.maps.mapboxToken}`
    );

    if (!response.ok) {
      throw new Error('Failed to calculate route');
    }

    const data = await response.json();
    const route = data.routes[0];

    return {
      distance: route.distance,
      duration: route.duration,
      route: route.geometry
    };
  }

  // Get optimal route for multiple stops
  async getOptimalRoute(
    stops: [number, number][],
    options: RouteOptions = {}
  ) {
    if (stops.length < 2) {
      throw new Error('At least 2 stops are required');
    }

    const coordinates = stops.map(stop => `${stop[0]},${stop[1]}`).join(';');
    const profile = options.profile || 'driving';

    const response = await fetch(
      `https://api.mapbox.com/optimized-trips/v1/mapbox/${profile}/${coordinates}` +
      `?roundtrip=false` +
      `&source=first` +
      `&destination=last` +
      `&steps=${options.steps || false}` +
      `&geometries=geojson` +
      `&access_token=${config.maps.mapboxToken}`
    );

    if (!response.ok) {
      throw new Error('Failed to calculate optimal route');
    }

    return await response.json();
  }

  // Geocode address to coordinates
  async geocodeAddress(address: string): Promise<{
    lat: number;
    lng: number;
    formatted_address: string;
  }> {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json` +
      `?access_token=${config.maps.mapboxToken}` +
      `&country=US` +
      `&types=address`
    );

    if (!response.ok) {
      throw new Error('Failed to geocode address');
    }

    const data = await response.json();
    if (!data.features.length) {
      throw new Error('Address not found');
    }

    const location = data.features[0];
    return {
      lng: location.center[0],
      lat: location.center[1],
      formatted_address: location.place_name
    };
  }

  // Validate and format address
  async validateAddress(address: string) {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json` +
        `?access_token=${config.maps.mapboxToken}` +
        `&country=US` +
        `&types=address` +
        `&autocomplete=true`
      );

      if (!response.ok) {
        return { valid: false, suggestions: [] };
      }

      const data = await response.json();
      return {
        valid: data.features.length > 0,
        suggestions: data.features.map((feature: any) => ({
          description: feature.place_name,
          place_id: feature.id
        }))
      };
    } catch (error) {
      console.error('Address validation error:', error);
      return { valid: false, suggestions: [] };
    }
  }

  // Check if location is within service area
  async isInServiceArea(location: { lat: number; lng: number }) {
    try {
      // Get service areas from your database
      const serviceAreas = await this.getServiceAreaBoundaries();
      
      // Check if point is within any service area
      for (const area of serviceAreas) {
        if (this.isPointInPolygon(location, area.boundaries)) {
          return {
            inService: true,
            areaId: area.id,
            areaName: area.name
          };
        }
      }

      return {
        inService: false,
        nearestArea: await this.findNearestServiceArea(location, serviceAreas)
      };
    } catch (error) {
      console.error('Service area check error:', error);
      throw error;
    }
  }

  // Add a delivery route to the map
  addRouteToMap(route: any, options: { fitBounds?: boolean } = {}) {
    if (!this.map) throw new Error('Map not initialized');

    // Add the route source
    this.map.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: route
      }
    });

    // Add the route layer
    this.map.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#3887be',
        'line-width': 5,
        'line-opacity': 0.75
      }
    });

    if (options.fitBounds) {
      const bounds = new LngLatBounds();
      route.coordinates.forEach((coord: number[]) => {
        bounds.extend(coord as LngLatLike);
      });
      this.map.fitBounds(bounds, { padding: 50 });
    }
  }

  // Helper methods
  private async getServiceAreaBoundaries() {
    // Implementation to fetch service area data from your database
    return [
      {
        id: 'default',
        name: 'Default Service Area',
        boundaries: [] // Array of coordinates defining the polygon
      }
    ];
  }

  private isPointInPolygon(point: { lat: number; lng: number }, polygon: Array<{ lat: number; lng: number }>) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].lng, yi = polygon[i].lat;
      const xj = polygon[j].lng, yj = polygon[j].lat;
      
      const intersect = ((yi > point.lat) !== (yj > point.lat))
          && (point.lng < (xj - xi) * (point.lat - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  private async findNearestServiceArea(location: { lat: number; lng: number }, serviceAreas: any[]) {
    // Implementation to find nearest service area
    // You would calculate distances to each service area and return the closest
    return {
      id: 'nearest_area',
      name: 'Nearest Service Area',
      distance: 0
    };
  }
}

export const mapService = new MapService(); 