import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  X, 
  CreditCard, 
  Lock, 
  Zap, 
  UserCheck, 
  FlaskConical, 
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useLand } from '../context/LandContext';

export const PremiumUpgradeModal: React.FC = () => {
  const { isUpgradeModalOpen, setIsUpgradeModalOpen, upgradeToPremium } = useLand();
  const [selectedPlan, setSelectedPlan] = useState<'single_inspection' | 'pro_membership'>('single_inspection');
  const [paymentMode, setPaymentMode] = useState<'demo_test' | 'upi' | 'card'>('demo_test');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!isUpgradeModalOpen) return null;

  const handleCompletePayment = async () => {
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 900));
    setIsProcessing(false);
    setPaymentSuccess(true);
    await new Promise(r => setTimeout(r, 600));
    await upgradeToPremium(paymentMode === 'demo_test' ? 'SIH Demo Instant Verification' : 'UPI / Card Gateway');
    setPaymentSuccess(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#FFFFFF] rounded-3xl shadow-2xl border border-[#D5E1D9] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#14532D] via-[#15803D] to-[#22C55E] text-white flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-extrabold text-emerald-100">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LANDVISTA PREMIUM SERVICE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Get a Professional On-Ground Assessment
            </h2>
            <p className="text-xs text-emerald-100 font-medium">
              AI Analysis + Satellite Intelligence + Certified On-Site Human Expert Inspection
            </p>
          </div>

          <button
            onClick={() => setIsUpgradeModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* Plan Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={() => setSelectedPlan('single_inspection')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedPlan === 'single_inspection'
                  ? 'border-[#15803D] bg-[#E8F5EC]'
                  : 'border-[#D5E1D9] bg-[#F8FBF9] hover:border-[#BDE3CC]'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-extrabold text-[#17211B] uppercase">Single Physical Inspection</span>
                <span className="text-base font-extrabold text-[#15803D]">₹1,499</span>
              </div>
              <p className="text-[11px] text-[#526358] mt-1 font-medium">
                1 on-site certified expert visit + 12-parameter soil core laboratory test.
              </p>
            </div>

            <div
              onClick={() => setSelectedPlan('pro_membership')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedPlan === 'pro_membership'
                  ? 'border-[#15803D] bg-[#E8F5EC]'
                  : 'border-[#D5E1D9] bg-[#F8FBF9] hover:border-[#BDE3CC]'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-extrabold text-[#17211B] uppercase">Annual Pro Land Bank</span>
                <span className="text-base font-extrabold text-[#15803D]">₹2,999</span>
              </div>
              <p className="text-[11px] text-[#526358] mt-1 font-medium">
                3 physical inspections + priority lab testing + full Land Dossier certification.
              </p>
            </div>
          </div>

          {/* Premium Benefits List */}
          <div className="p-4 rounded-2xl bg-[#F8FBF9] border border-[#D5E1D9] space-y-2.5">
            <span className="text-[10px] font-extrabold text-[#166534] uppercase tracking-wider block">
              WHAT'S INCLUDED IN PREMIUM CHECKUP:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#17211B]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                <span>On-site physical land & soil core inspection</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                <span>12-parameter NABL soil laboratory testing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                <span>Groundwater table & water quality analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                <span>Certified agronomist crop & subsidy prescription</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                <span>Automatic AI Land Dossier re-analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                <span>Real-time live expert tracking on dashboard</span>
              </div>
            </div>
          </div>

          {/* Payment Mode Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#17211B] uppercase">Payment Method</span>
              <span className="text-[10px] font-bold text-[#64736A] flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#15803D]" /> 256-Bit SSL Encrypted (Zero Card Data Stored)
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMode('demo_test')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMode === 'demo_test'
                    ? 'border-[#15803D] bg-[#E8F5EC] text-[#15803D] font-extrabold shadow-xs'
                    : 'border-[#D5E1D9] bg-[#FFFFFF] text-[#64736A] font-semibold'
                }`}
              >
                <Zap className="w-4 h-4 mx-auto mb-1 text-amber-600" />
                <span>SIH Demo Test Mode</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode('upi')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMode === 'upi'
                    ? 'border-[#15803D] bg-[#E8F5EC] text-[#15803D] font-extrabold shadow-xs'
                    : 'border-[#D5E1D9] bg-[#FFFFFF] text-[#64736A] font-semibold'
                }`}
              >
                <CreditCard className="w-4 h-4 mx-auto mb-1 text-[#15803D]" />
                <span>UPI / QR Code</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode('card')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMode === 'card'
                    ? 'border-[#15803D] bg-[#E8F5EC] text-[#15803D] font-extrabold shadow-xs'
                    : 'border-[#D5E1D9] bg-[#FFFFFF] text-[#64736A] font-semibold'
                }`}
              >
                <CreditCard className="w-4 h-4 mx-auto mb-1 text-[#0284C7]" />
                <span>Debit / Credit Card</span>
              </button>
            </div>
          </div>

          {/* Test Mode Highlight */}
          {paymentMode === 'demo_test' && (
            <div className="p-3 bg-emerald-50 border border-[#BDE3CC] rounded-xl text-xs text-[#166534] flex items-center justify-between">
              <span className="font-semibold">⚡ Instant Test Mode enabled for Smart India Hackathon judging.</span>
              <span className="font-extrabold px-2 py-0.5 bg-[#15803D] text-white text-[10px] rounded-md">
                1-CLICK UNLOCK
              </span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 bg-[#F8FBF9] border-t border-[#D5E1D9] flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-[#64736A] font-bold uppercase block">Total Payable</span>
            <span className="text-xl font-extrabold text-[#15803D]">
              {selectedPlan === 'single_inspection' ? '₹1,499' : '₹2,999'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsUpgradeModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-[#D5E1D9] text-xs font-bold text-[#64736A] hover:bg-white transition-all"
            >
              Cancel
            </button>
            <button
              disabled={isProcessing}
              onClick={handleCompletePayment}
              className="px-6 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Processing Payment...</span>
              ) : paymentSuccess ? (
                <span>✓ Verified! Unlocking...</span>
              ) : (
                <>
                  <span>Pay & Unlock Premium</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
