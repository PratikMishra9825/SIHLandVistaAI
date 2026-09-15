export type LandUseType = 
  | 'solar'
  | 'warehouse'
  | 'agriculture'
  | 'housing'
  | 'industrial'
  | 'commercial'
  | 'public_infra'
  | 'agro_processing'
  | 'recreation_park'
  | 'agroforestry';

export type DataConfidenceType = 
  | 'GROUND_VERIFIED'
  | 'VERIFIED'
  | 'USER_PROVIDED'
  | 'REMOTE_SENSING'
  | 'AI_ESTIMATE'
  | 'SIMULATION'
  | 'DEMO'
  | 'UNAVAILABLE';

export interface SoilData {
  pH: number;
  nitrogen: 'Low' | 'Medium' | 'High';
  phosphorus: 'Low' | 'Medium' | 'High';
  potassium: 'Low' | 'Medium' | 'High';
  organicCarbon: number;
  moisture: number;
  ec: number;
  soilType: string;
  source: 'verified' | 'ocr' | 'estimated' | 'user';
  healthScore: number;
  nitrogenValue?: number;
  phosphorusValue?: number;
  potassiumValue?: number;
}

export interface WaterData {
  availability: 'Low' | 'Medium' | 'High' | 'Very High';
  groundwaterDepth: number;
  rainfallAnnual: number;
  nearestWaterBodyKm: number;
  waterBodyType: string;
  irrigationAccess: boolean;
  seasonalWaterStress: 'Low' | 'Moderate' | 'High' | 'Severe' | string;
  rainwaterHarvestingPotential: 'Low' | 'Medium' | 'High';
  score: number;
  seasonalMonthlyRainfallMm?: number[];
}

export interface InfrastructureData {
  roadAccessQuality: 'Excellent' | 'Good' | 'Moderate' | 'Poor';
  roadDistanceMeters: number;
  gridDistanceKm: number;
  substationCapacityKVA: number;
  railwayDistanceKm: number;
  nearestCityKm: number;
  populationDensity: 'Low' | 'Medium' | 'High';
  zoning: string;
  elevationMeters: number;
  slopeDegrees: number;
  solarRadiationKWh: number;
}

export interface LandOccupancyAssessment {
  status: 'PREDOMINANTLY_OPEN' | 'PARTIALLY_UTILIZED' | 'CONSTRUCTION_DETECTED' | 'PREDOMINANTLY_BUILT_UP' | 'INSUFFICIENT_EVIDENCE';
  openAreaPercentage: number;
  builtUpPercentage: number;
  vegetationPercentage: number;
  confidencePercentage: number;
  disclaimer: string;
}

export interface HistoricalActivityObservation {
  year: number;
  observationDate: string;
  satelliteSensor: string;
  openLandPersistence: 'High' | 'Moderate' | 'Low';
  vegetationIndexNDVI: number;
  builtUpDetected: boolean;
  constructionIndication: 'None' | 'Detected' | 'Active';
  summaryNote: string;
  confidence: number;
}

export interface SurroundingFeature {
  id: string;
  name: string;
  category: 'Infrastructure' | 'Industry' | 'Commercial' | 'Residential' | 'Natural' | 'Civic';
  distanceKm: number;
  bearing: string;
  impactScoreBonus: number;
  coordinates: [number, number];
}

export interface DecisionFactor {
  feature: string;
  impact: string;
  type: 'POSITIVE' | 'NEGATIVE' | 'PENALTY';
  affectedUse: LandUseType;
}

export interface RAGEvidenceItem {
  documentId: string;
  documentTitle: string;
  authority: string;
  source: string;
  dateVersion: string;
  category: string;
  relevanceScore: number;
  rulePassed: boolean;
  evidenceSummary: string;
  appliedRule: string;
}

export interface ComparativeReasoning {
  useType: LandUseType;
  title: string;
  score: number;
  reason: string;
}

export interface SurroundingComposition {
  residential: number;
  agricultural: number;
  industrial: number;
  commercial: number;
  open: number;
}

export interface SurroundingPatternData {
  dominantPattern: string;
  patternDescription: string;
  composition: SurroundingComposition;
}

export interface SaturationInfo {
  competingCount: number;
  penalty: number;
  status: string;
  note: string;
}

