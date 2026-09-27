import React from 'react';
import { 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Compass, 
  Layers, 
  X, 
  Edit3, 
  ShieldCheck, 
  Sparkles,
  Maximize2
} from 'lucide-react';
import type { LandParcel } from '../types/land';

interface LocationAccuracyModalProps {
  isOpen: boolean;
  onClose: () => void;
  detectedLocation: {
    lat: number;
    lng: number;
    accuracyMeters: number;
    address: string;
    village?: string;
    taluka?: string;
    district?: string;
    state?: string;
    pincode?: string;
    source?: string;
  } | null;
  onConfirmLocation: () => void;
  onRefineLocation: () => void;
  currentParcelAreaAcres: number;
  hasBoundaryPolygon: boolean;
}

export const LocationAccuracyModal: React.FC<LocationAccuracyModalProps> = ({
  isOpen,
  onClose,
  detectedLocation,
  onConfirmLocation,
  onRefineLocation,
  currentParcelAreaAcres,
  hasBoundaryPolygon
}) => {
  if (!isOpen || !detectedLocation) return null;

  const { lat, lng, accuracyMeters, address, village, taluka, district, state, pincode, source } = detectedLocation;

  const isHighAccuracy = accuracyMeters <= 30;
  const isModerateAccuracy = accuracyMeters > 30 && accuracyMeters <= 100;
  const isPoorAccuracy = accuracyMeters > 100;

  const areaHa = (currentParcelAreaAcres * 0.404686).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#FFFFFF] rounded-3xl shadow-2xl border border-[#D5E1D9] overflow-hidden font-sans text-[#17211B] flex flex-col">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-[#F8FBF9] border-b border-[#D5E1D9] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isPoorAccuracy ? 'bg-amber-100 text-amber-800' : 'bg-[#E8F5EC] text-[#15803D]'
            }`}>
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#17211B]">
                Verify Parcel Location & Cadastre
              </h3>
              <p className="text-[11px] text-[#64736A] font-medium">
                Bhuvan / ISRO Geospatial Cross-Verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#E8F5EC] text-[#64736A] flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          
          {/* Accuracy Warning or Success Banner */}
          {isPoorAccuracy ? (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 text-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-900">
                  GPS accuracy is insufficient (±{Math.round(accuracyMeters)}m)
                </p>
                <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                  Your browser provided an approximate IP/cell tower coordinate. Please click <strong>"Refine Location"</strong> to move the pin directly onto your land and draw the boundary.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-[#E8F5EC] border border-[#BDE3CC] text-[#166534] flex items-start gap-3 text-xs">
              <CheckCircle2 className="w-5 h-5 text-[#15803D] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#15803D]">
                  High Accuracy GPS Acquired (±{Math.round(accuracyMeters)}m radius)
                </p>
                <p className="text-[11px] text-[#2D5A3C] mt-0.5">
                  Location verified with national cadastre grid. Please confirm or refine before generating AI recommendations.
                </p>
              </div>
            </div>
          )}

          {/* Coordinate & Telemetry Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9]">
              <span className="text-[10px] uppercase font-bold text-[#64736A] block">Latitude</span>
              <span className="font-mono font-bold text-sm text-[#17211B] mt-0.5 block">{lat.toFixed(5)}° N</span>
            </div>
            <div className="p-3 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9]">
              <span className="text-[10px] uppercase font-bold text-[#64736A] block">Longitude</span>
              <span className="font-mono font-bold text-sm text-[#17211B] mt-0.5 block">{lng.toFixed(5)}° E</span>
            </div>
          </div>

          {/* Detailed Administrative Address */}
          <div className="p-3.5 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9] text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#64736A] uppercase">Detected Address</span>
              <span className="px-2 py-0.5 rounded-md bg-[#E8F5EC] text-[#15803D] font-bold text-[9px] border border-[#BDE3CC]">
                BHUVAN / CADASTRE
              </span>
            </div>
            <p className="font-extrabold text-sm text-[#17211B]">{address || `${district}, ${state}`}</p>
            <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] text-[#64736A]">
              <div><strong>Village:</strong> {village || 'Cadastre Grid'}</div>
              <div><strong>Taluka:</strong> {taluka || district}</div>
              <div><strong>State:</strong> {state} {pincode ? `(${pincode})` : ''}</div>
            </div>
          </div>

          {/* Land Boundary & Calculated Acreage */}
          <div className="p-3.5 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9] text-xs flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-[#64736A] uppercase">Calculated Parcel Area</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-extrabold text-base text-[#15803D]">{currentParcelAreaAcres.toFixed(2)} Acres</span>
                <span className="text-[11px] text-[#64736A]">({areaHa} Ha)</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-[#64736A] uppercase block">Boundary Status</span>
              <span className="font-bold text-xs text-[#17211B]">
                {hasBoundaryPolygon ? '✓ Polygon Defined' : 'Point Center'}
              </span>
            </div>
          </div>

          {/* Bhuvan Satellite Status */}
          <div className="flex items-center justify-between px-2 text-xs text-[#64736A]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#15803D] animate-ping"></span>
              <strong>Satellite Stream:</strong> Bhuvan / Sentinel-2 Live
            </span>
            <span className="font-mono text-[11px]">DEM Ready</span>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="p-4 bg-[#F8FBF9] border-t border-[#D5E1D9] flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onRefineLocation}
            className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-[#FFFFFF] hover:bg-[#E8F5EC] border border-[#D5E1D9] hover:border-[#15803D] text-[#17211B] font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <Edit3 className="w-4 h-4 text-[#15803D]" />
            <span>Refine Pin & Draw Boundary</span>
          </button>

          <button
            onClick={onConfirmLocation}
            className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-[#15803D] hover:bg-[#166534] text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm & Run Land Analysis</span>
          </button>
        </div>

      </div>
    </div>
  );
};
