import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2, Compass, Sparkles } from 'lucide-react';
import { searchLocations, POPULAR_LOCATION_PRESETS } from '../../services/geocodingService';
import type { SearchLocationResult } from '../../types/parcelIntelligence';

interface LocationSearchProps {
  onSelectLocation: (lat: number, lng: number, name: string) => void;
  currentCoordinates?: { lat: number; lng: number };
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
  onSelectLocation,
  currentCoordinates
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchLocationResult[]>(POPULAR_LOCATION_PRESETS.slice(0, 4));
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults(POPULAR_LOCATION_PRESETS.slice(0, 4));
      return;
    }

    setIsLoading(true);
    const handler = setTimeout(async () => {
      const res = await searchLocations(query);
      setResults(res);
      setIsLoading(false);
      setIsOpen(true);
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: SearchLocationResult) => {
    setQuery(item.shortName);
    setIsOpen(false);
    onSelectLocation(item.lat, item.lng, item.displayName);
  };

  return (
    <div ref={containerRef} className="relative w-full font-sans">
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-[#15803D] pointer-events-none">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#15803D]" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>

        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city, village, address, landmark, or lat,lng..."
          className="w-full pl-10 pr-10 py-2.5 bg-[#FFFFFF] border border-[#D5E1D9] focus:border-[#15803D] focus:ring-2 focus:ring-[#E8F5EC] rounded-2xl text-xs font-semibold text-[#17211B] placeholder-[#64736A] outline-none shadow-sm transition-all"
        />

        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults(POPULAR_LOCATION_PRESETS.slice(0, 4));
            }}
            className="absolute right-3 p-1 rounded-full text-[#64736A] hover:text-[#17211B] hover:bg-[#F8FBF9]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Quick Location Preset Badges */}
      <div className="flex items-center gap-1.5 mt-2 overflow-x-auto no-scrollbar py-0.5">
        <span className="text-[10px] text-[#64736A] font-bold uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#15803D]" /> Presets:
        </span>
        {POPULAR_LOCATION_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handleSelect(preset)}
            className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#F8FBF9] hover:bg-[#E8F5EC] text-[#166534] border border-[#D5E1D9] hover:border-[#15803D] shrink-0 transition-all active:scale-95"
          >
            {preset.shortName.split('(')[0].trim()}
          </button>
        ))}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#FFFFFF] border border-[#D5E1D9] rounded-2xl shadow-lg z-50 overflow-hidden divide-y divide-[#F0F5F1] max-h-64 overflow-y-auto">
          {results.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelect(item)}
              className="w-full px-3.5 py-2.5 text-left flex items-start gap-2.5 hover:bg-[#F8FBF9] transition-colors group"
            >
              <MapPin className="w-4 h-4 text-[#15803D] mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#17211B] truncate">{item.shortName}</span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#E8F5EC] text-[#166534]">
                    {item.type}
                  </span>
                </div>
                <p className="text-[11px] text-[#64736A] truncate mt-0.5">{item.displayName}</p>
                <p className="text-[10px] text-[#15803D] font-mono mt-0.5">
                  {item.lat.toFixed(4)}°N, {item.lng.toFixed(4)}°E
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
