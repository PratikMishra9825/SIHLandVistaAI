/**
 * LANDVISTA AI - Structured RAG Knowledge Base & Regulatory Evidence Engine
 *
 * Source Priority Hierarchy:
 * 1. Official Government Source (MNRE, MoAFW, NHAI, MoHUA, CPCB, CGWA, MSETCL)
 * 2. Institutional / ICAR / State Agro Research Guidelines
 * 3. Authoritative Spatial & Remote Sensing (ISRO Bhuvan, CartoDEM, LULC 50k)
 * 4. Validated Domain Engineering & Financial Norms
 */

export const SOURCE_PRIORITIES = {
  OFFICIAL_GOVERNMENT: { priority: 1, reliability: 0.98, label: 'Official Government Policy / Gazette' },
  INSTITUTIONAL_RESEARCH: { priority: 2, reliability: 0.92, label: 'ICAR / State Agricultural University' },
  REMOTE_SENSING_CADASTRE: { priority: 3, reliability: 0.88, label: 'ISRO Bhuvan / National Cadastre Grid' },
  DOMAIN_ENGINEERING: { priority: 4, reliability: 0.82, label: 'Validated Industrial & Infrastructure Guidelines' }
};

export const RAG_DOCUMENTS = [
  // 1. SOLAR ENERGY & GRID INTERCONNECT
  {
    id: 'RAG-SOLAR-001',
    source: 'Ministry of New & Renewable Energy (MNRE)',
    authority: 'MNRE / PM-KUSUM Scheme Guidelines 2024-26',
    documentTitle: 'PM-KUSUM Component-A: Decentralized Solar Power Plant Guidelines on Arable/Barren Land',
    dateVersion: '2024.3-Rev2',
    category: 'Renewable Energy Policy',
    geographicApplicability: 'National (All States)',
    topic: 'Solar Farm Feasibility & 33kV Substation Distance Limit',
    reliability: SOURCE_PRIORITIES.OFFICIAL_GOVERNMENT.reliability,
    relevantLandUseTypes: ['solar', 'public_infra'],
    rules: {
      maxGridDistanceKm: 5.0,
      optimalGridDistanceKm: 2.0,
      minSolarRadiationKWh: 4.8,
      optimalSolarRadiationKWh: 5.5,
      maxSlopeDegrees: 5.0,
      minAcreagePerMW: 4.0,
      saturationThresholdNearbyPlants: 4
    },
    content: 'Under PM-KUSUM Component A, solar plants between 500 kW and 2 MW capacity are eligible for 30% CFA on barren, fallow, or agricultural land within 5 km of a 33/11 kV DISCOM substation. Parcels located beyond 5 km require high transmission line capex (₹12 Lakh/km), reducing economic viability. If more than 3 utility solar plants operate within a 3 km radius, local substation injection quotas may become congested.',
    evidenceBonus: 10,
    evidencePenaltyIfViolated: 15
  },
  {
    id: 'RAG-SOLAR-002',
    source: 'Solar Energy Corporation of India (SECI) & CEA',
    authority: 'Central Electricity Authority (Technical Standards for Connectivity)',
    documentTitle: 'Grid Evacuation & Substation Capacity Allocation Norms',
    dateVersion: '2023.1',
    category: 'Grid Standards',
    geographicApplicability: 'National',
    topic: 'Substation Saturation & Reverse Power Flow Constraints',
    reliability: SOURCE_PRIORITIES.OFFICIAL_GOVERNMENT.reliability,
    relevantLandUseTypes: ['solar'],
    rules: {
      substationMaxSolarPenetrationPercent: 60,
      gridCongestionSaturationCount: 3
    },
    content: 'When surrounding solar installations exceed 60% of rural substation transformer capacity (typically 10-15 MVA), DISCOMs impose curtailment or require dedicated 110kV/220kV bay construction at landowner cost. In high solar density zones (solar clusters), saturation penalties apply to prevent unevacuated generation.',
    evidenceBonus: 6,
    evidencePenaltyIfViolated: 14
  },

  // 2. AGRICULTURE & SOIL-CROP SUITABILITY
  {
    id: 'RAG-AGRI-001',
    source: 'Indian Council of Agricultural Research (ICAR) & NBSS&LUP',
    authority: 'National Bureau of Soil Survey and Land Use Planning',
    documentTitle: 'Agro-Ecological Land Suitability & Soil Health Standards for Western & Central India',
    dateVersion: '2024.1',
    category: 'Agricultural Science',
    geographicApplicability: 'Maharashtra, Karnataka, MP, Gujarat',
    topic: 'Soil pH, Potassium, and Water Balance for Horticulture & Pulses',
    reliability: SOURCE_PRIORITIES.INSTITUTIONAL_RESEARCH.reliability,
    relevantLandUseTypes: ['agriculture', 'agro_processing'],
    rules: {
      optimalPhMin: 6.5,
      optimalPhMax: 7.8,
      criticalWaterDepthMeters: 60,
      minSoilHealthScore: 55,
      primeFarmlandProtection: true
    },
    content: 'Medium Black Loam (Vertisols/Regur) with pH 6.8–7.6 and high exchangeable potassium is prime land for high-value pomegranate, onion, soybean, and pulses. High fertility parcels with irrigation canal or shallow groundwater (<40m) should be prioritized for precision agriculture. Diverting high-fertility prime farmland to ground-mount solar or industrial sheds is discouraged by state land revenue conservation codes.',
    evidenceBonus: 12,
    evidencePenaltyIfViolated: 18
  },
  {
    id: 'RAG-AGRI-002',
    source: 'Ministry of Agriculture & Farmers Welfare',
    authority: 'PM Krishi Sinchayee Yojana (PMKSY) Technical Mission',
    documentTitle: 'Per Drop More Crop - Micro-Irrigation & Water Stress Mitigation Guidelines',
    dateVersion: '2024.4',
    category: 'Irrigation & Subsidies',
    geographicApplicability: 'National',
    topic: '55% Micro-Drip Subsidy for Arid & Semi-Arid Parcels',
    reliability: SOURCE_PRIORITIES.OFFICIAL_GOVERNMENT.reliability,
    relevantLandUseTypes: ['agriculture', 'agroforestry'],
    rules: {
      maxSlopeForDrip: 8.0,
      subsidyPercentageSmallFarmer: 55
    },
    content: 'Parcels experiencing seasonal water stress are eligible for 55% capital subsidy on precision drip systems and farm pond lined excavations under PMKSY. With drip automation, water requirement decreases by 45% while crop yields increase by 35% compared to flood furrow irrigation.',
    evidenceBonus: 8,
    evidencePenaltyIfViolated: 6
  },

  // 3. WAREHOUSING, AGRO-LOGISTICS & FREIGHT CORRIDORS
  {
    id: 'RAG-LOGISTICS-001',
    source: 'National Highways Authority of India (NHAI) & Ministry of Commerce',
    authority: 'National Logistics Policy (NLP) & MoRTH Logistics Parks Division',
    documentTitle: 'Multi-Modal Logistics Parks & Highway Frontage Fulfillment Guidelines',
    dateVersion: '2023.2',
    category: 'Logistics Infrastructure',
    geographicApplicability: 'National Highway & Freight Corridors',
    topic: 'Road Width, Access Frontage, and Industrial Node Proximity',
    reliability: SOURCE_PRIORITIES.OFFICIAL_GOVERNMENT.reliability,
    relevantLandUseTypes: ['warehouse', 'industrial', 'agro_processing'],
    rules: {
      maxRoadDistanceMeters: 1000,
      optimalRoadDistanceMeters: 200,
      minAcreageWarehouse: 2.5,
      maxTerrainSlopeWarehouse: 3.5,
      saturationDensityWarehousesWithin3km: 6
    },
    content: 'Logistics fulfillment hubs and cold chain warehouses require direct paved access to State or National Highways capable of accommodating multi-axle freight vehicles (min. 12m right-of-way). Parcels within 1 km of expressways or designated industrial corridors receive high opportunity weighting. However, if over 6 logistics warehouses already operate within 3 km without regional consumption expansion, supply saturation dampens leasing absorption.',
    evidenceBonus: 14,
    evidencePenaltyIfViolated: 12
  },
  {
    id: 'RAG-LOGISTICS-002',
    source: 'Ministry of Agriculture - AIF Division',
    authority: 'Agriculture Infrastructure Fund (AIF) Central Scheme',
    documentTitle: 'Financing Facility for Post-Harvest Management & Cold Storage Assets',
    dateVersion: '2024.2',
    category: 'Agro-Logistics Finance',
    geographicApplicability: 'National',
    topic: '3% Interest Subvention for Agro-Warehousing & Cold Hubs up to ₹2 Crore',
    reliability: SOURCE_PRIORITIES.OFFICIAL_GOVERNMENT.reliability,
    relevantLandUseTypes: ['warehouse', 'agro_processing'],
    rules: {
      maxSubventionLoanCr: 2.0,
      subventionPercent: 3.0
    },
    content: 'Landowners and FPOs establishing pack-houses, cold stores, silos, and aggregation sorting platforms are granted a 3% per annum interest subvention on bank loans up to ₹2 Crore for up to 7 years, alongside CGTMSE credit guarantee coverage.',
    evidenceBonus: 8,
    evidencePenaltyIfViolated: 0
  },

  // 4. COMMERCIAL, URBAN FRINGE & RESIDENTIAL
  {
    id: 'RAG-COMMERCIAL-001',
    source: 'Ministry of Housing and Urban Affairs (MoHUA) / Town Planning Authority',
    authority: 'Urban & Regional Development Plans Formulation and Implementation (URDPFI)',
    documentTitle: 'Catchment Demographics & Commercial Frontage Viability Standards',
    dateVersion: '2023.3',
    category: 'Urban Planning',
    geographicApplicability: 'Tier 1/2/3 Urban Influence Zones',
    topic: 'Residential Density Thresholds & High Footfall Commercial Nodes',
    reliability: SOURCE_PRIORITIES.OFFICIAL_GOVERNMENT.reliability,
    relevantLandUseTypes: ['commercial', 'housing'],
    rules: {
      minResidentialSurroundingPercentForCommercial: 25,
      optimalResidentialPercentForCommercial: 45,
      maxRoadDistanceCommercialMeters: 300,
      minCatchmentPopulationDensity: 'Medium'
    },
    content: 'Commercial centers, retail plazas, highway resorts, and agri-malls require immediate residential catchment (min 25-45% surrounding residential composition within 1 km) or high-volume vehicular traffic frontage (<300m from arterial corridor). In isolated rural areas with <10% residential presence, commercial use is not commercially sustainable.',
    evidenceBonus: 12,
    evidencePenaltyIfViolated: 16
  },
  {
    id: 'RAG-HOUSING-001',
    source: 'Ministry of Housing and Urban Affairs / RERA',
    authority: 'Pradhan Mantri Awas Yojana (PMAY-Gramin / Urban) & Real Estate Regulatory Guidelines',
    documentTitle: 'Peri-Urban Residential Plotting & Affordable Housing Cluster Norms',
    dateVersion: '2024.1',
    category: 'Residential Development',
    geographicApplicability: 'Peri-Urban & Growth Corridors',
    topic: 'Civic Infrastructure, Potable Water, and Environmental Setbacks',
    reliability: SOURCE_PRIORITIES.OFFICIAL_GOVERNMENT.reliability,
    relevantLandUseTypes: ['housing'],
    rules: {
      maxDistanceToCityKm: 15.0,
      mustAvoidIndustrialAdjacencyMeters: 500,
      potableWaterAccessRequired: true
    },
    content: 'Residential plotted layouts and affordable housing developments require potable drinking water, accessibility within 15 km of urban economic centers, and a minimum 500m buffer from red-category heavy industrial clusters. Proximity to dense residential neighborhoods provides strong community synergies.',
    evidenceBonus: 10,
    evidencePenaltyIfViolated: 15
  },

  // 5. INDUSTRIAL, ENVIRONMENTAL & STATUTORY CONSTRAINTS
  {
    id: 'RAG-ENV-001',
    source: 'Central Pollution Control Board (CPCB) & Ministry of Environment (MoEFCC)',
    authority: 'Environmental Siting Guidelines for Industries & Land-Use Buffer Norms',
    dateVersion: '2023.4',
    category: 'Environmental Regulation',
    geographicApplicability: 'National',
    topic: 'Red/Orange Industrial Siting Buffers & Floodplain Non-Development Zones',
    reliability: SOURCE_PRIORITIES.OFFICIAL_GOVERNMENT.reliability,
    relevantLandUseTypes: ['industrial', 'housing', 'commercial', 'solar', 'agriculture'],
    rules: {
      industrialResidentialBufferMeters: 500,
      waterBodyBufferMeters: 100,
      floodplainHazardConstraint: 'BLOCKED_FOR_HABITATION'
    },
    content: 'Manufacturing units with industrial emissions must maintain a mandatory 500m green buffer from dense residential settlements and educational institutions. Construction within the active 100m high-flood line of rivers and natural watercourses is strictly prohibited. Parcels located in designated Ecological Sensitive Zones (ESZ) or active flood zones receive severe penalties or eligibility blocks for residential and industrial construction.',
    evidenceBonus: 4,
    evidencePenaltyIfViolated: 25
  },
  {
    id: 'RAG-AGROFORESTRY-001',
    source: 'Ministry of Environment, Forest and Climate Change (MoEFCC)',
    authority: 'National Agroforestry Policy & Carbon Credit Verification Standard (BEE / CCTS)',
    documentTitle: 'Degraded / Semi-Arid Land Agroforestry & Carbon Farming Verification Protocol',
    dateVersion: '2024.2',
    category: 'Carbon Farming & Forestry',
    geographicApplicability: 'Semi-Arid & Degraded Soils',
    topic: 'Carbon Offsets, Timber & Bamboo Cultivation on Poor Soils',
    reliability: SOURCE_PRIORITIES.INSTITUTIONAL_RESEARCH.reliability,
    relevantLandUseTypes: ['agroforestry', 'recreation_park'],
    rules: {
      minSoilHealthForAgri: 40,
      carbonYieldTonsPerAcrePerYear: 8.5
    },
    content: 'For semi-arid parcels with degraded soil (pH < 5.5 or > 8.5, low organic carbon < 0.35%) and severe water constraints where intensive agriculture fails, agroforestry (Bamboo, Melia Dubia, Teak) and carbon farming generate certified carbon credits (₹1,500/ton CO2e) with minimal irrigation dependency.',
    evidenceBonus: 8,
    evidencePenaltyIfViolated: 0
  }
];

