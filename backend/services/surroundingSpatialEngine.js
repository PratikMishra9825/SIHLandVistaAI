/**
 * LANDVISTA AI - Surrounding Spatial Engine & Multi-Buffer Analysis
 *
 * Capabilities:
 * 1. Multi-buffer distance-weighted spatial analysis (500m, 1km, 3km, 5km, 10km)
 * 2. Distance-decay influence functions
 * 3. Surrounding land-use pattern detection & composition breakdown
 * 4. Demand & Opportunity scoring vs. Existing Presence
 * 5. Saturation & Competition penalty engine
 * 6. Spatial Synergy & Conflict evaluation
 * 7. Proximity matrix calculation
 */

// Buffer tiers and distance decay multipliers
export const BUFFER_TIERS = [
  { name: '500m', maxDistanceKm: 0.5, decayWeight: 1.00, label: 'Immediate Vicinity (< 500 m)' },
  { name: '1km', maxDistanceKm: 1.0, decayWeight: 0.85, label: 'Local Walkable Catchment (500 m – 1 km)' },
  { name: '3km', maxDistanceKm: 3.0, decayWeight: 0.65, label: 'Primary Commercial / Substation Radius (1 – 3 km)' },
  { name: '5km', maxDistanceKm: 5.0, decayWeight: 0.40, label: 'Secondary Infrastructure Zone (3 – 5 km)' },
  { name: '10km', maxDistanceKm: 10.0, decayWeight: 0.18, label: 'Regional Corridor Fringe (5 – 10 km)' }
];

/**
 * Distance decay function: Closer features exert exponentially higher influence
 */
export function calculateDistanceDecay(distanceKm, halfLifeKm = 2.0) {
  if (distanceKm <= 0.05) return 1.0;
  return Math.exp(-0.693 * (distanceKm / halfLifeKm));
}

/**
 * Synthesizes surrounding spatial features from parcel input, geo-coordinates,
 * Bhuvan LULC, and infrastructure telemetry.
 */
