import React, { useState } from 'react';
import { 
  Layers, 
  Sparkles, 
  MapPin, 
  Play, 
  Clock, 
  Compass, 
  Camera, 
  FileSpreadsheet, 
  ShieldCheck, 
  Activity, 
  Satellite, 
  Sun, 
  Database 
} from 'lucide-react';
import { useLand } from '../context/LandContext';
import { MapContainer } from '../components/MapContainer';
import { LandIdentityCard } from '../components/LandIdentityCard';
import { RecommendationDeck } from '../components/RecommendationDeck';
import { FutureSimulationViewer } from '../components/FutureSimulationViewer';
import { ActionPlan } from '../components/ActionPlan';
import { OccupancyAssessment } from '../components/OccupancyAssessment';
import { LandActivityTimeline } from '../components/LandActivityTimeline';
import { SurroundingIntelligence } from '../components/SurroundingIntelligence';
import { LandPhotoAnalysis } from '../components/LandPhotoAnalysis';
import { GovernmentSchemeMatcher } from '../components/GovernmentSchemeMatcher';
import { DataConfidenceBadge } from '../components/DataConfidenceBadge';
import { SihDemoSimulationBar } from '../components/SihDemoSimulationBar';
import { PremiumUpgradeModal } from '../components/PremiumUpgradeModal';
import { ExpertReportModal } from '../components/ExpertReportModal';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { selectedParcel, activeBooking, bookingsList, setIsReportModalOpen } = useLand();
  const navigate = useNavigate();
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'overview' | 'futureSim' | 'schemes' | 'timeline' | 'surroundings' | 'photo' | 'actionPlan' | 'bookings'>('overview');

  return (
    <div className="space-y-6 pb-16 font-sans">
      
      {/* SIH Judge Demo Simulation Bar */}
      <SihDemoSimulationBar />

      {/* Live Expert Checkup Status Banner (When Booked) */}
      {activeBooking && (
        <div className="bg-gradient-to-r from-[#14532D] via-[#15803D] to-[#22C55E] text-white p-4 sm:p-5 rounded-3xl shadow-md border border-emerald-400/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-xl shrink-0">
              🔔
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-200">
                  EXPERT LAND CHECKUP ACTIVE
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white text-[#15803D] text-[10px] font-extrabold">
                  {activeBooking.status.replace(/_/g, ' ')}
                </span>
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-white mt-0.5">
                {activeBooking.assignedExpert.name} is assigned to inspect {selectedParcel.name}
              </h3>
              <p className="text-xs text-emerald-100">
                Scheduled Date: <strong>{activeBooking.scheduledDate}</strong> • Location: <strong>{activeBooking.locationAddress}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            {activeBooking.status === 'REPORT_READY' ? (
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-white text-[#15803D] font-extrabold text-xs flex items-center gap-1.5 shadow-sm hover:bg-emerald-50 transition-all"
              >
                <span>View Lab Report & Re-Analyze</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/experts')}
                className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all"
              >
                <span>Track Live Status ➔</span>
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* 1. WORKSPACE NAVIGATION TABS */}
      <div className="bg-[#FFFFFF] p-2 rounded-2xl flex items-center justify-between gap-2 overflow-x-auto text-xs font-bold border border-[#D5E1D9] shadow-sm">
        <div className="flex items-center gap-1.5 min-w-max">
          <button
            onClick={() => setActiveWorkspaceTab('overview')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 text-xs uppercase font-bold ${
              activeWorkspaceTab === 'overview'
                ? 'bg-[#15803D] text-white shadow-sm'
                : 'text-[#17211B] hover:text-[#166534] hover:bg-[#E8F5EC]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>🗺️ GIS Map & Recommendation</span>
          </button>

          <button
            onClick={() => setActiveWorkspaceTab('futureSim')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 text-xs uppercase font-bold ${
              activeWorkspaceTab === 'futureSim'
                ? 'bg-[#15803D] text-white shadow-sm'
                : 'text-[#166534] hover:bg-[#E8F5EC] border border-[#BDE3CC]'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>▶️ 3D Future Simulation</span>
          </button>

          <button
            onClick={() => setActiveWorkspaceTab('schemes')}
            className={`px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 text-xs uppercase font-bold ${
              activeWorkspaceTab === 'schemes'
                ? 'bg-[#15803D] text-white shadow-sm'
                : 'text-[#17211B] hover:text-[#166534] hover:bg-[#E8F5EC]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>🏛️ Government Schemes</span>
          </button>

          <button
            onClick={() => setActiveWorkspaceTab('timeline')}
            className={`px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 text-xs uppercase font-bold ${
              activeWorkspaceTab === 'timeline'
                ? 'bg-[#15803D] text-white shadow-sm'
                : 'text-[#17211B] hover:text-[#166534] hover:bg-[#E8F5EC]'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>🕐 Land History</span>
          </button>

          <button
            onClick={() => setActiveWorkspaceTab('surroundings')}
            className={`px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 text-xs uppercase font-bold ${
              activeWorkspaceTab === 'surroundings'
                ? 'bg-[#15803D] text-white shadow-sm'
                : 'text-[#17211B] hover:text-[#166534] hover:bg-[#E8F5EC]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>🏭 What's Around?</span>
          </button>

          <button
            onClick={() => setActiveWorkspaceTab('photo')}
            className={`px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 text-xs uppercase font-bold ${
              activeWorkspaceTab === 'photo'
                ? 'bg-[#15803D] text-white shadow-sm'
                : 'text-[#17211B] hover:text-[#166534] hover:bg-[#E8F5EC]'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>📸 Photo Scan</span>
          </button>

          <button
            onClick={() => setActiveWorkspaceTab('bookings')}
            className={`px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 text-xs uppercase font-bold ${
              activeWorkspaceTab === 'bookings'
                ? 'bg-[#15803D] text-white shadow-sm'
                : 'text-[#17211B] hover:text-[#166534] hover:bg-[#E8F5EC]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>📋 Bookings & Reports</span>
          </button>

          <button
            onClick={() => setActiveWorkspaceTab('actionPlan')}
            className={`px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 text-xs uppercase font-bold ${
              activeWorkspaceTab === 'actionPlan'
                ? 'bg-[#15803D] text-white shadow-sm'
                : 'text-[#17211B] hover:text-[#166534] hover:bg-[#E8F5EC]'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>📄 Action Plan</span>
          </button>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE CONTENT */}
      
      {/* WORKSPACE 1: MAIN OVERVIEW (MAP + UNIFIED RECOMMENDATION) */}
      {activeWorkspaceTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Real High-Resolution GIS Map Section */}
          <div className="space-y-4">
            <MapContainer />
            <OccupancyAssessment occupancy={selectedParcel.currentOccupancy} />
          </div>

          {/* Unified AI Land Recommendation Panel */}
          <div id="recommendations">
            <RecommendationDeck onSeeFuture={() => setActiveWorkspaceTab('futureSim')} onOpenActionPlan={() => setActiveWorkspaceTab('actionPlan')} />
          </div>

          {/* Data Sources & Trust Strip */}
          <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#D5E1D9] shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#17211B]">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#15803D]" />
              <span className="font-bold text-[#17211B]">DATA SOURCES & AUDIT:</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1 text-[#17211B]">
                🛰️ <strong className="text-[#166534]">Satellite:</strong> Latest available orthophoto (2026-08-28)
              </span>
              <span className="flex items-center gap-1 text-[#17211B]">
                🌦️ <strong className="text-[#166534]">Weather:</strong> Live • Updated 5 min ago
              </span>
              <span className="flex items-center gap-1 text-[#17211B]">
                🏛️ <strong className="text-[#166534]">Schemes:</strong> Verified Ministry Database
              </span>
              <span className="flex items-center gap-1 text-[#17211B]">
                🌱 <strong className="text-[#166534]">Soil Lab:</strong> Verified pH 7.1
              </span>
            </div>
          </div>
        </div>
      )}

      {/* WORKSPACE 2: 3D FUTURE SIMULATION */}
      {activeWorkspaceTab === 'futureSim' && (
        <div className="space-y-4">
          <FutureSimulationViewer />
        </div>
      )}

      {/* WORKSPACE 3: GOVERNMENT SCHEMES */}
      {activeWorkspaceTab === 'schemes' && (
        <div className="space-y-4">
          <GovernmentSchemeMatcher />
        </div>
      )}

      {/* WORKSPACE 4: LAND ACTIVITY TIMELINE */}
      {activeWorkspaceTab === 'timeline' && (
        <div className="space-y-4">
          <LandActivityTimeline timeline={selectedParcel.historicalTimeline} />
          <MapContainer />
        </div>
      )}

      {/* WORKSPACE 5: SURROUNDINGS */}
      {activeWorkspaceTab === 'surroundings' && (
        <div className="space-y-4">
          <SurroundingIntelligence features={selectedParcel.surroundingFeatures} />
          <MapContainer />
        </div>
      )}

      {/* WORKSPACE 6: PHOTO SCAN */}
      {activeWorkspaceTab === 'photo' && (
        <div className="space-y-4">
          <LandPhotoAnalysis />
          <OccupancyAssessment occupancy={selectedParcel.currentOccupancy} />
        </div>
      )}

      {/* WORKSPACE 7: ACTION PLAN */}
      {activeWorkspaceTab === 'actionPlan' && (
        <div className="space-y-4">
          <ActionPlan />
        </div>
      )}

      {/* WORKSPACE 8: EXPERT BOOKINGS & COMPLETED REPORTS */}
      {activeWorkspaceTab === 'bookings' && (
        <div className="space-y-6">
          <div className="bg-[#FFFFFF] p-6 sm:p-7 rounded-3xl border border-[#D5E1D9] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F5EC] text-[#15803D] flex items-center justify-center text-xl shrink-0 shadow-2xs">
                📋
              </div>
              <div>
                <span className="text-xs font-extrabold text-[#166534] uppercase tracking-wider block">
                  PHYSICAL VERIFICATION RECORDS
                </span>
                <h2 className="font-extrabold text-xl sm:text-2xl text-[#17211B] mt-0.5">
                  Expert Checkups & Inspection Reports
                </h2>
                <p className="text-xs text-[#526358]">
                  Track on-ground visits by certified agronomists and view verified soil lab reports.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/expert-checkup')}
              className="px-5 py-3 rounded-2xl bg-[#15803D] hover:bg-[#166534] text-white text-xs font-extrabold flex items-center gap-2 transition-all shadow-md self-start md:self-auto"
            >
              <span>+ Book New Expert Checkup</span>
            </button>
          </div>

          {/* Bookings List */}
          {bookingsList.length > 0 ? (
            <div className="space-y-4">
              {bookingsList.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#D5E1D9] shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D5E1D9] pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-[#15803D] uppercase">
                          {booking.serviceType}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                          booking.status === 'REPORT_READY'
                            ? 'bg-[#E8F5EC] text-[#15803D] border-[#BDE3CC]'
                            : booking.status === 'ON_THE_WAY'
                            ? 'bg-[#E0F2FE] text-[#075985] border-[#BAE6FD]'
                            : 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]'
                        }`}>
                          {booking.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <h3 className="text-lg font-extrabold text-[#17211B] mt-1">
                        {booking.parcelName}
                      </h3>
                      <p className="text-xs text-[#526358]">
                        📍 {booking.locationAddress}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <span className="text-xs text-[#64736A] block">Scheduled Appointment</span>
                      <span className="font-extrabold text-sm text-[#17211B]">
                        {booking.scheduledDate} • {booking.scheduledTime}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-[#F8FBF9] border border-[#D5E1D9]">
                      <span className="text-[10px] uppercase font-bold text-[#64736A] block">Assigned Expert</span>
                      <span className="font-bold text-[#17211B]">{booking.assignedExpert.name}</span>
                      <span className="text-[11px] text-[#526358] block">{booking.assignedExpert.qualification}</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#F8FBF9] border border-[#D5E1D9]">
                      <span className="text-[10px] uppercase font-bold text-[#64736A] block">Payment Mode</span>
                      <span className="font-bold text-[#15803D]">₹{booking.priceRupees} (Verified)</span>
                      <span className="text-[11px] text-[#526358] block">{booking.paymentMethod}</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#F8FBF9] border border-[#D5E1D9]">
                      <span className="text-[10px] uppercase font-bold text-[#64736A] block">Inspection Status</span>
                      <span className="font-bold text-[#17211B]">
                        {booking.status === 'REPORT_READY' ? '✓ Physical Lab Report Ready' : 'Field Inspection In Progress'}
                      </span>
                    </div>
                  </div>

                  {booking.status === 'REPORT_READY' && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => setIsReportModalOpen(true)}
                        className="px-5 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-extrabold text-xs flex items-center gap-2 shadow-xs transition-all"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>View Verified Lab Report</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#FFFFFF] p-12 rounded-3xl border border-[#D5E1D9] text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#E8F5EC] text-[#15803D] flex items-center justify-center mx-auto text-2xl">
                🌱
              </div>
              <h3 className="text-lg font-extrabold text-[#17211B]">No Field Inspections Booked Yet</h3>
              <p className="text-xs text-[#526358] max-w-md mx-auto leading-relaxed">
                Book a physical on-ground soil and land checkup with a certified agronomist to get lab-tested N-P-K readings and unlock the “Ground-Verified” certification badge.
              </p>
              <button
                onClick={() => navigate('/expert-checkup')}
                className="mt-2 px-6 py-3 rounded-2xl bg-[#15803D] hover:bg-[#166534] text-white font-extrabold text-xs shadow-md transition-all inline-flex items-center gap-2"
              >
                <span>Book Expert Land Checkup</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Premium & Report Modals */}
      <PremiumUpgradeModal />
      <ExpertReportModal />
    </div>
  );
};
