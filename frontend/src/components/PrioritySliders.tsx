import React, { useState } from 'react';
import { 
  Sliders, 
  DollarSign, 
  Leaf, 
  Droplets, 
  Users, 
  Zap, 
  TrendingUp, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useLand } from '../context/LandContext';
import { DataConfidenceBadge } from './DataConfidenceBadge';
import type { ScenarioPreset } from '../types/land';

export const PrioritySliders: React.FC = () => {
  const { userPriorities, updatePriority, applyPreset } = useLand();
  const [activePreset, setActivePreset] = useState<ScenarioPreset>('balanced');

  const presets: { id: ScenarioPreset; label: string }[] = [
    { id: 'balanced', label: '⚖️ Balanced' },
    { id: 'profit', label: '💰 Profit Mode' },
    { id: 'green', label: '🌿 Green Mode' },
    { id: 'social', label: '👥 Social Mode' },
    { id: 'low_investment', label: '🛡️ Low Cap' },
  ];

  const handlePreset = (preset: ScenarioPreset) => {
    setActivePreset(preset);
    applyPreset(preset);
  };

  const sliderFields = [
    { key: 'profitability', label: 'Profitability & ROI', icon: DollarSign, color: 'text-amber-400', accent: 'accent-amber-400' },
    { key: 'sustainability', label: 'Sustainability & Carbon', icon: Leaf, color: 'text-emerald-400', accent: 'accent-emerald-400' },
    { key: 'waterEfficiency', label: 'Water Conservation', icon: Droplets, color: 'text-cyan-400', accent: 'accent-cyan-400' },
    { key: 'socialImpact', label: 'Social & Civic Impact', icon: Users, color: 'text-pink-400', accent: 'accent-pink-400' },
  ] as const;

  return (
    <div className="hud-panel p-5 rounded-2xl border border-white/10 shadow-2xl flex flex-col gap-4 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-xs tracking-wider text-white uppercase flex items-center gap-1.5">
              AI Strategy & Priority Sliders
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Dynamically re-ranks land use options in real time.
            </p>
          </div>
        </div>

        {/* Preset Buttons */}
        <div className="flex flex-wrap items-center gap-1 bg-command-surface p-1 rounded-xl border border-white/5 font-mono text-xs">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => handlePreset(p.id)}
              className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold transition-all ${
                activePreset === p.id
                  ? 'bg-emerald-500 text-slate-950 shadow-hud-glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
        {sliderFields.map((field) => {
          const Icon = field.icon;
          const val = userPriorities[field.key];
          return (
            <div key={field.key} className="bg-command-surface p-3 rounded-xl border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium font-sans">
                  <Icon className={`w-3.5 h-3.5 ${field.color}`} />
                  {field.label}
                </span>
                <span className={`font-mono font-bold ${field.color}`}>
                  {val}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={val}
                onChange={(e) => updatePriority(field.key, Number(e.target.value))}
                className={`w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer ${field.accent}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
