import React from 'react';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AccessDenied: React.FC<{ requiredRole?: string }> = ({ requiredRole }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getDashboardPath = () => {
    switch (user?.role) {
      case 'government': return '/government';
      case 'soilExpert': return '/expert';
      case 'developer': return '/developer';
      case 'admin': return '/admin';
      case 'farmer': return '/agriculture';
      case 'landowner':
      default: return '/dashboard';
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 font-sans">
      <div className="hud-panel-elevated p-8 rounded-3xl max-w-md w-full text-center space-y-5 border border-red-500/30 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="data-label text-[10px] text-red-400">SECURITY & PRIVACY GATE</span>
          <h2 className="font-display font-black text-2xl text-white">
            Access Restricted
          </h2>
          <p className="text-xs text-slate-400 font-mono leading-relaxed">
            Your authenticated role (<strong>{user?.role?.toUpperCase() || 'GUEST'}</strong>) does not have authorization to view this workspace.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/20 text-xs font-mono text-red-300 text-left space-y-1">
          <p>• Role permission failure logged in security audit trail.</p>
          <p>• Private landowner and administrative records are strictly isolated.</p>
        </div>

        <button
          onClick={() => navigate(getDashboardPath())}
          className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black font-mono text-xs uppercase tracking-wider shadow-hud flex items-center justify-center gap-2 transition-all hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to My Authorized Workspace</span>
        </button>
      </div>
    </div>
  );
};
