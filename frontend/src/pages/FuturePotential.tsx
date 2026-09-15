import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Compass, 
  MapPin, 
  Layers, 
  Route, 
  Zap, 
  Droplets, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Calendar, 
  ShieldCheck, 
  ExternalLink,
  Milestone,
  HelpCircle
} from 'lucide-react';
import { useLand } from '../context/LandContext';
import { analyzeLocationInfrastructure, type VerifiedInfrastructureItem, type InfrastructureStatus } from '../services/infrastructureCorridorService';

export const FuturePotential: React.FC = () => {
  const { selectedParcel } = useLand();
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);

  // Compute location-specific real infrastructure assessment
  const assessment = analyzeLocationInfrastructure(selectedParcel);

  // Status Badge Colors & Labels
  const getStatusBadge = (status: InfrastructureStatus) => {
    switch (status) {
      case 'EXISTING':
        return {
          label: 'EXISTING OPERATIONAL',
          bg: 'bg-[#E8F5EC] text-[#15803D] border-[#BDE3CC]'
        };
      case 'UNDER_CONSTRUCTION':
        return {
          label: 'UNDER CONSTRUCTION',
          bg: 'bg-blue-50 text-blue-800 border-blue-200'
        };
      case 'PLANNED':
        return {
          label: 'OFFICIALLY PLANNED',
          bg: 'bg-amber-50 text-amber-800 border-amber-200'
        };
      case 'PROPOSED':
        return {
          label: 'PROPOSED IN MASTER PLAN',
          bg: 'bg-purple-50 text-purple-800 border-purple-200'
        };
      default:
        return {
          label: 'DATA UNAVAILABLE',
          bg: 'bg-gray-100 text-gray-700 border-gray-200'
        };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Transport & Highway':
        return Route;
      case 'Power Grid & Substation':
        return Zap;
      case 'Water Resource':
        return Droplets;
      case 'Rail & Freight':
        return Milestone;
      default:
        return Building2;
    }
  };

  // Initialize Satellite Infrastructure Preview Map
  useEffect(() => {
    if (!mapRef.current) return;

    if (!leafletMapRef.current) {
      const map = L.map(mapRef.current, {
        center: [selectedParcel.lat, selectedParcel.lng],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // High-resolution satellite imagery
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18
      }).addTo(map);

      leafletMapRef.current = map;
    }

    const map = leafletMapRef.current;
    if (!map) return;

    map.setView([selectedParcel.lat, selectedParcel.lng], 13);

    // Clear previous vector layers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polygon || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    // Custom Parcel Marker
    const parcelIcon = L.divIcon({
      className: 'parcel-pin',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-8 h-8 rounded-full bg-emerald-500/40 animate-ping absolute"></div>
          <div class="w-7 h-7 rounded-full bg-[#15803D] border-2 border-white flex items-center justify-center shadow-lg text-white text-xs font-bold">
            📍
          </div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    L.marker([selectedParcel.lat, selectedParcel.lng], { icon: parcelIcon })
      .bindPopup(`<strong>${selectedParcel.name}</strong><br/>${selectedParcel.areaAcres} Acres`)
      .addTo(map);

    // Draw user polygon if available
    if (selectedParcel.boundaryCoordinates && selectedParcel.boundaryCoordinates.length >= 3) {
      L.polygon(selectedParcel.boundaryCoordinates, {
        color: '#15803D',
        weight: 3,
        fillColor: '#22C55E',
        fillOpacity: 0.25
      }).addTo(map);
    }

    // Plot verified infrastructure nodes & corridors
    const allItems = [...assessment.existingInfrastructure, ...assessment.upcomingProjects];
    allItems.forEach((item) => {
      const isFuture = item.isFutureProject;
      const markerColor = isFuture ? '#4F46E5' : '#D97706';

      const nodeIcon = L.divIcon({
        className: 'infra-node-pin',
        html: `
          <div class="px-2 py-0.5 rounded-md text-[10px] font-extrabold text-white flex items-center gap-1 shadow-md border border-white" style="background-color: ${markerColor}">
            ${item.distanceKm} km • ${item.name.substring(0, 18)}...
          </div>
        `,
        iconSize: [120, 22],
        iconAnchor: [60, 11]
      });

      L.marker(item.coordinates, { icon: nodeIcon })
        .bindPopup(`
          <div class="text-xs font-sans">
            <strong class="text-slate-900">${item.name}</strong>
            <p class="text-slate-600 mt-0.5">${item.description}</p>
            <p class="text-emerald-700 font-bold mt-1">Distance: ${item.distanceKm} km from parcel</p>
          </div>
        `)
        .addTo(map);

      // Connecting distance line
      L.polyline([[selectedParcel.lat, selectedParcel.lng], item.coordinates], {
        color: markerColor,
        weight: 1.5,
        dashArray: '4, 4',
        opacity: 0.6
      }).addTo(map);
    });

  }, [selectedParcel, assessment]);

  return (
    <div className="space-y-6 pb-16 font-sans text-[#17211B] max-w-7xl mx-auto">
      
      {/* -----------------------------------------------------------
          1. HEADER: FUTURE DEVELOPMENT & LAND POTENTIAL
      ----------------------------------------------------------- */}
      <div className="bg-[#FFFFFF] p-6 sm:p-7 rounded-3xl border border-[#D5E1D9] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F5EC] border border-[#BDE3CC] flex items-center justify-center text-[#15803D] shrink-0">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-extrabold font-mono text-[#166534] uppercase tracking-wider">
                REAL GEOSPATIAL INFRASTRUCTURE INTELLIGENCE
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#E8F5EC] text-[#15803D] text-[10px] font-bold border border-[#BDE3CC]">
                ✓ Verified Sources Only
              </span>
            </div>
            <h1 className="font-extrabold text-2xl text-[#17211B] tracking-tight">
              Future Development & Land Potential
            </h1>
            <p className="text-xs sm:text-sm text-[#526358] font-medium">
              Location-specific infrastructure analysis for <strong>{selectedParcel.name}</strong> ({selectedParcel.district}, {selectedParcel.state})
            </p>
          </div>
        </div>

        {/* Telemetry Snapshot */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="p-2.5 bg-[#F8FBF9] rounded-xl border border-[#D5E1D9] text-center">
            <span className="text-[9px] font-bold text-[#64736A] uppercase block">Analysis Buffer</span>
            <span className="font-extrabold text-xs text-[#17211B]">30 km Cadastre</span>
          </div>
          <div className="p-2.5 bg-[#F8FBF9] rounded-xl border border-[#D5E1D9] text-center">
            <span className="text-[9px] font-bold text-[#64736A] uppercase block">Existing Nodes</span>
            <span className="font-extrabold text-xs text-[#15803D]">{assessment.existingInfrastructure.length} Detected</span>
          </div>
          <div className="p-2.5 bg-[#F8FBF9] rounded-xl border border-[#D5E1D9] text-center">
            <span className="text-[9px] font-bold text-[#64736A] uppercase block">Verified Corridors</span>
            <span className="font-extrabold text-xs text-[#17211B]">{assessment.verifiedUpcomingProjectsCount} Active</span>
          </div>
        </div>
      </div>

      {/* -----------------------------------------------------------
          2. SATELLITE CADASTRE & INFRASTRUCTURE MAP VIEWPORT
      ----------------------------------------------------------- */}
      <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#D5E1D9] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D5E1D9] pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#15803D]" />
            <h3 className="font-extrabold text-base text-[#17211B]">
              Satellite Infrastructure Vector Map
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-[#64736A]">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-[#15803D]"></span> Confirmed Land
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-[#D97706]"></span> Existing Infra
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-[#4F46E5]"></span> Verified Corridor
            </span>
          </div>
        </div>

        <div className="relative w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden border border-[#D5E1D9]">
          <div ref={mapRef} className="w-full h-full z-0" />
        </div>
      </div>

      {/* -----------------------------------------------------------
          3. EXISTING SURROUNDING INFRASTRUCTURE
      ----------------------------------------------------------- */}
      <div className="bg-[#FFFFFF] p-6 sm:p-7 rounded-3xl border border-[#D5E1D9] shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-[#D5E1D9] pb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base text-[#17211B]">1.</span>
            <h3 className="font-extrabold text-base text-[#17211B]">
              NEARBY EXISTING INFRASTRUCTURE (GROUND TRUTH)
            </h3>
          </div>
          <span className="text-xs font-bold text-[#64736A]">
            {assessment.existingInfrastructure.length} Operational Facilities
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assessment.existingInfrastructure.map((item) => {
            const Icon = getCategoryIcon(item.category);
            const badge = getStatusBadge(item.status);

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-[#F8FBF9] border border-[#D5E1D9] space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#FFFFFF] border border-[#D5E1D9] text-[#15803D] flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-[#17211B]">{item.name}</h4>
                        <span className="text-[11px] text-[#64736A] font-semibold">{item.category}</span>
                      </div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border shrink-0 ${badge.bg}`}>
                      {badge.label}
                    </span>
                  </div>

                  <p className="text-xs text-[#526358] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Impact on Your Land & Verification Metadata */}
                <div className="space-y-2 pt-2 border-t border-[#D5E1D9]">
                  <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#D5E1D9] text-xs">
                    <span className="text-[10px] font-bold text-[#166534] uppercase block">Impact on Your Land</span>
                    <p className="text-[11px] text-[#17211B] mt-0.5 font-medium leading-relaxed">
                      {item.impactOnLand}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-bold text-[#64736A] pt-1">
                    <span>Distance: <strong className="text-[#17211B]">{item.distanceKm} km</strong></span>
                    <span>Source: {item.sourceAuthority}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* -----------------------------------------------------------
          4. VERIFIED UPCOMING PROJECTS & REGIONAL CORRIDORS
      ----------------------------------------------------------- */}
      <div className="bg-[#FFFFFF] p-6 sm:p-7 rounded-3xl border border-[#D5E1D9] shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-[#D5E1D9] pb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base text-[#17211B]">2.</span>
            <h3 className="font-extrabold text-base text-[#17211B]">
              VERIFIED UPCOMING PROJECTS & REGIONAL MASTER PLANS
            </h3>
          </div>
          <span className="text-xs font-bold text-[#64736A]">
            Official Government Corridors
          </span>
        </div>

        {assessment.hasVerifiedFutureProjects ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assessment.upcomingProjects.map((project) => {
              const Icon = getCategoryIcon(project.category);
              const badge = getStatusBadge(project.status);

              return (
                <div
                  key={project.id}
                  className="p-5 rounded-2xl bg-gradient-to-br from-[#F8FBF9] to-[#EDF6F0] border border-[#BDE3CC] space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#FFFFFF] border border-[#BDE3CC] text-[#15803D] flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-[#17211B]">{project.name}</h4>
                          <span className="text-[11px] text-[#166534] font-semibold">{project.sourceAuthority}</span>
                        </div>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border shrink-0 ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </div>

                    <p className="text-xs text-[#405048] leading-relaxed font-medium">
                      {project.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#BDE3CC]">
                    <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#D5E1D9] text-xs">
                      <span className="text-[10px] font-bold text-[#166534] uppercase block">Impact on Your Land</span>
                      <p className="text-[11px] text-[#17211B] mt-0.5 font-medium leading-relaxed">
                        {project.impactOnLand}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between text-[10px] font-bold text-[#64736A] pt-1 gap-2">
                      <span>Proximity: <strong className="text-[#15803D]">{project.distanceKm} km from land</strong></span>
                      <span>Verified: {project.lastUpdatedDate}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-[#F8FBF9] border border-[#D5E1D9] space-y-3">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-[#15803D] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-[#17211B]">
                  No verified future mega-corridors officially notified within a 30 km radius
                </h4>
                <p className="text-xs text-[#526358] leading-relaxed">
                  LandVista AI only cites officially notified National Highway master plans (NHAI/MoRTH), State Expressway DPRs, and transmission grid expansion gazettes. We never manufacture speculative timelines or unverified corridor claims.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* -----------------------------------------------------------
          5. SURROUNDING DEVELOPMENT SUMMARY
      ----------------------------------------------------------- */}
      <div className="p-6 bg-[#FFFFFF] rounded-3xl border border-[#D5E1D9] shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#15803D]" />
          <h4 className="font-extrabold text-sm text-[#17211B]">
            Evidence-Based Surrounding Development Synthesis
          </h4>
        </div>
        <p className="text-xs text-[#405048] leading-relaxed font-medium">
          {assessment.surroundingDevelopmentInsight}
        </p>
      </div>

    </div>
  );
};
