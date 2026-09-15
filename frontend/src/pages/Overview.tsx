import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Globe2, 
  Sparkles, 
  MapPin, 
  Sun, 
  Warehouse, 
  Sprout, 
  ShieldCheck, 
  ArrowRight, 
  Play, 
  Layers, 
  CheckCircle2, 
  Building2, 
  TrendingUp, 
  Cpu, 
  Activity, 
  Droplets, 
  Zap, 
  Landmark, 
  Compass, 
  FileSpreadsheet, 
  Search, 
  UserCheck 
} from 'lucide-react';
import { useLand } from '../context/LandContext';
import { HeroLandscape3D } from '../components/HeroLandscape3D';
import { SourceBadge } from '../components/SourceBadge';

export const Overview: React.FC = () => {
  const { startSihDemo } = useLand();

  return (
    <div className="space-y-16 pb-20 font-sans text-[#17211B]">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative pt-4 pb-8 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Narrative & Actions */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F5EC] border border-[#BDE3CC] text-[#166534] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#15803D]" />
              <span>INDIAN LAND INTELLIGENCE PLATFORM</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-bold text-3xl sm:text-4xl xl:text-5xl text-[#17211B] tracking-tight leading-[1.15]">
              Turn Unused Land Into Intelligent Opportunities.
            </h1>

            {/* Subheadline */}
            <p className="text-[#405048] text-base leading-relaxed font-medium">
              LandVista AI analyzes your land, environment, infrastructure and government opportunities to help you understand what your land can become.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-bold">
              <Link
                to="/dashboard"
                className="px-6 py-3.5 rounded-2xl bg-[#15803D] hover:bg-[#166534] text-white tracking-wider uppercase shadow-sm transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-95"
              >
                <span>Explore LandVista</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/login"
                className="px-6 py-3.5 rounded-2xl bg-[#FFFFFF] hover:bg-[#F8FBF9] text-[#17211B] border border-[#D5E1D9] tracking-wider uppercase shadow-sm transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-95"
              >
                <span>Sign In</span>
              </Link>

              <Link
                to="/onboarding"
                className="px-5 py-3.5 rounded-2xl bg-[#E8F5EC] hover:bg-[#D5EEDF] text-[#166534] border border-[#BDE3CC] transition-all flex items-center gap-1.5 font-bold"
              >
                <MapPin className="w-4 h-4 text-[#15803D]" />
                <span>Analyze My Land</span>
              </Link>
            </div>

            {/* Trust Quick Indicators */}
            <div className="pt-4 border-t border-[#D5E1D9] grid grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-[#64736A] font-bold block uppercase">VERIFIED PARCEL</span>
                <p className="font-bold text-[#17211B] text-sm">10.2 Acres</p>
                <span className="text-[11px] text-[#15803D] font-semibold">Maharashtra & Pan-India</span>
              </div>
              <div>
                <span className="text-[10px] text-[#64736A] font-bold block uppercase">SATELLITE & GIS</span>
                <p className="font-bold text-[#0284C7] text-sm">ISRO & Bhuvan</p>
                <span className="text-[11px] text-[#405048] font-medium">CartoDEM & LULC</span>
              </div>
              <div>
                <span className="text-[10px] text-[#64736A] font-bold block uppercase">CENTRAL SCHEMES</span>
                <p className="font-bold text-[#92400E] text-sm">PM-KUSUM & AIF</p>
                <span className="text-[11px] text-[#405048] font-medium">Subsidies Matched</span>
              </div>
            </div>
          </div>

          {/* Right Hero: Realistic Interactive 3D Landscape */}
          <div className="lg:col-span-7 h-[500px] lg:h-[580px]">
            <HeroLandscape3D />
          </div>
        </div>
      </section>

      {/* 2. TRUST STRIP */}
      <section className="bg-[#FFFFFF] p-5 sm:p-6 rounded-3xl border border-[#D5E1D9] shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold">
          <div className="flex items-center gap-2 shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#15803D]" />
            <span className="font-bold text-[#17211B] text-sm uppercase tracking-wider">POWERED BY ROBUST DATA INTELLIGENCE:</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9]">
              <Globe2 className="w-4 h-4 text-[#0284C7]" />
              <span className="text-xs text-[#17211B]">🛰️ Satellite/GIS Data</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9]">
              <Cpu className="w-4 h-4 text-[#15803D]" />
              <span className="text-xs text-[#17211B]">🤖 AI Analysis</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9]">
              <Sprout className="w-4 h-4 text-[#166534]" />
              <span className="text-xs text-[#17211B]">🌱 Soil Intelligence</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9]">
              <Landmark className="w-4 h-4 text-[#D97706]" />
              <span className="text-xs text-[#17211B]">🏛️ Scheme Matching</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR CORE VALUE PROPOSITIONS */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#166534] uppercase tracking-wider">COMPREHENSIVE LAND LIFECYCLE</span>
          <h2 className="font-bold text-3xl text-[#17211B]">
            From Soil to Solar, Agro to Infrastructure
          </h2>
          <p className="text-sm text-[#405048] font-medium">
            Everything a landowner, government officer, agronomist, or developer needs to unlock real land value.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Proposition 1 */}
          <div className="bg-[#FFFFFF] p-7 rounded-3xl border border-[#D5E1D9] shadow-sm space-y-4 hover:border-[#15803D] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F5EC] text-[#15803D] border border-[#BDE3CC] flex items-center justify-center font-bold">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-xl text-[#17211B]">UNDERSTAND YOUR LAND</h3>
              <p className="text-sm text-[#405048] leading-relaxed font-medium">
                See precise geospatial location, verified polygon boundaries, soil NPK nutrients, groundwater depth, and surrounding transport infrastructure.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap gap-2 text-xs font-bold">
              <span className="px-3 py-1 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B]">CartoDEM 30m Slope</span>
              <span className="px-3 py-1 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B]">Soil Health Card OCR</span>
              <span className="px-3 py-1 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B]">Aquifer Stress Index</span>
            </div>
          </div>

          {/* Proposition 2 */}
          <div className="bg-[#FFFFFF] p-7 rounded-3xl border border-[#D5E1D9] shadow-sm space-y-4 hover:border-[#15803D] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A] flex items-center justify-center font-bold">
              <Sun className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-xl text-[#17211B]">DISCOVER POSSIBILITIES</h3>
              <p className="text-sm text-[#405048] leading-relaxed font-medium">
                Understand whether high-yield precision agriculture, utility-scale solar farms, logistics warehousing, or agro-processing represent the highest economic and social return.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap gap-2 text-xs font-bold">
              <span className="px-3 py-1 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B]">MCDA Suitability (0-100)</span>
              <span className="px-3 py-1 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B]">Crop Yield Projections</span>
              <span className="px-3 py-1 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B]">Solar PPA Revenue</span>
            </div>
          </div>

          {/* Proposition 3 */}
          <div className="bg-[#FFFFFF] p-7 rounded-3xl border border-[#D5E1D9] shadow-sm space-y-4 hover:border-[#15803D] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F5EC] text-[#166534] border border-[#BDE3CC] flex items-center justify-center font-bold">
              <Landmark className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-xl text-[#17211B]">FIND GOVERNMENT SUPPORT</h3>
              <p className="text-sm text-[#405048] leading-relaxed font-medium">
                Identify potentially relevant Central and State government schemes, capital subsidies, interest subventions, and single-window ministry links directly tailored to your land.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap gap-2 text-xs font-bold">
              <span className="px-3 py-1 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B]">PM-KUSUM 30% CFA</span>
              <span className="px-3 py-1 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B]">Agri Infra Fund 3% Subvention</span>
              <span className="px-3 py-1 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B]">MIDC Cluster Benefits</span>
            </div>
          </div>

          {/* Proposition 4 */}
          <div className="bg-[#FFFFFF] p-7 rounded-3xl border border-[#D5E1D9] shadow-sm space-y-4 hover:border-[#15803D] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE] flex items-center justify-center font-bold">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-xl text-[#17211B]">PLAN THE FUTURE</h3>
              <p className="text-sm text-[#405048] leading-relaxed font-medium">
                Understand 10-year infrastructure corridors, upcoming national highways, transmission grid expansions, and master DPR roadmaps to execute with confidence.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap gap-2 text-xs font-bold">
              <span className="px-3 py-1 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B]">Corridor Forecasts (2026-2036)</span>
              <span className="px-3 py-1 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B]">7-Step Turnkey DPR</span>
              <span className="px-3 py-1 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B]">Empaneled Expert Visits</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BOTTOM ACTION & SIH DEMO BANNER */}
      <section className="bg-[#FFFFFF] p-8 sm:p-10 rounded-3xl border border-[#D5E1D9] text-center space-y-5 shadow-sm">
        <div className="max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5EC] text-[#166534] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Decision Center</span>
          </div>
          <h2 className="font-bold text-2xl sm:text-3xl text-[#17211B]">
            Explore Land Intelligence in Action
          </h2>
          <p className="text-sm text-[#405048] font-medium">
            Launch the GIS command center directly or run the automated 3-minute SIH presentation.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-bold">
          <Link
            to="/dashboard"
            className="px-6 py-3.5 rounded-2xl bg-[#15803D] hover:bg-[#166534] text-white tracking-wider uppercase shadow-sm transition-all hover:scale-[1.02] active:scale-95"
          >
            Launch Command Dashboard
          </Link>
          <button
            onClick={startSihDemo}
            className="px-6 py-3.5 rounded-2xl bg-[#E8F5EC] hover:bg-[#D5EEDF] text-[#166534] border border-[#BDE3CC] font-bold transition-all hover:scale-[1.02]"
          >
            Run SIH Demo Presentation
          </button>
        </div>
      </section>
    </div>
  );
};
