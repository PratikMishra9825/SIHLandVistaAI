import mongoose from 'mongoose';

const LandParcelSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  surveyNumber: { type: String },
  district: { type: String, required: true },
  state: { type: String, required: true },
  area: { type: Number, required: true }, // in acres
  address: { type: String },
  ownership: {
    type: String,
    enum: ['Private', 'Government', 'Leased', 'Panchayat'],
    default: 'Private'
  },
  landType: { type: String, default: 'Agricultural / Semi-Arid' },
  currentUsage: { type: String, default: 'Unused / Fallow' },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  boundary: {
    type: {
      type: String,
      enum: ['Polygon'],
      default: 'Polygon'
    },
    coordinates: {
      type: [[[Number]]], // Array of arrays of [longitude, latitude]
      default: undefined
    }
  },
  soil: {
    pH: { type: Number, default: 7.0 },
    nitrogen: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    nitrogenValue: Number,
    phosphorus: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    phosphorusValue: Number,
    potassium: { type: String, enum: ['Low', 'Medium', 'High'], default: 'High' },
    potassiumValue: Number,
    organicCarbon: { type: Number, default: 0.5 },
    moisture: { type: Number, default: 20 },
    electricalConductivity: { type: Number, default: 0.4 },
    soilType: { type: String, default: 'Medium Black' },
    source: { type: String, enum: ['verified', 'estimated', 'demo'], default: 'demo' },
    healthScore: { type: Number, default: 70 }
  },
  water: {
    availability: { type: String, enum: ['Low', 'Medium', 'High', 'Very High'], default: 'Medium' },
    groundwaterDepth: { type: Number, default: 50 },
    rainfallAnnual: { type: Number, default: 600 },
    nearestWaterBodyKm: { type: Number, default: 3.0 },
    waterBodyType: { type: String, default: 'Canal' },
    irrigationAccess: { type: Boolean, default: true },
    seasonalWaterStress: { type: String, default: 'Moderate' },
    score: { type: Number, default: 65 }
  },
  infrastructure: {
    roadAccessQuality: { type: String, enum: ['Excellent', 'Good', 'Moderate', 'Poor'], default: 'Good' },
    roadDistanceMeters: { type: Number, default: 50 },
    gridDistanceKm: { type: Number, default: 1.5 },
    substationCapacityKVA: { type: Number, default: 33000 },
    railwayDistanceKm: { type: Number, default: 10 },
    nearestCityKm: { type: Number, default: 15 },
    populationDensity: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    zoning: { type: String, default: 'Agricultural' },
    elevationMeters: { type: Number, default: 450 },
    slopeDegrees: { type: Number, default: 2.0 },
    solarRadiationKWh: { type: Number, default: 5.8 }
  },
  risks: {
    floodRisk: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
    earthquakeZone: { type: String, default: 'Zone III' },
    landslideRisk: { type: String, default: 'Low' },
    ecologicalSensitiveZone: { type: Boolean, default: false },
    waterStressRisk: { type: String, default: 'Moderate' },
    pollutionRisk: { type: String, default: 'Low' },
    regulatoryRestrictions: [String]
  },
  climate: {
    avgAnnualTempCelsius: { type: Number, default: 28 },
    summerMaxTempCelsius: { type: Number, default: 42 },
    winterMinTempCelsius: { type: Number, default: 14 }
  },
  solarPotential: { type: Number, default: 92 },
  currentPotentialIndex: { type: Number, default: 78 },
  futurePotentialIndex: { type: Number, default: 91 },
  isDemo: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create 2dsphere index on location for GeoJSON spatial queries
LandParcelSchema.index({ location: '2dsphere' });
LandParcelSchema.index({ district: 1, state: 1 });

export default mongoose.models.LandParcel || mongoose.model('LandParcel', LandParcelSchema);
