import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Search, 
  Filter, 
  ArrowUpRight, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  Download, 
  Layers,
  Sparkles,
  CheckCircle2,
  Hospital,
  GraduationCap,
  Home,
  Trees,
  Droplets,
  Road,
  FileSpreadsheet,
  Compass
} from 'lucide-react';
import { useLand } from '../context/LandContext';
import { DataConfidenceBadge } from '../components/DataConfidenceBadge';
import { ScoreRing } from '../components/ScoreRing';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

export const GovDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { parcels, setSelectedParcel } = useLand();

  const [searchQuery, setSearchQuery] = useState('');
  const [targetPublicSector, setTargetPublicSector] = useState<'all' | 'housing' | 'hospital' | 'school' | 'solar' | 'park'>('all');
  const [selectedParcelIds, setSelectedParcelIds] = useState<string[]>(['parcel-solapur-1', 'parcel-pune-2']);
  const [isBatchAnalyzing, setIsBatchAnalyzing] = useState(false);
  const [batchReportGenerated, setBatchReportGenerated] = useState(false);

  // Government Land Bank Database
  const governmentParcels = [
    {
      id: 'parcel-solapur-1',
      name: 'Survey 88/2A (Solapur South Bypass)',
      district: 'Solapur, Maharashtra',
      areaAcres: 10.2,
      currentOccupancy: 'Mostly Open Fallow',
      recommendedPublicUse: 'Affordable Housing (PMAY) / Solar Utility',
      socialImpactScore: 92,
      ownershipStatus: 'Verified Government Land Bank',
      statusColor: 'text-[#166534] bg-[#EAF7EF] border-[#BDE3CC]',
      publicInfraSuitability: {
        housing: 'High (PMAY ARHC eligible)',
        hospital: 'Moderate (3.5km from Civil Hospital)',
        school: 'High (Rural catchment of 4 villages)',
        park: 'Low',
        solar: 'Very High (1.2km from 33kV substation)'
      }
    },
    {
      id: 'parcel-pune-2',
      name: 'PMRDA Peripheral Growth Corridor',
      district: 'Pune, Maharashtra',
      areaAcres: 24.5,
      currentOccupancy: 'Semi-Cultivated / Vacant',
      recommendedPublicUse: 'Regional Multi-Specialty Hospital & Health Hub',
      socialImpactScore: 96,
      ownershipStatus: 'Verified Government Land Bank',
      statusColor: 'text-[#166534] bg-[#EAF7EF] border-[#BDE3CC]',
      publicInfraSuitability: {
        housing: 'Very High',
        hospital: 'Very High (Direct Ring Road Linkage)',
        school: 'Moderate',
        park: 'High',
        solar: 'Moderate'
      }
    },
    {
      id: 'parcel-nagpur-3',
      name: 'MIHAN Logistics Periphery',
      district: 'Nagpur, Maharashtra',
      areaAcres: 18.0,
      currentOccupancy: 'Open Fallow',
      recommendedPublicUse: 'Industrial Skill Center & Solar Micro-Grid',
      socialImpactScore: 88,
      ownershipStatus: 'Verification Pending (Revenue Dept)',
      statusColor: 'text-[#92400E] bg-[#FEF3C7] border-[#FDE68A]',
      publicInfraSuitability: {
        housing: 'Moderate',
        hospital: 'Low',
        school: 'High (Technical Training Hub)',
        park: 'Moderate',
        solar: 'High'
      }
    }
  ];

  const filteredParcels = governmentParcels.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.district.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const toggleSelect = (id: string) => {
    setSelectedParcelIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBatchAnalyze = () => {
    setIsBatchAnalyzing(true);
    setTimeout(() => {
      setIsBatchAnalyzing(false);
      setBatchReportGenerated(true);
      confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
    }, 1500);
  };

  const handleInspectParcel = (parcel: any) => {
    setSelectedParcel({
      ...parcel,
      lat: 17.6599,
      lng: 75.9064,
      infrastructure: { gridDistanceKm: 1.2, roadAccess: 'Paved', slopeDegrees: 2.1, waterSource: 'Canal nearby' }
    });
    navigate('/dashboard');
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* 1. GOVERNMENT PORTFOLIO COMMAND HEADER */}
      <div className="bg-[#FFFFFF] p-6 sm:p-7 rounded-3xl border border-[#D6E2DA] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF7EF] border border-[#BDE3CC] flex items-center justify-center text-[#15803D] shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold font-mono text-[#166534]">GOVERNMENT LAND BANK & INFRASTRUCTURE MATRIX</span>
              <DataConfidenceBadge type="VERIFIED" label="STATE REVENUE & URBAN PLANNING" />
            </div>
            <h1 className="font-bold text-2xl text-[#17211B] tracking-tight">
              Public Land Prioritisation & Social Welfare Matrix
            </h1>
            <p className="text-sm text-[#4B5D52] font-medium">
              State Land Bank Analytics • Automated Public Infrastructure & Affordable Housing Suitability
            </p>
          </div>
        </div>

        {/* Portfolio Vitals */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
          <div className="bg-[#F8FBF9] px-3.5 py-2.5 rounded-2xl border border-[#D6E2DA]">
            <span className="text-[10px] font-bold text-[#4B5D52] block uppercase">INVENTORY</span>
            <p className="font-bold text-[#17211B] text-sm">3,890 <span className="text-xs text-[#4B5D52]">Ac</span></p>
          </div>
          <div className="bg-[#EAF7EF] px-3.5 py-2.5 rounded-2xl border border-[#BDE3CC]">
            <span className="text-[10px] font-bold text-[#166534] block uppercase">HOUSING</span>
            <p className="font-bold text-[#166534] text-sm">840 <span className="text-xs">Ac</span></p>
          </div>
          <div className="bg-[#EFF6FF] px-3.5 py-2.5 rounded-2xl border border-[#BFDBFE]">
            <span className="text-[10px] font-bold text-[#1E40AF] block uppercase">HEALTH & ED</span>
            <p className="font-bold text-[#1E40AF] text-sm">412 <span className="text-xs">Ac</span></p>
          </div>
          <div className="bg-[#FEF3C7] px-3.5 py-2.5 rounded-2xl border border-[#FDE68A]">
            <span className="text-[10px] font-bold text-[#92400E] block uppercase">RENEWABLE</span>
            <p className="font-bold text-[#92400E] text-sm">1,240 <span className="text-xs">Ac</span></p>
          </div>
        </div>
      </div>

      {/* 2. PUBLIC SECTOR PRIORITIZATION & BATCH ANALYSIS BAR */}
      <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#D6E2DA] shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#4B5D52] uppercase mr-1 font-bold">Public Need:</span>
          {[
            { key: 'all', label: 'All Sectors' },
            { key: 'housing', label: '🏠 Affordable Housing' },
            { key: 'hospital', label: '🏥 Hospital / Health' },
            { key: 'school', label: '🏫 School / Education' },
            { key: 'solar', label: '☀️ Solar Power Bank' },
          ].map((sec) => (
            <button
              key={sec.key}
              onClick={() => setTargetPublicSector(sec.key as any)}
              className={`px-3.5 py-2 rounded-xl font-bold uppercase transition-all ${
                targetPublicSector === sec.key ? 'bg-[#15803D] text-white shadow-sm' : 'bg-[#F8FBF9] text-[#17211B] hover:bg-[#EAF7EF] border border-[#D6E2DA]'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[#17211B] font-bold">{selectedParcelIds.length} Parcels Selected</span>
          <button
            onClick={handleBatchAnalyze}
            disabled={isBatchAnalyzing || selectedParcelIds.length === 0}
            className="px-4 py-2 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isBatchAnalyzing ? 'Analyzing Public Impact...' : 'Analyze Selected Lands'}</span>
          </button>
        </div>
      </div>

      {/* 3. BATCH ANALYSIS SUMMARY REPORT BANNER */}
      {batchReportGenerated && (
        <div className="p-5 rounded-3xl bg-[#EAF7EF] border border-[#BDE3CC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-[#166534] shadow-sm">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#15803D] shrink-0" />
            <span className="font-medium text-[#17211B]">
              <strong>Batch Public Welfare Report Generated:</strong> Analyzed {selectedParcelIds.length} parcels. Primary welfare allocation: <strong>65% Affordable Housing & 35% Renewable Micro-Grid</strong>.
            </span>
          </div>
          <button
            onClick={() => alert('Downloading official Government Prioritization Dossier (PDF)...')}
            className="px-4 py-2 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs uppercase flex items-center gap-1.5 shrink-0 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Official Dossier</span>
          </button>
        </div>
      )}

      {/* 4. GOVERNMENT INVENTORY TABLE */}
      <div className="bg-[#FFFFFF] rounded-3xl overflow-hidden shadow-sm border border-[#D6E2DA]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium">
            <thead className="bg-[#F8FBF9] text-[#17211B] uppercase text-xs tracking-wider border-b border-[#D6E2DA] font-bold">
              <tr>
                <th className="p-4">Select</th>
                <th className="p-4">Parcel / Cadastre</th>
                <th className="p-4">District / State</th>
                <th className="p-4">Area</th>
                <th className="p-4">Recommended Public Use</th>
                <th className="p-4">Social Impact Score</th>
                <th className="p-4">Verification Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D6E2DA] text-[#17211B]">
              {filteredParcels.map((parcel) => {
                const isSelected = selectedParcelIds.includes(parcel.id);
                return (
                  <tr key={parcel.id} className="hover:bg-[#F8FBF9] transition-colors">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(parcel.id)}
                        className="w-4 h-4 rounded accent-[#15803D] cursor-pointer"
                      />
                    </td>
                    <td className="p-4 font-bold text-[#17211B] text-sm">
                      {parcel.name}
                    </td>
                    <td className="p-4 text-[#4B5D52]">{parcel.district}</td>
                    <td className="p-4 font-bold text-[#15803D]">{parcel.areaAcres} Acres</td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-[#EAF7EF] text-[#166534] border border-[#BDE3CC] text-xs font-bold">
                        {parcel.recommendedPublicUse}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-[#15803D] text-sm">{parcel.socialImpactScore} / 100</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${parcel.statusColor}`}>
                        {parcel.ownershipStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleInspectParcel(parcel)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#F8FBF9] hover:bg-[#15803D] hover:text-white text-[#17211B] border border-[#D6E2DA] text-xs font-bold uppercase transition-all shadow-sm"
                      >
                        Inspect 3D
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
