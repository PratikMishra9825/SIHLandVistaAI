import React, { useState } from 'react';
import { 
  Landmark, 
  CheckCircle2, 
  ExternalLink, 
  FileText, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  HelpCircle,
  AlertTriangle,
  UserCheck,
  Building,
  Users,
  ChevronDown,
  ChevronUp,
  Layers,
  Info,
  Calendar
} from 'lucide-react';
import { useLand } from '../context/LandContext';
import { evaluateGovernmentSchemes, MatchedSchemeResult } from '../utils/schemeMatcher';
import { DataConfidenceBadge } from './DataConfidenceBadge';
import type { LandUseType } from '../types/land';

export const GovernmentSchemeMatcher: React.FC = () => {
  const { selectedParcel, activeScenario, setActiveScenario } = useLand();
  
  const [applicantType, setApplicantType] = useState<'farmer' | 'individual_landowner' | 'msme_company' | 'fpo_cooperative'>('farmer');
  const [activeTab, setActiveTab] = useState<'all' | 'central' | 'state' | 'why_not'>('all');
  const [selectedSchemeId, setSelectedSchemeId] = useState<string | null>(null);

  // Evaluate schemes dynamically using the matching engine
  const report = evaluateGovernmentSchemes(selectedParcel, activeScenario, applicantType);

  const displayedMatches = 
    activeTab === 'central'
      ? report.centralMatches
      : activeTab === 'state'
      ? report.stateMatches
      : report.topMatches;

  const currentSelectedScheme = 
    displayedMatches.find((m) => m.scheme.id === selectedSchemeId) || displayedMatches[0] || report.unmatchedSchemes[0];

  return (
    <div className="space-y-6 font-sans pb-12">
      
      {/* 1. TOP HEADER & APPLICANT PROFILE SELECTOR */}
      <div className="bg-[#FFFFFF] p-6 sm:p-7 rounded-3xl border border-[#D6E2DA] shadow-sm space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#D6E2DA] pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF7EF] border border-[#BDE3CC] flex items-center justify-center text-[#15803D] shrink-0">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold font-mono text-[#166534] uppercase tracking-wider">
                  INTELLIGENT GOVERNMENT SCHEME MATCHER
                </span>
                <DataConfidenceBadge type="VERIFIED" label="OFFICIAL MINISTRY RULES" />
              </div>
              <h2 className="font-bold text-2xl text-[#17211B] tracking-tight">
                Government Subsidies & Incentives for Your Land
              </h2>
              <p className="text-sm text-[#4B5D52] font-medium">
                Evaluated across Central & {selectedParcel.state || 'Maharashtra'} state schemes for {selectedParcel.name}
              </p>
            </div>
          </div>

          {/* Applicant Profile Selector */}
          <div className="flex items-center bg-[#F8FBF9] p-1.5 rounded-2xl border border-[#D6E2DA] text-xs">
            <span className="text-xs font-bold text-[#4B5D52] px-2.5 uppercase">Applicant:</span>
            {[
              { key: 'farmer', label: '👨‍🌾 Farmer' },
              { key: 'individual_landowner', label: '🏡 Landowner' },
              { key: 'msme_company', label: '🏢 Enterprise' },
              { key: 'fpo_cooperative', label: '👥 FPO' },
            ].map((app) => (
              <button
                key={app.key}
                onClick={() => setApplicantType(app.key as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  applicantType === app.key
                    ? 'bg-[#15803D] text-white shadow-sm'
                    : 'text-[#17211B] hover:text-[#166534] hover:bg-[#EAF7EF]'
                }`}
              >
                {app.label}
              </button>
            ))}
          </div>
        </div>

        {/* AI Matcher Summary Strip */}
        <div className="p-4 bg-[#EAF7EF] border border-[#BDE3CC] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-[#166534]">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#15803D] shrink-0" />
            <span className="font-medium text-[#17211B]">
              <strong className="text-[#166534] font-bold">{report.matchedCount} Schemes Matched</strong> for your {selectedParcel.areaAcres}-acre parcel in {report.targetDistrict}, {report.targetState} under <strong>{activeScenario.toUpperCase()}</strong> development.
            </span>
          </div>
          <span className="text-xs font-bold text-[#4B5D52] shrink-0">
            Evaluated {report.totalEvaluated} Total Ministry Programs
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-t border-[#D6E2DA] pt-3 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl font-bold uppercase transition-all whitespace-nowrap ${
              activeTab === 'all' ? 'bg-[#15803D] text-white shadow-sm' : 'bg-[#F8FBF9] text-[#17211B] hover:bg-[#EAF7EF] border border-[#D6E2DA]'
            }`}
          >
            All Matched ({report.matchedCount})
          </button>

          <button
            onClick={() => setActiveTab('central')}
            className={`px-4 py-2 rounded-xl font-bold uppercase transition-all whitespace-nowrap ${
              activeTab === 'central' ? 'bg-[#15803D] text-white shadow-sm' : 'bg-[#F8FBF9] text-[#17211B] hover:bg-[#EAF7EF] border border-[#D6E2DA]'
            }`}
          >
            🇮🇳 Central Schemes ({report.centralMatches.length})
          </button>

          <button
            onClick={() => setActiveTab('state')}
            className={`px-4 py-2 rounded-xl font-bold uppercase transition-all whitespace-nowrap ${
              activeTab === 'state' ? 'bg-[#15803D] text-white shadow-sm' : 'bg-[#F8FBF9] text-[#17211B] hover:bg-[#EAF7EF] border border-[#D6E2DA]'
            }`}
          >
            🏛️ {selectedParcel.state || 'Maharashtra'} Schemes ({report.stateMatches.length})
          </button>

          <button
            onClick={() => setActiveTab('why_not')}
            className={`px-4 py-2 rounded-xl font-bold uppercase transition-all whitespace-nowrap ${
              activeTab === 'why_not' ? 'bg-[#DC2626] text-white shadow-sm' : 'bg-[#F8FBF9] text-[#17211B] hover:bg-[#FEE2E2] border border-[#D6E2DA]'
            }`}
          >
            ❓ Why Not ({report.unmatchedSchemes.length})
          </button>
        </div>
      </div>

      {/* 2. MATCHED SCHEMES SPLIT VIEW */}
      {activeTab === 'why_not' ? (
        <div className="bg-[#FFFFFF] p-6 sm:p-7 rounded-3xl border border-[#D6E2DA] shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-[#D6E2DA] pb-3">
            <HelpCircle className="w-5 h-5 text-[#D97706]" />
            <h3 className="font-bold text-base text-[#17211B] uppercase tracking-wide">
              Transparent Exclusion Analysis: Why These Schemes Did Not Match
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {report.unmatchedSchemes.map((unmatched) => (
              <div key={unmatched.scheme.id} className="p-4 rounded-2xl bg-[#F8FBF9] border border-[#D6E2DA] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#17211B] text-sm">{unmatched.scheme.name}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FEE2E2] text-[#991B1B] border border-[#FECDD3]">
                    Not Applicable
                  </span>
                </div>
                <p className="text-xs text-[#92400E] font-medium leading-relaxed">
                  {unmatched.whyNotReason || 'Proposed land use or applicant category does not match scheme mandates.'}
                </p>
                <span className="text-xs text-[#4B5D52] block font-semibold">
                  {unmatched.scheme.ministry} • {unmatched.scheme.sector}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: MATCHED SCHEMES CARDS (5 COLS) */}
          <div className="lg:col-span-5 space-y-3.5">
            {displayedMatches.map((match) => {
              const isSelected = currentSelectedScheme?.scheme.id === match.scheme.id;
              return (
                <button
                  key={match.scheme.id}
                  onClick={() => setSelectedSchemeId(match.scheme.id)}
                  className={`w-full text-left p-5 rounded-3xl border transition-all flex flex-col gap-2.5 ${
                    isSelected
                      ? 'bg-[#EAF7EF] border-[#15803D] shadow-sm'
                      : 'bg-[#FFFFFF] hover:bg-[#F8FBF9] border-[#D6E2DA] shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#17211B] text-base">
                      {match.matchRank === 1 ? '🥇 ' : match.matchRank === 2 ? '🥈 ' : match.matchRank === 3 ? '🥉 ' : '• '}
                      {match.scheme.shortName}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      match.eligibilityStatus === 'Likely Eligible'
                        ? 'bg-[#EAF7EF] text-[#166534] border-[#BDE3CC]'
                        : 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]'
                    }`}>
                      {match.statusBadge}
                    </span>
                  </div>

                  <p className="text-xs text-[#4B5D52] leading-relaxed font-medium line-clamp-2">
                    {match.whyMatchedText}
                  </p>

                  <div className="p-3 rounded-2xl bg-[#FFFFFF] border border-[#D6E2DA] text-xs font-bold text-[#166534]">
                    💰 {match.financialSupportText}
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#4B5D52] border-t border-[#D6E2DA] pt-2 font-semibold">
                    <span>{match.isStateScheme ? `🏛️ ${selectedParcel.state || 'Maharashtra'}` : '🇮🇳 Central Ministry'}</span>
                    <span className="text-[#15803D] font-bold flex items-center gap-1">
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* RIGHT: SELECTED SCHEME FULL DOSSIER (7 COLS) */}
          {currentSelectedScheme && (
            <div className="lg:col-span-7">
              <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl space-y-6 border border-[#D6E2DA] shadow-sm">
                
                {/* Dossier Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D6E2DA] pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#EAF7EF] text-[#166534] text-xs font-bold border border-[#BDE3CC]">
                        {currentSelectedScheme.scheme.governmentLevel.toUpperCase()} PROGRAM
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        currentSelectedScheme.eligibilityStatus === 'Likely Eligible'
                          ? 'bg-[#EAF7EF] text-[#166534] border-[#BDE3CC]'
                          : 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]'
                      }`}>
                        {currentSelectedScheme.statusBadge}
                      </span>
                    </div>

                    <h3 className="font-bold text-2xl text-[#17211B] tracking-tight">
                      {currentSelectedScheme.scheme.name}
                    </h3>
                    <p className="text-xs text-[#4B5D52] font-semibold">{currentSelectedScheme.scheme.ministry}</p>
                  </div>
                </div>

                {/* Financial Support Highlight */}
                <div className="p-4 bg-[#EAF7EF] border border-[#BDE3CC] rounded-2xl space-y-1.5">
                  <span className="text-xs font-bold text-[#166534] block uppercase">OFFICIALLY STATED FINANCIAL BENEFIT</span>
                  <p className="font-bold text-[#17211B] text-base leading-relaxed">
                    {currentSelectedScheme.financialSupportText}
                  </p>
                  {currentSelectedScheme.loanCreditSupportText && (
                    <p className="text-xs text-[#4B5D52] pt-1 font-semibold">
                      💳 <strong>Credit Support:</strong> {currentSelectedScheme.loanCreditSupportText}
                    </p>
                  )}
                </div>

                {/* Why This Scheme? Explanation */}
                <div className="p-4 rounded-2xl bg-[#F8FBF9] border border-[#D6E2DA] space-y-1.5">
                  <span className="font-bold text-[#166534] text-xs uppercase flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
                    WHY WAS THIS SCHEME MATCHED?
                  </span>
                  <p className="text-sm text-[#17211B] leading-relaxed font-medium">
                    {currentSelectedScheme.whyMatchedText}
                  </p>
                </div>

                {/* Verified Eligibility Conditions */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#4B5D52] block uppercase">ELIGIBILITY CONDITIONS CHECKLIST</span>
                  <div className="space-y-1.5 text-sm font-sans">
                    {currentSelectedScheme.scheme.eligibilityConditions.map((cond, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F8FBF9] text-[#17211B] border border-[#D6E2DA]">
                        <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                        <span className="font-medium">{cond}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Required Documents Checklist */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#4B5D52] block uppercase">DOCUMENTS YOU WILL NEED</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium">
                    {currentSelectedScheme.requiredDocuments.map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F8FBF9] text-[#17211B] border border-[#D6E2DA] truncate">
                        <FileText className="w-4 h-4 text-[#15803D] shrink-0" />
                        <span className="truncate">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Apply CTA & Verification Date */}
                <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#D6E2DA] text-xs">
                  <div className="flex items-center gap-1.5 text-[#4B5D52] font-medium">
                    <Calendar className="w-4 h-4 text-[#15803D]" />
                    <span>Last Verified: {currentSelectedScheme.scheme.lastVerifiedDate}</span>
                  </div>

                  <a
                    href={currentSelectedScheme.officialPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <span>Check Official Eligibility</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
