export interface GovernmentSchemeDefinition {
  id: string;
  name: string;
  shortName: string;
  governmentLevel: 'Central' | 'State';
  applicableStates?: string[]; // empty means all India
  applicableDistricts?: string[];
  ministry: string;
  sector: 'Solar & Renewable' | 'Agriculture' | 'Horticulture & Irrigation' | 'Warehousing & Logistics' | 'Food Processing & MSME' | 'Housing & Infrastructure';
  applicableUseTypes: string[]; // ['solar', 'agriculture', 'warehouse', 'agro_processing', 'housing', 'industrial']
  eligibleApplicantTypes: ('farmer' | 'individual_landowner' | 'msme_company' | 'fpo_cooperative')[];
  minAreaAcres?: number;
  maxAreaAcres?: number;
  maxSubstationDistanceKm?: number;
  requiresWaterSource?: boolean;
  financialSupportText: string;
  loanCreditSupportText?: string;
  whyMatchedTemplate: string;
  whyNotReason?: string;
  eligibilityConditions: string[];
  requiredDocuments: string[];
  applicationSteps: string[];
  officialPortalUrl: string;
  lastVerifiedDate: string;
  canCombineWithOtherSchemes: boolean;
  combinationNotice?: string;
}

export const GOVERNMENT_SCHEMES_DB: GovernmentSchemeDefinition[] = [
  // 1. PM-KUSUM Component A (Central)
  {
    id: 'pm-kusum-a',
    name: 'PM-KUSUM Component A (Decentralized Solar Power Plants)',
    shortName: 'PM-KUSUM Component-A',
    governmentLevel: 'Central',
    ministry: 'Ministry of New and Renewable Energy (MNRE)',
    sector: 'Solar & Renewable',
    applicableUseTypes: ['solar'],
    eligibleApplicantTypes: ['farmer', 'individual_landowner', 'fpo_cooperative', 'msme_company'],
    minAreaAcres: 2.0,
    maxSubstationDistanceKm: 5.0,
    financialSupportText: 'Guaranteed 25-Year Power Purchase Agreement (PPA) Tariff (₹3.10 - ₹3.30/kWh) or Lease Rent of ₹30,000–₹50,000/acre/year',
    loanCreditSupportText: 'Bank financing up to 70% of project cost under Priority Sector Lending (PSL)',
    whyMatchedTemplate: 'Your land is in {state}, has high sunlight, and is {gridDistanceKm} km from a 33kV substation (well within the 5 km eligibility limit).',
    eligibilityConditions: [
      'Landowner must possess clear title deed or 25-year registered lease agreement',
      'Parcel located within 5 km radial distance of 33/11 kV DISCOM electrical substation',
      'Minimum continuous area of 2 acres for 500 kW to 2 MW capacity'
    ],
    requiredDocuments: [
      '7/12 Extract (Satbara) / Registered Title Deed',
      'DISCOM Substation Proximity & Feasibility Certificate',
      'Aadhaar & PAN Card of Landowner',
      'Bank Account Passbook / Cancelled Cheque',
      'Cadastral Survey Map with Boundary Coordinates'
    ],
    applicationSteps: [
      '1. Register online on State Renewable Energy Portal (e.g., MEDA / KREDL / GEDA).',
      '2. Obtain Grid Feasibility Report from local electricity DISCOM.',
      '3. Submit application for developer allocation or self-investment PPA.',
      '4. Execute 25-year tripartite PPA and commence plant commissioning.'
    ],
    officialPortalUrl: 'https://pmkusum.mnre.gov.in',
    lastVerifiedDate: 'January 2026',
    canCombineWithOtherSchemes: true,
    combinationNotice: 'Can be combined with state-specific feed-in solar incentives and agricultural tax exemptions.'
  },

  // 2. Maharashtra Mukhyamantri Saur Krushi Vahini Yojana 2.0 (MSKVY) (Maharashtra State)
  {
    id: 'mskvy-2-maharashtra',
    name: 'Mukhyamantri Saur Krushi Vahini Yojana 2.0 (MSKVY 2.0)',
    shortName: 'MSKVY 2.0 (Maharashtra)',
    governmentLevel: 'State',
    applicableStates: ['Maharashtra'],
    ministry: 'Energy Department, Government of Maharashtra (MSEDCL)',
    sector: 'Solar & Renewable',
    applicableUseTypes: ['solar'],
    eligibleApplicantTypes: ['farmer', 'individual_landowner', 'fpo_cooperative'],
    minAreaAcres: 3.0,
    maxSubstationDistanceKm: 5.0,
    financialSupportText: 'Guaranteed lease rental of ₹50,000/acre/year with 3% annual escalation for 30 years',
    loanCreditSupportText: 'Zero farmer investment if leased directly to MSEDCL project developers',
    whyMatchedTemplate: 'Your parcel is situated in Maharashtra, meets the 3+ acre requirement, and is close to a rural substation feeder.',
    eligibilityConditions: [
      'Land located in Maharashtra within 5 km of an agricultural solar substation feeder',
      'Fallow, uncultivated, or single-crop agricultural land',
      'No litigation or mortgage encumbrance on 7/12 extract'
    ],
    requiredDocuments: [
      'Maharashtra 7/12 & 8-A Record of Rights',
      'Mutation Entry (Ferfar) certificate',
      'NOC from all co-owners listed on land title',
      'Aadhaar & Bank Account Details'
    ],
    applicationSteps: [
      '1. Submit land parcel details on the MSEB Solar Land Bank Portal (land.mahadiscom.in).',
      '2. Joint inspection by MSEDCL engineers and Taluka Land Records Officer.',
      '3. Letter of Intent (LOI) issued to landowner.',
      '4. Registered 30-year lease execution and direct account deposit.'
    ],
    officialPortalUrl: 'https://www.mahadiscom.in/solar-mskvy/',
    lastVerifiedDate: 'February 2026',
    canCombineWithOtherSchemes: false,
    combinationNotice: 'Standalone state lease program. Replaces individual PPA bidding with fixed guaranteed rental.'
  },

  // 3. Agriculture Infrastructure Fund (AIF) (Central)
  {
    id: 'aif-central',
    name: 'Agriculture Infrastructure Fund (AIF)',
    shortName: 'Agri Infrastructure Fund (AIF)',
    governmentLevel: 'Central',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    sector: 'Warehousing & Logistics',
    applicableUseTypes: ['warehouse', 'agro_processing', 'agriculture'],
    eligibleApplicantTypes: ['farmer', 'individual_landowner', 'msme_company', 'fpo_cooperative'],
    minAreaAcres: 1.0,
    financialSupportText: '3% Interest Subvention per annum on bank loans up to ₹2.00 Crore for 7 years',
    loanCreditSupportText: 'Credit guarantee coverage under CGTMSE for loans up to ₹2 Crore without collateral',
    whyMatchedTemplate: 'Your land has direct 40m highway frontage, making it suitable for modern warehousing or post-harvest storage.',
    eligibilityConditions: [
      'Project creates post-harvest management infrastructure (warehouse, cold storage, grading center)',
      'Clear commercial or agro-industrial conversion title',
      'Bankable project report approved by participating scheduled bank'
    ],
    requiredDocuments: [
      'Detailed Project Report (DPR) by Chartered Engineer',
      'Land Ownership / Registered Lease (minimum 15 years)',
      'Bank Sanction Letter for term loan',
      'Local Gram Panchayat / Town Planning Building Permission'
    ],
    applicationSteps: [
      '1. Register on National PM AIF Portal (agriinfra.dac.gov.in).',
      '2. Submit DPR and select preferred lending bank.',
      '3. Ministry appraisal within 30 days and sanction tracking.',
      '4. Interest subvention automatically credited to loan account.'
    ],
    officialPortalUrl: 'https://agriinfra.dac.gov.in',
    lastVerifiedDate: 'January 2026',
    canCombineWithOtherSchemes: true,
    combinationNotice: 'Can be combined with PMFME or state capital subsidies for food processing equipment.'
  },

  // 4. PM Krishi Sinchayee Yojana (PMKSY) - Micro Irrigation (Central)
  {
    id: 'pmksy-per-drop',
    name: 'Pradhan Mantri Krishi Sinchayee Yojana (PMKSY) - Per Drop More Crop',
    shortName: 'PMKSY Micro-Irrigation',
    governmentLevel: 'Central',
    ministry: 'Department of Agriculture & Farmers Welfare',
    sector: 'Horticulture & Irrigation',
    applicableUseTypes: ['agriculture', 'agro_processing'],
    eligibleApplicantTypes: ['farmer', 'fpo_cooperative'],
    minAreaAcres: 0.5,
    financialSupportText: 'Up to 55% direct capital subsidy for Small/Marginal Farmers; 45% for other farmers on drip/sprinkler equipment',
    whyMatchedTemplate: 'Your land has limited water availability, making micro-drip fertigation essential for high-yield onion or horticulture.',
    eligibilityConditions: [
      'Landowning farmers cultivating field or horticultural crops',
      'Access to a groundwater borewell, farm pond, or canal water source'
    ],
    requiredDocuments: [
      '7/12 & 8-A Land Extract',
      'Water Source Electricity Bill / Borewell Affidavit',
      'Soil Health Card / Test Details',
      'Quotation from Empanelled Micro-Irrigation Manufacturer'
    ],
    applicationSteps: [
      '1. Apply via State Agriculture DBT Portal (e.g. MahaDBT in Maharashtra).',
      '2. Taluka Agriculture Officer field pre-sanction verification.',
      '3. Empanelled vendor installs certified drip equipment.',
      '4. Geo-tagged mobile photo verification and direct subsidy transfer (DBT).'
    ],
    officialPortalUrl: 'https://pmksy.gov.in',
    lastVerifiedDate: 'January 2026',
    canCombineWithOtherSchemes: true,
    combinationNotice: 'Fully combinable with Mission for Integrated Development of Horticulture (MIDH) crop subsidies.'
  },

  // 5. PM Formalisation of Micro food processing Enterprises (PMFME) (Central)
  {
    id: 'pmfme-central',
    name: 'PM Formalisation of Micro Food Processing Enterprises (PMFME)',
    shortName: 'PMFME Micro Food Processing',
    governmentLevel: 'Central',
    ministry: 'Ministry of Food Processing Industries (MoFPI)',
    sector: 'Food Processing & MSME',
    applicableUseTypes: ['agro_processing', 'warehouse'],
    eligibleApplicantTypes: ['farmer', 'msme_company', 'fpo_cooperative', 'individual_landowner'],
    financialSupportText: '35% Credit-linked capital subsidy up to maximum of ₹10.00 Lakh per unit',
    loanCreditSupportText: 'Bank term loan coverage with seed capital assistance of ₹40,000 for SHG members',
    whyMatchedTemplate: 'Matches proposed agro-processing of local Solapur agricultural produce (onion dehydration / pomegranate packing).',
    eligibilityConditions: [
      'Individual micro food processing enterprise or FPO / SHG cluster',
      'Project involves sorting, grading, processing, or packaging of agricultural produce',
      'Applicant contribution of minimum 10% of project cost'
    ],
    requiredDocuments: [
      'Udyam MSME Registration Certificate',
      'Land Title or Industrial Lease Agreement',
      'FSSAI Food License / Application Copy',
      'Bank Loan Appraisal Report'
    ],
    applicationSteps: [
      '1. Apply on the National PMFME Portal (pmfme.mofpi.gov.in).',
      '2. District Resource Person (DRP) assists in DPR preparation.',
      '3. District Level Committee (DLC) recommendation to bank.',
      '4. Loan sanction and subsidy escrow release.'
    ],
    officialPortalUrl: 'https://pmfme.mofpi.gov.in',
    lastVerifiedDate: 'February 2026',
    canCombineWithOtherSchemes: true,
    combinationNotice: 'Can be linked with AIF interest subvention for warehouse infrastructure.'
  },

  // 6. Maharashtra SMART Project (State of Maharashtra)
  {
    id: 'smart-project-maharashtra',
    name: 'State of Maharashtra Agribusiness and Rural Transformation (SMART)',
    shortName: 'SMART Project (Maharashtra)',
    governmentLevel: 'State',
    applicableStates: ['Maharashtra'],
    ministry: 'Department of Agriculture, Government of Maharashtra (World Bank Assisted)',
    sector: 'Agriculture',
    applicableUseTypes: ['agriculture', 'agro_processing', 'warehouse'],
    eligibleApplicantTypes: ['fpo_cooperative', 'farmer'],
    financialSupportText: 'Up to 60% grant-in-aid (up to ₹1.50 Crore) for FPO post-harvest & processing facilities',
    whyMatchedTemplate: 'Applicable for farmer groups and agribusiness enterprises operating in Maharashtra districts including Solapur.',
    eligibilityConditions: [
      'Registered Farmer Producer Company (FPC) or Cooperative in Maharashtra',
      'Demonstrated market linkage with buyers or retail aggregators'
    ],
    requiredDocuments: [
      'FPC Registration Certificate & Memorandum of Association',
      'Land Possession Documents (Minimum 10-year registered lease)',
      'Audited Financial Statements for past 1–2 years'
    ],
    applicationSteps: [
      '1. Submit proposal on SMART Project portal (smart-mh.org).',
      '2. Evaluation by Project Implementation Unit (PIU).',
      '3. Tripartite agreement and phased grant release.'
    ],
    officialPortalUrl: 'https://www.smart-mh.org',
    lastVerifiedDate: 'January 2026',
    canCombineWithOtherSchemes: true
  },

  // 7. National Mission for Sustainable Agriculture & Soil Health (Central)
  {
    id: 'pkvy-soil-health',
    name: 'Paramparagat Krishi Vikas Yojana (PKVY) & Soil Health Mission',
    shortName: 'PKVY Organic & Soil Mission',
    governmentLevel: 'Central',
    ministry: 'Ministry of Agriculture and Farmers Welfare',
    sector: 'Agriculture',
    applicableUseTypes: ['agriculture'],
    eligibleApplicantTypes: ['farmer', 'fpo_cooperative'],
    financialSupportText: '₹50,000 per Hectare for 3 years (₹31,000 directly to farmer for organic inputs) + Free Soil Testing',
    whyMatchedTemplate: 'Helps improve soil organic carbon (currently 0.42%) and certifies residue-free onion exports.',
    eligibilityConditions: [
      'Farmer cultivating continuous agricultural acreage',
      'Willingness to adopt certified organic farming practices in clusters'
    ],
    requiredDocuments: [
      'Farmer Aadhaar & Bank Passbook',
      '7/12 Land Record',
      'Baseline Soil Health Card'
    ],
    applicationSteps: [
      '1. Join a local 20-hectare organic farming cluster via Taluka Agriculture Officer.',
      '2. Receive free soil testing and digital Soil Health Card.',
      '3. Annual financial assistance transferred via DBT directly to bank account.'
    ],
    officialPortalUrl: 'https://pgsindia-ncof.gov.in',
    lastVerifiedDate: 'January 2026',
    canCombineWithOtherSchemes: true
  },

  // 8. Mission for Integrated Development of Horticulture (MIDH) (Central)
  {
    id: 'midh-horticulture',
    name: 'Mission for Integrated Development of Horticulture (MIDH)',
    shortName: 'MIDH Horticulture Scheme',
    governmentLevel: 'Central',
    ministry: 'Ministry of Agriculture and Farmers Welfare',
    sector: 'Horticulture & Irrigation',
    applicableUseTypes: ['agriculture', 'agro_processing'],
    eligibleApplicantTypes: ['farmer', 'fpo_cooperative', 'individual_landowner'],
    financialSupportText: '40% - 50% capital subsidy for high-density pomegranate orchards, onion storage structures, and shade nets',
    whyMatchedTemplate: 'Directly subsidizes permanent onion storage structures (Kanda Chawl) and drip-irrigated orchards in dry regions.',
    eligibilityConditions: [
      'Cultivation of recognized horticultural crops (fruits, vegetables, spices)',
      'Construction of standardized ventilated onion storage units'
    ],
    requiredDocuments: [
      '7/12 Land Record & 8-A Extract',
      'Horticulture Officer recommendation report',
      'Estimate and blueprint of storage unit or planting material bills'
    ],
    applicationSteps: [
      '1. Apply via State Horticulture Portal (MahaDBT).',
      '2. Pre-inspection and administrative approval issued.',
      '3. Complete construction / plantation and upload geo-tagged photo.',
      '4. Subsidy released directly to bank account.'
    ],
    officialPortalUrl: 'https://midh.gov.in',
    lastVerifiedDate: 'January 2026',
    canCombineWithOtherSchemes: true
  }
];
