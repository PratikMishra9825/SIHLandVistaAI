import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Globe2, 
  MapPin, 
  ChevronDown, 
  User as UserIcon, 
  LogOut, 
  ShieldCheck, 
  Map, 
  HelpCircle, 
  BookOpen 
} from 'lucide-react';
import { useLand } from '../context/LandContext';
import { useAuth } from '../context/AuthContext';
import { HowToUseModal } from './HowToUseModal';

export const Topbar: React.FC = () => {
  const navigate = useNavigate();
  const { parcels, selectedParcel, setSelectedParcel, backendStatus } = useLand();
  const { user, isAuthenticated, logout } = useAuth();

  const [isParcelDropdownOpen, setIsParcelDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const role = user?.role || 'landowner';
  const isDeveloper = role === 'developer';

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/login');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = user?.name ? user.name.split(' ')[0] : 'Pratik';
    if (hour < 12) return `Good morning, ${name}`;
    if (hour < 17) return `Good afternoon, ${name}`;
    return `Good evening, ${name}`;
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full h-16 bg-[#FFFFFF] border-b border-[#D5E1D9] flex items-center justify-between px-4 sm:px-6 shadow-sm font-sans text-[#17211B]">
        
        {/* LEFT: Brand Logo & Context Greeting */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-[#E8F5EC] border border-[#BDE3CC] flex items-center justify-center">
              <Globe2 className="w-4 h-4 text-[#15803D]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base text-[#17211B] tracking-tight">
                LANDVISTA<span className="text-[#15803D]"> AI</span>
              </span>
              <span className="text-[10px] font-semibold text-[#405048] -mt-0.5">
                Land Intelligence Platform
              </span>
            </div>
          </Link>

          {/* User Context Greeting */}
          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-[#D5E1D9]">
            <span className="font-bold text-sm text-[#17211B]">
              {getGreeting()}
            </span>
            <span className="text-xs text-[#405048] font-medium">• {role.toUpperCase()} Console</span>
          </div>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-3">
          
          {/* Active Parcel Selector */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setIsParcelDropdownOpen(!isParcelDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#F8FBF9] hover:bg-[#E8F5EC] border border-[#D5E1D9] text-xs font-semibold transition-all text-[#17211B]"
            >
              <MapPin className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
              <span className="font-bold text-[#17211B] max-w-[180px] truncate">
                {isDeveloper ? `Opportunity ${selectedParcel.district}` : selectedParcel.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#64736A]" />
            </button>

            {isParcelDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-72 bg-[#FFFFFF] p-2 rounded-2xl shadow-lg border border-[#D5E1D9] z-50 space-y-1">
                <span className="text-[11px] font-bold text-[#64736A] px-2 py-1 block uppercase">SWITCH PARCEL</span>
                {parcels.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedParcel(p);
                      setIsParcelDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                      selectedParcel.id === p.id
                        ? 'bg-[#E8F5EC] text-[#166534] font-bold border border-[#BDE3CC]'
                        : 'text-[#17211B] hover:bg-[#F8FBF9]'
                    }`}
                  >
                    <div className="truncate">
                      <p className="font-bold text-[#17211B] truncate">{isDeveloper ? `Opportunity (${p.district})` : p.name}</p>
                      <p className="text-[11px] text-[#405048]">{p.district}, {p.state} • {p.areaAcres} Acres</p>
                    </div>
                    {selectedParcel.id === p.id && <span className="w-2 h-2 rounded-full bg-[#15803D]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8F5EC] border border-[#BDE3CC] text-[#166534]">
            <span className={`w-2 h-2 rounded-full ${backendStatus === 'LIVE_DATABASE' ? 'bg-[#15803D]' : 'bg-[#D97706]'} animate-ping`} />
            <span>DATA ONLINE</span>
          </div>

          {/* Help Button */}
          <button
            onClick={() => setIsHelpOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8FBF9] hover:bg-[#E8F5EC] text-[#17211B] border border-[#D5E1D9] text-xs font-bold transition-all"
            title="Open Contextual Guide"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#15803D]" />
            <span className="hidden sm:inline">GUIDE</span>
            <span className="sm:hidden">?</span>
          </button>

          {/* User Profile / Auth Action */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] hover:border-[#15803D] transition-all text-xs"
              >
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
                  alt={user.name}
                  className="w-6 h-6 rounded-lg bg-[#E8F5EC]"
                />
                <div className="hidden lg:flex flex-col text-left">
                  <span className="font-bold text-[#17211B] leading-none text-xs truncate max-w-[90px]">{user.name.split(' ')[0]}</span>
                </div>
                <ChevronDown className="w-3 h-3 text-[#64736A]" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#FFFFFF] p-3 rounded-2xl shadow-xl border border-[#D5E1D9] z-50 space-y-2.5">
                  <div className="p-1 border-b border-[#D5E1D9] space-y-0.5">
                    <p className="font-bold text-[#17211B] text-sm">{user.name}</p>
                    <p className="text-xs text-[#405048] truncate">{user.email}</p>
                    <span className="px-2 py-0.5 rounded-full bg-[#E8F5EC] text-[#166534] text-[10px] font-bold uppercase inline-block mt-1">
                      {role}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs font-semibold">
                    <Link
                      to="/dashboard"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-xl hover:bg-[#E8F5EC] text-[#17211B]"
                    >
                      <Map className="w-3.5 h-3.5 text-[#15803D]" />
                      <span>My Workspace</span>
                    </Link>
                    <Link
                      to="/guide"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-xl hover:bg-[#E8F5EC] text-[#17211B]"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#15803D]" />
                      <span>Role User Guide</span>
                    </Link>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-[#E8F5EC] text-[#17211B] text-left"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
                      <span>Switch Role</span>
                    </button>
                  </div>

                  <div className="border-t border-[#D5E1D9] pt-1.5">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-between p-2 rounded-xl bg-[#FEE2E2] hover:bg-[#FECDD3] border border-[#FECDD3] text-[#991B1B] text-xs font-bold transition-all"
                    >
                      <span>Logout</span>
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold transition-all shadow-sm"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </header>

      {/* Interactive Contextual Modal */}
      <HowToUseModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  );
};
