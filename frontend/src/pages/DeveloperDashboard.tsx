import React, { useState } from 'react';
import { 
  Building2, 
  TrendingUp, 
  DollarSign, 
  Layers, 
  MapPin, 
  Compass, 
  Sun, 
  Warehouse, 
  Building, 
  Sprout, 
  Sliders, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink,
  ShieldCheck,
  Scale,
  Sparkles,
  Zap,
  Clock
} from 'lucide-react';
import { useLand } from '../context/LandContext';
import { DataConfidenceBadge } from '../components/DataConfidenceBadge';
import { ScoreRing } from '../components/ScoreRing';
import confetti from 'canvas-confetti';

export const DeveloperDashboard: React.FC = () => {
  const { selectedParcel } = useLand();

  // Commercial Filter State
  const [targetSector, setTargetSector] = useState<'all' | 'solar' | 'warehouse' | 'commercial' | 'housing'>('all');
  const [minAcreage, setMinAcreage] = useState<number>(5);
  const [maxBudgetCr, setMaxBudgetCr] = useState<number>(10);
  const [selectedComparisonIds, setSelectedComparisonIds] = useState<string[]>(['parcel-1', 'parcel-2']);

  // Commercial Land Opportunities Database
  const commercialParcels = [
    {
      id: 'parcel-1',
      name: `${selectedParcel.name} (Solapur South)`,
      district: 'Solapur, Maharashtra',
      acres: selectedParcel.areaAcres,
      primaryOpportunity: 'Solar Energy / Agro-Logistics',
      indicativePriceCr: 3.80,
      estimatedCapexCr: 4.20,
      annualRevenueEstimateLakh: 95,
      paybackYears: 4.4,
      roadFrontage: '40m State Highway',
      gridDistance: '1.2 km (33kV)',
      zoning: 'Agricultural (Solar Permitted Without NA)',
      solarIrradiance: '5.85 kWh/m²',
      feasibilityScore: 94
    },
    {
      id: 'parcel-2',
      name: 'Chincholi MIDC Logistics Hub',
      district: 'Solapur, Maharashtra',
      acres: 14.5,
      primaryOpportunity: 'Heavy Warehousing & Cold Chain',
      indicativePriceCr: 7.25,
      estimatedCapexCr: 8.50,
      annualRevenueEstimateLakh: 180,
      paybackYears: 4.7,
      roadFrontage: '60m 4-Lane NH',
      gridDistance: '0.6 km (Industrial Feeder)',
      zoning: 'Industrial Converted (MIDC Approved)',
      solarIrradiance: '5.75 kWh/m²',
      feasibilityScore: 88
    },
    {
      id: 'parcel-3',
      name: 'Pune-Solapur Highway Interchange',
      district: 'Mohol, Solapur',
      acres: 22.0,
      primaryOpportunity: 'Multi-Modal Logistics Park',
      indicativePriceCr: 11.50,
      estimatedCapexCr: 16.00,
      annualRevenueEstimateLakh: 340,
      paybackYears: 4.9,
      roadFrontage: '80m Express Corridor',
      gridDistance: '2.1 km (66kV)',
      zoning: 'Commercial Mixed-Use Potential',
      solarIrradiance: '5.80 kWh/m²',
      feasibilityScore: 85
    }
  ];

  const filteredParcels = commercialParcels.filter((p) => {
    if (targetSector !== 'all' && !p.primaryOpportunity.toLowerCase().includes(targetSector)) return false;
    if (p.acres < minAcreage) return false;
    if (p.indicativePriceCr > maxBudgetCr) return false;
    return true;
  });

  const toggleComparison = (id: string) => {
    setSelectedComparisonIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const comparisonList = commercialParcels.filter((p) => selectedComparisonIds.includes(p.id));

  return (
    <div className="space-y-6 font-sans pb-12">
      
      {/* 1. DEVELOPER COMMAND HEADER */}
      <div className="bg-[#FFFFFF] p-4 sm:p-7 rounded-3xl border border-[#D6E2DA] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF7EF] border border-[#BDE3CC] flex items-center justify-center text-[#15803D] shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold font-mono text-[#166534]">DEVELOPER & INVESTOR SUITE</span>
              <DataConfidenceBadge type="VERIFIED" label="PUBLIC LAND OPPORTUNITIES" />
            </div>
            <h1 className="font-bold text-xl sm:text-2xl text-[#17211B] tracking-tight">
              Land Investment & Development Feasibility Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-[#4B5D52] font-semibold">
              Only showing publicly listed, government-allocated, or landowner-consented development parcels
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-[#F8FBF9] border border-[#D6E2DA] text-[#17211B] font-bold">
            Available: <strong>{filteredParcels.length} Parcels</strong>
          </span>
          <span className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-[#EAF7EF] text-[#166534] border border-[#BDE3CC] font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
            <span>Privacy Protected</span>
          </span>
        </div>
      </div>

      {/* PRIVACY SHIELD BANNER */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-[#F8FBF9] border border-[#D6E2DA] flex items-center justify-between text-xs text-[#17211B] shadow-sm font-medium">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#15803D] shrink-0" />
          <span>
            🔒 <strong>Strict Landowner Privacy Gate:</strong> Private land deeds, personal contact numbers, and confidential consultations are protected. To connect with a landowner, submit a formal Expression of Interest (EOI).
          </span>
        </div>
      </div>

      {/* 2. COMMERCIAL FILTERS STRIP */}
      <div className="bg-[#FFFFFF] p-3 sm:p-4 rounded-2xl border border-[#D6E2DA] shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#4B5D52] uppercase mr-1 font-bold">Sector:</span>
          {[
            { key: 'all', label: 'All Sectors' },
            { key: 'solar', label: '☀️ Solar Energy' },
            { key: 'warehouse', label: '📦 Warehousing' },
            { key: 'commercial', label: '🏢 Commercial' },
          ].map((sec) => (
            <button
              key={sec.key}
              onClick={() => setTargetSector(sec.key as any)}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl font-bold uppercase transition-all ${
                targetSector === sec.key ? 'bg-[#15803D] text-white shadow-sm' : 'bg-[#F8FBF9] text-[#17211B] hover:bg-[#EAF7EF] border border-[#D6E2DA]'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-[#17211B]">
          <div className="flex items-center gap-2">
            <span className="font-bold">Min Acres:</span>
            <input
              type="number"
              value={minAcreage}
              onChange={(e) => setMinAcreage(Number(e.target.value))}
              className="w-16 px-2.5 py-1 rounded-lg bg-[#F8FBF9] border border-[#D6E2DA] text-[#17211B] font-bold text-center"
              min={1}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold">Max Budget:</span>
            <span className="font-bold text-[#15803D] text-sm">₹{maxBudgetCr} Cr</span>
          </div>
        </div>
      </div>

      {/* 3. COMMERCIAL OPPORTUNITIES PIPELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {filteredParcels.map((parcel) => {
          const isCompared = selectedComparisonIds.includes(parcel.id);
          return (
            <div
              key={parcel.id}
              className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#D6E2DA] space-y-4 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between border-b border-[#D6E2DA] pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#166534] uppercase tracking-wider block">{parcel.primaryOpportunity}</span>
                    <h3 className="font-bold text-[#17211B] text-base">{parcel.name}</h3>
                  </div>
                  <ScoreRing score={parcel.feasibilityScore} size={48} strokeWidth={4} color="#15803D" label="IRR Score" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-2xl bg-[#F8FBF9] border border-[#D6E2DA]">
                    <span className="text-[10px] text-[#4B5D52] block uppercase font-bold">Land Size</span>
                    <span className="font-bold text-[#17211B] text-sm">{parcel.acres} Acres</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#F8FBF9] border border-[#D6E2DA]">
                    <span className="text-[10px] text-[#4B5D52] block uppercase font-bold">Est. Capex</span>
                    <span className="font-bold text-[#92400E] text-sm">₹{parcel.estimatedCapexCr} Cr*</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#F8FBF9] border border-[#D6E2DA]">
                    <span className="text-[10px] text-[#4B5D52] block uppercase font-bold">Annual Yield</span>
                    <span className="font-bold text-[#15803D] text-sm">₹{parcel.annualRevenueEstimateLakh} L/yr*</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#F8FBF9] border border-[#D6E2DA]">
                    <span className="text-[10px] text-[#4B5D52] block uppercase font-bold">Payback</span>
                    <span className="font-bold text-[#17211B] text-sm">{parcel.paybackYears} Years*</span>
                  </div>
                </div>

                <div className="space-y-1 text-[#17211B] text-xs pt-1 leading-relaxed font-medium">
                  <p>🛣️ <strong>Frontage:</strong> {parcel.roadFrontage}</p>
                  <p>⚡ <strong>Grid Distance:</strong> {parcel.gridDistance}</p>
                  <p>📋 <strong>Zoning Status:</strong> {parcel.zoning}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#D6E2DA] flex items-center justify-between text-xs">
                <button
                  onClick={() => toggleComparison(parcel.id)}
                  className={`px-4 py-2 rounded-xl border transition-all text-xs font-bold ${
                    isCompared ? 'bg-[#15803D] text-white border-[#15803D] shadow-sm' : 'bg-[#F8FBF9] text-[#17211B] border-[#D6E2DA] hover:bg-[#EAF7EF]'
                  }`}
                >
                  {isCompared ? '✓ Comparing' : '+ Compare'}
                </button>

                <a
                  href="https://pmkusum.mnre.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#15803D] hover:text-[#166534] font-bold flex items-center gap-1"
                >
                  <span>Dossier</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. SIDE-BY-SIDE LAND COMPARISON MATRIX */}
      {comparisonList.length >= 2 && (
        <div className="bg-[#FFFFFF] p-6 sm:p-7 rounded-3xl border border-[#D6E2DA] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#D6E2DA] pb-3">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#15803D]" />
              <h3 className="font-bold text-base text-[#17211B] uppercase tracking-wider">
                Multi-Parcel Investment Comparison Matrix
              </h3>
            </div>
            <span className="text-xs font-bold text-[#15803D]">Comparing {comparisonList.length} Parcels</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-[#D6E2DA] text-[#4B5D52] text-xs uppercase font-bold">
                  <th className="p-3">Metric / Parameter</th>
                  {comparisonList.map((p) => (
                    <th key={p.id} className="p-3 text-[#17211B] font-bold text-sm">{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D6E2DA] text-[#17211B] font-medium">
                <tr>
                  <td className="p-3 text-[#4B5D52] font-bold">Total Land Area</td>
                  {comparisonList.map((p) => <td key={p.id} className="p-3 font-bold text-[#17211B]">{p.acres} Acres</td>)}
                </tr>
                <tr>
                  <td className="p-3 text-[#4B5D52] font-bold">Primary Commercial Use</td>
                  {comparisonList.map((p) => <td key={p.id} className="p-3 text-[#15803D] font-bold">{p.primaryOpportunity}</td>)}
                </tr>
                <tr>
                  <td className="p-3 text-[#4B5D52] font-bold">Indicative Capex (₹ Cr)</td>
                  {comparisonList.map((p) => <td key={p.id} className="p-3 text-[#92400E] font-bold">₹{p.estimatedCapexCr} Cr*</td>)}
                </tr>
                <tr>
                  <td className="p-3 text-[#4B5D52] font-bold">Annual Revenue Yield</td>
                  {comparisonList.map((p) => <td key={p.id} className="p-3 text-[#15803D] font-bold">₹{p.annualRevenueEstimateLakh} Lakh/yr*</td>)}
                </tr>
                <tr>
                  <td className="p-3 text-[#4B5D52] font-bold">Estimated Payback Period</td>
                  {comparisonList.map((p) => <td key={p.id} className="p-3 text-[#17211B] font-bold">{p.paybackYears} Years*</td>)}
                </tr>
                <tr>
                  <td className="p-3 text-[#4B5D52] font-bold">Road Access</td>
                  {comparisonList.map((p) => <td key={p.id} className="p-3 text-[#17211B]">{p.roadFrontage}</td>)}
                </tr>
                <tr>
                  <td className="p-3 text-[#4B5D52] font-bold">Substation Grid Distance</td>
                  {comparisonList.map((p) => <td key={p.id} className="p-3 text-[#17211B]">{p.gridDistance}</td>)}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
