import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LandProvider } from './context/LandContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppShell } from './components/AppShell';

// Pages
import { Overview } from './pages/Overview';
import { Dashboard } from './pages/Dashboard';
import { Onboarding } from './pages/Onboarding';
import { SchemesMatcher } from './pages/SchemesMatcher';
import { AgricultureHub } from './pages/AgricultureHub';
import { SoilWaterCenter } from './pages/SoilWaterCenter';
import { FuturePotential } from './pages/FuturePotential';
import { GovDashboard } from './pages/GovDashboard';
import { ExpertConnect } from './pages/ExpertConnect';
import { ExpertDashboard } from './pages/ExpertDashboard';
import { DeveloperDashboard } from './pages/DeveloperDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Login } from './pages/Login';
import { UserGuide } from './pages/UserGuide';
import { Pricing } from './pages/Pricing';
import { ExpertCheckup } from './pages/ExpertCheckup';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <LandProvider>
        <AppShell>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Overview />} />
            <Route path="/login" element={<Login />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/premium" element={<Pricing />} />

            {/* 1. LANDOWNER / FARMER WORKSPACE */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['landowner', 'farmer', 'admin']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expert-checkup"
              element={
                <ProtectedRoute allowedRoles={['landowner', 'farmer', 'soilExpert', 'admin']}>
                  <ExpertCheckup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute allowedRoles={['landowner', 'farmer', 'admin']}>
                  <Onboarding />
                </ProtectedRoute>
              }
            />

            {/* 2. GOVERNMENT AUTHORITY WORKSPACE */}
            <Route
              path="/government"
              element={
                <ProtectedRoute allowedRoles={['government', 'admin']}>
                  <GovDashboard />
                </ProtectedRoute>
              }
            />

            {/* 3. SOIL & LAND EXPERT WORKSPACE */}
            <Route
              path="/expert"
              element={
                <ProtectedRoute allowedRoles={['soilExpert', 'admin']}>
                  <ExpertDashboard />
                </ProtectedRoute>
              }
            />

            {/* 4. DEVELOPER & INVESTOR WORKSPACE */}
            <Route
              path="/developer"
              element={
                <ProtectedRoute allowedRoles={['developer', 'admin']}>
                  <DeveloperDashboard />
                </ProtectedRoute>
              }
            />

            {/* 5. ROOT PLATFORM ADMIN WORKSPACE */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* ROLE-AWARE VALUE MODULES */}
            <Route
              path="/schemes"
              element={
                <ProtectedRoute allowedRoles={['landowner', 'farmer', 'developer', 'government', 'admin']}>
                  <SchemesMatcher />
                </ProtectedRoute>
              }
            />
            <Route
              path="/agriculture"
              element={
                <ProtectedRoute allowedRoles={['landowner', 'farmer', 'soilExpert', 'admin']}>
                  <AgricultureHub />
                </ProtectedRoute>
              }
            />
            <Route
              path="/soil-water"
              element={
                <ProtectedRoute allowedRoles={['landowner', 'farmer', 'soilExpert', 'admin']}>
                  <SoilWaterCenter />
                </ProtectedRoute>
              }
            />
            <Route
              path="/future-potential"
              element={
                <ProtectedRoute allowedRoles={['landowner', 'farmer', 'government', 'developer', 'admin']}>
                  <FuturePotential />
                </ProtectedRoute>
              }
            />
            <Route
              path="/experts"
              element={
                <ProtectedRoute allowedRoles={['landowner', 'farmer', 'admin']}>
                  <ExpertConnect />
                </ProtectedRoute>
              }
            />

            {/* Dynamic Role-Aware User Guide */}
            <Route
              path="/guide"
              element={
                <ProtectedRoute>
                  <UserGuide />
                </ProtectedRoute>
              }
            />

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
      </LandProvider>
    </AuthProvider>
  );
};

export default App;
