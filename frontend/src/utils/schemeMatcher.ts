import { GOVERNMENT_SCHEMES_DB, GovernmentSchemeDefinition } from '../data/schemesList';
import type { LandParcel, LandUseType } from '../types/land';

export type EligibilityStatus = 'Likely Eligible' | 'Potentially Eligible' | 'Not Eligible' | 'Needs Verification';

export interface MatchedSchemeResult {
  scheme: GovernmentSchemeDefinition;
  eligibilityStatus: EligibilityStatus;
  statusColor: string;
  statusBadge: string;
  matchRank: number;
  whyMatchedText: string;
  whyNotReason?: string;
  verifiedConditions: string[];
  unverifiedConditions: string[];
  requiredDocuments: string[];
  applicationSteps: string[];
  financialSupportText: string;
  loanCreditSupportText?: string;
  officialPortalUrl: string;
  canCombineWithOtherSchemes: boolean;
  combinationNotice?: string;
  isStateScheme: boolean;
}

export interface SchemeMatchReport {
  totalEvaluated: number;
  matchedCount: number;
  topMatches: MatchedSchemeResult[];
  centralMatches: MatchedSchemeResult[];
  stateMatches: MatchedSchemeResult[];
  unmatchedSchemes: MatchedSchemeResult[];
  applicantTypeUsed: string;
  targetState: string;
  targetDistrict: string;
  proposedLandUse: string;
}

