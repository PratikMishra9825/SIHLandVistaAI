import React from 'react';
import { 
  Layers, 
  MapPin, 
  Droplets, 
  Building2, 
  Sparkles, 
  History, 
  Box,
  Compass,
  CheckCircle2,
  Mountain
} from 'lucide-react';

export type SidebarTabType = 
  | 'overview' 
  | 'location' 
  | 'soil_water' 
  | 'infrastructure' 
  | 'land_analysis' 
  | 'history' 
  | 'simulation_3d';

interface AnalysisSidebarProps {
  activeTab: SidebarTabType;
  onTabChange: (tab: SidebarTabType) => void;
  hasParcel: boolean;
}

export const AnalysisSidebar: React.FC<AnalysisSidebarProps> = ({
  activeTab,
  onTabChange,
  hasParcel
}) => {
  const tabs = [
    { id: 'overview' as SidebarTabType, label: 'Overview', icon: <Layers className="w-4 h-4" /> },
    { id: 'location' as SidebarTabType, label: 'Location & Search', icon: <MapPin className="w-4 h-4" /> },
    { id: 'soil_water' as SidebarTabType, label: 'Soil & Water', icon: <Droplets className="w-4 h-4" /> },
    { id: 'infrastructure' as SidebarTabType, label: 'Infrastructure', icon: <Building2 className="w-4 h-4" /> },
    { id: 'land_analysis' as SidebarTabType, label: 'Suitability AI', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'history' as SidebarTabType, label: 'Satellite History', icon: <History className="w-4 h-4" /> },
    { id: 'simulation_3d' as SidebarTabType, label: '3D Simulation', icon: <Box className="w-4 h-4" /> }
  ];

  return (
    <div className="bg-[#FFFFFF] p-3 rounded-3xl border border-[#D5E1D9] shadow-sm font-sans space-y-1">
      <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#64736A] flex items-center justify-between">
        <span>GIS INTELLIGENCE MODULES</span>
        {hasParcel && (
          <span className="flex items-center gap-1 text-[#15803D]">
            <CheckCircle2 className="w-3 h-3" /> Active
          </span>
        )}
      </div>

      <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto no-scrollbar py-1 lg:py-0">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-left transition-all shrink-0 lg:w-full ${
                isActive
                  ? 'bg-[#E8F5EC] text-[#166534] border border-[#BDE3CC] shadow-xs'
                  : 'text-[#405048] hover:bg-[#F8FBF9] hover:text-[#17211B] border border-transparent'
              }`}
            >
              <div className={`p-1.5 rounded-xl ${isActive ? 'bg-white text-[#15803D]' : 'bg-[#F8FBF9] text-[#64736A]'}`}>
                {tab.icon}
              </div>
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
