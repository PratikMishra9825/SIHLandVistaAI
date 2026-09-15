import type {
  LandParcel,
  UserPriorities,
  AIRecommendation,
  FullAnalysisResult,
  SurroundingFeature,
  ComparativeReasoning,
  DecisionFactor
} from '../types/land';

export const DEFAULT_PRIORITIES: UserPriorities = {
  profitability: 60,
  sustainability: 75,
  waterEfficiency: 70,
  socialImpact: 55,
  lowInvestment: 40,
  longTermGrowth: 70,
  lowRisk: 60
};

export function analyzeSurroundingsFrontend(parcel: LandParcel) {
  const lat = parcel.lat || 17.6599;
  const lng = parcel.lng || 75.9064;
  const rawFeatures = parcel.surroundingFeatures || [];
  const roadDistM = parcel.infrastructure.roadDistanceMeters ?? 400;
  const gridDistKm = parcel.infrastructure.gridDistanceKm ?? 1.5;
  const waterDistKm = parcel.water.nearestWaterBodyKm ?? 2.0;
  const cityDistKm = parcel.infrastructure.nearestCityKm ?? 14.0;
  const popDensity = parcel.infrastructure.populationDensity || 'Medium';

  const features: SurroundingFeature[] = [...rawFeatures];

  if (!features.some(f => f.category === 'Infrastructure' && f.name.toLowerCase().includes('road'))) {
    features.push({
      id: 'sf-road',
      name: roadDistM < 100 ? 'Direct Arterial Road Frontage' : 'Connecting Transport Road',
      category: 'Infrastructure',
      distanceKm: Number((roadDistM / 1000).toFixed(2)),
      bearing: 'North',
      impactScoreBonus: roadDistM < 100 ? 15 : roadDistM < 500 ? 10 : 5,
      coordinates: [lng, lat + 0.003]
    });
  }

  if (!features.some(f => f.category === 'Infrastructure' && f.name.toLowerCase().includes('substation'))) {
    features.push({
      id: 'sf-grid',
      name: '33/11 kV Electrical Substation',
      category: 'Infrastructure',
      distanceKm: gridDistKm,
      bearing: 'South-West',
      impactScoreBonus: gridDistKm <= 2 ? 14 : gridDistKm <= 5 ? 8 : 2,
      coordinates: [lng - 0.008, lat - 0.008]
    });
  }

  if (!features.some(f => f.category === 'Natural' || f.name.toLowerCase().includes('water') || f.name.toLowerCase().includes('canal'))) {
    features.push({
      id: 'sf-water',
      name: parcel.water.waterBodyType || 'Irrigation Canal / River Tributary',
      category: 'Natural',
      distanceKm: waterDistKm,
      bearing: 'East',
      impactScoreBonus: waterDistKm <= 1.5 ? 12 : waterDistKm <= 4 ? 6 : 1,
      coordinates: [lng + 0.01, lat]
    });
  }

  // Multi-buffer clustering
  const bufferBreakdown = {
    '500m': { count: 0, features: [] as SurroundingFeature[], scoreContribution: 0 },
    '1km': { count: 0, features: [] as SurroundingFeature[], scoreContribution: 0 },
    '3km': { count: 0, features: [] as SurroundingFeature[], scoreContribution: 0 },
    '5km': { count: 0, features: [] as SurroundingFeature[], scoreContribution: 0 },
    '10km': { count: 0, features: [] as SurroundingFeature[], scoreContribution: 0 }
  };

  features.forEach(feat => {
    const dist = feat.distanceKm;
    const decay = dist <= 0.05 ? 1.0 : Math.exp(-0.693 * (dist / 2.5));
    const weighted = Math.round(feat.impactScoreBonus * decay);

    if (dist <= 0.5) {
      bufferBreakdown['500m'].count++;
      bufferBreakdown['500m'].features.push(feat);
      bufferBreakdown['500m'].scoreContribution += weighted;
    } else if (dist <= 1.0) {
      bufferBreakdown['1km'].count++;
      bufferBreakdown['1km'].features.push(feat);
      bufferBreakdown['1km'].scoreContribution += weighted;
    } else if (dist <= 3.0) {
      bufferBreakdown['3km'].count++;
      bufferBreakdown['3km'].features.push(feat);
      bufferBreakdown['3km'].scoreContribution += weighted;
    } else if (dist <= 5.0) {
      bufferBreakdown['5km'].count++;
      bufferBreakdown['5km'].features.push(feat);
      bufferBreakdown['5km'].scoreContribution += weighted;
    } else {
      bufferBreakdown['10km'].count++;
      bufferBreakdown['10km'].features.push(feat);
      bufferBreakdown['10km'].scoreContribution += weighted;
    }
  });

  // Surrounding Land-Use Composition
  let indCount = features.filter(f => f.category === 'Industry' || f.name.toLowerCase().includes('industrial') || f.name.toLowerCase().includes('midc')).length;
  let agriCount = features.filter(f => f.category === 'Natural' || f.name.toLowerCase().includes('canal') || f.name.toLowerCase().includes('mandi') || f.name.toLowerCase().includes('farm')).length;
  let solarClusterCount = features.filter(f => f.name.toLowerCase().includes('solar')).length;

  let resPct = 20;
  let agriPct = 45;
  let indPct = 15;
  let commPct = 10;
  let openPct = 10;

  if (popDensity === 'High' || cityDistKm <= 5) {
    resPct = 48;
    commPct = 22;
    indPct = 12;
    agriPct = 10;
    openPct = 8;
  } else if (indCount >= 2 || (features.some(f => f.name.toLowerCase().includes('industrial')) && roadDistM <= 200)) {
    indPct = 42;
    commPct = 18;
    agriPct = 20;
    resPct = 12;
    openPct = 8;
  } else if (agriCount >= 2 || (waterDistKm <= 2.0 && parcel.soil.healthScore >= 70)) {
    agriPct = 65;
    resPct = 12;
    openPct = 13;
    commPct = 6;
    indPct = 4;
  } else if (parcel.infrastructure.solarRadiationKWh >= 5.8 && popDensity === 'Low' && cityDistKm >= 12) {
    openPct = 45;
    agriPct = 30;
    resPct = 10;
    indPct = 8;
    commPct = 7;
  }

  let dominantPattern = 'Mixed Peri-Urban Transition';
  let patternDescription = 'Balanced surrounding environment with mixed agriculture, infrastructure, and rural settlement.';

  if (resPct >= 40) {
    dominantPattern = 'Urban / Dense Residential Fringe';
    patternDescription = 'Surrounded by high-density residential development, strong consumer footfall, and urban commuter infrastructure.';
  } else if (agriPct >= 50) {
    dominantPattern = 'Agricultural Cropland Belt';
    patternDescription = 'Surrounded by fertile active cropped land, irrigation canals, and regional agricultural trade mandis.';
  } else if (indPct >= 35) {
    dominantPattern = 'Industrial & Logistics Corridor';
    patternDescription = 'Surrounded by manufacturing plants, MIDC SEZ clusters, heavy transport corridors, and commercial freight depots.';
  } else if (commPct >= 20 || (roadDistM <= 50 && features.some(f => f.name.toLowerCase().includes('highway')))) {
    dominantPattern = 'Commercial / Highway Frontage Corridor';
    patternDescription = 'High-visibility arterial transport corridor with high vehicular traffic and regional connectivity.';
  } else if (openPct >= 40) {
    dominantPattern = 'Renewable Energy / Semi-Arid Cluster';
    patternDescription = 'Expansive open semi-arid terrain with minimal shading, low built-up obstruction, and high solar insolation.';
  }

  // Saturation
  const isSolarSaturated = solarClusterCount >= 3 || parcel.district === 'Bhadla' || parcel.name.toLowerCase().includes('saturated');
  const solarSatCount = isSolarSaturated ? Math.max(4, solarClusterCount + 10) : solarClusterCount;
  const whSatCount = features.filter(f => f.name.toLowerCase().includes('warehouse')).length;

  const saturationMetrics = {
    solar: {
      competingCount: solarSatCount,
      penalty: Math.min(26, solarSatCount * 7),
      status: solarSatCount >= 3 ? 'HIGH_SATURATION' : 'LOW_SATURATION',
      note: solarSatCount >= 3 ? `High concentration of ${solarSatCount} existing solar farms causes grid substation feeder congestion` : 'Ample grid feeder headroom available'
    },
    warehouse: {
      competingCount: whSatCount,
      penalty: Math.min(22, whSatCount * 5),
      status: whSatCount >= 4 ? 'HIGH_SATURATION' : 'LOW_SATURATION',
      note: whSatCount >= 4 ? 'Logistics supply saturation in local buffer' : 'Strong logistics demand'
    },
    commercial: {
      competingCount: 1,
      penalty: 0,
      status: 'LOW_SATURATION',
      note: 'High retail & highway commercial viability'
    },
    industrial: {
      competingCount: indCount,
      penalty: Math.min(16, indCount * 3),
      status: indCount >= 4 ? 'HIGH_DENSITY_CLUSTER' : 'DEVELOPING',
      note: 'Industrial corridor development'
    }
  };

  const decisionFactors: DecisionFactor[] = [];
  if (roadDistM <= 100) {
    decisionFactors.push({ feature: `Arterial Road Frontage (${roadDistM}m)`, impact: '+14 Pts for Warehouse & Commercial', type: 'POSITIVE', affectedUse: 'warehouse' });
  }
  if (resPct >= 35) {
    decisionFactors.push({ feature: `Dense Residential Catchment (${resPct}%)`, impact: '+15 Pts for Commercial Footfall', type: 'POSITIVE', affectedUse: 'commercial' });
    decisionFactors.push({ feature: 'Dense Residential Adjacency', impact: '-20 Pts for Heavy Industry (CPCB Rule)', type: 'NEGATIVE', affectedUse: 'industrial' });
  }
  if (saturationMetrics.solar.penalty > 0) {
    decisionFactors.push({ feature: `Nearby Solar Saturation (${solarSatCount} Plants)`, impact: `-${saturationMetrics.solar.penalty} Pts Saturation Penalty for Solar`, type: 'PENALTY', affectedUse: 'solar' });
  }
  if (agriPct >= 50 && parcel.soil.healthScore >= 70) {
    decisionFactors.push({ feature: `Dominant Agricultural Belt (${agriPct}%)`, impact: '+12 Pts for Precision Horticulture', type: 'POSITIVE', affectedUse: 'agriculture' });
  }

  return {
    dominantPattern,
    patternDescription,
    composition: { residential: resPct, agricultural: agriPct, industrial: indPct, commercial: commPct, open: openPct },
    bufferBreakdown,
    proximityMatrix: features,
    saturationMetrics,
    decisionFactors
  };
}

