import React, { useState } from 'react';
import { 
  HelpCircle, 
  MapPin, 
  Layers, 
  Sun, 
  Warehouse, 
  Landmark, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Sprout, 
  FlaskConical, 
  TrendingUp, 
  Users, 
  Globe2, 
  ShieldCheck, 
  Building2, 
  UserCheck, 
  Building, 
  ShieldAlert, 
  Scale, 
  Camera, 
  Compass, 
  FileText 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DataConfidenceBadge } from '../components/DataConfidenceBadge';
import { Link } from 'react-router-dom';

export const UserGuide: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role || 'landowner';

  const [activeStep, setActiveStep] = useState(0);

  // 1. LANDOWNER / FARMER GUIDE CONTENT
  const landownerSteps = [
    {
      title: '1. Register Parcel & Upload Ground Photo',
      icon: Camera,
      desc: 'Enter your village or GPS location, confirm your parcel boundary, and upload actual ground photographs of your land.',
      details: 'LandVista combines your ground photo with high-resolution satellite imagery to assess current ground conditions.'
    },
    {
      title: '2. Review AI Land Consultant Verdict',
      icon: Sparkles,
      desc: 'Understand what you should do with your land in plain language without confusing AI scores or GIS jargon.',
      details: 'Displays the Top curated options (e.g. Solar, Precision Onion, Warehouse) with key suitability and economic breakdowns.'
    },
    {
      title: '3. Check Government Schemes & Subsidies',
      icon: Landmark,
      desc: 'Automatically checks all relevant Central and State schemes (PM-KUSUM, AIF, MSKVY 2.0, PMKSY).',
      details: 'Shows clear eligibility statuses (🟢 Likely Eligible), required documents checklist, and direct official ministry portal links.'
    },
    {
      title: '4. Book On-Field Soil Checkup',
      icon: FlaskConical,
      desc: 'Don’t have a soil report? Book an appointment with a certified LandVista agronomist.',
      details: 'An expert visits your land, tests soil pH, N-P-K, EC, and organic carbon, and issues a certified report that updates your recommendations.'
    },
    {
      title: '5. Explore Conceptual Land Visualization',
      icon: Layers,
      desc: 'Visualize what your land could become with realistic solar panel or agricultural layouts bounded strictly inside your parcel polygon.',
      details: 'Inspect your parcel boundary, infrastructure proximity, and development scenarios.'
    },
    {
      title: '6. Execute Master Action Plan',
      icon: CheckCircle2,
      desc: 'Follow the step-by-step roadmap from 7/12 title verification and DISCOM permissions to DPR project execution.',
      details: 'Export your complete land intelligence dossier or connect with specialized development partners.'
    }
  ];

  // 2. GOVERNMENT AUTHORITY GUIDE CONTENT
  const governmentSteps = [
    {
      title: '1. Access Regional Land Bank & Inventory',
      icon: Building2,
      desc: 'View all registered and government-owned parcels within your administrative jurisdiction.',
      details: 'Displays cadastre numbers, total acreage, current occupancy status, and baseline zoning classifications.'
    },
    {
      title: '2. Public Infrastructure Prioritization',
      icon: Landmark,
      desc: 'Identify parcels suitable for Affordable Housing (PMAY), Hospitals, Primary Schools, Public Parks, and Solar Micro-Grids.',
      details: 'Uses multi-factor geospatial analysis (distance to highways, power feeders, and population density) to score social welfare impact.'
    },
    {
      title: '3. Execute Multi-Parcel Batch Analysis',
      icon: Sparkles,
      desc: 'Select multiple land parcels across a district and click [Analyze Selected Lands] to generate an aggregated public welfare dossier.',
      details: 'Exports prioritized allocation tables and public utility feasibility summaries for administrative approval.'
    },
    {
      title: '4. Respect Landowner Privacy Protocols',
      icon: ShieldCheck,
      desc: 'Private landowner deeds and sensitive financial records remain isolated. Accessing authorized records produces an immutable audit log.',
      details: 'Ensures strict compliance with state data governance and citizen privacy mandates.'
    }
  ];

  // 3. SOIL & LAND EXPERT GUIDE CONTENT
  const expertSteps = [
    {
      title: '1. Review Assigned Field Visits Queue',
      icon: UserCheck,
      desc: 'View your scheduled customer checkups with appointment times, parcel locations, and landowner contact details.',
      details: 'Checkups are prioritized by urgency and geographical proximity to optimize your daily field route.'
    },
    {
      title: '2. GPS Navigate to Parcel Boundary',
      icon: Compass,
      desc: 'Launch 1-click GPS navigation to guide you directly to the landowner’s exact cadastral coordinates.',
      details: 'Review the landowner’s uploaded ground photos to verify site access points and terrain characteristics.'
    },
    {
      title: '3. Input Laboratory Soil Chemistry',
      icon: FlaskConical,
      desc: 'Enter verified ICAR-standard parameters: pH, Nitrogen (kg/ha), Phosphorus, Potassium, Organic Carbon %, and Electrical Conductivity.',
      details: 'Attach geo-tagged field sample photos and input your expert agronomist clinical recommendations.'
    },
    {
      title: '4. Submit & Issue Certified Report',
      icon: CheckCircle2,
      desc: 'Submitting the report automatically issues an official Soil Health Card to the landowner and recalculates their AI suitability recommendations.',
      details: 'Download the official ICAR-format PDF certificate for physical documentation.'
    }
  ];

  // 4. DEVELOPER & INVESTOR GUIDE CONTENT
  const developerSteps = [
    {
      title: '1. Browse Public & Consented Land Opportunities',
      icon: Building,
      desc: 'Explore commercially viable land parcels that are publicly listed, government-allocated, or consented by landowners for development.',
      details: 'Protected landowner privacy ensures only commercial specifications, zoning, and infrastructure proximities are displayed.'
    },
    {
      title: '2. Filter by Sector, Budget & Acreage',
      icon: Layers,
      desc: 'Filter opportunities by Solar Energy, Logistics Warehouses, Cold Chain, Commercial, or Mixed-Use development.',
      details: 'Set minimum continuous acreage and maximum capital budget parameters to find matching pipeline assets.'
    },
    {
      title: '3. Investment & Capex Feasibility Modeling',
      icon: TrendingUp,
      desc: 'Review indicative estimated Capex (₹ Cr), annual revenue yield, and estimated payback periods.',
      details: 'All financial metrics are clearly labeled as indicative AI feasibility projections based on tariff schedules and CartoDEM slope analysis.'
    },
    {
      title: '4. Side-by-Side Land Comparison Matrix',
      icon: Scale,
      desc: 'Select 2 or more parcels to compare pricing, road frontage, 33kV grid distance, and payback schedules in a unified table.',
      details: 'Submit formal Expressions of Interest (EOI) to initiate landowner contact via the platform.'
    }
  ];

  // 5. LANDVISTA ADMIN GUIDE CONTENT
  const adminSteps = [
    {
      title: '1. Platform Overview & System Health',
      icon: ShieldAlert,
      desc: 'Monitor total registered users, parcel acreage across states, active agronomists, and system API/database statuses.',
      details: 'Real-time telemetry on ESRI map servers, AI inference engines, and database synchronization.'
    },
    {
      title: '2. Land Ownership Verification Queue',
      icon: FileText,
      desc: 'Process uploaded 7/12 Satbara extracts, Property Cards, and Registered Sale Deeds with Approve / Reject controls.',
      details: 'Prevents fraud by ensuring only verified titleholders receive ownership-sensitive development permissions.'
    },
    {
      title: '3. Government Scheme Database Governance',
      icon: Landmark,
      desc: 'Maintain Central and State scheme definitions, update subsidy ranges, and refresh verification timestamps.',
      details: 'Ensures the intelligent scheme matcher uses accurate, verified policy mandates.'
    },
    {
      title: '4. Immutable Security Audit Trail',
      icon: ShieldCheck,
      desc: 'Inspect real-time logs tracking every sensitive resource access, document verification, and report submission across the platform.',
      details: 'Ensures complete enterprise-grade transparency and traceability.'
    }
  ];

  // Select steps based on authenticated role
  const getRoleSteps = () => {
    switch (role) {
      case 'government': return { steps: governmentSteps, roleName: 'Government Authority', badge: '🏛️ Regional Land Intelligence & Planning Guide' };
      case 'soilExpert': return { steps: expertSteps, roleName: 'Soil & Land Expert', badge: '👨‍🔬 Agronomist Field Sampling & Testing Guide' };
      case 'developer': return { steps: developerSteps, roleName: 'Developer & Investor', badge: '🏗️ Commercial Land Investment & Feasibility Guide' };
      case 'admin': return { steps: adminSteps, roleName: 'Platform Administrator', badge: '🛡️ Root Platform Governance & Verification Guide' };
      case 'landowner':
      case 'farmer':
      default: return { steps: landownerSteps, roleName: 'Landowner / Farmer', badge: '👤 Landowner Land Advisory & Decision Guide' };
    }
  };

  const { steps, roleName, badge } = getRoleSteps();
  const currentStep = steps[activeStep] || steps[0];
  const StepIcon = currentStep.icon;

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6 font-sans pb-16">
      
      {/* 1. HERO HEADER */}
      <div className="bg-[#FFFFFF] p-8 rounded-3xl border border-[#D5E1D9] shadow-sm space-y-3 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F5EC] border border-[#BDE3CC] text-[#166534] text-xs font-bold font-mono">
          <HelpCircle className="w-4 h-4 text-[#15803D]" />
          <span>{badge}</span>
        </div>

        <h1 className="font-bold text-3xl sm:text-4xl text-[#17211B] tracking-tight">
          How to Use LandVista AI — {roleName} Guide
        </h1>

        <p className="text-sm text-[#405048] font-medium max-w-2xl mx-auto leading-relaxed">
          Tailored standard operating procedures, workflows, and tools authorized for your <strong>{role.toUpperCase()}</strong> workspace.
        </p>
      </div>

      {/* 2. STEP SELECTOR MATRIX */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
        {steps.map((s, idx) => {
          const isSelected = activeStep === idx;
          const Icon = s.icon;
          return (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`p-3.5 rounded-2xl border transition-all text-left flex flex-col gap-1.5 ${
                isSelected
                  ? 'bg-[#E8F5EC] border-[#15803D] text-[#166534] shadow-sm font-bold'
                  : 'bg-[#FFFFFF] text-[#405048] hover:text-[#17211B] border-[#D5E1D9]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#15803D]">STEP {idx + 1}</span>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-xs line-clamp-1">{s.title.split('. ')[1] || s.title}</span>
            </button>
          );
        })}
      </div>

      {/* 3. ACTIVE STEP DOSSIER */}
      <div className="bg-[#FFFFFF] p-8 rounded-3xl border border-[#D5E1D9] space-y-6 shadow-sm">
        <div className="flex items-center gap-4 border-b border-[#D5E1D9] pb-4">
          <div className="w-14 h-14 rounded-2xl bg-[#E8F5EC] border border-[#BDE3CC] flex items-center justify-center text-[#15803D] shrink-0">
            <StepIcon className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#166534] uppercase font-mono block">STEP {activeStep + 1} OF {steps.length}</span>
            <h2 className="font-bold text-2xl text-[#17211B] tracking-tight">
              {currentStep.title}
            </h2>
          </div>
        </div>

        <div className="space-y-3 font-sans text-sm">
          <p className="text-[#17211B] font-bold leading-relaxed text-base">
            {currentStep.desc}
          </p>

          <div className="p-4 rounded-2xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#405048] leading-relaxed text-xs font-medium">
            💡 <strong>Operating Procedure:</strong> {currentStep.details}
          </div>
        </div>

        {/* Navigation CTAs */}
        <div className="flex items-center justify-between pt-4 border-t border-[#D5E1D9] text-xs font-bold">
          <button
            disabled={activeStep === 0}
            onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
            className="px-4 py-2 rounded-xl bg-[#F8FBF9] text-[#17211B] hover:bg-[#E8F5EC] disabled:opacity-40 border border-[#D5E1D9] transition-all"
          >
            ← Previous Step
          </button>

          <span className="text-[#64736A] text-xs">
            {activeStep + 1} / {steps.length}
          </span>

          {activeStep < steps.length - 1 ? (
            <button
              onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
              className="px-5 py-2 rounded-xl bg-[#15803D] text-white font-bold hover:bg-[#166534] transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Link
              to={role === 'government' ? '/government' : role === 'soilExpert' ? '/expert' : role === 'developer' ? '/developer' : role === 'admin' ? '/admin' : '/dashboard'}
              className="px-5 py-2.5 rounded-xl bg-[#15803D] text-white font-bold hover:bg-[#166534] transition-all flex items-center gap-1.5 uppercase shadow-sm"
            >
              <span>Open My Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
