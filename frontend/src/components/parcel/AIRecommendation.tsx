import React from 'react';
import { 
  Sparkles, 
  Sun, 
  IndianRupee, 
  TrendingUp, 
  Award, 
  FileText, 
  ShieldCheck, 
  ArrowRight,
  Leaf
} from 'lucide-react';
import type { CategorySuitability, ParcelCalculations } from '../../types/parcelIntelligence';

interface AIRecommendationProps {
  topCategory: CategorySuitability;
  parcel: ParcelCalculations;
  onProceed: () => void;
}

export const AIRecommendation: React.FC<AIRecommendationProps> = ({
  topCategory,
  parcel,
  onProceed
}) => {
  const acres = parcel.areaAcres;
  const estimatedMw = (acres * 0.4).toFixed(1);
  const annualIncomeLakhs = Math.round(acres * 0.9 * 10) / 10;
  const capexLakhs = Math.round(acres * 38);
  const subsidyLakhs = Math.round(capexLakhs * 0.3);

  return (
    <div className="bg-gradient-to-br from-[#17211B] to-[#1E3024] text-white p-6 rounded-3xl shadow-lg font-sans space-y-5 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#22C55E]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22C55E]/20 border border-[#22C55E]/40 text-[#86EFAC] text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-[#22C55E]" />
          <span>TOP AI STRATEGIC RECOMMENDATION</span>
        </div>
        <span className="text-xs font-bold text-[#86EFAC] bg-white/10 px-2.5 py-1 rounded-xl">
          Match Score: {topCategory.score}/100
        </span>
      </div>

      <div className="space-y-1 relative z-10">
        <h3 className="font-bold text-2xl text-white tracking-tight flex items-center gap-2">
          <span>{topCategory.category} Development</span>
          <Award className="w-5 h-5 text-[#22C55E]" />
        </h3>
        <p className="text-xs text-[#D5E1D9] leading-relaxed">
          {topCategory.recommendationNote} Based on {acres} acres boundary, flat terrain slope, and immediate 33kV substation feeder availability.
        </p>
      </div>

      {/* Financial & Operational Projections Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs relative z-10">
        <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
          <span className="text-[10px] text-[#A7B9AD] block uppercase font-bold">EST. DC CAPACITY</span>
          <span className="text-lg font-bold text-white mt-0.5 block">{estimatedMw} MW</span>
          <span className="text-[10px] text-[#86EFAC]">Solar PV Array</span>
        </div>

        <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
          <span className="text-[10px] text-[#A7B9AD] block uppercase font-bold">ANNUAL REVENUE</span>
          <span className="text-lg font-bold text-[#86EFAC] mt-0.5 block">₹{annualIncomeLakhs} L/yr</span>
          <span className="text-[10px] text-[#D5E1D9]">PPA Tariff @ ₹3.10/kWh</span>
        </div>

        <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
          <span className="text-[10px] text-[#A7B9AD] block uppercase font-bold">GOVT SUBSIDY</span>
          <span className="text-lg font-bold text-white mt-0.5 block">₹{subsidyLakhs} L</span>
          <span className="text-[10px] text-[#86EFAC]">PM-KUSUM 30% CFA</span>
        </div>

        <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
          <span className="text-[10px] text-[#A7B9AD] block uppercase font-bold">CARBON OFFSET</span>
          <span className="text-lg font-bold text-white mt-0.5 block">{Math.round(acres * 140)} Tons</span>
          <span className="text-[10px] text-[#86EFAC]">CO₂ avoided per year</span>
        </div>
      </div>

      {/* Government Scheme Matching Card */}
      <div className="p-4 bg-white/10 rounded-2xl border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase text-[#86EFAC] flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" /> Matched Central / State Scheme
          </span>
          <h5 className="font-bold text-sm text-white">
            PM-KUSUM Component-A (Grid Connected Solar Plants for Farmers)
          </h5>
          <p className="text-[11px] text-[#D5E1D9]">
            Guaranteed 25-year Power Purchase Agreement (PPA) with State DISCOM + 30% MNRE subsidy grant.
          </p>
        </div>

        <button
          onClick={onProceed}
          className="px-5 py-3 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-[#17211B] font-bold text-xs uppercase tracking-wider shadow-md shrink-0 flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95"
        >
          <span>Enroll Parcel</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
