import React from 'react';
import { 
  Building2, 
  Zap, 
  MapPin, 
  Droplet, 
  Home, 
  Compass,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { DataConfidenceBadge } from './DataConfidenceBadge';
import { useLand } from '../context/LandContext';
import { analyzeSurroundingsFrontend } from '../utils/aiEngine';
import type { SurroundingFeature } from '../types/land';

interface SurroundingIntelligenceProps {
  features?: SurroundingFeature[];
}

export const SurroundingIntelligence: React.FC<SurroundingIntelligenceProps> = ({ features: propFeatures }) => {
  const { selectedParcel } = useLand();
  const spatial = analyzeSurroundingsFrontend(selectedParcel);
  const features = propFeatures && propFeatures.length > 0 ? propFeatures : spatial.proximityMatrix;

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Infrastructure':
        return Zap;
      case 'Industry':
        return Building2;
      case 'Natural':
        return Droplet;
      case 'Residential':
        return Home;
      default:
        return MapPin;
    }
  };

  return (
    <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl space-y-6 font-sans border border-[#D5E1D9] shadow-sm text-[#17211B]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D5E1D9] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E8F5EC] text-[#15803D] flex items-center justify-center border border-[#BDE3CC]">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#166534] uppercase font-mono">MULTI-BUFFER GEOSPATIAL PROXIMITY ENGINE</span>
              <DataConfidenceBadge type="VERIFIED" label="DISTANCE DECAY WEIGHTED" />
            </div>
            <h3 className="font-extrabold text-lg text-[#17211B]">
              Surrounding Spatial Environment & Infrastructure Intelligence
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#64736A]">Pattern:</span>
          <span className="px-3 py-1 rounded-full bg-[#E8F5EC] text-[#15803D] font-extrabold text-xs border border-[#BDE3CC]">
            {spatial.dominantPattern}
          </span>
        </div>
      </div>

      {/* Surrounding Land-Use Composition Strip */}
      <div className="p-4 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9] space-y-2">
        <div className="flex justify-between items-center text-xs font-bold text-[#17211B]">
          <span>Surrounding 3km Buffer Composition</span>
          <span className="text-[#64736A]">{spatial.patternDescription}</span>
        </div>
        <div className="h-3.5 w-full rounded-full overflow-hidden flex bg-gray-100">
          <div style={{ width: `${spatial.composition.agricultural}%` }} className="bg-emerald-500 h-full" title="Agri"></div>
          <div style={{ width: `${spatial.composition.residential}%` }} className="bg-blue-500 h-full" title="Residential"></div>
          <div style={{ width: `${spatial.composition.industrial}%` }} className="bg-amber-500 h-full" title="Industrial"></div>
          <div style={{ width: `${spatial.composition.commercial}%` }} className="bg-purple-500 h-full" title="Commercial"></div>
          <div style={{ width: `${spatial.composition.open}%` }} className="bg-gray-400 h-full" title="Open"></div>
        </div>
        <div className="flex flex-wrap gap-4 text-xs font-medium pt-1">
          <span>🌱 <strong>Agri:</strong> {spatial.composition.agricultural}%</span>
          <span>🏠 <strong>Residential:</strong> {spatial.composition.residential}%</span>
          <span>🏭 <strong>Industrial:</strong> {spatial.composition.industrial}%</span>
          <span>🏪 <strong>Commercial:</strong> {spatial.composition.commercial}%</span>
          <span>🌾 <strong>Open:</strong> {spatial.composition.open}%</span>
        </div>
      </div>

      {/* Multi-Buffer Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-center">
          <p className="text-[10px] font-bold text-[#64736A] uppercase">500m Buffer</p>
          <p className="font-extrabold text-sm text-[#17211B] mt-0.5">{spatial.bufferBreakdown['500m'].count} Nodes</p>
          <p className="text-[10px] text-[#15803D] font-bold">100% Weight</p>
        </div>
        <div className="p-3 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-center">
          <p className="text-[10px] font-bold text-[#64736A] uppercase">1 km Buffer</p>
          <p className="font-extrabold text-sm text-[#17211B] mt-0.5">{spatial.bufferBreakdown['1km'].count} Nodes</p>
          <p className="text-[10px] text-[#15803D] font-bold">85% Weight</p>
        </div>
        <div className="p-3 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-center">
          <p className="text-[10px] font-bold text-[#64736A] uppercase">3 km Buffer</p>
          <p className="font-extrabold text-sm text-[#17211B] mt-0.5">{spatial.bufferBreakdown['3km'].count} Nodes</p>
          <p className="text-[10px] text-[#15803D] font-bold">65% Weight</p>
        </div>
        <div className="p-3 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-center">
          <p className="text-[10px] font-bold text-[#64736A] uppercase">5 km Buffer</p>
          <p className="font-extrabold text-sm text-[#17211B] mt-0.5">{spatial.bufferBreakdown['5km'].count} Nodes</p>
          <p className="text-[10px] text-[#15803D] font-bold">40% Weight</p>
        </div>
        <div className="p-3 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-center">
          <p className="text-[10px] font-bold text-[#64736A] uppercase">10 km Buffer</p>
          <p className="font-extrabold text-sm text-[#17211B] mt-0.5">{spatial.bufferBreakdown['10km'].count} Nodes</p>
          <p className="text-[10px] text-[#15803D] font-bold">18% Weight</p>
        </div>
      </div>

      {/* Surrounding Nodes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {features.map((feat) => {
          const Icon = getCategoryIcon(feat.category);
          const decay = feat.distanceKm <= 0.05 ? 1.0 : Math.exp(-0.693 * (feat.distanceKm / 2.5));
          const effectiveScore = Math.round(feat.impactScoreBonus * decay);

          return (
            <div
              key={feat.id}
              className="p-4 rounded-2xl bg-[#F8FBF9] border border-[#D5E1D9] hover:border-[#15803D] transition-all flex flex-col justify-between space-y-3 shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#FFFFFF] text-[#15803D] flex items-center justify-center border border-[#D5E1D9] shadow-xs shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#17211B] text-xs line-clamp-1">{feat.name}</h4>
                    <span className="text-[11px] text-[#64736A] font-semibold">{feat.category} • {feat.bearing}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#D5E1D9] text-xs">
                <div>
                  <span className="text-[#64736A] block text-[9px] uppercase font-bold">DISTANCE</span>
                  <p className="font-bold text-[#17211B] text-xs">{feat.distanceKm} km</p>
                </div>

                <div className="text-center">
                  <span className="text-[#64736A] block text-[9px] uppercase font-bold">DECAY FACTOR</span>
                  <p className="font-bold text-[#17211B] text-xs">{(decay * 100).toFixed(0)}%</p>
                </div>

                <div className="text-right">
                  <span className="text-[#64736A] block text-[9px] uppercase font-bold">EFFECTIVE IMPACT</span>
                  <p className="font-extrabold text-[#15803D] text-xs">+{effectiveScore} Pts</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
