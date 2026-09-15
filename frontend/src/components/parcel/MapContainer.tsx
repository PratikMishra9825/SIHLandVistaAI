import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf';
import type { 
  MapStyleMode, 
  ParcelCalculations 
} from '../../types/parcelIntelligence';
import { calculateParcelMetrics } from '../../services/parcelAnalysisService';

// Fix Leaflet Default Icon path issues in Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapContainerProps {
  mapStyle: MapStyleMode;
  is3DMode?: boolean;
  isDrawing: boolean;
  onDrawingChange: (isDrawing: boolean) => void;
  onParcelCalculated: (calculations: ParcelCalculations | null) => void;
  onCoordinatesChange?: (coords: { lat: number; lng: number }) => void;
  initialPolygon?: [number, number][]; // [lng, lat]
  searchMarker?: { lat: number; lng: number; name: string } | null;
  onResetRef?: (resetFn: () => void) => void;
  onZoomInRef?: (fn: () => void) => void;
  onZoomOutRef?: (fn: () => void) => void;
  onGeolocateRef?: (fn: () => void) => void;
  onClearPolygonRef?: (fn: () => void) => void;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  mapStyle,
  isDrawing,
  onDrawingChange,
  onParcelCalculated,
  onCoordinatesChange,
  initialPolygon,
  searchMarker,
  onResetRef,
  onZoomInRef,
  onZoomOutRef,
  onGeolocateRef,
  onClearPolygonRef
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const polygonLayerRef = useRef<L.Polygon | null>(null);
  const rubberbandLineRef = useRef<L.Polyline | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const searchMarkerRef = useRef<L.Marker | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);
  const infraLayerRef = useRef<L.LayerGroup | null>(null);

  // Active drawn vertices: Array of [lng, lat]
  const [points, setPoints] = useState<[number, number][]>(
    initialPolygon && initialPolygon.length >= 3
      ? initialPolygon
      : [
          [75.9042, 17.6585],
          [75.9088, 17.6582],
          [75.9095, 17.6620],
          [75.9038, 17.6615]
        ]
  );

  const [cursorPos, setCursorPos] = useState<{ lat: number; lng: number } | null>({
    lat: 17.6601,
    lng: 75.9064
  });

  // Calculate parcel metrics when points change
  const recalculateParcel = useCallback((currentPoints: [number, number][]) => {
    if (currentPoints.length >= 3) {
      const calc = calculateParcelMetrics(currentPoints);
      onParcelCalculated(calc);
    } else {
      onParcelCalculated(null);
    }
  }, [onParcelCalculated]);

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [17.6599, 75.9064],
        zoom: 15,
        zoomControl: false,
        attributionControl: false
      });

      // High Resolution ESRI Satellite Imagery
      const esriSatellite = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19 }
      );
      esriSatellite.addTo(map);
      baseTileLayerRef.current = esriSatellite;

      // Layer groups for markers & infrastructure
      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;

      const infraLayer = L.layerGroup().addTo(map);
      infraLayerRef.current = infraLayer;

      // Cursor movement tracking & dynamic rubberband drawing guide
      map.on('mousemove', (e: L.LeafletMouseEvent) => {
        setCursorPos({ lat: e.latlng.lat, lng: e.latlng.lng });
        if (onCoordinatesChange) {
          onCoordinatesChange({ lat: e.latlng.lat, lng: e.latlng.lng });
        }
      });

      // Click to add points when in drawing mode
      map.on('click', (e: L.LeafletMouseEvent) => {
        setPoints((prev) => {
          // If drawing is enabled from toolbar, add new point
          const newPt: [number, number] = [e.latlng.lng, e.latlng.lat];
          const updated = [...prev, newPt];
          recalculateParcel(updated);
          return updated;
        });
      });

      mapRef.current = map;

      // Provide ref control bindings
      if (onZoomInRef) onZoomInRef(() => map.zoomIn());
      if (onZoomOutRef) onZoomOutRef(() => map.zoomOut());
      if (onResetRef) onResetRef(() => map.setView([17.6599, 75.9064], 15));
      if (onGeolocateRef) {
        onGeolocateRef(() => {
          if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((pos) => {
              map.flyTo([pos.coords.latitude, pos.coords.longitude], 16);
            });
          }
        });
      }
      if (onClearPolygonRef) {
        onClearPolygonRef(() => {
          setPoints([]);
          onParcelCalculated(null);
        });
      }

      // Initial calculation
      recalculateParcel(points);
    }

    return () => {
      // Map cleanup
    };
  }, []);

  // 2. Handle Map Style Switch (Satellite, Standard, Terrain)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (baseTileLayerRef.current) {
      map.removeLayer(baseTileLayerRef.current);
    }

    let newTileLayer: L.TileLayer;

    switch (mapStyle) {
      case 'standard':
        newTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19
        });
        break;

      case 'terrain':
        newTileLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
          maxZoom: 17
        });
        break;

      case 'satellite':
      default:
        newTileLayer = L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          { maxZoom: 19 }
        );
        break;
    }

    newTileLayer.addTo(map);
    baseTileLayerRef.current = newTileLayer;
    newTileLayer.bringToBack();
  }, [mapStyle]);

  // 3. Render Polygon and Draggable Node Markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !markersLayerRef.current) return;

    // Clear existing polygon
    if (polygonLayerRef.current) {
      map.removeLayer(polygonLayerRef.current);
      polygonLayerRef.current = null;
    }

    markersLayerRef.current.clearLayers();

    if (points.length >= 3) {
      const latLngs: [number, number][] = points.map(([lng, lat]) => [lat, lng]);

      const poly = L.polygon(latLngs, {
        color: '#15803D',
        weight: 3,
        fillColor: '#16A34A',
        fillOpacity: 0.28,
        dashArray: isDrawing ? '6, 6' : undefined
      }).addTo(map);

      polygonLayerRef.current = poly;

      // Add draggable circular vertex markers
      points.forEach(([lng, lat], index) => {
        const vertexIcon = L.divIcon({
          className: 'custom-node-icon',
          html: `
            <div class="w-6 h-6 rounded-full bg-[#15803D] border-2 border-white shadow-md flex items-center justify-center text-[10px] font-bold text-white cursor-move hover:scale-125 transition-transform">
              ${index + 1}
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker([lat, lng], {
          icon: vertexIcon,
          draggable: true
        });

        marker.on('drag', (e: L.LeafletEvent) => {
          const target = e.target as L.Marker;
          const pos = target.getLatLng();
          setPoints((prev) => {
            const updated = [...prev];
            updated[index] = [pos.lng, pos.lat];
            recalculateParcel(updated);
            return updated;
          });
        });

        marker.bindTooltip(`Point ${index + 1}: ${lat.toFixed(5)}°, ${lng.toFixed(5)}° (Drag to adjust)`, {
          direction: 'top',
          offset: [0, -12]
        });

        markersLayerRef.current?.addLayer(marker);
      });

      // Centroid icon with pulsing badge
      const center = poly.getBounds().getCenter();
      const centerIcon = L.divIcon({
        className: 'custom-centroid-icon',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-7 h-7 rounded-full bg-emerald-500/30 animate-ping absolute"></div>
            <div class="w-6 h-6 rounded-full bg-[#15803D] border-2 border-white flex items-center justify-center shadow-lg">
              <span class="text-white text-[10px] font-bold">★</span>
            </div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const centerMarker = L.marker(center, { icon: centerIcon });
      centerMarker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; padding: 2px;">
          <strong style="color: #15803D;">Parcel Centroid (AOI)</strong><br/>
          Lat: ${center.lat.toFixed(5)}° N<br/>
          Lng: ${center.lng.toFixed(5)}° E
        </div>
      `);
      markersLayerRef.current.addLayer(centerMarker);
    } else if (points.length > 0) {
      // Draw intermediate nodes while creating polygon
      points.forEach(([lng, lat], index) => {
        const vertexIcon = L.divIcon({
          className: 'custom-node-icon',
          html: `
            <div class="w-5 h-5 rounded-full bg-[#15803D] border-2 border-white shadow-md flex items-center justify-center text-[9px] font-bold text-white">
              ${index + 1}
            </div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });
        const marker = L.marker([lat, lng], { icon: vertexIcon });
        markersLayerRef.current?.addLayer(marker);
      });
    }
  }, [points, isDrawing, recalculateParcel]);

  // 4. Render Surrounding Infrastructure Nodes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !infraLayerRef.current) return;

    infraLayerRef.current.clearLayers();

    if (points.length >= 3) {
      const centerLat = points[0][1];
      const centerLng = points[0][0];

      const infraItems = [
        {
          name: 'State Highway Corridor',
          type: 'Road Corridor',
          lat: centerLat - 0.0035,
          lng: centerLng + 0.0028,
          icon: '🛣️',
          dist: '380m'
        },
        {
          name: '33/11kV Substation Feeder',
          type: 'Electrical Grid',
          lat: centerLat + 0.0062,
          lng: centerLng - 0.0045,
          icon: '⚡',
          dist: '1.2 km'
        },
        {
          name: 'Canal Irrigation Channel',
          type: 'Water Body',
          lat: centerLat + 0.0048,
          lng: centerLng + 0.0055,
          icon: '💧',
          dist: '1.6 km'
        }
      ];

      infraItems.forEach((item) => {
        const icon = L.divIcon({
          className: 'custom-infra-icon',
          html: `
            <div class="px-2 py-1 bg-white/95 rounded-lg shadow-md border border-gray-200 text-[10px] font-bold text-gray-800 flex items-center gap-1">
              <span>${item.icon}</span>
              <span>${item.dist}</span>
            </div>
          `,
          iconSize: [60, 24],
          iconAnchor: [30, 12]
        });

        const m = L.marker([item.lat, item.lng], { icon });
        m.bindPopup(`
          <div style="font-family: sans-serif; font-size: 11px;">
            <strong>${item.name}</strong><br/>
            Type: ${item.type}<br/>
            Proximity: ${item.dist}
          </div>
        `);
        infraLayerRef.current?.addLayer(m);
      });
    }
  }, [points]);

  // 5. Update Center when Location Search is clicked
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !searchMarker) return;

    map.flyTo([searchMarker.lat, searchMarker.lng], 15, { duration: 1.2 });

    if (searchMarkerRef.current) {
      map.removeLayer(searchMarkerRef.current);
    }

    const searchIcon = L.divIcon({
      className: 'custom-search-marker',
      html: `
        <div class="p-1 bg-[#15803D] rounded-full border-2 border-white shadow-lg text-white">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 24]
    });

    const marker = L.marker([searchMarker.lat, searchMarker.lng], { icon: searchIcon }).addTo(map);
    marker.bindPopup(`<strong>${searchMarker.name}</strong>`).openPopup();
    searchMarkerRef.current = marker;

    const d = 0.003;
    const newPoints: [number, number][] = [
      [searchMarker.lng - d, searchMarker.lat - d],
      [searchMarker.lng + d, searchMarker.lat - d],
      [searchMarker.lng + d * 1.2, searchMarker.lat + d],
      [searchMarker.lng - d, searchMarker.lat + d]
    ];
    setPoints(newPoints);
    recalculateParcel(newPoints);
  }, [searchMarker, recalculateParcel]);

  // Handler: Start New Boundary Draw
  const handleStartNewDraw = () => {
    setPoints([]);
    onParcelCalculated(null);
    onDrawingChange(true);
  };

  // Handler: Undo Last Point
  const handleUndoPoint = () => {
    if (points.length > 0) {
      const updated = points.slice(0, -1);
      setPoints(updated);
      recalculateParcel(updated);
    }
  };

  return (
    <div className="w-full h-full relative rounded-3xl overflow-hidden border border-[#D5E1D9] shadow-sm bg-[#F8FBF9]">
      
      {/* 1. Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[460px] z-10" />

      {/* 2. Top-Left Draw Polygon Tool Overlay HUD */}
      <div className="absolute top-3.5 left-3.5 z-20 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            if (!isDrawing) {
              handleStartNewDraw();
            } else {
              onDrawingChange(false);
            }
          }}
          className={`px-3.5 py-2 rounded-2xl border text-xs font-bold shadow-md transition-all flex items-center gap-1.5 ${
            isDrawing
              ? 'bg-[#DC2626] text-white border-red-600 animate-pulse'
              : 'bg-[#FFFFFF] text-[#166534] border-[#BDE3CC] hover:bg-[#E8F5EC]'
          }`}
        >
          <span>{isDrawing ? '🏁 Finish Drawing' : '✏️ Draw Polygon Boundary'}</span>
        </button>

        {isDrawing && (
          <button
            type="button"
            onClick={handleUndoPoint}
            disabled={points.length === 0}
            className="px-3 py-2 rounded-2xl bg-[#FFFFFF] border border-[#D5E1D9] text-[#17211B] text-xs font-bold shadow-md hover:bg-[#F8FBF9] disabled:opacity-40"
          >
            ↩️ Undo Point
          </button>
        )}

        <div className="px-3 py-2 rounded-2xl bg-[#FFFFFF]/95 backdrop-blur-md border border-[#D5E1D9] shadow-xs text-xs font-bold text-[#166534] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#15803D] animate-pulse"></span>
          <span>{points.length} Vertices Outline</span>
        </div>
      </div>

      {/* 3. Bottom-Right GPS Coordinate HUD */}
      <div className="absolute bottom-3.5 right-3.5 z-20 pointer-events-none">
        <div className="px-3 py-1.5 rounded-xl bg-[#FFFFFF]/95 backdrop-blur-md border border-[#D5E1D9] shadow-xs text-[11px] font-mono font-bold text-[#17211B] flex items-center gap-2">
          <span className="text-[#15803D]">GPS:</span>
          <span>{cursorPos ? `${cursorPos.lat.toFixed(5)}° N, ${cursorPos.lng.toFixed(5)}° E` : '17.65990° N, 75.90640° E'}</span>
          <span className="text-[#64736A] font-normal">| WGS84</span>
        </div>
      </div>

      {/* 4. Drawing Helper Instruction Bar */}
      {isDrawing && (
        <div className="absolute top-16 left-3.5 right-3.5 z-20 pointer-events-none">
          <div className="px-4 py-2 rounded-2xl bg-[#15803D] text-white shadow-xl text-xs font-bold text-center max-w-md mx-auto animate-in fade-in">
            <span>Click on the satellite map to place Point 1 → Point 2 → Point 3 → Click "Finish Drawing" to close polygon</span>
          </div>
        </div>
      )}

    </div>
  );
};
