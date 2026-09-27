import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  HelpCircle, 
  X, 
  Sparkles, 
  MapPin, 
  Layers, 
  Sun, 
  Box, 
  Landmark, 
  Sliders, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  Play, 
  Globe2, 
  ChevronRight, 
  Sprout, 
  Users 
} from 'lucide-react';
import { useLand } from '../context/LandContext';

export const HowToUseModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { startSihDemo } = useLand();

  if (!isOpen) return null;

  const getPageHelp = () => {
    switch (location.pathname) {
      case '/dashboard':
        return {
          title: 'GIS Command Map & AI Verdict',
          whereAmI: 'You are on the Main Geospatial Command Center viewing the selected parcel.',
          whatToDo: '1. Click on the map to inspect satellite layers.\n2. Review the #1 AI Verdict on the right.\n3. Click "Explore 3D Digital Twin" or adjust Priority Sliders.',
          whatHappensNext: 'The 3D model and economic projections will adapt to your choices.',
          ctaLabel: 'Try 3D Digital Twin',
          ctaAction: onClose
        };
      case '/onboarding':
        return {
          title: 'Register Land & Upload Soil Card',
          whereAmI: 'You are in the 3-step Land Onboarding wizard.',
          whatToDo: '1. Enter parcel location (District, Survey #, Acreage).\n2. Drag-and-drop your Soil Health Card (PDF/Image) to auto-extract pH & NPK values.\n3. Click "Generate AI Recommendations".',
          whatHappensNext: 'LandVista saves the land directly to MongoDB Atlas and runs instant diagnostics.',
          ctaLabel: 'Got It',
          ctaAction: onClose
        };
      case '/schemes':
        return {
          title: 'Government Scheme Matcher',
          whereAmI: 'You are viewing Central & State subsidies matched for your land.',
          whatToDo: '1. Browse matched schemes like PM-KUSUM (30% CFA) or AIF (3% subvention).\n2. Check the eligibility checklist.\n3. Click "Open Official Ministry Portal" to apply.',
          whatHappensNext: 'You can combine government grants with bank financing to cut upfront CAPEX.',
          ctaLabel: 'View PM-KUSUM',
          ctaAction: onClose
        };
      case '/agriculture':
        return {
          title: 'Agriculture Hub & Crop Calendar',
          whereAmI: 'You are in the precision agronomy and seasonal crop rotation workspace.',
          whatToDo: '1. Filter by season (Kharif, Rabi, Zaid).\n2. Compare expected yield (Q/Acre) and revenue for Red Onion or Pomegranate.\n3. Review agronomist drip irrigation tips.',
          whatHappensNext: 'Use the crop rotation schedule to preserve soil nutrients year-round.',
          ctaLabel: 'Got It',
          ctaAction: onClose
        };
      case '/soil-water':
        return {
          title: 'Soil & Water Intelligence Lab',
          whereAmI: 'You are inspecting geochemical nutrient radars and aquifer stress charts.',
          whatToDo: '1. Review N-P-K balances.\n2. Upload lab test PDFs for instant OCR analysis.\n3. Check seasonal rainfall vs. summer water stress.',
          whatHappensNext: 'Your soil data directly updates crop suitability and solar mounting safety.',
          ctaLabel: 'Got It',
          ctaAction: onClose
        };
      case '/future-potential':
        return {
          title: '10-Year Infrastructure Forecaster',
          whereAmI: 'You are exploring future development corridors around your land.',
          whatToDo: '1. Inspect the 2026–2036 trajectory timeline.\n2. See upcoming projects like the Surat-Chennai Expressway (4.2 km).\n3. Compare official planned projects vs. AI growth simulations.',
          whatHappensNext: 'Understand when your land value and logistics utility will peak.',
          ctaLabel: 'Got It',
          ctaAction: onClose
        };
      case '/experts':
        return {
          title: 'Certified Agronomist Network',
          whereAmI: 'You are browsing nearby ICAR and KVK empaneled soil scientists.',
          whatToDo: '1. Review scientist qualifications and review ratings.\n2. Click "Book Visit" to schedule an on-site physical soil core drilling survey.\n3. Receive certified geotechnical endorsement.',
          whatHappensNext: 'A verified expert visits your land to perform GPS-tagged sampling.',
          ctaLabel: 'Got It',
          ctaAction: onClose
        };
      case '/government':
        return {
          title: 'Government Land Portfolio Matrix',
          whereAmI: 'You are in the Public Land Bank Prioritisation command center.',
          whatToDo: '1. Search across 1,248 monitored state land parcels.\n2. Sort by Highest Potential Index or Social Utility.\n3. Click "Inspect in 3D" to evaluate any parcel.',
          whatHappensNext: 'Accelerates public welfare project allocation and solar park auctions.',
          ctaLabel: 'Got It',
          ctaAction: onClose
        };
      default:
        return {
          title: 'LandVista AI Overview',
          whereAmI: 'You are on the LandVista AI landing page.',
          whatToDo: '1. Click "Open GIS Command Map" to explore the Solapur Hero parcel.\n2. Or click "Run SIH Demo" for an automated presentation.\n3. Or click "Register Land" to analyze your own property.',
          whatHappensNext: 'The system runs deterministic AI diagnostics across all dimensions.',
          ctaLabel: 'Launch Dashboard',
          ctaAction: () => {
            onClose();
            navigate('/dashboard');
          }
        };
    }
  };

  const help = getPageHelp();

  return (
    <div className="fixed inset-0 z-50 bg-[#17211B]/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 font-sans animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#FFFFFF] p-4 sm:p-7 rounded-3xl border border-[#D5E1D9] shadow-2xl space-y-4 sm:space-y-5 text-[#17211B]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#D5E1D9] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#E8F5EC] text-[#15803D] flex items-center justify-center border border-[#BDE3CC]">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#17211B]">
                How to Use LandVista AI
              </h3>
              <p className="text-xs text-[#405048] font-medium">
                Interactive Operator Guide & Contextual Assistance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/guide"
              onClick={onClose}
              className="text-xs font-bold text-[#15803D] hover:underline"
            >
              Open Full Guide
            </Link>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#E8F5EC] text-[#64736A] hover:text-[#17211B] transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 8-Step Interactive Progress Tracker */}
        <div className="space-y-1.5 text-xs">
          <span className="text-[10px] text-[#64736A] font-bold block uppercase">8-STEP LAND DECISION PROGRESSION</span>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1 text-center font-bold">
            {[
              { num: '①', label: 'Location' },
              { num: '②', label: 'Boundary' },
              { num: '③', label: 'Soil OCR' },
              { num: '④', label: 'AI Scan' },
              { num: '⑤', label: 'Verdict' },
              { num: '⑥', label: '3D Twin' },
              { num: '⑦', label: 'Schemes' },
              { num: '⑧', label: 'Plan' },
            ].map((step, idx) => (
              <div
                key={idx}
                className="p-1.5 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B] hover:border-[#15803D] transition-all"
              >
                <span className="text-[#15803D] block">{step.num}</span>
                <span className="text-[9px] truncate">{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contextual Q&A Cards */}
        <div className="space-y-3 font-sans text-xs">
          <div className="p-3.5 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9] space-y-1">
            <span className="text-[10px] font-bold text-[#166534] block uppercase">📍 WHERE AM I?</span>
            <p className="text-[#17211B] font-bold text-sm">{help.whereAmI}</p>
          </div>

          <div className="p-3.5 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9] space-y-1">
            <span className="text-[10px] font-bold text-[#92400E] block uppercase">👉 WHAT SHOULD I DO?</span>
            <p className="text-[#17211B] whitespace-pre-line leading-relaxed font-medium">{help.whatToDo}</p>
          </div>

          <div className="p-3.5 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9] space-y-1">
            <span className="text-[10px] font-bold text-[#0284C7] block uppercase">🔮 WHAT HAPPENS NEXT?</span>
            <p className="text-[#17211B] leading-relaxed font-medium">{help.whatHappensNext}</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2 border-t border-[#D5E1D9]">
          <button
            onClick={() => {
              onClose();
              startSihDemo();
            }}
            className="text-xs font-bold text-[#15803D] hover:underline flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch 3-Min SIH Presentation</span>
          </button>

          <button
            onClick={help.ctaAction}
            className="px-5 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs uppercase transition-all shadow-sm"
          >
            {help.ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
