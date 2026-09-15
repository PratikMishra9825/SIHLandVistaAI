import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Layers, 
  Maximize, 
  Copy, 
  Check, 
  Download, 
  Compass, 
  ArrowRight,
  ShieldCheck,
  FileCode
} from 'lucide-react';
import type { ParcelCalculations } from '../../types/parcelIntelligence';

interface ParcelInfoPanelProps {
  parcel: ParcelCalculations | null;
  onViewFullAnalysis: () => void;
  onExportGeoJSON?: () => void;
  isLoading?: boolean;
}

export const ParcelInfoPanel: React.FC<ParcelInfoPanelProps> = ({
  parcel,
  onViewFullAnalysis,
  isLoading
}) => {
  const [copiedGeoJSON, setCopiedGeoJSON] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'vertices' | 'geojson'>('overview');

  if (!parcel) {
    return (
      <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#D5E1D9] shadow-sm font-sans text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#E8F5EC] text-[#15803D] flex items-center justify-center mx-auto border border-[#BDE3CC]">
          <Layers className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-base text-[#17211B]">No Land Parcel Selected</h3>
          <p className="text-xs text-[#405048] mt-1">
            Click <strong>"Draw Parcel Boundary"</strong> above and drop points on the map to calculate area, perimeter, and centroid metrics.
          </p>
        </div>
      </div>
    );
  }

  const handleCopyGeoJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(parcel.geoJSON, null, 2));
    setCopiedGeoJSON(true);
    setTimeout(() => setCopiedGeoJSON(false), 2000);
  };

  const handleDownloadGeoJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(parcel.geoJSON, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `landvista_parcel_${Date.now()}.geojson`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-[#FFFFFF] rounded-3xl border border-[#D5E1D9] shadow-sm font-sans divide-y divide-[#F0F5F1] overflow-hidden">
      {/* Header Banner */}
      <div className="p-5 space-y-2 bg-gradient-to-br from-[#F8FBF9] to-[#FFFFFF]">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E8F5EC] border border-[#BDE3CC] text-[#166534] text-[11px] font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#15803D]" />
            <span>CALCULATED GEOMETRY</span>
          </div>
          <span className="text-[11px] text-[#64736A] font-mono font-bold">
            WGS84 • EPSG:4326
          </span>
        </div>

        <h3 className="font-bold text-lg text-[#17211B] flex items-center gap-2">
          <span>Land Parcel Intelligence</span>
          <ShieldCheck className="w-4 h-4 text-[#15803D]" />
        </h3>
        <p className="text-xs text-[#405048] font-medium">
          Closed polygon geometry verified via Turf.js geospatial calculation
        </p>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-1 bg-[#F0F5F1] rounded-xl text-xs font-bold mt-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'overview'
                ? 'bg-[#FFFFFF] text-[#166534] shadow-sm'
                : 'text-[#64736A] hover:text-[#17211B]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('vertices')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'vertices'
                ? 'bg-[#FFFFFF] text-[#166534] shadow-sm'
                : 'text-[#64736A] hover:text-[#17211B]'
            }`}
          >
            Vertices ({parcel.coordinates.length})
          </button>
          <button
            onClick={() => setActiveTab('geojson')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'geojson'
                ? 'bg-[#FFFFFF] text-[#166534] shadow-sm'
                : 'text-[#64736A] hover:text-[#17211B]'
            }`}
          >
            GeoJSON
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'overview' && (
        <div className="p-5 space-y-4">
          {/* Key Area Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9] text-center">
              <span className="text-[10px] text-[#64736A] font-bold uppercase block">AREA (ACRES)</span>
              <span className="text-lg font-bold text-[#15803D]">{parcel.areaAcres}</span>
              <span className="text-[10px] text-[#405048] block">Acres</span>
            </div>

            <div className="p-3 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9] text-center">
              <span className="text-[10px] text-[#64736A] font-bold uppercase block">HECTARES</span>
              <span className="text-lg font-bold text-[#17211B]">{parcel.areaHectares}</span>
              <span className="text-[10px] text-[#405048] block">ha</span>
            </div>

            <div className="p-3 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9] text-center">
              <span className="text-[10px] text-[#64736A] font-bold uppercase block">PERIMETER</span>
              <span className="text-lg font-bold text-[#17211B]">{parcel.perimeterMeters}</span>
              <span className="text-[10px] text-[#405048] block">Meters</span>
            </div>
          </div>

          <div className="p-3 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9] flex items-center justify-between text-xs font-semibold">
            <span className="text-[#64736A]">Total Square Meters:</span>
            <span className="font-mono text-[#17211B] font-bold">
              {parcel.areaSqMeters.toLocaleString()} m²
            </span>
          </div>

          {/* Centroid Coordinates Card */}
          <div className="p-3.5 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#17211B]">
              <span className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#15803D]" />
                <span>Parcel Centroid (Center)</span>
              </span>
              <span className="text-[10px] text-[#166534] bg-[#E8F5EC] px-2 py-0.5 rounded-full border border-[#BDE3CC]">
                Precision 1m
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 bg-white rounded-xl border border-[#D5E1D9]">
                <span className="text-[10px] text-[#64736A] block">Latitude:</span>
                <span className="font-bold text-[#17211B]">{parcel.centroid.lat.toFixed(6)}° N</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-[#D5E1D9]">
                <span className="text-[10px] text-[#64736A] block">Longitude:</span>
                <span className="font-bold text-[#17211B]">{parcel.centroid.lng.toFixed(6)}° E</span>
              </div>
            </div>
          </div>

          {/* Bounding Box Card */}
          <div className="p-3.5 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9] space-y-2">
            <span className="text-xs font-bold text-[#17211B] block flex items-center gap-1.5">
              <Maximize className="w-4 h-4 text-[#15803D]" />
              <span>Bounding Box Bounds</span>
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-1.5 bg-white rounded-lg border border-[#D5E1D9]">
                <span className="text-[#64736A] block text-[10px]">North:</span>
                <span className="font-bold text-[#17211B]">{parcel.boundingBox.north.toFixed(6)}</span>
              </div>
              <div className="p-1.5 bg-white rounded-lg border border-[#D5E1D9]">
                <span className="text-[#64736A] block text-[10px]">South:</span>
                <span className="font-bold text-[#17211B]">{parcel.boundingBox.south.toFixed(6)}</span>
              </div>
              <div className="p-1.5 bg-white rounded-lg border border-[#D5E1D9]">
                <span className="text-[#64736A] block text-[10px]">East:</span>
                <span className="font-bold text-[#17211B]">{parcel.boundingBox.east.toFixed(6)}</span>
              </div>
              <div className="p-1.5 bg-white rounded-lg border border-[#D5E1D9]">
                <span className="text-[#64736A] block text-[10px]">West:</span>
                <span className="font-bold text-[#17211B]">{parcel.boundingBox.west.toFixed(6)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VERTICES LIST */}
      {activeTab === 'vertices' && (
        <div className="p-5 space-y-3 max-h-72 overflow-y-auto">
          <div className="flex items-center justify-between text-xs font-bold text-[#64736A]">
            <span>VERTEX ID</span>
            <span>COORDINATES (LAT, LNG)</span>
          </div>
          <div className="space-y-1.5">
            {parcel.coordinates.map((pt) => (
              <div
                key={pt.index}
                className="p-2.5 bg-[#F8FBF9] hover:bg-[#E8F5EC] rounded-xl border border-[#D5E1D9] flex items-center justify-between text-xs font-mono transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#15803D] text-white text-[10px] font-bold flex items-center justify-center">
                    {pt.index}
                  </span>
                  <span className="font-bold text-[#17211B]">Point {pt.index}</span>
                </div>
                <div className="text-right">
                  <span className="text-[#15803D] font-bold">{pt.lat.toFixed(6)}° N</span>
                  <span className="text-[#64736A] ml-2">{pt.lng.toFixed(6)}° E</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: GEOJSON CODE */}
      {activeTab === 'geojson' && (
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64736A]">GeoJSON Feature Specification</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopyGeoJSON}
                className="p-1.5 rounded-lg bg-[#E8F5EC] text-[#166534] hover:bg-[#D5EEDF] text-xs font-bold flex items-center gap-1"
              >
                {copiedGeoJSON ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedGeoJSON ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownloadGeoJSON}
                className="p-1.5 rounded-lg bg-[#F8FBF9] text-[#17211B] hover:bg-[#E8F5EC] border border-[#D5E1D9] text-xs font-bold flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
          <pre className="p-3 bg-[#17211B] text-[#86EFAC] rounded-2xl text-[11px] font-mono overflow-x-auto max-h-56 leading-relaxed">
            {JSON.stringify(parcel.geoJSON, null, 2)}
          </pre>
        </div>
      )}

      {/* Primary Action Footer */}
      <div className="p-5 bg-gradient-to-t from-[#F8FBF9] to-[#FFFFFF] space-y-2">
        <button
          type="button"
          disabled={isLoading}
          onClick={onViewFullAnalysis}
          className="w-full py-3.5 px-4 rounded-2xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-sm uppercase tracking-wider shadow-md transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2"
        >
          <span>View Full Analysis</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-[10px] text-center text-[#64736A]">
          ⚡ Generates live solar irradiance, terrain elevation profile, and PM-KUSUM scheme matches
        </p>
      </div>
    </div>
  );
};
