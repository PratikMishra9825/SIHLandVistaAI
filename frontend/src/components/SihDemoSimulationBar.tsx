import React from 'react';
import { 
  Sparkles, 
  Car, 
  FileText, 
  RefreshCw, 
  CheckCircle2, 
  Calendar,
  Award
} from 'lucide-react';
import { useLand } from '../context/LandContext';
import { useNavigate } from 'react-router-dom';

export const SihDemoSimulationBar: React.FC = () => {
  const { 
    isPremium, 
    upgradeToPremium, 
    activeBooking, 
    bookExpert, 
    updateBookingStatus, 
    applyExpertReport,
    setIsReportModalOpen,
    selectedParcel
  } = useLand();
  const navigate = useNavigate();

  const handleQuickUpgrade = async () => {
    await upgradeToPremium('SIH Demo 1-Click Verification');
  };

  const handleQuickBook = async () => {
    if (!isPremium) await upgradeToPremium('SIH Demo 1-Click Verification');
    await bookExpert({
      serviceType: 'Comprehensive Soil Lab & Land Inspection',
      scheduledDate: 'Tomorrow, 10:30 AM',
      userNotes: 'Physical soil core testing and crop feasibility advisory.'
    });
    navigate('/experts');
  };

  const handleSimulateDispatch = () => {
    updateBookingStatus('ON_THE_WAY');
  };

  const handleSimulateComplete = () => {
    updateBookingStatus('VISIT_COMPLETED');
  };

  const handleSimulateReportAndReAnalyze = () => {
    const mockReport = {
      reportId: 'REP-NABL-' + Date.now(),
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

    applyExpertReport(mockReport);
    setIsReportModalOpen(true);
  };

  return (
    <div className="bg-[#17211B] text-white p-3.5 sm:p-4 rounded-2xl border border-emerald-500/40 shadow-lg flex flex-col lg:flex-row items-center justify-between gap-3 text-xs font-sans">
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-[#15803D] text-white flex items-center justify-center font-bold">
          ⚡
        </div>
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 block">
            SIH PRESENTATION LIVE DEMO CONTROLLER
          </span>
          <span className="font-extrabold text-white text-xs">
            Test Premium & Expert Checkup Flow
          </span>
        </div>
      </div>

      {/* 5-Step Presentation Stepper Actions */}
      <div className="flex flex-wrap items-center gap-2 justify-center lg:justify-end">
        
        {/* Step 1: Upgrade */}
        <button
          onClick={handleQuickUpgrade}
          className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] flex items-center gap-1 transition-all ${
            isPremium
              ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-600/40'
              : 'bg-[#15803D] hover:bg-[#166534] text-white shadow-xs'
          }`}
        >
          {isPremium ? '✓ 1. Premium Active' : '1. Unlock Premium'}
        </button>

        {/* Step 2: Book */}
        <button
          onClick={handleQuickBook}
          className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] flex items-center gap-1 transition-all ${
            activeBooking
              ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-600/40'
              : 'bg-white hover:bg-gray-100 text-[#17211B]'
          }`}
        >
          {activeBooking ? '✓ 2. Booked' : '2. Book Expert'}
        </button>

        {/* Step 3: Dispatch */}
        <button
          onClick={handleSimulateDispatch}
          className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] flex items-center gap-1 transition-all ${
            activeBooking?.status === 'ON_THE_WAY'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
          }`}
        >
          <span>3. Dispatch Expert</span>
        </button>

        {/* Step 4: Submit Report & Re-Analyze */}
        <button
          onClick={handleSimulateReportAndReAnalyze}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-extrabold text-[11px] flex items-center gap-1.5 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>4. Submit Report & Re-Run AI</span>
        </button>

      </div>
    </div>
  );
};
