export type MapStyleMode = 'satellite' | 'standard' | 'terrain';

export interface GeoJSONPolygonFeature {
  type: 'Feature';
  properties: {
    areaSqMeters: number;
    areaAcres: number;
    areaHectares: number;
    perimeterMeters: number;
    name?: string;
    surveyNumber?: string;
    createdAt?: string;
  };
  geometry: {
    type: 'Polygon';
    coordinates: [number, number][][]; // GeoJSON coordinate order: [longitude, latitude]
  };
}

export interface ParcelCalculations {
  areaSqMeters: number;
  areaAcres: number;
  areaHectares: number;
  perimeterMeters: number;
  centroid: {
    lat: number;
    lng: number;
  };
  boundingBox: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  coordinates: {
    index: number;
    lat: number;
    lng: number;
  }[];
  geoJSON: GeoJSONPolygonFeature;
}

export interface ElevationSample {
  distanceMeters: number;
  elevationMeters: number;
  lat: number;
  lng: number;
  pointName?: string;
}

export interface TerrainAnalysisData {
  averageElevation: number;
  minElevation: number;
  maxElevation: number;
  elevationDifference: number;
  averageSlopeDegrees: number;
  terrainClassification: 'Flat' | 'Gently Sloping' | 'Moderate Slope' | 'Steep Terrain' | 'Rugged';
  aspectOrientation: string;
  elevationProfile: ElevationSample[];
  confidence: 'HIGH_DEM' | 'INTERPOLATED' | 'ESTIMATED' | 'UNAVAILABLE';
  status: 'SUCCESS' | 'UNAVAILABLE';
  sourceDescription: string;
}

export interface NearbyFeatureItem {
  id: string;
  category: 'road' | 'electricity' | 'water' | 'town' | 'railway' | 'airport' | 'hospital' | 'school' | 'industrial' | 'agricultural' | 'forest';
  name: string;
  distanceMeters: number;
  distanceFormatted: string;
  bearingText: string;
  significance: 'High' | 'Medium' | 'Low';
  details: string;
  coordinates?: [number, number]; // [lng, lat]
}

export interface NearbyAnalysisData {
  nearestRoad: NearbyFeatureItem | null;
  nearestElectricity: NearbyFeatureItem | null;
  nearestWaterBody: NearbyFeatureItem | null;
  nearestTown: NearbyFeatureItem | null;
  nearestRailway: NearbyFeatureItem | null;
  allFeatures: NearbyFeatureItem[];
  radiusAnalyzedMeters: number;
  status: 'SUCCESS' | 'UNAVAILABLE';
}

export interface SuitabilityFactor {
  name: string;
  score: number;
  maxScore: number;
  weight: number;
  description: string;
}

export interface CategorySuitability {
  category: 'Solar Farm' | 'Agriculture' | 'Warehouse' | 'Housing' | 'Commercial';
  score: number; // 0 - 100
  factors: SuitabilityFactor[];
  strengths: string[];
  risks: string[];
  recommendationNote: string;
  confidence: 'HIGH_AI_ESTIMATE' | 'MEDIUM_AI_ESTIMATE';
}

export interface LandSuitabilityData {
  rankings: CategorySuitability[];
  topRecommendation: CategorySuitability;
  isAiEstimate: true;
  disclaimer: string;
  analysisTimestamp: string;
}

export interface SearchLocationResult {
  id: string;
  displayName: string;
  shortName: string;
  lat: number;
  lng: number;
  type: string;
  boundingbox?: [string, string, string, string];
}
