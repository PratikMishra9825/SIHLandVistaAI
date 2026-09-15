import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import LandParcel from './models/LandParcel.js';
import User from './models/User.js';
import { connectDB } from './config/db.js';

dotenv.config();

const DEMO_USERS = [
  {
    name: 'Pratik Mishra (Landowner Demo)',
    email: 'demo@landvista.ai',
    passwordPlain: 'Demo@123',
    role: 'landowner',
    phone: '+91 98234 56789',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Pratik'
  },
  {
    name: 'Gov Authority (PMRDA/CIDCO Demo)',
    email: 'government@landvista.ai',
    passwordPlain: 'Government@123',
    role: 'government',
    phone: '+91 98111 22334',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Government'
  },
  {
    name: 'Dr. Ramesh Patil (Soil Expert Demo)',
    email: 'expert@landvista.ai',
    passwordPlain: 'Expert@123',
    role: 'soilExpert',
    phone: '+91 98220 44102',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Ramesh'
  },
  {
    name: 'Rameshwar Shinde (Farmer Demo)',
    email: 'farmer@landvista.ai',
    passwordPlain: 'Farmer@123',
    role: 'farmer',
    phone: '+91 94222 33445',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Farmer'
  },
  {
    name: 'Nexus Infra & Logistics (Developer Demo)',
    email: 'developer@landvista.ai',
    passwordPlain: 'Developer@123',
    role: 'developer',
    phone: '+91 99000 88776',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Developer'
  }
];