export interface SaturationMetricsData {
  solar: SaturationInfo;
  warehouse: SaturationInfo;
  commercial: SaturationInfo;
  industrial: SaturationInfo;
}

export interface BufferTierData {
  count: number;
  features: SurroundingFeature[];
  scoreContribution: number;
}

export interface BufferBreakdownData {
  '500m': BufferTierData;
  '1km': BufferTierData;
  '3km': BufferTierData;
  '5km': BufferTierData;
  '10km': BufferTierData;
}

export interface PhotoAnalysisResult {
  imageUrl: string;
  timestamp: string;
  detectedFeatures: {
    openLandDetected: boolean;
    vegetationDetected: boolean;
    structuresDetected: boolean;
    roadsDetected: boolean;
    constructionActivityDetected: boolean;
    visibleWaterDetected: boolean;
  };
  surfaceCharacteristics: string;
  inferredSlope: string;
  visualConfidenceScore: number;
  legalDisclaimer: string;
}

export interface FutureDevelopment {
  id: string;
  title: string;
  type: string;
  distanceKm: number;
  timeframeYears: number;
  status: string;
  impactDescription: string;
  impactScoreBonus: number;
  isOfficialPlannedProject?: boolean;
}

export interface LandParcel {
  id: string;
  name: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  areaAcres: number;
  currentUsage: string;
  ownership: 'Private' | 'Government' | 'Leased' | 'Panchayat';
  surveyNumber: string;
  isDemo?: boolean;
  ownershipVerified?: boolean;
  gpsAccuracyMeters?: number;
  locationConfirmed?: boolean;
  locationAccuracyStatus?: 'HIGH' | 'MODERATE' | 'INSUFFICIENT';
  verifiedAddress?: string;
  village?: string;
  taluka?: string;
  pincode?: string;
  bhuvanImageryStatus?: string;
  drawnPolygonAreaAcres?: number;
  drawnPolygonAreaHectares?: number;
  photoAnalysis?: PhotoAnalysisResult;
  currentOccupancy?: LandOccupancyAssessment;
  historicalTimeline?: HistoricalActivityObservation[];
  surroundingFeatures?: SurroundingFeature[];
  soil: SoilData;
  water: WaterData;
  infrastructure: InfrastructureData;
  risks: {
    floodRisk: 'Low' | 'Moderate' | 'High';
    earthquakeZone: string;
    landslideRisk: 'Low' | 'Moderate' | 'High';
    ecologicalSensitiveZone: boolean;
    waterStressRisk: 'Low' | 'Moderate' | 'High' | 'Severe' | string;
    pollutionRisk: 'Low' | 'Moderate' | 'High';
    regulatoryRestrictions: string[];
  };
  futureDevelopments: FutureDevelopment[];
  currentPotentialIndex: number;
  futurePotentialIndex: number;
  boundaryCoordinates?: [number, number][];
  groundVerified?: boolean;
  groundVerifiedReport?: ExpertInspectionReport;
  preVerificationAnalysis?: {
    topTitle: string;
    topScore: number;
    date: string;
    recommendations: AIRecommendation[];
  };
}

export interface UserPriorities {
  profitability: number;
  sustainability: number;
  waterEfficiency: number;
  socialImpact: number;
  lowInvestment: number;
  longTermGrowth: number;
  lowRisk: number;
}

export interface EconomicProjection {
  minInvestmentLakhs: number;
  maxInvestmentLakhs: number;
  annualRevenueLakhs: number;
  operatingCostLakhsPerYear: number;
  paybackYears: number;
  roiPercentage: number;
  jobsCreated: number;
  carbonOffsetTonsPerYear?: number;
  waterRequirementLitersPerDay: number;
  subsidyAvailableLakhs: number;
  regulatoryScore: number;
  initialInvestmentLakhs?: [number, number];
}

