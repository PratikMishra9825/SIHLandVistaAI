import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';
import { 
  Activity, 
  Info, 
  TrendingUp, 
  DollarSign 
} from 'lucide-react';
import { useLand } from '../context/LandContext';
import { DataConfidenceBadge } from './DataConfidenceBadge';

export const WhatIfSimulator: React.FC = () => {
  const { recommendations } = useLand();

  // Chart data preparation
  const comparisonChartData = recommendations.map((rec) => {
    const minInv = rec.economics?.minInvestmentLakhs || 350;
    const maxInv = rec.economics?.maxInvestmentLakhs || 450;
    const annRev = rec.economics?.annualRevenueLakhs || 75;
    const payback = rec.economics?.paybackYears || 4.8;
    const jobs = rec.economics?.jobsCreated || 15;

    return {
      name: rec.useType.toUpperCase(),
      'Investment (₹ L)': Math.round((minInv + maxInv) / 2),
      'Revenue/Yr (₹ L)': annRev,
      'Payback (Yrs)': payback,
      'Jobs': jobs,
    };
  });

  const radarData = [
    { subject: 'Economic ROI', Solar: 91, Warehouse: 93, Agriculture: 78, Housing: 84 },
    { subject: 'Sustainability', Solar: 96, Warehouse: 74, Agriculture: 88, Housing: 71 },
    { subject: 'Social Impact', Solar: 68, Warehouse: 82, Agriculture: 85, Housing: 96 },
    { subject: 'Water Efficiency', Solar: 97, Warehouse: 80, Agriculture: 65, Housing: 50 },
    { subject: 'Low Upfront Cap', Solar: 45, Warehouse: 30, Agriculture: 92, Housing: 20 },
    { subject: 'Regulatory Ease', Solar: 88, Warehouse: 80, Agriculture: 98, Housing: 72 },
  ];

  return (
    <div className="bg-[#FFFFFF] p-6 sm:p-7 rounded-3xl border border-[#D5E1D9] shadow-sm space-y-6 font-sans text-[#17211B]">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D5E1D9] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#15803D]" />
            <h2 className="font-bold text-xl tracking-wide text-[#17211B] uppercase">
              “What-If” Multi-Scenario Simulator
            </h2>
          </div>
          <p className="text-xs text-[#405048] font-medium mt-0.5">
            Compare economic feasibility, resource footprints, and social dividends across potential land futures.
          </p>
        </div>

        <DataConfidenceBadge type="SIMULATION" label="MULTI-SCENARIO ENGINE" />
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr className="border-b border-[#D5E1D9] bg-[#F8FBF9] text-[#17211B]">
              <th className="p-3">DECISION FACTOR</th>
              <th className="p-3 text-[#D97706]">☀️ SOLAR FARM</th>
              <th className="p-3 text-[#0284C7]">📦 WAREHOUSING</th>
              <th className="p-3 text-[#15803D]">🌾 PRECISION AGRI</th>
              <th className="p-3 text-[#6B21A8]">🏠 AFFORDABLE HOUSING</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D5E1D9] text-[#17211B]">
            <tr>
              <td className="p-3 font-sans font-bold text-[#405048]">Initial Est. Investment</td>
              <td className="p-3 font-bold text-[#D97706]">₹350 - 450 Lakhs</td>
              <td className="p-3 font-bold text-[#0284C7]">₹550 - 750 Lakhs</td>
              <td className="p-3 font-bold text-[#15803D]">₹18 - 35 Lakhs</td>
              <td className="p-3 font-bold text-[#6B21A8]">₹1,100 - 1,800 Lakhs</td>
            </tr>
            <tr>
              <td className="p-3 font-sans font-bold text-[#405048]">Annual Gross Revenue</td>
              <td className="p-3 text-[#D97706]">₹65 - 85 Lakhs</td>
              <td className="p-3 text-[#0284C7]">₹120 - 180 Lakhs</td>
              <td className="p-3 text-[#15803D]">₹15 - 28 Lakhs</td>
              <td className="p-3 text-[#6B21A8]">₹220 - 350 Lakhs</td>
            </tr>
            <tr>
              <td className="p-3 font-sans font-bold text-[#405048]">Payback Period</td>
              <td className="p-3 text-[#15803D] font-bold">4.8 - 5.5 Years</td>
              <td className="p-3 text-[#17211B]">5.2 - 6.0 Years</td>
              <td className="p-3 text-[#15803D] font-bold">2.0 - 2.8 Years</td>
              <td className="p-3 text-[#17211B]">6.5 - 8.0 Years</td>
            </tr>
            <tr>
              <td className="p-3 font-sans font-bold text-[#405048]">Water Stress Footprint</td>
              <td className="p-3 text-[#15803D] font-bold">🟢 Ultra-Low</td>
              <td className="p-3 text-[#15803D]">🟢 Low</td>
              <td className="p-3 text-[#D97706] font-bold">🟡 Moderate (Drip)</td>
              <td className="p-3 text-[#991B1B] font-bold">🔴 High (Municipal)</td>
            </tr>
            <tr>
              <td className="p-3 font-sans font-bold text-[#405048]">Government Subsidy Match</td>
              <td className="p-3 font-bold text-[#15803D]">30% PM-KUSUM CFA</td>
              <td className="p-3 font-bold text-[#0284C7]">3% AIF Subvention</td>
              <td className="p-3 font-bold text-[#15803D]">55% PMKSY Drip</td>
              <td className="p-3 font-bold text-[#6B21A8]">PMAY Credit Linked</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
