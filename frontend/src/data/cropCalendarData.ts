export interface CropDetails {
  id: string;
  name: string;
  hindiName: string;
  season: 'Kharif' | 'Rabi' | 'Zaid' | 'Perennial';
  sowingMonths: string;
  harvestMonths: string;
  waterRequirementMm: number; // mm
  soilSuitability: string[];
  optimalPhRange: [number, number];
  durationDays: number;
  expectedYieldQuintalsPerAcre: number;
  estimatedRevenuePerAcreRupees: number;
  estimatedCostPerAcreRupees: number;
  riskFactor: 'Low' | 'Medium' | 'High';
  waterEfficiency: 'High' | 'Moderate' | 'Low';
  advisoryTip: string;
}

export const CROP_DATABASE: CropDetails[] = [
  {
    id: 'crop-onion',
    name: 'Red Onion (Garwa / Late Kharif)',
    hindiName: 'लाल प्याज (गरवा)',
    season: 'Rabi',
    sowingMonths: 'Oct - Nov',
    harvestMonths: 'Mar - Apr',
    waterRequirementMm: 350,
    soilSuitability: ['Medium Black', 'Alluvial Loam', 'Sandy Loam'],
    optimalPhRange: [6.5, 7.8],
    durationDays: 120,
    expectedYieldQuintalsPerAcre: 110,
    estimatedRevenuePerAcreRupees: 165000,
    estimatedCostPerAcreRupees: 55000,
    riskFactor: 'Medium',
    waterEfficiency: 'High',
    advisoryTip: 'Ideal for Solapur and Nashik belts with drip irrigation. High storage longevity.'
  },
  {
    id: 'crop-soybean',
    name: 'Soybean (JS 335 / JS 9305)',
    hindiName: 'सोयाबीन',
    season: 'Kharif',
    sowingMonths: 'Jun - Jul',
    harvestMonths: 'Sep - Oct',
    waterRequirementMm: 450,
    soilSuitability: ['Medium Black', 'Deep Black', 'Alluvial'],
    optimalPhRange: [6.0, 7.5],
    durationDays: 95,
    expectedYieldQuintalsPerAcre: 10,
    estimatedRevenuePerAcreRupees: 48000,
    estimatedCostPerAcreRupees: 18000,
    riskFactor: 'Low',
    waterEfficiency: 'High',
    advisoryTip: 'Fixes atmospheric nitrogen, improving soil health for subsequent Rabi onion crops.'
  },
  {
    id: 'crop-pomegranate',
    name: 'Bhagwa Pomegranate (Agroforestry/Orchard)',
    hindiName: 'भगवा अनार',
    season: 'Perennial',
    sowingMonths: 'Jun - Aug',
    harvestMonths: 'Dec - Feb',
    waterRequirementMm: 600,
    soilSuitability: ['Medium Black', 'Murrum', 'Light Loam'],
    optimalPhRange: [6.5, 8.2],
    durationDays: 365,
    expectedYieldQuintalsPerAcre: 60,
    estimatedRevenuePerAcreRupees: 320000,
    estimatedCostPerAcreRupees: 90000,
    riskFactor: 'Medium',
    waterEfficiency: 'High',
    advisoryTip: 'Thrives in Solapur semi-arid climate with high export value to European and Middle Eastern markets.'
  },
  {
    id: 'crop-wheat',
    name: 'Wheat (Sharbati / Lokwan)',
    hindiName: 'गेहूं (लोकवान)',
    season: 'Rabi',
    sowingMonths: 'Nov - Dec',
    harvestMonths: 'Mar - Apr',
    waterRequirementMm: 400,
    soilSuitability: ['Alluvial', 'Deep Black', 'Clay Loam'],
    optimalPhRange: [6.0, 7.5],
    durationDays: 115,
    expectedYieldQuintalsPerAcre: 18,
    estimatedRevenuePerAcreRupees: 45000,
    estimatedCostPerAcreRupees: 16000,
    riskFactor: 'Low',
    waterEfficiency: 'Moderate',
    advisoryTip: 'Guaranteed MSP procurement through state FCI mandis with zero marketing risk.'
  },
  {
    id: 'crop-chickpea',
    name: 'Gram / Chickpea (Desi Chana - Digvijay)',
    hindiName: 'चना (दिग्विजय)',
    season: 'Rabi',
    sowingMonths: 'Oct - Nov',
    harvestMonths: 'Jan - Feb',
    waterRequirementMm: 220,
    soilSuitability: ['Medium Black', 'Loamy Soil'],
    optimalPhRange: [6.2, 7.8],
    durationDays: 100,
    expectedYieldQuintalsPerAcre: 9,
    estimatedRevenuePerAcreRupees: 52000,
    estimatedCostPerAcreRupees: 14000,
    riskFactor: 'Low',
    waterEfficiency: 'High',
    advisoryTip: 'Extremely drought-tolerant pulse crop requiring only 2 protective irrigations.'
  },
  {
    id: 'crop-moong',
    name: 'Green Gram (Moong - Summer Zaid)',
    hindiName: 'ग्रीन मूंग दाल',
    season: 'Zaid',
    sowingMonths: 'Mar - Apr',
    harvestMonths: 'May - Jun',
    waterRequirementMm: 200,
    soilSuitability: ['Alluvial', 'Loam'],
    optimalPhRange: [6.5, 7.5],
    durationDays: 65,
    expectedYieldQuintalsPerAcre: 6,
    estimatedRevenuePerAcreRupees: 42000,
    estimatedCostPerAcreRupees: 12000,
    riskFactor: 'Low',
    waterEfficiency: 'High',
    advisoryTip: 'Quick 60-day cash crop utilizing post-harvest residual moisture.'
  }
];