const DEMO_PARCELS = [
  {
    title: 'Solapur Sun-Ridge Parcel (Hero SIH Demo)',
    surveyNumber: 'MH-SOL-2024/782B',
    district: 'Solapur',
    state: 'Maharashtra',
    area: 10.0,
    currentUsage: 'Unused Semi-Arid Scrubland',
    ownership: 'Private',
    isDemo: true,
    location: {
      type: 'Point',
      coordinates: [75.9064, 17.6599] // [lng, lat]
    },
    soil: {
      pH: 7.2,
      nitrogen: 'Low',
      nitrogenValue: 185,
      phosphorus: 'Medium',
      phosphorusValue: 18,
      potassium: 'High',
      potassiumValue: 310,
      organicCarbon: 0.42,
      moisture: 18,
      electricalConductivity: 0.45,
      soilType: 'Medium Black / Semi-Arid Loam',
      source: 'verified',
      healthScore: 68
    },
    water: {
      availability: 'Medium',
      groundwaterDepth: 48,
      rainfallAnnual: 540,
      nearestWaterBodyKm: 3.4,
      waterBodyType: 'Canal',
      irrigationAccess: true,
      seasonalWaterStress: 'Moderate',
      score: 62
    },
    infrastructure: {
      roadAccessQuality: 'Good',
      roadDistanceMeters: 40,
      gridDistanceKm: 1.2,
      substationCapacityKVA: 33000,
      railwayDistanceKm: 8.5,
      nearestCityKm: 14,
      populationDensity: 'Medium',
      zoning: 'Agricultural',
      elevationMeters: 465,
      slopeDegrees: 2.1,
      solarRadiationKWh: 5.85
    },
    risks: {
      floodRisk: 'Low',
      earthquakeZone: 'Zone III',
      landslideRisk: 'Low',
      ecologicalSensitiveZone: false,
      waterStressRisk: 'Moderate',
      pollutionRisk: 'Low',
      regulatoryRestrictions: ['Zoning conversion permit needed for commercial setup']
    },
    solarPotential: 94,
    currentPotentialIndex: 78,
    futurePotentialIndex: 91
  },
  {
    title: 'Bengaluru Logistics Corridor Parcel',
    surveyNumber: 'KA-BLR-8831/1A',
    district: 'Bengaluru Rural',
    state: 'Karnataka',
    area: 5.2,
    currentUsage: 'Fallow Industrial Transition Land',
    ownership: 'Private',
    isDemo: true,
    location: {
      type: 'Point',
      coordinates: [77.7066, 13.1986]
    },
    soil: {
      pH: 6.4,
      nitrogen: 'Medium',
      nitrogenValue: 240,
      phosphorus: 'Low',
      phosphorusValue: 12,
      potassium: 'Medium',
      potassiumValue: 210,
      organicCarbon: 0.55,
      moisture: 24,
      electricalConductivity: 0.32,
      soilType: 'Red Laterite Clay',
      source: 'demo',
      healthScore: 61
    },
    water: {
      availability: 'Medium',
      groundwaterDepth: 95,
      rainfallAnnual: 920,
      nearestWaterBodyKm: 1.8,
      waterBodyType: 'Lake',
      irrigationAccess: false,
      seasonalWaterStress: 'Moderate',
      score: 55
    },
    infrastructure: {
      roadAccessQuality: 'Excellent',
      roadDistanceMeters: 10,
      gridDistanceKm: 0.4,
      substationCapacityKVA: 66000,
      railwayDistanceKm: 4.2,
      nearestCityKm: 6,
      populationDensity: 'High',
      zoning: 'Mixed',
      elevationMeters: 915,
      slopeDegrees: 1.5,
      solarRadiationKWh: 4.9
    },
    risks: {
      floodRisk: 'Low',
      earthquakeZone: 'Zone II',
      landslideRisk: 'Low',
      ecologicalSensitiveZone: false,
      waterStressRisk: 'Moderate',
      pollutionRisk: 'Low',
      regulatoryRestrictions: ['Pollution control board clearance for chemical storage']
    },
    solarPotential: 75,
    currentPotentialIndex: 84,
    futurePotentialIndex: 95
  },
  {
    title: 'Bareilly Fertile Basin Plain',
    surveyNumber: 'UP-BLY-4192/4',
    district: 'Bareilly',
    state: 'Uttar Pradesh',
    area: 8.0,
    currentUsage: 'Seasonal Underutilized Agri Land',
    ownership: 'Private',
    isDemo: true,
    location: {
      type: 'Point',
      coordinates: [79.4304, 28.3670]
    },
    soil: {
      pH: 6.9,
      nitrogen: 'High',
      nitrogenValue: 340,
      phosphorus: 'High',
      phosphorusValue: 32,
      potassium: 'High',
      potassiumValue: 360,
      organicCarbon: 0.85,
      moisture: 38,
      electricalConductivity: 0.22,
      soilType: 'Alluvial Loam',
      source: 'verified',
      healthScore: 92
    },
    water: {
      availability: 'Very High',
      groundwaterDepth: 12,
      rainfallAnnual: 1080,
      nearestWaterBodyKm: 0.8,
      waterBodyType: 'Canal',
      irrigationAccess: true,
      seasonalWaterStress: 'Low',
      score: 94
    },
    infrastructure: {
      roadAccessQuality: 'Moderate',
      roadDistanceMeters: 120,
      gridDistanceKm: 2.1,
      substationCapacityKVA: 11000,
      railwayDistanceKm: 12.0,
      nearestCityKm: 18,
      populationDensity: 'Medium',
      zoning: 'Agricultural',
      elevationMeters: 168,
      slopeDegrees: 0.8,
      solarRadiationKWh: 4.8
    },
    risks: {
      floodRisk: 'Medium',
      earthquakeZone: 'Zone IV',
      landslideRisk: 'Low',
      ecologicalSensitiveZone: false,
      waterStressRisk: 'Low',
      pollutionRisk: 'Low',
      regulatoryRestrictions: ['Fertilizer discharge regulation near canal']
    },
    solarPotential: 72,
    currentPotentialIndex: 82,
    futurePotentialIndex: 90
  },
  {
    title: 'Jodhpur Thar Sunfield',
    surveyNumber: 'RJ-JDH-9011/B',
    district: 'Jodhpur',
    state: 'Rajasthan',
    area: 15.0,
    currentUsage: 'Rocky Barren Wasteland',
    ownership: 'Private',
    isDemo: true,
    location: {
      type: 'Point',
      coordinates: [73.0243, 26.2389]
    },
    soil: {
      pH: 8.4,
      nitrogen: 'Low',
      nitrogenValue: 110,
      phosphorus: 'Low',
      phosphorusValue: 9,
      potassium: 'Low',
      potassiumValue: 140,
      organicCarbon: 0.18,
      moisture: 8,
      electricalConductivity: 1.1,
      soilType: 'Arid Sandy Desert Soil',
      source: 'demo',
      healthScore: 34
    },
    water: {
      availability: 'Low',
      groundwaterDepth: 140,
      rainfallAnnual: 290,
      nearestWaterBodyKm: 18.0,
      waterBodyType: 'None',
      irrigationAccess: false,
      seasonalWaterStress: 'Severe',
      score: 22
    },
    infrastructure: {
      roadAccessQuality: 'Moderate',
      roadDistanceMeters: 200,
      gridDistanceKm: 0.8,
      substationCapacityKVA: 132000,
      railwayDistanceKm: 14.5,
      nearestCityKm: 32,
      populationDensity: 'Low',
      zoning: 'Unclassified',
      elevationMeters: 242,
      slopeDegrees: 1.1,
      solarRadiationKWh: 6.4
    },
    risks: {
      floodRisk: 'Low',
      earthquakeZone: 'Zone II',
      landslideRisk: 'Low',
      ecologicalSensitiveZone: false,
      waterStressRisk: 'Severe',
      pollutionRisk: 'Low',
      regulatoryRestrictions: ['Water extraction restriction from deep aquifers']
    },
    solarPotential: 98,
    currentPotentialIndex: 74,
    futurePotentialIndex: 93
  },
  {
    title: 'Pune Metro Peripheral Civic Land (Govt)',
    surveyNumber: 'MH-PUN-CIDCO-102',
    district: 'Pune',
    state: 'Maharashtra',
    area: 12.0,
    currentUsage: 'Vacant Government Land Reserve',
    ownership: 'Government',
    isDemo: true,
    location: {
      type: 'Point',
      coordinates: [73.8567, 18.5204]
    },
    soil: {
      pH: 7.0,
      nitrogen: 'Medium',
      nitrogenValue: 220,
      phosphorus: 'Medium',
      phosphorusValue: 20,
      potassium: 'Medium',
      potassiumValue: 260,
      organicCarbon: 0.51,
      moisture: 26,
      electricalConductivity: 0.38,
      soilType: 'Clayey Loam / Murrum',
      source: 'verified',
      healthScore: 71
    },
    water: {
      availability: 'High',
      groundwaterDepth: 32,
      rainfallAnnual: 760,
      nearestWaterBodyKm: 1.2,
      waterBodyType: 'River',
      irrigationAccess: true,
      seasonalWaterStress: 'Low',
      score: 82
    },
    infrastructure: {
      roadAccessQuality: 'Excellent',
      roadDistanceMeters: 5,
      gridDistanceKm: 0.2,
      substationCapacityKVA: 33000,
      railwayDistanceKm: 3.5,
      nearestCityKm: 4,
      populationDensity: 'High',
      zoning: 'Mixed',
      elevationMeters: 560,
      slopeDegrees: 2.8,
      solarRadiationKWh: 5.2
    },
    risks: {
      floodRisk: 'Low',
      earthquakeZone: 'Zone III',
      landslideRisk: 'Low',
      ecologicalSensitiveZone: false,
      waterStressRisk: 'Low',
      pollutionRisk: 'Low',
      regulatoryRestrictions: ['Urban local body layout approval and green cover reservation mandatory']
    },
    solarPotential: 78,
    currentPotentialIndex: 86,
    futurePotentialIndex: 96
  }
];

