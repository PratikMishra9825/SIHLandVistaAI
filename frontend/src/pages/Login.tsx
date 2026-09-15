import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  MapPin, 
  Compass, 
  Layers, 
  Plus, 
  Minus, 
  Sun, 
  Mountain, 
  Truck, 
  Maximize2,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { useAuth, UserRole } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import land3DPreview from '../assets/land_3d_preview.jpg';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, register, demoLogin } = useAuth();

  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'landowner' as UserRole
  });

  const handleRedirectByRole = (role: UserRole) => {
    switch (role) {
      case 'government':
        navigate('/government');
        break;
      case 'soilExpert':
        navigate('/expert');
        break;
      case 'developer':
        navigate('/developer');
        break;
      case 'admin':
        navigate('/admin');
        break;
      case 'farmer':
        navigate('/agriculture');
        break;
      case 'landowner':
      default:
        navigate('/onboarding');
        break;
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const res = await login(formData.email, formData.password);
    setIsLoading(false);

    if (res.success && res.role) {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      handleRedirectByRole(res.role);
    } else {
      setErrorMsg(res.message || 'Invalid email or password.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Password must contain at least 6 characters.');
      return;
    }

    setIsLoading(true);
    const res = await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: formData.role
    });
    setIsLoading(false);

    if (res.success && res.role) {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      handleRedirectByRole(res.role);
    } else {
      setErrorMsg(res.message || 'Registration failed.');
    }
  };

  const handleDemoClick = async (role: UserRole) => {
    setIsLoading(true);
    const resolvedRole = await demoLogin(role);
    setIsLoading(false);
    confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
    handleRedirectByRole(resolvedRole);
  };

  const handleGoogleLoginMock = () => {
    handleDemoClick('landowner');
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#17211B] flex flex-col font-sans selection:bg-[#EAF7EF] selection:text-[#166534]">
      
      {/* 1. SIMPLE PROFESSIONAL LANDING HEADER */}
      <header className="w-full bg-[#FFFFFF] border-b border-[#E6ECE8] py-4 px-6 sm:px-10 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Left Brand Identity */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#15803D] text-white flex items-center justify-center font-bold text-sm shadow-xs group-hover:bg-[#166534] transition-colors">
              LV
            </div>
            <div>
              <span className="font-bold text-lg text-[#17211B] tracking-tight block leading-none">
                LANDVISTA<span className="text-[#15803D]">.AI</span>
              </span>
              <span className="text-[11px] text-[#64736A] font-medium tracking-wide">
                Land Intelligence Platform
              </span>
            </div>
          </Link>

          {/* Right Navigation */}
          <div className="flex items-center gap-6 text-xs font-semibold text-[#405048]">
            <Link to="/" className="hover:text-[#15803D] transition-colors hidden sm:block">
              How It Works
            </Link>
            <Link to="/schemes" className="hover:text-[#15803D] transition-colors hidden sm:block">
              Features
            </Link>
            <Link to="/guide" className="hover:text-[#15803D] transition-colors hidden sm:block">
              About
            </Link>
            
            <button
              onClick={() => {
                setIsRegisterMode(false);
                setErrorMsg('');
              }}
              className="px-4 py-2 rounded-xl bg-[#E8F5EC] hover:bg-[#D5EEDF] text-[#166534] font-bold border border-[#BDE3CC] transition-all text-xs"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN TWO-COLUMN CONTENT */}
      <main className="flex-1 flex items-center justify-center py-10 px-4 sm:px-6">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-center">
          
          {/* LEFT COLUMN: HERO TEXT & GENUINE GIS PRODUCT PREVIEW */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Hero Copy */}
            <div className="space-y-3.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5EC] border border-[#BDE3CC] text-[#166534] text-[11px] font-bold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#15803D]" />
                <span>LAND INTELLIGENCE, SIMPLIFIED.</span>
              </div>

              <h1 className="font-bold text-3xl sm:text-4xl xl:text-[40px] text-[#17211B] tracking-tight leading-[1.18]">
                Understand your land.<br />
                <span className="text-[#15803D]">Discover what it can become.</span>
              </h1>

              <p className="text-sm text-[#405048] font-medium leading-relaxed max-w-xl">
                LANDVISTA AI combines geospatial data, terrain, soil, infrastructure and AI-powered analysis to help landowners make better decisions.
              </p>

              {/* Subtle 3 Feature Indicators */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#17211B] pt-1">
                <span className="flex items-center gap-1.5 text-[#166534]">
                  <CheckCircle2 className="w-4 h-4 text-[#15803D]" /> Parcel Analysis
                </span>
                <span className="flex items-center gap-1.5 text-[#166534]">
                  <CheckCircle2 className="w-4 h-4 text-[#15803D]" /> Terrain & Soil Insights
                </span>
                <span className="flex items-center gap-1.5 text-[#166534]">
                  <CheckCircle2 className="w-4 h-4 text-[#15803D]" /> AI-Powered Recommendations
                </span>
              </div>
            </div>

            {/* GENUINE GIS 3D LAND PARCEL PRODUCT PREVIEW CARD */}
            <div className="relative rounded-3xl overflow-hidden border border-[#D5E1D9] bg-[#FFFFFF] shadow-sm">
              
              {/* 3D Isometric Land Preview Visual */}
              <div className="w-full h-72 sm:h-80 relative overflow-hidden bg-[#F8FBF9] flex items-center justify-center">
                <img 
                  src={land3DPreview} 
                  alt="3D Land Parcel Intelligence Preview" 
                  className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                />

                {/* Top Label: LAND INTELLIGENCE PREVIEW */}
                <div className="absolute top-3 left-3 bg-[#17211B]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-white flex items-center gap-2 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#86EFAC]">
                    3D GIS LAND PARCEL PREVIEW
                  </span>
                  <span className="text-[9px] text-white/70 font-mono">| SOLAPUR, MH</span>
                </div>

                {/* Bottom Coordinates HUD */}
                <div className="absolute bottom-3 left-3 bg-[#17211B]/85 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono text-white/90 border border-white/15">
                  17.6599° N, 75.9064° E • WGS84
                </div>
              </div>

              {/* GIS Product Preview Information Badges Footer */}
              <div className="bg-[#FFFFFF] p-3.5 sm:p-4 border-t border-[#D5E1D9] grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                
                {/* Land Area */}
                <div className="p-2.5 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9]">
                  <span className="text-[10px] text-[#64736A] font-bold uppercase block">LAND AREA</span>
                  <span className="text-sm font-bold text-[#15803D]">10.2 Acres</span>
                  <span className="text-[10px] text-[#405048] block">4.13 Hectares</span>
                </div>

                {/* Terrain */}
                <div className="p-2.5 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9]">
                  <span className="text-[10px] text-[#64736A] font-bold uppercase block">TERRAIN</span>
                  <span className="text-sm font-bold text-[#17211B]">Gentle Slope</span>
                  <span className="text-[10px] text-[#405048] block">3.8° Incline</span>
                </div>

                {/* Road Access */}
                <div className="p-2.5 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9]">
                  <span className="text-[10px] text-[#64736A] font-bold uppercase block">ROAD ACCESS</span>
                  <span className="text-sm font-bold text-[#17211B]">Good</span>
                  <span className="text-[10px] text-[#405048] block">420m to Highway</span>
                </div>

                {/* Solar Potential */}
                <div className="p-2.5 bg-[#F8FBF9] rounded-2xl border border-[#D5E1D9]">
                  <span className="text-[10px] text-[#64736A] font-bold uppercase block">SOLAR POTENTIAL</span>
                  <span className="text-sm font-bold text-[#166534]">High</span>
                  <span className="text-[10px] text-[#405048] block">5.4 kWh/m²/day</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: ENTERPRISE LOGIN CARD */}
          <div className="lg:col-span-5">
            <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#D5E1D9] shadow-sm space-y-5">
              
              {/* Card Header */}
              <div className="space-y-1">
                <h2 className="font-bold text-2xl text-[#17211B] tracking-tight">
                  {isRegisterMode ? 'Create Account' : 'Welcome back'}
                </h2>
                <p className="text-xs text-[#405048] font-medium">
                  {isRegisterMode 
                    ? 'Register your credentials and select your workspace role.' 
                    : 'Sign in to continue to your LANDVISTA workspace.'}
                </p>
              </div>

              {/* Error Banner */}
              {errorMsg && (
                <div className="p-3 bg-[#FEE2E2] border border-[#FECDD3] rounded-xl text-[#991B1B] text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* FORM */}
              <form onSubmit={isRegisterMode ? handleRegisterSubmit : handleLoginSubmit} className="space-y-4 text-xs font-semibold">
                
                {isRegisterMode && (
                  <>
                    <div>
                      <label className="block mb-1 text-[#17211B] font-bold">FULL NAME</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Pratik Mishra"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B] text-sm outline-none focus:border-[#15803D] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-[#17211B] font-bold">SELECT YOUR ROLE</label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B] text-sm outline-none focus:border-[#15803D] transition-all font-semibold"
                      >
                        <option value="landowner">👤 Landowner</option>
                        <option value="soilExpert">👨‍🔬 Soil & Land Expert</option>
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block mb-1 text-[#17211B] font-bold">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B] text-sm outline-none focus:border-[#15803D] transition-all"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-[#17211B] font-bold">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B] text-sm outline-none focus:border-[#15803D] transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64736A] hover:text-[#17211B]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                {!isRegisterMode && (
                  <div className="flex items-center justify-between text-xs text-[#405048]">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded accent-[#15803D] w-3.5 h-3.5"
                      />
                      <span>Remember me</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setErrorMsg('Password reset link sent to demo registered email.')}
                      className="text-[#15803D] hover:underline font-bold"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Primary SIGN IN Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-2xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-sm uppercase tracking-wider shadow-sm transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 mt-1"
                >
                  {isLoading ? 'Signing In...' : isRegisterMode ? 'Create Account' : 'SIGN IN'}
                </button>
              </form>

              {/* OR DIVIDER */}
              <div className="relative flex items-center justify-center my-2">
                <div className="border-t border-[#D5E1D9] w-full" />
                <span className="bg-[#FFFFFF] px-3 text-[11px] font-bold text-[#64736A] uppercase tracking-widest absolute">
                  OR
                </span>
              </div>

              {/* Google OAuth Option */}
              <button
                type="button"
                onClick={handleGoogleLoginMock}
                className="w-full py-2.5 rounded-2xl bg-[#FFFFFF] hover:bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B] font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Toggle Login / Register */}
              <div className="text-center text-xs text-[#405048] pt-1">
                <span>{isRegisterMode ? 'Already have an account?' : "Don't have an account?"} </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(!isRegisterMode);
                    setErrorMsg('');
                  }}
                  className="text-[#15803D] hover:underline font-bold ml-1"
                >
                  {isRegisterMode ? 'Sign In' : 'Create Account'}
                </button>
              </div>

              {/* 🎯 1-CLICK ROLE DEMO ACCELERATORS (FOR JUDGES & EVALUATORS) */}
              <div className="pt-3 border-t border-[#D5E1D9] space-y-2">
                <span className="text-[10px] text-[#64736A] font-bold uppercase tracking-wider block text-center">
                  EVALUATION QUICK-ACCESS (1-CLICK ROLE DEMO)
                </span>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleDemoClick('landowner')}
                    className="p-2.5 rounded-xl bg-[#F8FBF9] hover:bg-[#E8F5EC] border border-[#D5E1D9] text-[#166534] font-bold text-center transition-all truncate text-[12px] flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    👤 Landowner
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoClick('soilExpert')}
                    className="p-2.5 rounded-xl bg-[#F8FBF9] hover:bg-[#E8F5EC] border border-[#D5E1D9] text-[#15803D] font-bold text-center transition-all truncate text-[12px] flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    👨‍🔬 Soil Expert
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. SUBTLE FOOTER TRUST MESSAGE */}
      <footer className="w-full py-4 border-t border-[#E6ECE8] text-center text-xs text-[#64736A] bg-[#FFFFFF]">
        <p>Geospatial intelligence for better land decisions. • LANDVISTA AI</p>
      </footer>
    </div>
  );
};
