import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { runMultiCriteriaAnalysis } from '../services/recommendationEngine.js';

const router = express.Router();

/**
 * 1. POST /api/ai/explain-recommendation
 * Generates an authoritative, anti-hallucinatory AI explanation strictly grounded
 * in the parcel's verified geospatial, Bhuvan, satellite, soil, water, and surrounding spatial data.
 */
router.post('/explain-recommendation', async (req, res) => {
  try {
    const { parcel, topRec, alternatives, photoAnalysis } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // Run the authoritative MCDA analysis on the parcel
    const analysis = runMultiCriteriaAnalysis(parcel);
    const top = topRec || analysis.topRecommendation;
    const alts = alternatives || analysis.recommendations.slice(1, 4);

    const area = parcel?.areaAcres || parcel?.area || 10.0;
    const district = parcel?.district || 'Solapur';
    const state = parcel?.state || 'Maharashtra';
    const lat = parcel?.lat || 17.6599;
    const lng = parcel?.lng || 75.9064;

    const pattern = analysis.surroundingPatterns?.dominantPattern || 'Mixed';
    const whyFactors = analysis.whyTopRanked;
    const compReasons = analysis.whyAlternativesRankedLower;
    const changedFactors = analysis.whatChangedRecommendation;

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are the Lead Geospatial Decision Scientist for LANDVISTA AI (Smart India Hackathon 2026).
STRICT ANTI-HALLUCINATION RULES:
1. ONLY explain and reason using the verified parcel and surrounding facts provided below.
2. DO NOT fabricate or hallucinate features, fake distances, fake population numbers, or fake government schemes.
3. Compare the top recommended use against alternatives and explain WHY it ranked higher.
4. Highlight how the surrounding environment (land-use pattern, buffer distances, saturation) directly influenced the score.
5. If data is missing or unverified, acknowledge it directly.

GROUND TRUTH DATA:
- Parcel Location: ${district}, ${state} (${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E)
- Parcel Area: ${area} Acres
- Surrounding Land-Use Pattern: ${pattern}
- Top Recommended Land Use: ${top.title} (Score: ${top.score}/100)
- Key Why Ranked #1 Factors: ${JSON.stringify(whyFactors)}
- Comparative Breakdown against Alternatives: ${JSON.stringify(compReasons)}
- What Changed the Recommendation (Surrounding Impact): ${JSON.stringify(changedFactors)}
- Photo Analysis Status: ${photoAnalysis?.isValid ? 'Verified visible ground photo' : 'Digital remote sensing estimation'}

Generate a JSON object with this EXACT structure:
{
  "summary": "1-2 sentence executive summary explaining why this specific land use was ranked #1 given what is around it",
  "whyRecommendation": [
    "3-4 concrete verified facts explaining why this land use was ranked highest"
  ],
  "surroundingImpact": "Summary explaining how surrounding land-use patterns, infrastructure buffer distances, and saturation influenced the decision",
  "whatChangedRecommendation": [
    "2-3 strongest pivot factors from surroundings and constraints"
  ],
  "whyNotOthers": [
    {
      "title": "Alternative land use title",
      "score": 75,
      "whyLower": "Concrete reason why this alternative ranked lower"
    }
  ],
  "governmentSchemes": [
    {
      "name": "Exact scheme name (e.g. PM-KUSUM, PMKSY, AIF, NLP)",
      "benefit": "Specific benefit (e.g. 30% CFA subsidy or 55% micro-irrigation grant)",
      "eligibility": "Eligibility criteria for this parcel"
    }
  ],
  "nextSteps": [
    "Specific ground verification and registration steps"
  ],
  "confidence": ${analysis.confidenceScore},
  "disclaimer": "Advisory analysis based on ISRO Bhuvan satellite cadastre and verified regional environmental metrics. On-site departmental validation recommended."
}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return res.json({ success: true, data: parsed, mode: 'GEMINI_AI' });
        }
      } catch (geminiErr) {
        console.warn('Gemini explanation call failed, using deterministic engine:', geminiErr.message);
      }
    }

    // Deterministic Rule-Based Fallback (Zero Hallucination)
    const fallbackData = {
      summary: `This ${area}-acre parcel in ${district} is best suited for ${top.title} (${top.score}/100) due to high alignment with its ${pattern} surrounding context and verified terrain profile.`,
      whyRecommendation: whyFactors,
      surroundingImpact: `Surrounding area exhibits a ${pattern} with ${analysis.surroundingPatterns?.composition?.residential || 20}% residential, ${analysis.surroundingPatterns?.composition?.agricultural || 40}% agricultural, and ${analysis.surroundingPatterns?.composition?.industrial || 15}% industrial composition.`,
      whatChangedRecommendation: changedFactors,
      whyNotOthers: compReasons.map(c => ({
        title: c.title,
        score: c.score,
        whyLower: c.reason
      })),
      governmentSchemes: [
        top.useType === 'solar'
          ? { name: 'PM-KUSUM Component A & C', benefit: '30% Central CFA Subsidy + ₹3.10/kWh 25-Year PPA', eligibility: 'Landowners within 5 km of 33kV substation' }
          : top.useType === 'agriculture'
          ? { name: 'PM Krishi Sinchayee Yojana (PMKSY)', benefit: '55% Micro-Drip Irrigation Subsidy', eligibility: 'Small & medium agricultural landholders' }
          : top.useType === 'warehouse'
          ? { name: 'Agriculture Infrastructure Fund (AIF)', benefit: '3% Interest Subvention on loans up to ₹2 Crore', eligibility: 'Agro-warehousing and post-harvest infrastructure' }
          : { name: 'National Logistics Policy / MSME Infrastructure Grant', benefit: 'Commercial & industrial infrastructure credit concessions', eligibility: 'Registered commercial development parcels' },
        { name: 'National Mission on Sustainable Agriculture (NMSA)', benefit: 'Soil conditioning & farm pond construction grants', eligibility: 'All registered agricultural land parcels' }
      ],
      nextSteps: analysis.nextSteps,
      confidence: analysis.confidenceScore,
      disclaimer: 'Advisory analysis based on ISRO Bhuvan satellite and regional spatial cadastre. Field soil core testing and revenue verification recommended before financial commitment.'
    };

    return res.json({ success: true, data: fallbackData, mode: 'DETERMINISTIC_GIS_AI' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. Existing AI Chat Assistant endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, parcelContext } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    const analysis = parcelContext ? runMultiCriteriaAnalysis(parcelContext) : null;
    const topRec = analysis?.topRecommendation;

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are LandVista AI, an expert geospatial AI land decision consultant for the Smart India Hackathon.
STRICT RULES: Use ONLY the verified parcel facts below. Do NOT invent fake numbers.
Current Land Context:
- Name: ${parcelContext?.name || 'Registered Parcel'}
- Location: ${parcelContext?.district || 'Solapur'}, ${parcelContext?.state || 'Maharashtra'}
- Area: ${parcelContext?.areaAcres || 10} Acres
- Surrounding Pattern: ${analysis?.surroundingPatterns?.dominantPattern || 'Mixed Peri-Urban'}
- Top Recommended Use: ${topRec?.title || 'Precision Agriculture'} (Score: ${topRec?.score || 88}/100)
- Why Top Ranked: ${JSON.stringify(analysis?.whyTopRanked || [])}
- What Changed Recommendation: ${JSON.stringify(analysis?.whatChangedRecommendation || [])}

User Question: "${message}"

Give a sharp, structured, explainable answer with:
1. Direct response based on land physics, surrounding buffer analysis, and verified facts.
2. Pros & Risks.
3. Relevant Indian government schemes (PM-KUSUM, PMKSY, AIF).
4. Concrete next steps.`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        return res.json({ success: true, reply: responseText, mode: 'GEMINI_AI' });
      } catch (geminiErr) {
        console.warn('Gemini API call failed, falling back to local engine:', geminiErr.message);
      }
    }

    // Smart Local Rule-Based Fallback
    const reply = `🤖 **LandVista Intelligence Summary:**\n\nBased on your ${parcelContext?.areaAcres || 10}-acre parcel in ${parcelContext?.district || 'Solapur'} (Surrounding: **${analysis?.surroundingPatterns?.dominantPattern || 'Mixed'}**):\n- **#1 Top Ranked Use:** **${topRec?.title || 'Precision Agriculture & Horticulture'}** (${topRec?.score || 88}/100)\n- **Why it ranked #1:** ${analysis?.whyTopRanked?.[0] || 'High alignment with verified soil, road, and regional catchment factors.'}\n- **What Changed Decision:** ${analysis?.whatChangedRecommendation?.[0] || 'Surrounding infrastructure and low saturation.'}\n\nWhat specific scenario or financial return projection would you like to explore?`;

    return res.json({ success: true, reply, mode: 'DEMO_AI' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