export function evaluateGovernmentSchemes(
  parcel: LandParcel,
  proposedUse: LandUseType = 'solar',
  applicantType: 'farmer' | 'individual_landowner' | 'msme_company' | 'fpo_cooperative' = 'farmer'
): SchemeMatchReport {
  const state = parcel.state || 'Maharashtra';
  const district = parcel.district || 'Solapur';
  const areaAcres = parcel.areaAcres || 10.2;
  const gridDistanceKm = parcel.infrastructure?.gridDistanceKm || 1.2;

  const matchedResults: MatchedSchemeResult[] = [];
  const unmatchedResults: MatchedSchemeResult[] = [];

  GOVERNMENT_SCHEMES_DB.forEach((scheme) => {
    let score = 0;
    const verified: string[] = [];
    const unverified: string[] = [];
    let whyNotReason = '';

    // 1. Check State Applicability
    const isStateScheme = scheme.governmentLevel === 'State';
    const stateMatches = !scheme.applicableStates || scheme.applicableStates.length === 0 || scheme.applicableStates.includes(state);
    if (!stateMatches) {
      whyNotReason = `Scheme is exclusively available for projects in ${scheme.applicableStates?.join(', ')}, while your land is located in ${state}.`;
    } else {
      score += 30;
      verified.push(`Location in ${state} is eligible`);
    }

    // 2. Check Proposed Land Use Type
    const useMatches = scheme.applicableUseTypes.includes(proposedUse);
    if (useMatches) {
      score += 35;
      verified.push(`Proposed use (${proposedUse.replace('_', ' ')}) matches eligible sector: ${scheme.sector}`);
    } else {
      if (!whyNotReason) {
        whyNotReason = `Scheme is intended for ${scheme.sector} projects, whereas your current proposed use is ${proposedUse}.`;
      }
    }

    // 3. Check Applicant Type
    const applicantMatches = scheme.eligibleApplicantTypes.includes(applicantType);
    if (applicantMatches) {
      score += 15;
      verified.push(`Applicant profile (${applicantType.replace('_', ' ')}) is eligible`);
    } else {
      unverified.push(`Applicant type (${applicantType}) requires entity registration verification`);
    }

    // 4. Check Area Thresholds
    if (scheme.minAreaAcres) {
      if (areaAcres >= scheme.minAreaAcres) {
        score += 10;
        verified.push(`Land area (${areaAcres} acres) satisfies minimum requirement (>= ${scheme.minAreaAcres} acres)`);
      } else {
        if (!whyNotReason) {
          whyNotReason = `Land area (${areaAcres} acres) is less than the required minimum (${scheme.minAreaAcres} acres).`;
        }
      }
    }

    // 5. Check Grid Distance (for Solar)
    if (scheme.maxSubstationDistanceKm) {
      if (gridDistanceKm <= scheme.maxSubstationDistanceKm) {
        score += 10;
        verified.push(`Substation distance (${gridDistanceKm} km) is within limit (<= ${scheme.maxSubstationDistanceKm} km)`);
      } else {
        if (!whyNotReason) {
          whyNotReason = `Substation distance (${gridDistanceKm} km) exceeds the maximum allowed feeder radius (${scheme.maxSubstationDistanceKm} km).`;
        }
      }
    }

    // Determine Eligibility Status
    let eligibilityStatus: EligibilityStatus = 'Not Eligible';
    let statusColor = 'text-red-400 bg-red-500/20 border-red-500/30';
    let statusBadge = '🔴 Not Eligible';

    if (stateMatches && useMatches) {
      if (score >= 80) {
        eligibilityStatus = 'Likely Eligible';
        statusColor = 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
        statusBadge = '🟢 Likely Eligible';
      } else {
        eligibilityStatus = 'Potentially Eligible';
        statusColor = 'text-amber-400 bg-amber-500/20 border-amber-500/30';
        statusBadge = '🟡 Potentially Eligible';
      }
    } else if (stateMatches && !useMatches) {
      eligibilityStatus = 'Needs Verification';
      statusColor = 'text-slate-400 bg-slate-500/20 border-slate-500/30';
      statusBadge = '⚪ Needs Use Alignment';
    }

    // Generate Human Why Matched Text
    let whyMatchedText = scheme.whyMatchedTemplate
      .replace('{state}', state)
      .replace('{district}', district)
      .replace('{gridDistanceKm}', gridDistanceKm.toString())
      .replace('{areaAcres}', areaAcres.toString());

    if (!whyMatchedText) {
      whyMatchedText = `Matches because your land is in ${state} and proposed development supports ${scheme.sector}.`;
    }

    const resultItem: MatchedSchemeResult = {
      scheme,
      eligibilityStatus,
      statusColor,
      statusBadge,
      matchRank: 0,
      whyMatchedText,
      whyNotReason,
      verifiedConditions: verified,
      unverifiedConditions: unverified,
      requiredDocuments: scheme.requiredDocuments,
      applicationSteps: scheme.applicationSteps,
      financialSupportText: scheme.financialSupportText,
      loanCreditSupportText: scheme.loanCreditSupportText,
      officialPortalUrl: scheme.officialPortalUrl,
      canCombineWithOtherSchemes: scheme.canCombineWithOtherSchemes,
      combinationNotice: scheme.combinationNotice,
      isStateScheme
    };

    if (eligibilityStatus === 'Likely Eligible' || eligibilityStatus === 'Potentially Eligible') {
      matchedResults.push(resultItem);
    } else {
      unmatchedResults.push(resultItem);
    }
  });

  // Sort matched schemes by Central vs State priority and relevance
  matchedResults.sort((a, b) => {
    if (a.eligibilityStatus === 'Likely Eligible' && b.eligibilityStatus !== 'Likely Eligible') return -1;
    if (b.eligibilityStatus === 'Likely Eligible' && a.eligibilityStatus !== 'Likely Eligible') return 1;
    return 0;
  });

  matchedResults.forEach((r, idx) => {
    r.matchRank = idx + 1;
  });

  const centralMatches = matchedResults.filter((m) => !m.isStateScheme);
  const stateMatches = matchedResults.filter((m) => m.isStateScheme);

  return {
    totalEvaluated: GOVERNMENT_SCHEMES_DB.length,
    matchedCount: matchedResults.length,
    topMatches: matchedResults,
    centralMatches,
    stateMatches,
    unmatchedSchemes: unmatchedResults,
    applicantTypeUsed: applicantType,
    targetState: state,
    targetDistrict: district,
    proposedLandUse: proposedUse
  };
}
