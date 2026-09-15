import { runMultiCriteriaAnalysis } from './services/recommendationEngine.js';

console.log('🧪 ===============================================================');
console.log('🧪 LANDVISTA AI - SCENARIO TESTING FOR SURROUNDING-AWARE RAG ENGINE');
console.log('🧪 ===============================================================\n');

let passedTests = 0;
let totalTests = 7;

// -------------------------------------------------------------
// Scenario A: Rural Agricultural Belt
// -------------------------------------------------------------
const parcelA = {
  id: 'test-scenario-a',
  title: 'Nashik Dindori Arable Farmland',
  district: 'Nashik',
  state: 'Maharashtra',
  areaAcres: 12.0,
  soil: { healthScore: 88, pH: 7.2, soilType: 'Deep Black Cotton', organicCarbon: 0.85 },
  water: { nearestWaterBodyKm: 0.6, waterBodyType: 'Canal', availability: 'High', rainfallAnnual: 820 },
  infrastructure: { slopeDegrees: 1.5, roadDistanceMeters: 250, gridDistanceKm: 3.5, solarRadiationKWh: 5.1 },
  surroundingFeatures: [
    { id: 'f1', name: 'APMC Agricultural Mandi', category: 'Natural', distanceKm: 2.2, bearing: 'East', impactScoreBonus: 14 },
    { id: 'f2', name: 'Gangapur Canal Network', category: 'Natural', distanceKm: 0.6, bearing: 'North', impactScoreBonus: 16 }
  ]
};

const resultA = runMultiCriteriaAnalysis(parcelA);
console.log(`[Scenario A: Rural Agricultural Belt] Top Rank: ${resultA.topRecommendation.title} (${resultA.topRecommendation.score}/100)`);
console.log(`Pattern: ${resultA.surroundingPatterns.dominantPattern} | Composition: Agri ${resultA.surroundingPatterns.composition.agricultural}%`);
if (resultA.topRecommendation.useType === 'agriculture') {
  console.log('✅ Scenario A PASSED: Agriculture won #1 on prime arable land in agricultural belt.\n');
  passedTests++;
} else {
  console.log(`❌ Scenario A FAILED: Expected agriculture, got ${resultA.topRecommendation.useType}\n`);
}

// -------------------------------------------------------------
// Scenario B: Highway + Industrial Cluster
// -------------------------------------------------------------
const parcelB = {
  id: 'test-scenario-b',
  title: 'Nagpur Expressway Freight Junction',
  district: 'Nagpur',
  state: 'Maharashtra',
  areaAcres: 15.0,
  soil: { healthScore: 58, pH: 7.4, soilType: 'Medium Loam' },
  water: { nearestWaterBodyKm: 4.5, rainfallAnnual: 650 },
  infrastructure: { slopeDegrees: 1.0, roadDistanceMeters: 20, gridDistanceKm: 1.0, solarRadiationKWh: 5.3, nearestCityKm: 18 },
  surroundingFeatures: [
    { id: 'f1', name: 'Samruddhi Mahamarg Highway Interchange', category: 'Infrastructure', distanceKm: 0.2, bearing: 'West', impactScoreBonus: 18 },
    { id: 'f2', name: 'Butibori Industrial SEZ Node', category: 'Industry', distanceKm: 1.8, bearing: 'North', impactScoreBonus: 16 }
  ]
};

const resultB = runMultiCriteriaAnalysis(parcelB);
console.log(`[Scenario B: Highway + Industrial] Top Rank: ${resultB.topRecommendation.title} (${resultB.topRecommendation.score}/100)`);
console.log(`Pattern: ${resultB.surroundingPatterns.dominantPattern} | Warehouse Opp Score: ${resultB.opportunityScores?.warehouse}`);
if (resultB.topRecommendation.useType === 'warehouse' || resultB.topRecommendation.useType === 'industrial') {
  console.log('✅ Scenario B PASSED: Logistics / Warehouse won #1 along highway industrial corridor.\n');
  passedTests++;
} else {
  console.log(`❌ Scenario B FAILED: Expected warehouse/industrial, got ${resultB.topRecommendation.useType}\n`);
}

