import React from 'react';
import { 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Sparkles, 
  ShieldCheck 
} from 'lucide-react';
import { DataConfidenceBadge } from './DataConfidenceBadge';
import type { LandOccupancyAssessment } from '../types/land';

interface OccupancyAssessmentProps {
  occupancy?: LandOccupancyAssessment;
}

export const OccupancyAssessment: React.FC<OccupancyAssessmentProps> = ({ occupancy }) => {
  if (!occupancy) return null;

  return (
    <div className="bg-[#FFFFFF] p-5 sm:p-6 rounded-3xl border border-[#D5E1D9] shadow-sm space-y-4 font-sans text-[#17211B]">
      <div className="flex items-center justify-between border-b border-[#D5E1D9] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#E8F5EC] text-[#15803D] flex items-center justify-center border border-[#BDE3CC]">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#166534] uppercase font-mono">CURRENT LAND-USE SCAN</span>
              <DataConfidenceBadge type="REMOTE_SENSING" label="SATELLITE & BHUVAN" />
            </div>
            <h3 className="font-bold text-sm text-[#17211B]">
              Current Occupancy & Surface Assessment
            </h3>
          </div>
        </div>

        <DataConfidenceBadge type="AI_ESTIMATE" label={`Confidence ${occupancy.confidencePercentage}%`} />
      </div>

      {/* Breakdown Bars */}
      <div className="space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-[#17211B] font-bold flex items-center gap-1.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#15803D]" />
            PREDOMINANTLY OPEN FALLOW GROUND
          </span>
          <span className="font-bold text-[#15803D] text-sm">~{occupancy.openAreaPercentage}%</span>
        </div>

        {/* Multi-segment progress bar */}
        <div className="h-3.5 w-full rounded-full bg-[#F8FBF9] overflow-hidden flex border border-[#D5E1D9]">
          <div style={{ width: `${occupancy.openAreaPercentage}%` }} className="bg-[#15803D]" title="Open Area" />
          <div style={{ width: `${occupancy.vegetationPercentage}%` }} className="bg-[#86EFAC]" title="Vegetation" />
          <div style={{ width: `${occupancy.builtUpPercentage}%` }} className="bg-[#FDE68A]" title="Built-up" />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-3 gap-2.5 text-xs pt-1">
          <div className="p-2.5 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9]">
            <span className="text-[#64736A] block text-[10px] uppercase font-bold">OPEN ENVELOPE</span>
            <span className="font-bold text-[#15803D] text-xs">~{occupancy.openAreaPercentage}%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9]">
            <span className="text-[#64736A] block text-[10px] uppercase font-bold">VEGETATION</span>
            <span className="font-bold text-[#166534] text-xs">~{occupancy.vegetationPercentage}%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9]">
            <span className="text-[#64736A] block text-[10px] uppercase font-bold">BUILT-UP / TRACKS</span>
            <span className="font-bold text-[#92400E] text-xs">~{occupancy.builtUpPercentage}%</span>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-3 rounded-2xl bg-[#E8F5EC] border border-[#BDE3CC] text-xs text-[#405048] font-sans flex items-start gap-2 leading-relaxed font-medium">
          <Info className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
          <span>{occupancy.disclaimer}</span>
        </div>
      </div>
    </div>
  );
};
