import React from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';
import type { AIRecommendation, LandUseType } from '../types/land';
import { useLand } from '../context/LandContext';

interface RecommendationRankProps {
  recommendations?: AIRecommendation[];
  activeType?: LandUseType | 'current';
  onSelect?: (type: LandUseType) => void;
  onExplore3D?: () => void;
}

export const RecommendationRank: React.FC<RecommendationRankProps> = ({
  recommendations: propRecs,
  activeType: propActiveType,
  onSelect: propOnSelect,
  onExplore3D
}) => {
  const { recommendations: contextRecs, activeScenario, setActiveScenario } = useLand();

  const recommendations = propRecs || contextRecs;
  const activeType = propActiveType || activeScenario;
  const onSelect = propOnSelect || setActiveScenario;

  const getIcon = (type: LandUseType) => {
    switch (type) {
      case 'solar': return '☀️';
      case 'warehouse': return '📦';
      case 'agriculture': return '🌱';
      case 'housing': return '🏠';
      case 'commercial': return '🏪';
      case 'industrial': return '🏭';
      case 'agro_processing': return '🌾';
      case 'recreation_park': return '🌲';
      case 'agroforestry': return '🎋';
      case 'public_infra': return '⚡';
      default: return '📍';
    }
  };

  const getRatingBadge = (score: number) => {
    if (score >= 85) return { label: 'Highly Suitable', color: 'bg-[#E8F5EC] text-[#166534] border-[#BDE3CC]' };
    if (score >= 70) return { label: 'Suitable', color: 'bg-[#E8F5EC] text-[#166534] border-[#BDE3CC]' };
    if (score >= 50) return { label: 'Possible', color: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]' };
    return { label: 'Low Suitability', color: 'bg-red-50 text-red-700 border-red-200' };
  };

  return (
    <div className="bg-[#FFFFFF] p-6 sm:p-7 rounded-3xl border border-[#D5E1D9] shadow-sm space-y-4 font-sans text-[#17211B]">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#D5E1D9] pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#15803D]" />
          <span className="font-bold text-xs text-[#17211B] uppercase tracking-wider">
            CANDIDATE RANKING (GIS-MCDA)
          </span>
        </div>
        <span className="text-xs text-[#64736A] font-medium">Click to select scenario</span>
      </div>

      <div className="divide-y divide-[#D5E1D9]">
        {recommendations.slice(0, 5).map((rec, idx) => {
          const isSelected = activeType === rec.useType;
          const rating = getRatingBadge(rec.score);

          return (
            <div
              key={rec.useType || idx}
              onClick={() => onSelect(rec.useType)}
              className={`py-3.5 px-3 rounded-xl transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                isSelected
                  ? 'bg-[#E8F5EC] font-bold text-[#166534]'
                  : 'hover:bg-[#F8FBF9] text-[#17211B]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#F8FBF9] border border-[#D5E1D9] text-xs font-bold flex items-center justify-center text-[#64736A]">
                  #{idx + 1}
                </span>
                <span className="text-base">{getIcon(rec.useType)}</span>
                <span className="font-bold text-sm">
                  {rec.title}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="font-extrabold text-[#15803D]">{rec.score} / 100</span>
                <span className={`px-2.5 py-0.5 rounded-full border font-bold ${rating.color}`}>
                  {rating.label}
                </span>
                <ChevronRight className="w-4 h-4 text-[#64736A]" />
              </div>
            </div>
          );
        })}
      </div>

      {onExplore3D && (
        <div className="pt-2 border-t border-[#D5E1D9]">
          <button
            onClick={onExplore3D}
            className="w-full py-2.5 rounded-2xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Explore 3D Digital Twin</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
