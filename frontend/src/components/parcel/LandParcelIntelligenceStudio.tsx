import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  MapPin, 
  Layers, 
  Mountain, 
  Radar, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLand } from '../../context/LandContext';
import type { 
  MapStyleMode, 
  ParcelCalculations, 
  TerrainAnalysisData, 
  NearbyAnalysisData, 
  LandSuitabilityData 
} from '../../types/parcelIntelligence';
import { MapContainer } from './MapContainer';
import { MapControls } from './MapControls';
import { LocationSearch } from './LocationSearch';
import { ParcelInfoPanel } from './ParcelInfoPanel';
import { ElevationAnalysis } from './ElevationAnalysis';
import { NearbyFeatures } from './NearbyFeatures';
import { LandSuitability } from './LandSuitability';
import { AIRecommendation } from './AIRecommendation';
import { HistoricalAnalysis } from './HistoricalAnalysis';
import { AnalysisSidebar, type SidebarTabType } from './AnalysisSidebar';

import { fetchElevationAnalysis } from '../../services/elevationService';
import { analyzeNearbyInfrastructure } from '../../services/placesService';
import { calculateLandSuitability } from '../../services/suitabilityService';

interface LandParcelIntelligenceStudioProps {
  initialDistrict?: string;
  initialState?: string;
  onRegisteredSuccess?: (parcel: any) => void;
}