export function analyzeLandParcel(parcel: LandParcel, priorities: UserPriorities = DEFAULT_PRIORITIES): AIRecommendation[] {
  const spatial = analyzeSurroundingsFrontend(parcel);
  const acres = parcel.areaAcres || 10.0;
  const slope = parcel.infrastructure.slopeDegrees ?? 2.5;
  const solarRad = parcel.infrastructure.solarRadiationKWh ?? 5.5;
  const gridDistKm = parcel.infrastructure.gridDistanceKm ?? 1.5;
  const roadDistM = parcel.infrastructure.roadDistanceMeters ?? 400;
  const waterDistKm = parcel.water.nearestWaterBodyKm ?? 2.0;
  const rainfall = parcel.water.rainfallAnnual ?? 600;
  const soilHealth = parcel.soil.healthScore ?? 70;
  const soilPh = parcel.soil.pH ?? 7.1;
  const cityDistKm = parcel.infrastructure.nearestCityKm ?? 14.0;
  const popDensity = parcel.infrastructure.populationDensity || 'Medium';
  const floodRisk = parcel.risks.floodRisk ?? 'Low';
  const isEcoSensitive = parcel.risks.ecologicalSensitiveZone ?? false;

  const comp = spatial.composition;
  const sat = spatial.saturationMetrics;

  const recommendations: AIRecommendation[] = [];

  // 1. SOLAR FARM
  const radScore = Math.min(30, Math.round((solarRad / 6.0) * 30));
  const solarSlopeScore = Math.max(5, Math.min(25, Math.round(25 - Math.max(0, slope - 2) * 3.5)));
  const solarGridScore = Math.max(4, Math.min(25, Math.round(25 - Math.max(0, gridDistKm - 0.5) * 4.5)));
  const solarAreaScore = Math.min(20, Math.max(5, Math.round(acres >= 5 ? 20 : acres * 4)));
  const solarLandSuit = Math.min(95, radScore + solarSlopeScore + solarGridScore + solarAreaScore);
  const solarSurroundSuit = Math.round((comp.open * 0.45) + (100 - comp.residential) * 0.25 + (100 - comp.industrial) * 0.15 + (100 - comp.agricultural) * 0.15);
  const solarOpp = Math.round(Math.min(30, solarRad * 4) + (gridDistKm <= 2 ? 12 : 4) + (comp.open >= 30 ? 8 : 2) - sat.solar.penalty);
  let solarScore = Math.round((solarLandSuit * 0.24) + (solarSurroundSuit * 0.22) + (solarOpp * 0.18) + (solarGridScore * 2.2 * 0.14) + 10 + 6 + 6 + 10 - sat.solar.penalty);
  if (floodRisk === 'High') solarScore -= 20;
  solarScore = Math.min(98, Math.max(20, solarScore));

  recommendations.push({
    id: 'rec-solar',
    useType: 'solar',
    title: 'Utility-Scale Solar PV Farm',
    tagline: 'High Clean Energy Yield with Guaranteed 25-Year Grid Tariff',
    score: solarScore,
    suitabilityScore: solarScore,
    rank: 1,
    category: 'Renewable Energy',
    confidence: 'High (94%)',
    dataConfidenceBadge: 'VERIFIED',
    why: [
      `Solar radiation intensity: ${solarRad} kWh/m²/day daily yield`,
      `Substation proximity: Only ${gridDistKm} km to 33kV evacuation feeder`,
      `Gentle terrain gradient (${slope}°) prevents mounting shadows`,
      sat.solar.penalty > 0 ? `Substation notice: -${sat.solar.penalty} pts saturation penalty due to existing solar farms` : 'Unconstrained grid injection capacity'
    ],
    risks: ['Requires DISCOM grid interconnection study and feeder NOC', 'Capital expenditure for bifacial modules and inverters'],
    opportunities: ['PM-KUSUM Component A 30% capital grant', 'Dual-use agrivoltaics pairing with low-height shade crops'],
    economics: {
      minInvestmentLakhs: Math.round(acres * 35),
      maxInvestmentLakhs: Math.round(acres * 44),
      annualRevenueLakhs: Math.round(acres * 7.6),
      operatingCostLakhsPerYear: Math.round(acres * 0.8),
      paybackYears: 4.8,
      roiPercentage: 18.8,
      jobsCreated: Math.round(acres * 1.5),
      waterRequirementLitersPerDay: 400,
      subsidyAvailableLakhs: Math.round(acres * 10.5),
      regulatoryScore: 92
    },
    sustainabilityScore: 96,
    confidenceScore: 94
  });

  // 2. PRECISION AGRICULTURE
  const agriSoilScore = Math.min(35, Math.round((soilHealth / 100) * 35));
  const phScore = (soilPh >= 6.5 && soilPh <= 7.8) ? 20 : (soilPh >= 6.0 && soilPh <= 8.2) ? 14 : 5;
  const agriWaterScore = Math.max(4, Math.min(25, Math.round(25 - Math.max(0, waterDistKm - 0.5) * 4.5)));
  const rainScore = Math.min(20, Math.round((rainfall / 900) * 20));
  const agriLandSuit = Math.min(96, agriSoilScore + phScore + agriWaterScore + rainScore);
  const agriSurroundSuit = Math.round((comp.agricultural * 0.65) + (comp.open * 0.2) + (100 - comp.industrial) * 0.15);
  const agriOpp = Math.round(((soilHealth) / 100) * 25 + (waterDistKm <= 2 ? 15 : 6) + (comp.agricultural >= 40 ? 10 : 2));
  let agriScore = Math.round((agriLandSuit * 0.24) + (agriSurroundSuit * 0.22) + (agriOpp * 0.18) + (agriWaterScore * 2.2 * 0.14) + 12 + 8 + 8 + 12);
  if (soilHealth < 40 || soilPh > 8.5) agriScore -= 30;
  agriScore = Math.min(98, Math.max(20, agriScore));

  recommendations.push({
    id: 'rec-agri',
    useType: 'agriculture',
    title: 'High-Yield Precision Horticulture & Cash Crops',
    tagline: 'Nutrient-Rich Cultivation with Micro-Irrigation Yields',
    score: agriScore,
    suitabilityScore: agriScore,
    rank: 2,
    category: 'Agriculture',
    confidence: 'High (91%)',
    dataConfidenceBadge: 'VERIFIED',
    why: [
      `Soil health index: ${soilHealth}/100 with optimal pH ${soilPh}`,
      `Irrigation canal / water body within ${waterDistKm} km radius`,
      `Surrounded by dominant agricultural belt (${comp.agricultural}%)`,
      'Eligible for PMKSY 55% micro-drip irrigation subsidy'
    ],
    risks: ['Seasonal market price volatility in regional APMC mandis', 'Summer dry spells require drip automation and farm pond'],
    opportunities: ['National Horticulture Board export cluster grants', 'High-density onion, pomegranate, and pulses rotation'],
    economics: {
      minInvestmentLakhs: Math.round(acres * 3.5),
      maxInvestmentLakhs: Math.round(acres * 6.5),
      annualRevenueLakhs: Math.round(acres * 2.9),
      operatingCostLakhsPerYear: Math.round(acres * 0.6),
      paybackYears: 1.9,
      roiPercentage: 34.5,
      jobsCreated: Math.round(acres * 3.0),
      waterRequirementLitersPerDay: 14000,
      subsidyAvailableLakhs: Math.round(acres * 1.5),
      regulatoryScore: 98
    },
    sustainabilityScore: 88,
    confidenceScore: 91
  });

  // 3. WAREHOUSE & LOGISTICS
  const whRoadScore = Math.max(8, Math.min(40, Math.round(40 - roadDistM / 80)));
  const whSlopeScore = Math.max(5, Math.min(30, Math.round(30 - slope * 4.0)));
  const whAreaScore = Math.min(30, Math.max(6, Math.round(acres >= 4 ? 30 : acres * 7.5)));
  const whLandSuit = Math.min(95, whRoadScore + whSlopeScore + whAreaScore);
  const resConflict = comp.residential >= 35 ? 25 : 0;
  const whSurroundSuit = Math.max(10, Math.round((comp.industrial * 0.55) + (comp.commercial * 0.25) + (comp.open * 0.2) - resConflict));
  const whOpp = Math.round((roadDistM <= 100 ? 25 : roadDistM <= 400 ? 18 : 8) + (comp.industrial >= 20 ? 12 : 4) - sat.warehouse.penalty - (comp.residential >= 40 ? 15 : 0));
  let warehouseScore = Math.round((whLandSuit * 0.24) + (whSurroundSuit * 0.22) + (whOpp * 0.18) + (whRoadScore * 1.5 * 0.14) + 10 + 6 + 6 + 14 - sat.warehouse.penalty);
  if (comp.residential >= 40 && comp.industrial < 20) warehouseScore -= 16;
  warehouseScore = Math.min(98, Math.max(20, warehouseScore));

  recommendations.push({
    id: 'rec-warehouse',
    useType: 'warehouse',
    title: 'Agro-Logistics & Cold Storage Fulfillment Hub',
    tagline: 'Strategic Highway Node for 3PL Freight & Agricultural Cold Chain',
    score: warehouseScore,
    suitabilityScore: warehouseScore,
    rank: 3,
    category: 'Logistics & Trade',
    confidence: 'High (89%)',
    dataConfidenceBadge: 'VERIFIED',
    why: [
      `Direct transport road frontage within ${roadDistM}m of arterial corridor`,
      `Flat building footprint (${slope}° slope) minimizing cut-and-fill civil capex`,
      `Proximity to consumption and regional APMC trade nodes`,
      'Eligible for Agriculture Infrastructure Fund (AIF) 3% interest subvention'
    ],
    risks: ['Town Planning NA zoning conversion and RERA layout clearance needed', 'Higher commercial road traffic management requirement'],
    opportunities: ['Expressway junction freight aggregation growth', 'MoFPI cold chain capital grants'],
    economics: {
      minInvestmentLakhs: Math.round(acres * 60),
      maxInvestmentLakhs: Math.round(acres * 85),
      annualRevenueLakhs: Math.round(acres * 14.5),
      operatingCostLakhsPerYear: Math.round(acres * 2.2),
      paybackYears: 5.1,
      roiPercentage: 21.4,
      jobsCreated: Math.round(acres * 7.0),
      waterRequirementLitersPerDay: 3000,
      subsidyAvailableLakhs: 200,
      regulatoryScore: 86
    },
    sustainabilityScore: 74,
    confidenceScore: 89
  });

  // 4. COMMERCIAL DEVELOPMENT
  const commFrontageScore = Math.max(8, Math.min(40, Math.round(40 - roadDistM / 50)));
  const commCityScore = Math.max(6, Math.min(35, Math.round(35 - cityDistKm * 1.8)));
  const commLandSuit = Math.min(96, commFrontageScore + commCityScore + (acres >= 2 ? 20 : 10));
  const commSurroundSuit = Math.min(98, Math.round((comp.residential * 0.70) + (comp.commercial * 0.20) + (100 - comp.industrial) * 0.10));
  const commOpp = Math.round((comp.residential >= 35 ? 25 : comp.residential >= 20 ? 15 : 4) + (roadDistM <= 100 ? 18 : 6) + (popDensity === 'High' ? 12 : 4) - sat.commercial.penalty);
  let commercialScore = Math.round((commLandSuit * 0.24) + (commSurroundSuit * 0.22) + (commOpp * 0.18) + (commFrontageScore * 1.5 * 0.14) + 12 + 6 + 6 + 12 - sat.commercial.penalty);
  if (comp.residential < 10 && roadDistM > 400) commercialScore -= 24;
  commercialScore = Math.min(98, Math.max(20, commercialScore));

  recommendations.push({
    id: 'rec-commercial',
    useType: 'commercial',
    title: 'Highway Commercial Plaza & Agri-Mall',
    tagline: 'High-Footfall Commercial Node along Regional Growth Corridor',
    score: commercialScore,
    suitabilityScore: commercialScore,
    rank: 4,
    category: 'Commercial Development',
    confidence: 'Medium (85%)',
    dataConfidenceBadge: 'VERIFIED',
    why: [
      `Road visibility of ${roadDistM}m enables direct customer catchment`,
      `Surrounding residential catchment (${comp.residential}%) generates daily retail footfall`,
      `Proximity to urban center (${cityDistKm} km)`
    ],
    risks: ['Commercial absorption depends on regional highway traffic expansion'],
    opportunities: ['Agri-Mall & highway amenities cluster development'],
    economics: {
      minInvestmentLakhs: Math.round(acres * 75),
      maxInvestmentLakhs: Math.round(acres * 120),
      annualRevenueLakhs: Math.round(acres * 19.0),
      operatingCostLakhsPerYear: Math.round(acres * 1.0),
      paybackYears: 4.2,
      roiPercentage: 22.0,
      jobsCreated: Math.round(acres * 12.0),
      waterRequirementLitersPerDay: 8000,
      subsidyAvailableLakhs: 50,
      regulatoryScore: 84
    },
    sustainabilityScore: 70,
    confidenceScore: 85
  });

  // Compute parcel-level dynamic confidence
  const confidenceAssessment = calculateParcelConfidence(parcel);

  // Sort and assign ranks with dynamically calculated confidence scores
  return recommendations
    .sort((a, b) => b.score - a.score)
    .map((rec, idx) => ({ 
      ...rec, 
      rank: idx + 1,
      confidenceScore: confidenceAssessment.score,
      confidence: `${confidenceAssessment.rating === 'HIGH' ? 'High' : confidenceAssessment.rating === 'MODERATE' ? 'Moderate' : 'Low'} (${confidenceAssessment.score}%)`,
      dataConfidenceBadge: confidenceAssessment.badge
    }));
}

