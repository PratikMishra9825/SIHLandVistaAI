import React, { useState } from 'react';
import { 
  Sparkles, 
  Sun, 
  Sprout, 
  Warehouse, 
  Home, 
  Building2, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  ChevronRight
} from 'lucide-react';
import type { LandSuitabilityData, CategorySuitability } from '../../types/parcelIntelligence';
import { SuitabilityChart } from './SuitabilityChart';

interface LandSuitabilityProps {
  suitability: LandSuitabilityData | null;
  isLoading?: boolean;
}

export const LandSuitability: React.FC<LandSuitabilityProps> = ({
  suitability,
  isLoading
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Solar Farm');

  if (isLoading) {
    return (
      <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#D5E1D9] shadow-sm font-sans text-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#15803D] border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-[#405048] font-bold">Computing AI Multi-Criteria Land Suitability Index...</p>
      </div>
    );
  }

  if (!suitability) {
    return null;
  }

  const active =
    suitability.rankings.find((r) => r.category === selectedCategory) ||
    suitability.rankings[0];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Solar Farm':
        return <Sun className="w-5 h-5 text-[#EAB308]" />;
      case 'Agriculture':
        return <Sprout className="w-5 h-5 text-[#15803D]" />;
      case 'Warehouse':
        return <Warehouse className="w-5 h-5 text-[#2563EB]" />;
      case 'Housing':
        return <Home className="w-5 h-5 text-[#7C3AED]" />;
      case 'Commercial':
        return <Building2 className="w-5 h-5 text-[#D97706]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#15803D]" />;
    }
  };

  return (
    <div className="bg-[#FFFFFF] p-5 sm:p-6 rounded-3xl border border-[#D5E1D9] shadow-sm font-sans space-y-6">
      {/* Header & Disclaimer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D5E1D9] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5EC] border border-[#BDE3CC] text-[#166534] text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#15803D]" />
            <span>AI MULTI-CRITERIA SCORING</span>
          </div>
          <h3 className="font-bold text-lg sm:text-xl text-[#17211B]">
            AI Land Suitability & Highest & Best Use Analysis
          </h3>
        </div>

        <div className="p-2.5 bg-[#FEF3C7] rounded-xl border border-[#FDE68A] text-[11px] text-[#92400E] max-w-sm flex items-start gap-2">
          <Info className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
          <span>
            <strong>AI Estimation Notice: </strong>{suitability.disclaimer}
          </span>
        </div>
      </div>

      {/* 5-Category Interactive Cards Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {suitability.rankings.map((cat, idx) => {
          const isSelected = cat.category === selectedCategory;
          return (
            <button
              key={cat.category}
              type="button"
              onClick={() => setSelectedCategory(cat.category)}
              className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden ${
                isSelected
                  ? 'bg-[#E8F5EC] border-[#15803D] shadow-sm scale-[1.02]'
                  : 'bg-[#F8FBF9] border-[#D5E1D9] hover:bg-[#F0F5F1]'
              }`}
            >
              {idx === 0 && (
                <div className="absolute top-0 right-0 bg-[#15803D] text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg uppercase">
                  Rank #1
                </div>
              )}

              <div className="p-2 rounded-xl bg-white border border-[#D5E1D9] w-fit mb-2 shadow-xs">
                {getCategoryIcon(cat.category)}
              </div>

              <h4 className="font-bold text-xs text-[#17211B] truncate">{cat.category}</h4>
              
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-bold text-[#15803D]">{cat.score}</span>
                <span className="text-[10px] text-[#64736A] font-bold">/ 100</span>
              </div>

              <div className="w-full bg-[#D5E1D9] h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-[#15803D] h-full rounded-full transition-all duration-500"
                  style={{ width: `${cat.score}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Category Deep Dive Panel */}
      <div className="bg-[#F8FBF9] p-5 sm:p-6 rounded-2xl border border-[#D5E1D9] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D5E1D9] pb-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-white border border-[#D5E1D9] shadow-xs">
              {getCategoryIcon(active.category)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-base sm:text-lg text-[#17211B]">{active.category} Evaluation</h4>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E8F5EC] text-[#166534] border border-[#BDE3CC]">
                  Score: {active.score}/100
                </span>
              </div>
              <p className="text-xs text-[#405048] font-medium mt-0.5">{active.recommendationNote}</p>
            </div>
          </div>
        </div>

        {/* Factors Breakdown */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-[#17211B] block uppercase tracking-wider">
            Weighted Suitability Drivers & GIS Factors
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {active.factors.map((factor) => (
              <div
                key={factor.name}
                className="p-3.5 bg-white rounded-xl border border-[#D5E1D9] space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#17211B]">{factor.name}</span>
                  <span className="text-[#15803D] font-mono">
                    {factor.score} / {factor.maxScore}
                  </span>
                </div>

                <div className="w-full bg-[#F0F5F1] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#15803D] h-full rounded-full"
                    style={{ width: `${(factor.score / factor.maxScore) * 100}%` }}
                  />
                </div>

                <p className="text-[11px] text-[#64736A] font-medium leading-snug">
                  {factor.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Risks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Strengths */}
          <div className="p-4 bg-white rounded-xl border border-[#D5E1D9] space-y-2">
            <span className="text-xs font-bold text-[#166534] flex items-center gap-1.5 uppercase">
              <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
              <span>Key Advantages & Catalysts</span>
            </span>
            <ul className="space-y-1.5 text-xs text-[#405048]">
              {active.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#15803D] font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Risks & Mitigation */}
          <div className="p-4 bg-white rounded-xl border border-[#D5E1D9] space-y-2">
            <span className="text-xs font-bold text-[#991B1B] flex items-center gap-1.5 uppercase">
              <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
              <span>Project Risks & Constraints</span>
            </span>
            <ul className="space-y-1.5 text-xs text-[#405048]">
              {active.risks.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#DC2626] font-bold">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Comparative Charts Visualizer */}
      <div className="pt-2">
        <SuitabilityChart rankings={suitability.rankings} />
      </div>
    </div>
  );
};
