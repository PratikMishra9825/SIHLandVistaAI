import React from 'react';
import { 
  Mountain, 
  TrendingUp, 
  Compass, 
  Sparkles, 
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import type { TerrainAnalysisData } from '../../types/parcelIntelligence';
import { getSlopeBadgeInfo } from '../../services/terrainService';

interface ElevationAnalysisProps {
  terrain: TerrainAnalysisData | null;
  isLoading?: boolean;
}

export const ElevationAnalysis: React.FC<ElevationAnalysisProps> = ({
  terrain,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#D5E1D9] shadow-sm font-sans text-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#15803D] border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-[#405048] font-bold">Querying Digital Elevation Model (DEM) & Slope Profile...</p>
      </div>
    );
  }

  if (!terrain || terrain.status === 'UNAVAILABLE') {
    return (
      <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#D5E1D9] shadow-sm font-sans text-center space-y-2">
        <AlertCircle className="w-6 h-6 text-[#D97706] mx-auto" />
        <h4 className="text-sm font-bold text-[#17211B]">Elevation Data Unavailable</h4>
        <p className="text-xs text-[#64736A]">Please select or draw a closed land boundary on the map.</p>
      </div>
    );
  }

  const slopeBadge = getSlopeBadgeInfo(terrain.averageSlopeDegrees);

  // Prepare chart data from elevation profile
  const chartData = terrain.elevationProfile.map((sample, idx) => ({
    name: sample.pointName || `P${idx + 1}`,
    distance: `${sample.distanceMeters}m`,
    elevation: sample.elevationMeters
  }));

  const minChartElevation = Math.max(0, Math.floor(terrain.minElevation - 5));

  return (
    <div className="bg-[#FFFFFF] p-5 sm:p-6 rounded-3xl border border-[#D5E1D9] shadow-sm font-sans space-y-5">
      {/* Title & Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#E8F5EC] text-[#15803D] flex items-center justify-center border border-[#BDE3CC]">
            <Mountain className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-[#17211B]">Terrain & Elevation Profile</h3>
            <p className="text-[11px] text-[#64736A] font-medium">{terrain.sourceDescription}</p>
          </div>
        </div>

        <span
          className="px-2.5 py-1 rounded-full text-xs font-bold border"
          style={{ backgroundColor: slopeBadge.bg, color: slopeBadge.color, borderColor: '#BDE3CC' }}
        >
          {terrain.terrainClassification}
        </span>
      </div>

      {/* Grid of Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="p-3 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9] text-center">
          <span className="text-[10px] text-[#64736A] font-bold uppercase block">AVG ELEVATION</span>
          <span className="text-base font-bold text-[#15803D]">{terrain.averageElevation} m</span>
          <span className="text-[10px] text-[#405048] block">Above Sea Level</span>
        </div>

        <div className="p-3 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9] text-center">
          <span className="text-[10px] text-[#64736A] font-bold uppercase block">MIN / MAX</span>
          <span className="text-base font-bold text-[#17211B]">{terrain.minElevation} - {terrain.maxElevation} m</span>
          <span className="text-[10px] text-[#405048] block">Span: {terrain.elevationDifference}m</span>
        </div>

        <div className="p-3 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9] text-center">
          <span className="text-[10px] text-[#64736A] font-bold uppercase block">AVERAGE SLOPE</span>
          <span className="text-base font-bold text-[#17211B]">{terrain.averageSlopeDegrees}°</span>
          <span className="text-[10px] text-[#405048] block">Incline Angle</span>
        </div>

        <div className="p-3 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9] text-center">
          <span className="text-[10px] text-[#64736A] font-bold uppercase block">SOLAR ASPEC</span>
          <span className="text-xs font-bold text-[#166534] truncate block mt-0.5" title={terrain.aspectOrientation}>
            {terrain.aspectOrientation.split('(')[0]}
          </span>
          <span className="text-[10px] text-[#405048] block">Natural Gradient</span>
        </div>
      </div>

      {/* Recharts Elevation Profile Visualizer */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-[#17211B]">
          <span className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#15803D]" />
            <span>Topographic Cross-Section Profile (Transect)</span>
          </span>
          <span className="text-[11px] font-mono text-[#64736A]">Elevation (m MSL)</span>
        </div>

        <div className="h-44 w-full bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9] p-2.5">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#15803D" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#15803D" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="distance" tick={{ fontSize: 10, fill: '#64736A' }} />
              <YAxis domain={[minChartElevation, 'auto']} tick={{ fontSize: 10, fill: '#64736A' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#17211B',
                  borderRadius: '12px',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}
                formatter={(value: any) => [`${value} m MSL`, 'Elevation']}
              />
              <Area
                type="monotone"
                dataKey="elevation"
                stroke="#15803D"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#elevationGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Aspect & Grading Insight Note */}
      <div className="p-3.5 bg-[#E8F5EC] rounded-2xl border border-[#BDE3CC] text-xs text-[#166534] flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-[#15803D]" />
        <div>
          <span className="font-bold">Grading Assessment: </span>
          <span>
            {terrain.averageSlopeDegrees <= 4.0
              ? 'Excellent flat-to-gentle slope topology. Minimal civil grading required for ground-mounted solar tracker arrays or industrial warehouse plinths.'
              : 'Moderate terrain gradient detected. Suitable for terraced agriculture or fixed-tilt solar racking with localized contour grading.'}
          </span>
        </div>
      </div>
    </div>
  );
};