/**
 * Dynamically constructs candidate-specific context-aware RAG query
 */
export function buildCandidateRAGQuery(candidateType, parcel, spatialAnalysis) {
  const district = parcel.district || 'Regional';
  const state = parcel.state || 'Maharashtra';
  const acres = parcel.areaAcres || parcel.area || 10;
  const slope = parcel.infrastructure?.slopeDegrees ?? 2.5;
  const roadDist = parcel.infrastructure?.roadDistanceMeters ?? 400;
  const gridDist = parcel.infrastructure?.gridDistanceKm ?? 1.5;
  const soilHealth = parcel.soil?.healthScore ?? 70;
  const soilType = parcel.soil?.soilType ?? 'Medium Black';
  const waterDist = parcel.water?.nearestWaterBodyKm ?? 2.0;
  const solarGHI = parcel.infrastructure?.solarRadiationKWh ?? 5.5;

  const dominantPattern = spatialAnalysis?.dominantPattern || 'Mixed';
  const residentialPct = spatialAnalysis?.composition?.residential ?? 20;
  const agriPct = spatialAnalysis?.composition?.agricultural ?? 40;
  const industrialPct = spatialAnalysis?.composition?.industrial ?? 10;

  switch (candidateType) {
    case 'solar':
      return `Given a ${acres}-acre parcel in ${district}, ${state} with ${solarGHI} kWh/m²/day irradiance, terrain slope ${slope}°, ${gridDist} km to 33kV substation, surrounding pattern ${dominantPattern}, and nearby renewable saturation level, evaluate utility-scale solar PV feasibility and grid injection quota under MNRE PM-KUSUM rules.`;

    case 'agriculture':
      return `Given a ${acres}-acre parcel in ${district}, ${state} with ${soilType} (health ${soilHealth}/100, pH ${parcel.soil?.pH || 7.2}), water body at ${waterDist} km, surrounding agricultural pattern (${agriPct}%), evaluate precision horticulture and pulses suitability under ICAR soil standards and PMKSY drip subsidy.`;

    case 'warehouse':
      return `Given a ${acres}-acre parcel in ${district}, ${state} with ${roadDist}m road frontage, ${slope}° flat slope, industrial pattern (${industrialPct}%), nearby highway corridors, and logistics saturation, evaluate agro-logistics warehouse and cold storage suitability under National Logistics Policy and AIF subsidy.`;

    case 'commercial':
      return `Given a ${acres}-acre parcel in ${district}, ${state} with ${roadDist}m frontage, surrounding residential composition (${residentialPct}%), urban catchment proximity, evaluate highway commercial plaza, agri-mall, or retail node viability under URDPFI town planning standards.`;

    case 'housing':
      return `Given a ${acres}-acre parcel in ${district}, ${state} with residential surroundings (${residentialPct}%), distance to city ${parcel.infrastructure?.nearestCityKm || 12} km, evaluate peri-urban residential plotting and eco-living suitability under PMAY and RERA environmental guidelines.`;

    case 'industrial':
      return `Given a ${acres}-acre parcel in ${district}, ${state} with ${roadDist}m road access, power grid ${gridDist} km, industrial cluster proximity, and residential buffer distance, evaluate light manufacturing assembly suitability under CPCB industrial siting guidelines.`;

    case 'agro_processing':
      return `Given a ${acres}-acre parcel in ${district}, ${state} with agricultural catchment (${agriPct}%), road access ${roadDist}m, evaluate food park and post-harvest crop processing hub viability under MoFPI PMKSY Agro-clusters scheme.`;

    case 'agroforestry':
      return `Given a ${acres}-acre semi-arid parcel in ${district}, ${state} with soil health ${soilHealth}/100 and seasonal moisture stress, evaluate carbon-credit agroforestry, bamboo, and dryland biomass cultivation under National Agroforestry Policy.`;

    default:
      return `Evaluate land suitability for ${candidateType} on ${acres} acres in ${district}, ${state} based on spatial infrastructure, surrounding land-use pattern, and government development policies.`;
  }
}

