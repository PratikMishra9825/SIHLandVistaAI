import * as turf from '@turf/turf';
import type { ParcelCalculations, GeoJSONPolygonFeature } from '../types/parcelIntelligence';

/**
 * Ensures the polygon coordinate array is closed (first and last points match)
 */
export const ensureClosedPolygon = (coordinates: [number, number][]): [number, number][] => {
  if (coordinates.length < 3) return coordinates;
  const first = coordinates[0];
  const last = coordinates[coordinates.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    return [...coordinates, [first[0], first[1]]];
  }
  return coordinates;
};

/**
 * Calculates complete GIS geospatial metrics for drawn polygon using Turf.js
 */
export const calculateParcelMetrics = (
  rawCoordinates: [number, number][], // [longitude, latitude]
  parcelName: string = 'Registered Land Parcel',
  surveyNumber: string = 'MH-SOL-2026/891'
): ParcelCalculations | null => {
  if (!rawCoordinates || rawCoordinates.length < 3) {
    return null;
  }

  const closedCoords = ensureClosedPolygon(rawCoordinates);

  // Create Turf polygon feature
  const polyFeature = turf.polygon([closedCoords]);

  // 1. Area in square meters, acres, hectares
  const areaSqMeters = Math.round(turf.area(polyFeature) * 100) / 100;
  const areaAcres = Math.round((areaSqMeters * 0.000247105) * 100) / 100;
  const areaHectares = Math.round((areaSqMeters / 10000) * 100) / 100;

  // 2. Perimeter in meters
  const perimeterKm = turf.length(turf.polygonToLine(polyFeature), { units: 'kilometers' });
  const perimeterMeters = Math.round(perimeterKm * 1000 * 10) / 10;

  // 3. Centroid latitude and longitude
  const centroidFeature = turf.centroid(polyFeature);
  const centroidLng = Math.round(centroidFeature.geometry.coordinates[0] * 1000000) / 1000000;
  const centroidLat = Math.round(centroidFeature.geometry.coordinates[1] * 1000000) / 1000000;

  // 4. Bounding box (North, South, East, West)
  const bbox = turf.bbox(polyFeature); // [minLng, minLat, maxLng, maxLat]
  const boundingBox = {
    west: Math.round(bbox[0] * 1000000) / 1000000,
    south: Math.round(bbox[1] * 1000000) / 1000000,
    east: Math.round(bbox[2] * 1000000) / 1000000,
    north: Math.round(bbox[3] * 1000000) / 1000000
  };

  // 5. Formatted coordinates list for vertices
  // Exclude the closing duplicate vertex for clean point-by-point table display
  const vertexCoords = closedCoords.slice(0, closedCoords.length - 1).map((coord, idx) => ({
    index: idx + 1,
    lat: Math.round(coord[1] * 1000000) / 1000000,
    lng: Math.round(coord[0] * 1000000) / 1000000
  }));

  // 6. Strict standard GeoJSON representation
  const geoJSON: GeoJSONPolygonFeature = {
    type: 'Feature',
    properties: {
      areaSqMeters,
      areaAcres,
      areaHectares,
      perimeterMeters,
      name: parcelName,
      surveyNumber: surveyNumber,
      createdAt: new Date().toISOString()
    },
    geometry: {
      type: 'Polygon',
      coordinates: [closedCoords]
    }
  };

  return {
    areaSqMeters,
    areaAcres,
    areaHectares,
    perimeterMeters,
    centroid: {
      lat: centroidLat,
      lng: centroidLng
    },
    boundingBox,
    coordinates: vertexCoords,
    geoJSON
  };
};
