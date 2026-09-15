import React, { useState } from 'react';
import { 
  FileCheck2, 
  Printer, 
  Share2, 
  Download, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Award, 
  ShieldCheck, 
  Building, 
  Sparkles 
} from 'lucide-react';
import { useLand } from '../context/LandContext';
import { DataConfidenceBadge } from './DataConfidenceBadge';
import confetti from 'canvas-confetti';

export const ActionPlan: React.FC = () => {
  const { selectedParcel, topRecommendation } = useLand();
  const [isCopied, setIsCopied] = useState(false);
  const masterScoreVal = topRecommendation.score || topRecommendation.suitabilityScore || 94;

  const steps = [
    {
      step: 1,
      title: 'Conduct Physical Geotechnical & Soil Test',
      timeline: 'Days 1 - 7',
      desc: 'Verify soil bearing capacity and soil resistivity through an empaneled agricultural expert.',
      status: 'Ready to Book',
    },
    {
      step: 2,
      title: 'Verify Land Title & Revenue Zoning Status',
      timeline: 'Days 8 - 14',
      desc: 'Obtain updated 30-year Search Report and 7/12 (Satbara) extract with clean boundaries.',
      status: 'Document Check',
    },
    {
      step: 3,
      title: 'Apply for Substation Grid Interconnection Study',
      timeline: 'Days 15 - 30',
      desc: `Submit formal application to MSEDCL for 33/11 kV interconnection (Current distance: ${selectedParcel.infrastructure.gridDistanceKm} km).`,
      status: 'Statutory Step',
    },
    {
      step: 4,
      title: 'Submit Central Scheme Grant Application',
      timeline: 'Days 31 - 45',
      desc: 'Register on the PM-KUSUM / AIF national portal to lock in capital subsidy and PPA rates.',
      status: 'Subsidies',
    },
    {
      step: 5,
      title: 'Secure Project Debt Financing',
      timeline: 'Days 46 - 60',
      desc: `Submit DPR to partner commercial bank leveraging scheme interest subventions.`,
      status: 'Financial Close',
    },
    {
      step: 6,
      title: 'Execute EPC Contractor Tender',
      timeline: 'Days 61 - 90',
      desc: 'Invite competitive bids for solar arrays / warehouse construction with milestone guarantees.',
      status: 'Procurement',
    },
    {
      step: 7,
      title: 'Commercial Commissioning & Grid COD',
      timeline: 'Days 91 - 180',
      desc: 'Complete trial generation runs, grid synchronization, and revenue settlement.',
      status: 'Commissioning',
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#D5E1D9] shadow-sm space-y-6 font-sans text-[#17211B]">
      
      {/* Top Banner Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D5E1D9] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#15803D]" />
            <h2 className="font-bold text-xl tracking-tight text-[#17211B] uppercase">
              Master Land Action Plan & DPR Roadmap
            </h2>
          </div>
          <p className="text-xs text-[#405048] font-medium mt-0.5">
            Turnkey operational execution blueprint tailored for {selectedParcel.name} ({selectedParcel.district})
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F8FBF9] hover:bg-[#E8F5EC] border border-[#D5E1D9] text-[#17211B] transition-all shadow-sm"
          >
            <Printer className="w-4 h-4 text-[#15803D]" />
            <span>Print Dossier</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white transition-all shadow-sm"
          >
            <Share2 className="w-4 h-4" />
            <span>{isCopied ? 'Link Copied!' : 'Share DPR'}</span>
          </button>
        </div>
      </div>

      {/* Target Milestone Status Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9]">
          <span className="text-[10px] text-[#64736A] font-bold uppercase block">Feasibility Score</span>
          <span className="font-bold text-[#15803D] text-base">{masterScoreVal} / 100</span>
        </div>
        <div className="p-3.5 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9]">
          <span className="text-[10px] text-[#64736A] font-bold uppercase block">Total Horizon</span>
          <span className="font-bold text-[#17211B] text-base">180 Calendar Days</span>
        </div>
        <div className="p-3.5 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9]">
          <span className="text-[10px] text-[#64736A] font-bold uppercase block">Active Milestones</span>
          <span className="font-bold text-[#17211B] text-base">7 Key Gates</span>
        </div>
        <div className="p-3.5 bg-[#E8F5EC] rounded-2xl border border-[#BDE3CC]">
          <span className="text-[10px] text-[#166534] font-bold uppercase block">Bankable DPR Status</span>
          <span className="font-bold text-[#166534] text-base">Approved Draft</span>
        </div>
      </div>

      {/* 7-Step Numbered Horizontal Roadmap */}
      <div className="space-y-3 pt-2">
        <h3 className="font-bold text-xs text-[#17211B] uppercase tracking-wider">
          CHRONOLOGICAL EXECUTION SCHEDULE
        </h3>

        <div className="space-y-3">
          {steps.map((s) => (
            <div
              key={s.step}
              className="p-4 rounded-2xl bg-[#F8FBF9] hover:bg-[#E8F5EC] border border-[#D5E1D9] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#15803D] text-white font-mono font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
                  {s.step < 10 ? `0${s.step}` : s.step}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-[#17211B] text-sm font-sans">{s.title}</h4>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FFFFFF] text-[#166534] text-[11px] font-bold border border-[#D5E1D9]">
                      {s.timeline}
                    </span>
                  </div>
                  <p className="text-xs text-[#405048] font-sans mt-0.5 font-medium">{s.desc}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 sm:ml-auto">
                <span className="px-3 py-1 rounded-xl bg-[#FFFFFF] border border-[#D5E1D9] text-[#166534] text-xs font-bold">
                  {s.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
