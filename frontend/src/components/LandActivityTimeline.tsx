import React, { useState } from 'react';
import { 
  Clock, 
  Satellite, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  TrendingUp, 
  Layers, 
  Eye, 
  Info, 
  Calendar 
} from 'lucide-react';
import { DataConfidenceBadge } from './DataConfidenceBadge';
import type { HistoricalActivityObservation } from '../types/land';

interface LandActivityTimelineProps {
  timeline?: HistoricalActivityObservation[];
}

export const LandActivityTimeline: React.FC<LandActivityTimelineProps> = ({ timeline = [] }) => {
  const [selectedYear, setSelectedYear] = useState<number>(timeline[timeline.length - 1]?.year || 2026);

  const activeObservation = timeline.find((t) => t.year === selectedYear) || timeline[0];

  if (!timeline || timeline.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#FFFFFF] p-6 rounded-3xl space-y-4 font-sans border border-[#D5E1D9] shadow-sm text-[#17211B]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D5E1D9] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#E8F5EC] text-[#15803D] flex items-center justify-center border border-[#BDE3CC]">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#166534] uppercase font-mono">HISTORICAL SATELLITE ARCHIVE</span>
              <DataConfidenceBadge type="REMOTE_SENSING" label="SENTINEL & BHUVAN" />
            </div>
            <h3 className="font-bold text-base text-[#17211B]">
              Land Activity Timeline (2021 – 2026)
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#64736A] font-bold">SELECT OBSERVATION YEAR:</span>
        </div>
      </div>

      {/* Interactive Year Selector Ribbon */}
      <div className="grid grid-cols-6 gap-2 bg-[#F8FBF9] p-2 rounded-2xl border border-[#D5E1D9] text-xs text-center font-bold">
        {timeline.map((obs) => {
          const isSelected = obs.year === selectedYear;
          return (
            <button
              key={obs.year}
              onClick={() => setSelectedYear(obs.year)}
              className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center justify-center ${
                isSelected
                  ? 'bg-[#15803D] text-white shadow-sm font-bold scale-[1.02]'
                  : 'text-[#17211B] hover:bg-[#E8F5EC]'
              }`}
            >
              <span className="text-sm font-bold">{obs.year}</span>
              <span className={`text-[10px] uppercase ${isSelected ? 'text-white' : 'text-[#64736A]'}`}>
                {obs.openLandPersistence} Fallow
              </span>
            </button>
          );
        })}
      </div>

      {/* Observation Deep-Dive Dossier */}
      {activeObservation && (
        <div className="bg-[#F8FBF9] p-5 rounded-2xl space-y-3.5 text-xs border border-[#D5E1D9]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D5E1D9] pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#15803D]" />
              <span className="font-bold text-[#17211B] text-sm">
                Observation Date: {activeObservation.observationDate}
              </span>
              <span className="text-xs text-[#64736A]">({activeObservation.satelliteSensor})</span>
            </div>
            <DataConfidenceBadge type="VERIFIED" label={`Sensor Confidence ${activeObservation.confidence}%`} />
          </div>

          {/* Vitals Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#D5E1D9]">
              <span className="text-[#64736A] block text-[10px] font-bold uppercase">OPEN LAND PERSISTENCE</span>
              <span className="font-bold text-[#15803D] text-sm">{activeObservation.openLandPersistence}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#D5E1D9]">
              <span className="text-[#64736A] block text-[10px] font-bold uppercase">VEGETATION (NDVI)</span>
              <span className="font-bold text-[#0284C7] text-sm">{activeObservation.vegetationIndexNDVI}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#D5E1D9]">
              <span className="text-[#64736A] block text-[10px] font-bold uppercase">BUILT-UP DETECTED</span>
              <span className="font-bold text-[#17211B] text-sm">{activeObservation.builtUpDetected ? 'Yes' : 'No'}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#D5E1D9]">
              <span className="text-[#64736A] block text-[10px] font-bold uppercase">CONSTRUCTION ACTIVITY</span>
              <span className="font-bold text-[#92400E] text-sm">{activeObservation.constructionIndication}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#D5E1D9] text-[#17211B] text-xs leading-relaxed font-medium">
            <strong>Analyst Note:</strong> {activeObservation.summaryNote}
          </div>

          {/* Remote Sensing Disclaimer */}
          <div className="p-3 rounded-xl bg-[#E8F5EC] border border-[#BDE3CC] text-xs text-[#405048] font-sans flex items-start gap-2 leading-relaxed">
            <Info className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
            <div>
              <p><strong>Satellite observations indicate predominantly open land during the available observation periods.</strong></p>
              <p className="text-xs text-[#64736A]">Remote sensing observations do not establish legal ownership, possession, or continuous physical activity.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
