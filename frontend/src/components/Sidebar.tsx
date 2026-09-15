import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Globe2, 
  Map, 
  Building2, 
  Sprout, 
  FlaskConical, 
  Landmark, 
  TrendingUp, 
  Users, 
  PlusCircle, 
  Sparkles, 
  MessageSquare, 
  ChevronLeft, 
  ChevronRight, 
  Compass, 
  HelpCircle, 
  ShieldAlert, 
  UserCheck, 
  Building, 
  FileSpreadsheet, 
  LogOut, 
  Layers 
} from 'lucide-react';
import { useLand } from '../context/LandContext';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { startSihDemo, setIsChatOpen, isChatOpen } = useLand();
  const { user, logout } = useAuth();

  const role = user?.role || 'landowner';

  const getNavLinks = () => {
    switch (role) {
      case 'government':
        return [
          { name: 'Regional Land Bank', path: '/government', icon: Building2 },
          { name: 'Regional Planning GIS', path: '/dashboard', icon: Map },
          { name: 'Public Infrastructure', path: '/future-potential', icon: TrendingUp },
          { name: 'Government Schemes', path: '/schemes', icon: Landmark },
          { name: 'Gov User Guide', path: '/guide', icon: HelpCircle },
        ];
      case 'soilExpert':
        return [
          { name: 'Assigned Field Visits', path: '/expert', icon: UserCheck },
          { name: 'Assigned Field Map', path: '/dashboard', icon: Map },
          { name: 'Soil & Water Lab', path: '/soil-water', icon: FlaskConical },
          { name: 'Crop Intelligence', path: '/agriculture', icon: Sprout },
          { name: 'Expert User Guide', path: '/guide', icon: HelpCircle },
        ];
      case 'developer':
        return [
          { name: 'Opportunity Marketplace', path: '/developer', icon: Building },
          { name: 'Site Intelligence Map', path: '/dashboard', icon: Map },
          { name: 'Future Corridors', path: '/future-potential', icon: TrendingUp },
          { name: 'Government Incentives', path: '/schemes', icon: Landmark },
          { name: 'Investor Guide', path: '/guide', icon: HelpCircle },
        ];
      case 'admin':
        return [
          { name: 'Platform Admin', path: '/admin', icon: ShieldAlert },
          { name: 'Gov Land Bank', path: '/government', icon: Building2 },
          { name: 'Expert Field Ops', path: '/expert', icon: UserCheck },
          { name: 'Developer Suite', path: '/developer', icon: Building },
          { name: 'GIS Command Console', path: '/dashboard', icon: Map },
          { name: 'Scheme Database', path: '/schemes', icon: Landmark },
          { name: 'Admin Guide', path: '/guide', icon: HelpCircle },
        ];
      case 'landowner':
      case 'farmer':
      default:
        return [
          { name: 'Register New Land', path: '/onboarding', icon: PlusCircle },
          { name: 'Land Intelligence Dossier', path: '/dashboard', icon: Sparkles },
          { name: 'Expert Land Checkup', path: '/expert-checkup', icon: UserCheck },
          { name: 'Premium Plans', path: '/pricing', icon: Sparkles },
          { name: 'Government Schemes', path: '/schemes', icon: Landmark },
          { name: 'Future Development', path: '/future-potential', icon: TrendingUp },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <aside
      className={`fixed top-16 bottom-0 left-0 z-30 bg-[#FFFFFF] border-r border-[#D5E1D9] transition-all duration-300 flex flex-col justify-between shadow-sm ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top Section */}
      <div className="py-4 px-3 space-y-3">
        
        {/* Brand Header */}
        <div className="px-2 flex items-center justify-between border-b border-[#D5E1D9] pb-3">
          {!isCollapsed ? (
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-[#17211B] tracking-tight">
                  LANDVISTA<span className="text-[#15803D]"> AI</span>
                </span>
              </div>
              <p className="text-xs font-semibold text-[#405048]">
                Land Intelligence Platform
              </p>
            </div>
          ) : (
            <Globe2 className="w-5 h-5 text-[#15803D] mx-auto" />
          )}

          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-[#64736A] hover:text-[#17211B] hover:bg-[#E8F5EC] transition-all"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Role Badge Indicator */}
        {!isCollapsed && (
          <div className="px-2">
            <span className="px-3 py-1.5 rounded-xl bg-[#E8F5EC] text-[#166534] border border-[#BDE3CC] text-[11px] font-mono font-bold block uppercase tracking-wider text-center">
              {role.toUpperCase()} WORKSPACE
            </span>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="space-y-1 pt-1">
          {navLinks.map((link, idx) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;

            return (
              <NavLink
                key={`${link.path}-${idx}`}
                to={link.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#E8F5EC] text-[#166534] border-l-4 border-[#15803D] font-bold shadow-sm'
                    : 'text-[#17211B] hover:text-[#166534] hover:bg-[#F8FBF9] border-l-4 border-transparent'
                }`}
                title={isCollapsed ? link.name : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#15803D]' : 'text-[#64736A]'}`} />
                {!isCollapsed && <span className="truncate">{link.name}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-3 space-y-2 border-t border-[#D5E1D9] bg-[#F8FBF9]">
        
        {/* Help & User Guide Link */}
        <NavLink
          to="/guide"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#17211B] hover:text-[#166534] hover:bg-[#E8F5EC] text-sm font-semibold transition-all"
        >
          <HelpCircle className="w-4 h-4 text-[#15803D] shrink-0" />
          {!isCollapsed && <span>Help & User Guide</span>}
        </NavLink>

        {/* AI Assistant Drawer Toggle */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#17211B] hover:text-[#166534] hover:bg-[#E8F5EC] text-sm font-semibold transition-all text-left"
        >
          <MessageSquare className="w-4 h-4 text-[#15803D] shrink-0" />
          {!isCollapsed && <span>AI Copilot Chat</span>}
        </button>

        {/* Run SIH Demo Button */}
        <button
          onClick={startSihDemo}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs shadow-sm transition-all"
        >
          <Sparkles className="w-4 h-4 shrink-0 fill-white" />
          {!isCollapsed && <span className="font-mono">RUN SIH DEMO</span>}
        </button>

        {/* Logout Button */}
        {user && (
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[#991B1B] hover:bg-[#FEE2E2] text-xs font-mono font-bold transition-all border border-[#FECDD3]"
          >
            {!isCollapsed && <span>Logout</span>}
            <LogOut className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </aside>
  );
};