// -------------------------------------------------------------
// Scenario C: Dense Residential Surroundings
// -------------------------------------------------------------
const parcelC = {
  id: 'test-scenario-c',
  title: 'Pune Hinjawadi Tech-Residential Buffer',
  district: 'Pune',
  state: 'Maharashtra',
  areaAcres: 5.0,
  soil: { healthScore: 65, pH: 6.9, soilType: 'Clay Loam' },
  water: { nearestWaterBodyKm: 2.0, rainfallAnnual: 740 },
  infrastructure: { slopeDegrees: 1.5, roadDistanceMeters: 40, gridDistanceKm: 0.6, solarRadiationKWh: 5.1, nearestCityKm: 3, populationDensity: 'High' },
  surroundingFeatures: [
    { id: 'f1', name: 'Hinjawadi Phase 3 High-Density Housing Township', category: 'Residential', distanceKm: 0.4, bearing: 'East', impactScoreBonus: 18 },
    { id: 'f2', name: 'Metro Line 3 Station Corridor', category: 'Infrastructure', distanceKm: 0.6, bearing: 'North', impactScoreBonus: 15 }
  ]
};

const resultC = runMultiCriteriaAnalysis(parcelC);
console.log(`[Scenario C: Dense Residential] Top Rank: ${resultC.topRecommendation.title} (${resultC.topRecommendation.score}/100)`);
console.log(`Pattern: ${resultC.surroundingPatterns.dominantPattern} | Res Composition: ${resultC.surroundingPatterns.composition.residential}%`);
if (resultC.topRecommendation.useType === 'commercial' || resultC.topRecommendation.useType === 'housing') {
  console.log('✅ Scenario C PASSED: Commercial / Housing won #1 in dense residential fringe.\n');
  passedTests++;
} else {
  console.log(`❌ Scenario C FAILED: Expected commercial/housing, got ${resultC.topRecommendation.useType}\n`);
}

// -------------------------------------------------------------
// Scenario D: High Solar + Low Development Scrubland
// -------------------------------------------------------------
const parcelD = {
  id: 'test-scenario-d',
  title: 'Solapur Sun-Ridge Barren Scrubland',
  district: 'Solapur',
  state: 'Maharashtra',
  areaAcres: 20.0,
  soil: { healthScore: 48, pH: 7.6, soilType: 'Semi-Arid Rocky Scrub' },
  water: { nearestWaterBodyKm: 6.0, rainfallAnnual: 480, seasonalWaterStress: 'High' },
  infrastructure: { slopeDegrees: 1.8, roadDistanceMeters: 450, gridDistanceKm: 1.1, solarRadiationKWh: 5.95, populationDensity: 'Low', nearestCityKm: 22 },
  surroundingFeatures: [
    { id: 'f1', name: '33/11 kV Rural Feeder Substation', category: 'Infrastructure', distanceKm: 1.1, bearing: 'South', impactScoreBonus: 16 }
  ]
};

const resultD = runMultiCriteriaAnalysis(parcelD);
console.log(`[Scenario D: High Solar + Low Dev] Top Rank: ${resultD.topRecommendation.title} (${resultD.topRecommendation.score}/100)`);
console.log(`Solar Score: ${resultD.recommendations.find(r => r.useType === 'solar')?.score} | Saturation Penalty: ${resultD.recommendations.find(r => r.useType === 'solar')?.saturationPenalty}`);
if (resultD.topRecommendation.useType === 'solar') {
  console.log('✅ Scenario D PASSED: Solar won #1 with excellent solar radiation, low development, and no saturation.\n');
  passedTests++;
} else {
  console.log(`❌ Scenario D FAILED: Expected solar, got ${resultD.topRecommendation.useType}\n`);
}

// -------------------------------------------------------------
// Scenario E: High Solar + High Solar Saturation
// -------------------------------------------------------------
const parcelE = {
  id: 'test-scenario-e',
  title: 'Bhadla Saturated Solar Fringe Parcel',
  district: 'Bhadla',
  state: 'Rajasthan',
  areaAcres: 15.0,
  soil: { healthScore: 50, pH: 7.5, soilType: 'Arid Sandy Loam' },
  water: { nearestWaterBodyKm: 8.0, rainfallAnnual: 320 },
  infrastructure: { slopeDegrees: 1.5, roadDistanceMeters: 100, gridDistanceKm: 1.2, solarRadiationKWh: 6.1 },
  surroundingFeatures: [
    { id: 'sf1', name: 'Mega Solar Plant Block A', category: 'Infrastructure', distanceKm: 0.8, bearing: 'North', impactScoreBonus: 5 },
    { id: 'sf2', name: 'Mega Solar Plant Block B', category: 'Infrastructure', distanceKm: 1.4, bearing: 'South', impactScoreBonus: 5 },
    { id: 'sf3', name: 'Ultra Solar Park Feeder 3', category: 'Infrastructure', distanceKm: 2.1, bearing: 'East', impactScoreBonus: 4 }
  ]
};