export interface AIRecommendation {
  id?: string;
  useType: LandUseType;
  title: string;
  tagline?: string;
  score: number;
  suitabilityScore?: number;
  landSuitabilityScore?: number;
  surroundingSuitabilityScore?: number;
  opportunityScore?: number;
  infrastructureScore?: number;
  economicScore?: number;
  socialScore?: number;
  ragEvidenceScore?: number;
  saturationPenalty?: number;
  constraintPenalty?: number;
  riskPenalty?: number;
  constraintStatus?: 'ELIGIBLE' | 'CONDITIONALLY_ELIGIBLE' | 'LOW_SUITABILITY' | 'BLOCKED';
  rank: number;
  category?: string;
  confidence?: string;
  dataConfidenceBadge?: DataConfidenceType;
  why: string[];
  whyFactors?: string[];
  risks: string[];
  constraints?: string[];
  opportunities?: string[];
  dataPointsUsed?: string[];
  economics: EconomicProjection;
  economicProjection?: EconomicProjection;
  sustainabilityScore?: number;
  confidenceScore?: number;
  matchedSchemeIds?: string[];
  recommendedPhases?: string[];
  appliedRules?: string[];
  evidenceList?: RAGEvidenceItem[];
}

export interface FullAnalysisResult {
  analysisId: string;
  parcelId: string;
  dataFingerprint: string;
  timestamp: string;
  confidenceGatePassed: boolean;
  confidenceScore: number;
  confidenceLevel: string;
  topRecommendation: AIRecommendation;
  recommendations: AIRecommendation[];
  surroundingPatterns: SurroundingPatternData;
  bufferBreakdown: BufferBreakdownData;
  proximityMatrix: SurroundingFeature[];
  saturationMetrics: SaturationMetricsData;
  decisionFactors: DecisionFactor[];
  whyTopRanked: string[];
  whyAlternativesRankedLower: ComparativeReasoning[];
  whatChangedRecommendation: string[];
  nextSteps: string[];
  ragEvidence: RAGEvidenceItem[];
}

export interface GovernmentScheme {
  id: string;
  name: string;
  tagline: string;
  ministry: string;
  sector: string;
  applicableUseTypes: LandUseType[];
  subsidyRangeText: string;
  eligibilityCriteria: string[];
  requiredDocuments: string[];
  applicationProcess: string[];
  officialPortalUrl?: string;
  sourceType: 'official' | 'state_portal';
  confidenceMatch: number;
  publishedDate?: string;
}

export interface SoilExpert {
  id: string;
  name: string;
  qualification: string;
  specialization: string;
  rating: number;
  reviewsCount: number;
  distanceKm: number;
  visitingFee: number;
  visitingPriceRupees?: number;
  avatarUrl: string;
  experienceYears?: number;
  availableSlots?: string[];
  availableNextDate?: string;
  phone?: string;
  verifiedBadge?: boolean;
}

export type BookingStatus = 
  | 'REQUESTED'
  | 'CONFIRMED'
  | 'EXPERT_ASSIGNED'
  | 'ON_THE_WAY'
  | 'VISIT_COMPLETED'
  | 'REPORT_READY'
  | 'CANCELLED';

export interface ExpertInspectionReport {
  reportId: string;
  bookingId: string;
  submittedAt: string;
  labCertificateNo: string;
  expertName: string;
  soilParameters: {
    ph: number;
    nitrogenKgHa: number;
    phosphorusKgHa: number;
    potassiumKgHa: number;
    organicCarbonPercent: number;
    electricalConductivity: number;
    soilTexture: string;
    drainageClass: string;
    soilHealthScore: number;
  };
  waterParameters: {
    waterSourceAvailable: boolean;
    sourceType: string;
    waterTableDepthMeters: number;
    waterQuality: string;
    waterQualityTdsPpm: number;
  };
  agronomistSummary: string;
  recommendedCrops: string[];
  groundVerifiedBadge: boolean;
}

export interface ExpertBooking {
  id: string;
  landId: string;
  parcelName: string;
  userName: string;
  userPhone: string;
  serviceType: string;
  locationCoordinates: [number, number];
  locationAddress: string;
  scheduledDate: string;
  scheduledTime: string;
  status: BookingStatus;
  assignedExpert: SoilExpert;
  priceRupees: number;
  paymentStatus: 'PAID' | 'PENDING' | 'DEMO_VERIFIED';
  paymentMethod: string;
  userNotes?: string;
  inspectionReport?: ExpertInspectionReport;
  createdAt: string;
  updatedAt?: string;
}

export type ScenarioPreset = 'profit' | 'green' | 'balanced' | 'low_investment' | 'social';

