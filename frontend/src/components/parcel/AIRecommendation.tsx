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
  const cat = (topCategory.category || 'Agriculture').toLowerCase();
  const isAgri = cat.includes('agri') || cat.includes('farm');
  const isSolar = cat.includes('solar') || cat.includes('renew');
  const isInd = cat.includes('indus') || cat.includes('manuf');
  const isHealth = cat.includes('health') || cat.includes('medic') || cat.includes('public');
  const isWare = cat.includes('ware') || cat.includes('logis');

  const getMetric1 = () => {
    if (isAgri) return { label: 'EST. CROP YIELD', val: `${Math.round(acres * 4.2)} Tons/yr`, sub: 'Precision Harvest' };
    if (isSolar) return { label: 'EST. DC CAPACITY', val: `${(acres * 0.4).toFixed(1)} MW`, sub: 'Solar PV Array' };
    if (isInd) return { label: 'BUILT-UP FOOTPRINT', val: `${Math.round(acres * 15000)} sq.ft`, sub: 'PEB Production Shed' };
    if (isHealth) return { label: 'HEALTHCARE CAPACITY', val: `${Math.round(acres * 25)} Beds`, sub: 'OPD & In-Patient' };
    return { label: 'COVERED STORAGE', val: `${Math.round(acres * 18000)} sq.ft`, sub: 'Logistics Facility' };
  };

  const getRevenue = () => {
    if (isAgri) return `₹${(acres * 3.8).toFixed(1)} L/yr`;
    if (isSolar) return `₹${(acres * 7.6).toFixed(1)} L/yr`;
    if (isInd) return `₹${(45 + acres * 12).toFixed(1)} L/yr`;
    if (isHealth) return `₹${(60 + acres * 15).toFixed(1)} L/yr`;
    return `₹${(acres * 14.5).toFixed(1)} L/yr`;
  };

  const getSubsidy = () => {
    if (isAgri) return { val: `₹${(acres * 2.5).toFixed(1)} L`, sub: 'PMKSY 55% Subsidy' };
    if (isSolar) return { val: `₹${(acres * 10.5).toFixed(1)} L`, sub: 'PM-KUSUM 30% CFA' };
    if (isInd) return { val: '₹50 L', sub: 'PMEGP / MSME Grant' };
    if (isHealth) return { val: '₹80 L', sub: 'Ayushman Infra Support' };
    return { val: '₹2.00 Cr Loan', sub: 'AIF 3% Interest Relief' };
  };

  const getScheme = () => {
    if (isAgri) return { title: 'PMKSY — Per Drop More Crop & National Horticulture Mission', desc: 'Up to 55% capital subsidy on micro-drip irrigation and fruit/crop cultivation assistance.' };
    if (isSolar) return { title: 'PM-KUSUM Component-A (Grid Connected Solar for Farmers)', desc: 'Guaranteed 25-year Power Purchase Agreement (PPA) with State DISCOM + 30% capital grant.' };
    if (isInd) return { title: 'PMEGP & Credit Linked Capital Subsidy Scheme (CLCSS)', desc: 'Up to 35% margin money subsidy and 15% upfront capital subsidy for technology upgrade.' };
    if (isHealth) return { title: 'PM Ayushman Bharat Health Infrastructure Mission', desc: 'Credit guarantee and capital grant support for regional diagnostic and healthcare hubs.' };
    return { title: 'Agriculture Infrastructure Fund (AIF) & MoFPI Cold Chain Scheme', desc: '3% annual interest subvention on bank credit up to ₹2.00 Cr for logistics and cold storage.' };
  };

  const m1 = getMetric1();
  const sub = getSubsidy();
  const sch = getScheme();

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
          {topCategory.recommendationNote || `Calibrated for ${acres} acres based on surrounding activity, road access, and environmental parameters.`}
        </p>
      </div>

      {/* Financial & Operational Projections Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs relative z-10">
        <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
          <span className="text-[10px] text-[#A7B9AD] block uppercase font-bold">{m1.label}</span>
          <span className="text-lg font-bold text-white mt-0.5 block">{m1.val}</span>
          <span className="text-[10px] text-[#86EFAC]">{m1.sub}</span>
        </div>

        <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
          <span className="text-[10px] text-[#A7B9AD] block uppercase font-bold">ANNUAL REVENUE</span>
          <span className="text-lg font-bold text-[#86EFAC] mt-0.5 block">{getRevenue()}</span>
          <span className="text-[10px] text-[#D5E1D9]">Estimated Annual Income</span>
        </div>

        <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
          <span className="text-[10px] text-[#A7B9AD] block uppercase font-bold">FINANCIAL SUPPORT</span>
          <span className="text-lg font-bold text-white mt-0.5 block">{sub.val}</span>
          <span className="text-[10px] text-[#86EFAC]">{sub.sub}</span>
        </div>

        <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
          <span className="text-[10px] text-[#A7B9AD] block uppercase font-bold">EMPLOYMENT IMPACT</span>
          <span className="text-lg font-bold text-white mt-0.5 block">{Math.max(5, Math.round(acres * 3.5))} People</span>
          <span className="text-[10px] text-[#86EFAC]">Direct & Indirect Jobs</span>
        </div>
      </div>

      {/* Government Scheme Matching Card */}
      <div className="p-4 bg-white/10 rounded-2xl border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase text-[#86EFAC] flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" /> Matched Central / State Scheme
          </span>
          <h5 className="font-bold text-sm text-white">
            {sch.title}
          </h5>
          <p className="text-[11px] text-[#D5E1D9]">
            {sch.desc}
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