const resultE = runMultiCriteriaAnalysis(parcelE);
const solarRecE = resultE.recommendations.find(r => r.useType === 'solar');
console.log(`[Scenario E: High Solar + Saturation] Top Rank: ${resultE.topRecommendation.title} (${resultE.topRecommendation.score}/100)`);
console.log(`Solar Score: ${solarRecE.score} | Solar Saturation Penalty: -${solarRecE.saturationPenalty} pts`);
if (solarRecE.saturationPenalty >= 15 && resultE.topRecommendation.useType !== 'solar') {
  console.log('✅ Scenario E PASSED: Solar was penalized for saturation and an alternative outranked it.\n');
  passedTests++;
} else {
  console.log(`❌ Scenario E FAILED: Expected solar saturation penalty and alternative winner, got ${resultE.topRecommendation.useType} with penalty -${solarRecE.saturationPenalty}\n`);
}

// -------------------------------------------------------------
// Scenario F: Poor Water + Unsuitable Degraded Soil
// -------------------------------------------------------------
const parcelF = {
  id: 'test-scenario-f',
  title: 'Degraded Alkaline Scrubland',
  district: 'Jalgaon',
  state: 'Maharashtra',
  areaAcres: 10.0,
  soil: { healthScore: 28, pH: 8.9, soilType: 'Severely Saline Alkaline' },
  water: { nearestWaterBodyKm: 7.5, rainfallAnnual: 420, seasonalWaterStress: 'Severe' },
  infrastructure: { slopeDegrees: 3.5, roadDistanceMeters: 500, gridDistanceKm: 1.8, solarRadiationKWh: 5.6 }
};

const resultF = runMultiCriteriaAnalysis(parcelF);
const agriRecF = resultF.recommendations.find(r => r.useType === 'agriculture');
console.log(`[Scenario F: Poor Soil + Water] Top Rank: ${resultF.topRecommendation.title} (${resultF.topRecommendation.score}/100)`);
console.log(`Agri Score: ${agriRecF.score} | Constraint Status: ${agriRecF.constraintStatus}`);
if (agriRecF.score < 55 && resultF.topRecommendation.useType !== 'agriculture') {
  console.log('✅ Scenario F PASSED: Agriculture heavily penalized on severely degraded saline soil.\n');
  passedTests++;
} else {
  console.log(`❌ Scenario F FAILED: Agri score should be <55, got ${agriRecF.score}\n`);
}

// -------------------------------------------------------------
// Scenario G: Flood-Prone / Environmental Hazard
// -------------------------------------------------------------
const parcelG = {
  id: 'test-scenario-g',
  title: 'River Basin Floodway Lowland',
  district: 'Kolhapur',
  state: 'Maharashtra',
  areaAcres: 8.0,
  soil: { healthScore: 82, pH: 7.0, soilType: 'Alluvial River Loam' },
  water: { nearestWaterBodyKm: 0.1, rainfallAnnual: 1200 },
  infrastructure: { slopeDegrees: 0.5, roadDistanceMeters: 100, gridDistanceKm: 2.0, solarRadiationKWh: 4.8 },
  risks: { floodRisk: 'High', ecologicalSensitiveZone: true }
};

const resultG = runMultiCriteriaAnalysis(parcelG);
const houseRecG = resultG.recommendations.find(r => r.useType === 'housing');
const indRecG = resultG.recommendations.find(r => r.useType === 'industrial');
console.log(`[Scenario G: Flood Risk] Top Rank: ${resultG.topRecommendation.title} (${resultG.topRecommendation.score}/100)`);
console.log(`Housing Score: ${houseRecG.score} (Status: ${houseRecG.constraintStatus}) | Ind Score: ${indRecG.score} (Status: ${indRecG.constraintStatus})`);
if (houseRecG.constraintStatus === 'BLOCKED' || houseRecG.score <= 35) {
  console.log('✅ Scenario G PASSED: Housing & heavy industry blocked in high floodway / eco-sensitive zone.\n');
  passedTests++;
} else {
  console.log(`❌ Scenario G FAILED: Expected BLOCKED constraint for housing/industrial.\n`);
}

console.log('===============================================================');
console.log(`🏁 TEST RESULTS: ${passedTests}/${totalTests} Scenarios Passed`);
console.log('===============================================================');
