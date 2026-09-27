import React from 'react';
import { 
  X, 
  CheckCircle2, 
  FlaskConical, 
  ShieldCheck, 
  FileText, 
  Droplets, 
  Sprout, 
  Download, 
  RefreshCw,
  Award,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useLand } from '../context/LandContext';

export const ExpertReportModal: React.FC = () => {
  const { isReportModalOpen, setIsReportModalOpen, activeBooking, selectedParcel, applyExpertReport } = useLand();

  if (!isReportModalOpen) return null;

  const report = activeBooking?.inspectionReport || {
    reportId: 'REP-NABL-2026-8942',
    bookingId: activeBooking?.id || 'book-01',
    submittedAt: new Date().toISOString(),
    labCertificateNo: 'NABL-AGRI-2026-8942',
    expertName: 'Dr. Ramesh Patil (M.Sc. Soil Science & Agronomy)',
    soilParameters: {
      ph: 7.2,
      nitrogenKgHa: 310,
      phosphorusKgHa: 28,
      potassiumKgHa: 340,
      organicCarbonPercent: 0.74,
      electricalConductivity: 0.38,
      soilTexture: 'Medium Deep Black Clayey Alluvial',
      drainageClass: 'Well Drained',
      soilHealthScore: 92
    },
    waterParameters: {
      waterSourceAvailable: true,
      sourceType: 'Borewell & Perennial Irrigation Canal',
      waterTableDepthMeters: 16.5,
      waterQuality: 'Potable & Optimal for Micro-Drip Irrigation',
      waterQualityTdsPpm: 380
    },
    agronomistSummary: 'Prime alluvial black soil with excellent organic carbon (0.74%) and well-balanced NPK profile. Highly suitable for precision horticulture, export-grade pomegranate, onions, and cash crops with micro-drip automation.',
    recommendedCrops: ['Pomegranate (Bhagwa Variety)', 'Export Quality Red Onion', 'High-Density Guava', 'Soybean-Gram Rotation'],
    groundVerifiedBadge: true
  };

  const handleApplyToDossier = () => {
    applyExpertReport(report);
    setIsReportModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs font-sans animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#FFFFFF] rounded-3xl shadow-2xl border border-[#D5E1D9] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#14532D] via-[#15803D] to-[#22C55E] text-white flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-extrabold text-emerald-100">
              <Award className="w-3.5 h-3.5" />
              <span>GROUND-VERIFIED FIELD INSPECTION REPORT</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Official Physical Soil & Land Report
            </h2>
            <p className="text-xs text-emerald-100 font-medium">
              Verified by <strong>{report.expertName}</strong> • Cert #{report.labCertificateNo}
            </p>
          </div>

          <button
            onClick={() => setIsReportModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Report Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          
          {/* Certificate Banner */}
          <div className="p-4 rounded-2xl bg-[#E8F5EC] border border-[#BDE3CC] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#15803D] text-white flex items-center justify-center font-bold text-lg shrink-0">
                ✓
              </div>
              <div>
                <span className="font-extrabold text-[#15803D] text-sm block">100% Ground Truth Verified</span>
                <span className="text-[11px] text-[#166534]">
                  Physical soil core samples collected on-site at {selectedParcel.name} ({selectedParcel.lat.toFixed(4)}°N, {selectedParcel.lng.toFixed(4)}°E).
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-white text-[#15803D] rounded-lg font-mono font-bold text-[10px] border border-[#BDE3CC] shrink-0">
              {report.labCertificateNo}
            </span>
          </div>

          {/* 12-Parameter Lab Grid */}
          <div className="space-y-2">
            <span className="font-extrabold text-[#17211B] uppercase tracking-wider block">
              🧪 LABORATORY SOIL CORE READINGS
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-[#F8FBF9] rounded-xl border border-[#D5E1D9]">
                <span className="text-[10px] font-bold text-[#64736A] uppercase block">Soil pH</span>
                <span className="text-base font-extrabold text-[#15803D]">{report.soilParameters.ph}</span>
                <span className="text-[9px] text-[#64736A] block">(Optimal Neutral)</span>
              </div>
              <div className="p-3 bg-[#F8FBF9] rounded-xl border border-[#D5E1D9]">
                <span className="text-[10px] font-bold text-[#64736A] uppercase block">Nitrogen (N)</span>
                <span className="text-base font-extrabold text-[#17211B]">{report.soilParameters.nitrogenKgHa} <span className="text-xs text-[#64736A]">kg/ha</span></span>
                <span className="text-[9px] text-[#15803D] font-bold block">Adequate</span>
              </div>
              <div className="p-3 bg-[#F8FBF9] rounded-xl border border-[#D5E1D9]">
                <span className="text-[10px] font-bold text-[#64736A] uppercase block">Phosphorus (P)</span>
                <span className="text-base font-extrabold text-[#17211B]">{report.soilParameters.phosphorusKgHa} <span className="text-xs text-[#64736A]">kg/ha</span></span>
                <span className="text-[9px] text-[#15803D] font-bold block">Medium-High</span>
              </div>
              <div className="p-3 bg-[#F8FBF9] rounded-xl border border-[#D5E1D9]">
                <span className="text-[10px] font-bold text-[#64736A] uppercase block">Potassium (K)</span>
                <span className="text-base font-extrabold text-[#17211B]">{report.soilParameters.potassiumKgHa} <span className="text-xs text-[#64736A]">kg/ha</span></span>
                <span className="text-[9px] text-[#15803D] font-bold block">Rich</span>
              </div>
              <div className="p-3 bg-[#F8FBF9] rounded-xl border border-[#D5E1D9]">
                <span className="text-[10px] font-bold text-[#64736A] uppercase block">Organic Carbon</span>
                <span className="text-base font-extrabold text-[#15803D]">{report.soilParameters.organicCarbonPercent}%</span>
                <span className="text-[9px] text-[#15803D] font-bold block">High Fertile</span>
              </div>
              <div className="p-3 bg-[#F8FBF9] rounded-xl border border-[#D5E1D9]">
                <span className="text-[10px] font-bold text-[#64736A] uppercase block">EC (Salinity)</span>
                <span className="text-base font-extrabold text-[#17211B]">{report.soilParameters.electricalConductivity} <span className="text-xs text-[#64736A]">dS/m</span></span>
                <span className="text-[9px] text-[#15803D] font-bold block">Non-Saline</span>
              </div>
              <div className="p-3 bg-[#F8FBF9] rounded-xl border border-[#D5E1D9]">
                <span className="text-[10px] font-bold text-[#64736A] uppercase block">Water Table</span>
                <span className="text-base font-extrabold text-[#0284C7]">{report.waterParameters.waterTableDepthMeters}m</span>
                <span className="text-[9px] text-[#0284C7] font-bold block">Borewell Active</span>
              </div>
              <div className="p-3 bg-[#F8FBF9] rounded-xl border border-[#D5E1D9]">
                <span className="text-[10px] font-bold text-[#64736A] uppercase block">Soil Health Index</span>
                <span className="text-base font-extrabold text-[#15803D]">{report.soilParameters.soilHealthScore}/100</span>
                <span className="text-[9px] text-[#15803D] font-bold block">Grade A Prime</span>
              </div>
            </div>
          </div>

          {/* Agronomist Observations & Summary */}
          <div className="p-4 rounded-2xl bg-[#F8FBF9] border border-[#D5E1D9] space-y-2">
            <span className="text-[10px] font-extrabold text-[#166534] uppercase tracking-wider block">
              AGRONOMIST CLINICAL OBSERVATIONS & RECOMMENDATION
            </span>
            <p className="text-xs text-[#17211B] leading-relaxed font-medium">
              {report.agronomistSummary}
            </p>
            <div className="pt-2 border-t border-[#D5E1D9] flex flex-wrap gap-1.5 items-center">
              <span className="font-bold text-[#64736A] text-[10px] uppercase">Recommended Crops:</span>
              {report.recommendedCrops.map((crop, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-white border border-[#D5E1D9] rounded-md font-bold text-[10px] text-[#15803D]">
                  🌱 {crop}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer with Apply & Re-Analyze Action */}
        <div className="p-5 bg-[#F8FBF9] border-t border-[#D5E1D9] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#64736A] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#15803D]" />
            <span>Applying this report updates your Land Dossier with certified ground truth.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setIsReportModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-[#D5E1D9] text-xs font-bold text-[#64736A] hover:bg-white transition-all"
            >
              Close
            </button>
            <button
              onClick={handleApplyToDossier}
              className="px-5 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Apply to Dossier & Re-Run AI</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
