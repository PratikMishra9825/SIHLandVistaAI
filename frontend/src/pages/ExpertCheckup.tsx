import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  MapPin, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  FlaskConical, 
  Droplets, 
  Lock, 
  Phone, 
  FileText, 
  ArrowRight,
  Car,
  RefreshCw,
  Eye,
  Check,
  Compass,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  BadgeCheck,
  Layers,
  Leaf
} from 'lucide-react';
import { useLand } from '../context/LandContext';
import { PremiumUpgradeModal } from '../components/PremiumUpgradeModal';
import { ExpertReportModal } from '../components/ExpertReportModal';
import { calculateParcelConfidence } from '../utils/aiEngine';

interface ExpertProfile {
  id: string;
  name: string;
  qualification: string;
  specialization: string;
  rating: number;
  reviewsCount: number;
  distanceKm: number;
  visitingPriceRupees: number;
  availableNextDate?: string;
  phone: string;
  avatarUrl: string;
  verifiedBadge?: boolean;
}

export const ExpertCheckup: React.FC = () => {
  const navigate = useNavigate();
  const { 
    selectedParcel, 
    isPremium, 
    setIsUpgradeModalOpen, 
    activeBooking, 
    bookExpert, 
    setIsReportModalOpen 
  } = useLand();

  // Booking Wizard State
  const [selectedService, setSelectedService] = useState<string>('Comprehensive Soil Lab & Land Inspection');
  
  // Dynamic Date & Time Scheduling
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(today.getDate() + 2);
  const in3Days = new Date(today);
  in3Days.setDate(today.getDate() + 3);

  const formatDateDisplay = (d: Date) => d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  const formatInputDate = (d: Date) => d.toISOString().split('T')[0];

  const [dateMode, setDateMode] = useState<'tomorrow' | 'dayAfter' | 'in3Days' | 'custom'>('tomorrow');
  const [customDate, setCustomDate] = useState<string>(formatInputDate(tomorrow));
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('09:30 AM - 11:30 AM');
  const [userNotes, setUserNotes] = useState<string>('');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isNewBookingMode, setIsNewBookingMode] = useState(false);

  // Available Experts State loaded dynamically from backend
  const [experts, setExperts] = useState<ExpertProfile[]>([]);
  const [selectedExpertId, setSelectedExpertId] = useState<string>('exp-01');

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/experts/nearby');
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data) && json.data.length > 0) {
            setExperts(json.data);
            setSelectedExpertId(json.data[0].id);
            return;
          }
        }
      } catch (err) {
        console.warn('Backend expert fetch fallback:', err);
      }
      
      // Fallback clean list if backend starting up
      const fallbackList: ExpertProfile[] = [
        {
          id: 'exp-01',
          name: 'Dr. Ramesh Patil',
          qualification: 'M.Sc. (Agri) Soil Science & Agronomy',
          specialization: 'Soil Chemistry, Salinity Reclamation & Precision Horticulture',
          rating: 4.95,
          reviewsCount: 142,
          distanceKm: 8.4,
          visitingPriceRupees: 1499,
          availableNextDate: 'Tomorrow, 09:30 AM',
          phone: '+91 98220 44102',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          verifiedBadge: true
        },
        {
          id: 'exp-02',
          name: 'Er. Anjali Deshmukh',
          qualification: 'B.Tech Agricultural Engineering & Hydrogeology',
          specialization: 'Micro-Irrigation Layout, Farm Ponds & Groundwater Recharge',
          rating: 4.88,
          reviewsCount: 98,
          distanceKm: 14.2,
          visitingPriceRupees: 1499,
          availableNextDate: 'In 2 Days, 02:30 PM',
          phone: '+91 94230 18873',
          avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
          verifiedBadge: true
        },
        {
          id: 'exp-03',
          name: 'Prof. Suresh Kumar Shinde',
          qualification: 'Ph.D. Soil Nutrition & Plant Pathology',
          specialization: 'Soil Lab Audits, Organic Carbon & High-Density Crops',
          rating: 4.98,
          reviewsCount: 230,
          distanceKm: 19.5,
          visitingPriceRupees: 1499,
          availableNextDate: 'In 3 Days, 10:00 AM',
          phone: '+91 98810 52319',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
          verifiedBadge: false
        }
      ];
      setExperts(fallbackList);
    };

    fetchExperts();
  }, []);

  const getEffectiveVisitDate = () => {
    if (dateMode === 'tomorrow') return `Tomorrow (${formatDateDisplay(tomorrow)})`;
    if (dateMode === 'dayAfter') return formatDateDisplay(dayAfter);
    if (dateMode === 'in3Days') return formatDateDisplay(in3Days);
    if (customDate) {
      const parsed = new Date(customDate);
      return parsed.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    }
    return formatDateDisplay(tomorrow);
  };

  const handleBookInspection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPremium) {
      setIsUpgradeModalOpen(true);
      return;
    }

    setIsSubmittingBooking(true);
    const chosenExpert = experts.find(e => e.id === selectedExpertId) || experts[0];

    try {
      await bookExpert({
        serviceType: selectedService,
        scheduledDate: getEffectiveVisitDate(),
        scheduledTime: selectedTimeSlot,
        userNotes: userNotes || 'Physical soil core testing and water table feasibility requested.',
        assignedExpert: chosenExpert
      });

      setIsSubmittingBooking(false);
      setBookingSuccess(true);
      setIsNewBookingMode(false);
      setTimeout(() => setBookingSuccess(false), 3000);
    } catch (err: any) {
      setIsSubmittingBooking(false);
      console.error('Booking error:', err);
    }
  };

  // 6-Stage Real-Time Lifecycle Stages
  const stages = [
    { key: 'REQUESTED', label: 'Requested', icon: Clock, desc: 'Booking submitted by landowner' },
    { key: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle2, desc: 'Slot locked in schedule' },
    { key: 'EXPERT_ASSIGNED', label: 'Expert Assigned', icon: Users, desc: 'Field agronomist assigned' },
    { key: 'ON_THE_WAY', label: 'On The Way', icon: Car, desc: 'Expert en-route to parcel' },
    { key: 'VISIT_COMPLETED', label: 'Visit Done', icon: ShieldCheck, desc: 'Core samples & audit complete' },
    { key: 'REPORT_READY', label: 'Report Ready', icon: FileText, desc: 'Verified lab report published' }
  ];

  const currentStatus = activeBooking?.status || 'REQUESTED';
  const currentStageIndex = stages.findIndex(s => s.key === currentStatus) >= 0 
    ? stages.findIndex(s => s.key === currentStatus) 
    : 1;

  // Next Expected Step Description
  const getNextStepGuidance = (status: string) => {
    switch (status) {
      case 'REQUESTED':
      case 'CONFIRMED':
        return 'Your appointment is confirmed. An expert is being assigned to visit your parcel coordinates.';
      case 'EXPERT_ASSIGNED':
        return 'Your assigned expert will arrive at your parcel on the scheduled date and time.';
      case 'ON_THE_WAY':
        return 'Your expert is currently traveling to your land parcel location. Please be ready to grant site access.';
      case 'VISIT_COMPLETED':
        return 'Field sample collection is complete. The physical lab report and soil parameters are being processed.';
      case 'REPORT_READY':
        return 'Your ground-verified lab report is ready! Your land dossier has been recalculated with verified data.';
      default:
        return 'Inspection in progress.';
    }
  };

  // Real-time Notification Banner Message
  const getStatusNotification = (status: string) => {
    switch (status) {
      case 'EXPERT_ASSIGNED':
        return { title: 'Expert Assigned', msg: `${activeBooking?.assignedExpert?.name || 'A field expert'} has been assigned to your inspection.`, color: 'bg-blue-50 border-blue-200 text-blue-800' };
      case 'ON_THE_WAY':
        return { title: 'Expert is On The Way', msg: 'Your expert is traveling to your parcel coordinates right now.', color: 'bg-amber-50 border-amber-200 text-amber-900' };
      case 'VISIT_COMPLETED':
        return { title: 'Inspection Completed', msg: 'Field inspection and core sampling completed. Lab report is being processed.', color: 'bg-emerald-50 border-emerald-200 text-emerald-900' };
      case 'REPORT_READY':
        return { title: 'Verified Report Ready', msg: 'Official ground-verified lab report is ready and applied to your Land Dossier!', color: 'bg-[#E8F5EC] border-[#BDE3CC] text-[#15803D]' };
      default:
        return null;
    }
  };

  const notification = activeBooking ? getStatusNotification(activeBooking.status) : null;
  const dynamicConfidence = calculateParcelConfidence(selectedParcel);
  const report = selectedParcel.groundVerifiedReport || activeBooking?.inspectionReport;

  return (
    <div className="space-y-6 pb-16 font-sans text-[#17211B] max-w-6xl mx-auto">
      
      {/* -----------------------------------------------------------
          1. HEADER & SERVICE INTRODUCTION
      ----------------------------------------------------------- */}
      <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#D5E1D9] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#E8F5EC] border border-[#BDE3CC] flex items-center justify-center text-[#15803D] text-2xl shrink-0 shadow-sm">
            👨‍🌾
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold font-mono text-[#166534] uppercase tracking-wider">
                LANDOWNER FIELD CHECKUP
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                isPremium 
                  ? 'bg-[#E8F5EC] text-[#15803D] border-[#BDE3CC]' 
                  : 'bg-gray-100 text-[#64736A] border-[#D5E1D9]'
              }`}>
                {isPremium ? '⭐ PREMIUM UNLOCKED' : '🔒 PREMIUM REQUIRED'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211B] tracking-tight">
              Expert Land & Soil Checkup
            </h1>
            <p className="text-xs sm:text-sm text-[#526358] font-medium max-w-2xl">
              Book a verified agronomist to physically visit your land parcel, take soil core samples, audit groundwater depth, and verify real-world feasibility.
            </p>
          </div>
        </div>

        {!isPremium && (
          <button
            onClick={() => setIsUpgradeModalOpen(true)}
            className="px-6 py-3.5 rounded-2xl bg-[#15803D] hover:bg-[#166534] text-white text-xs font-extrabold flex items-center gap-2 shadow-sm transition-all hover:scale-[1.02] active:scale-95 shrink-0 self-start md:self-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>Upgrade to Premium (₹1,499)</span>
          </button>
        )}
      </div>

      {/* Real-Time Socket.IO Notification Alert Banner */}
      {notification && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 shadow-sm ${notification.color}`}>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-current animate-ping shrink-0" />
            <div>
              <span className="text-xs font-black uppercase tracking-wide">{notification.title}: </span>
              <span className="text-xs font-medium">{notification.msg}</span>
            </div>
          </div>
          {activeBooking?.status === 'REPORT_READY' && (
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#15803D] text-white text-xs font-extrabold flex items-center gap-1.5 shrink-0 hover:bg-[#166534] transition-all shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View Report</span>
            </button>
          )}
        </div>
      )}

      {/* -----------------------------------------------------------
          2. ACTIVE LIVE INSPECTION STATUS (IF ACTIVE BOOKING EXISTS)
      ----------------------------------------------------------- */}
      {activeBooking && !isNewBookingMode && (
        <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#BDE3CC] shadow-sm space-y-6">
          
          {/* Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D5E1D9] pb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F5EC] border border-[#BDE3CC] text-[#15803D] flex items-center justify-center font-bold text-xl shadow-xs">
                📡
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-[#15803D] uppercase tracking-wider">
                    LIVE INSPECTION STATUS
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B] font-mono font-bold text-[10px]">
                    ID: {activeBooking.id}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#17211B] mt-0.5">
                  {activeBooking.serviceType}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => setIsNewBookingMode(true)}
                className="px-3.5 py-2 rounded-xl border border-[#D5E1D9] bg-[#F8FBF9] hover:bg-white text-[#17211B] text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <span>+ Book Another Visit</span>
              </button>
              {activeBooking.status === 'REPORT_READY' && (
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <FileText className="w-4 h-4" />
                  <span>View Full Report</span>
                </button>
              )}
            </div>
          </div>

          {/* 6-Step Real-time Status Tracker */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase text-[#64736A] tracking-wider">
                Inspection Progress (Real-Time Synchronized)
              </span>
              <span className="text-xs font-extrabold text-[#15803D] bg-[#E8F5EC] px-2.5 py-0.5 rounded-full border border-[#BDE3CC]">
                Stage {currentStageIndex + 1} of 6: {stages[currentStageIndex]?.label}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              {stages.map((stage, idx) => {
                const isPast = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                const Icon = stage.icon;

                return (
                  <div
                    key={stage.key}
                    className={`p-3 rounded-2xl border flex flex-col items-center text-center space-y-1.5 transition-all ${
                      isCurrent
                        ? 'border-[#15803D] bg-[#E8F5EC] text-[#15803D] font-extrabold shadow-xs ring-1 ring-[#15803D]'
                        : isPast
                        ? 'border-[#BDE3CC] bg-[#F8FBF9] text-[#166534]'
                        : 'border-[#D5E1D9] bg-[#FFFFFF] text-[#9AA5A0]'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                      isCurrent ? 'bg-[#15803D] text-white' : isPast ? 'bg-[#E8F5EC] text-[#15803D]' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-tight">{stage.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Next Expected Step Banner */}
            <div className="p-3.5 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] flex items-center gap-2.5 text-xs">
              <div className="w-2 h-2 rounded-full bg-[#15803D] shrink-0" />
              <div className="text-[#526358]">
                <strong className="text-[#17211B]">Next Expected Step:</strong> {getNextStepGuidance(activeBooking.status)}
              </div>
            </div>
          </div>

          {/* Details Grid: Land, Expert, Schedule, Payment */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            
            {/* 1. Assigned Expert */}
            <div className="p-4 rounded-2xl bg-[#F8FBF9] border border-[#D5E1D9] space-y-3">
              <div className="text-[10px] font-extrabold uppercase text-[#64736A] tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#15803D]" />
                <span>Assigned Field Expert</span>
              </div>
              <div className="flex items-start gap-3">
                <img
                  src={activeBooking.assignedExpert?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                  alt={activeBooking.assignedExpert?.name || 'Expert'}
                  className="w-12 h-12 rounded-2xl object-cover border border-[#D5E1D9] shrink-0"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-xs text-[#17211B]">
                      {activeBooking.assignedExpert?.name || 'Dr. Ramesh Patil'}
                    </h4>
                    <span className="text-[9px] px-1.5 py-0.2 bg-[#E8F5EC] text-[#15803D] font-bold rounded">
                      {activeBooking.assignedExpert?.verifiedBadge ? 'Verified Expert' : 'Land Expert'}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#526358] font-medium leading-tight">
                    {activeBooking.assignedExpert?.qualification || 'M.Sc. (Agri) Soil Science'}
                  </p>
                  <p className="text-[10px] text-[#15803D] font-semibold">
                    {activeBooking.assignedExpert?.phone || '+91 98220 44102'}
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Land Location & Coordinates */}
            <div className="p-4 rounded-2xl bg-[#F8FBF9] border border-[#D5E1D9] space-y-2">
              <div className="text-[10px] font-extrabold uppercase text-[#64736A] tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#15803D]" />
                <span>Land Location & Coordinates</span>
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-[#17211B]">
                  {selectedParcel.name}
                </h4>
                <p className="text-[11px] text-[#526358] leading-tight">
                  {selectedParcel.verifiedAddress || `${selectedParcel.district}, ${selectedParcel.state}`}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] font-mono font-bold text-[#166534]">
                  <span className="bg-white px-2 py-0.5 rounded border border-[#D5E1D9]">
                    📍 {selectedParcel.lat.toFixed(5)}°N, {selectedParcel.lng.toFixed(5)}°E
                  </span>
                  <span className="bg-white px-2 py-0.5 rounded border border-[#D5E1D9]">
                    📐 {selectedParcel.areaAcres} Acres
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Appointment & Payment Schedule */}
            <div className="p-4 rounded-2xl bg-[#F8FBF9] border border-[#D5E1D9] space-y-2">
              <div className="text-[10px] font-extrabold uppercase text-[#64736A] tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#15803D]" />
                <span>Appointment & Payment</span>
              </div>
              <div className="space-y-1.5">
                <div className="text-xs font-extrabold text-[#17211B] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#15803D]" />
                  <span>{activeBooking.scheduledDate}</span>
                </div>
                <div className="text-[11px] font-bold text-[#526358]">
                  Time Window: {activeBooking.scheduledTime}
                </div>
                <div className="pt-1.5 border-t border-[#D5E1D9] flex items-center justify-between text-[10px]">
                  <span className="font-bold text-[#64736A]">Payment:</span>
                  <span className="font-extrabold text-[#15803D] bg-[#E8F5EC] px-2 py-0.5 rounded">
                    PAID (₹{activeBooking.priceRupees || 1499}) • Demo Mode
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* -----------------------------------------------------------
              GROUND-VERIFIED REPORT SECTION (WHEN REPORT IS READY)
          ----------------------------------------------------------- */}
          {activeBooking.status === 'REPORT_READY' && report && (
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#F8FBF9] to-[#EDF6F0] border-2 border-[#BDE3CC] space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#BDE3CC] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#15803D] text-white flex items-center justify-center font-bold text-lg shadow-xs">
                    🌱
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold text-[#15803D] uppercase tracking-wider">
                        OFFICIAL GROUND-VERIFIED REPORT
                      </span>
                      <span className="px-2 py-0.2 rounded bg-white text-[#15803D] font-mono text-[9px] font-bold border border-[#BDE3CC]">
                        Cert: {report.labCertificateNo || 'EXP-LAB-8942'}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-[#17211B]">
                      Physical Soil & Water Audit Summary
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Complete Report</span>
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 text-[#17211B] text-xs font-extrabold border border-[#D5E1D9] flex items-center gap-1.5 transition-all"
                  >
                    <span>View Updated Recommendations</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Core Verified Parameters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-center">
                <div className="p-2.5 bg-white rounded-xl border border-[#D5E1D9]">
                  <div className="text-[10px] font-bold text-[#64736A]">Soil pH</div>
                  <div className="text-sm font-black text-[#15803D]">{report.soilParameters?.ph ?? 7.2}</div>
                  <div className="text-[9px] text-[#64736A] font-medium">Optimal</div>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-[#D5E1D9]">
                  <div className="text-[10px] font-bold text-[#64736A]">Nitrogen (N)</div>
                  <div className="text-sm font-black text-[#17211B]">{report.soilParameters?.nitrogenKgHa ?? 310} kg/ha</div>
                  <div className="text-[9px] text-[#15803D] font-bold">Rich</div>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-[#D5E1D9]">
                  <div className="text-[10px] font-bold text-[#64736A]">Phosphorus (P)</div>
                  <div className="text-sm font-black text-[#17211B]">{report.soilParameters?.phosphorusKgHa ?? 28} kg/ha</div>
                  <div className="text-[9px] text-[#15803D] font-bold">Balanced</div>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-[#D5E1D9]">
                  <div className="text-[10px] font-bold text-[#64736A]">Potassium (K)</div>
                  <div className="text-sm font-black text-[#17211B]">{report.soilParameters?.potassiumKgHa ?? 340} kg/ha</div>
                  <div className="text-[9px] text-[#15803D] font-bold">High</div>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-[#D5E1D9]">
                  <div className="text-[10px] font-bold text-[#64736A]">Water Table</div>
                  <div className="text-sm font-black text-[#17211B]">{report.waterParameters?.waterTableDepthMeters ?? 16.5}m</div>
                  <div className="text-[9px] text-[#15803D] font-bold">Perennial</div>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-[#D5E1D9]">
                  <div className="text-[10px] font-bold text-[#64736A]">Soil Health</div>
                  <div className="text-sm font-black text-[#15803D]">{report.soilParameters?.soilHealthScore ?? 92}/100</div>
                  <div className="text-[9px] text-[#15803D] font-bold">Grade A</div>
                </div>
              </div>

              {/* Expert Summary & Dynamic Confidence Recalculation Note */}
              <div className="p-3 bg-white rounded-xl border border-[#BDE3CC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="font-extrabold text-[#17211B] flex items-center gap-1.5">
                    <BadgeCheck className="w-4 h-4 text-[#15803D]" />
                    <span>Recommendation updated using ground-verified inspection data.</span>
                  </div>
                  <p className="text-[11px] text-[#526358]">
                    {report.agronomistSummary || 'Physical core samples confirmed rich organic matter and high suitability for high-density horticulture.'}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] font-bold text-[#64736A]">Recalculated Confidence:</div>
                  <div className="text-sm font-black text-[#15803D]">{dynamicConfidence.score}% Dynamic Score</div>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* -----------------------------------------------------------
          3. PURE LANDOWNER BOOKING FORM & EXPERTS DIRECTORY
      ----------------------------------------------------------- */}
      {(!activeBooking || isNewBookingMode) && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Interactive Landowner Booking Wizard */}
          <div className="lg:col-span-7 bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#D5E1D9] shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-[#D5E1D9] pb-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-[#17211B]">1.</span>
                <h3 className="font-extrabold text-base text-[#17211B]">
                  SCHEDULE IN-PERSON FIELD INSPECTION
                </h3>
              </div>
              {activeBooking && (
                <button
                  type="button"
                  onClick={() => setIsNewBookingMode(false)}
                  className="text-xs text-[#15803D] font-bold hover:underline"
                >
                  ← Back to Active Status
                </button>
              )}
            </div>

            {!isPremium ? (
              /* Locked View for Free Users */
              <div className="p-8 rounded-3xl bg-gradient-to-br from-[#F8FBF9] to-[#EDF6F0] border-2 border-dashed border-[#BDE3CC] text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#E8F5EC] text-[#15803D] flex items-center justify-center text-2xl mx-auto shadow-sm">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-extrabold text-[#17211B]">
                    Field Expert Checkup is a Premium Service
                  </h4>
                  <p className="text-xs text-[#526358] max-w-md mx-auto leading-relaxed">
                    Upgrade to Premium to get physical soil core sampling, water table measurement, and a verified agronomist report for your parcel.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-left pt-2">
                  <div className="p-3 bg-white rounded-xl border border-[#D5E1D9] space-y-1">
                    <FlaskConical className="w-4 h-4 text-[#15803D]" />
                    <div className="font-extrabold text-xs text-[#17211B]">12-Point Lab Test</div>
                    <div className="text-[10px] text-[#64736A]">NPK, pH, EC & Organic Carbon core samples</div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#D5E1D9] space-y-1">
                    <Droplets className="w-4 h-4 text-[#15803D]" />
                    <div className="font-extrabold text-xs text-[#17211B]">Water Table Audit</div>
                    <div className="text-[10px] text-[#64736A]">Borewell yield & salinity measurement</div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#D5E1D9] space-y-1">
                    <BadgeCheck className="w-4 h-4 text-[#15803D]" />
                    <div className="font-extrabold text-xs text-[#17211B]">Ground Truth Recalibration</div>
                    <div className="text-[10px] text-[#64736A]">Dossier updated with verified field facts</div>
                  </div>
                </div>

                <button
                  onClick={() => setIsUpgradeModalOpen(true)}
                  className="px-6 py-3.5 rounded-2xl bg-[#15803D] hover:bg-[#166534] text-white text-xs font-extrabold flex items-center gap-2 mx-auto shadow-sm transition-all hover:scale-[1.02] active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Upgrade to Premium Plan (₹1,499)</span>
                </button>
              </div>
            ) : (
              /* Active Booking Form for Premium Users */
              <form onSubmit={handleBookInspection} className="space-y-4 text-xs">
                
                {/* 1. Service Selection */}
                <div>
                  <label className="font-extrabold text-[#17211B] uppercase text-[10px] block mb-1">
                    Select Inspection Service
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[#D5E1D9] bg-[#F8FBF9] font-bold text-[#17211B] text-xs focus:ring-2 focus:ring-[#15803D]"
                  >
                    <option value="Comprehensive Soil Lab & Land Inspection">
                      Comprehensive Soil Lab & Physical Land Inspection (12-Parameter Core Test)
                    </option>
                    <option value="Agronomy & Irrigation Feasibility Study">
                      Agronomy & Groundwater Irrigation Feasibility Study
                    </option>
                    <option value="Solar Feasibility & Grid Substation Inspection">
                      Solar Feasibility Ground & 33kV Substation Line Audit
                    </option>
                  </select>
                </div>

                {/* 2. PREFERRED VISIT DATE SELECTION */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-extrabold text-[#17211B] uppercase text-[10px] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#15803D]" />
                      <span>Preferred Visit Date</span>
                    </label>
                    <span className="text-[10px] font-bold text-[#166534] bg-[#E8F5EC] px-2 py-0.5 rounded-full border border-[#BDE3CC]">
                      Next Available: Tomorrow
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setDateMode('tomorrow')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        dateMode === 'tomorrow'
                          ? 'border-[#15803D] bg-[#E8F5EC] text-[#15803D] shadow-sm font-extrabold'
                          : 'border-[#D5E1D9] bg-[#F8FBF9] text-[#17211B] hover:border-[#BDE3CC]'
                      }`}
                    >
                      <div className="text-[10px] text-[#64736A] font-bold">Tomorrow</div>
                      <div className="text-xs font-black">{formatDateDisplay(tomorrow)}</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDateMode('dayAfter')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        dateMode === 'dayAfter'
                          ? 'border-[#15803D] bg-[#E8F5EC] text-[#15803D] shadow-sm font-extrabold'
                          : 'border-[#D5E1D9] bg-[#F8FBF9] text-[#17211B] hover:border-[#BDE3CC]'
                      }`}
                    >
                      <div className="text-[10px] text-[#64736A] font-bold">In 2 Days</div>
                      <div className="text-xs font-black">{formatDateDisplay(dayAfter)}</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDateMode('in3Days')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        dateMode === 'in3Days'
                          ? 'border-[#15803D] bg-[#E8F5EC] text-[#15803D] shadow-sm font-extrabold'
                          : 'border-[#D5E1D9] bg-[#F8FBF9] text-[#17211B] hover:border-[#BDE3CC]'
                      }`}
                    >
                      <div className="text-[10px] text-[#64736A] font-bold">In 3 Days</div>
                      <div className="text-xs font-black">{formatDateDisplay(in3Days)}</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDateMode('custom')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        dateMode === 'custom'
                          ? 'border-[#15803D] bg-[#E8F5EC] text-[#15803D] shadow-sm font-extrabold'
                          : 'border-[#D5E1D9] bg-[#F8FBF9] text-[#17211B] hover:border-[#BDE3CC]'
                      }`}
                    >
                      <div className="text-[10px] text-[#64736A] font-bold">Pick Date</div>
                      <div className="text-xs font-black">📅 Custom Date</div>
                    </button>
                  </div>

                  {dateMode === 'custom' && (
                    <div className="pt-1">
                      <label className="text-[10px] font-bold text-[#64736A] block mb-1">
                        Select Inspection Date on Calendar:
                      </label>
                      <input
                        type="date"
                        min={formatInputDate(tomorrow)}
                        value={customDate}
                        onChange={(e) => setCustomDate(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-[#15803D] bg-[#FFFFFF] font-bold text-[#17211B] text-xs focus:ring-2 focus:ring-[#15803D] shadow-sm"
                      />
                    </div>
                  )}
                </div>

                {/* 3. PREFERRED VISIT TIME SLOT */}
                <div className="space-y-2">
                  <label className="font-extrabold text-[#17211B] uppercase text-[10px] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#15803D]" />
                    <span>Preferred Visit Time Slot</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { slot: '09:30 AM - 11:30 AM', label: 'Morning Slot', desc: 'Optimal for Soil Core & Moisture sampling', badge: 'Recommended' },
                      { slot: '12:00 PM - 02:00 PM', label: 'Midday Slot', desc: 'Peak Sun Topo & Solar Feasibility', badge: '' },
                      { slot: '02:30 PM - 04:30 PM', label: 'Afternoon Slot', desc: 'Groundwater Table & Borewell Audit', badge: '' },
                      { slot: '05:00 PM - 06:30 PM', label: 'Evening Slot', desc: 'Drone Aerial & Boundary Reconnaissance', badge: '' }
                    ].map((t) => (
                      <button
                        key={t.slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(t.slot)}
                        className={`p-3 rounded-xl border text-left flex items-start justify-between transition-all ${
                          selectedTimeSlot === t.slot
                            ? 'border-[#15803D] bg-[#E8F5EC] text-[#17211B] shadow-sm ring-1 ring-[#15803D]'
                            : 'border-[#D5E1D9] bg-[#F8FBF9] text-[#64736A] hover:border-[#BDE3CC] hover:bg-white'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-xs text-[#17211B]">{t.slot}</span>
                            {t.badge && (
                              <span className="text-[9px] font-bold text-[#15803D] bg-white px-1.5 py-0.2 rounded border border-[#BDE3CC]">
                                {t.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-[#64736A] font-medium">{t.desc}</div>
                        </div>
                        {selectedTimeSlot === t.slot ? (
                          <div className="w-4 h-4 rounded-full bg-[#15803D] text-white flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-[#D5E1D9] shrink-0 mt-0.5" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. ACTUAL SELECTED LAND PARCEL CONFIRMATION */}
                <div className="p-3.5 bg-[#E8F5EC] rounded-2xl border border-[#BDE3CC] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#166534] uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#15803D]" />
                      <span>Target Parcel to Inspect</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#15803D]">
                      {selectedParcel.lat.toFixed(5)}°N, {selectedParcel.lng.toFixed(5)}°E
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-black text-[#17211B]">{selectedParcel.name}</span>
                    <span className="font-bold text-[#526358]">{selectedParcel.district}, {selectedParcel.state} ({selectedParcel.areaAcres} Acres)</span>
                  </div>
                </div>

                {/* 5. NOTES */}
                <div>
                  <label className="font-extrabold text-[#17211B] uppercase text-[10px] block mb-1">
                    Specific Instructions or Questions for Expert (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={userNotes}
                    onChange={(e) => setUserNotes(e.target.value)}
                    placeholder="e.g. Please test salinity on the south parcel corner and verify borewell water potability..."
                    className="w-full p-3 rounded-xl border border-[#D5E1D9] bg-[#F8FBF9] text-xs text-[#17211B] focus:ring-2 focus:ring-[#15803D]"
                  />
                </div>

                {/* 6. SUBMISSION BUTTON */}
                <button
                  type="submit"
                  disabled={isSubmittingBooking}
                  className="w-full py-3.5 rounded-2xl bg-[#15803D] hover:bg-[#166534] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  {isSubmittingBooking ? (
                    <span>Scheduling Field Expert...</span>
                  ) : bookingSuccess ? (
                    <span>✓ Field Visit Scheduled!</span>
                  ) : (
                    <>
                      <span>Confirm & Book On-Ground Inspection</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Available Land Experts Directory */}
          <div className="lg:col-span-5 bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#D5E1D9] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#D5E1D9] pb-3">
              <h3 className="font-extrabold text-base text-[#17211B]">
                AVAILABLE FIELD EXPERTS
              </h3>
              <span className="text-[10px] font-bold text-[#15803D] bg-[#E8F5EC] px-2 py-0.5 rounded-md border border-[#BDE3CC]">
                {experts.length} Available Nearby
              </span>
            </div>

            <div className="space-y-3">
              {experts.map((exp) => (
                <div
                  key={exp.id}
                  onClick={() => setSelectedExpertId(exp.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 flex flex-col justify-between ${
                    selectedExpertId === exp.id
                      ? 'border-[#15803D] bg-[#F8FBF9] ring-1 ring-[#15803D] shadow-xs'
                      : 'border-[#D5E1D9] bg-[#FFFFFF] hover:border-[#BDE3CC]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={exp.avatarUrl}
                      alt={exp.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-[#D5E1D9] shrink-0"
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-extrabold text-xs text-[#17211B]">{exp.name}</h4>
                        <span className="text-[9px] px-1.5 py-0.2 bg-[#E8F5EC] text-[#15803D] font-bold rounded">
                          {exp.verifiedBadge ? 'Verified Expert' : 'Land Expert'}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#526358] font-medium leading-tight">{exp.qualification}</p>
                      <p className="text-[10px] text-[#15803D] font-semibold mt-0.5">{exp.specialization}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#D5E1D9] flex items-center justify-between text-[10px] font-bold text-[#64736A]">
                    <span>⭐ {exp.rating} ({exp.reviewsCount} visits)</span>
                    <span>{exp.distanceKm} km away</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center">
              <a
                href="/expert"
                className="text-[11px] font-bold text-[#64736A] hover:text-[#15803D] transition-colors"
              >
                Are you an Assigned Field Expert? Switch to Expert Workbench →
              </a>
            </div>
          </div>

        </div>
      )}

      {/* Modals */}
      <PremiumUpgradeModal />
      <ExpertReportModal />

    </div>
  );
};
