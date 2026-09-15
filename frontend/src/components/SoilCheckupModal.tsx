import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Calendar, 
  User, 
  Phone, 
  FlaskConical, 
  ShieldCheck, 
  Sparkles, 
  X, 
  ArrowRight,
  Info,
  Building2,
  FileCheck
} from 'lucide-react';
import { useLand } from '../context/LandContext';
import { DataConfidenceBadge } from './DataConfidenceBadge';
import confetti from 'canvas-confetti';

interface SoilCheckupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SoilCheckupModal: React.FC<SoilCheckupModalProps> = ({ isOpen, onClose }) => {
  const { selectedParcel, registerNewParcel } = useLand();

  const [bookingStep, setBookingStep] = useState<'form' | 'confirmed' | 'results'>('form');
  const [preferredDate, setPreferredDate] = useState('2026-09-08');
  const [preferredTime, setPreferredTime] = useState('10:30 AM');
  const [contactName, setContactName] = useState('Pratik Mishra');
  const [contactPhone, setContactPhone] = useState('+91 98220 44102');
  const [assignedExpert] = useState({
    name: 'Dr. Ramesh Patil',
    qualification: 'M.Sc. Soil Chemistry & Agronomy (MPKV Rahuri)',
    rating: '4.9/5.0 (142 reviews)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  });

  if (!isOpen) return null;

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStep('confirmed');
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
  };

  const handleSimulateCompletedReport = () => {
    const updatedParcel = {
      ...selectedParcel,
      soil: {
        ...selectedParcel.soil,
        pH: 7.1,
        nitrogen: 'Medium' as const,
        phosphorus: 'High' as const,
        potassium: 'High' as const,
        organicCarbon: 0.58,
        healthScore: 84,
        source: 'verified' as const
      }
    };
    registerNewParcel(updatedParcel);
    setBookingStep('results');
    confetti({ particleCount: 60, spread: 80, origin: { y: 0.5 } });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#17211B]/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#D5E1D9] shadow-2xl space-y-6 text-[#17211B]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#D5E1D9] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E8F5EC] text-[#15803D] flex items-center justify-center border border-[#BDE3CC]">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold font-mono text-[#166534] uppercase tracking-wider">HUMAN SCIENTIST FIELD SERVICE</span>
                <DataConfidenceBadge type="VERIFIED" label="ICAR & KVK NETWORK" />
              </div>
              <h2 className="font-bold text-xl text-[#17211B]">
                Request LandVista Soil Checkup
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64736A] hover:text-[#17211B] hover:bg-[#E8F5EC] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: BOOKING FORM */}
        {bookingStep === 'form' && (
          <form onSubmit={handleSubmitRequest} className="space-y-4 text-xs font-semibold">
            <div className="p-4 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9] space-y-2 text-[#405048] font-medium leading-relaxed">
              <p className="font-bold text-[#166534] text-xs flex items-center gap-1.5 uppercase">
                <Sparkles className="w-4 h-4 text-[#15803D]" /> How LandVista Soil Checkup Works:
              </p>
              <p className="text-xs">
                A certified soil scientist visits your land with a GPS core drill kit, collects 5-point soil samples, conducts on-site EC/pH testing, and submits lab samples. Your AI recommendations automatically update as soon as the test is recorded.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-xs text-[#17211B] font-bold block mb-1">YOUR PARCEL LOCATION</label>
                <input
                  type="text"
                  disabled
                  value={`${selectedParcel.name} (${selectedParcel.district}, ${selectedParcel.state})`}
                  className="w-full px-3 py-2 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B] text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-xs text-[#17211B] font-bold block mb-1">CONTACT NAME</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B] text-xs font-bold outline-none focus:border-[#15803D]"
                />
              </div>

              <div>
                <label className="text-xs text-[#17211B] font-bold block mb-1">PHONE NUMBER</label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B] text-xs font-bold outline-none focus:border-[#15803D]"
                />
              </div>

              <div>
                <label className="text-xs text-[#17211B] font-bold block mb-1">PREFERRED INSPECTION DATE</label>
                <input
                  type="date"
                  required
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B] text-xs font-bold outline-none focus:border-[#15803D]"
                />
              </div>
            </div>

            {/* Assigned Expert Preview */}
            <div className="p-3.5 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={assignedExpert.avatar}
                  alt={assignedExpert.name}
                  className="w-10 h-10 rounded-xl object-cover border border-[#D5E1D9]"
                />
                <div>
                  <span className="text-[10px] font-bold text-[#166534] block uppercase">ASSIGNED SPECIALIST</span>
                  <p className="font-bold text-[#17211B] text-xs">{assignedExpert.name}</p>
                  <p className="text-[10px] text-[#405048] font-medium">{assignedExpert.qualification}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#64736A] font-bold block uppercase">TESTING FEE</span>
                <p className="font-bold text-[#15803D] text-sm">₹850 <span className="text-[10px] text-[#64736A] font-normal">(Pay on visit)</span></p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-xs text-[#405048] flex items-center gap-1 font-medium">
                <Info className="w-3.5 h-3.5 text-[#15803D]" />
                Demo Service: Simulated Expert Booking
              </span>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold uppercase shadow-sm transition-all"
              >
                Confirm Soil Checkup Request
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: CONFIRMED STATUS */}
        {bookingStep === 'confirmed' && (
          <div className="space-y-5 text-xs text-center py-2 animate-in fade-in font-sans">
            <div className="w-14 h-14 rounded-full bg-[#E8F5EC] text-[#15803D] border border-[#BDE3CC] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-bold text-xl text-[#17211B]">
                Soil Checkup Scheduled!
              </h3>
              <p className="text-xs text-[#405048] font-medium mt-1">
                {assignedExpert.name} will visit your land on <strong>{preferredDate}</strong> at {preferredTime}.
              </p>
            </div>

            <div className="p-4 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9] text-left space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-[#D5E1D9] pb-2">
                <span className="text-[#64736A] font-bold uppercase text-[10px]">APPOINTMENT ID</span>
                <span className="font-bold text-[#15803D]">LV-SOIL-2026-9041</span>
              </div>
              <p>📍 <strong>Location:</strong> {selectedParcel.name}</p>
              <p>👨‍🔬 <strong>Assigned Expert:</strong> {assignedExpert.name}</p>
              <p>📅 <strong>Inspection Window:</strong> {preferredDate} ({preferredTime})</p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs font-bold">
              <button
                onClick={handleSimulateCompletedReport}
                className="px-5 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white uppercase shadow-sm flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Simulate Lab Report Delivery (Demo)</span>
              </button>

              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-[#F8FBF9] hover:bg-[#E8F5EC] text-[#17211B] border border-[#D5E1D9]"
              >
                Close Window
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: RESULTS STATUS */}
        {bookingStep === 'results' && (
          <div className="space-y-4 text-xs font-sans animate-in fade-in">
            <div className="p-4 bg-[#E8F5EC] border border-[#BDE3CC] rounded-2xl flex items-center gap-3 text-[#166534]">
              <CheckCircle2 className="w-6 h-6 text-[#15803D] shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-[#17211B]">Soil Test Complete & Verified!</h4>
                <p className="text-xs text-[#405048] font-medium">Your parcel telemetry and AI recommendations have been updated.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-3 bg-[#F8FBF9] rounded-xl border border-[#D5E1D9]">
                <span className="text-[10px] text-[#64736A] block uppercase font-bold">SOIL pH</span>
                <span className="font-bold text-[#15803D] text-sm">7.1 (Optimal)</span>
              </div>
              <div className="p-3 bg-[#F8FBF9] rounded-xl border border-[#D5E1D9]">
                <span className="text-[10px] text-[#64736A] block uppercase font-bold">NITROGEN</span>
                <span className="font-bold text-[#92400E] text-sm">Medium (185 kg)</span>
              </div>
              <div className="p-3 bg-[#F8FBF9] rounded-xl border border-[#D5E1D9]">
                <span className="text-[10px] text-[#64736A] block uppercase font-bold">PHOSPHORUS</span>
                <span className="font-bold text-[#15803D] text-sm">High (22 kg)</span>
              </div>
              <div className="p-3 bg-[#F8FBF9] rounded-xl border border-[#D5E1D9]">
                <span className="text-[10px] text-[#64736A] block uppercase font-bold">POTASSIUM</span>
                <span className="font-bold text-[#15803D] text-sm">High (310 kg)</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold uppercase shadow-sm"
              >
                View Updated Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
