import React, { useState } from 'react';
import { 
  MapPin, 
  Sparkles, 
  Sun, 
  Droplets, 
  Sprout, 
  Zap, 
  Building2, 
  ShieldCheck, 
  Clock, 
  FlaskConical, 
  ArrowRight, 
  Info, 
  Lock 
} from 'lucide-react';
import { useLand } from '../context/LandContext';
import { useAuth } from '../context/AuthContext';
import { DataConfidenceBadge } from './DataConfidenceBadge';
import { SoilCheckupModal } from './SoilCheckupModal';

export const LandIdentityCard: React.FC = () => {
  const { selectedParcel } = useLand();
  const { user } = useAuth();
  const [isSoilCheckupOpen, setIsSoilCheckupOpen] = useState(false);

  const role = user?.role || 'landowner';
  const isDeveloper = role === 'developer';
  const isGovernment = role === 'government';
  const canBookSoil = role === 'landowner' || role === 'farmer' || role === 'admin';

  const displayName = isDeveloper
    ? `Commercial Opportunity (${selectedParcel.district})`
    : selectedParcel.name;

  return (
    <div className="bg-[#FFFFFF] p-6 sm:p-7 rounded-3xl border border-[#D5E1D9] shadow-sm space-y-5 font-sans text-[#17211B]">
      
      {/* 1. LAND LOCATION & IDENTITY HERO STRIP */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D5E1D9] pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F5EC] text-[#15803D] flex items-center justify-center border border-[#BDE3CC] shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-[#166534] uppercase tracking-wider font-mono">
                {isDeveloper ? 'PUBLIC OPPORTUNITY DOSSIER' : isGovernment ? 'REGIONAL PARCEL DOSSIER' : 'LAND LOCATION & CADASTRAL DOSSIER'}
              </span>
              <DataConfidenceBadge type="VERIFIED" label="VERIFIED 84% CONFIDENCE" />
            </div>
            <h2 className="font-bold text-2xl text-[#17211B] tracking-tight">
              {displayName}
            </h2>
            <p className="text-xs text-[#405048] font-medium">
              📍 Near Solapur-Vijayapura Corridor, {selectedParcel.district}, {selectedParcel.state}, India
            </p>
          </div>
        </div>

        {/* Dynamic Coordinates & Acreage Badges */}
        <div className="grid grid-cols-3 gap-2.5 text-xs">
          <div className="bg-[#F8FBF9] px-4 py-2 rounded-2xl border border-[#D5E1D9]">
            <span className="text-[10px] text-[#64736A] font-bold block uppercase">COORDINATES</span>
            <p className="font-bold text-[#17211B] text-sm">{selectedParcel.lat.toFixed(4)}°N, {selectedParcel.lng.toFixed(4)}°E</p>
          </div>
          <div className="bg-[#F8FBF9] px-4 py-2 rounded-2xl border border-[#D5E1D9]">
            <span className="text-[10px] text-[#64736A] font-bold block uppercase">LAND AREA</span>
            <p className="font-bold text-[#15803D] text-sm">{selectedParcel.areaAcres} Acres</p>
          </div>
          <div className="bg-[#E8F5EC] px-4 py-2 rounded-2xl border border-[#BDE3CC]">
            <span className="text-[10px] text-[#166534] font-bold block uppercase">STATUS</span>
            <p className="font-bold text-[#166534] text-sm">🟢 Mostly Open</p>
          </div>
        </div>
      </div>

      {/* 2. DYNAMIC AI LAND OVERVIEW */}
      <div className="p-4 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9] space-y-1.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#15803D]" />
          <span className="text-xs font-bold text-[#166534] uppercase tracking-wider">AI SATELLITE & TERRAIN ASSESSMENT</span>
        </div>
        <p className="text-sm text-[#17211B] leading-relaxed font-medium">
          “This is a {selectedParcel.areaAcres}-acre parcel in {selectedParcel.district}, {selectedParcel.state}. Satellite observations confirm open fallow terrain with gentle 2.1° slope, direct 40m highway frontage, and strong year-round solar insolation ({selectedParcel.infrastructure.solarRadiationKWh} kWh/m²/day), located 1.2 km from a 33kV substation.”
        </p>
      </div>

      {/* 3. LAND INTELLIGENCE HORIZONTAL DATA ROWS */}
      <div className="space-y-2.5 text-xs">
        <h3 className="font-bold text-xs text-[#17211B] uppercase tracking-wider">
          LAND INTELLIGENCE METRICS
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#D5E1D9] flex items-center justify-between">
            <span className="text-[#405048] font-medium text-xs">Current Condition:</span>
            <strong className="text-[#17211B] font-bold text-xs">Mostly Open Fallow</strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#D5E1D9] flex items-center justify-between">
            <span className="text-[#405048] font-medium text-xs">Soil Chemistry:</span>
            <strong className="text-[#17211B] font-bold text-xs">Loam (pH {selectedParcel.soil.pH}) • Verified</strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#D5E1D9] flex items-center justify-between">
            <span className="text-[#405048] font-medium text-xs">Water Context:</span>
            <strong className="text-[#17211B] font-bold text-xs">{selectedParcel.water.availability} (Depth 48m)</strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#D5E1D9] flex items-center justify-between">
            <span className="text-[#405048] font-medium text-xs">Road Frontage:</span>
            <strong className="text-[#17211B] font-bold text-xs">{selectedParcel.infrastructure.roadAccessQuality} ({selectedParcel.infrastructure.roadDistanceMeters}m)</strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#D5E1D9] flex items-center justify-between">
            <span className="text-[#405048] font-medium text-xs">Electricity Grid:</span>
            <strong className="text-[#17211B] font-bold text-xs">{selectedParcel.infrastructure.gridDistanceKm} km to 33kV</strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#D5E1D9] flex items-center justify-between">
            <span className="text-[#405048] font-medium text-xs">Nearby Development:</span>
            <strong className="text-[#17211B] font-bold text-xs">Residential + MIDC Zone</strong>
          </div>
        </div>
      </div>

      {/* 4. SOIL TESTING BANNER (Visible for Landowner/Farmer/Admin) */}
      {canBookSoil && (
        <div className="p-4 rounded-2xl bg-[#E8F5EC] border border-[#BDE3CC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] text-[#15803D] flex items-center justify-center border border-[#BDE3CC] shrink-0">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[#166534] text-sm">Need In-Person Soil & Water Lab Certification?</h4>
              <p className="text-xs text-[#405048] font-medium">
                An ICAR-certified agronomist can visit your parcel for GPS core drill sampling and official certification.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSoilCheckupOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs uppercase tracking-wide transition-all shadow-sm shrink-0"
          >
            Book Soil Checkup (₹499)
          </button>
        </div>
      )}

      {/* Soil Checkup Modal */}
      <SoilCheckupModal isOpen={isSoilCheckupOpen} onClose={() => setIsSoilCheckupOpen(false)} />
    </div>
  );
};