/**
 * Candidate-Specific RAG Retriever
 * Retrieves relevant authoritative documents, computes relevance score (0.0 - 1.0),
 * evaluates constraint rules, and calculates RAG Evidence Score & Traceability.
 */
export function retrieveCandidateRAGEvidence(candidateType, parcel, spatialAnalysis) {
  const matchingDocs = RAG_DOCUMENTS.filter(doc => doc.relevantLandUseTypes.includes(candidateType));
  const query = buildCandidateRAGQuery(candidateType, parcel, spatialAnalysis);

  const acres = parcel.areaAcres || parcel.area || 10;
  const slope = parcel.infrastructure?.slopeDegrees ?? 2.5;
  const roadDist = parcel.infrastructure?.roadDistanceMeters ?? 400;
  const gridDist = parcel.infrastructure?.gridDistanceKm ?? 1.5;
  const solarGHI = parcel.infrastructure?.solarRadiationKWh ?? 5.5;
  const soilHealth = parcel.soil?.healthScore ?? 70;
  const soilPh = parcel.soil?.pH ?? 7.0;
  const waterDist = parcel.water?.nearestWaterBodyKm ?? 2.0;
  const floodRisk = parcel.risks?.floodRisk ?? 'Low';
  const ecoSensitive = parcel.risks?.ecologicalSensitiveZone ?? false;

  const surroundingComposition = spatialAnalysis?.composition || { residential: 20, agricultural: 40, industrial: 10, commercial: 10, open: 20 };
  const saturationMetrics = spatialAnalysis?.saturationMetrics || {};

  let ragEvidenceScore = 0;
  let constraintPenalty = 0;
  let constraintStatus = 'ELIGIBLE'; // ELIGIBLE | CONDITIONALLY_ELIGIBLE | LOW_SUITABILITY | BLOCKED
  const evidenceList = [];
  const appliedRules = [];

  for (const doc of matchingDocs) {
    let relevance = doc.reliability; // Base relevance from authority
    let rulePassed = true;

    // Evaluate candidate-specific rules from retrieved document
    if (candidateType === 'solar') {
      if (doc.id === 'RAG-SOLAR-001') {
        if (gridDist <= doc.rules.optimalGridDistanceKm && solarGHI >= doc.rules.optimalSolarRadiationKWh && slope <= doc.rules.maxSlopeDegrees) {
          ragEvidenceScore += doc.evidenceBonus;
          appliedRules.push(`Eligible for PM-KUSUM Component A 30% CFA: ${gridDist} km to 33kV substation (within ${doc.rules.maxGridDistanceKm} km limit)`);
          relevance = 0.96;
        } else if (gridDist > doc.rules.maxGridDistanceKm) {
          rulePassed = false;
          constraintPenalty += doc.evidencePenaltyIfViolated;
          constraintStatus = 'LOW_SUITABILITY';
          appliedRules.push(`Substation distance (${gridDist} km) exceeds PM-KUSUM 5 km threshold: High line capex required`);
          relevance = 0.82;
        }
      }

      if (doc.id === 'RAG-SOLAR-002') {
        const solarSat = saturationMetrics.solar || 0;
        if (solarSat > 10) {
          rulePassed = false;
          constraintPenalty += 10;
          appliedRules.push(`SECI Substation Penetration Notice: ${solarSat} nearby solar facilities indicate high feeder congestion risk`);
          relevance = 0.90;
        }
      }

      // Arable prime land protection check: Prime high-fertility soil shouldn't be blanketed by solar
      if (soilHealth >= 80 && soilPh >= 6.8 && soilPh <= 7.8 && waterDist <= 1.5) {
        constraintPenalty += 8;
        appliedRules.push('Agricultural Conservation Guideline: High-fertility irrigated arable land has higher social/economic value for multi-cropping');
      }
    }

    if (candidateType === 'agriculture') {
      if (doc.id === 'RAG-AGRI-001') {
        if (soilPh >= doc.rules.optimalPhMin && soilPh <= doc.rules.optimalPhMax && soilHealth >= doc.rules.minSoilHealthScore) {
          ragEvidenceScore += doc.evidenceBonus;
          appliedRules.push(`ICAR Land Suitability Match: Soil pH ${soilPh} and health score ${soilHealth}/100 optimal for precision horticulture`);
          relevance = 0.95;
        } else if (soilPh < 5.8 || soilPh > 8.5 || soilHealth < 40) {
          rulePassed = false;
          constraintPenalty += doc.evidencePenaltyIfViolated;
          constraintStatus = 'LOW_SUITABILITY';
          appliedRules.push(`Severe soil degradation (pH ${soilPh}, health ${soilHealth}): Requires extensive bio-remediation before commercial farming`);
          relevance = 0.88;
        }
      }

      if (doc.id === 'RAG-AGRI-002') {
        if (waterDist <= 3.0 || parcel.water?.irrigationAccess) {
          ragEvidenceScore += doc.evidenceBonus;
          appliedRules.push('PMKSY 55% Micro-Drip Subsidy Match: Irrigation network and water resource verified within reach');
          relevance = 0.91;
        }
      }
    }

    if (candidateType === 'warehouse') {
      if (doc.id === 'RAG-LOGISTICS-001') {
        if (roadDist <= doc.rules.optimalRoadDistanceMeters && acres >= doc.rules.minAcreageWarehouse && slope <= doc.rules.maxTerrainSlopeWarehouse) {
          ragEvidenceScore += doc.evidenceBonus;
          appliedRules.push(`National Logistics Policy Corridor Match: Direct ${roadDist}m frontage supports heavy multi-axle freight movement`);
          relevance = 0.94;
        } else if (roadDist > doc.rules.maxRoadDistanceMeters) {
          rulePassed = false;
          constraintPenalty += doc.evidencePenaltyIfViolated;
          appliedRules.push(`Road distance (${roadDist}m) limits direct heavy trailer access`);
          relevance = 0.80;
        }
      }

      if (doc.id === 'RAG-LOGISTICS-002') {
        ragEvidenceScore += doc.evidenceBonus;
        appliedRules.push('AIF Scheme Match: Qualifies for 3% interest subvention on post-harvest cold storage bank loan');
        relevance = 0.92;
      }
    }

    if (candidateType === 'commercial') {
      if (doc.id === 'RAG-COMMERCIAL-001') {
        if (surroundingComposition.residential >= doc.rules.minResidentialSurroundingPercentForCommercial && roadDist <= doc.rules.maxRoadDistanceCommercialMeters) {
          ragEvidenceScore += doc.evidenceBonus;
          appliedRules.push(`URDPFI Commercial Catchment Match: ${surroundingComposition.residential}% surrounding residential density creates sustainable daily retail footfall`);
          relevance = 0.93;
        } else if (surroundingComposition.residential < 10 && roadDist > 500) {
          rulePassed = false;
          constraintPenalty += doc.evidencePenaltyIfViolated;
          constraintStatus = 'LOW_SUITABILITY';
          appliedRules.push('URDPFI Viability Notice: Insufficient residential population catchment (<10%) and distance from main road');
          relevance = 0.84;
        }
      }
    }

    if (candidateType === 'housing') {
      if (doc.id === 'RAG-HOUSING-001') {
        if (surroundingComposition.residential >= 25 && (parcel.infrastructure?.nearestCityKm || 12) <= doc.rules.maxDistanceToCityKm) {
          ragEvidenceScore += doc.evidenceBonus;
          appliedRules.push(`PMAY Peri-Urban Growth Zone: Located ${parcel.infrastructure?.nearestCityKm || 12} km from city center within active residential expansion belt`);
          relevance = 0.90;
        }
      }
    }

    if (candidateType === 'industrial') {
      if (doc.id === 'RAG-ENV-001') {
        if (surroundingComposition.residential > 40) {
          rulePassed = false;
          constraintPenalty += 20;
          constraintStatus = 'CONDITIONALLY_ELIGIBLE';
          appliedRules.push('CPCB Siting Conflict: Dense residential surroundings (>40%) require 500m mandatory green buffer, restricting heavy industry');
          relevance = 0.92;
        } else if (surroundingComposition.industrial >= 15) {
          ragEvidenceScore += 12;
          appliedRules.push('Industrial Cluster Synergy: Siting within established industrial/manufacturing corridor provides shared utility infrastructure');
          relevance = 0.91;
        }
      }
    }

    // Environmental Constraints for all candidates
    if (doc.id === 'RAG-ENV-001') {
      if (floodRisk === 'High') {
        if (candidateType === 'housing' || candidateType === 'commercial' || candidateType === 'industrial') {
          constraintPenalty += 30;
          constraintStatus = 'BLOCKED';
          appliedRules.push('CPCB / NDMA Disaster Bylaw: High flood hazard zone prohibits permanent residential/commercial plinth structures');
        }
      }
      if (ecoSensitive) {
        if (candidateType === 'industrial' || candidateType === 'warehouse') {
          constraintPenalty += 25;
          constraintStatus = 'BLOCKED';
          appliedRules.push('MoEFCC Eco-Sensitive Zone: Red/Orange industrial and heavy logistics operations prohibited');
        }
      }
    }

    evidenceList.push({
      documentId: doc.id,
      documentTitle: doc.documentTitle,
      authority: doc.authority,
      source: doc.source,
      dateVersion: doc.dateVersion,
      category: doc.category,
      relevanceScore: Number(relevance.toFixed(2)),
      rulePassed,
      evidenceSummary: doc.content.substring(0, 180) + '...',
      appliedRule: appliedRules[appliedRules.length - 1] || 'General domain guideline applied'
    });
  }

  // Cap RAG bonus and penalty
  ragEvidenceScore = Math.min(25, Math.max(0, ragEvidenceScore));
  constraintPenalty = Math.min(45, Math.max(0, constraintPenalty));

  return {
    candidateType,
    ragQuery: query,
    ragEvidenceScore,
    constraintPenalty,
    constraintStatus,
    evidenceList,
    appliedRules
  };
}
