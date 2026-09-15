import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Check, Zap, Sparkles, ArrowRight, Lock, 
  HelpCircle, AlertCircle, Award, CheckCircle2, ChevronRight,
  Droplets, FileCheck, Layers, MapPin, Compass
} from 'lucide-react';
import { useLand } from '../context/LandContext';
import { PremiumUpgradeModal } from '../components/PremiumUpgradeModal';

export const Pricing: React.FC = () => {
  const { isPremium, setIsUpgradeModalOpen } = useLand();
  const navigate = useNavigate();
  const [selectedPlanPeriod, setSelectedPlanPeriod] = useState<'yearly' | 'monthly'>('yearly');

  return (
    <div className="min-h-screen bg-[#F8FBF9] text-[#17211B] font-sans pb-20">
      
      {/* -----------------------------------------------------------
          🌟 HERO HEADER
      ----------------------------------------------------------- */}
      <section className="bg-gradient-to-b from-[#EAF7EF] to-[#F8FBF9] border-b border-[#D5E1D9] pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F5EC] border border-[#BDE3CC] text-[#15803D] text-xs font-extrabold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TRANSPARENT SUBSCRIPTION TIERS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#17211B] tracking-tight">
            Get your land professionally inspected.
          </h1>

          <p className="text-sm sm:text-base text-[#526358] max-w-2xl mx-auto leading-relaxed">
            Upgrade to LandVista Premium to dispatch certified agronomists and soil experts directly to your land parcel for lab-grade ground truth.
          </p>

          {/* Toggle Monthly / Yearly */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <div className="bg-[#FFFFFF] p-1 rounded-2xl border border-[#D5E1D9] shadow-2xs inline-flex items-center text-xs font-bold">
              <button
                onClick={() => setSelectedPlanPeriod('yearly')}
                className={`px-4 py-2 rounded-xl transition-all ${
                  selectedPlanPeriod === 'yearly'
                    ? 'bg-[#15803D] text-white shadow-xs'
                    : 'text-[#64736A] hover:text-[#17211B]'
                }`}
              >
                Annual Pass <span className="text-[10px] ml-1 px-1.5 py-0.5 rounded-full bg-[#E8F5EC] text-[#15803D] font-extrabold">Save 35%</span>
              </button>
              <button
                onClick={() => setSelectedPlanPeriod('monthly')}
                className={`px-4 py-2 rounded-xl transition-all ${
                  selectedPlanPeriod === 'monthly'
                    ? 'bg-[#15803D] text-white shadow-xs'
                    : 'text-[#64736A] hover:text-[#17211B]'
                }`}
              >
                Quarterly Access
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* -----------------------------------------------------------
          💳 PLAN CARDS (FREE VS PREMIUM)
      ----------------------------------------------------------- */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* FREE PLAN */}
          <div className="bg-[#FFFFFF] rounded-3xl border border-[#D5E1D9] p-7 sm:p-8 flex flex-col justify-between shadow-sm relative space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-extrabold text-[#64736A] uppercase tracking-wider block">BASIC EXPLORER</span>
                  <h3 className="text-2xl font-extrabold text-[#17211B] mt-0.5">Free Plan</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#F1F5F9] text-[#475569] text-xs font-bold border border-[#CBD5E1]">
                  Default
                </span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-[#17211B]">₹0</span>
                <span className="text-xs font-medium text-[#64736A]">/ forever</span>
              </div>

              <p className="text-xs text-[#526358] leading-relaxed">
                Ideal for initial satellite parcel scouting, geospatial boundary drawing, and viewing public government schemes.
              </p>

              <div className="pt-4 border-t border-[#D5E1D9] space-y-3 text-xs">
                <div className="flex items-center gap-2.5 text-[#17211B]">
                  <Check className="w-4 h-4 text-[#15803D] shrink-0" />
                  <span>Bhuvan & Sentinel Satellite GIS Mapping</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#17211B]">
                  <Check className="w-4 h-4 text-[#15803D] shrink-0" />
                  <span>AI Land Suitability Recommendations</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#17211B]">
                  <Check className="w-4 h-4 text-[#15803D] shrink-0" />
                  <span>Interactive Boundary Polygon Tool</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#17211B]">
                  <Check className="w-4 h-4 text-[#15803D] shrink-0" />
                  <span>Government Subsidies & Schemes Directory</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#94A3B8]">
                  <Lock className="w-4 h-4 text-[#CBD5E1] shrink-0" />
                  <span className="line-through">Physical On-Ground Expert Inspection</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#94A3B8]">
                  <Lock className="w-4 h-4 text-[#CBD5E1] shrink-0" />
                  <span className="line-through">NABL Lab Soil Testing & Groundwater Log</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#94A3B8]">
                  <Lock className="w-4 h-4 text-[#CBD5E1] shrink-0" />
                  <span className="line-through">Ground-Verified Dossier Certification</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-3.5 rounded-2xl bg-[#F8FBF9] hover:bg-[#EFF6F0] text-[#17211B] text-xs font-extrabold border border-[#D5E1D9] transition-all"
            >
              Current Active Plan
            </button>
          </div>

          {/* PREMIUM PLAN */}
          <div className="bg-[#FFFFFF] rounded-3xl border-2 border-[#15803D] p-7 sm:p-8 flex flex-col justify-between shadow-lg relative space-y-6 overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#15803D] text-white text-[10px] font-extrabold uppercase px-4 py-1 rounded-bl-2xl tracking-wider shadow-xs">
              MOST POPULAR
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-extrabold text-[#15803D] uppercase tracking-wider block">PROFESSIONAL VERIFICATION</span>
                  <h3 className="text-2xl font-extrabold text-[#17211B] mt-0.5">Premium Plan</h3>
                </div>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold text-[#15803D]">
                  ₹{selectedPlanPeriod === 'yearly' ? '3,999' : '1,499'}
                </span>
                <span className="text-xs font-medium text-[#64736A]">
                  {selectedPlanPeriod === 'yearly' ? '/ year (All-Inclusive)' : '/ quarter'}
                </span>
              </div>

              <p className="text-xs text-[#526358] leading-relaxed">
                Complete ground validation package for landowners, commercial investors, and high-yield farmers seeking verified ground truth.
              </p>

              {/* Benefits Checklist */}
              <div className="pt-4 border-t border-[#D5E1D9] space-y-3 text-xs">
                <div className="flex items-center gap-2.5 text-[#17211B] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                  <span>✓ Expert land & boundary inspection</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#17211B] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                  <span>✓ Soil testing assistance (N-P-K, pH, Organic Carbon)</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#17211B] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                  <span>✓ Professional land-use & agronomy guidance</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#17211B] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                  <span>✓ Verified inspection report with official certificate</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#17211B] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                  <span>✓ Dynamic recommendation re-analysis with lab data</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#17211B] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                  <span>✓ Real-time 6-stage booking tracking via Socket.IO</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#17211B] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                  <span>✓ “🌱 Ground-Verified” Trust Badge on Land Dossier</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              {isPremium ? (
                <div className="space-y-2">
                  <div className="p-3 bg-[#E8F5EC] rounded-2xl border border-[#BDE3CC] text-center text-xs font-extrabold text-[#15803D]">
                    ✓ You have an Active Premium Subscription
                  </div>
                  <button
                    onClick={() => navigate('/expert-checkup')}
                    className="w-full py-3.5 rounded-2xl bg-[#15803D] hover:bg-[#166534] text-white text-xs font-extrabold transition-all shadow-md flex items-center justify-center gap-2 hover:scale-[1.01]"
                  >
                    <span>Book Expert Checkup Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsUpgradeModalOpen(true)}
                  className="w-full py-4 rounded-2xl bg-[#15803D] hover:bg-[#166534] text-white text-sm font-extrabold transition-all shadow-md flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Upgrade to Premium</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <p className="text-[10px] text-center text-[#64736A]">
                🔒 256-Bit Encrypted • SIH Demo Test Gateway Available • Cancel Anytime
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* -----------------------------------------------------------
          📊 DETAILED FEATURE COMPARISON TABLE
      ----------------------------------------------------------- */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-[#17211B]">
            Free vs Premium Feature Comparison
          </h2>
          <p className="text-xs text-[#526358]">
            See what is included in each plan to choose the best solution for your land.
          </p>
        </div>

        <div className="bg-[#FFFFFF] rounded-3xl border border-[#D5E1D9] shadow-sm overflow-hidden text-xs">
          <div className="grid grid-cols-12 bg-[#F8FBF9] p-4 border-b border-[#D5E1D9] font-extrabold text-[#17211B]">
            <div className="col-span-6 sm:col-span-7">Platform Capabilities</div>
            <div className="col-span-3 sm:col-span-2 text-center text-[#64736A]">Free Plan</div>
            <div className="col-span-3 sm:col-span-3 text-center text-[#15803D]">Premium Plan</div>
          </div>

          <div className="divide-y divide-[#D5E1D9]/60">
            <div className="grid grid-cols-12 p-4 items-center">
              <div className="col-span-6 sm:col-span-7 font-semibold text-[#17211B]">
                Satellite GIS Land Intelligence & Boundary Tool
              </div>
              <div className="col-span-3 sm:col-span-2 text-center text-[#15803D]">✓ Included</div>
              <div className="col-span-3 sm:col-span-3 text-center text-[#15803D] font-bold">✓ Included</div>
            </div>

            <div className="grid grid-cols-12 p-4 items-center">
              <div className="col-span-6 sm:col-span-7 font-semibold text-[#17211B]">
                Multi-Criteria AI Suitability Ranking (10+ Land Uses)
              </div>
              <div className="col-span-3 sm:col-span-2 text-center text-[#15803D]">✓ Included</div>
              <div className="col-span-3 sm:col-span-3 text-center text-[#15803D] font-bold">✓ Included</div>
            </div>

            <div className="grid grid-cols-12 p-4 items-center">
              <div className="col-span-6 sm:col-span-7 font-semibold text-[#17211B]">
                Government Scheme Matcher (PM-KUSUM, PMKSY, AIF)
              </div>
              <div className="col-span-3 sm:col-span-2 text-center text-[#15803D]">✓ Included</div>
              <div className="col-span-3 sm:col-span-3 text-center text-[#15803D] font-bold">✓ Included</div>
            </div>

            <div className="grid grid-cols-12 p-4 items-center bg-[#F8FBF9]/60">
              <div className="col-span-6 sm:col-span-7 font-semibold text-[#17211B]">
                Physical On-Site Certified Soil Expert Inspection
              </div>
              <div className="col-span-3 sm:col-span-2 text-center text-[#94A3B8]">✕ Locked</div>
              <div className="col-span-3 sm:col-span-3 text-center text-[#15803D] font-bold">✓ Unlimited Booking</div>
            </div>

            <div className="grid grid-cols-12 p-4 items-center bg-[#F8FBF9]/60">
              <div className="col-span-6 sm:col-span-7 font-semibold text-[#17211B]">
                Soil Lab Core Testing (N, P, K, pH, Organic Carbon, EC)
              </div>
              <div className="col-span-3 sm:col-span-2 text-center text-[#94A3B8]">✕ Regional Estimate</div>
              <div className="col-span-3 sm:col-span-3 text-center text-[#15803D] font-bold">✓ Verified Lab Values</div>
            </div>

            <div className="grid grid-cols-12 p-4 items-center bg-[#F8FBF9]/60">
              <div className="col-span-6 sm:col-span-7 font-semibold text-[#17211B]">
                Recommendation Re-Analysis with Lab Ground Truth
              </div>
              <div className="col-span-3 sm:col-span-2 text-center text-[#94A3B8]">✕ None</div>
              <div className="col-span-3 sm:col-span-3 text-center text-[#15803D] font-bold">✓ Automatic Engine Re-Run</div>
            </div>

            <div className="grid grid-cols-12 p-4 items-center bg-[#F8FBF9]/60">
              <div className="col-span-6 sm:col-span-7 font-semibold text-[#17211B]">
                Real-Time Socket.IO Live Status Tracker (6-Stages)
              </div>
              <div className="col-span-3 sm:col-span-2 text-center text-[#94A3B8]">✕ None</div>
              <div className="col-span-3 sm:col-span-3 text-center text-[#15803D] font-bold">✓ Live Dispatch Stepper</div>
            </div>

            <div className="grid grid-cols-12 p-4 items-center bg-[#F8FBF9]/60">
              <div className="col-span-6 sm:col-span-7 font-semibold text-[#17211B]">
                “🌱 Ground-Verified” Trust Badge for Banks & Buyers
              </div>
              <div className="col-span-3 sm:col-span-2 text-center text-[#94A3B8]">✕ None</div>
              <div className="col-span-3 sm:col-span-3 text-center text-[#15803D] font-bold">✓ Certified Dossier Badge</div>
            </div>
          </div>
        </div>
      </section>

      {/* Upgrade Modal */}
      <PremiumUpgradeModal />

    </div>
  );
};