export const LandParcelIntelligenceStudio: React.FC<LandParcelIntelligenceStudioProps> = ({
  initialDistrict = 'Solapur',
  initialState = 'Maharashtra',
  onRegisteredSuccess
}) => {
  const navigate = useNavigate();
  const { registerNewParcel, selectedParcel, setSelectedParcel } = useLand();

  // State Management
  const [mapStyle, setMapStyle] = useState<MapStyleMode>('satellite');
  const [is3DMode, setIs3DMode] = useState<boolean>(false);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<SidebarTabType>('overview');
  const [selectedRadius, setSelectedRadius] = useState<number>(2000);

  const [parcelCalculations, setParcelCalculations] = useState<ParcelCalculations | null>(null);
  const [terrainData, setTerrainData] = useState<TerrainAnalysisData | null>(null);
  const [nearbyData, setNearbyData] = useState<NearbyAnalysisData | null>(null);
  const [suitabilityData, setSuitabilityData] = useState<LandSuitabilityData | null>(null);

  const [searchMarker, setSearchMarker] = useState<{ lat: number; lng: number; name: string } | null>({
    lat: 17.6599,
    lng: 75.9064,
    name: 'Solapur Land Parcel'
  });

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Controller function references from MapContainer
  const zoomInRef = useRef<() => void>(() => {});
  const zoomOutRef = useRef<() => void>(() => {});
  const resetMapRef = useRef<() => void>(() => {});
  const geolocateRef = useRef<() => void>(() => {});
  const clearPolygonRef = useRef<() => void>(() => {});

  // Trigger analysis when polygon is completed or changed
  const runDeepGeospatialAnalysis = useCallback(
    async (calc: ParcelCalculations) => {
      setIsAnalyzing(true);
      try {
        const polyCoords: [number, number][] = calc.geoJSON.geometry.coordinates[0];
        
        // 1. Terrain & DEM Elevation
        const terrainRes = await fetchElevationAnalysis(polyCoords);
        setTerrainData(terrainRes);

        // 2. Nearby Infrastructure Buffers
        const nearbyRes = await analyzeNearbyInfrastructure(calc.centroid.lat, calc.centroid.lng, selectedRadius);
        setNearbyData(nearbyRes);

        // 3. AI Land Suitability Scoring Engine
        const suitRes = calculateLandSuitability(calc, terrainRes, nearbyRes);
        setSuitabilityData(suitRes);
      } catch (err) {
        console.error('Analysis error:', err);
      } finally {
        setIsAnalyzing(false);
      }
    },
    [selectedRadius]
  );

  // Handle polygon calculated callback from map
  const handleParcelCalculated = useCallback(
    (calc: ParcelCalculations | null) => {
      setParcelCalculations(calc);
      if (calc) {
        runDeepGeospatialAnalysis(calc);
      } else {
        setTerrainData(null);
        setNearbyData(null);
        setSuitabilityData(null);
      }
    },
    [runDeepGeospatialAnalysis]
  );

  // Re-run radius buffer analysis when radius changes
  const handleRadiusChange = async (radius: number) => {
    setSelectedRadius(radius);
    if (parcelCalculations) {
      const nearbyRes = await analyzeNearbyInfrastructure(
        parcelCalculations.centroid.lat,
        parcelCalculations.centroid.lng,
        radius
      );
      setNearbyData(nearbyRes);
    }
  };

  // Location search selection handler
  const handleSelectLocation = (lat: number, lng: number, name: string) => {
    setSearchMarker({ lat, lng, name });
  };

  // Final Action: Register Parcel & Navigate to Dashboard
  const handleProceedToDashboard = async () => {
    if (!parcelCalculations) return;

    const newParcel = {
      ...selectedParcel,
      id: `parcel-geo-${Date.now()}`,
      name: `${searchMarker?.name || initialDistrict} Land Parcel`,
      district: initialDistrict,
      state: initialState,
      lat: parcelCalculations.centroid.lat,
      lng: parcelCalculations.centroid.lng,
      areaAcres: parcelCalculations.areaAcres,
      surveyNumber: parcelCalculations.geoJSON.properties.surveyNumber || 'MH-SOL-2026/891',
      boundaryCoordinates: parcelCalculations.coordinates.map((c) => [c.lat, c.lng] as [number, number]),
      ownershipVerified: true
    };

    await registerNewParcel(newParcel);
    setSelectedParcel(newParcel);
    confetti({ particleCount: 75, spread: 85, origin: { y: 0.6 } });

    if (onRegisteredSuccess) {
      onRegisteredSuccess(newParcel);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="w-full font-sans space-y-6">
      {/* Studio Header Banner */}
      <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#D5E1D9] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5EC] border border-[#BDE3CC] text-[#166534] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#15803D]" />
            <span>INTERACTIVE GIS PARCEL INTELLIGENCE STUDIO</span>
          </div>
          <h2 className="font-bold text-2xl sm:text-3xl text-[#17211B] tracking-tight">
            Draw & Analyze Land Boundary
          </h2>
          <p className="text-xs sm:text-sm text-[#405048] font-medium">
            High-precision satellite mapping, Turf.js geometry calculations, DEM elevation profiles, and AI suitability ranking.
          </p>
        </div>

        {/* Global Action CTA */}
        {parcelCalculations && (
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              onClick={handleProceedToDashboard}
              className="px-5 py-3 rounded-2xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <span>Enroll & View Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* MAIN GIS WORKSPACE GRID (Desktop Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: MODULE NAVIGATION & LOCATION SEARCH (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-[#FFFFFF] p-4 rounded-3xl border border-[#D5E1D9] shadow-sm space-y-2">
            <span className="text-[10px] text-[#64736A] font-bold uppercase block">
              SEARCH LOCATION / COORDINATES
            </span>
            <LocationSearch
              onSelectLocation={handleSelectLocation}
              currentCoordinates={
                parcelCalculations ? parcelCalculations.centroid : undefined
              }
            />
          </div>

          <AnalysisSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            hasParcel={!!parcelCalculations}
          />
        </div>

        {/* CENTER COLUMN: INTERACTIVE MAP & TOOLBAR (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          {/* Top Map Toolbar Controls */}
          <MapControls
            mapStyle={mapStyle}
            onStyleChange={setMapStyle}
            is3DMode={is3DMode}
            onToggle3D={() => setIs3DMode(!is3DMode)}
            isDrawing={isDrawing}
            onToggleDraw={() => setIsDrawing(!isDrawing)}
            hasPolygon={!!parcelCalculations}
            onClearPolygon={() => clearPolygonRef.current()}
            onZoomIn={() => zoomInRef.current()}
            onZoomOut={() => zoomOutRef.current()}
            onGeolocate={() => geolocateRef.current()}
            onResetView={() => resetMapRef.current()}
          />

          {/* Interactive Mapbox Canvas */}
          <div className="h-[520px] w-full relative">
            <MapContainer
              mapStyle={mapStyle}
              is3DMode={is3DMode}
              isDrawing={isDrawing}
              onDrawingChange={setIsDrawing}
              onParcelCalculated={handleParcelCalculated}
              searchMarker={searchMarker}
              onZoomInRef={(fn) => (zoomInRef.current = fn)}
              onZoomOutRef={(fn) => (zoomOutRef.current = fn)}
              onResetRef={(fn) => (resetMapRef.current = fn)}
              onGeolocateRef={(fn) => (geolocateRef.current = fn)}
              onClearPolygonRef={(fn) => (clearPolygonRef.current = fn)}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: PARCEL INFORMATION & QUICK AI CARD (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <ParcelInfoPanel
            parcel={parcelCalculations}
            isLoading={isAnalyzing}
            onViewFullAnalysis={() => {
              const el = document.getElementById('suitability-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>
      </div>

      {/* BOTTOM SECTIONS: TERRAIN, INFRASTRUCTURE, SUITABILITY, AND AI RECOMMENDATION */}
      {parcelCalculations && (
        <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-bottom-4">
          
          {/* 1. Top Executive AI Strategic Recommendation */}
          {suitabilityData && (
            <AIRecommendation
              topCategory={suitabilityData.topRecommendation}
              parcel={parcelCalculations}
              onProceed={handleProceedToDashboard}
            />
          )}

          {/* 2. Terrain Profile & Nearby Infrastructure Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ElevationAnalysis terrain={terrainData} isLoading={isAnalyzing} />
            <NearbyFeatures
              nearby={nearbyData}
              selectedRadius={selectedRadius}
              onRadiusChange={handleRadiusChange}
              isLoading={isAnalyzing}
            />
          </div>

          {/* 3. Deep AI Land Suitability Scoring Engine */}
          <div id="suitability-section">
            <LandSuitability suitability={suitabilityData} isLoading={isAnalyzing} />
          </div>

          {/* 4. Satellite Multi-Year Timeline History */}
          <HistoricalAnalysis district={initialDistrict} state={initialState} />
        </div>
      )}
    </div>
  );
};
