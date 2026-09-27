import React, { useState, useEffect } from 'react';
import { MapPin, Compass, ShieldCheck, Sparkles, Droplets, Zap, Activity, Check } from 'lucide-react';

export const HeroLandIntelligenceVisual: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Progressive scan stages: 0 = scanning, 1 = boundary & area, 2 = road & surroundings, 3 = AI insight
  useEffect(() => {
    const timer1 = setTimeout(() => setActiveStage(1), 600);
    const timer2 = setTimeout(() => setActiveStage(2), 1600);
    const timer3 = setTimeout(() => setActiveStage(3), 2600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div 
      className="relative w-full aspect-[4/3] sm:aspect-[16/11] lg:aspect-[16/12] max-h-[520px] rounded-3xl overflow-hidden border border-[#D5E1D9] bg-[#0F1E17] shadow-xl select-none group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. REALISTIC SATELLITE / ORTHOPHOTO BACKGROUND WITH NATURAL TERRAIN */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Procedural High-Res Satellite Simulation Grid */}
        <svg className="w-full h-full object-cover" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="satGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1E3E2B" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0B1610" stopOpacity="1" />
            </radialGradient>
            <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#374151" />
              <stop offset="100%" stopColor="#1F2937" />
            </linearGradient>
            <linearGradient id="parcelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#166534" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#15803D" stopOpacity="0.25" />
            </linearGradient>
            <pattern id="cropLines" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(25)">
              <line x1="0" y1="0" x2="0" y2="20" stroke="#2D5A3C" strokeWidth="1.5" strokeOpacity="0.4" />
            </pattern>
            <pattern id="fieldTexture" width="35" height="35" patternUnits="userSpaceOnUse" patternTransform="rotate(-15)">
              <line x1="0" y1="0" x2="0" y2="35" stroke="#3A6B48" strokeWidth="2" strokeOpacity="0.3" />
            </pattern>
          </defs>

          {/* Deep Natural Orthophoto Base */}
          <rect width="800" height="600" fill="url(#satGlow)" />

          {/* Surrounding Farmland Parcels (Adjacent cadastres) */}
          {/* Top-Left Field */}
          <path d="M 40 40 L 320 60 L 300 240 L 20 220 Z" fill="#1B3A26" fillOpacity="0.7" />
          <path d="M 40 40 L 320 60 L 300 240 L 20 220 Z" fill="url(#cropLines)" />
          
          {/* Top-Right Field */}
          <path d="M 420 50 L 760 30 L 780 230 L 440 250 Z" fill="#224830" fillOpacity="0.6" />
          <path d="M 420 50 L 760 30 L 780 230 L 440 250 Z" fill="url(#fieldTexture)" />
          
          {/* Bottom-Left Field */}
          <path d="M 30 310 L 290 330 L 270 560 L 10 540 Z" fill="#183321" fillOpacity="0.8" />
          
          {/* Bottom-Right Field */}
          <path d="M 520 340 L 770 320 L 790 570 L 540 580 Z" fill="#1F422B" fillOpacity="0.7" />
          <path d="M 520 340 L 770 320 L 790 570 L 540 580 Z" fill="url(#cropLines)" />

          {/* Natural Water Canal Stream */}
          <path d="M -20 180 Q 200 210 380 160 T 820 190" stroke="#0284C7" strokeWidth="6" strokeOpacity="0.4" fill="none" strokeLinecap="round" />
          <path d="M -20 180 Q 200 210 380 160 T 820 190" stroke="#38BDF8" strokeWidth="1.5" strokeOpacity="0.7" fill="none" strokeDasharray="6 4" />

          {/* Arterial Connecting Transport Road */}
          <path d="M 330 -20 L 370 260 L 400 620" stroke="#475569" strokeWidth="22" strokeLinecap="square" fill="none" />
          <path d="M 330 -20 L 370 260 L 400 620" stroke="#1E293B" strokeWidth="18" strokeLinecap="square" fill="none" />
          <path d="M 330 -20 L 370 260 L 400 620" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="8 8" fill="none" strokeOpacity="0.8" />

          {/* Natural Tree Buffers / Windbreaks */}
          <g fill="#164E28" fillOpacity="0.85">
            <circle cx="310" cy="120" r="10" />
            <circle cx="320" cy="140" r="12" />
            <circle cx="315" cy="165" r="9" />
            <circle cx="322" cy="190" r="11" />
            <circle cx="390" cy="380" r="10" />
            <circle cx="395" cy="405" r="13" />
            <circle cx="388" cy="430" r="9" />
            <circle cx="400" cy="460" r="11" />
            <circle cx="410" cy="490" r="10" />
          </g>

          {/* 2. TARGET CADASTRAL LAND PARCEL (CENTER HIGHLIGHT) */}
          <g>
            {/* Parcel Polygon Fill */}
            <polygon 
              points="385,150 680,180 640,480 365,450" 
              fill="url(#parcelGrad)" 
              className="transition-all duration-700"
            />

            {/* Internal Crop / Soil Texture Pattern on Parcel */}
            <polygon 
              points="385,150 680,180 640,480 365,450" 
              fill="url(#cropLines)" 
            />

            {/* Glowing Crisp Cadastral Boundary Line */}
            <polygon 
              points="385,150 680,180 640,480 365,450" 
              stroke="#22C55E" 
              strokeWidth="2.5" 
              fill="none"
              strokeDasharray="600"
              strokeDashoffset={activeStage >= 1 ? "0" : "600"}
              className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]"
            />

            {/* Boundary Vertices Marker Pins */}
            {activeStage >= 1 && (
              <g className="animate-in fade-in duration-500">
                <circle cx="385" cy="150" r="4.5" fill="#22C55E" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="680" cy="180" r="4.5" fill="#22C55E" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="640" cy="480" r="4.5" fill="#22C55E" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="365" cy="450" r="4.5" fill="#22C55E" stroke="#FFFFFF" strokeWidth="1.5" />
              </g>
            )}

            {/* Scanning Radar Wave Line */}
            <line 
              x1="350" 
              y1="150" 
              x2="700" 
              y2="180" 
              stroke="#86EFAC" 
              strokeWidth="2" 
              strokeOpacity="0.8"
              className="animate-[scanBeam_3.5s_ease-in-out_infinite]"
            />
          </g>
        </svg>
      </div>

      {/* Subtle Grid / Orthophoto Coordinate Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1610] via-transparent to-black/30 pointer-events-none" />

      {/* Top Left: GIS Live Status Badge */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-white text-[10px] sm:text-[11px] font-mono max-w-[calc(100%-24px)] truncate">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        <span className="font-semibold text-emerald-300 truncate">ISRO BHUVAN STREAM</span>
        <span className="text-white/40 hidden sm:inline">•</span>
        <span className="text-white/70 hidden sm:inline">17.6599° N, 75.9064° E</span>
      </div>

      {/* 3. SUBTLE INTELLIGENCE MARKERS & LABELS (STAGGERED ANIMATION) */}
      
      {/* Label 1: Land Area */}
      {activeStage >= 1 && (
        <div className="absolute top-[28%] left-[54%] -translate-x-1/2 -translate-y-1/2 z-20 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-emerald-500/40 text-white text-[11px] sm:text-xs shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            <div>
              <span className="text-[8px] sm:text-[9px] text-emerald-400 font-extrabold uppercase tracking-wider block leading-none">LAND AREA</span>
              <span className="font-bold text-[11px] sm:text-xs text-white">12.4 Acres <span className="text-white/50 text-[9px] sm:text-[10px] font-normal">(5.02 Ha)</span></span>
            </div>
          </div>
        </div>
      )}

      {/* Label 2: Road Accessibility */}
      {activeStage >= 2 && (
        <div className="absolute top-[48%] left-[26%] -translate-x-1/2 -translate-y-1/2 z-20 hidden xs:block animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 text-white text-[11px] sm:text-xs shadow-lg">
            <span className="text-emerald-400 font-bold text-xs">🛣️</span>
            <div>
              <span className="text-[8px] sm:text-[9px] text-white/60 font-extrabold uppercase tracking-wider block leading-none">ACCESSIBILITY</span>
              <span className="font-bold text-[11px] sm:text-xs text-white">Arterial Road (30m)</span>
            </div>
          </div>
        </div>
      )}

      {/* Label 3: Water & Soil Resource */}
      {activeStage >= 2 && (
        <div className="absolute top-[20%] right-[6%] z-20 hidden sm:block animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-cyan-500/30 text-white text-xs shadow-lg">
            <Droplets className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <div>
              <span className="text-[9px] text-cyan-300 font-extrabold uppercase tracking-wider block leading-none">WATER & SOIL</span>
              <span className="font-bold text-xs text-white">pH 7.2 • Canal 400m</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. FINAL FLOATING AI INSIGHT CARD (BOTTOM-RIGHT) */}
      {activeStage >= 3 && (
        <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-auto sm:right-4 sm:max-w-xs z-30 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-3 sm:p-3.5 rounded-2xl bg-[#0F2218]/95 backdrop-blur-md border border-emerald-500/50 shadow-2xl space-y-1 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-[9px] sm:text-[10px] font-extrabold text-emerald-300 uppercase tracking-wider font-mono">
                  AI RECOMMENDATION
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] sm:text-[10px] font-extrabold">
                94% Match
              </span>
            </div>

            <div className="pt-0.5">
              <h4 className="font-extrabold text-xs sm:text-sm text-white flex items-center gap-1 leading-tight">
                <span>Commercial Agriculture</span>
              </h4>
              <p className="text-[10px] sm:text-[11px] text-emerald-100/80 font-medium leading-tight mt-0.5">
                High soil fertility & road access make this ideal for high-yield horticulture & storage.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for Scanning Beam Animation */}
      <style>{`
        @keyframes scanBeam {
          0% { transform: translateY(-80px); opacity: 0; }
          20% { opacity: 0.9; }
          80% { opacity: 0.9; }
          100% { transform: translateY(320px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default HeroLandIntelligenceVisual;