async function seed() {
  const connected = await connectDB();
  if (!connected) {
    console.log('⚠️ MongoDB not connected. Skipping remote seeding.');
    process.exit(0);
  }

  console.log('🌱 Starting MongoDB Atlas Idempotent Seed...');

  // 1. Seed Demo Users
  console.log('👤 Seeding SIH Demo Users...');
  const salt = await bcrypt.genSalt(10);
  for (const u of DEMO_USERS) {
    const passwordHash = await bcrypt.hash(u.passwordPlain, salt);
    await User.findOneAndUpdate(
      { email: u.email },
      {
        $set: {
          name: u.name,
          email: u.email,
          phone: u.phone,
          passwordHash,
          role: u.role,
          avatar: u.avatar,
          isVerified: true
        }
      },
      { upsert: true, new: true }
    );
    console.log(`  ✓ User: ${u.email} (${u.role})`);
  }

  // 2. Seed Demo Parcels
  console.log('🗺️ Seeding Land Parcels...');
  for (const p of DEMO_PARCELS) {
    await LandParcel.findOneAndUpdate(
      { surveyNumber: p.surveyNumber },
      { $set: p },
      { upsert: true, new: true }
    );
    console.log(`  ✓ Parcel: ${p.title}`);
  }

  console.log('🎉 MongoDB Atlas Seeding Complete with Users & Parcels!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