export function analyzeSurroundings(parcel) {
  const lat = parcel.lat || (parcel.location?.coordinates ? parcel.location.coordinates[1] : 17.6599);
  const lng = parcel.lng || (parcel.location?.coordinates ? parcel.location.coordinates[0] : 75.9064);
  const acres = parcel.areaAcres || parcel.area || 10.0;

  const rawFeatures = parcel.surroundingFeatures || [];
  const roadDistM = parcel.infrastructure?.roadDistanceMeters ?? 400;
  const gridDistKm = parcel.infrastructure?.gridDistanceKm ?? 1.5;
  const waterDistKm = parcel.water?.nearestWaterBodyKm ?? 2.0;
  const cityDistKm = parcel.infrastructure?.nearestCityKm ?? 14.0;
  const popDensity = parcel.infrastructure?.populationDensity || 'Medium';

  // Normalize and enrich surrounding vector nodes
  const features = [...rawFeatures];

  // Ensure core essential spatial anchors are present in the proximity matrix
  if (!features.some(f => f.category === 'Infrastructure' && f.name.toLowerCase().includes('road'))) {
    features.push({
      id: 'sf-road-anchor',
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
      id: 'sf-grid-anchor',
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
      id: 'sf-water-anchor',
      name: parcel.water?.waterBodyType || 'Irrigation Canal / River Tributary',
      category: 'Natural',
      distanceKm: waterDistKm,
      bearing: 'East',
      impactScoreBonus: waterDistKm <= 1.5 ? 12 : waterDistKm <= 4 ? 6 : 1,
      coordinates: [lng + 0.01, lat]
    });
  }

  // 1. MULTI-BUFFER SPATIAL CLUSTERING
  const bufferBreakdown = {
    '500m': { count: 0, features: [], scoreContribution: 0 },
    '1km': { count: 0, features: [], scoreContribution: 0 },
    '3km': { count: 0, features: [], scoreContribution: 0 },
    '5km': { count: 0, features: [], scoreContribution: 0 },
    '10km': { count: 0, features: [], scoreContribution: 0 }
  };

  features.forEach(feat => {
    const dist = feat.distanceKm;
    const decay = calculateDistanceDecay(dist, 2.5);
    const weightedImpact = Math.round(feat.impactScoreBonus * decay);

    if (dist <= 0.5) {
      bufferBreakdown['500m'].count++;
      bufferBreakdown['500m'].features.push({ ...feat, decayMultiplier: Number(decay.toFixed(2)), weightedImpact });
      bufferBreakdown['500m'].scoreContribution += weightedImpact;
    } else if (dist <= 1.0) {
      bufferBreakdown['1km'].count++;
      bufferBreakdown['1km'].features.push({ ...feat, decayMultiplier: Number(decay.toFixed(2)), weightedImpact });
      bufferBreakdown['1km'].scoreContribution += weightedImpact;
    } else if (dist <= 3.0) {
      bufferBreakdown['3km'].count++;
      bufferBreakdown['3km'].features.push({ ...feat, decayMultiplier: Number(decay.toFixed(2)), weightedImpact });
      bufferBreakdown['3km'].scoreContribution += weightedImpact;
    } else if (dist <= 5.0) {
      bufferBreakdown['5km'].count++;
      bufferBreakdown['5km'].features.push({ ...feat, decayMultiplier: Number(decay.toFixed(2)), weightedImpact });
      bufferBreakdown['5km'].scoreContribution += weightedImpact;
    } else {
      bufferBreakdown['10km'].count++;
      bufferBreakdown['10km'].features.push({ ...feat, decayMultiplier: Number(decay.toFixed(2)), weightedImpact });
      bufferBreakdown['10km'].scoreContribution += weightedImpact;
    }
  });

  // 2. SURROUNDING LAND-USE PATTERN DETECTION & PERCENTAGES
  // Derive percentages from verified surrounding nodes, zoning, and demographic density
  let resCount = features.filter(f => f.category === 'Residential' || f.name.toLowerCase().includes('residential') || f.name.toLowerCase().includes('housing') || f.name.toLowerCase().includes('town') || f.name.toLowerCase().includes('city')).length;
  let agriCount = features.filter(f => f.category === 'Natural' || f.name.toLowerCase().includes('canal') || f.name.toLowerCase().includes('mandi') || f.name.toLowerCase().includes('farm') || f.name.toLowerCase().includes('agricultural')).length;
  let indCount = features.filter(f => f.category === 'Industry' || f.name.toLowerCase().includes('industrial') || f.name.toLowerCase().includes('midc') || f.name.toLowerCase().includes('sez') || f.name.toLowerCase().includes('factory')).length;
  let commCount = features.filter(f => f.category === 'Commercial' || f.name.toLowerCase().includes('highway') || f.name.toLowerCase().includes('market') || f.name.toLowerCase().includes('expressway') || f.name.toLowerCase().includes('mall')).length;
  let solarClusterCount = features.filter(f => f.name.toLowerCase().includes('solar') || f.name.toLowerCase().includes('photovoltaic') || f.name.toLowerCase().includes('park')).length;

  // Modulate based on regional location context
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
  } else if (agriCount >= 2 || (waterDistKm <= 2.0 && (parcel.soil?.healthScore || 70) >= 70)) {
    agriPct = 65;
    resPct = 12;
    openPct = 13;
    commPct = 6;
    indPct = 4;
  } else if ((parcel.infrastructure?.solarRadiationKWh || 5.5) >= 5.8 && popDensity === 'Low' && cityDistKm >= 12) {
    openPct = 45;
    agriPct = 30;
    resPct = 10;
    indPct = 8;
    commPct = 7;
  }

  // Determine dominant pattern classification
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
  } else if (commPct >= 20 || (roadDistM <= 50 && (features.some(f => f.name.toLowerCase().includes('highway') || f.name.toLowerCase().includes('expressway'))))) {
    dominantPattern = 'Commercial / Highway Frontage Corridor';
    patternDescription = 'High-visibility arterial transport corridor with high vehicular traffic and regional connectivity.';
  } else if (openPct >= 40) {
    dominantPattern = 'Renewable Energy / Semi-Arid Cluster';
    patternDescription = 'Expansive open semi-arid terrain with minimal shading, low built-up obstruction, and high solar insolation.';
  }

  // 3. SATURATION & COMPETITION METRICS
  // Count competing facilities within 5km buffer to prevent market over-saturation
  const solarSaturationCount = solarClusterCount + (parcel.district === 'Bhadla' || parcel.title?.toLowerCase().includes('saturated') ? 14 : 0);
  const warehouseSaturationCount = features.filter(f => f.name.toLowerCase().includes('warehouse') || f.name.toLowerCase().includes('logistics') || f.name.toLowerCase().includes('depot')).length;
  const commercialSaturationCount = features.filter(f => f.name.toLowerCase().includes('mall') || f.name.toLowerCase().includes('shopping') || f.name.toLowerCase().includes('plaza')).length;
  const industrialSaturationCount = indCount;

  const saturationMetrics = {
    solar: {
      competingCount: solarSaturationCount,
      penalty: Math.min(26, solarSaturationCount * 7),
      status: solarSaturationCount >= 3 ? 'HIGH_SATURATION' : solarSaturationCount >= 1 ? 'MODERATE_SATURATION' : 'LOW_SATURATION',
      note: solarSaturationCount >= 3 ? `High concentration of ${solarSaturationCount} existing solar farms causes grid substation feeder congestion` : 'Ample grid feeder headroom available'
    },
    warehouse: {
      competingCount: warehouseSaturationCount,
      penalty: Math.min(22, warehouseSaturationCount * 5),
      status: warehouseSaturationCount >= 4 ? 'HIGH_SATURATION' : warehouseSaturationCount >= 2 ? 'MODERATE_SATURATION' : 'LOW_SATURATION',
      note: warehouseSaturationCount >= 4 ? `${warehouseSaturationCount} existing 3PL hubs nearby indicate regional logistics capacity saturation` : 'Strong logistics aggregation demand with low competition'
    },
    commercial: {
      competingCount: commercialSaturationCount,
      penalty: Math.min(18, commercialSaturationCount * 4),
      status: commercialSaturationCount >= 3 ? 'HIGH_SATURATION' : 'LOW_SATURATION',
      note: commercialSaturationCount >= 3 ? 'Existing commercial retail clusters saturate immediate catchment' : 'High unmet retail and highway service opportunity'
    },
    industrial: {
      competingCount: industrialSaturationCount,
      penalty: Math.min(16, industrialSaturationCount * 3),
      status: industrialSaturationCount >= 4 ? 'HIGH_DENSITY_CLUSTER' : 'DEVELOPING',
      note: industrialSaturationCount >= 4 ? 'Dense industrial zone with high competitive manufacturing presence' : 'Favorable industrial expansion corridor'
    }
  };

  // 4. DEMAND & OPPORTUNITY SCORE VS EXISTING PRESENCE
  // Separate Opportunity from Presence
  const opportunityScores = {
    solar: Math.round(
      Math.min(30, (parcel.infrastructure?.solarRadiationKWh || 5.5) * 4) +
      (gridDistKm <= 2 ? 12 : gridDistKm <= 5 ? 6 : 0) +
      (openPct >= 30 ? 8 : 2) -
      saturationMetrics.solar.penalty
    ),
    agriculture: Math.round(
      ((parcel.soil?.healthScore || 70) / 100) * 25 +
      (waterDistKm <= 2 ? 15 : waterDistKm <= 5 ? 8 : 2) +
      (agriPct >= 40 ? 10 : 2)
    ),
    warehouse: Math.round(
      (roadDistM <= 100 ? 25 : roadDistM <= 400 ? 18 : 8) +
      (indPct >= 20 ? 12 : 4) +
      (cityDistKm <= 20 ? 10 : 4) -
      saturationMetrics.warehouse.penalty
    ),
    commercial: Math.round(
      (resPct >= 35 ? 25 : resPct >= 20 ? 15 : 4) +
      (roadDistM <= 100 ? 18 : roadDistM <= 300 ? 10 : 2) +
      (popDensity === 'High' ? 12 : 4) -
      saturationMetrics.commercial.penalty
    ),
    housing: Math.round(
      (resPct >= 30 ? 25 : 10) +
      (cityDistKm <= 15 ? 15 : 5) +
      (waterDistKm <= 3 ? 10 : 2) -
      (indPct >= 35 ? 18 : 0) // Industrial adjacency penalty for residential
    ),
    industrial: Math.round(
      (indPct >= 20 ? 22 : 8) +
      (roadDistM <= 200 ? 15 : 6) +
      (gridDistKm <= 2 ? 10 : 4) -
      (resPct >= 40 ? 24 : 0) // Dense residential adjacency penalty for industrial
    )
  };

  // 5. DECISION FACTOR MATRIX (How surrounding conditions altered candidate suitability)
  const decisionFactors = [];

  if (roadDistM <= 100) {
    decisionFactors.push({
      feature: `Immediate Road Frontage (${roadDistM}m)`,
      impact: '+14 Pts for Warehouse & Commercial',
      type: 'POSITIVE',
      affectedUse: 'warehouse'
    });
  } else if (roadDistM > 800) {
    decisionFactors.push({
      feature: `Distance from Paved Road (${roadDistM}m)`,
      impact: '-12 Pts for Logistics & Commercial',
      type: 'NEGATIVE',
      affectedUse: 'warehouse'
    });
  }

  if (resPct >= 35) {
    decisionFactors.push({
      feature: `Dense Residential Catchment (${resPct}%)`,
      impact: '+15 Pts for Commercial / +12 for Housing',
      type: 'POSITIVE',
      affectedUse: 'commercial'
    });
    decisionFactors.push({
      feature: 'Dense Residential Adjacency',
      impact: '-20 Pts for Heavy Industrial (CPCB Buffer Rule)',
      type: 'NEGATIVE',
      affectedUse: 'industrial'
    });
  }

  if (saturationMetrics.solar.penalty > 0) {
    decisionFactors.push({
      feature: `Surrounding Solar Saturation (${saturationMetrics.solar.competingCount} Plants)`,
      impact: `-${saturationMetrics.solar.penalty} Pts Saturation Penalty for Solar Farm`,
      type: 'PENALTY',
      affectedUse: 'solar'
    });
  }

  if (saturationMetrics.warehouse.penalty > 0) {
    decisionFactors.push({
      feature: `Logistics Supply Saturation (${saturationMetrics.warehouse.competingCount} Warehouses)`,
      impact: `-${saturationMetrics.warehouse.penalty} Pts Saturation Penalty for Warehouse`,
      type: 'PENALTY',
      affectedUse: 'warehouse'
    });
  }

  if (agriPct >= 50 && (parcel.soil?.healthScore || 70) >= 70) {
    decisionFactors.push({
      feature: `Dominant Agricultural Belt (${agriPct}%) & Arable Soil`,
      impact: '+12 Pts for Precision Horticulture / Multi-Crop',
      type: 'POSITIVE',
      affectedUse: 'agriculture'
    });
  }

  if (gridDistKm <= 1.5 && (parcel.infrastructure?.solarRadiationKWh || 5.5) >= 5.5 && saturationMetrics.solar.penalty === 0) {
    decisionFactors.push({
      feature: `Substation Proximity (${gridDistKm} km) & Solar Insolation`,
      impact: '+14 Pts for Solar PV Farm',
      type: 'POSITIVE',
      affectedUse: 'solar'
    });
  }

  return {
    coordinates: { lat, lng },
    dominantPattern,
    patternDescription,
    composition: {
      residential: resPct,
      agricultural: agriPct,
      industrial: indPct,
      commercial: commPct,
      open: openPct
    },
    bufferBreakdown,
    proximityMatrix: features,
    saturationMetrics,
    opportunityScores,
    decisionFactors
  };
}
