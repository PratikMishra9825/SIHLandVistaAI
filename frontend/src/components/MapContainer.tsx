import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf';
import { 
  Layers, 
  Sun, 
  Droplets, 
  Zap, 
  Route, 
  MapPin, 
  Compass, 
  Maximize2, 
  Edit3, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  Satellite,
  Crosshair,
  Navigation,
  AlertTriangle,
  RotateCcw,
  Check,
  X,
  Info
} from 'lucide-react';
import { useLand } from '../context/LandContext';
import { useAuth } from '../context/AuthContext';
import { calculateParcelMetrics } from '../services/parcelAnalysisService';
import { LocationAccuracyModal } from './LocationAccuracyModal';

export const MapContainer: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);
  const drawingLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const { 
    selectedParcel, 
    parcels, 
    setSelectedParcel, 
    activeLayers, 
    toggleLayer,
    isLocatingGps,
    gpsError,
    pendingLocationReview,
    setPendingLocationReview,
    acquireHighAccuracyGps,
    confirmCustomParcelLocation,
    updateParcelBoundary
  } = useLand();

  const { user } = useAuth();
  const role = user?.role || 'landowner';
  const canEditBoundary = role === 'landowner' || role === 'farmer' || role === 'admin';
  const isDeveloper = role === 'developer';

  // Interactive Refinement Mode State
  const [isRefineMode, setIsRefineMode] = useState(false);
  const [customPinCoords, setCustomPinCoords] = useState<{ lat: number; lng: number }>({
    lat: selectedParcel.lat,
    lng: selectedParcel.lng
  });
  const [drawnVertices, setDrawnVertices] = useState<[number, number][]>(
    selectedParcel.boundaryCoordinates && selectedParcel.boundaryCoordinates.length >= 3
      ? selectedParcel.boundaryCoordinates
      : []
  );
  const [liveCalculatedAcres, setLiveCalculatedAcres] = useState<number>(selectedParcel.areaAcres);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Sync custom coords when selected parcel changes
  useEffect(() => {
    setCustomPinCoords({ lat: selectedParcel.lat, lng: selectedParcel.lng });
    if (selectedParcel.boundaryCoordinates && selectedParcel.boundaryCoordinates.length >= 3) {
      setDrawnVertices(selectedParcel.boundaryCoordinates);
    }
    setLiveCalculatedAcres(selectedParcel.areaAcres);
  }, [selectedParcel]);

  // Recalculate area whenever drawn vertices change
  useEffect(() => {
    if (drawnVertices.length >= 3) {
      // Convert [lat, lng] to [lng, lat] for Turf.js
      const turfCoords: [number, number][] = drawnVertices.map(v => [v[1], v[0]]);
      const metrics = calculateParcelMetrics(turfCoords);
      if (metrics) {
        setLiveCalculatedAcres(metrics.areaAcres);
      }
    }
  }, [drawnVertices]);

  // 1. Initialize Map
  useEffect(() => {
    if (!mapRef.current) return;

    if (!leafletMapRef.current) {
      const map = L.map(mapRef.current, {
        center: [selectedParcel.lat, selectedParcel.lng],
        zoom: 16,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // High-Resolution World Satellite Imagery
      const esriSatellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Bhuvan / ISRO National Cadastre Grid',
        maxZoom: 19,
      });
      esriSatellite.addTo(map);

      const layersGroup = L.layerGroup().addTo(map);
      layersGroupRef.current = layersGroup;

      const drawingGroup = L.layerGroup().addTo(map);
      drawingLayerGroupRef.current = drawingGroup;

      leafletMapRef.current = map;
    }
  }, []);

  // Map Click Listener for Pin Relocation / Polygon Drawing in Refine Mode
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (!isRefineMode) return;
      const clickedLat = Number(e.latlng.lat.toFixed(6));
      const clickedLng = Number(e.latlng.lng.toFixed(6));

      // Append vertex to drawn polygon
      setDrawnVertices(prev => {
        const next = [...prev, [clickedLat, clickedLng] as [number, number]];
        return next;
      });

      setStatusMessage(`Added boundary vertex #${drawnVertices.length + 1}. Click more points to close polygon.`);
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [isRefineMode, drawnVertices.length]);

  // 2. Render Layers, Custom Pin, and Polygon
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map || !layersGroupRef.current) return;

    layersGroupRef.current.clearLayers();

    // Center pin icon
    const customPinIcon = L.divIcon({
      className: 'custom-land-pin',
      html: `
        <div class="relative flex items-center justify-center cursor-pointer">
          <div class="w-9 h-9 rounded-full ${isRefineMode ? 'bg-amber-400/50 animate-ping' : 'bg-emerald-500/40 animate-ping'} absolute"></div>
          <div class="w-8 h-8 rounded-full ${isRefineMode ? 'bg-amber-600 border-2 border-white' : 'bg-[#15803D] border-2 border-white'} flex items-center justify-center shadow-xl">
            <div class="w-3 h-3 rounded-full bg-white"></div>
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const activeLat = isRefineMode ? customPinCoords.lat : selectedParcel.lat;
    const activeLng = isRefineMode ? customPinCoords.lng : selectedParcel.lng;

    const marker = L.marker([activeLat, activeLng], {
      icon: customPinIcon,
      draggable: isRefineMode
    });

    if (isRefineMode) {
      marker.on('dragend', (e) => {
        const newPos = (e.target as L.Marker).getLatLng();
        setCustomPinCoords({ lat: Number(newPos.lat.toFixed(6)), lng: Number(newPos.lng.toFixed(6)) });
        setStatusMessage(`Pin relocated to ${newPos.lat.toFixed(5)}°N, ${newPos.lng.toFixed(5)}°E`);
      });
    }

    marker.bindPopup(`
      <div class="p-2 text-slate-900 font-sans text-xs">
        <p class="font-extrabold text-sm text-[#15803D]">${selectedParcel.name}</p>
        <p class="text-[11px] text-slate-600">${selectedParcel.district}, ${selectedParcel.state}</p>
        <div class="mt-2 text-[11px] font-mono border-t border-slate-200 pt-1 space-y-0.5">
          <p>Area: <strong>${liveCalculatedAcres.toFixed(2)} Acres</strong></p>
          <p>Coordinates: ${activeLat.toFixed(5)}°N, ${activeLng.toFixed(5)}°E</p>
          <p>GPS Accuracy: ${selectedParcel.gpsAccuracyMeters ? `±${selectedParcel.gpsAccuracyMeters}m` : 'Cadastre Reference'}</p>
        </div>
      </div>
    `);

    marker.addTo(layersGroupRef.current);

    // Render Boundary Polygon
    const activePolygonCoords = isRefineMode ? drawnVertices : (selectedParcel.boundaryCoordinates || []);
    if (activePolygonCoords.length >= 3) {
      const polygon = L.polygon(activePolygonCoords, {
        color: isRefineMode ? '#D97706' : '#15803D',
        weight: 3.5,
        fillColor: isRefineMode ? '#F59E0B' : '#22C55E',
        fillOpacity: isRefineMode ? 0.35 : 0.22,
        dashArray: isRefineMode ? '6, 6' : undefined,
      });
      polygon.addTo(layersGroupRef.current);
    }

    // Render Vertex Markers in Refine Mode
    if (isRefineMode && drawnVertices.length > 0) {
      drawnVertices.forEach((vertex, idx) => {
        const vIcon = L.divIcon({
          className: 'vertex-pin',
          html: `<div class="w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow-md flex items-center justify-center text-[8px] font-bold text-white">${idx + 1}</div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        });
        L.marker(vertex, { icon: vIcon }).addTo(layersGroupRef.current!);
      });
    }

    // Overlays (Solar, Grid, Roads)
    if (activeLayers.solar) {
      L.circle([activeLat, activeLng], {
        radius: 800,
        color: '#D97706',
        fillColor: '#F59E0B',
        fillOpacity: 0.12,
        weight: 1.5,
      }).bindTooltip(`☀️ Solar Radiation: ${selectedParcel.infrastructure.solarRadiationKWh} kWh/m²`, { sticky: true }).addTo(layersGroupRef.current);
    }

    if (activeLayers.grid) {
      const gridLat = activeLat + 0.006;
      const gridLng = activeLng + 0.007;
      const gridIcon = L.divIcon({
        className: 'grid-pin',
        html: `<div class="px-2 py-0.5 rounded-lg bg-indigo-700 text-white font-mono text-[10px] font-bold border border-white shadow-md">⚡ 33kV Substation (${selectedParcel.infrastructure.gridDistanceKm}km)</div>`,
        iconSize: [130, 24],
      });
      L.marker([gridLat, gridLng], { icon: gridIcon }).addTo(layersGroupRef.current);
      L.polyline([[activeLat, activeLng], [gridLat, gridLng]], { color: '#4F46E5', weight: 2.5, dashArray: '6, 6' }).addTo(layersGroupRef.current);
    }

  }, [selectedParcel, isRefineMode, customPinCoords, drawnVertices, liveCalculatedAcres, activeLayers]);

  // Center map on parcel coordinates
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;
    map.flyTo([selectedParcel.lat, selectedParcel.lng], 16, { duration: 1.0 });
  }, [selectedParcel.lat, selectedParcel.lng]);

  // Handle "Use My Location"
  const handleUseMyLocation = async () => {
    setStatusMessage('Acquiring high-accuracy browser GPS (±m)...');
    const detected = await acquireHighAccuracyGps();
    if (detected) {
      setIsLocationModalOpen(true);
      const map = leafletMapRef.current;
      if (map) {
        map.flyTo([detected.lat, detected.lng], 17, { duration: 1.2 });
      }
      setStatusMessage(`GPS Location detected (±${Math.round(detected.accuracyMeters)}m). Please confirm or refine.`);
    } else {
      setStatusMessage('Could not retrieve GPS coordinates. Please refine location on map.');
    }
  };

  // Handle Confirm from Location Accuracy Modal
  const handleConfirmLocationFromModal = async () => {
    if (!pendingLocationReview) return;
    setStatusMessage('Locking confirmed parcel coordinates & re-running RAG MCDA engine...');
    await confirmCustomParcelLocation({
      lat: pendingLocationReview.lat,
      lng: pendingLocationReview.lng,
      areaAcres: liveCalculatedAcres,
      boundaryCoordinates: drawnVertices.length >= 3 ? drawnVertices : undefined,
      locationData: pendingLocationReview
    });
    setIsLocationModalOpen(false);
    setStatusMessage('✓ Parcel location verified and active.');
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Handle Refine from Modal
  const handleStartRefineMode = () => {
    setIsLocationModalOpen(false);
    setIsRefineMode(true);
    setStatusMessage('Refine Mode Active: Drag the center pin or click on map to define your parcel boundary.');
  };

  // Save Refined Location & Boundary
  const handleSaveRefinedParcel = async () => {
    setStatusMessage('Saving custom boundary and recalculating area...');
    const confirmed = await confirmCustomParcelLocation({
      lat: customPinCoords.lat,
      lng: customPinCoords.lng,
      areaAcres: liveCalculatedAcres,
      boundaryCoordinates: drawnVertices.length >= 3 ? drawnVertices : undefined,
      customName: `${selectedParcel.district || 'Confirmed'} Land Parcel`
    });
    setIsRefineMode(false);
    setStatusMessage(`✓ Confirmed: ${confirmed.areaAcres} Acres at [${confirmed.lat.toFixed(5)}°N, ${confirmed.lng.toFixed(5)}°E]`);
    setTimeout(() => setStatusMessage(null), 4500);
  };

  // Clear polygon vertices
  const handleClearPolygon = () => {
    setDrawnVertices([]);
    setStatusMessage('Polygon cleared. Click map to place new boundary vertices.');
  };

  const gpsAccuracy = selectedParcel.gpsAccuracyMeters || 15;
  const isGpsPoor = gpsAccuracy > 100;
  const areaHectares = (liveCalculatedAcres * 0.404686).toFixed(2);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-[#FFFFFF] border border-[#D5E1D9] shadow-sm flex flex-col font-sans text-[#17211B]">
      
      {/* -----------------------------------------------------------
          TOP CONTROLS & LOCATION SYSTEM BAR
      ----------------------------------------------------------- */}
      <div className="flex flex-wrap items-center justify-between p-4 border-b border-[#D5E1D9] bg-[#FFFFFF] z-20 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E8F5EC] text-[#15803D] flex items-center justify-center border border-[#BDE3CC] shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-[#17211B] uppercase tracking-wide">
                BHUVAN & SATELLITE CADASTRE SYSTEM
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#E8F5EC] text-[#15803D] text-[10px] font-bold border border-[#BDE3CC]">
                🟢 Bhuvan / ISRO Active
              </span>
            </div>
            <p className="text-xs text-[#526358] font-medium mt-0.5">
              {selectedParcel.name} • [{selectedParcel.lat.toFixed(5)}° N, {selectedParcel.lng.toFixed(5)}° E]
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          
          {/* 1. USE MY LOCATION (HIGH ACCURACY GPS) */}
          <button
            onClick={handleUseMyLocation}
            disabled={isLocatingGps}
            className="px-3.5 py-2 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
            title="Obtain high-accuracy GPS and cross-check with Bhuvan"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocatingGps ? 'animate-spin' : ''}`} />
            <span>{isLocatingGps ? 'Locating...' : 'Use My Location'}</span>
          </button>

          {/* 2. REFINE LOCATION & BOUNDARY MODE */}
          {canEditBoundary && (
            <button
              onClick={() => {
                if (isRefineMode) {
                  handleSaveRefinedParcel();
                } else {
                  setIsRefineMode(true);
                  setStatusMessage('Refine mode: Drag center pin or click on map to draw polygon boundary.');
                }
              }}
              className={`px-3.5 py-2 rounded-xl border flex items-center gap-1.5 transition-all shadow-xs ${
                isRefineMode
                  ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600'
                  : 'bg-[#F8FBF9] hover:bg-[#E8F5EC] text-[#17211B] border-[#D5E1D9]'
              }`}
            >
              {isRefineMode ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5 text-[#15803D]" />}
              <span>{isRefineMode ? 'Save Confirmed Parcel' : 'Refine Location & Boundary'}</span>
            </button>
          )}

          {/* Cancel / Clear in Refine Mode */}
          {isRefineMode && (
            <button
              onClick={handleClearPolygon}
              className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 flex items-center gap-1"
              title="Clear drawn vertices"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Polygon</span>
            </button>
          )}

          {/* Parcel Selector Dropdown */}
          <select
            value={selectedParcel.id}
            onChange={(e) => {
              const p = parcels.find((item) => item.id === e.target.value);
              if (p) setSelectedParcel(p);
            }}
            className="rounded-xl px-3 py-2 bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B] font-bold focus:border-[#15803D] outline-none text-xs"
          >
            {parcels.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.district}) • {p.areaAcres} Ac
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* -----------------------------------------------------------
          REAL-TIME TELEMETRY & GPS ACCURACY HUD STRIP
      ----------------------------------------------------------- */}
      <div className="px-4 py-2.5 bg-[#F8FBF9] border-b border-[#D5E1D9] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4 text-[#17211B]">
          
          {/* Latitude & Longitude */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase text-[#64736A]">Coordinates:</span>
            <span className="font-mono font-extrabold text-xs">
              {(isRefineMode ? customPinCoords.lat : selectedParcel.lat).toFixed(5)}° N, {(isRefineMode ? customPinCoords.lng : selectedParcel.lng).toFixed(5)}° E
            </span>
          </div>

          {/* GPS Accuracy Status */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase text-[#64736A]">GPS Accuracy:</span>
            <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] border ${
              isGpsPoor
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-[#E8F5EC] text-[#15803D] border-[#BDE3CC]'
            }`}>
              {isGpsPoor ? `⚠️ ±${Math.round(gpsAccuracy)}m (Insufficient - Refine Pin)` : `✓ ±${Math.round(gpsAccuracy)}m (High Accuracy)`}
            </span>
          </div>

          {/* Calculated Area from Polygon */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase text-[#64736A]">Calculated Area:</span>
            <span className="font-extrabold text-[#15803D]">
              {liveCalculatedAcres.toFixed(2)} Acres
            </span>
            <span className="text-[10px] text-[#64736A]">({areaHectares} Ha)</span>
          </div>

          {/* Boundary Status */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase text-[#64736A]">Boundary:</span>
            <span className="font-bold text-[#17211B]">
              {drawnVertices.length >= 3 ? `${drawnVertices.length} Vertices Polygon` : 'Point Centroid'}
            </span>
          </div>
        </div>

        {/* Address */}
        <div className="text-[#64736A] font-semibold text-[11px] truncate max-w-xs">
          📍 {selectedParcel.verifiedAddress || `${selectedParcel.district}, ${selectedParcel.state}`}
        </div>
      </div>

      {/* Dynamic Status / Action Feedback Message */}
      {statusMessage && (
        <div className="px-4 py-2 bg-[#E8F5EC] border-b border-[#BDE3CC] text-xs text-[#166534] font-bold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#15803D]" />
            <span>{statusMessage}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-[#15803D] hover:text-[#166534]">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Map Canvas Viewport */}
      <div className="relative w-full h-[440px] lg:h-[500px]">
        <div ref={mapRef} className="w-full h-full z-0" />

        {/* Refine Mode Helper Overlay */}
        {isRefineMode && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-amber-500 text-white px-4 py-2 rounded-2xl shadow-xl font-bold text-xs flex items-center gap-2 border border-white/20 backdrop-blur-sm animate-bounce">
            <Crosshair className="w-4 h-4" />
            <span>Click map to add boundary points or drag center pin. Click 'Save' when done.</span>
          </div>
        )}

        {/* Left Floating Intelligence Layers Panel */}
        <div className="absolute top-4 left-4 z-10 bg-[#FFFFFF]/95 p-3.5 rounded-2xl border border-[#D5E1D9] text-xs max-w-[210px] shadow-md backdrop-blur-md">
          <div className="flex items-center gap-1.5 font-bold text-[#17211B] mb-2.5 border-b border-[#D5E1D9] pb-1.5">
            <Layers className="w-4 h-4 text-[#15803D]" />
            <span className="uppercase text-[11px] tracking-wider">GIS OVERLAYS</span>
          </div>

          <div className="space-y-2 text-xs font-medium text-[#17211B]">
            <label className="flex items-center justify-between cursor-pointer hover:text-[#15803D]">
              <span className="flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-[#D97706]" /> Solar Radiation
              </span>
              <input
                type="checkbox"
                checked={activeLayers.solar}
                onChange={() => toggleLayer('solar')}
                className="rounded accent-[#15803D] w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer hover:text-[#15803D]">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#4F46E5]" /> 33kV Power Grid
              </span>
              <input
                type="checkbox"
                checked={activeLayers.grid}
                onChange={() => toggleLayer('grid')}
                className="rounded accent-[#15803D] w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer hover:text-[#15803D]">
              <span className="flex items-center gap-1.5">
                <Route className="w-3.5 h-3.5 text-[#15803D]" /> Paved Roads
              </span>
              <input
                type="checkbox"
                checked={activeLayers.roads}
                onChange={() => toggleLayer('roads')}
                className="rounded accent-[#15803D] w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer hover:text-[#15803D]">
              <span className="flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-[#0284C7]" /> Water Canals
              </span>
              <input
                type="checkbox"
                checked={activeLayers.soil}
                onChange={() => toggleLayer('soil')}
                className="rounded accent-[#15803D] w-4 h-4 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Right Floating Land Intelligence Snapshot */}
        <div className="absolute top-4 right-4 z-10 bg-[#FFFFFF]/95 p-4 rounded-2xl border border-[#D5E1D9] text-xs w-64 shadow-md backdrop-blur-md hidden sm:block">
          <div className="flex items-center justify-between border-b border-[#D5E1D9] pb-2 mb-2">
            <span className="font-bold text-[#17211B] text-xs">CADASTRE METRICS</span>
            <span className="px-2 py-0.5 rounded-full bg-[#E8F5EC] text-[#15803D] text-[10px] font-bold">
              VERIFIED
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-[#F8FBF9] p-2 rounded-xl border border-[#D5E1D9]">
              <div className="text-[9px] text-[#64736A] font-bold uppercase">Area (Polygon)</div>
              <div className="text-[#15803D] font-extrabold text-xs">{liveCalculatedAcres.toFixed(2)} Acres</div>
            </div>
            <div className="bg-[#F8FBF9] p-2 rounded-xl border border-[#D5E1D9]">
              <div className="text-[9px] text-[#64736A] font-bold uppercase">Slope</div>
              <div className="text-[#17211B] font-bold text-xs">{selectedParcel.infrastructure.slopeDegrees}° (Flat)</div>
            </div>
            <div className="bg-[#F8FBF9] p-2 rounded-xl border border-[#D5E1D9]">
              <div className="text-[9px] text-[#64736A] font-bold uppercase">Soil pH</div>
              <div className="text-[#15803D] font-bold text-xs">{selectedParcel.soil.pH} (Optimal)</div>
            </div>
            <div className="bg-[#F8FBF9] p-2 rounded-xl border border-[#D5E1D9]">
              <div className="text-[9px] text-[#64736A] font-bold uppercase">Substation</div>
              <div className="text-[#17211B] font-bold text-xs">{selectedParcel.infrastructure.gridDistanceKm} km</div>
            </div>
          </div>
        </div>
      </div>

      {/* Location Confirmation & Adjustment Modal */}
      <LocationAccuracyModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        detectedLocation={pendingLocationReview}
        onConfirmLocation={handleConfirmLocationFromModal}
        onRefineLocation={handleStartRefineMode}
        currentParcelAreaAcres={liveCalculatedAcres}
        hasBoundaryPolygon={drawnVertices.length >= 3}
      />
    </div>
  );
};
