import type { LandParcel } from '../types/land';

export const SAMPLE_PARCELS: LandParcel[] = [
  // 1. SOLAPUR (HIGH SOLAR + LOW DEVELOPMENT SCRUBLAND) -> SOLAR #1
  {
    id: 'parcel-hero-solapur-1',
    name: 'Solapur Sun-Ridge Scrubland (Hero SIH Demo)',
    surveyNumber: 'MH-SOL-2024/782B',
    district: 'Solapur',
    state: 'Maharashtra',
    lat: 17.6599,
    lng: 75.9064,
    areaAcres: 10.0,
    currentUsage: 'Barren Semi-Arid Fallow Land',
    ownership: 'Private',
    isDemo: true,
    ownershipVerified: false,
    
    currentOccupancy: {
      status: 'PREDOMINANTLY_OPEN',
      openAreaPercentage: 82,
      builtUpPercentage: 6,
      vegetationPercentage: 12,
      confidencePercentage: 86,
      disclaimer: 'Satellite remote sensing analysis indicates predominantly open ground. Visual inference does not establish physical possession.'
    },

    historicalTimeline: [
      { year: 2021, observationDate: '2021-03-15', satelliteSensor: 'Sentinel-2A MSI', openLandPersistence: 'High', vegetationIndexNDVI: 0.18, builtUpDetected: false, constructionIndication: 'None', summaryNote: 'Sparse seasonal grassland; no permanent structures observed.', confidence: 90 },
      { year: 2024, observationDate: '2024-02-22', satelliteSensor: 'Sentinel-2A MSI', openLandPersistence: 'High', vegetationIndexNDVI: 0.21, builtUpDetected: false, constructionIndication: 'None', summaryNote: 'Main parcel interior remains undisturbed.', confidence: 92 },
      { year: 2026, observationDate: '2026-06-02', satelliteSensor: 'Bhuvan Hybrid High-Res', openLandPersistence: 'High', vegetationIndexNDVI: 0.19, builtUpDetected: false, constructionIndication: 'None', summaryNote: 'Active baseline: 82% open land envelope suitable for utility-scale deployment.', confidence: 94 }
    ],

    surroundingFeatures: [
      { id: 'sf-1', name: 'MSEDCL 33/11 kV Kudal Substation', category: 'Infrastructure', distanceKm: 1.2, bearing: 'North-East', impactScoreBonus: 14, coordinates: [75.9140, 17.6680] },
      { id: 'sf-2', name: 'NH-52 Solapur-Vijayapura Highway', category: 'Infrastructure', distanceKm: 1.8, bearing: 'West', impactScoreBonus: 12, coordinates: [75.8890, 17.6580] },
      { id: 'sf-3', name: 'MIDC Chincholi Industrial Cluster', category: 'Industry', distanceKm: 3.8, bearing: 'North', impactScoreBonus: 8, coordinates: [75.9080, 17.6920] },
      { id: 'sf-4', name: 'Sina River Minor Tributary Canal', category: 'Natural', distanceKm: 3.4, bearing: 'South-East', impactScoreBonus: 6, coordinates: [75.9320, 17.6400] }
    ],

    soil: {
      pH: 7.2,
      nitrogen: 'Low',
      phosphorus: 'Medium',
      potassium: 'High',
      organicCarbon: 0.42,
      moisture: 18,
      ec: 0.35,
      soilType: 'Medium Black Loam (Regur)',
      source: 'verified',
      healthScore: 68,
      nitrogenValue: 185,
      phosphorusValue: 18,
      potassiumValue: 310
    },
    water: {
      availability: 'Medium',
      groundwaterDepth: 48,
      rainfallAnnual: 540,
      nearestWaterBodyKm: 3.4,
      waterBodyType: 'Seasonal Irrigation Canal',
      irrigationAccess: false,
      seasonalWaterStress: 'Moderate',
      rainwaterHarvestingPotential: 'High',
      score: 62
    },
    infrastructure: {
      roadAccessQuality: 'Good',
      roadDistanceMeters: 400,
      gridDistanceKm: 1.2,
      substationCapacityKVA: 33000,
      railwayDistanceKm: 8.5,
      nearestCityKm: 14,
      populationDensity: 'Low',
      zoning: 'Agricultural (Clear for Solar Conversion)',
      elevationMeters: 465,
      slopeDegrees: 2.1,
      solarRadiationKWh: 5.85
    },
    risks: {
      floodRisk: 'Low',
      earthquakeZone: 'Zone III (Moderate)',
      landslideRisk: 'Low',
      ecologicalSensitiveZone: false,
      waterStressRisk: 'Moderate',
      pollutionRisk: 'Low',
      regulatoryRestrictions: ['DISCOM grid interconnection study required']
    },
    futureDevelopments: [
      { id: 'fd-1', title: 'Solapur 400kV Renewable Substation Feeder', type: 'Grid', distanceKm: 4.2, timeframeYears: 2, status: 'MSETCL Master Plan', impactDescription: 'High-voltage evacuation line', impactScoreBonus: 10, isOfficialPlannedProject: true }
    ],
    currentPotentialIndex: 78,
    futurePotentialIndex: 91,
    boundaryCoordinates: [
      [17.6585, 75.9045],
      [17.6620, 75.9050],
      [17.6615, 75.9090],
      [17.6580, 75.9080],
      [17.6585, 75.9045]
    ]
  },

  // 2. PUNE HINJAWADI (DENSE RESIDENTIAL / URBAN TECH FRINGE) -> COMMERCIAL / HOUSING #1
  {
    id: 'parcel-cidco-pune-2',
    name: 'Pune Hinjawadi High-Density Urban Buffer',
    surveyNumber: 'MH-PUN-2023/1104',
    district: 'Pune',
    state: 'Maharashtra',
    lat: 18.5913,
    lng: 73.7389,
    areaAcres: 6.5,
    currentUsage: 'Underutilized Civic Fringe',
    ownership: 'Government',
    isDemo: true,
    ownershipVerified: true,
    currentOccupancy: {
      status: 'PARTIALLY_UTILIZED',
      openAreaPercentage: 64,
      builtUpPercentage: 14,
      vegetationPercentage: 22,
      confidencePercentage: 91,
      disclaimer: 'PMRDA official civic survey record.'
    },
    historicalTimeline: [
      { year: 2021, observationDate: '2021-02-10', satelliteSensor: 'Sentinel-2A MSI', openLandPersistence: 'High', vegetationIndexNDVI: 0.32, builtUpDetected: false, constructionIndication: 'None', summaryNote: 'Open peri-urban buffer land.', confidence: 90 },
      { year: 2026, observationDate: '2026-05-18', satelliteSensor: 'Bhuvan High-Res Hybrid', openLandPersistence: 'Moderate', vegetationIndexNDVI: 0.26, builtUpDetected: true, constructionIndication: 'Active', summaryNote: 'High commercial and civic utility footfall.', confidence: 95 }
    ],
    surroundingFeatures: [
      { id: 'sf-p1', name: 'Hinjawadi Phase 3 Residential Mega-Township', category: 'Residential', distanceKm: 0.3, bearing: 'East', impactScoreBonus: 18, coordinates: [73.7420, 18.5920] },
      { id: 'sf-p2', name: 'Pune Ring Road & Metro Line 3 Connector', category: 'Infrastructure', distanceKm: 0.5, bearing: 'West', impactScoreBonus: 16, coordinates: [73.7320, 18.5950] },
      { id: 'sf-p3', name: 'Hinjawadi Tech SEZ Complex', category: 'Commercial', distanceKm: 1.2, bearing: 'North', impactScoreBonus: 12, coordinates: [73.7400, 18.6010] }
    ],
    soil: {
      pH: 6.8,
      nitrogen: 'Medium',
      phosphorus: 'Medium',
      potassium: 'Medium',
      organicCarbon: 0.55,
      moisture: 24,
      ec: 0.4,
      soilType: 'Heavy Clay Loam',
      source: 'verified',
      healthScore: 74,
      nitrogenValue: 240,
      phosphorusValue: 22,
      potassiumValue: 260
    },
    water: {
      availability: 'High',
      groundwaterDepth: 28,
      rainfallAnnual: 760,
      nearestWaterBodyKm: 1.5,
      waterBodyType: 'Mula River Stream',
      irrigationAccess: true,
      seasonalWaterStress: 'Low',
      rainwaterHarvestingPotential: 'High',
      score: 80
    },
    infrastructure: {
      roadAccessQuality: 'Excellent',
      roadDistanceMeters: 20,
      gridDistanceKm: 0.5,
      substationCapacityKVA: 66000,
      railwayDistanceKm: 16,
      nearestCityKm: 3,
      populationDensity: 'High',
      zoning: 'Commercial / Mixed Urban (PMRDA Master Plan)',
      elevationMeters: 575,
      slopeDegrees: 1.5,
      solarRadiationKWh: 5.1
    },
    risks: {
      floodRisk: 'Low',
      earthquakeZone: 'Zone III',
      landslideRisk: 'Low',
      ecologicalSensitiveZone: false,
      waterStressRisk: 'Low',
      pollutionRisk: 'Moderate',
      regulatoryRestrictions: ['PMRDA commercial layout approval required']
    },
    futureDevelopments: [
      { id: 'fd-p1', title: 'Pune Metro Line 3 Extension', type: 'Metro Rail', distanceKm: 0.8, timeframeYears: 1, status: 'Under Construction', impactDescription: 'Direct mass transit connectivity', impactScoreBonus: 14, isOfficialPlannedProject: true }
    ],
    currentPotentialIndex: 85,
    futurePotentialIndex: 96,
    boundaryCoordinates: [
      [18.5900, 73.7370],
      [18.5930, 73.7380],
      [18.5925, 73.7410],
      [18.5895, 73.7400],
      [18.5900, 73.7370]
    ]
  },

  // 3. NASHIK DINDORI (ARABLE AGRICULTURAL BELT) -> AGRICULTURE #1
  {
    id: 'parcel-agri-nashik-3',
    name: 'Nashik Dindori Arable Horticulture Belt',
    surveyNumber: 'MH-NSK-2024/441E',
    district: 'Nashik',
    state: 'Maharashtra',
    lat: 20.1984,
    lng: 73.8342,
    areaAcres: 12.0,
    currentUsage: 'Active Cropland & Horticulture',
    ownership: 'Private',
    isDemo: true,
    ownershipVerified: true,
    currentOccupancy: {
      status: 'PREDOMINANTLY_OPEN',
      openAreaPercentage: 88,
      builtUpPercentage: 2,
      vegetationPercentage: 10,
      confidencePercentage: 94,
      disclaimer: 'Verified rich arable soil envelope.'
    },
    historicalTimeline: [
      { year: 2021, observationDate: '2021-04-10', satelliteSensor: 'Sentinel-2A', openLandPersistence: 'High', vegetationIndexNDVI: 0.62, builtUpDetected: false, constructionIndication: 'None', summaryNote: 'High agricultural vegetation index.', confidence: 95 },
      { year: 2026, observationDate: '2026-05-12', satelliteSensor: 'Bhuvan High-Res', openLandPersistence: 'High', vegetationIndexNDVI: 0.68, builtUpDetected: false, constructionIndication: 'None', summaryNote: 'Continuous fertile cropping signature.', confidence: 96 }
    ],
    surroundingFeatures: [
      { id: 'sf-n1', name: 'APMC Onion & Grape Wholesale Mandi', category: 'Natural', distanceKm: 2.1, bearing: 'East', impactScoreBonus: 15, coordinates: [73.8450, 20.2010] },
      { id: 'sf-n2', name: 'Darna Canal Perennial Irrigation Network', category: 'Natural', distanceKm: 0.5, bearing: 'South', impactScoreBonus: 18, coordinates: [73.8320, 20.1940] },
      { id: 'sf-n3', name: 'National Horticulture Research Cluster', category: 'Civic', distanceKm: 3.2, bearing: 'North', impactScoreBonus: 10, coordinates: [73.8310, 20.2250] }
    ],
    soil: {
      pH: 7.2,
      nitrogen: 'High',
      phosphorus: 'High',
      potassium: 'High',
      organicCarbon: 0.88,
      moisture: 32,
      ec: 0.45,
      soilType: 'Deep Black Alluvial Loam',
      source: 'verified',
      healthScore: 92,
      nitrogenValue: 280,
      phosphorusValue: 28,
      potassiumValue: 360
    },
    water: {
      availability: 'Very High',
      groundwaterDepth: 18,
      rainfallAnnual: 860,
      nearestWaterBodyKm: 0.5,
      waterBodyType: 'Perennial Irrigation Canal',
      irrigationAccess: true,
      seasonalWaterStress: 'Low',
      rainwaterHarvestingPotential: 'High',
      score: 94
    },
    infrastructure: {
      roadAccessQuality: 'Good',
      roadDistanceMeters: 180,
      gridDistanceKm: 2.8,
      substationCapacityKVA: 33000,
      railwayDistanceKm: 18,
      nearestCityKm: 12,
      populationDensity: 'Medium',
      zoning: 'Agricultural Arable Zone',
      elevationMeters: 580,
      slopeDegrees: 1.2,
      solarRadiationKWh: 5.2
    },
    risks: {
      floodRisk: 'Low',
      earthquakeZone: 'Zone III',
      landslideRisk: 'Low',
      ecologicalSensitiveZone: false,
      waterStressRisk: 'Low',
      pollutionRisk: 'Low',
      regulatoryRestrictions: ['Prime agricultural farmland conservation code']
    },
    futureDevelopments: [
      { id: 'fd-n1', title: 'Nashik Agri-Export Cold Chain Corridor', type: 'Agro Logistics', distanceKm: 3.0, timeframeYears: 2, status: 'Approved', impactDescription: 'Direct container freight connectivity', impactScoreBonus: 10, isOfficialPlannedProject: true }
    ],
    currentPotentialIndex: 90,
    futurePotentialIndex: 95,
    boundaryCoordinates: [
      [20.1970, 73.8320],
      [20.2000, 73.8330],
      [20.1995, 73.8365],
      [20.1965, 73.8355],
      [20.1970, 73.8320]
    ]
  },

  // 4. NAGPUR SAMRUDDHI (HIGHWAY + INDUSTRIAL CORRIDOR) -> WAREHOUSE #1
  {
    id: 'parcel-logistics-nagpur-4',
    name: 'Nagpur Samruddhi Freight & Logistics Node',
    surveyNumber: 'MH-NGP-2024/912A',
    district: 'Nagpur',
    state: 'Maharashtra',
    lat: 21.0145,
    lng: 79.0234,
    areaAcres: 16.0,
    currentUsage: 'Open Transport Frontage Land',
    ownership: 'Private',
    isDemo: true,
    ownershipVerified: true,
    currentOccupancy: {
      status: 'PREDOMINANTLY_OPEN',
      openAreaPercentage: 92,
      builtUpPercentage: 3,
      vegetationPercentage: 5,
      confidencePercentage: 95,
      disclaimer: 'High-speed expressway interchange node.'
    },
    historicalTimeline: [
      { year: 2021, observationDate: '2021-05-15', satelliteSensor: 'Sentinel-2A', openLandPersistence: 'High', vegetationIndexNDVI: 0.22, builtUpDetected: false, constructionIndication: 'None', summaryNote: 'Open freight frontage terrain.', confidence: 92 },
      { year: 2026, observationDate: '2026-06-01', satelliteSensor: 'Bhuvan High-Res', openLandPersistence: 'High', vegetationIndexNDVI: 0.18, builtUpDetected: false, constructionIndication: 'None', summaryNote: 'Direct Samruddhi Mahamarg interchange access.', confidence: 96 }
    ],
    surroundingFeatures: [
      { id: 'sf-ng1', name: 'Samruddhi Mahamarg Expressway Interchange', category: 'Infrastructure', distanceKm: 0.1, bearing: 'West', impactScoreBonus: 20, coordinates: [79.0210, 21.0140] },
      { id: 'sf-ng2', name: 'MIHAN / Butibori Industrial Manufacturing SEZ', category: 'Industry', distanceKm: 2.2, bearing: 'South', impactScoreBonus: 16, coordinates: [79.0250, 20.9950] },
      { id: 'sf-ng3', name: 'Multi-Modal Cargo Hub & Inland Container Depot', category: 'Commercial', distanceKm: 3.5, bearing: 'East', impactScoreBonus: 14, coordinates: [79.0450, 21.0200] }
    ],
    soil: {
      pH: 7.4,
      nitrogen: 'Medium',
      phosphorus: 'Medium',
      potassium: 'High',
      organicCarbon: 0.52,
      moisture: 20,
      ec: 0.4,
      soilType: 'Medium Loam',
      source: 'verified',
      healthScore: 62,
      nitrogenValue: 205,
      phosphorusValue: 20,
      potassiumValue: 310
    },
    water: {
      availability: 'Medium',
      groundwaterDepth: 35,
      rainfallAnnual: 680,
      nearestWaterBodyKm: 4.5,
      waterBodyType: 'Stream',
      irrigationAccess: false,
      seasonalWaterStress: 'Moderate',
      rainwaterHarvestingPotential: 'High',
      score: 65
    },
    infrastructure: {
      roadAccessQuality: 'Excellent',
      roadDistanceMeters: 20,
      gridDistanceKm: 0.8,
      substationCapacityKVA: 66000,
      railwayDistanceKm: 6.0,
      nearestCityKm: 16,
      populationDensity: 'Medium',
      zoning: 'Industrial / Logistics Corridor (NLP Master Plan)',
      elevationMeters: 310,
      slopeDegrees: 0.8,
      solarRadiationKWh: 5.3
    },
    risks: {
      floodRisk: 'Low',
      earthquakeZone: 'Zone II',
      landslideRisk: 'Low',
      ecologicalSensitiveZone: false,
      waterStressRisk: 'Moderate',
      pollutionRisk: 'Low',
      regulatoryRestrictions: ['NHAI access permission protocol required']
    },
    futureDevelopments: [
      { id: 'fd-ng1', title: 'Nagpur Multi-Modal Logistics Hub Phase 2', type: 'Freight Hub', distanceKm: 1.5, timeframeYears: 1, status: 'Under Construction', impactDescription: 'Direct freight rail link', impactScoreBonus: 15, isOfficialPlannedProject: true }
    ],
    currentPotentialIndex: 88,
    futurePotentialIndex: 96,
    boundaryCoordinates: [
      [21.0130, 79.0210],
      [21.0165, 79.0220],
      [21.0160, 79.0260],
      [21.0125, 79.0250],
      [21.0130, 79.0210]
    ]
  },

  // 5. BHADLA SATURATED (HIGH SOLAR BUT EXTREME SOLAR SATURATION) -> ALTERNATIVE WINS
  {
    id: 'parcel-bhadla-sat-5',
    name: 'Bhadla Saturated Solar Fringe Node',
    surveyNumber: 'RJ-BHD-2024/883S',
    district: 'Bhadla',
    state: 'Rajasthan',
    lat: 27.5380,
    lng: 71.9120,
    areaAcres: 18.0,
    currentUsage: 'Semi-Arid Fringe Plot',
    ownership: 'Private',
    isDemo: true,
    ownershipVerified: true,
    currentOccupancy: {
      status: 'PREDOMINANTLY_OPEN',
      openAreaPercentage: 94,
      builtUpPercentage: 1,
      vegetationPercentage: 5,
      confidencePercentage: 92,
      disclaimer: 'High solar insolation corridor with severe grid substation congestion.'
    },
    historicalTimeline: [
      { year: 2021, observationDate: '2021-03-20', satelliteSensor: 'Sentinel-2A', openLandPersistence: 'High', vegetationIndexNDVI: 0.12, builtUpDetected: false, constructionIndication: 'None', summaryNote: 'Arid sandy terrain.', confidence: 92 },
      { year: 2026, observationDate: '2026-05-10', satelliteSensor: 'Bhuvan High-Res', openLandPersistence: 'High', vegetationIndexNDVI: 0.11, builtUpDetected: false, constructionIndication: 'None', summaryNote: 'Dense adjacent solar installations visible in 3km buffer.', confidence: 95 }
    ],
    surroundingFeatures: [
      { id: 'sf-b1', name: 'Bhadla Mega Solar Park Phase 3 (300 MW)', category: 'Infrastructure', distanceKm: 0.6, bearing: 'North', impactScoreBonus: 4, coordinates: [71.9150, 27.5450] },
      { id: 'sf-b2', name: 'Bhadla Solar Cluster Substation 4 (Congested)', category: 'Infrastructure', distanceKm: 1.1, bearing: 'South', impactScoreBonus: 3, coordinates: [71.9100, 27.5280] },
      { id: 'sf-b3', name: 'Desert Highway Heavy Transport Depot', category: 'Infrastructure', distanceKm: 0.4, bearing: 'West', impactScoreBonus: 14, coordinates: [71.9050, 27.5370] }
    ],
    soil: {
      pH: 7.8,
      nitrogen: 'Low',
      phosphorus: 'Low',
      potassium: 'Medium',
      organicCarbon: 0.28,
      moisture: 10,
      ec: 0.3,
      soilType: 'Arid Sandy Desert Loam',
      source: 'verified',
      healthScore: 46,
      nitrogenValue: 120,
      phosphorusValue: 12,
      potassiumValue: 180
    },
    water: {
      availability: 'Low',
      groundwaterDepth: 95,
      rainfallAnnual: 240,
      nearestWaterBodyKm: 9.0,
      waterBodyType: 'None',
      irrigationAccess: false,
      seasonalWaterStress: 'Severe',
      rainwaterHarvestingPotential: 'Low',
      score: 35
    },
    infrastructure: {
      roadAccessQuality: 'Good',
      roadDistanceMeters: 60,
      gridDistanceKm: 1.1,
      substationCapacityKVA: 132000,
      railwayDistanceKm: 32,
      nearestCityKm: 45,
      populationDensity: 'Low',
      zoning: 'Mixed Renewable & Industrial Reserve',
      elevationMeters: 220,
      slopeDegrees: 1.0,
      solarRadiationKWh: 6.2
    },
    risks: {
      floodRisk: 'Low',
      earthquakeZone: 'Zone II',
      landslideRisk: 'Low',
      ecologicalSensitiveZone: false,
      waterStressRisk: 'Severe',
      pollutionRisk: 'Low',
      regulatoryRestrictions: ['DISCOM reverse power flow freeze / Feeder saturation notice']
    },
    futureDevelopments: [
      { id: 'fd-b1', title: 'Western Freight Renewable Equipment Staging Hub', type: 'Logistics', distanceKm: 1.5, timeframeYears: 1, status: 'Approved', impactDescription: 'Equipment staging and spare parts warehouse hub', impactScoreBonus: 12, isOfficialPlannedProject: true }
    ],
    currentPotentialIndex: 72,
    futurePotentialIndex: 86,
    boundaryCoordinates: [
      [27.5365, 71.9100],
      [27.5400, 71.9110],
      [27.5395, 71.9145],
      [27.5360, 71.9135],
      [27.5365, 71.9100]
    ]
  }
];
