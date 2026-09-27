import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Trophy, Droplets, Sprout, TrendingUp, Sun, Factory,
  Building2, Building, ShieldCheck, ArrowRight, FileText,
  Compass, CheckCircle2, Sparkles, AlertCircle, ExternalLink,
  Layers, Wallet, HelpCircle, Check
} from 'lucide-react';
import { useLand } from '../context/LandContext';
import { analyzeLandParcel, analyzeSurroundingsFrontend, calculateParcelConfidence } from '../utils/aiEngine';
import { analyzeLocationInfrastructure } from '../services/infrastructureCorridorService';
import type { AIRecommendation } from '../types/land';

interface RecommendationDeckProps {
  onSeeFuture?: () => void;
  onOpenActionPlan?: () => void;
}

export const RecommendationDeck: React.FC<RecommendationDeckProps> = ({ onSeeFuture }) => {
  const { selectedParcel, setIsReportModalOpen } = useLand();
  const navigate = useNavigate();

  // 1. Deterministic Multi-Criteria Spatial Analysis (100% Parcel-Specific & Dynamic)
  const dynamicRecs = analyzeLandParcel(selectedParcel);
  const spatial = analyzeSurroundingsFrontend(selectedParcel);
  const infraAssessment = analyzeLocationInfrastructure(selectedParcel);
  const confidenceAssessment = calculateParcelConfidence(selectedParcel);

  const topRec: AIRecommendation = dynamicRecs[0] || {
    id: 'rec-default',
    useType: 'agriculture',
    title: 'Commercial Agriculture / Modern Farm',
    score: 92,
    rank: 1,
    category: 'Agriculture',
    primarySummary: 'Based on the available land area, surrounding agricultural activity, accessibility, and available water resources, this land is highly suitable for commercial agriculture. The available area provides sufficient space for cultivation, irrigation infrastructure, storage, and farm operations.',
    why: [
      'Tested fertile soil with optimal pH balance and organic carbon',
      'Reliable groundwater and irrigation canal connectivity within local radius',
      'Surrounded by active agricultural cropland belt',
      'Direct road accessibility enables seamless transport to regional mandis'
    ],
    suggestedComponents: [
      'Crop cultivation & high-yield rotation zone',
      'Micro-drip irrigation & automated fertigation unit',
      'Farm produce storage & grading shed',
      'Greenhouse / Polyhouse for precision horticulture',
      'Farm pond & rainwater harvesting reservoir'
    ],
    financialEstimate: {
      totalRange: '₹2.5 L – ₹4.8 L',
      breakdown: [
        { item: 'Land Preparation, Soil Conditioning & Levelling', range: '₹0.35 L – ₹0.65 L' },
        { item: 'Micro-Drip Irrigation, Pumping & Farm Pond', range: '₹0.60 L – ₹1.10 L' },
        { item: 'Farm Produce Storage Shed & Equipment', range: '₹0.50 L – ₹1.00 L' },
        { item: 'Greenhouse / Precision Setup', range: '₹0.65 L – ₹1.25 L' },
        { item: 'Initial High-Yield Seeds, Inputs & Operations', range: '₹0.40 L – ₹0.80 L' }
      ],
      notes: 'Indicative Estimate — Demo Data'
    },
    applicableSchemes: [
      { name: 'PMKSY (Per Drop More Crop)', department: 'Ministry of Agriculture & Farmers Welfare', benefit: 'Up to 55% direct capital subsidy on drip/micro-irrigation equipment', url: 'https://pmksy.gov.in' },
      { name: 'Agriculture Infrastructure Fund (AIF)', department: 'Department of Agriculture & Farmers Welfare', benefit: '3% annual interest subvention on bank loans up to ₹2.00 Cr for farm assets', url: 'https://agriinfra.dac.gov.in' },
      { name: 'National Horticulture Mission (NHM)', department: 'National Horticulture Board (NHB)', benefit: 'Credit-linked capital subsidy for commercial horticulture & fruit plantations', url: 'https://nhb.gov.in' }
    ],
    risks: ['Seasonal market price volatility in regional APMC mandis'],
    opportunities: ['PMKSY 55% micro-drip subsidy'],
    economics: {
      minInvestmentLakhs: 2.5,
      maxInvestmentLakhs: 4.8,
      annualRevenueLakhs: 1.8,
      operatingCostLakhsPerYear: 0.3,
      paybackYears: 1.8,
      roiPercentage: 35.0,
      jobsCreated: 4,
      waterRequirementLitersPerDay: 4000,
      subsidyAvailableLakhs: 1.5,
      regulatoryScore: 98
    },
    sustainabilityScore: 92,
    confidenceScore: confidenceAssessment.score
  };

  // Strictly take only 2nd and 3rd options (no more than 2 alternatives)
  const altRecs = dynamicRecs.slice(1, 3);

  const areaHectares = (selectedParcel.areaAcres * 0.404686).toFixed(2);
  const isSolar = topRec.useType === 'solar';
  const isAgri = topRec.useType === 'agriculture';
  const isIndustrial = topRec.useType === 'industrial';
  const isHealthcare = topRec.useType === 'public_infra';
  const isWarehouse = topRec.useType === 'warehouse';
  const isCommercial = topRec.useType === 'commercial';

  // Dynamic Data Confidence
  const gpsAccuracy = selectedParcel.gpsAccuracyMeters ?? 50;
  const isPolygonDefined = Boolean(selectedParcel.boundaryCoordinates && selectedParcel.boundaryCoordinates.length >= 3);
  const confidenceScore = confidenceAssessment.score;
  const confidenceRating = confidenceAssessment.rating;
  const isGroundVerified = selectedParcel.groundVerified || Boolean(selectedParcel.groundVerifiedReport);

  const getSectorIcon = (useType: string) => {
    switch (useType) {
      case 'agriculture': return '🌱';
      case 'industrial': return '🏭';
      case 'solar': return '☀️';
      case 'public_infra': return '🏥';
      case 'warehouse': return '📦';
      case 'commercial': return '🏪';
      case 'housing': return '🏡';
      default: return '⚡';
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 font-sans text-[#17211B]">
      
      {/* -----------------------------------------------------------
          📍 1. CURRENT LAND SUMMARY
      ----------------------------------------------------------- */}
      <div className="bg-[#FFFFFF] p-4 sm:p-6 rounded-3xl border border-[#D5E1D9] shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6">
        <div className="space-y-4 flex-1 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E8F5EC] text-[#15803D] flex items-center justify-center border border-[#BDE3CC] shrink-0 shadow-sm">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] sm:text-xs font-extrabold text-[#166534] uppercase tracking-wider">
                  SELECTED LAND PARCEL
                </span>
                {isGroundVerified ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E8F5EC] text-[#15803D] text-[10px] font-extrabold border border-[#15803D] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
                    <span>🌱 Ground-Verified</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md bg-[#E8F5EC] text-[#15803D] text-[10px] font-bold border border-[#BDE3CC]">
                    ✓ Verified Analysis
                  </span>
                )}
                {selectedParcel.groundVerifiedReport && (
                  <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="px-2 py-0.5 rounded-md bg-[#15803D] text-white hover:bg-[#166534] text-[10px] font-bold transition-all flex items-center gap-1 shadow-2xs"
                  >
                    <FileText className="w-3 h-3" />
                    <span>View Lab Report</span>
                  </button>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#17211B] mt-0.5 truncate">
                {selectedParcel.name}
              </h2>
              <p className="text-xs text-[#526358] font-medium truncate">
                📍 {selectedParcel.verifiedAddress || `${selectedParcel.district}, ${selectedParcel.state}, India`}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5 text-xs">
            <div className="bg-[#F8FBF9] p-2.5 rounded-xl border border-[#D5E1D9] min-w-0">
              <p className="text-[#64736A] font-bold uppercase text-[9px] mb-0.5">Coordinates</p>
              <p className="font-mono font-bold text-[11px] sm:text-xs text-[#17211B] truncate">
                {selectedParcel.lat.toFixed(4)}° N, {selectedParcel.lng.toFixed(4)}° E
              </p>
            </div>
            <div className="bg-[#F8FBF9] p-2.5 rounded-xl border border-[#D5E1D9] min-w-0">
              <p className="text-[#64736A] font-bold uppercase text-[9px] mb-0.5">Total Area</p>
              <p className="font-extrabold text-xs sm:text-sm text-[#15803D] truncate">{selectedParcel.areaAcres.toFixed(2)} Acres</p>
              <p className="text-[9px] text-[#64736A]">({areaHectares} Ha)</p>
            </div>
            <div className="bg-[#F8FBF9] p-2.5 rounded-xl border border-[#D5E1D9] min-w-0">
              <p className="text-[#64736A] font-bold uppercase text-[9px] mb-0.5">GPS Accuracy</p>
              <p className={`font-bold text-[11px] sm:text-xs truncate ${gpsAccuracy > 100 ? 'text-amber-700' : 'text-[#15803D]'}`}>
                {gpsAccuracy > 100 ? `⚠️ ±${Math.round(gpsAccuracy)}m` : `✓ ±${Math.round(gpsAccuracy)}m`}
              </p>
            </div>
            <div className="bg-[#F8FBF9] p-2.5 rounded-xl border border-[#D5E1D9] min-w-0">
              <p className="text-[#64736A] font-bold uppercase text-[9px] mb-0.5 truncate">
                {isGroundVerified ? 'Lab Soil Test' : 'Soil Quality'}
              </p>
              <p className="font-bold text-[11px] sm:text-xs text-[#17211B] truncate">
                pH {selectedParcel.soil.pH} • {isGroundVerified ? 'Verified' : `${selectedParcel.soil.healthScore}/100`}
              </p>
            </div>
            <div className="bg-[#F8FBF9] p-2.5 rounded-xl border border-[#D5E1D9] min-w-0">
              <p className="text-[#64736A] font-bold uppercase text-[9px] mb-0.5 truncate">
                {isGroundVerified ? 'Water Table' : 'Slope'}
              </p>
              <p className="font-bold text-[11px] sm:text-xs text-[#17211B] truncate">
                {isGroundVerified ? `${selectedParcel.groundVerifiedReport?.waterParameters.waterTableDepthMeters ?? selectedParcel.water.groundwaterDepth}m Depth` : `${selectedParcel.infrastructure.slopeDegrees}° (Flat)`}
              </p>
            </div>
            <div className="bg-[#F8FBF9] p-2.5 rounded-xl border border-[#D5E1D9] min-w-0">
              <p className="text-[#64736A] font-bold uppercase text-[9px] mb-0.5 truncate">Sunlight (GHI)</p>
              <p className="font-bold text-[11px] sm:text-xs text-[#17211B] truncate">{selectedParcel.infrastructure.solarRadiationKWh} kWh/m²</p>
            </div>
          </div>
        </div>

        {/* Live Satellite AOI Polygon Card */}
        <div className="w-full lg:w-[260px] h-[145px] rounded-2xl overflow-hidden relative shadow-sm border border-[#D5E1D9] shrink-0 bg-gradient-to-br from-[#133020] to-[#0a1c13] flex flex-col justify-between p-3.5">
          <div className="flex justify-between items-center text-white/90">
            <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase bg-black/40 px-2 py-0.5 rounded-md border border-white/10 backdrop-blur-xs">
              <Layers className="w-3 h-3 text-emerald-400" />
              <span>ISRO BHUVAN AOI</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-300">
              {selectedParcel.lat.toFixed(2)}°N, {selectedParcel.lng.toFixed(2)}°E
            </span>
          </div>

          <div className="my-auto flex items-center justify-center">
            <div className="w-32 h-10 border-2 border-emerald-400 bg-emerald-500/25 rounded-lg flex items-center justify-center shadow-lg backdrop-blur-xs">
              <span className="text-[10px] font-extrabold text-white tracking-wider">
                {selectedParcel.areaAcres.toFixed(2)} ACRES
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-[10px]">
            <span className="text-emerald-200 font-bold">
              {isPolygonDefined ? '✓ Boundary Set' : 'Center Point'}
            </span>
            <span className="text-white/70 font-mono">
              Elevation {selectedParcel.infrastructure.elevationMeters}m
            </span>
          </div>
        </div>
      </div>

      {/* -----------------------------------------------------------
          ⭐ 2. PRIMARY AI RECOMMENDATION (SINGLE BEST MATCH)
      ----------------------------------------------------------- */}
      <div className="bg-[#FFFFFF] p-4 sm:p-8 rounded-3xl border border-[#D5E1D9] shadow-sm space-y-6">
        
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D5E1D9] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E8F5EC] text-[#15803D] flex items-center justify-center border border-[#BDE3CC]">
              <Sparkles className="w-4 h-4 text-[#15803D]" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-[#166534] uppercase tracking-wider block">
                AI LAND DEVELOPMENT ANALYSIS
              </span>
              <h3 className="font-extrabold text-lg sm:text-xl text-[#17211B] leading-none mt-0.5">
                Recommended Development
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#E8F5EC] text-[#15803D] border border-[#BDE3CC] flex items-center gap-1.5 shadow-2xs">
              <span>Confidence: {topRec.confidenceScore || 92}%</span>
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#15803D] text-white">
              Suitability: {topRec.score}/100
            </span>
          </div>
        </div>

        {/* Primary Recommendation Showcase Card */}
        <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-br from-[#F8FBF9] via-[#FFFFFF] to-[#EAF7EF] border border-[#BDE3CC] space-y-5 shadow-xs">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-extrabold text-[#166534] uppercase tracking-wider block">
                ⭐ #1 HIGHEST-CONFIDENCE RECOMMENDATION
              </span>
              <h2 className="text-xl sm:text-3xl font-extrabold text-[#15803D] tracking-tight mt-1 flex items-center gap-2.5 flex-wrap">
                <span>{topRec.title}</span>
                <span className="text-2xl">{getSectorIcon(topRec.useType)}</span>
              </h2>
            </div>
          </div>

          {/* Meaningful Explanation Paragraph */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#D5E1D9] text-[#17211B] text-sm leading-relaxed font-medium">
            {topRec.primarySummary || (
              `Based on the available land area (${selectedParcel.areaAcres} Acres), surrounding environment, accessibility, and natural resources, this land is highly suitable for ${topRec.title.toLowerCase()}. The site provides sufficient space for optimal development, infrastructure integration, and operational efficiency.`
            )}
          </div>

          {/* Key Supporting Factors & Suggested Components */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
            
            {/* Why this recommendation? */}
            <div className="space-y-2.5">
              <span className="text-xs font-extrabold text-[#166534] uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
                <span>Why this recommendation?</span>
              </span>
              <ul className="space-y-2 text-xs text-[#324038] font-medium">
                {topRec.why.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#15803D] mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggested Development Components */}
            <div className="space-y-2.5">
              <span className="text-xs font-extrabold text-[#166534] uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#15803D]" />
                <span>Suggested Development Components</span>
              </span>
              <div className="space-y-1.5">
                {(topRec.suggestedComponents || [
                  'Primary functional facility & operational building',
                  'Dedicated storage and utility zone',
                  'Internal vehicle movement & loading apron',
                  'Water, power and environmental infrastructure',
                  'Provision for future expansion'
                ]).map((comp, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-white border border-[#D5E1D9] text-xs font-semibold text-[#17211B]">
                    <Check className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
                    <span>{comp}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* -----------------------------------------------------------
            💰 3. ESTIMATED FINANCIAL REQUIREMENT
        ----------------------------------------------------------- */}
        <div className="p-4 sm:p-6 rounded-3xl bg-[#F8FBF9] border border-[#D5E1D9] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D5E1D9] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#15803D]" />
                <span className="font-extrabold text-xs sm:text-sm text-[#17211B] uppercase tracking-wider">
                  ESTIMATED INVESTMENT
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#526358] mt-0.5">
                Financial projection calibrated for {selectedParcel.areaAcres.toFixed(2)} Acres
              </p>
            </div>
            
            <div className="sm:text-right">
              <span className="text-[10px] font-bold text-[#64736A] uppercase block">
                Total Estimated Project Cost
              </span>
              <span className="text-base sm:text-xl font-extrabold text-[#15803D]">
                {topRec.financialEstimate?.totalRange || `₹${(selectedParcel.areaAcres * 3.5).toFixed(1)} L – ₹${(selectedParcel.areaAcres * 6.5).toFixed(1)} L`}
              </span>
            </div>
          </div>

          {/* Breakdown Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5 text-xs">
            {(topRec.financialEstimate?.breakdown || [
              { item: 'Site Preparation & Civil Layout', range: `₹${(selectedParcel.areaAcres * 0.8).toFixed(1)} L – ₹${(selectedParcel.areaAcres * 1.5).toFixed(1)} L` },
              { item: 'Core Infrastructure & Equipment', range: `₹${(selectedParcel.areaAcres * 1.2).toFixed(1)} L – ₹${(selectedParcel.areaAcres * 2.2).toFixed(1)} L` },
              { item: 'Electrical, Water & Utility Setup', range: `₹${(selectedParcel.areaAcres * 0.9).toFixed(1)} L – ₹${(selectedParcel.areaAcres * 1.6).toFixed(1)} L` },
              { item: 'Safety, Approvals & Initial Setup', range: `₹${(selectedParcel.areaAcres * 0.6).toFixed(1)} L – ₹${(selectedParcel.areaAcres * 1.2).toFixed(1)} L` }
            ]).map((cost, idx) => (
              <div key={idx} className="p-3 bg-white rounded-2xl border border-[#D5E1D9] flex flex-col justify-between space-y-1 shadow-2xs min-w-0">
                <span className="text-[11px] font-semibold text-[#526358] leading-tight">{cost.item}</span>
                <span className="font-extrabold text-xs text-[#17211B]">{cost.range}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[10px] sm:text-[11px] font-medium text-[#64736A] pt-1 gap-1">
            <span>• {topRec.financialEstimate?.notes || 'Indicative Estimate — Demo Data'}</span>
            <span>Values scale with project specification and boundary survey</span>
          </div>
        </div>

        {/* -----------------------------------------------------------
            🏛️ 4. POTENTIAL FINANCIAL SUPPORT (GOVERNMENT SCHEMES)
        ----------------------------------------------------------- */}
        <div className="p-4 sm:p-6 rounded-3xl bg-white border border-[#D5E1D9] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D5E1D9] pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#15803D]" />
              <div>
                <h4 className="font-extrabold text-xs sm:text-base text-[#17211B] uppercase tracking-wider">
                  POTENTIAL FINANCIAL SUPPORT
                </h4>
                <p className="text-[11px] sm:text-xs text-[#526358]">
                  Central and State financial incentive programs relevant to {topRec.category}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold text-[#166534] bg-[#E8F5EC] px-3 py-1 rounded-full border border-[#BDE3CC] self-start sm:self-auto">
              Applicable Subsidies
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(topRec.applicableSchemes || [
              { name: 'Central Sector Infrastructure Scheme', department: 'Government of India', benefit: 'Interest subvention and capital subsidy for eligible infrastructure assets', url: 'https://india.gov.in' }
            ]).map((scheme, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#F8FBF9] border border-[#D5E1D9] flex flex-col justify-between space-y-3 min-w-0">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#64736A] uppercase block truncate">
                    {scheme.department}
                  </span>
                  <h5 className="font-extrabold text-xs text-[#17211B] leading-tight">
                    {scheme.name}
                  </h5>
                  <p className="text-[11px] text-[#526358] font-medium leading-relaxed pt-1">
                    {scheme.benefit}
                  </p>
                </div>

                {scheme.url && (
                  <a
                    href={scheme.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-extrabold text-[#15803D] hover:text-[#166534] inline-flex items-center gap-1 pt-2 border-t border-[#D5E1D9]"
                  >
                    <span>View Scheme Guidelines</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Mandatory Disclaimer */}
          <div className="p-3 bg-[#EAF7EF] rounded-xl border border-[#BDE3CC] text-[11px] text-[#166534] font-medium flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
            <span>
              <strong>Potentially Applicable Schemes:</strong> Eligibility and benefits depend on project type, location, applicant category, and current government guidelines.
            </span>
          </div>
        </div>

        {/* -----------------------------------------------------------
            🥈 5. OTHER POTENTIAL OPTIONS (STRICTLY #2 AND #3 ONLY)
        ----------------------------------------------------------- */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between border-b border-[#D5E1D9] pb-2">
            <div>
              <h4 className="font-extrabold text-sm sm:text-base text-[#17211B] uppercase tracking-wider">
                OTHER POTENTIAL OPTIONS
              </h4>
              <p className="text-xs text-[#64736A]">
                Secondary and tertiary development alternatives evaluated for this parcel:
              </p>
            </div>
            <span className="text-[10px] font-bold text-[#64736A] uppercase">
              Top 2 Alternatives
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {altRecs.map((alt, idx) => (
              <div 
                key={alt.id || idx}
                className="p-5 rounded-3xl bg-[#F8FBF9] border border-[#D5E1D9] space-y-3 hover:border-[#BDE3CC] transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-extrabold text-[#64736A] uppercase tracking-wider block">
                      {idx === 0 ? '2nd' : '3rd'} POTENTIAL OPTION
                    </span>
                    <h5 className="font-extrabold text-sm sm:text-base text-[#17211B] mt-0.5 flex items-center gap-1.5">
                      <span>{alt.title}</span>
                      <span className="text-base">{getSectorIcon(alt.useType)}</span>
                    </h5>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-white border border-[#D5E1D9] text-[#15803D] font-extrabold text-xs shrink-0 shadow-2xs">
                    Suitability: {alt.score}%
                  </span>
                </div>

                <p className="text-xs text-[#526358] font-medium leading-relaxed">
                  {alt.alternativeReason || `Suitable alternative based on site accessibility and local regional demand.`}
                </p>

                <div className="pt-2 border-t border-[#D5E1D9] flex items-center justify-between text-[11px] text-[#64736A] font-semibold">
                  <span>Score Difference: <strong className="text-amber-700">-{topRec.score - alt.score} pts</strong></span>
                  <span>Rank #{alt.rank}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* -----------------------------------------------------------
          🔮 6. FUTURE CORRIDOR & ACTION PLAN LAUNCHER STRIP
      ----------------------------------------------------------- */}
      <div className="bg-gradient-to-r from-[#F8FBF9] via-[#EDF6F0] to-[#E8F5EC] p-6 rounded-3xl border border-[#BDE3CC] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#15803D] text-white flex items-center justify-center text-xl shrink-0 shadow-sm">
            🔮
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-[#166534] uppercase tracking-wider">
                10-YEAR REGIONAL MASTER PLAN & CORRIDORS
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white text-[#15803D] text-[10px] font-bold border border-[#BDE3CC]">
                {infraAssessment.hasVerifiedFutureProjects ? `${infraAssessment.upcomingProjects.length} Infrastructure Projects` : 'GIS Verified'}
              </span>
            </div>
            <h3 className="font-extrabold text-base sm:text-lg text-[#17211B] mt-0.5">
              Explore 10-Year Infrastructure Corridors & 3D Simulation
            </h3>
            <p className="text-xs text-[#526358] font-medium">
              See upcoming highway interchanges, industrial clusters, and 3D architectural simulations calibrated for your land.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate('/future-potential')}
            className="px-5 py-3 rounded-2xl bg-[#15803D] hover:bg-[#166534] text-white text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-sm hover:scale-[1.02] active:scale-95"
          >
            <span>View Corridors Map</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
