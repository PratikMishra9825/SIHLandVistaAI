import React, { useState } from 'react';
import { 
  Camera, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Layers, 
  Eye, 
  ShieldCheck, 
  Zap, 
  Info 
} from 'lucide-react';
import { DataConfidenceBadge } from './DataConfidenceBadge';
import type { PhotoAnalysisResult } from '../types/land';

interface LandPhotoAnalysisProps {
  onAnalysisComplete?: (result: PhotoAnalysisResult) => void;
}

export const LandPhotoAnalysis: React.FC<LandPhotoAnalysisProps> = ({ onAnalysisComplete }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PhotoAnalysisResult | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setSelectedImage(url);
    runPhotoInference(url);
  };

  const runPhotoInference = (imgUrl: string) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    setTimeout(() => {
      const simulatedResult: PhotoAnalysisResult = {
        imageUrl: imgUrl,
        timestamp: new Date().toISOString(),
        detectedFeatures: {
          openLandDetected: true,
          vegetationDetected: true,
          structuresDetected: false,
          roadsDetected: true,
          constructionActivityDetected: false,
          visibleWaterDetected: false
        },
        surfaceCharacteristics: 'Semi-arid clay loam topsoil with sparse scrub vegetation',
        inferredSlope: 'Low gradient (< 3° slope)',
        visualConfidenceScore: 88,
        legalDisclaimer: 'Visual inference from uploaded photograph only indicates surface terrain characteristics. It does NOT establish boundary ownership, legal survey boundaries, or encumbrance-free status.'
      };

      setAnalysisResult(simulatedResult);
      setIsAnalyzing(false);
      if (onAnalysisComplete) {
        onAnalysisComplete(simulatedResult);
      }
    }, 1500);
  };

  return (
    <div className="bg-[#FFFFFF] p-6 rounded-3xl space-y-4 font-sans border border-[#D5E1D9] shadow-sm text-[#17211B]">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#D5E1D9] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#E8F5EC] text-[#15803D] flex items-center justify-center border border-[#BDE3CC]">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#166534] uppercase font-mono">GROUND PHOTO INGESTION</span>
              <DataConfidenceBadge type="USER_PROVIDED" label="GROUND PHOTO" />
            </div>
            <h3 className="font-bold text-base text-[#17211B]">
              Land Surface Feature Detection
            </h3>
          </div>
        </div>

        <DataConfidenceBadge type="AI_ESTIMATE" label="VISION CV INFERENCE" />
      </div>

      {/* Upload Box */}
      {!selectedImage ? (
        <div className="border-2 border-dashed border-[#D5E1D9] rounded-2xl p-6 text-center space-y-3 bg-[#F8FBF9] hover:border-[#15803D] transition-all">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F5EC] text-[#15803D] flex items-center justify-center mx-auto border border-[#BDE3CC]">
            <Upload className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-[#17211B]">
              Upload Ground / Drone Photo of the Land
            </h4>
            <p className="text-xs text-[#405048] font-medium">
              Accepts JPG, PNG. Detects open ground, vegetation, structures, and access tracks.
            </p>
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            id="ground-photo-input"
            className="hidden"
          />
          <label
            htmlFor="ground-photo-input"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold cursor-pointer transition-all shadow-sm"
          >
            <Camera className="w-4 h-4" />
            <span>Select Land Photograph</span>
          </label>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            
            {/* Image Preview */}
            <div className="sm:col-span-5 relative rounded-2xl overflow-hidden border border-[#D5E1D9] bg-[#F8FBF9] h-44">
              <img
                src={selectedImage}
                alt="Uploaded land parcel"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFFFFF] text-[10px] font-bold text-[#166534] border border-[#D5E1D9] shadow-sm">
                  GROUND PHOTO
                </span>
              </div>
            </div>

            {/* Inference Results */}
            <div className="sm:col-span-7 space-y-2.5">
              {isAnalyzing ? (
                <div className="h-full flex flex-col items-center justify-center space-y-2 text-center p-4">
                  <Zap className="w-6 h-6 text-[#15803D] animate-spin" />
                  <p className="text-xs font-bold text-[#15803D]">
                    Running Vision CV feature extraction...
                  </p>
                </div>
              ) : analysisResult ? (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-[#D5E1D9] pb-1.5">
                    <span className="font-bold text-[#17211B] flex items-center gap-1.5 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
                      Visual Inferences Detected
                    </span>
                    <span className="text-xs text-[#64736A] font-bold">Confidence: {analysisResult.visualConfidenceScore}%</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] flex items-center justify-between">
                      <span className="text-[#64736A]">Open Terrain:</span>
                      <span className="text-[#15803D] font-bold">Detected (85%+)</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] flex items-center justify-between">
                      <span className="text-[#64736A]">Vegetation:</span>
                      <span className="text-[#92400E] font-bold">Sparse Scrub</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] flex items-center justify-between">
                      <span className="text-[#64736A]">Structures:</span>
                      <span className="text-[#17211B] font-bold">None Visible</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] flex items-center justify-between">
                      <span className="text-[#64736A]">Slope:</span>
                      <span className="text-[#0284C7] font-bold">&lt; 3° Low Gradient</span>
                    </div>
                  </div>

                  {/* Legal Disclaimer */}
                  <div className="p-2.5 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] text-xs text-[#92400E] font-sans flex items-start gap-1.5 leading-snug font-medium">
                    <Info className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                    <span>{analysisResult.legalDisclaimer}</span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
