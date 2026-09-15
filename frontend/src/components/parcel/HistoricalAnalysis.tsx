import React from 'react';
import { History, Calendar, CheckCircle2, Leaf, BarChart2, ShieldCheck } from 'lucide-react';

interface HistoricalAnalysisProps {
  district?: string;
  state?: string;
}

export const HistoricalAnalysis: React.FC<HistoricalAnalysisProps> = ({
  district = 'Solapur',
  state = 'Maharashtra'
}) => {
  const timelineData = [
    {
      year: 2026,
      sensor: 'Sentinel-2 Multispectral MSI',
      ndvi: 0.38,
      status: 'Open Fallow / High Solar Irradiance',
      notes: 'No built-up encroachments detected. Clean perimeter parcel with dry soil cover.'
    },
    {
      year: 2024,
      sensor: 'Landsat-9 OLI-2',
      ndvi: 0.42,
      status: 'Seasonal Rainfed Kharif Crop',
      notes: 'Short duration pulses cultivated during monsoon; fallow during post-monsoon and summer.'
    },
    {
      year: 2022,
      sensor: 'Sentinel-2A MSI',
      ndvi: 0.35,
      status: 'Open Semi-Arid Land',
      notes: 'Persistent open land status with stable ground elevation and clear property boundaries.'
    },
    {
      year: 2020,
      sensor: 'Landsat-8 OLI',
      ndvi: 0.39,
      status: 'Agricultural Open Land',
      notes: 'Historical non-flood zone record confirmed with zero inundation traces.'
    }
  ];

  return (
    <div className="bg-[#FFFFFF] p-5 sm:p-6 rounded-3xl border border-[#D5E1D9] shadow-sm font-sans space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#E8F5EC] text-[#15803D] flex items-center justify-center border border-[#BDE3CC]">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-[#17211B]">Multi-Year Satellite Timeline (NDVI)</h3>
            <p className="text-[11px] text-[#64736A] font-medium">Historical remote sensing land persistence (2020 - 2026)</p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#E8F5EC] text-[#166534] border border-[#BDE3CC]">
          100% Clear Title & Non-Encroached
        </span>
      </div>

      <div className="space-y-2.5">
        {timelineData.map((item) => (
          <div
            key={item.year}
            className="p-3.5 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-start gap-3">
              <div className="px-3 py-1.5 rounded-xl bg-white border border-[#D5E1D9] font-bold text-[#15803D] text-sm text-center shrink-0">
                {item.year}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h5 className="font-bold text-xs text-[#17211B]">{item.status}</h5>
                  <span className="text-[10px] text-[#64736A] font-mono">({item.sensor})</span>
                </div>
                <p className="text-[11px] text-[#64736A] leading-snug">{item.notes}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
              <div className="text-right">
                <span className="text-[10px] text-[#64736A] block uppercase font-bold">VEGETATION NDVI</span>
                <span className="text-sm font-bold text-[#166534] font-mono">{item.ndvi.toFixed(2)}</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-[#15803D]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