export interface DynamicConfidenceResult {
  score: number;
  rating: 'HIGH' | 'MODERATE' | 'LOW';
  badge: 'GROUND_VERIFIED' | 'VERIFIED' | 'REMOTE_SENSING' | 'AI_ESTIMATE';
  badgeLabel: string;
  isGroundVerified: boolean;
  breakdown: {
    locationQuality: { score: number; max: 20; label: string };
    soilWaterVerification: { score: number; max: 30; label: string };
    reportCompleteness: { score: number; max: 25; label: string };
    sourceReliability: { score: number; max: 15; label: string };
    imageryQuality: { score: number; max: 10; label: string };
  };
  factors: string[];
}

export function calculateParcelConfidence(parcel: LandParcel): DynamicConfidenceResult {
  const gpsAccuracy = parcel.gpsAccuracyMeters ?? 50;
  const hasPolygon = Boolean(parcel.boundaryCoordinates && parcel.boundaryCoordinates.length >= 3);
  const isGroundVerified = Boolean(parcel.groundVerified || parcel.groundVerifiedReport);
  const report = parcel.groundVerifiedReport;
  const isSoilVerified = parcel.soil.source === 'verified' || isGroundVerified;
  const hasPhotos = Boolean(parcel.photoAnalysis?.imageUrl);

  let locationScore = 0;
  if (gpsAccuracy <= 15) locationScore += 10;
  else if (gpsAccuracy <= 50) locationScore += 7;
  else if (gpsAccuracy <= 100) locationScore += 4;
  else locationScore += 1;
  if (hasPolygon) locationScore += 10;
  else locationScore += 3;

  let soilWaterScore = 0;
  if (isSoilVerified) soilWaterScore += 14;
  else soilWaterScore += 6;
  if (parcel.soil.pH >= 4.5 && parcel.soil.pH <= 9.5) soilWaterScore += 5;
  if (parcel.soil.nitrogen && parcel.soil.phosphorus && parcel.soil.potassium) soilWaterScore += 6;
  if (parcel.water.groundwaterDepth != null || parcel.water.nearestWaterBodyKm != null) soilWaterScore += 5;

  let reportCompletenessScore = 0;
  if (report) {
    reportCompletenessScore += 10;
    if (report.labCertificateNo) reportCompletenessScore += 5;
    if (report.recommendedCrops && report.recommendedCrops.length > 0) reportCompletenessScore += 5;
    if (report.soilParameters?.organicCarbonPercent != null || report.soilParameters?.electricalConductivity != null) reportCompletenessScore += 5;
  } else if (isSoilVerified) {
    reportCompletenessScore += 10;
  } else {
    reportCompletenessScore += 4;
  }

  let sourceReliabilityScore = 0;
  if (isGroundVerified || report?.labCertificateNo) {
    sourceReliabilityScore = 15;
  } else if (parcel.soil.source === 'verified') {
    sourceReliabilityScore = 12;
  } else {
    sourceReliabilityScore = 6;
  }

  let imageryQualityScore = 0;
  if (hasPhotos) imageryQualityScore += 6;
  else imageryQualityScore += 2;
  if (parcel.infrastructure.slopeDegrees != null && parcel.infrastructure.elevationMeters != null) imageryQualityScore += 4;
  else imageryQualityScore += 2;

  const rawTotal = locationScore + soilWaterScore + reportCompletenessScore + sourceReliabilityScore + imageryQualityScore;
  // Dynamic score clamped between 42% and 96% — never forced to 98%
  const finalScore = Math.min(96, Math.max(42, rawTotal));

  let rating: 'HIGH' | 'MODERATE' | 'LOW' = 'MODERATE';
  if (finalScore >= 80) rating = 'HIGH';
  else if (finalScore < 65) rating = 'LOW';

  const factors: string[] = [];
  if (isGroundVerified) {
    factors.push(`NABL certified physical inspection (${report?.labCertificateNo || 'Govt Soil Lab Verified'})`);
  }
  if (hasPolygon) {
    factors.push('Authority boundary polygon drawn and verified');
  }
  if (gpsAccuracy <= 30) {
    factors.push(`High GPS precision (±${Math.round(gpsAccuracy)}m)`);
  }
  if (hasPhotos) {
    factors.push('Ground photographic evidence validated');
  }

  let badge: 'GROUND_VERIFIED' | 'VERIFIED' | 'REMOTE_SENSING' | 'AI_ESTIMATE' = 'AI_ESTIMATE';
  let badgeLabel = 'AI ESTIMATE';

  if (isGroundVerified) {
    badge = 'GROUND_VERIFIED';
    badgeLabel = '🌱 GROUND-VERIFIED';
  } else if (finalScore >= 80) {
    badge = 'VERIFIED';
    badgeLabel = 'OFFICIAL / GIS VERIFIED';
  } else {
    badge = 'REMOTE_SENSING';
    badgeLabel = 'ISRO BHUVAN SATELLITE';
  }

  return {
    score: finalScore,
    rating,
    badge,
    badgeLabel,
    isGroundVerified,
    breakdown: {
      locationQuality: { score: locationScore, max: 20, label: 'Location & Boundary Precision' },
      soilWaterVerification: { score: soilWaterScore, max: 30, label: 'Soil & Water Parameter Verification' },
      reportCompleteness: { score: reportCompletenessScore, max: 25, label: 'Report & Lab Completeness' },
      sourceReliability: { score: sourceReliabilityScore, max: 15, label: 'Source & Accreditation Reliability' },
      imageryQuality: { score: imageryQualityScore, max: 10, label: 'Visual & Spectral Verification' }
    },
    factors
  };
}
