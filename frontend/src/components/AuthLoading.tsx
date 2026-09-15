import React from 'react';
import { Globe2, Cpu, Database, Sparkles } from 'lucide-react';

export const AuthLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#07090e] flex flex-col items-center justify-center p-6 text-center text-slate-100 font-sans">
      <div className="w-full max-w-md glass-panel-elevated p-8 rounded-3xl border border-emerald-500/30 shadow-2xl space-y-6 animate-pulse">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center mx-auto shadow-glow-emerald">
          <Globe2 className="w-8 h-8 text-white animate-spin" />
        </div>

        <div>
          <h1 className="font-display font-black text-2xl text-white tracking-wide">
            LANDVISTA<span className="text-emerald-400">.AI</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Initializing Land Intelligence & Decision System...
          </p>
        </div>

        <div className="space-y-2.5 text-xs font-mono text-slate-300 text-left bg-slate-900/80 p-4 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>● Authenticating Security Tokens</span>
          </div>
          <div className="flex items-center gap-2 text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>● Connecting to MongoDB Atlas & GIS Layers</span>
          </div>
          <div className="flex items-center gap-2 text-indigo-400">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <span>● Loading Role-Based Workspace</span>
          </div>
        </div>
      </div>
    </div>
  );
};
