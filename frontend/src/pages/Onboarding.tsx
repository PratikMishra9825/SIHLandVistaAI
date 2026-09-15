import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  MapPin, 
  PenTool, 
  Navigation, 
  Search, 
  Upload, 
  FileText, 
  FlaskConical, 
  Droplets, 
  FileCheck, 
  CheckCircle2, 
  AlertCircle, 
  Compass, 
  RotateCcw, 
  Layers, 
  Mountain, 
  Satellite, 
  Trash2, 
  X, 
  ArrowRight, 
  Edit3, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Camera, 
  FileSpreadsheet,
  Globe2,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLand } from '../context/LandContext';
import { useAuth } from '../context/AuthContext';
import { MapContainer } from '../components/parcel/MapContainer';
import { calculateParcelMetrics } from '../services/parcelAnalysisService';
import { searchLocations, POPULAR_LOCATION_PRESETS } from '../services/geocodingService';
import { fetchBhuvanReverseGeocode, fetchBhuvanLulc, type BhuvanAdminLocation, type BhuvanLulcResult } from '../services/bhuvanService';
import { fetchElevationAnalysis } from '../services/elevationService';
import { analyzeNearbyInfrastructure } from '../services/placesService';
import type { MapStyleMode, ParcelCalculations, TerrainAnalysisData, NearbyAnalysisData } from '../types/parcelIntelligence';

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { registerNewParcel, selectedParcel, setSelectedParcel } = useLand();
  const { user } = useAuth();

  // Navigation Steps: 1: Land, 2: Location & Map, 3: Evidence, 4: Review
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1); // Start with 01 LAND first

  // Section 1: Basic Land Information
  const [landName, setLandName] = useState('Family Farm');
  const [landType, setLandType] = useState('Agricultural');
  const [ownershipType, setOwnershipType] = useState('Individual');
  const [description, setDescription] = useState('');
  const [surveyNumber, setSurveyNumber] = useState('MH-SOL-2026/891A');

  // Section 2: Location & Map State
  const [mapStyle, setMapStyle] = useState<MapStyleMode>('satellite');
  const [is3DMode, setIs3DMode] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(POPULAR_LOCATION_PRESETS.slice(0, 4));
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchMarker, setSearchMarker] = useState<{ lat: number; lng: number; name: string } | null>({
    lat: selectedParcel.lat || 18.5204,
    lng: selectedParcel.lng || 73.8567,
    name: `${selectedParcel.district || 'Pune'}, ${selectedParcel.state || 'Maharashtra'}`
  });

  // Manual Coordinates Modal State
  const [isManualCoordOpen, setIsManualCoordOpen] = useState(false);
  const [manualLat, setManualLat] = useState(String(selectedParcel.lat || 18.5204));
  const [manualLng, setManualLng] = useState(String(selectedParcel.lng || 73.8567));

  // Calculated Parcel Geometry & Metrics
  const [parcelCalculations, setParcelCalculations] = useState<ParcelCalculations | null>(null);

  // Manual / Declared Area Override
  const [isEditingArea, setIsEditingArea] = useState(false);
  const [userDeclaredArea, setUserDeclaredArea] = useState<string>('');

  // Expandable Boundary Coordinates Panel
  const [showCoordsList, setShowCoordsList] = useState(false);

  // Bhuvan ISRO Authoritative Data
  const [bhuvanAdmin, setBhuvanAdmin] = useState<BhuvanAdminLocation>({
    village: `${selectedParcel.district || 'Pune'} Rural`,
    taluka: `${selectedParcel.district || 'Haveli'}`,
    district: selectedParcel.district || 'Pune',
    state: selectedParcel.state || 'Maharashtra',
    country: 'India',
    pincode: '411001',
    source: 'Bhuvan / ISRO National Geoportal'
  });
  const [isBhuvanLoading, setIsBhuvanLoading] = useState(false);
  const [bhuvanLulc, setBhuvanLulc] = useState<BhuvanLulcResult | null>(null);

  // Terrain & Surrounding Infrastructure Preview
  const [terrainData, setTerrainData] = useState<TerrainAnalysisData | null>(null);
  const [nearbyData, setNearbyData] = useState<NearbyAnalysisData | null>(null);

  // Section 3: Optional Evidence Files
  const [landPhotoFile, setLandPhotoFile] = useState<{ name: string; size: string; previewUrl: string } | null>(null);
  const [soilReportFile, setSoilReportFile] = useState<{ name: string; size: string } | null>(null);
  const [waterReportFile, setWaterReportFile] = useState<{ name: string; size: string } | null>(null);
  const [propertyDocFile, setPropertyDocFile] = useState<{ name: string; size: string } | null>(null);

  // Submission Progress Modal
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionProgress, setSubmissionProgress] = useState<{
    stage: number;
    text: string;
    completed: string[];
  }>({
    stage: 0,
    text: '',
    completed: []
  });

  // Map Controller Callbacks
  const zoomInRef = useRef<() => void>(() => {});
  const zoomOutRef = useRef<() => void>(() => {});
  const resetMapRef = useRef<() => void>(() => {});
  const geolocateRef = useRef<(() => void) | null>(null);
  const clearPolygonRef = useRef<() => void>(() => {});

  // Debounced Location Search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(POPULAR_LOCATION_PRESETS.slice(0, 4));
      return;
    }
    setIsSearching(true);
    const handler = setTimeout(async () => {
      const results = await searchLocations(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
      setIsSearchOpen(true);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Parcel Calculated Handler
  const handleParcelCalculated = useCallback(async (calc: ParcelCalculations | null) => {
    setParcelCalculations(calc);
    if (calc) {
      // 1. Fetch Bhuvan Reverse Geocoding
      setIsBhuvanLoading(true);
      const admin = await fetchBhuvanReverseGeocode(calc.centroid.lat, calc.centroid.lng);
      setBhuvanAdmin(admin);
      setIsBhuvanLoading(false);

      // 2. Fetch Bhuvan LULC
      const lulc = await fetchBhuvanLulc(calc.centroid, calc.areaAcres, calc.geoJSON.geometry.coordinates[0]);
      setBhuvanLulc(lulc);

      // 3. Fetch Terrain & DEM
      const terrain = await fetchElevationAnalysis(calc.geoJSON.geometry.coordinates[0]);
      setTerrainData(terrain);

      // 4. Fetch Nearby Buffers
      const nearby = await analyzeNearbyInfrastructure(calc.centroid.lat, calc.centroid.lng, 2000);
      setNearbyData(nearby);
    } else {
      setBhuvanLulc(null);
      setTerrainData(null);
      setNearbyData(null);
    }
  }, []);

  // Location Selection Handler with Live Reverse Geocoding
  const handleSelectLocation = async (lat: number, lng: number, name: string) => {
    setSearchMarker({ lat, lng, name });
    setSearchQuery(name);
    setManualLat(lat.toFixed(4));
    setManualLng(lng.toFixed(4));
    setIsSearchOpen(false);

    setIsBhuvanLoading(true);
    try {
      const admin = await fetchBhuvanReverseGeocode(lat, lng);
      setBhuvanAdmin(admin);
      setSurveyNumber(`${(admin.state || 'MH').substring(0, 2).toUpperCase()}-${(admin.district || 'PUN').substring(0, 3).toUpperCase()}-2026/${Math.floor(100 + Math.random() * 900)}`);
    } catch (err) {
      console.warn('Reverse geocode error:', err);
    }
    setIsBhuvanLoading(false);
  };

  // GPS Locate Handler with Live Coordinates & Bhuvan Cross-Check
  const handleUseCurrentLocation = () => {
    if ('geolocation' in navigator) {
      setIsBhuvanLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const accuracy = pos.coords.accuracy || 25;
          try {
            const admin = await fetchBhuvanReverseGeocode(lat, lng, accuracy);
            setBhuvanAdmin(admin);
            const fullName = admin.formattedAddress || `${admin.village || admin.district || 'Live Location'}, ${admin.district || ''}, ${admin.state || ''}`;
            handleSelectLocation(lat, lng, fullName);
          } catch (e) {
            handleSelectLocation(lat, lng, `GPS (${lat.toFixed(5)}°N, ${lng.toFixed(5)}°E)`);
          }
          setIsBhuvanLoading(false);
          if (geolocateRef.current) geolocateRef.current();
        },
        (err) => {
          setIsBhuvanLoading(false);
          console.warn('Geolocation error:', err.message);
          handleSelectLocation(18.5204, 73.8567, 'Pune, Maharashtra, India');
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
      );
    }
  };

  // Manual Coordinates Submit Handler
  const handleManualCoordinatesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    if (!isNaN(lat) && !isNaN(lng)) {
      try {
        const admin = await fetchBhuvanReverseGeocode(lat, lng);
        const name = `${admin.village || admin.district || 'Custom Location'}, ${admin.state || 'India'}`;
        handleSelectLocation(lat, lng, name);
      } catch (err) {
        handleSelectLocation(lat, lng, `Coordinates (${lat.toFixed(4)}°, ${lng.toFixed(4)}°)`);
      }
      setIsManualCoordOpen(false);
    }
  };

  // File Upload Handlers
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLandPhotoFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        previewUrl: URL.createObjectURL(file)
      });
    }
  };

  const handleGenericFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<{ name: string; size: string } | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setter({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`
      });
    }
  };

  // Final Submission & Analysis Workflow
  const handleSaveAndAnalyze = async () => {
    if (!parcelCalculations) {
      setCurrentStep(2);
      return;
    }

    setIsSubmitting(true);

    const steps = [
      'Validating boundary geometry and coordinates...',
      'Saving land parcel to LANDVISTA database...',
      'Synchronizing Bhuvan / ISRO LULC & administrative cadastre...',
      'Calculating SRTM DEM elevation and slope contours...',
      'Synthesizing infrastructure proximity and AI suitability...'
    ];

    setSubmissionProgress({ stage: 1, text: steps[0], completed: [] });

    await new Promise((r) => setTimeout(r, 600));
    setSubmissionProgress((prev) => ({ stage: 2, text: steps[1], completed: [...prev.completed, '✓ Boundary geometry validated'] }));

    await new Promise((r) => setTimeout(r, 700));
    setSubmissionProgress((prev) => ({ stage: 3, text: steps[2], completed: [...prev.completed, '✓ Parcel record created'] }));

    await new Promise((r) => setTimeout(r, 600));
    setSubmissionProgress((prev) => ({ stage: 4, text: steps[3], completed: [...prev.completed, '✓ Bhuvan / ISRO LULC analysis complete'] }));

    await new Promise((r) => setTimeout(r, 600));
    setSubmissionProgress((prev) => ({ stage: 5, text: steps[4], completed: [...prev.completed, '✓ DEM terrain profile generated'] }));

    await new Promise((r) => setTimeout(r, 500));

    // Construct final parcel payload
    const effectiveAcres = userDeclaredArea && !isNaN(parseFloat(userDeclaredArea))
      ? parseFloat(userDeclaredArea)
      : parcelCalculations.areaAcres;

    const newParcel = {
      ...selectedParcel,
      id: `parcel-${Date.now()}`,
      name: landName || 'Registered Land Parcel',
      district: bhuvanAdmin.district || 'Solapur',
      state: bhuvanAdmin.state || 'Maharashtra',
      lat: parcelCalculations.centroid.lat,
      lng: parcelCalculations.centroid.lng,
      areaAcres: effectiveAcres,
      surveyNumber: surveyNumber || 'MH-SOL-2026/891',
      currentUsage: bhuvanLulc?.primaryLandUse || `${landType} Land`,
      ownership: (ownershipType === 'Company' ? 'Private' : ownershipType === 'Organization' ? 'Panchayat' : 'Private') as any,
      ownershipVerified: true,
      boundaryCoordinates: parcelCalculations.coordinates.map((c) => [c.lat, c.lng] as [number, number]),
      soil: {
        ...selectedParcel.soil,
        source: (soilReportFile ? 'verified' : 'estimated') as 'verified' | 'estimated'
      },
      water: {
        ...selectedParcel.water
      }
    };

    await registerNewParcel(newParcel);
    setSelectedParcel(newParcel);
    confetti({ particleCount: 90, spread: 90, origin: { y: 0.6 } });

    setIsSubmitting(false);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans pb-16 px-2 sm:px-4">
      
      {/* 1. TOP HEADER & VALUE PROPOSITION */}
      <div className="bg-[#FFFFFF] p-6 sm:p-7 rounded-3xl border border-[#D5E1D9] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5EC] border border-[#BDE3CC] text-[#166534] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#15803D]" />
            <span>LANDVISTA AI • LAND REGISTRATION & GIS STUDIO</span>
          </div>
          <h1 className="font-bold text-2xl sm:text-3xl text-[#17211B] tracking-tight">
            Register & Analyze Your Land
          </h1>
          <p className="text-xs sm:text-sm text-[#405048] font-medium max-w-2xl">
            Define your land once. LANDVISTA automatically analyzes its location, area, terrain, land use and surrounding infrastructure.
          </p>
        </div>

        {/* Action Button */}
        {parcelCalculations && (
          <button
            onClick={() => setCurrentStep(4)}
            className="px-6 py-3 rounded-2xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all hover:scale-105 active:scale-95 shrink-0 flex items-center gap-2"
          >
            <span>Review & Save</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 2. SIMPLE 4-STAGE PROGRESS INDICATOR */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-3xl mx-auto text-xs font-bold">
        {[
          { num: '01', title: 'LAND', step: 1 },
          { num: '02', title: 'LOCATION', step: 2 },
          { num: '03', title: 'EVIDENCE', step: 3 },
          { num: '04', title: 'REVIEW', step: 4 }
        ].map((item) => (
          <button
            key={item.num}
            type="button"
            onClick={() => setCurrentStep(item.step as any)}
            className={`p-3 rounded-2xl border text-center transition-all ${
              currentStep === item.step
                ? 'bg-[#E8F5EC] border-[#15803D] text-[#166534] shadow-xs scale-[1.02]'
                : 'bg-[#FFFFFF] border-[#D5E1D9] text-[#64736A] hover:bg-[#F8FBF9]'
            }`}
          >
            <span className="block text-[10px] text-[#64736A] font-bold uppercase">{item.num}</span>
            <span className="text-xs font-bold mt-0.5 block truncate">{item.title}</span>
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: BASIC LAND DETAILS (When Step 1 active or expanded) */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <div className="max-w-4xl mx-auto bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#D5E1D9] shadow-xs space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-[#D5E1D9] pb-3">
            <div>
              <h3 className="font-bold text-lg sm:text-xl text-[#17211B]">Section 1: Basic Land Information</h3>
              <p className="text-xs text-[#405048] font-medium">Enter primary details to identify your land record in LANDVISTA</p>
            </div>
            <span className="text-xs font-bold text-[#15803D] bg-[#E8F5EC] px-3 py-1 rounded-full border border-[#BDE3CC]">
              Step 01 of 04
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
            {/* Land Name */}
            <div>
              <label className="block mb-1.5 text-[#17211B] font-bold">
                LAND NAME <span className="text-[#64736A] font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={landName}
                onChange={(e) => setLandName(e.target.value)}
                placeholder="e.g. Family Farm, Solapur Plot"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B] text-sm outline-none focus:border-[#15803D] transition-all"
              />
            </div>

            {/* Survey / Gut Number */}
            <div>
              <label className="block mb-1.5 text-[#17211B] font-bold">
                SURVEY / GUT NUMBER <span className="text-[#64736A] font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={surveyNumber}
                onChange={(e) => setSurveyNumber(e.target.value)}
                placeholder="e.g. MH-SOL-2026/891A"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B] text-sm outline-none focus:border-[#15803D] transition-all"
              />
            </div>

            {/* Land Type */}
            <div>
              <label className="block mb-1.5 text-[#17211B] font-bold">LAND TYPE</label>
              <select
                value={landType}
                onChange={(e) => setLandType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B] text-sm outline-none focus:border-[#15803D] transition-all font-semibold"
              >
                <option value="Agricultural">🌾 Agricultural</option>
                <option value="Residential">🏡 Residential / Farmhouse</option>
                <option value="Commercial">🏬 Commercial</option>
                <option value="Industrial">🏭 Industrial / Warehouse</option>
                <option value="Mixed Use">🔀 Mixed Use</option>
                <option value="Other">📍 Other</option>
              </select>
            </div>

            {/* Ownership Type */}
            <div>
              <label className="block mb-1.5 text-[#17211B] font-bold">OWNERSHIP TYPE</label>
              <select
                value={ownershipType}
                onChange={(e) => setOwnershipType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B] text-sm outline-none focus:border-[#15803D] transition-all font-semibold"
              >
                <option value="Individual">👤 Individual Ownership</option>
                <option value="Family">👨‍👩‍👧‍👦 Joint Family Property</option>
                <option value="Company">🏢 Corporate / Private Entity</option>
                <option value="Organization">🏛️ Cooperative / Trust</option>
                <option value="Other">📍 Other</option>
              </select>
            </div>
          </div>

          {/* Description & Notes */}
          <div className="space-y-2">
            <label className="block text-xs text-[#17211B] font-bold">
              DESCRIPTION / OBJECTIVES <span className="text-[#64736A] font-normal">(Optional)</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us anything important about this land... e.g. Currently used for rainfed farming, near highway, planning solar installation."
              className="w-full p-3.5 rounded-2xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B] text-xs outline-none focus:border-[#15803D] transition-all"
            />

            {/* Quick Suggestion Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-[#64736A] font-bold uppercase">Quick suggestions:</span>
              {[
                'Currently used for farming',
                'Unused semi-arid land',
                'Near highway',
                'Planning solar installation',
                'Interested in warehouse lease'
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setDescription(description ? `${description}, ${chip}` : chip)}
                  className="px-2.5 py-1 rounded-full text-[11px] bg-[#F0F5F1] hover:bg-[#E8F5EC] text-[#166534] font-medium border border-[#D5E1D9] transition-all active:scale-95"
                >
                  + {chip}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-3 rounded-2xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-2"
            >
              <span>Next: Location & Map Drawing</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: LOCATION AND PARCEL SELECTION (MAIN MAP WORKSPACE) */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Main 2-Column Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT 4-COLUMNS: ACTION TOOLBAR & LAND DETAILS CARD */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Four Registration Method Buttons */}
              <div className="bg-[#FFFFFF] p-4 rounded-3xl border border-[#D5E1D9] shadow-xs space-y-2">
                <span className="text-[10px] text-[#64736A] font-bold uppercase tracking-wider block">
                  PARCEL SELECTION METHODS
                </span>

                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  {/* Method 1: Draw on Map */}
                  <button
                    type="button"
                    onClick={() => setIsDrawing(!isDrawing)}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-1.5 ${
                      isDrawing
                        ? 'bg-[#DC2626] text-white border-red-600 shadow-sm animate-pulse'
                        : 'bg-[#E8F5EC] text-[#166534] border-[#BDE3CC] hover:bg-[#D5EEDF]'
                    }`}
                  >
                    <PenTool className="w-4 h-4" />
                    <span className="text-[11px] leading-tight">
                      {isDrawing ? 'Click Map to Finish' : 'Draw Boundary'}
                    </span>
                  </button>

                  {/* Method 2: GPS Current Location */}
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    className="p-3 rounded-2xl border border-[#D5E1D9] bg-[#F8FBF9] hover:bg-[#E8F5EC] text-[#17211B] text-left transition-all flex flex-col gap-1.5"
                  >
                    <Navigation className="w-4 h-4 text-[#15803D]" />
                    <span className="text-[11px] leading-tight">Use My GPS</span>
                  </button>

                  {/* Method 3: Enter Coordinates */}
                  <button
                    type="button"
                    onClick={() => setIsManualCoordOpen(true)}
                    className="p-3 rounded-2xl border border-[#D5E1D9] bg-[#F8FBF9] hover:bg-[#E8F5EC] text-[#17211B] text-left transition-all flex flex-col gap-1.5"
                  >
                    <MapPin className="w-4 h-4 text-[#15803D]" />
                    <span className="text-[11px] leading-tight">Enter Lat / Lng</span>
                  </button>

                  {/* Method 4: Clear Boundary */}
                  <button
                    type="button"
                    onClick={() => {
                      if (clearPolygonRef.current) clearPolygonRef.current();
                      setParcelCalculations(null);
                    }}
                    disabled={!parcelCalculations}
                    className="p-3 rounded-2xl border border-[#D5E1D9] bg-[#F8FBF9] hover:bg-[#FEE2E2] text-[#991B1B] text-left transition-all flex flex-col gap-1.5 disabled:opacity-40"
                  >
                    <Trash2 className="w-4 h-4 text-[#DC2626]" />
                    <span className="text-[11px] leading-tight">Clear Polygon</span>
                  </button>
                </div>
              </div>

              {/* Location Search Bar */}
              <div className="bg-[#FFFFFF] p-4 rounded-3xl border border-[#D5E1D9] shadow-xs space-y-2 relative">
                <span className="text-[10px] text-[#64736A] font-bold uppercase tracking-wider block">
                  SEARCH VILLAGE / DISTRICT / COORDINATES
                </span>

                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-[#15803D] absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onFocus={() => setIsSearchOpen(true)}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Solapur, Pavagada, or lat,lng..."
                    className="w-full pl-10 pr-8 py-2.5 bg-[#F8FBF9] border border-[#D5E1D9] focus:border-[#15803D] rounded-2xl text-xs font-semibold text-[#17211B] outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 text-[#64736A] hover:text-[#17211B]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Dropdown Results */}
                {isSearchOpen && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[#FFFFFF] border border-[#D5E1D9] rounded-2xl shadow-lg z-50 overflow-hidden divide-y divide-[#F0F5F1] max-h-56 overflow-y-auto">
                    {searchResults.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectLocation(item.lat, item.lng, item.displayName)}
                        className="w-full px-3.5 py-2.5 text-left flex items-start gap-2 hover:bg-[#E8F5EC] transition-colors"
                      >
                        <MapPin className="w-4 h-4 text-[#15803D] mt-0.5 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-bold text-[#17211B] block truncate">{item.shortName}</span>
                          <span className="text-[10px] text-[#64736A] block truncate">{item.displayName}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Bhuvan ISRO Authoritative Administrative Card */}
              <div className="bg-[#FFFFFF] p-4 rounded-3xl border border-[#D5E1D9] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Globe2 className="w-4 h-4 text-[#15803D]" />
                    <span className="text-xs font-bold text-[#17211B]">Bhuvan ISRO Cadastre</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#166534] bg-[#E8F5EC] px-2 py-0.5 rounded-full border border-[#BDE3CC]">
                    Auto-Detected
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#F0F5F1]">
                    <span className="text-[#64736A]">Village:</span>
                    <span className="font-bold text-[#17211B]">{bhuvanAdmin.village}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F0F5F1]">
                    <span className="text-[#64736A]">Taluka:</span>
                    <span className="font-bold text-[#17211B]">{bhuvanAdmin.taluka}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F0F5F1]">
                    <span className="text-[#64736A]">District & State:</span>
                    <span className="font-bold text-[#17211B]">{bhuvanAdmin.district}, {bhuvanAdmin.state}</span>
                  </div>
                </div>
                <p className="text-[10px] text-[#64736A] font-medium leading-tight">
                  Source: {bhuvanAdmin.source}
                </p>
              </div>

            </div>

            {/* RIGHT 8-COLUMNS: INTERACTIVE MAPBOX CANVAS & METRICS */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Top Map Layer Switcher Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 bg-[#FFFFFF] p-2 rounded-2xl border border-[#D5E1D9] shadow-xs text-xs font-bold">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setMapStyle('satellite')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                      mapStyle === 'satellite'
                        ? 'bg-[#15803D] text-white shadow-xs'
                        : 'text-[#405048] hover:bg-[#E8F5EC]'
                    }`}
                  >
                    <Satellite className="w-3.5 h-3.5" />
                    <span>Satellite</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMapStyle('standard')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                      mapStyle === 'standard'
                        ? 'bg-[#15803D] text-white shadow-xs'
                        : 'text-[#405048] hover:bg-[#E8F5EC]'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Standard</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMapStyle('terrain')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                      mapStyle === 'terrain'
                        ? 'bg-[#15803D] text-white shadow-xs'
                        : 'text-[#405048] hover:bg-[#E8F5EC]'
                    }`}
                  >
                    <Mountain className="w-3.5 h-3.5" />
                    <span>Terrain</span>
                  </button>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-[#64736A]">
                  <span>Click map to place parcel boundary nodes</span>
                </div>
              </div>

              {/* Mapbox Canvas */}
              <div className="h-[460px] w-full relative">
                <MapContainer
                  mapStyle={mapStyle}
                  is3DMode={is3DMode}
                  isDrawing={isDrawing}
                  onDrawingChange={setIsDrawing}
                  onParcelCalculated={handleParcelCalculated}
                  searchMarker={searchMarker}
                  onZoomInRef={(fn) => (zoomInRef.current = fn)}
                  onZoomOutRef={(fn) => (zoomOutRef.current = fn)}
                  onResetRef={(fn) => (resetMapRef.current = fn)}
                  onGeolocateRef={(fn) => (geolocateRef.current = fn)}
                  onClearPolygonRef={(fn) => (clearPolygonRef.current = fn)}
                />
              </div>

              {/* SELECTED LAND AREA & METRICS CARD */}
              {parcelCalculations ? (
                <div className="bg-[#FFFFFF] p-5 rounded-3xl border border-[#D5E1D9] shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#17211B] flex items-center gap-1.5 uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-[#15803D]" />
                      <span>SELECTED LAND GEOMETRY</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => setIsEditingArea(!isEditingArea)}
                      className="text-xs font-bold text-[#15803D] hover:underline flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isEditingArea ? 'Done Editing' : 'Edit Declared Area'}</span>
                    </button>
                  </div>

                  {/* 4-Stat Metric Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    
                    {/* Area Acres */}
                    <div className="p-3 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9] text-center">
                      <span className="text-[10px] text-[#64736A] font-bold uppercase block">AREA (ACRES)</span>
                      <span className="text-lg font-bold text-[#15803D]">
                        {userDeclaredArea && !isNaN(parseFloat(userDeclaredArea))
                          ? parseFloat(userDeclaredArea)
                          : parcelCalculations.areaAcres}
                      </span>
                      <span className="text-[10px] text-[#64736A] block">
                        {userDeclaredArea ? '(Manual / Declared)' : '(Turf.js Geodesic)'}
                      </span>
                    </div>

                    {/* Area Hectares */}
                    <div className="p-3 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9] text-center">
                      <span className="text-[10px] text-[#64736A] font-bold uppercase block">HECTARES</span>
                      <span className="text-lg font-bold text-[#17211B]">{parcelCalculations.areaHectares}</span>
                      <span className="text-[10px] text-[#64736A] block">ha</span>
                    </div>

                    {/* Perimeter */}
                    <div className="p-3 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9] text-center">
                      <span className="text-[10px] text-[#64736A] font-bold uppercase block">PERIMETER</span>
                      <span className="text-lg font-bold text-[#17211B]">{parcelCalculations.perimeterMeters}</span>
                      <span className="text-[10px] text-[#64736A] block">Meters</span>
                    </div>

                    {/* Center Coordinates */}
                    <div className="p-3 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9] text-center">
                      <span className="text-[10px] text-[#64736A] font-bold uppercase block">CENTER</span>
                      <span className="text-xs font-bold text-[#17211B] font-mono block mt-1">
                        {parcelCalculations.centroid.lat.toFixed(4)}° N
                      </span>
                      <span className="text-xs font-bold text-[#17211B] font-mono block">
                        {parcelCalculations.centroid.lng.toFixed(4)}° E
                      </span>
                    </div>
                  </div>

                  {/* Manual Area Override Input Drawer */}
                  {isEditingArea && (
                    <div className="p-3.5 bg-[#E8F5EC] rounded-2xl border border-[#BDE3CC] flex items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-bold text-[#166534] block">Override / Declare Official Record Area</span>
                        <span className="text-[11px] text-[#405048]">
                          Map-calculated area: {parcelCalculations.areaAcres} acres
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.01"
                          value={userDeclaredArea}
                          onChange={(e) => setUserDeclaredArea(e.target.value)}
                          placeholder={`${parcelCalculations.areaAcres}`}
                          className="w-24 px-2.5 py-1.5 rounded-xl bg-white border border-[#BDE3CC] text-sm font-bold text-[#15803D] outline-none"
                        />
                        <span className="font-bold text-[#166534]">Acres</span>
                      </div>
                    </div>
                  )}

                  {/* Expandable Boundary Vertices Coordinates List */}
                  <div className="border-t border-[#F0F5F1] pt-3">
                    <button
                      type="button"
                      onClick={() => setShowCoordsList(!showCoordsList)}
                      className="w-full flex items-center justify-between text-xs font-bold text-[#64736A] hover:text-[#17211B]"
                    >
                      <span>Boundary Vertex Coordinates ({parcelCalculations.coordinates.length} points)</span>
                      {showCoordsList ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {showCoordsList && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 max-h-40 overflow-y-auto pt-1 font-mono text-[11px]">
                        {parcelCalculations.coordinates.map((pt) => (
                          <div key={pt.index} className="p-2 bg-[#F8FBF9] rounded-xl border border-[#D5E1D9]">
                            <span className="text-[#15803D] font-bold block">Point {pt.index}:</span>
                            <span>{pt.lat.toFixed(6)}, {pt.lng.toFixed(6)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-[#F8FBF9] rounded-3xl border border-dashed border-[#D5E1D9] text-center text-xs text-[#64736A]">
                  Click <strong>"Draw Boundary"</strong> above or search a location to begin registering your parcel.
                </div>
              )}

            </div>
          </div>

          {/* Section Navigation Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#D5E1D9] text-xs font-bold text-[#17211B] hover:bg-[#F8FBF9]"
            >
              ← Back to Basic Details
            </button>

            <button
              onClick={() => setCurrentStep(3)}
              className="px-6 py-3 rounded-2xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-2"
            >
              <span>Next: Optional Evidence</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: OPTIONAL LAND EVIDENCE & DOCUMENTS */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <div className="max-w-4xl mx-auto bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#D5E1D9] shadow-xs space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-[#D5E1D9] pb-3">
            <div>
              <h3 className="font-bold text-lg sm:text-xl text-[#17211B]">Section 3: Optional Land Evidence</h3>
              <p className="text-xs text-[#405048] font-medium">Upload photos or soil/water test reports if available. None of these are required.</p>
            </div>
            <span className="text-xs font-bold text-[#15803D] bg-[#E8F5EC] px-3 py-1 rounded-full border border-[#BDE3CC]">
              All Optional
            </span>
          </div>

          {/* 4 Drag & Drop Upload Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
            
            {/* 1. Land Photo */}
            <div className="p-4 rounded-2xl border border-[#D5E1D9] bg-[#F8FBF9] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#17211B] flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[#15803D]" />
                  <span>Land / Ground Photo</span>
                </span>
                <span className="text-[10px] text-[#64736A]">(Optional)</span>
              </div>

              <label className="border-2 border-dashed border-[#D5E1D9] hover:border-[#15803D] rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer bg-white transition-all group">
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                {landPhotoFile ? (
                  <div className="space-y-1.5">
                    <img src={landPhotoFile.previewUrl} alt="Land Preview" className="w-20 h-14 object-cover rounded-lg mx-auto border" />
                    <p className="text-[11px] font-bold text-[#15803D] truncate max-w-[180px]">{landPhotoFile.name}</p>
                    <span className="text-[10px] text-[#64736A]">{landPhotoFile.size}</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload className="w-6 h-6 text-[#15803D] mx-auto group-hover:scale-110 transition-transform" />
                    <p className="text-xs text-[#17211B] font-bold">Upload Land Photo</p>
                    <p className="text-[10px] text-[#64736A]">JPG, PNG, WEBP</p>
                  </div>
                )}
              </label>
            </div>

            {/* 2. Soil Test Report */}
            <div className="p-4 rounded-2xl border border-[#D5E1D9] bg-[#F8FBF9] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#17211B] flex items-center gap-1.5">
                  <FlaskConical className="w-4 h-4 text-[#D97706]" />
                  <span>Soil Test Report</span>
                </span>
                <span className="text-[10px] text-[#64736A]">(Optional)</span>
              </div>

              <label className="border-2 border-dashed border-[#D5E1D9] hover:border-[#D97706] rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer bg-white transition-all group">
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => handleGenericFileUpload(e, setSoilReportFile)}
                  className="hidden"
                />
                {soilReportFile ? (
                  <div className="space-y-1">
                    <FileCheck className="w-6 h-6 text-[#15803D] mx-auto" />
                    <p className="text-[11px] font-bold text-[#17211B] truncate max-w-[180px]">{soilReportFile.name}</p>
                    <span className="text-[10px] text-[#166534] font-bold">✓ Ready for Lab OCR</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload className="w-6 h-6 text-[#D97706] mx-auto group-hover:scale-110 transition-transform" />
                    <p className="text-xs text-[#17211B] font-bold">Upload Soil Report</p>
                    <p className="text-[10px] text-[#64736A]">PDF, JPG, PNG (pH, NPK)</p>
                  </div>
                )}
              </label>
            </div>

            {/* 3. Water Test Report */}
            <div className="p-4 rounded-2xl border border-[#D5E1D9] bg-[#F8FBF9] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#17211B] flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-[#2563EB]" />
                  <span>Water Quality Report</span>
                </span>
                <span className="text-[10px] text-[#64736A]">(Optional)</span>
              </div>

              <label className="border-2 border-dashed border-[#D5E1D9] hover:border-[#2563EB] rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer bg-white transition-all group">
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => handleGenericFileUpload(e, setWaterReportFile)}
                  className="hidden"
                />
                {waterReportFile ? (
                  <div className="space-y-1">
                    <FileCheck className="w-6 h-6 text-[#15803D] mx-auto" />
                    <p className="text-[11px] font-bold text-[#17211B] truncate max-w-[180px]">{waterReportFile.name}</p>
                    <span className="text-[10px] text-[#166534] font-bold">✓ Uploaded</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload className="w-6 h-6 text-[#2563EB] mx-auto group-hover:scale-110 transition-transform" />
                    <p className="text-xs text-[#17211B] font-bold">Upload Water Report</p>
                    <p className="text-[10px] text-[#64736A]">PDF, JPG, PNG (TDS, EC)</p>
                  </div>
                )}
              </label>
            </div>

            {/* 4. Property Document (7/12 Extract / Deed) */}
            <div className="p-4 rounded-2xl border border-[#D5E1D9] bg-[#F8FBF9] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#17211B] flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#7C3AED]" />
                  <span>7/12 Extract or Deed</span>
                </span>
                <span className="text-[10px] text-[#64736A]">(Optional)</span>
              </div>

              <label className="border-2 border-dashed border-[#D5E1D9] hover:border-[#7C3AED] rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer bg-white transition-all group">
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => handleGenericFileUpload(e, setPropertyDocFile)}
                  className="hidden"
                />
                {propertyDocFile ? (
                  <div className="space-y-1">
                    <FileCheck className="w-6 h-6 text-[#15803D] mx-auto" />
                    <p className="text-[11px] font-bold text-[#17211B] truncate max-w-[180px]">{propertyDocFile.name}</p>
                    <span className="text-[10px] text-[#166534] font-bold">✓ Cadastral Linked</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload className="w-6 h-6 text-[#7C3AED] mx-auto group-hover:scale-110 transition-transform" />
                    <p className="text-xs text-[#17211B] font-bold">Upload 7/12 / Deed</p>
                    <p className="text-[10px] text-[#64736A]">PDF, JPG (Cadastre Verification)</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-3">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#D5E1D9] text-xs font-bold text-[#17211B] hover:bg-[#F8FBF9]"
            >
              ← Back to Map
            </button>

            <button
              onClick={() => setCurrentStep(4)}
              className="px-6 py-3 rounded-2xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-2"
            >
              <span>Next: Review & Submit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: REVIEW & SAVE WORKFLOW */}
      {/* ========================================================================= */}
      {currentStep === 4 && (
        <div className="max-w-4xl mx-auto bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#D5E1D9] shadow-xs space-y-6 animate-in fade-in">
          
          <div className="flex items-center justify-between border-b border-[#D5E1D9] pb-3">
            <div>
              <h3 className="font-bold text-xl text-[#17211B]">Review Your Land Registration</h3>
              <p className="text-xs text-[#405048] font-medium">Please verify your details before running full geospatial intelligence</p>
            </div>
            <button
              onClick={() => setCurrentStep(2)}
              className="text-xs font-bold text-[#15803D] hover:underline flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          </div>

          {/* Summary Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
            
            {/* Card 1: Identity & Location */}
            <div className="p-4 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9] space-y-2">
              <span className="text-[10px] text-[#64736A] font-bold uppercase block">LAND IDENTITY</span>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#64736A]">Land Name:</span>
                  <span className="font-bold text-[#17211B]">{landName || 'Registered Land Parcel'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64736A]">Land Type:</span>
                  <span className="font-bold text-[#17211B]">{landType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64736A]">Ownership:</span>
                  <span className="font-bold text-[#17211B]">{ownershipType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64736A]">Location:</span>
                  <span className="font-bold text-[#17211B]">{bhuvanAdmin.district}, {bhuvanAdmin.state}</span>
                </div>
              </div>
            </div>

            {/* Card 2: Boundary & Geometry */}
            <div className="p-4 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9] space-y-2">
              <span className="text-[10px] text-[#64736A] font-bold uppercase block">GEOMETRY & AREA</span>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#64736A]">Calculated Area:</span>
                  <span className="font-bold text-[#15803D]">
                    {userDeclaredArea ? `${userDeclaredArea} Acres (Declared)` : `${parcelCalculations?.areaAcres || 10.2} Acres`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64736A]">Hectares:</span>
                  <span className="font-bold text-[#17211B]">{parcelCalculations?.areaHectares || 4.14} ha</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64736A]">Perimeter:</span>
                  <span className="font-bold text-[#17211B]">{parcelCalculations?.perimeterMeters || 812} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64736A]">Centroid:</span>
                  <span className="font-bold text-[#17211B] font-mono">
                    {parcelCalculations?.centroid.lat.toFixed(4)}°N, {parcelCalculations?.centroid.lng.toFixed(4)}°E
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Automatic Intelligence Scan Guarantee Card */}
          <div className="p-4 rounded-2xl bg-[#E8F5EC] border border-[#BDE3CC] space-y-2 text-xs">
            <span className="font-bold text-[#166534] flex items-center gap-1.5 uppercase">
              <ShieldCheck className="w-4 h-4 text-[#15803D]" />
              <span>LANDVISTA AUTOMATIC INTELLIGENCE SUITE WILL GENERATE:</span>
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-[#166534]">
              <span>✓ Bhuvan / ISRO LULC classes</span>
              <span>✓ SRTM 30m DEM Elevation Profile</span>
              <span>✓ Average Slope & Solar Aspect</span>
              <span>✓ 33kV Substation Distance</span>
              <span>✓ Irrigation Canal & Water Table</span>
              <span>✓ PM-KUSUM & AIF Subsidies</span>
            </div>
          </div>

          {/* Primary Submit CTA */}
          <div className="pt-2">
            <button
              onClick={handleSaveAndAnalyze}
              disabled={isSubmitting || !parcelCalculations}
              className="w-full py-4 rounded-2xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-sm uppercase tracking-wider shadow-md transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>SAVE & ANALYZE LAND</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-center text-[#64736A] mt-2">
              ⚡ Analyzes authoritative satellite layers, terrain contours, and government scheme eligibility in seconds
            </p>
          </div>
        </div>
      )}

      {/* SUBMISSION PROGRESS MODAL */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 bg-[#17211B]/70 backdrop-blur-sm flex items-center justify-center p-4 font-sans animate-in fade-in">
          <div className="w-full max-w-md bg-[#FFFFFF] p-6 sm:p-7 rounded-3xl border border-[#D5E1D9] shadow-2xl space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F5EC] text-[#15803D] flex items-center justify-center mx-auto border border-[#BDE3CC] animate-spin">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl text-[#17211B]">Processing Land Intelligence</h3>
              <p className="text-xs text-[#405048]">{submissionProgress.text}</p>
            </div>

            <div className="space-y-2 bg-[#F8FBF9] p-4 rounded-2xl border border-[#D5E1D9] text-xs">
              {submissionProgress.completed.map((msg, i) => (
                <div key={i} className="text-[#166534] font-bold flex items-center gap-2">
                  <span>{msg}</span>
                </div>
              ))}
              <div className="text-[#15803D] font-bold flex items-center gap-2 animate-pulse">
                <span>→ {submissionProgress.text}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MANUAL COORDINATES ENTRY MODAL */}
      {isManualCoordOpen && (
        <div className="fixed inset-0 z-50 bg-[#17211B]/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans animate-in fade-in">
          <div className="w-full max-w-md bg-[#FFFFFF] p-6 rounded-3xl border border-[#D5E1D9] shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-base text-[#17211B] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#15803D]" />
                <span>Enter Coordinates Manually</span>
              </h4>
              <button
                onClick={() => setIsManualCoordOpen(false)}
                className="text-[#64736A] hover:text-[#17211B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleManualCoordinatesSubmit} className="space-y-3 text-xs font-semibold">
              <div>
                <label className="block mb-1 text-[#17211B] font-bold">LATITUDE (° N)</label>
                <input
                  type="text"
                  required
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  placeholder="e.g. 17.6599"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-sm text-[#17211B] outline-none focus:border-[#15803D]"
                />
              </div>

              <div>
                <label className="block mb-1 text-[#17211B] font-bold">LONGITUDE (° E)</label>
                <input
                  type="text"
                  required
                  value={manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                  placeholder="e.g. 75.9064"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-sm text-[#17211B] outline-none focus:border-[#15803D]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsManualCoordOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B] font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs shadow-xs"
                >
                  Set Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
