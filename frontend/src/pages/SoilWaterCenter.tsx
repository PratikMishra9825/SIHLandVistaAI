import React, { useState } from 'react';
import { 
  FlaskConical, 
  Droplet, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Zap, 
  Activity, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { useLand } from '../context/LandContext';
import { SourceBadge } from '../components/SourceBadge';
import { ScoreRing } from '../components/ScoreRing';
import { DataConfidenceBadge } from '../components/DataConfidenceBadge';
import { SoilCheckupModal } from '../components/SoilCheckupModal';
import { simulateSoilCardOCR } from '../utils/ocrSimulator';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export const SoilWaterCenter: React.FC = () => {
  const { selectedParcel } = useLand();

  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [isSoilModalOpen, setIsSoilModalOpen] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsScanning(true);
    setScanResult(null);

    try {
      const res = await simulateSoilCardOCR(file);
      setTimeout(() => {
        setScanResult(res);
        setIsScanning(false);
      }, 1200);
    } catch (err) {
      setIsScanning(false);
    }
  };

  const nutrientData = [
    { subject: 'pH Balance', A: (selectedParcel.soil.pH / 14) * 100, fullMark: 100 },
    { subject: 'Nitrogen (N)', A: selectedParcel.soil.nitrogen === 'High' ? 90 : selectedParcel.soil.nitrogen === 'Medium' ? 65 : 35, fullMark: 100 },
    { subject: 'Phosphorus (P)', A: selectedParcel.soil.phosphorus === 'High' ? 90 : selectedParcel.soil.phosphorus === 'Medium' ? 60 : 30, fullMark: 100 },
    { subject: 'Potassium (K)', A: selectedParcel.soil.potassium === 'High' ? 95 : selectedParcel.soil.potassium === 'Medium' ? 70 : 40, fullMark: 100 },
    { subject: 'Organic Carbon', A: Math.min(100, selectedParcel.soil.organicCarbon * 100), fullMark: 100 },
    { subject: 'Moisture Retention', A: selectedParcel.soil.moisture * 2.5, fullMark: 100 },
  ];

  const seasonalWaterData = [
    { month: 'Jun', rainfall: 45, stress: 30 },
    { month: 'Jul', rainfall: 120, stress: 10 },
    { month: 'Aug', rainfall: 140, stress: 10 },
    { month: 'Sep', rainfall: 160, stress: 15 },
    { month: 'Oct', rainfall: 55, stress: 40 },
    { month: 'Nov', rainfall: 20, stress: 60 },
    { month: 'Dec', rainfall: 10, stress: 70 },
    { month: 'Jan', rainfall: 5, stress: 80 },
    { month: 'Feb', rainfall: 5, stress: 85 },
    { month: 'Mar', rainfall: 10, stress: 90 },
    { month: 'Apr', rainfall: 15, stress: 95 },
    { month: 'May', rainfall: 25, stress: 90 },
  ];

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* 1. HEADER */}
      <div className="bg-[#FFFFFF] p-6 sm:p-7 rounded-3xl border border-[#D5E1D9] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F5EC] border border-[#BDE3CC] flex items-center justify-center text-[#15803D] shrink-0">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold font-mono text-[#166534] uppercase tracking-wider">
                AGRI-GEOCHEMICAL INTELLIGENCE
              </span>
              <SourceBadge type="official" label="LAB & SATELLITE DERIVED" />
            </div>
            <h1 className="font-bold text-2xl text-[#17211B] tracking-tight">
              Soil Geochemistry & Hydrological Stress Center
            </h1>
            <p className="text-sm text-[#405048] font-medium">
              Diagnostic NPK analysis, Automated Soil Health Card OCR Parser & Aquifer Stress Analytics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ScoreRing score={selectedParcel.soil.healthScore} size={70} strokeWidth={6} color="#15803D" label="Soil Index" />
          <ScoreRing score={selectedParcel.water.score} size={70} strokeWidth={6} color="#0284C7" label="Water Index" />
        </div>
      </div>

      {/* 2. MAIN SCIENTIFIC PANELS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SOIL CHEMISTRY TELEMETRY (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#D5E1D9] space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#D5E1D9] pb-3">
              <span className="font-bold text-sm text-[#17211B] uppercase tracking-wider">
                SOIL NUTRIENT EQUILIBRIUM RADAR
              </span>
              <span className="text-xs font-mono text-[#166534] font-bold bg-[#E8F5EC] px-2.5 py-0.5 rounded-full border border-[#BDE3CC]">
                TYPE: {selectedParcel.soil.soilType.toUpperCase()}
              </span>
            </div>

            {/* Radar Chart */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={nutrientData}>
                  <PolarGrid stroke="#D5E1D9" />
                  <PolarAngleAxis dataKey="subject" stroke="#405048" tick={{ fill: '#17211B', fontSize: 11, fontWeight: 'bold' }} />
                  <Radar name="Nutrient Level" dataKey="A" stroke="#15803D" fill="#15803D" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Parameter Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs font-mono">
              <div className="bg-[#F8FBF9] p-3 rounded-2xl border border-[#D5E1D9] text-center">
                <span className="text-[10px] text-[#64736A] font-bold block uppercase">pH LEVEL</span>
                <p className="font-bold text-[#15803D] text-base">{selectedParcel.soil.pH}</p>
                <span className="text-[10px] text-[#405048] font-sans font-medium">Optimal</span>
              </div>

              <div className="bg-[#F8FBF9] p-3 rounded-2xl border border-[#D5E1D9] text-center">
                <span className="text-[10px] text-[#64736A] font-bold block uppercase">NITROGEN</span>
                <p className="font-bold text-[#92400E] text-base">{selectedParcel.soil.nitrogen}</p>
                <span className="text-[10px] text-[#405048] font-sans font-medium">{selectedParcel.soil.nitrogenValue || 185} kg/ha</span>
              </div>

              <div className="bg-[#F8FBF9] p-3 rounded-2xl border border-[#D5E1D9] text-center">
                <span className="text-[10px] text-[#64736A] font-bold block uppercase">PHOSPHORUS</span>
                <p className="font-bold text-[#15803D] text-base">{selectedParcel.soil.phosphorus}</p>
                <span className="text-[10px] text-[#405048] font-sans font-medium">{selectedParcel.soil.phosphorusValue || 18} kg/ha</span>
              </div>

              <div className="bg-[#F8FBF9] p-3 rounded-2xl border border-[#D5E1D9] text-center">
                <span className="text-[10px] text-[#64736A] font-bold block uppercase">POTASSIUM</span>
                <p className="font-bold text-[#15803D] text-base">{selectedParcel.soil.potassium}</p>
                <span className="text-[10px] text-[#405048] font-sans font-medium">{selectedParcel.soil.potassiumValue || 310} kg/ha</span>
              </div>

              <div className="bg-[#F8FBF9] p-3 rounded-2xl border border-[#D5E1D9] text-center">
                <span className="text-[10px] text-[#64736A] font-bold block uppercase">CARBON</span>
                <p className="font-bold text-[#17211B] text-base">{selectedParcel.soil.organicCarbon}%</p>
                <span className="text-[10px] text-[#405048] font-sans font-medium">Humus</span>
              </div>
            </div>
          </div>

          {/* 💧 WATER SECURITY & SEASONAL STRESS */}
          <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#D5E1D9] space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#D5E1D9] pb-3">
              <span className="font-bold text-sm text-[#17211B] uppercase tracking-wider">
                PRECIPITATION & SEASONAL WATER STRESS PROFILE
              </span>
              <span className="text-xs font-mono text-[#0284C7] font-bold bg-[#EFF6FF] px-2.5 py-0.5 rounded-full border border-[#BFDBFE]">
                ANNUAL: {selectedParcel.water.rainfallAnnual} mm
              </span>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={seasonalWaterData}>
                  <XAxis dataKey="month" stroke="#405048" tick={{ fontSize: 11, fill: '#17211B', fontWeight: 'bold' }} />
                  <YAxis stroke="#405048" tick={{ fontSize: 11, fill: '#17211B' }} />
                  <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #D5E1D9', borderRadius: '12px', fontSize: '12px' }} />
                  <Bar dataKey="rainfall" fill="#0284C7" name="Rainfall (mm)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="stress" fill="#DC2626" name="Aquifer Stress Index" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* OCR SCANNER & TWO CLEAR OPTIONS (5 COLS) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* OPTION 1: UPLOAD SOIL REPORT */}
          <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#D5E1D9] space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#D5E1D9] pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#15803D]" />
                <span className="font-bold text-sm text-[#17211B] uppercase tracking-wider">
                  1. UPLOAD SOIL HEALTH CARD (OCR)
                </span>
              </div>
              <SourceBadge type="ai" label="AI VISION" />
            </div>

            <div className="border-2 border-dashed border-[#D5E1D9] rounded-2xl p-6 text-center space-y-3 bg-[#F8FBF9] hover:border-[#15803D] transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F5EC] border border-[#BDE3CC] flex items-center justify-center mx-auto text-[#15803D]">
                <FileText className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-sm text-[#17211B]">
                  Upload Soil Health Card or Lab Report (PDF / Image)
                </h3>
                <p className="text-xs text-[#405048] font-medium">
                  Automatically parses pH, NPK, Organic Carbon, and Electrical Conductivity.
                </p>
              </div>

              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                id="soil-ocr-upload"
                className="hidden"
              />
              <label
                htmlFor="soil-ocr-upload"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold cursor-pointer transition-all shadow-sm"
              >
                <Upload className="w-4 h-4" />
                <span>Select Soil Document</span>
              </label>

              {isScanning && (
                <div className="flex items-center justify-center gap-2 text-xs text-[#15803D] font-bold pt-2 animate-pulse">
                  <Zap className="w-4 h-4 animate-spin" />
                  <span>Scanning Soil Health Card with Vision OCR...</span>
                </div>
              )}
            </div>

            {scanResult && (
              <div className="p-4 rounded-2xl bg-[#E8F5EC] border border-[#BDE3CC] space-y-2.5 text-xs animate-in fade-in">
                <div className="flex items-center justify-between text-[#166534] font-bold border-b border-[#BDE3CC] pb-2">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#15803D]" /> Parameters Extracted
                  </span>
                  <span className="text-xs">96% Confidence</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-bold text-[#17211B]">
                  <p>pH: <strong>{scanResult.detectedValues.pH || 7.2}</strong></p>
                  <p>Nitrogen: <strong>{scanResult.detectedValues.nitrogen || 'Low'}</strong></p>
                  <p>Phosphorus: <strong>{scanResult.detectedValues.phosphorus || 'Medium'}</strong></p>
                  <p>Potassium: <strong>{scanResult.detectedValues.potassium || 'High'}</strong></p>
                </div>
              </div>
            )}
          </div>

          {/* OPTION 2: REQUEST EXPERT CHECKUP */}
          <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#D5E1D9] space-y-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-[#D5E1D9] pb-3">
              <UserCheck className="w-5 h-5 text-[#15803D]" />
              <span className="font-bold text-sm text-[#17211B] uppercase tracking-wider">
                2. REQUEST ON-FIELD SOIL CHECKUP
              </span>
            </div>

            <p className="text-xs text-[#405048] leading-relaxed font-medium">
              Don't have a recent report? Book an ICAR-certified LandVista agronomist to visit your parcel with GPS core drill equipment and issue a verified Soil Health Card.
            </p>

            <button
              onClick={() => setIsSoilModalOpen(true)}
              className="w-full py-3 rounded-xl bg-[#E8F5EC] hover:bg-[#D5EEDF] text-[#166534] font-bold text-xs uppercase border border-[#BDE3CC] transition-all flex items-center justify-center gap-2"
            >
              <span>Book Soil Expert Visit (₹499)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <SoilCheckupModal isOpen={isSoilModalOpen} onClose={() => setIsSoilModalOpen(false)} />
    </div>
  );
};
