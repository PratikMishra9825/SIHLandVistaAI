import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  MapPin, 
  Layers, 
  Sun, 
  Box, 
  Activity, 
  Landmark, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  Clock, 
  Compass, 
  Camera, 
  FileSpreadsheet 
} from 'lucide-react';
import { useLand } from '../context/LandContext';
import { DataConfidenceBadge } from './DataConfidenceBadge';
import confetti from 'canvas-confetti';

export const SIHDemoModal: React.FC = () => {
  const { isSihDemoActive, stopSihDemo, selectedParcel, setActiveScenario } = useLand();
  const [currentScene, setCurrentScene] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const demoScenes = [
    {
      step: 1,
      title: 'SCENE 1 — GROUND PHOTO & LOCATION INGESTION',
      subtitle: 'Multi-Modal Ingestion via Drone/Ground Image + GPS Coordinates',
      icon: Camera,
      color: 'text-[#15803D]',
      description: 'The landowner uploads a field photograph and specifies the Solapur, Maharashtra coordinate envelope (17.6599°N, 75.9064°E). Vision CV detects 82% open fallow terrain with low slope gradient.',
      metric: 'Parcel: 10.0 Acres • Survey: MH-SOL-2024/782B'
    },
    {
      step: 2,
      title: 'SCENE 2 — MULTI-LAYER SATELLITE & GIS ENVELOPE',
      subtitle: 'Autonomous Spatial Fusion: Leaflet + ISRO Bhuvan Raster Data',
      icon: MapPin,
      color: 'text-[#15803D]',
      description: 'The platform projects parcel polygon boundaries over high-resolution satellite imagery, overlaying CartoDEM 30m terrain elevations and 33/11 kV transmission line vectors.',
      metric: 'Elevation: 465m • Slope: 2.1° Flat Gradient'
    },
    {
      step: 3,
      title: 'SCENE 3 — CURRENT OCCUPANCY & SURFACE SCAN',
      subtitle: 'Automated Land-Use Assessment & Boundary Transparency',
      icon: Layers,
      color: 'text-[#0284C7]',
      description: 'Remote sensing analysis confirms the land is predominantly open fallow ground (82% Open, 12% Sparse Vegetation, 6% Boundary Tracks) with verified legal disclaimers.',
      metric: 'Occupancy Status: Predominantly Open (86% Confidence)'
    },
    {
      step: 4,
      title: 'SCENE 4 — HISTORICAL ACTIVITY TIMELINE (2021–2026)',
      subtitle: 'Satellite Remote Sensing Archive & Land Persistence Verification',
      icon: Clock,
      color: 'text-[#6B21A8]',
      description: 'The multi-year satellite archive evaluates Sentinel-2 and Bhuvan LISS-IV observations, establishing consistent open land persistence across 5 consecutive observation cycles.',
      metric: 'Open Land Persistence: High (NDVI ~0.19)'
    },
    {
      step: 5,
      title: 'SCENE 5 — SURROUNDING INFRASTRUCTURE INTELLIGENCE',
      subtitle: 'GIS Proximity to Substations, Highways & Industrial Hubs',
      icon: Compass,
      color: 'text-[#0284C7]',
      description: 'Exact spatial calculation of critical growth anchors: MSEDCL 33kV Substation (1.2 km), NH-52 Highway (1.8 km), and MIDC Industrial Cluster (3.8 km).',
      metric: 'Grid Evacuation Proximity: 1.2 km (+14 Points)'
    },
    {
      step: 6,
      title: 'SCENE 6 — SOIL & WATER DIAGNOSTIC TELEMETRY',
      subtitle: 'Automated Soil Health Card OCR & Aquifer Stress Analytics',
      icon: Activity,
      color: 'text-[#15803D]',
      description: 'Vision OCR reads pH (7.2 Neutral), Nitrogen (Low), and Potassium (High). Aquifer stress analytics indicate moderate summer groundwater depth (48m).',
      metric: 'Soil Health Score: 68/100 • Solar Radiation: 5.85 kWh/m²'
    },
    {
      step: 7,
      title: 'SCENE 7 — DETERMINISTIC AI LAND VERDICT',
      subtitle: 'Causal Multi-Criteria Decision Algorithm (MCDA)',
      icon: Sun,
      color: 'text-[#D97706]',
      description: 'The AI synthesizes physical constraints, awarding #1 Rank to Utility-Scale Solar Farm (94/100) with explainable positive drivers (+18 Radiation, +14 Grid Proximity).',
      metric: 'AI Verdict: ☀️ Solar Farm (#1 Rank — 94/100)'
    },
    {
      step: 8,
      title: 'SCENE 8 — 3D DIGITAL TWIN & 2026–2036 EVOLUTION',
      subtitle: 'Procedural WebGL Morphing & Long-Term Infrastructure Growth',
      icon: Box,
      color: 'text-[#15803D]',
      description: 'The 3D procedural engine renders dual-axis photovoltaic arrays, inverters, and perimeter access roads, with an interactive slider previewing 2026–2036 mature growth.',
      metric: 'Interactive 3D Scenario: Solar Park Active'
    },
    {
      step: 9,
      title: 'SCENE 9 — GOVERNMENT SCHEME MATCHING',
      subtitle: 'Direct Capital Subsidies & 25-Year Guaranteed PPA',
      icon: Landmark,
      color: 'text-[#D97706]',
      description: 'Matches PM-KUSUM Component A (30% CFA + ₹3.10/kWh tariff) and AIF (3% interest subvention), reducing project payback period to 4.8 years.',
      metric: 'PM-KUSUM Match: 95% (MNRE Verified Source)'
    },
    {
      step: 10,
      title: 'SCENE 10 — MASTER LAND ACTION PLAN',
      subtitle: 'Turnkey 7-Step Roadmap & Bank-Ready DPR Report',
      icon: FileSpreadsheet,
      color: 'text-[#15803D]',
      description: 'Generates a comprehensive 7-phase execution blueprint with CAPEX forecasts, statutory checklist, and direct printable report export.',
      metric: 'Master Utilization Score: 94 / 100 • Action Plan Ready'
    }
  ];

  const currentSceneData = demoScenes[currentScene - 1];
  const IconComponent = currentSceneData.icon;

  useEffect(() => {
    if (!isSihDemoActive || !isPlaying) return;

    if (currentScene === 8) {
      setActiveScenario('solar');
    }

    if (currentScene === 10) {
      confetti({ particleCount: 80, spread: 90, origin: { y: 0.6 } });
    }

    const timer = setTimeout(() => {
      if (currentScene < demoScenes.length) {
        setCurrentScene((prev) => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, 4500);

    return () => clearTimeout(timer);
  }, [currentScene, isSihDemoActive, isPlaying]);

  if (!isSihDemoActive) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#17211B]/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans animate-in fade-in duration-300">
      <div className="w-full max-w-4xl bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#D5E1D9] shadow-2xl space-y-6 text-[#17211B]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#D5E1D9] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E8F5EC] text-[#15803D] border border-[#BDE3CC] flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-mono text-[#166534] uppercase tracking-wider">PRODUCT WALKTHROUGH</span>
                <DataConfidenceBadge type="VERIFIED" label="LIVE DEMONSTRATION" />
              </div>
              <h2 className="font-bold text-xl text-[#17211B]">
                LandVista AI — Master Product Walkthrough
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-[#15803D]">
              Scene {currentScene} of {demoScenes.length}
            </span>
            <button
              onClick={stopSihDemo}
              className="p-1.5 rounded-lg hover:bg-[#E8F5EC] text-[#64736A] hover:text-[#17211B] transition-all ml-2"
              title="Exit Walkthrough"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scene Hero Card */}
        <div className="p-6 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9] space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className={`text-xs ${currentSceneData.color} font-bold block uppercase`}>
                {currentSceneData.title}
              </span>
              <h3 className="font-bold text-xl text-[#17211B]">
                {currentSceneData.subtitle}
              </h3>
            </div>

            <div className={`w-12 h-12 rounded-2xl bg-[#FFFFFF] border border-[#D5E1D9] flex items-center justify-center ${currentSceneData.color} shrink-0`}>
              <IconComponent className="w-6 h-6" />
            </div>
          </div>

          <p className="text-sm text-[#405048] leading-relaxed font-medium">
            {currentSceneData.description}
          </p>

          <div className="p-3 bg-[#FFFFFF] rounded-xl border border-[#D5E1D9] flex items-center justify-between text-xs">
            <span className="font-bold text-[#166534]">TELEMETRY & VERIFICATION:</span>
            <span className="font-bold text-[#17211B]">{currentSceneData.metric}</span>
          </div>
        </div>

        {/* Progress Bar & Interactive Navigation */}
        <div className="space-y-3">
          <div className="w-full bg-[#D5E1D9] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#15803D] h-full transition-all duration-500 rounded-full"
              style={{ width: `${(currentScene / demoScenes.length) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-bold pt-1">
            <div className="flex items-center gap-2">
              <button
                disabled={currentScene === 1}
                onClick={() => setCurrentScene((prev) => Math.max(1, prev - 1))}
                className="px-3.5 py-1.5 rounded-xl bg-[#F8FBF9] hover:bg-[#E8F5EC] border border-[#D5E1D9] text-[#17211B] disabled:opacity-30 transition-all flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3.5 py-1.5 rounded-xl bg-[#E8F5EC] text-[#166534] border border-[#BDE3CC] hover:bg-[#D5EEDF] transition-all flex items-center gap-1"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>

              <button
                disabled={currentScene === demoScenes.length}
                onClick={() => setCurrentScene((prev) => Math.min(demoScenes.length, prev + 1))}
                className="px-3.5 py-1.5 rounded-xl bg-[#F8FBF9] hover:bg-[#E8F5EC] border border-[#D5E1D9] text-[#17211B] disabled:opacity-30 transition-all flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={stopSihDemo}
              className="px-5 py-2 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold uppercase shadow-sm transition-all"
            >
              Exit to Interactive Platform
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
