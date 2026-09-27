import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  MapPin, 
  Sparkles, 
  Activity, 
  Layers, 
  Compass, 
  Building2, 
  TrendingUp, 
  ShieldCheck, 
  DollarSign, 
  Sprout, 
  Warehouse, 
  Sun, 
  Building,
  CheckCircle2
} from 'lucide-react';
import { HeroLandIntelligenceVisual } from '../components/HeroLandIntelligenceVisual';

export const Overview: React.FC = () => {
  return (
    <div className="font-sans text-[#111827] bg-[#F8FAF9] selection:bg-[#EAF7EF] selection:text-[#166534] min-h-screen">
      
      {/* -------------------------------------------------------------
          1. HERO SECTION (MINIMAL, HIGH-IMPACT, REALISTIC VISUAL)
      ------------------------------------------------------------- */}
      <section className="pt-8 sm:pt-12 pb-14 sm:pb-20 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-left">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5EC] border border-[#BDE3CC] text-[#166534] text-[11px] sm:text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#15803D] shrink-0" />
              <span>Intelligent Land Development Engine</span>
            </div>

            <h1 className="font-extrabold text-3xl sm:text-5xl xl:text-6xl text-[#111827] tracking-tight leading-[1.12]">
              Know Your Land.<br />
              <span className="text-[#15803D]">Build What Comes Next.</span>
            </h1>

            <p className="text-[#4B5563] text-sm sm:text-lg leading-relaxed font-normal max-w-xl">
              AI-powered land intelligence that helps you understand your land, its potential, and future development possibilities.
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <Link
                to="/onboarding"
                className="w-full sm:w-auto justify-center px-6 py-3.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-sm font-semibold tracking-wide shadow-xs transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-95"
              >
                <span>Analyze Your Land</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/dashboard"
                className="w-full sm:w-auto justify-center px-6 py-3.5 rounded-xl bg-[#FFFFFF] hover:bg-[#F3F4F6] text-[#111827] border border-[#D1D5DB] text-sm font-semibold tracking-wide shadow-2xs transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-95"
              >
                <span>Explore Platform</span>
              </Link>
            </div>

          </div>

          {/* Right Hero Visual: Realistic Aerial Land Intelligence Visual */}
          <div className="lg:col-span-6 w-full min-w-0">
            <HeroLandIntelligenceVisual />
          </div>

        </div>
      </section>

      {/* -------------------------------------------------------------
          2. CREDIBILITY & VALUE STRIP
      ------------------------------------------------------------- */}
      <section className="border-y border-[#E5E7EB] bg-white py-5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-xs sm:text-sm font-medium tracking-wide text-[#6B7280]">
            AI-Powered &nbsp;•&nbsp; Location Intelligence &nbsp;•&nbsp; Land Analysis &nbsp;•&nbsp; Future Development Insights
          </p>
        </div>
      </section>

      {/* -------------------------------------------------------------
          3. ONE LAND. MULTIPLE POSSIBILITIES.
      ------------------------------------------------------------- */}
      <section id="product" className="py-14 sm:py-24 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto space-y-8 sm:space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="font-extrabold text-2xl sm:text-4xl text-[#111827] tracking-tight">
            One Land. Multiple Possibilities.
          </h2>
          <p className="text-[#4B5563] text-xs sm:text-base leading-relaxed">
            Every parcel is distinct. LandVista evaluates dimensions, topography, soil, and surroundings to determine the development that creates the greatest long-term value.
          </p>
        </div>

        {/* Elegant Visual Sector Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="p-6 bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#15803D] transition-all space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#E8F5EC] text-[#15803D] flex items-center justify-center font-bold text-lg">
              🌱
            </div>
            <h3 className="font-bold text-base text-[#111827]">Agriculture & Modern Farming</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              High-yield horticulture, precision irrigation, and crop rotation calibrated to verified soil nutrients.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#15803D] transition-all space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#1E40AF] flex items-center justify-center font-bold text-lg">
              🏭
            </div>
            <h3 className="font-bold text-base text-[#111827]">Industrial & Manufacturing</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Production facilities, assembly plants, and storage sheds aligned with grid capacity and transport links.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#15803D] transition-all space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center font-bold text-lg">
              📦
            </div>
            <h3 className="font-bold text-base text-[#111827]">Logistics & Warehousing</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Fulfillment hubs, cold-chain storage, and distribution centers positioned along key freight corridors.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#15803D] transition-all space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#F3E8FF] text-[#7E22CE] flex items-center justify-center font-bold text-lg">
              🏥
            </div>
            <h3 className="font-bold text-base text-[#111827]">Commercial & Institutional</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Retail plazas, healthcare centers, and educational campuses matching local population catchments.
            </p>
          </div>

        </div>
      </section>

      {/* -------------------------------------------------------------
          4. HOW IT WORKS (3 CLEAN STEPS)
      ------------------------------------------------------------- */}
      <section id="how-it-works" className="py-14 sm:py-24 px-4 sm:px-8 lg:px-16 bg-white border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#15803D] uppercase tracking-wider">Simple Process</span>
            <h2 className="font-extrabold text-2xl sm:text-4xl text-[#111827] tracking-tight">
              How It Works
            </h2>
            <p className="text-[#4B5563] text-xs sm:text-base leading-relaxed">
              Three clear steps to discover the optimal path forward for your land parcel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10">
            
            {/* Step 1 */}
            <div className="space-y-2.5 text-left p-5 bg-[#F8FAF9] sm:bg-transparent rounded-2xl sm:p-0">
              <span className="font-mono text-xs sm:text-sm font-extrabold text-[#15803D] block">
                01 — Register Land
              </span>
              <h3 className="font-bold text-base sm:text-lg text-[#111827]">
                Add your land location and basic information.
              </h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Provide coordinates, an address, or draw parcel boundaries directly on our geospatial map interface.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-2.5 text-left p-5 bg-[#F8FAF9] sm:bg-transparent rounded-2xl sm:p-0">
              <span className="font-mono text-xs sm:text-sm font-extrabold text-[#15803D] block">
                02 — Analyze
              </span>
              <h3 className="font-bold text-base sm:text-lg text-[#111827]">
                LandVista analyzes size, location, surroundings and available information.
              </h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Our engine scans terrain slope, water proximity, power substations, road access, and regional zoning.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-2.5 text-left p-5 bg-[#F8FAF9] sm:bg-transparent rounded-2xl sm:p-0">
              <span className="font-mono text-xs sm:text-sm font-extrabold text-[#15803D] block">
                03 — Discover Potential
              </span>
              <h3 className="font-bold text-base sm:text-lg text-[#111827]">
                Get an AI-powered recommendation for suitable future development.
              </h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Receive the single highest-confidence development type, financial estimates, and matching government support.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* -------------------------------------------------------------
          5. FEATURES (4 CORE PILLARS ONLY)
      ------------------------------------------------------------- */}
      <section id="features" className="py-14 sm:py-24 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto space-y-10 sm:space-y-16">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#15803D] uppercase tracking-wider">Capabilities</span>
          <h2 className="font-extrabold text-2xl sm:text-4xl text-[#111827] tracking-tight">
            Built for Authoritative Land Decisions
          </h2>
          <p className="text-[#4B5563] text-xs sm:text-base leading-relaxed">
            Essential tools designed to give landowners, planners, and developers clear, data-driven answers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          
          {/* Feature 1 */}
          <div className="p-5 sm:p-8 bg-white rounded-2xl border border-[#E5E7EB] space-y-2.5 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#E8F5EC] text-[#15803D] flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base sm:text-lg text-[#111827]">AI Land Analysis</h3>
            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              Evaluate feasibility based on parcel size, soil chemical composition, topography, and environmental variables.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-5 sm:p-8 bg-white rounded-2xl border border-[#E5E7EB] space-y-2.5 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#E8F5EC] text-[#15803D] flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base sm:text-lg text-[#111827]">Location Intelligence</h3>
            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              Analyze arterial road frontage, proximity to electrical substations, water infrastructure, and regional corridors.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-5 sm:p-8 bg-white rounded-2xl border border-[#E5E7EB] space-y-2.5 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#E8F5EC] text-[#15803D] flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base sm:text-lg text-[#111827]">Development Potential</h3>
            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              Identify the most viable land-use sectors with clear suitability scoring and comparative option analysis.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-5 sm:p-8 bg-white rounded-2xl border border-[#E5E7EB] space-y-2.5 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#E8F5EC] text-[#15803D] flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base sm:text-lg text-[#111827]">Financial Insights</h3>
            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              Understand indicative project budgets, capex requirements, and relevant Central and State government schemes.
            </p>
          </div>

        </div>

      </section>

      {/* -------------------------------------------------------------
          6. ABOUT SECTION / SIMPLE PRODUCT STATEMENT
      ------------------------------------------------------------- */}
      <section id="about" className="py-14 sm:py-20 px-4 sm:px-8 bg-white border-t border-[#E5E7EB]">
        <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
          <span className="text-xs font-bold text-[#15803D] uppercase tracking-wider">About LandVista</span>
          <h2 className="font-extrabold text-xl sm:text-3xl text-[#111827] tracking-tight">
            Bridging the gap between raw land and actionable intelligence.
          </h2>
          <p className="text-xs sm:text-base text-[#4B5563] leading-relaxed max-w-2xl mx-auto">
            Millions of acres of land across India remain underutilized simply because landowners lack clear insights into what their property is best suited for. LandVista combines satellite telemetry, soil records, and spatial decision modeling to deliver clarity in seconds.
          </p>
        </div>
      </section>

      {/* -------------------------------------------------------------
          7. FINAL CTA
      ------------------------------------------------------------- */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 bg-[#F3F4F6] border-t border-[#E5E7EB] text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          
          <h2 className="font-extrabold text-2xl sm:text-4xl lg:text-5xl text-[#111827] tracking-tight">
            Your land has potential.<br />
            <span className="text-[#15803D]">Discover it.</span>
          </h2>

          <div className="pt-2">
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-sm font-semibold tracking-wide shadow-md transition-all hover:scale-[1.02] active:scale-95"
            >
              <span>Analyze My Land</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* -------------------------------------------------------------
          8. MINIMAL CLEAN FOOTER
      ------------------------------------------------------------- */}
      <footer className="bg-white border-t border-[#E5E7EB] py-8 sm:py-12 px-4 sm:px-8 text-xs text-[#6B7280]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 text-center sm:text-left">
          
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-[#111827]">
              LandVista<span className="text-[#15803D]">.</span>
            </span>
            <span className="text-[#9CA3AF]">© {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-medium text-[#4B5563]">
            <Link to="/dashboard" className="hover:text-[#111827] transition-colors">Platform</Link>
            <Link to="/onboarding" className="hover:text-[#111827] transition-colors">Analyze Land</Link>
            <Link to="/pricing" className="hover:text-[#111827] transition-colors">Pricing</Link>
            <Link to="/login" className="hover:text-[#111827] transition-colors">Sign In</Link>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default Overview;
