import React, { useState } from 'react';
import { 
  Users, 
  MapPin, 
  Star, 
  Calendar, 
  ShieldCheck, 
  Award, 
  Clock, 
  CheckCircle2,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { SOIL_EXPERTS } from '../data/soilExperts';
import { SourceBadge } from '../components/SourceBadge';

export const ExpertConnect: React.FC = () => {
  const [selectedExpert, setSelectedExpert] = useState<any>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingDate, setBookingDate] = useState('2026-09-05');

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* 1. HEADER */}
      <div className="bg-[#FFFFFF] p-6 sm:p-7 rounded-3xl border border-[#D5E1D9] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F5EC] border border-[#BDE3CC] flex items-center justify-center text-[#15803D] shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold font-mono text-[#166534] uppercase tracking-wider">
                ICAR & KVK EMPANELED SCIENTISTS
              </span>
              <SourceBadge type="official" label="CERTIFIED AGRONOMISTS" />
            </div>
            <h1 className="font-bold text-2xl text-[#17211B] tracking-tight">
              On-Site Soil & Land Geotechnical Consultation
            </h1>
            <p className="text-sm text-[#405048] font-medium">
              Book certified soil scientists and agricultural engineers for physical GPS-tagged field sampling
            </p>
          </div>
        </div>
      </div>

      {/* 2. EXPERTS DIRECTORY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SOIL_EXPERTS.map((expert) => (
          <div
            key={expert.id}
            className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#D5E1D9] shadow-sm hover:border-[#15803D] transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3.5">
              <div className="flex items-center gap-3.5">
                <img
                  src={expert.avatarUrl}
                  alt={expert.name}
                  className="w-14 h-14 rounded-2xl bg-[#F8FBF9] border border-[#D5E1D9] object-cover"
                />
                <div>
                  <h3 className="font-bold text-[#17211B] text-base">{expert.name}</h3>
                  <p className="text-xs text-[#166534] font-semibold">{expert.qualification}</p>
                  <div className="flex items-center gap-1 text-xs text-[#D97706] mt-0.5 font-bold">
                    <Star className="w-3.5 h-3.5 fill-[#D97706]" />
                    <span>{expert.rating}</span>
                    <span className="text-[#64736A] text-xs font-normal">({expert.reviewsCount} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#17211B] font-medium">
                <p className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#15803D] shrink-0" />
                  <span>{expert.specialization}</span>
                </p>
                <p className="flex items-center gap-2 text-[#405048]">
                  <MapPin className="w-4 h-4 text-[#15803D] shrink-0" />
                  <span>{expert.distanceKm} km from active land parcel</span>
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#D5E1D9] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#64736A] font-bold block uppercase">VISIT FEE</span>
                <p className="font-bold text-[#17211B] text-base">₹{expert.visitingPriceRupees || expert.visitingFee || 850}</p>
              </div>

              <button
                onClick={() => {
                  setSelectedExpert(expert);
                  setBookingSuccess(false);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs uppercase tracking-wide transition-all shadow-sm"
              >
                Book Visit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 3. BOOKING MODAL */}
      {selectedExpert && (
        <div className="fixed inset-0 z-50 bg-[#17211B]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#FFFFFF] p-6 sm:p-7 rounded-3xl border border-[#D5E1D9] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#D5E1D9] pb-3">
              <h3 className="font-bold text-lg text-[#17211B]">Schedule Field Consultation</h3>
              <span className="text-sm font-bold text-[#15803D]">₹{selectedExpert.visitingPriceRupees || 850}</span>
            </div>

            {!bookingSuccess ? (
              <form onSubmit={handleBooking} className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="text-xs text-[#64736A] font-bold block mb-1">SELECTED EXPERT</label>
                  <p className="text-[#17211B] font-bold text-sm">{selectedExpert.name} ({selectedExpert.qualification})</p>
                </div>

                <div>
                  <label className="text-xs text-[#64736A] font-bold block mb-1">PREFERRED INSPECTION DATE</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B] text-sm font-bold outline-none focus:border-[#15803D]"
                  />
                </div>

                <div className="p-3 bg-[#F8FBF9] rounded-xl border border-[#D5E1D9] text-xs text-[#405048] font-medium leading-relaxed">
                  Physical visit includes core soil drill sampling, on-site EC/pH testing, and certified geotechnical lab endorsement.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedExpert(null)}
                    className="px-4 py-2 rounded-xl bg-[#F8FBF9] hover:bg-[#E8F5EC] text-[#17211B] border border-[#D5E1D9] font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold uppercase shadow-sm"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#E8F5EC] text-[#15803D] flex items-center justify-center mx-auto border border-[#BDE3CC]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-[#17211B] text-base">Consultation Scheduled!</h4>
                <p className="text-xs text-[#405048] font-medium">
                  {selectedExpert.name} has accepted your request for {bookingDate}. Telemetry SMS notification sent.
                </p>
                <button
                  onClick={() => setSelectedExpert(null)}
                  className="px-5 py-2 rounded-xl bg-[#15803D] text-white font-bold text-xs uppercase shadow-sm"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
