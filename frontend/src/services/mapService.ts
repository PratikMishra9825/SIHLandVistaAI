import mapboxgl from 'mapbox-gl';
import type { MapStyleMode } from '../types/parcelIntelligence';

export const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

export const DEFAULT_MAP_CENTER: [number, number] = [75.9064, 17.6599]; // [lng, lat] - Solapur, Maharashtra
export const DEFAULT_MAP_ZOOM = 14;

/**
 * Built-in Tile Styles
 * Supports direct Mapbox Studio styles if a valid token is set,
 * or fallback styles (ESRI World Imagery / OSM / OpenTopoMap) for offline or local dev.
 */
export const getMapStyle = (mode: MapStyleMode): string | mapboxgl.Style => {
  const hasToken = MAPBOX_ACCESS_TOKEN && MAPBOX_ACCESS_TOKEN.startsWith('pk.');

  if (hasToken) {
    switch (mode) {
      case 'satellite':
        return 'mapbox://styles/mapbox/satellite-streets-v12';
      case 'terrain':
        return 'mapbox://styles/mapbox/outdoors-v12';
      case 'standard':
      default:
        return 'mapbox://styles/mapbox/streets-v12';
    }
  }

  // Fallback high-performance Mapbox GL compatible style specs
  switch (mode) {
    case 'satellite':
      return {
        version: 8,
        sources: {
          'esri-satellite': {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            ],
            tileSize: 256,
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          },
          'carto-labels': {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}@2x.png'
            ],
            tileSize: 256
          }
        },
        layers: [
          {
            id: 'esri-satellite-layer',
            type: 'raster',
            source: 'esri-satellite',
            minzoom: 0,
            maxzoom: 22
          },
          {
            id: 'carto-labels-layer',
            type: 'raster',
            source: 'carto-labels',
            minzoom: 0,
            maxzoom: 22
          }
        ]
      };

    case 'terrain':
      return {
        version: 8,
        sources: {
          'opentopo': {
            type: 'raster',
            tiles: [
              'https://a.tile.opentopomap.org/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap (CC-BY-SA)'
          }
        },
        layers: [
          {
            id: 'opentopo-layer',
            type: 'raster',
            source: 'opentopo',
            minzoom: 0,
            maxzoom: 17
          }
        ]
      };

    case 'standard':
    default:
      return {
        version: 8,
        sources: {
          'osm-standard': {
            type: 'raster',
            tiles: [
              'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }
        },
        layers: [
          {
            id: 'osm-standard-layer',
            type: 'raster',
            source: 'osm-standard',
            minzoom: 0,
            maxzoom: 19
          }
        ]
      };
  }
};
