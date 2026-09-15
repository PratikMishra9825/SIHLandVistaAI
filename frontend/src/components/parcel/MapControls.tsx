import React from 'react';
import { 
  Layers, 
  Satellite, 
  Map as MapIcon, 
  Mountain, 
  Navigation, 
  Plus, 
  Minus, 
  RotateCcw, 
  PenTool, 
  Trash2, 
  Maximize2,
  Box
} from 'lucide-react';
import type { MapStyleMode } from '../../types/parcelIntelligence';

interface MapControlsProps {
  mapStyle: MapStyleMode;
  onStyleChange: (style: MapStyleMode) => void;
  is3DMode: boolean;
  onToggle3D: () => void;
  isDrawing: boolean;
  onToggleDraw: () => void;
  hasPolygon: boolean;
  onClearPolygon: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onGeolocate: () => void;
  onResetView: () => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
  mapStyle,
  onStyleChange,
  is3DMode,
  onToggle3D,
  isDrawing,
  onToggleDraw,
  hasPolygon,
  onClearPolygon,
  onZoomIn,
  onZoomOut,
  onGeolocate,
  onResetView
}) => {
  return (
    <div className="flex flex-col gap-2 font-sans select-none">
      {/* Basemap Style Switcher */}
      <div className="bg-[#FFFFFF]/95 backdrop-blur-md p-1.5 rounded-2xl border border-[#D5E1D9] shadow-md flex items-center gap-1">
        <button
          type="button"
          onClick={() => onStyleChange('satellite')}
          title="Satellite Imagery"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            mapStyle === 'satellite'
              ? 'bg-[#15803D] text-white shadow-sm'
              : 'text-[#405048] hover:bg-[#E8F5EC] hover:text-[#166534]'
          }`}
        >
          <Satellite className="w-3.5 h-3.5" />
          <span>Satellite</span>
        </button>

        <button
          type="button"
          onClick={() => onStyleChange('standard')}
          title="Standard Street Map"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            mapStyle === 'standard'
              ? 'bg-[#15803D] text-white shadow-sm'
              : 'text-[#405048] hover:bg-[#E8F5EC] hover:text-[#166534]'
          }`}
        >
          <MapIcon className="w-3.5 h-3.5" />
          <span>Standard</span>
        </button>

        <button
          type="button"
          onClick={() => onStyleChange('terrain')}
          title="Topographic Terrain"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            mapStyle === 'terrain'
              ? 'bg-[#15803D] text-white shadow-sm'
              : 'text-[#405048] hover:bg-[#E8F5EC] hover:text-[#166534]'
          }`}
        >
          <Mountain className="w-3.5 h-3.5" />
          <span>Terrain</span>
        </button>

        {/* 3D Perspective Tilt Button */}
        <button
          type="button"
          onClick={onToggle3D}
          title="3D Terrain Perspective Angle"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
            is3DMode
              ? 'bg-[#E8F5EC] border-[#15803D] text-[#166534] shadow-inner'
              : 'border-transparent text-[#405048] hover:bg-[#E8F5EC] hover:text-[#166534]'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>3D View</span>
        </button>
      </div>

      {/* Main Drawing & Navigation Toolbar */}
      <div className="flex items-center gap-2">
        {/* Draw Polygon Toggle Button */}
        <button
          type="button"
          onClick={onToggleDraw}
          title={isDrawing ? 'Cancel Drawing' : 'Draw Land Boundary Polygon'}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-md transition-all ${
            isDrawing
              ? 'bg-[#DC2626] hover:bg-[#B91C1C] text-white animate-pulse'
              : 'bg-[#15803D] hover:bg-[#166534] text-white'
          }`}
        >
          <PenTool className="w-4 h-4" />
          <span>{isDrawing ? 'Click Map to Finish Boundary' : 'Draw Parcel Boundary'}</span>
        </button>

        {/* Clear Boundary Button */}
        {hasPolygon && (
          <button
            type="button"
            onClick={onClearPolygon}
            title="Delete & Clear Drawn Parcel"
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-2xl text-xs font-bold bg-[#FFFFFF] hover:bg-[#FEE2E2] text-[#991B1B] border border-[#FECDD3] shadow-md transition-all active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Parcel</span>
          </button>
        )}

        {/* Zoom & Location Stack */}
        <div className="bg-[#FFFFFF]/95 backdrop-blur-md p-1 rounded-2xl border border-[#D5E1D9] shadow-md flex items-center gap-1 ml-auto">
          <button
            type="button"
            onClick={onZoomIn}
            title="Zoom In"
            className="p-2 rounded-xl text-[#17211B] hover:bg-[#E8F5EC] hover:text-[#166534] transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onZoomOut}
            title="Zoom Out"
            className="p-2 rounded-xl text-[#17211B] hover:bg-[#E8F5EC] hover:text-[#166534] transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-4 bg-[#D5E1D9]" />
          <button
            type="button"
            onClick={onGeolocate}
            title="Locate My GPS Position"
            className="p-2 rounded-xl text-[#17211B] hover:bg-[#E8F5EC] hover:text-[#166534] transition-colors"
          >
            <Navigation className="w-4 h-4 text-[#15803D]" />
          </button>
          <button
            type="button"
            onClick={onResetView}
            title="Reset Map View to Solapur"
            className="p-2 rounded-xl text-[#17211B] hover:bg-[#E8F5EC] hover:text-[#166534] transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-[#64736A]" />
          </button>
        </div>
      </div>
    </div>
  );
};
