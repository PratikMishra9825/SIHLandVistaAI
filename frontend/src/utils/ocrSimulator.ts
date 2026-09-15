import { SoilData } from '../types/land';

export interface OCRResult {
  detectedValues: Partial<SoilData>;
  rawExtractedText: string;
  confidenceScore: number;
  warnings: string[];
}

export async function simulateSoilCardOCR(file: File): Promise<OCRResult> {
  // Simulate realistic network/processing latency
  await new Promise((resolve) => setTimeout(resolve, 1800));

  const fileName = file.name.toLowerCase();

  // If filename looks like Solapur or generic soil card
  return {
    detectedValues: {
      pH: 7.2,
      nitrogen: 'Low',
      nitrogenValue: 185,
      phosphorus: 'Medium',
      phosphorusValue: 18,
      potassium: 'High',
      potassiumValue: 310,
      organicCarbon: 0.42,
      moisture: 18,
      ec: 0.45,
      soilType: 'Medium Black / Clay Loam',
      source: 'verified',
      healthScore: 68,
    },
    rawExtractedText: `[GOVERNMENT OF INDIA - SOIL HEALTH CARD]
Lab Sample ID: SHC-MH-2024-99812
Village / Taluka: South Solapur, Maharashtra
GPS Location: 17.6599° N, 75.9064° E
Parameters Tested:
pH (1:2.5 suspension): 7.2 (Neutral to Slightly Alkaline)
Electrical Conductivity (EC): 0.45 dS/m (Normal)
Organic Carbon (OC): 0.42% (Low - Needs compost enrichment)
Available Nitrogen (N): 185 kg/ha (Low)
Available Phosphorus (P2O5): 18 kg/ha (Medium)
Available Potassium (K2O): 310 kg/ha (High)
Micro-nutrients: Zinc 0.58 ppm (Deficient), Boron 0.45 ppm (Marginal)`,
    confidenceScore: 94,
    warnings: [
      'Nitrogen deficiency detected: Recommend FYM organic manure or neem-coated urea @ 45 kg/acre.',
      'Organic carbon is below critical threshold of 0.5%: Recommend green manuring with Dhaincha.'
    ]
  };
}
