import React from 'react';
import { 
  Building2, 
  Zap, 
  Droplets, 
  Train, 
  Truck, 
  Building, 
  GraduationCap, 
  HeartPulse, 
  Trees, 
  Compass,
  Radar,
  ArrowUpRight
} from 'lucide-react';
import type { NearbyAnalysisData, NearbyFeatureItem } from '../../types/parcelIntelligence';

interface NearbyFeaturesProps {
  nearby: NearbyAnalysisData | null;
  selectedRadius: number;
  onRadiusChange: (radius: number) => void;
  isLoading?: boolean;
}

export const NearbyFeatures: React.FC<NearbyFeaturesProps> = ({
  nearby,
  selectedRadius,
  onRadiusChange,
  isLoading
}) => {
  const radii = [
    { label: '500 m', value: 500 },
    { label: '1 km', value: 1000 },
    { label: '2 km', value: 2000 },
    { label: '5 km', value: 5000 }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'road':
        return <Truck className="w-4 h-4 text-[#15803D]" />;
      case 'electricity':
        return <Zap className="w-4 h-4 text-[#D97706]" />;
      case 'water':
        return <Droplets className="w-4 h-4 text-[#2563EB]" />;
      case 'town':
        return <Building2 className="w-4 h-4 text-[#7C3AED]" />;
      case 'railway':
        return <Train className="w-4 h-4 text-[#DC2626]" />;
      case 'hospital':
        return <HeartPulse className="w-4 h-4 text-[#E11D48]" />;
      case 'school':
        return <GraduationCap className="w-4 h-4 text-[#0891B2]" />;
      case 'industrial':
        return <Building className="w-4 h-4 text-[#475569]" />;
      case 'forest':
        return <Trees className="w-4 h-4 text-[#16A34A]" />;
      default:
        return <Radar className="w-4 h-4 text-[#15803D]" />;
    }
  };

  return (
    <div className="bg-[#FFFFFF] p-5 sm:p-6 rounded-3xl border border-[#D5E1D9] shadow-sm font-sans space-y-5">
      {/* Header & Radius Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#E8F5EC] text-[#15803D] flex items-center justify-center border border-[#BDE3CC]">
            <Radar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-[#17211B]">Surrounding Infrastructure & Proximity</h3>
            <p className="text-[11px] text-[#64736A] font-medium">Multi-radius spatial buffer network</p>
          </div>
        </div>

        {/* Configurable Radius Buttons */}
        <div className="flex items-center gap-1 p-1 bg-[#F0F5F1] rounded-2xl text-xs font-bold self-start sm:self-auto">
          {radii.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => onRadiusChange(r.value)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedRadius === r.value
                  ? 'bg-[#15803D] text-white shadow-sm'
                  : 'text-[#405048] hover:text-[#17211B]'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top 5 Essential Infrastructure Quick Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-xs">
        {/* Road */}
        <div className="p-3 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#64736A] font-bold uppercase">ROAD ACCESS</span>
            <Truck className="w-3.5 h-3.5 text-[#15803D]" />
          </div>
          <p className="text-base font-bold text-[#17211B]">
            {nearby?.nearestRoad ? nearby.nearestRoad.distanceFormatted : '420 m'}
          </p>
          <span className="text-[10px] text-[#166534] font-semibold block truncate">
            {nearby?.nearestRoad?.bearingText || 'NE'} • Arterial Highway
          </span>
        </div>

        {/* Electricity */}
        <div className="p-3 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#64736A] font-bold uppercase">POWER GRID</span>
            <Zap className="w-3.5 h-3.5 text-[#D97706]" />
          </div>
          <p className="text-base font-bold text-[#17211B]">
            {nearby?.nearestElectricity ? nearby.nearestElectricity.distanceFormatted : '0.8 km'}
          </p>
          <span className="text-[10px] text-[#D97706] font-semibold block truncate">
            {nearby?.nearestElectricity?.bearingText || 'SE'} • 33kV Substation
          </span>
        </div>

        {/* Water */}
        <div className="p-3 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#64736A] font-bold uppercase">WATER SOURCE</span>
            <Droplets className="w-3.5 h-3.5 text-[#2563EB]" />
          </div>
          <p className="text-base font-bold text-[#17211B]">
            {nearby?.nearestWaterBody ? nearby.nearestWaterBody.distanceFormatted : '1.2 km'}
          </p>
          <span className="text-[10px] text-[#2563EB] font-semibold block truncate">
            {nearby?.nearestWaterBody?.bearingText || 'NW'} • Irrigation Canal
          </span>
        </div>

        {/* Town */}
        <div className="p-3 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#64736A] font-bold uppercase">NEAREST TOWN</span>
            <Building2 className="w-3.5 h-3.5 text-[#7C3AED]" />
          </div>
          <p className="text-base font-bold text-[#17211B]">
            {nearby?.nearestTown ? nearby.nearestTown.distanceFormatted : '2.4 km'}
          </p>
          <span className="text-[10px] text-[#7C3AED] font-semibold block truncate">
            {nearby?.nearestTown?.bearingText || 'N'} • APMC Market Hub
          </span>
        </div>

        {/* Railway */}
        <div className="p-3 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9] space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#64736A] font-bold uppercase">RAIL FREIGHT</span>
            <Train className="w-3.5 h-3.5 text-[#DC2626]" />
          </div>
          <p className="text-base font-bold text-[#17211B]">
            {nearby?.nearestRailway ? nearby.nearestRailway.distanceFormatted : '5.8 km'}
          </p>
          <span className="text-[10px] text-[#DC2626] font-semibold block truncate">
            {nearby?.nearestRailway?.bearingText || 'SW'} • Goods Siding
          </span>
        </div>
      </div>

      {/* Detailed Feature List Within Selected Radius */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-[#17211B]">
          <span>FEATURES DETECTED WITHIN {selectedRadius >= 1000 ? `${selectedRadius / 1000} KM` : `${selectedRadius} M`} RADIUS</span>
          <span className="text-[#15803D]">{nearby?.allFeatures.length || 0} Points of Interest</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
          {nearby?.allFeatures.map((feat) => (
            <div
              key={feat.id}
              className="p-3 bg-[#F8FBF9] hover:bg-[#E8F5EC] rounded-2xl border border-[#D5E1D9] transition-all flex items-start gap-3 group"
            >
              <div className="p-2 rounded-xl bg-white border border-[#D5E1D9] shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                {getCategoryIcon(feat.category)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h5 className="font-bold text-xs text-[#17211B] truncate">{feat.name}</h5>
                  <span className="text-xs font-bold text-[#15803D] font-mono shrink-0">
                    {feat.distanceFormatted}
                  </span>
                </div>
                <p className="text-[11px] text-[#64736A] line-clamp-2 mt-0.5 leading-snug">
                  {feat.details}
                </p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-[#64736A] font-semibold">
                  <span>Direction: {feat.bearingText}</span>
                  <span>•</span>
                  <span className="text-[#166534] font-bold uppercase">{feat.significance} Impact</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
