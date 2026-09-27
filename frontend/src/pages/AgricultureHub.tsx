import React, { useState } from 'react';
import { 
  Sprout, 
  Calendar, 
  Droplets, 
  TrendingUp, 
  DollarSign, 
  Sun, 
  ShieldCheck, 
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useLand } from '../context/LandContext';
import { SourceBadge } from '../components/SourceBadge';
import { ScoreRing } from '../components/ScoreRing';
import { CROP_DATABASE } from '../data/cropCalendarData';

export const AgricultureHub: React.FC = () => {
  const { selectedParcel } = useLand();
  const [selectedSeason, setSelectedSeason] = useState<'all' | 'Kharif' | 'Rabi' | 'Zaid' | 'Perennial'>('all');
  const [selectedCrop, setSelectedCrop] = useState(CROP_DATABASE[0]);

  const filteredCrops = selectedSeason === 'all' 
    ? CROP_DATABASE 
    : CROP_DATABASE.filter((c) => c.season === selectedSeason);

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* 1. HEADER */}
      <div className="bg-[#FFFFFF] p-4 sm:p-7 rounded-3xl border border-[#D5E1D9] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F5EC] border border-[#BDE3CC] flex items-center justify-center text-[#15803D] shrink-0">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold font-mono text-[#166534] uppercase tracking-wider">
                PRECISION AGRONOMY MATRIX
              </span>
              <SourceBadge type="official" label="ICAR / MAHARASHTRA AGRI BOARD" />
            </div>
            <h1 className="font-bold text-xl sm:text-2xl text-[#17211B] tracking-tight">
              Agri-Horticulture & Seasonal Crop Calendar
            </h1>
            <p className="text-xs sm:text-sm text-[#405048] font-medium">
              High-yield crop recommendations calibrated for {selectedParcel.soil.soilType} soil (pH {selectedParcel.soil.pH})
            </p>
          </div>
        </div>

        {/* Season Filter Pills */}
        <div className="flex items-center gap-2 font-mono text-xs overflow-x-auto max-w-full pb-1">
          {(['all', 'Kharif', 'Rabi', 'Zaid', 'Perennial'] as const).map((season) => (
            <button
              key={season}
              onClick={() => setSelectedSeason(season)}
              className={`px-3.5 py-2 rounded-xl font-bold uppercase transition-all whitespace-nowrap shrink-0 ${
                selectedSeason === season
                  ? 'bg-[#15803D] text-white shadow-sm'
                  : 'bg-[#F8FBF9] text-[#17211B] hover:bg-[#E8F5EC] border border-[#D5E1D9]'
              }`}
            >
              {season}
            </button>
          ))}
        </div>
      </div>

      {/* 2. CROP MATRIX & DETAIL VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CROPS LIST (6 COLS) */}
        <div className="lg:col-span-6 space-y-3">
          {filteredCrops.map((crop) => {
            const isSelected = selectedCrop.id === crop.id;
            return (
              <button
                key={crop.id}
                onClick={() => setSelectedCrop(crop)}
                className={`w-full text-left p-4 sm:p-5 rounded-3xl border transition-all flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-[#E8F5EC] border-[#15803D] shadow-sm'
                    : 'bg-[#FFFFFF] hover:bg-[#F8FBF9] border-[#D5E1D9] shadow-sm'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#17211B] text-sm sm:text-base">{crop.name}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold font-mono bg-[#FFFFFF] text-[#166534] border border-[#BDE3CC]">
                      {crop.season}
                    </span>
                  </div>
                  <p className="text-xs text-[#405048] font-medium">
                    Yield: <strong>{crop.expectedYieldQuintalsPerAcre} Q/Acre</strong> • Duration: <strong>{crop.durationDays} Days</strong>
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-bold text-[#15803D]">
                    ₹{(crop.estimatedRevenuePerAcreRupees / 100000).toFixed(2)}L
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-[#64736A] block font-medium">/ Acre / Cycle</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* SELECTED CROP DEEP-DIVE DOSSIER (6 COLS) */}
        <div className="lg:col-span-6">
          <div className="bg-[#FFFFFF] p-4 sm:p-7 rounded-3xl space-y-5 shadow-sm border-l-4 border-l-[#15803D] border border-[#D5E1D9]">
            <div className="flex items-center justify-between border-b border-[#D5E1D9] pb-4">
              <div>
                <span className="text-xs font-bold text-[#166534] uppercase font-mono block">ACTIVE CROP DOSSIER</span>
                <h2 className="font-bold text-xl sm:text-2xl text-[#17211B]">
                  {selectedCrop.name}
                </h2>
                <p className="text-xs text-[#405048] font-semibold mt-0.5">{selectedCrop.hindiName}</p>
              </div>

              <ScoreRing score={85} size={70} strokeWidth={6} color="#15803D" />
            </div>

            {/* Economic Vitals */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5 text-xs font-mono">
              <div className="bg-[#F8FBF9] p-3 rounded-2xl border border-[#D5E1D9]">
                <span className="text-[10px] text-[#64736A] font-bold block uppercase">EST. REVENUE / AC</span>
                <p className="font-bold text-[#15803D] text-sm">₹{(selectedCrop.estimatedRevenuePerAcreRupees / 100000).toFixed(2)} Lakhs</p>
              </div>
              <div className="bg-[#F8FBF9] p-3 rounded-2xl border border-[#D5E1D9]">
                <span className="text-[10px] text-[#64736A] font-bold block uppercase">WATER NEED</span>
                <p className="font-bold text-[#0284C7] text-sm">{selectedCrop.waterRequirementMm} mm</p>
              </div>
              <div className="bg-[#F8FBF9] p-3 rounded-2xl border border-[#D5E1D9]">
                <span className="text-[10px] text-[#64736A] font-bold block uppercase">MATURATION</span>
                <p className="font-bold text-[#17211B] text-sm">{selectedCrop.durationDays} Days</p>
              </div>
            </div>

            {/* Agronomist Notes */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-[#17211B] uppercase block">AGRONOMIST FIELD ADVISORY</span>
              <div className="p-4 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9] text-[#17211B] space-y-2 text-xs font-medium leading-relaxed">
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                  <span><strong>Advisory:</strong> {selectedCrop.advisoryTip}</span>
                </p>
                <p className="flex items-start gap-2">
                  <Droplets className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                  <span><strong>Micro-Irrigation:</strong> Pair with drip lines under PMKSY (55% subsidy) to mitigate summer groundwater stress.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
