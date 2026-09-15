import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Globe2, 
  Map, 
  Sprout, 
  FlaskConical, 
  Landmark, 
  TrendingUp, 
  Building2, 
  PlusCircle, 
  Sparkles,
  User as UserIcon,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Play
} from 'lucide-react';
import { useLand } from '../context/LandContext';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { startSihDemo, backendStatus } = useLand();
  const { user, isAuthenticated, logout } = useAuth();

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navLinks = [
    { name: 'Overview', path: '/' },
    { name: 'GIS & 3D Dashboard', path: '/dashboard', icon: Map },
    { name: 'Gov Prioritisation', path: '/government', icon: Building2 },
    { name: 'Schemes Matcher', path: '/schemes', icon: Landmark },
    { name: 'Agriculture Hub', path: '/agriculture', icon: Sprout },
    { name: 'Soil & Water', path: '/soil-water', icon: FlaskConical },
    { name: 'Future Predictor', path: '/future-potential', icon: TrendingUp },
  ];

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/login');
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'government':
        return <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-mono">🏛️ Gov Authority</span>;
      case 'soilExpert':
        return <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono">👨‍🔬 Soil Expert</span>;
      case 'farmer':
        return <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono">🌾 Farmer</span>;
      case 'developer':
        return <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-mono">🏢 Developer</span>;
      case 'landowner':
      default:
        return <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono">👤 Landowner</span>;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 glass-panel bg-slate-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 p-0.5 shadow-glow-emerald group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Globe2 className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-lg tracking-wider text-white">
                LANDVISTA<span className="text-emerald-400">.AI</span>
              </span>
              <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-semibold">
                SIH 2026
              </span>
            </div>
            <span className="text-[9px] font-mono text-slate-400 tracking-tighter uppercase">
              Smart Land Decision Platform
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-glow-emerald font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Status Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono border bg-slate-900/80 border-emerald-500/30 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>{backendStatus === 'LIVE_DATABASE' ? '🟢 LIVE MONGODB' : '🟡 DEMO MODE'}</span>
          </div>

          {/* 🎯 Run SIH Demo Button */}
          <button
            onClick={startSihDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-glow-amber transition-all hover:scale-105 active:scale-95"
            title="Launch automated 9-scene SIH demonstration for judges"
          >
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            <span className="hidden sm:inline">RUN SIH DEMO</span>
            <span className="sm:hidden">DEMO</span>
          </button>

          {/* Register Land CTA */}
          <Link
            to="/onboarding"
            className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-glow-emerald transition-all hover:scale-105 active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Analyze Land</span>
          </Link>

          {/* User Profile / Auth Button */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 pl-2 rounded-xl bg-slate-900 border border-white/10 hover:border-emerald-500/40 transition-all text-xs"
              >
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
                  alt={user.name}
                  className="w-7 h-7 rounded-lg bg-slate-800"
                />
                <div className="hidden lg:flex flex-col text-left">
                  <span className="font-bold text-white leading-none text-xs">{user.name.split(' ')[0]}</span>
                  <span className="text-[10px] text-slate-400 capitalize">{user.role}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 glass-panel-elevated p-3 rounded-2xl border border-white/15 shadow-2xl space-y-3 bg-slate-950 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-2 border-b border-white/10 space-y-1">
                    <p className="font-bold text-white text-xs">{user.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{user.email}</p>
                    <div className="pt-1">{getRoleBadge(user.role)}</div>
                  </div>

                  <div className="space-y-1 text-xs font-mono">
                    <Link
                      to="/dashboard"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 text-slate-300 hover:text-white"
                    >
                      <Map className="w-3.5 h-3.5 text-emerald-400" />
                      <span>My Land Parcels</span>
                    </Link>
                    <Link
                      to="/onboarding"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 text-slate-300 hover:text-white"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Register New Land</span>
                    </Link>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 text-slate-300 hover:text-white text-left"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                      <span>Switch Account / Role</span>
                    </button>
                  </div>

                  <div className="border-t border-white/10 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-between p-2 rounded-lg bg-red-950/40 hover:bg-red-950/80 border border-red-500/30 text-red-300 text-xs font-mono font-bold transition-all"
                    >
                      <span>Secure Logout</span>
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 hover:border-emerald-500/40 text-xs font-mono font-bold transition-all"
            >
              <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
