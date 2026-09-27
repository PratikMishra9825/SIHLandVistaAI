import React, { useState, useEffect, useCallback } from 'react';
import { 
  UserCheck, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Camera, 
  ShieldCheck, 
  Compass, 
  ArrowRight, 
  TestTube, 
  Send, 
  RefreshCw, 
  Check, 
  Info, 
  ExternalLink, 
  BadgeCheck 
} from 'lucide-react';
import { useLand } from '../context/LandContext';
import { getSocket, joinExpertRoom } from '../services/socket';
import type { ExpertBooking, ExpertInspectionReport } from '../types/land';
import { apiUrl } from '../services/apiConfig';
import confetti from 'canvas-confetti';

export const ExpertDashboard: React.FC = () => {
  const { selectedParcel, applyExpertReport } = useLand();

  // Real Assigned Field Visits Queue from MongoDB
  const [assignedVisits, setAssignedVisits] = useState<ExpertBooking[]>([]);
  const [activeBookingId, setActiveBookingId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Soil & Water Measurement Form State (Empty until entered by expert)
  const [soilForm, setSoilForm] = useState({
    pH: '',
    nitrogenKgHa: '',
    phosphorusKgHa: '',
    potassiumKgHa: '',
    organicCarbonPercent: '',
    ecDsm: '',
    soilTexture: 'Medium Deep Black Clayey Loam',
    drainageClass: 'Well Drained',
    waterTableDepthMeters: '',
    waterQuality: 'Potable & Optimal for Micro-Drip Irrigation',
    waterQualityTdsPpm: '',
    expertNotes: '',
    recommendedCrops: ''
  });

  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReportSubmitted, setIsReportSubmitted] = useState(false);

  // Fetch real assigned bookings from backend MongoDB
  const fetchAssignedBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(apiUrl('/api/experts/assigned-bookings?expertId=exp-01'));
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          const list: ExpertBooking[] = json.data.map((b: any) => ({
            id: b._id || b.id,
            landId: b.landId || selectedParcel.id,
            parcelName: b.parcelName || selectedParcel.name,
            userName: b.userName || 'Landowner',
            userPhone: b.userPhone || '+91 98220 44102',
            serviceType: b.serviceType || 'Comprehensive Soil Lab & Land Inspection',
            locationCoordinates: b.locationCoordinates || [selectedParcel.lng, selectedParcel.lat],
            locationAddress: b.locationAddress || selectedParcel.verifiedAddress || `${selectedParcel.district}, ${selectedParcel.state}`,
            scheduledDate: b.scheduledDate || 'Today',
            scheduledTime: b.scheduledTime || '10:30 AM',
            status: b.status || 'CONFIRMED',
            assignedExpert: b.assignedExpert || {
              id: 'exp-01',
              name: 'Dr. Ramesh Patil',
              qualification: 'M.Sc. (Agri) Soil Science & Agronomy',
              specialization: 'Soil Chemistry, Salinity Reclamation & Precision Horticulture',
              phone: '+91 98220 44102',
              rating: 4.95,
              reviewsCount: 142,
              distanceKm: 8.4,
              visitingFee: 1499,
              avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
              verifiedBadge: true
            },
            priceRupees: b.priceRupees || 1499,
            paymentStatus: b.paymentStatus || 'PAID',
            paymentMethod: b.paymentMethod || 'Online Payment',
            userNotes: b.userNotes || '',
            inspectionReport: b.inspectionReport,
            createdAt: b.createdAt || new Date().toISOString()
          }));
          setAssignedVisits(list);
          if (!activeBookingId || !list.some(b => b.id === activeBookingId)) {
            setActiveBookingId(list[0].id);
          }
          return;
        }
      }
      setAssignedVisits([]);
      setActiveBookingId('');
    } catch (e) {
      console.warn('Error fetching assigned bookings from backend:', e);
    } finally {
      setIsLoading(false);
    }
  }, [activeBookingId, selectedParcel]);

  useEffect(() => {
    fetchAssignedBookings();

    const socket = getSocket();
    joinExpertRoom('exp-01');

    const handleNewBooking = (booking: any) => {
      console.log('👨‍🔬 Expert received new assignment via Socket.IO:', booking);
      fetchAssignedBookings();
    };

    const handleStatusChanged = (data: any) => {
      console.log('👨‍🔬 Expert received status update via Socket.IO:', data);
      if (data?.bookingId) {
        setAssignedVisits(prev => prev.map(b => b.id === data.bookingId ? { ...b, status: data.status } : b));
      }
    };

    socket.on('booking:new_assignment', handleNewBooking);
    socket.on('booking:status_changed', handleStatusChanged);

    return () => {
      socket.off('booking:new_assignment', handleNewBooking);
      socket.off('booking:status_changed', handleStatusChanged);
    };
  }, [fetchAssignedBookings]);

  const activeBooking = assignedVisits.find((v) => v.id === activeBookingId) || assignedVisits[0];

  // Sync form when active booking has an existing submitted report
  useEffect(() => {
    if (activeBooking?.inspectionReport) {
      const rep: any = activeBooking.inspectionReport;
      const sp = rep.soilParameters || rep;
      const wp = rep.waterParameters || rep;

      setSoilForm({
        pH: sp.ph != null ? sp.ph.toString() : '',
        nitrogenKgHa: sp.nitrogenKgHa != null ? sp.nitrogenKgHa.toString() : '',
        phosphorusKgHa: sp.phosphorusKgHa != null ? sp.phosphorusKgHa.toString() : '',
        potassiumKgHa: sp.potassiumKgHa != null ? sp.potassiumKgHa.toString() : '',
        organicCarbonPercent: sp.organicCarbonPercent != null ? sp.organicCarbonPercent.toString() : '',
        ecDsm: (sp.electricalConductivity != null ? sp.electricalConductivity : sp.ecDsm)?.toString() || '',
        soilTexture: sp.soilTexture || 'Medium Deep Black Clayey Loam',
        drainageClass: sp.drainageClass || 'Well Drained',
        waterTableDepthMeters: wp.waterTableDepthMeters != null ? wp.waterTableDepthMeters.toString() : '',
        waterQuality: wp.waterQuality || 'Potable & Optimal for Micro-Drip Irrigation',
        waterQualityTdsPpm: wp.waterQualityTdsPpm?.toString() || '',
        expertNotes: rep.agronomistSummary || '',
        recommendedCrops: rep.recommendedCrops?.join(', ') || ''
      });
      setIsReportSubmitted(true);
    } else {
      // Clear form for fresh real inspection
      setSoilForm({
        pH: '',
        nitrogenKgHa: '',
        phosphorusKgHa: '',
        potassiumKgHa: '',
        organicCarbonPercent: '',
        ecDsm: '',
        soilTexture: 'Medium Deep Black Clayey Loam',
        drainageClass: 'Well Drained',
        waterTableDepthMeters: '',
        waterQuality: 'Potable & Optimal for Micro-Drip Irrigation',
        waterQualityTdsPpm: '',
        expertNotes: '',
        recommendedCrops: ''
      });
      setIsReportSubmitted(false);
      setUploadedPhotos([]);
    }
  }, [activeBooking?.id, activeBooking?.inspectionReport]);

  // Strictly sequential next status handler
  const handleProgressToNextStatus = async (targetStatus: string) => {
    if (!activeBooking) return;
    try {
      const res = await fetch(apiUrl(`/api/experts/bookings/${activeBooking.id}/status`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: targetStatus })
      });
      if (res.ok) {
        setAssignedVisits(prev => prev.map(b => b.id === activeBooking.id ? { ...b, status: targetStatus as any } : b));
      }
    } catch (e) {
      console.warn('Status patch fallback:', e);
      setAssignedVisits(prev => prev.map(b => b.id === activeBooking.id ? { ...b, status: targetStatus as any } : b));
    }
  };

  // Submit empirical soil report
  const handleSubmitSoilReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBooking) return;
    setIsSubmitting(true);

    const certificateNo = `EXP-LAB-${Date.now().toString().slice(-6)}`;
    const phVal = parseFloat(soilForm.pH) || 7.0;
    const nVal = parseFloat(soilForm.nitrogenKgHa) || 0;
    const pVal = parseFloat(soilForm.phosphorusKgHa) || 0;
    const kVal = parseFloat(soilForm.potassiumKgHa) || 0;
    const ocVal = parseFloat(soilForm.organicCarbonPercent) || 0;
    const ecVal = parseFloat(soilForm.ecDsm) || 0;
    const wtVal = parseFloat(soilForm.waterTableDepthMeters) || 0;
    const crops = soilForm.recommendedCrops.split(',').map(s => s.trim()).filter(Boolean);

    const reportPayload = {
      labCertificateNo: certificateNo,
      expertName: 'Dr. Ramesh Patil (M.Sc. Soil Science & Agronomy)',
      ph: phVal,
      nitrogenKgHa: nVal,
      phosphorusKgHa: pVal,
      potassiumKgHa: kVal,
      organicCarbonPercent: ocVal,
      electricalConductivity: ecVal,
      soilTexture: soilForm.soilTexture,
      drainageClass: soilForm.drainageClass,
      waterTableDepthMeters: wtVal,
      waterQuality: soilForm.waterQuality,
      waterQualityTdsPpm: parseInt(soilForm.waterQualityTdsPpm) || 380,
      agronomistSummary: soilForm.expertNotes || 'Field inspection completed and empirical core samples recorded.',
      recommendedCrops: crops,
      soilHealthScore: 90,
      fieldPhotos: uploadedPhotos
    };

    try {
      const res = await fetch(apiUrl(`/api/experts/bookings/${activeBooking.id}/submit-report`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportPayload)
      });

      if (res.ok) {
        const json = await res.json();
        applyExpertReport(json.report);
      }

      const finalReport: ExpertInspectionReport = {
        reportId: 'REP-' + certificateNo,
        bookingId: activeBooking.id,
        submittedAt: new Date().toISOString(),
        labCertificateNo: certificateNo,
        expertName: 'Dr. Ramesh Patil (M.Sc. Soil Science & Agronomy)',
        soilParameters: {
          ph: phVal,
          nitrogenKgHa: nVal,
          phosphorusKgHa: pVal,
          potassiumKgHa: kVal,
          organicCarbonPercent: ocVal,
          electricalConductivity: ecVal,
          soilTexture: soilForm.soilTexture,
          drainageClass: 'Well Drained',
          soilHealthScore: 90
        },
        waterParameters: {
          waterSourceAvailable: true,
          sourceType: 'Borewell & Perennial Source',
          waterTableDepthMeters: wtVal,
          waterQuality: soilForm.waterQuality,
          waterQualityTdsPpm: 380
        },
        agronomistSummary: reportPayload.agronomistSummary,
        recommendedCrops: reportPayload.recommendedCrops,
        groundVerifiedBadge: true
      };

      setAssignedVisits(prev => prev.map(b => b.id === activeBooking.id ? { 
        ...b, 
        status: 'REPORT_READY' as const,
        inspectionReport: finalReport
      } : b));

      setIsReportSubmitted(true);
      confetti({ particleCount: 75, spread: 80, origin: { y: 0.6 } });
    } catch (err) {
      console.warn('Submit report error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Status Lifecycle Stages
  const stages = [
    { key: 'CONFIRMED', label: '1. Confirmed', nextStatus: 'EXPERT_ASSIGNED', nextActionText: 'Accept Assignment & Assign Expert' },
    { key: 'EXPERT_ASSIGNED', label: '2. Expert Assigned', nextStatus: 'ON_THE_WAY', nextActionText: 'Start Travel • Set Status "On The Way" 🚗' },
    { key: 'ON_THE_WAY', label: '3. On The Way', nextStatus: 'VISIT_COMPLETED', nextActionText: 'Mark Arrived & Complete Field Visit ✓' },
    { key: 'VISIT_COMPLETED', label: '4. Visit Completed', nextStatus: null, nextActionText: 'Enter Lab Assessment Data Below 🔬' },
    { key: 'REPORT_READY', label: '5. Report Ready', nextStatus: null, nextActionText: '✓ Inspection Report Published' }
  ];

  const currentStatus = activeBooking?.status || 'CONFIRMED';
  const currentStageIndex = stages.findIndex(s => s.key === currentStatus) >= 0 
    ? stages.findIndex(s => s.key === currentStatus) 
    : 0;

  const currentStageInfo = stages[currentStageIndex] || stages[0];
  const canEditForm = currentStatus === 'VISIT_COMPLETED' || currentStatus === 'REPORT_READY';

  return (
    <div className="space-y-6 font-sans pb-16 max-w-7xl mx-auto text-[#17211B]">
      
      {/* 1. EXPERT COMMAND HEADER */}
      <div className="bg-[#FFFFFF] p-4 sm:p-7 rounded-3xl border border-[#D5E1D9] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F5EC] border border-[#BDE3CC] flex items-center justify-center text-[#15803D] shrink-0 shadow-2xs">
            <UserCheck className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold font-mono text-[#166534] uppercase tracking-wider">
                EXPERT FIELD OPERATIONS PORTAL
              </span>
              <span className="px-2 py-0.2 rounded-full bg-[#E8F5EC] text-[#15803D] text-[10px] font-extrabold border border-[#BDE3CC] flex items-center gap-1">
                <BadgeCheck className="w-3 h-3" />
                <span>Verified Expert</span>
              </span>
            </div>
            <h1 className="font-extrabold text-xl sm:text-2xl text-[#17211B] tracking-tight">
              Dr. Ramesh Patil — Soil & Field Assessment Portal
            </h1>
            <p className="text-xs text-[#526358] font-medium">
              District Agricultural Division • Certified Field Inspector ID: EXP-MH-7041
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <button
            onClick={fetchAssignedBookings}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-xl bg-[#F8FBF9] hover:bg-white border border-[#D5E1D9] text-[#17211B] font-bold flex items-center gap-1.5 transition-all shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#15803D]' : 'text-[#64736A]'}`} />
            <span>Refresh Queue</span>
          </button>

          <span className="px-3.5 py-2 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B] font-bold">
            Queue: <strong>{assignedVisits.length} Assigned</strong>
          </span>

          <span className="px-3.5 py-2 rounded-xl bg-[#E8F5EC] text-[#166534] border border-[#BDE3CC] font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#15803D] animate-pulse"></span>
            <span>Real-Time Dispatch Live</span>
          </span>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE: ASSIGNED QUEUE (4 COLS) + ACTIVE WORKBENCH (8 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: ASSIGNED FIELD CHECKUPS QUEUE */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-extrabold text-xs text-[#17211B] uppercase tracking-wider">
              ASSIGNED FIELD VISITS
            </h3>
            <span className="text-xs font-bold text-[#15803D]">{assignedVisits.length} Bookings</span>
          </div>

          {assignedVisits.length === 0 ? (
            <div className="p-8 rounded-3xl bg-[#FFFFFF] border border-[#D5E1D9] text-center space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#E8F5EC] text-[#15803D] flex items-center justify-center text-xl mx-auto">
                📋
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-[#17211B]">No Visits in Queue</h4>
                <p className="text-xs text-[#526358] leading-relaxed">
                  No active field checkups currently assigned in database. New bookings from premium landowners will appear here via Socket.IO in real time.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              {assignedVisits.map((visit) => {
                const isSelected = activeBooking?.id === visit.id;
                return (
                  <div
                    key={visit.id}
                    onClick={() => setActiveBookingId(visit.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-[#E8F5EC] border-[#15803D] shadow-sm ring-1 ring-[#15803D]'
                        : 'bg-[#FFFFFF] hover:bg-[#F8FBF9] border-[#D5E1D9] shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[#17211B] text-sm truncate max-w-[170px]">
                        {visit.userName}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black border ${
                        visit.status === 'REPORT_READY'
                          ? 'bg-emerald-100 text-[#15803D] border-[#BDE3CC]'
                          : visit.status === 'VISIT_COMPLETED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : visit.status === 'ON_THE_WAY'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {visit.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#526358] font-medium flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-[#15803D] shrink-0" />
                      <span className="truncate">{visit.locationAddress}</span>
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-[#64736A] border-t border-[#D5E1D9] pt-2 font-semibold">
                      <span>{visit.scheduledDate} • {visit.scheduledTime}</span>
                      <span className="text-[#15803D] font-bold">
                        ₹{visit.priceRupees || 1499}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: ACTIVE ASSIGNMENT WORKBENCH */}
        {activeBooking ? (
          <div className="lg:col-span-8 space-y-5">
            
            {/* 2.1 ACTIVE VISIT CARD & REAL-TIME STATUS CONTROLLER */}
            <div className="bg-[#FFFFFF] p-4 sm:p-7 rounded-3xl border border-[#D5E1D9] shadow-sm space-y-5">
              
              {/* Header with GPS Link */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D5E1D9] pb-4">
                <div>
                  <span className="text-[10px] font-extrabold text-[#166534] uppercase tracking-wider block">
                    ACTIVE FIELD ASSIGNMENT WORKBENCH
                  </span>
                  <h2 className="font-extrabold text-xl text-[#17211B] mt-0.5">
                    {activeBooking.userName} — {activeBooking.parcelName}
                  </h2>
                </div>
                
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${activeBooking.locationCoordinates?.[1] || selectedParcel.lat},${activeBooking.locationCoordinates?.[0] || selectedParcel.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-extrabold text-xs uppercase flex items-center gap-1.5 transition-all shadow-xs self-start sm:self-auto"
                >
                  <Compass className="w-4 h-4" />
                  <span>GPS Navigate to Land</span>
                  <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                </a>
              </div>

              {/* Sequential 5-Stage Status Controller */}
              <div className="bg-[#F8FBF9] p-4 sm:p-5 rounded-2xl border border-[#D5E1D9] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#17211B] uppercase tracking-wider">
                    Sequential Inspection Workflow:
                  </span>
                  <span className="text-xs font-extrabold text-[#15803D] bg-[#E8F5EC] px-2.5 py-0.5 rounded-full border border-[#BDE3CC]">
                    Current Status: {currentStatus.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Timeline Pill Stepper */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {stages.map((stage, idx) => {
                    const isPast = idx < currentStageIndex;
                    const isCurrent = idx === currentStageIndex;

                    return (
                      <div
                        key={stage.key}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          isCurrent
                            ? 'border-[#15803D] bg-[#E8F5EC] text-[#15803D] font-black shadow-xs ring-1 ring-[#15803D]'
                            : isPast
                            ? 'border-[#BDE3CC] bg-white text-[#166534] font-bold'
                            : 'border-[#D5E1D9] bg-white text-[#9AA5A0] font-semibold'
                        }`}
                      >
                        <div className="text-[10px] uppercase tracking-tight">{stage.label}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Contextual Single Next-Action Button */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#D5E1D9]">
                  <div className="text-xs text-[#526358] font-medium flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-[#15803D]" />
                    <span>Updating status broadcasts in real time to the landowner's dashboard via Socket.IO.</span>
                  </div>

                  {currentStageInfo.nextStatus ? (
                    <button
                      type="button"
                      onClick={() => handleProgressToNextStatus(currentStageInfo.nextStatus!)}
                      className="px-5 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-extrabold text-xs uppercase tracking-wider shadow-xs flex items-center justify-center gap-2 transition-all shrink-0"
                    >
                      <span>{currentStageInfo.nextActionText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : currentStatus === 'VISIT_COMPLETED' ? (
                    <span className="text-xs font-extrabold text-[#15803D] bg-emerald-50 px-3 py-1.5 rounded-lg border border-[#BDE3CC]">
                      🔬 Ready for Empirical Lab Data Entry Below
                    </span>
                  ) : (
                    <span className="text-xs font-extrabold text-[#15803D] bg-[#E8F5EC] px-3 py-1.5 rounded-lg border border-[#BDE3CC] flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Report Published & Synchronized</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Parcel & Schedule Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs text-[#526358] font-semibold">
                <div className="p-3 rounded-2xl bg-[#F8FBF9] border border-[#D5E1D9]">
                  <span className="text-[10px] text-[#64736A] block uppercase font-bold">Service Type</span>
                  <span className="font-extrabold text-[#17211B] text-xs truncate block" title={activeBooking.serviceType}>
                    {activeBooking.serviceType}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-[#F8FBF9] border border-[#D5E1D9]">
                  <span className="text-[10px] text-[#64736A] block uppercase font-bold">Appointment</span>
                  <span className="font-extrabold text-[#17211B] text-xs">
                    {activeBooking.scheduledDate} • {activeBooking.scheduledTime}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-[#F8FBF9] border border-[#D5E1D9]">
                  <span className="text-[10px] text-[#64736A] block uppercase font-bold">Coordinates</span>
                  <span className="font-mono font-bold text-[#166534] text-xs">
                    {activeBooking.locationCoordinates ? `${activeBooking.locationCoordinates[1].toFixed(4)}°N, ${activeBooking.locationCoordinates[0].toFixed(4)}°E` : 'Pending'}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-[#E8F5EC] border border-[#BDE3CC]">
                  <span className="text-[10px] text-[#166534] block uppercase font-bold">Payment Status</span>
                  <span className="font-extrabold text-[#15803D] text-xs">
                    PAID (₹{activeBooking.priceRupees || 1499})
                  </span>
                </div>
              </div>

              {/* Landowner Notes (if any) */}
              {activeBooking.userNotes && (
                <div className="p-3 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-xs">
                  <span className="font-bold text-[#17211B]">Landowner Instructions: </span>
                  <span className="text-[#526358]">{activeBooking.userNotes}</span>
                </div>
              )}

            </div>

            {/* 2.2 PHYSICAL SOIL & WATER LAB ASSESSMENT FORM */}
            <form onSubmit={handleSubmitSoilReport} className="bg-[#FFFFFF] p-4 sm:p-7 rounded-3xl border border-[#D5E1D9] space-y-5 shadow-sm">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D5E1D9] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#E8F5EC] border border-[#BDE3CC] text-[#15803D] flex items-center justify-center font-bold">
                    <TestTube className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-[#17211B] uppercase tracking-wider">
                      Physical Soil & Water Lab Assessment Form
                    </h3>
                    <p className="text-[11px] text-[#526358] font-medium">
                      Empirical field test entry — updates Land Dossier with ground truth
                    </p>
                  </div>
                </div>
              </div>

              {/* Locked Notice if Visit Not Completed */}
              {!canEditForm && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <strong className="block font-bold">Lab Form Locked</strong>
                    <span>Complete the physical visit and sample collection above before entering empirical laboratory parameters.</span>
                  </div>
                </div>
              )}

              {/* Form Input Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-semibold">
                <div>
                  <label className="text-xs text-[#17211B] block mb-1 font-bold">
                    SOIL pH (Acidity / Alkalinity)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    disabled={!canEditForm || currentStatus === 'REPORT_READY'}
                    value={soilForm.pH}
                    onChange={(e) => setSoilForm({ ...soilForm, pH: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B] font-bold focus:border-[#15803D] outline-none text-xs disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Enter test pH"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-[#17211B] block mb-1 font-bold">
                    NITROGEN (N, kg/ha)
                  </label>
                  <input
                    type="number"
                    disabled={!canEditForm || currentStatus === 'REPORT_READY'}
                    value={soilForm.nitrogenKgHa}
                    onChange={(e) => setSoilForm({ ...soilForm, nitrogenKgHa: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B] font-bold focus:border-[#15803D] outline-none text-xs disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Enter N kg/ha"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-[#17211B] block mb-1 font-bold">
                    PHOSPHORUS (P, kg/ha)
                  </label>
                  <input
                    type="number"
                    disabled={!canEditForm || currentStatus === 'REPORT_READY'}
                    value={soilForm.phosphorusKgHa}
                    onChange={(e) => setSoilForm({ ...soilForm, phosphorusKgHa: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B] font-bold focus:border-[#15803D] outline-none text-xs disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Enter P kg/ha"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-[#17211B] block mb-1 font-bold">
                    POTASSIUM (K, kg/ha)
                  </label>
                  <input
                    type="number"
                    disabled={!canEditForm || currentStatus === 'REPORT_READY'}
                    value={soilForm.potassiumKgHa}
                    onChange={(e) => setSoilForm({ ...soilForm, potassiumKgHa: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B] font-bold focus:border-[#15803D] outline-none text-xs disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Enter K kg/ha"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-[#17211B] block mb-1 font-bold">
                    ORGANIC CARBON (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    disabled={!canEditForm || currentStatus === 'REPORT_READY'}
                    value={soilForm.organicCarbonPercent}
                    onChange={(e) => setSoilForm({ ...soilForm, organicCarbonPercent: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B] font-bold focus:border-[#15803D] outline-none text-xs disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Enter OC %"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-[#17211B] block mb-1 font-bold">
                    ELECTRICAL COND. (dS/m)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    disabled={!canEditForm || currentStatus === 'REPORT_READY'}
                    value={soilForm.ecDsm}
                    onChange={(e) => setSoilForm({ ...soilForm, ecDsm: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B] font-bold focus:border-[#15803D] outline-none text-xs disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Enter EC dS/m"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-[#17211B] block mb-1 font-bold">
                    WATER TABLE DEPTH (m)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    disabled={!canEditForm || currentStatus === 'REPORT_READY'}
                    value={soilForm.waterTableDepthMeters}
                    onChange={(e) => setSoilForm({ ...soilForm, waterTableDepthMeters: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B] font-bold focus:border-[#15803D] outline-none text-xs disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Enter depth (m)"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-[#17211B] block mb-1 font-bold">
                    SOIL TEXTURE
                  </label>
                  <select
                    disabled={!canEditForm || currentStatus === 'REPORT_READY'}
                    value={soilForm.soilTexture}
                    onChange={(e) => setSoilForm({ ...soilForm, soilTexture: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B] font-bold focus:border-[#15803D] outline-none text-xs disabled:bg-gray-50"
                  >
                    <option value="Medium Deep Black Clayey Loam">Medium Deep Black Clayey Loam</option>
                    <option value="Sandy Loam">Sandy Loam</option>
                    <option value="Red Laterite Loam">Red Laterite Loam</option>
                    <option value="Alluvial Silt Loam">Alluvial Silt Loam</option>
                  </select>
                </div>
              </div>

              {/* Water Observation & Recommended Crops */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-semibold">
                <div>
                  <label className="text-xs text-[#17211B] block mb-1 font-bold">
                    WATER QUALITY & POTABILITY
                  </label>
                  <input
                    type="text"
                    disabled={!canEditForm || currentStatus === 'REPORT_READY'}
                    value={soilForm.waterQuality}
                    onChange={(e) => setSoilForm({ ...soilForm, waterQuality: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B] font-bold focus:border-[#15803D] outline-none text-xs disabled:bg-gray-50"
                    placeholder="e.g. Potable & Optimal for Micro-Drip Irrigation"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#17211B] block mb-1 font-bold">
                    RECOMMENDED CROPS (Comma separated)
                  </label>
                  <input
                    type="text"
                    disabled={!canEditForm || currentStatus === 'REPORT_READY'}
                    value={soilForm.recommendedCrops}
                    onChange={(e) => setSoilForm({ ...soilForm, recommendedCrops: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B] font-bold focus:border-[#15803D] outline-none text-xs disabled:bg-gray-50"
                    placeholder="e.g. Pomegranate, Red Onion, Guava"
                  />
                </div>
              </div>

              {/* Expert Field Assessment & Recommendations */}
              <div className="space-y-1.5">
                <label className="text-xs text-[#17211B] uppercase block font-bold">
                  Expert Field Assessment & Recommendations
                </label>
                <textarea
                  rows={3}
                  disabled={!canEditForm || currentStatus === 'REPORT_READY'}
                  value={soilForm.expertNotes}
                  onChange={(e) => setSoilForm({ ...soilForm, expertNotes: e.target.value })}
                  placeholder="Enter physical observations on soil structure, water drainage, micro-nutrients, and crop suitability recommendations..."
                  className="w-full p-3.5 rounded-2xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B] text-xs leading-relaxed focus:border-[#15803D] outline-none font-medium disabled:bg-gray-50"
                  required
                />
              </div>

              {/* Field Photos Attachment */}
              <div className="space-y-2">
                <label className="text-xs text-[#17211B] uppercase block font-bold flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#15803D]" />
                  <span>On-Ground Field Photos & Core Samples</span>
                </label>

                {uploadedPhotos.length > 0 ? (
                  <div className="flex flex-wrap gap-2.5">
                    {uploadedPhotos.map((url, idx) => (
                      <div key={idx} className="relative rounded-xl overflow-hidden border border-[#D5E1D9] w-24 h-20 shadow-xs">
                        <img src={url} alt={`Sample ${idx + 1}`} className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] px-1 rounded font-mono">
                          Photo {idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-[#F8FBF9] border border-dashed border-[#D5E1D9] text-center text-[11px] text-[#64736A]">
                    No field photos attached.
                  </div>
                )}
              </div>

              {/* Submit CTA or Issued Banner */}
              {currentStatus === 'REPORT_READY' ? (
                <div className="p-4 rounded-2xl bg-[#E8F5EC] border border-[#BDE3CC] flex items-center justify-between text-xs text-[#166534]">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[#15803D] shrink-0" />
                    <div>
                      <span className="font-extrabold text-[#17211B] block">Official Lab Report Issued & Linked!</span>
                      <span>Certificate #{activeBooking.inspectionReport?.labCertificateNo || 'EXP-LAB-VERIFIED'} is active on Landowner's Dossier.</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-white text-[#15803D] font-mono font-bold rounded-lg border border-[#BDE3CC]">
                    100% Ground Verified
                  </span>
                </div>
              ) : (
                <div className="pt-3 border-t border-[#D5E1D9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-[#526358] font-semibold">
                    <ShieldCheck className="w-4 h-4 text-[#15803D] shrink-0" />
                    <span>Submitting report publishes ground-truth data and recalibrates Land Dossier in real time.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={!canEditForm || isSubmitting}
                    className="px-6 py-3 rounded-2xl bg-[#15803D] hover:bg-[#166534] text-white font-extrabold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                  >
                    {isSubmitting ? (
                      <span>Transmitting Verified Report...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit & Issue Ground-Verified Report</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>

          </div>
        ) : null}

      </div>

    </div>
  );
};
