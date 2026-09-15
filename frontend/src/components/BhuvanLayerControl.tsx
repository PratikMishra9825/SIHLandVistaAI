import React from 'react';
import { Satellite, ShieldCheck, Layers, Info, CheckCircle2 } from 'lucide-react';
import { DataConfidenceBadge } from './DataConfidenceBadge';
import { useLand } from '../context/LandContext';
import type { LandParcel } from '../types/land';

interface BhuvanLayerControlProps {
  parcel?: LandParcel;
  activeLayers?: Record<string, boolean>;
  onToggleLayer?: (layerKey: string) => void;
}

export const BhuvanLayerControl: React.FC<BhuvanLayerControlProps> = ({
  parcel: propParcel,
  activeLayers: propActiveLayers,
  onToggleLayer: propOnToggleLayer
}) => {
  const { selectedParcel: contextParcel, activeLayers: contextLayers, toggleLayer: contextToggle } = useLand();

  const parcel = propParcel || contextParcel;
  const activeLayers = propActiveLayers || contextLayers;
  const onToggleLayer = propOnToggleLayer || contextToggle;

  return (
    <div className="bg-[#FFFFFF] p-5 rounded-3xl space-y-3 font-sans border border-[#D5E1D9] shadow-sm text-[#17211B]">
      <div className="flex items-center justify-between border-b border-[#D5E1D9] pb-2.5">
        <div className="flex items-center gap-2">
          <Satellite className="w-4 h-4 text-[#15803D]" />
          <span className="font-bold text-xs tracking-wider text-[#17211B] uppercase font-mono">
            🇮🇳 INDIAN GEOINTELLIGENCE
          </span>
        </div>
        <DataConfidenceBadge type="REMOTE_SENSING" label="ISRO / BHUVAN" />
      </div>

      {/* Sensor Attributes Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-[#F8FBF9] p-3 rounded-2xl border border-[#D5E1D9] space-y-0.5">
          <span className="text-[10px] text-[#64736A] font-bold block uppercase">LULC CLASS</span>
          <p className="text-[#17211B] font-bold truncate text-xs">Agriculture / Scrubland</p>
        </div>

        <div className="bg-[#F8FBF9] p-3 rounded-2xl border border-[#D5E1D9] space-y-0.5">
          <span className="text-[10px] text-[#64736A] font-bold block uppercase">FLOOD RISK</span>
          <p className="text-[#166534] font-bold text-xs flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" /> Low Risk Zone
          </p>
        </div>

        <div className="bg-[#F8FBF9] p-3 rounded-2xl border border-[#D5E1D9] space-y-0.5">
          <span className="text-[10px] text-[#64736A] font-bold block uppercase">DEGRADATION</span>
          <p className="text-[#92400E] font-bold text-xs">Moderate Semi-Arid</p>
        </div>

        <div className="bg-[#F8FBF9] p-3 rounded-2xl border border-[#D5E1D9] space-y-0.5">
          <span className="text-[10px] text-[#64736A] font-bold block uppercase">ELEVATION</span>
          <p className="text-[#17211B] font-bold text-xs">{parcel.infrastructure.elevationMeters}m (Slope: {parcel.infrastructure.slopeDegrees}°)</p>
        </div>
      </div>

      {/* Layer Toggles */}
      <div className="space-y-1.5 pt-2 border-t border-[#D5E1D9]">
        <span className="text-[10px] text-[#64736A] font-bold block uppercase">GIS SATELLITE LAYERS</span>
        <div className="grid grid-cols-3 gap-1.5 text-[11px] font-bold">
          {[
            { key: 'hybridSatellite', label: 'High-Res Hybrid' },
            { key: 'soilHealth', label: 'Soil NPK Heatmap' },
            { key: 'solarIrradiance', label: 'Solar Irradiance' },
            { key: 'substationGrid', label: '33kV Substation' },
            { key: 'highways', label: 'Freight Highway' },
            { key: 'waterCanals', label: 'Water Canal' },
          ].map((layer) => {
            const active = activeLayers[layer.key];
            return (
              <button
                key={layer.key}
                onClick={() => onToggleLayer(layer.key)}
                className={`py-2 px-2 rounded-xl border transition-all text-center truncate font-bold ${
                  active
                    ? 'bg-[#15803D] text-white border-[#15803D] shadow-sm'
                    : 'bg-[#F8FBF9] border-[#D5E1D9] text-[#17211B] hover:bg-[#E8F5EC]'
                }`}
              >
                {layer.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
