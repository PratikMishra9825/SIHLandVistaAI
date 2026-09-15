import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';
import type { CategorySuitability } from '../../types/parcelIntelligence';

interface SuitabilityChartProps {
  rankings: CategorySuitability[];
}

export const SuitabilityChart: React.FC<SuitabilityChartProps> = ({ rankings }) => {
  // Data for BarChart
  const barData = rankings.map((r) => ({
    name: r.category,
    score: r.score,
    fill:
      r.category === 'Solar Farm'
        ? '#15803D'
        : r.category === 'Agriculture'
        ? '#16A34A'
        : r.category === 'Warehouse'
        ? '#2563EB'
        : r.category === 'Commercial'
        ? '#D97706'
        : '#7C3AED'
  }));

  // Data for RadarChart
  const radarData = rankings.map((r) => ({
    subject: r.category,
    Score: r.score,
    fullMark: 100
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 font-sans">
      {/* 1. Comparative Ranking Bar Chart */}
      <div className="p-4 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9] space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-[#17211B]">
          <span>Land Use Suitability Index (0 - 100)</span>
          <span className="text-[#15803D]">Score Benchmark</span>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#64736A' }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#17211B', fontWeight: 600 }} width={85} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#17211B',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}
                formatter={(val: any) => [`${val} / 100`, 'Suitability Score']}
              />
              <Bar dataKey="score" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Multi-Criteria Radar Polygon */}
      <div className="p-4 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9] space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-[#17211B]">
          <span>Radial Multi-Factor Footprint</span>
          <span className="text-[10px] text-[#64736A] uppercase">AI Model Output</span>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} outerRadius="70%">
              <PolarGrid stroke="#D5E1D9" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#17211B', fontWeight: 600 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Suitability" dataKey="Score" stroke="#15803D" fill="#15803D" fillOpacity={0.4} strokeWidth={2} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#17211B',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
