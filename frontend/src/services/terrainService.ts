import * as turf from '@turf/turf';
import type { TerrainAnalysisData } from '../types/parcelIntelligence';

/**
 * Validates whether a polygon's slope is suitable for ground-mounted solar panels (< 5 degrees recommended)
 */
export const isSolarSlopeOptimal = (slopeDegrees: number): boolean => {
  return slopeDegrees <= 5.0;
};

/**
 * Calculates polygon bounding box bounds in Turf format [minX, minY, maxX, maxY]
 */
export const calculatePolygonBounds = (coordinates: [number, number][]): [number, number, number, number] => {
  if (!coordinates || coordinates.length < 3) {
    return [75.90, 17.65, 75.92, 17.67];
  }
  const poly = turf.polygon([coordinates]);
  return turf.bbox(poly) as [number, number, number, number];
};

/**
 * Formats slope angle into user-friendly description and rating
 */
export const getSlopeBadgeInfo = (slope: number): { label: string; color: string; bg: string } => {
  if (slope < 2.0) {
    return { label: 'Optimal Flat (<2°)', color: '#166534', bg: '#E8F5EC' };
  } else if (slope <= 5.0) {
    return { label: 'Gently Sloping (2°-5°)', color: '#15803D', bg: '#E8F5EC' };
  } else if (slope <= 10.0) {
    return { label: 'Moderate Slope (5°-10°)', color: '#D97706', bg: '#FEF3C7' };
  } else {
    return { label: 'Steep / Uneven (>10°)', color: '#DC2626', bg: '#FEE2E2' };
  }
};
