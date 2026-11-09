import React, { useState } from 'react';
import RishiLogo from '../common/RishiLogo.jsx';
import {
  Phone,
  Clock,
  MapPin,
  Search,
  User,
  Shield,
  CreditCard,
  FlaskConical,
  Calendar,
  ChevronDown,
  Menu,
  X,
  HeartPulse,
} from 'lucide-react';

const HOSPITALS_LIST = [
  'Rishi Super Speciality Hospital, Saket, New Delhi',
  'Rishi Super Speciality Hospital, Pusa Road, New Delhi',
  'Rishi Super Speciality Hospital, Mumbai',
  'Rishi Super Speciality Hospital, Shalimar Bagh, New Delhi',
  'Rishi Super Speciality Hospital, Patparganj, New Delhi',
  'Rishi Hospital, Gurugram, Haryana',
  'Rishi Super Speciality Hospital, Vaishali, Ghaziabad',
  'Rishi Super Speciality Hospital, Dehradun',
];

export default function MaxHeader({
  onOpenBooking,
  onOpenAuth,
  onOpenPayBill,
  user,
  onLogout,
  onOpenAdminPortal,
  onOpenPatientPortal,
  onGoHome,
  onNavigateSection,
}) {
  const [selectedHospital, setSelectedHospital] = useState(HOSPITALS_LIST[0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hospDropdownOpen, setHospDropdownOpen] = useState(false);

  const cleanName = user?.name
    ? user.name.replace(/\s*\([^)]*\)/g, '').trim()
    : (user?.username || 'User');

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    if (onNavigateSection) {
      onNavigateSection(targetId);
    } else {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="w-full bg-white sticky top-0 z-40 shadow-sm border-b border-slate-200">
      {/* 1. Top Utility & Emergency Bar (Max Healthcare Brand Style) */}
      <div className="bg-sky-600 text-white text-xs py-2 px-4 sm:px-8 border-b border-sky-500/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Emergency & Helpline */}
          <div className="flex items-center gap-4 lg:gap-6 shrink-0">
            <a
              href="tel:1066"
              className="flex items-center gap-1.5 text-white font-extrabold hover:text-white transition-colors shrink-0"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <Phone className="w-3.5 h-3.5" />
              <span>24x7 Emergency: 1066</span>
            </a>

            <div className="hidden xl:flex items-center gap-1.5 text-sky-50 shrink-0">
              <Phone className="w-3 h-3 text-sky-100" />
              <span>Rishi Healthline: 011-26515050</span>
            </div>

            {/* Hospital Location Selector */}
            <div className="relative hidden md:block shrink-0">
              <button
                onClick={() => setHospDropdownOpen(!hospDropdownOpen)}
                className="flex items-center gap-1 text-sky-50 hover:text-white transition-colors"
              >
                <MapPin className="w-3 h-3 text-white shrink-0" />
                <span className="truncate max-w-[180px]">
                  {selectedHospital.replace(/^Rishi (Super Speciality )?Hospital,\s*/i, '')}
                </span>
                <ChevronDown className="w-3 h-3 text-sky-100 shrink-0" />
              </button>

              {hospDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setHospDropdownOpen(false)} />
                  <div className="absolute left-0 mt-2 w-96 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 py-2 z-50 text-xs font-medium">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      Select Rishi Network Hospital
                    </div>
                    {HOSPITALS_LIST.map((hosp, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedHospital(hosp);
                          setHospDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 hover:bg-maxblue-50 transition-colors flex items-center gap-2 ${
                          selectedHospital === hosp ? 'text-maxblue-800 font-bold bg-maxblue-50/50' : 'text-slate-700'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5 text-maxorange-500 shrink-0" />
                        <span>{hosp}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Links & Login Switcher */}
          <div className="flex items-center gap-3 sm:gap-4 text-[11px] shrink-0">
            {user?.role === 'PATIENT' && (
              <>
                <button
                  onClick={onOpenPayBill}
                  className="hidden lg:flex items-center gap-1 hover:text-white transition-colors text-sky-50 shrink-0"
                >
                  <CreditCard className="w-3 h-3 text-white" />
                  <span>Pay Bill Online</span>
                </button>
                <span className="text-sky-200 hidden lg:inline">|</span>
              </>
            )}

            {/* Logged in vs Guest */}
            {user ? (
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <span className="text-sky-50 font-semibold truncate max-w-[140px]" title={user.name}>
                  Hi, {cleanName}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-sky-700/80 text-sky-100 border border-sky-400/30">
                  {user.role}
                </span>
                {user.role === 'PATIENT' ? (
                  <button
                    onClick={onOpenPatientPortal}
                    className="px-2.5 py-1 rounded bg-white text-sky-700 font-bold hover:bg-sky-50 transition-all text-xs shadow-xs"
                  >
                    Patient Portal
                  </button>
                ) : (
                  <button
                    onClick={onOpenAdminPortal}
                    className="px-2.5 py-1 rounded bg-white text-sky-700 font-bold hover:bg-sky-50 transition-all text-xs shadow-xs"
                  >
                    Admin Console
                  </button>
                )}
                <button
                  onClick={onLogout}
                  className="text-sky-100 hover:text-white underline text-xs transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 shrink-0">
                {/* Specific "Are you an Admin?" Trigger */}
                <button
                  onClick={() => onOpenAuth(true)}
                  className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20 font-semibold"
                  title="Hospital Staff / Admin Console Login"
                >
                  <Shield className="w-3 h-3 text-white" />
                  <span>Are you an Admin?</span>
                </button>

                <button
                  onClick={() => onOpenAuth(false)}
                  className="flex items-center gap-1 px-3 py-1 rounded bg-maxorange-500 hover:bg-maxorange-600 text-white font-bold shadow-xs transition-all"
                >
                  <User className="w-3 h-3" />
                  <span>Patient Sign In</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar with Signature Max Logo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Max Healthcare Logo */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            if (onGoHome) onGoHome();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 group"
        >
          {/* Rishi Healthcare Cross Emblem */}
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0b3a4a] via-[#092f3a] to-[#041c24] flex items-center justify-center p-1.5 shadow-md shadow-teal-950/30 group-hover:scale-105 transition-transform border border-teal-500/30">
            <RishiLogo size="md" />
          </div>
          <div>
            <div className="text-2xl font-black text-maxblue-800 tracking-tight leading-none">
              RISHI <span className="text-maxorange-500 font-extrabold text-xl">HEALTHCARE</span>
            </div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-0.5">
              Super Speciality Hospitals
            </div>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-slate-700">
          <a
            href="#find-doctor"
            onClick={(e) => handleNavClick(e, 'find-doctor')}
            className="hover:text-maxorange-500 transition-colors flex items-center gap-1"
          >
            <span>Find a Doctor</span>
          </a>
          <a
            href="#specialities"
            onClick={(e) => handleNavClick(e, 'specialities')}
            className="hover:text-maxorange-500 transition-colors"
          >
            <span>Centers of Excellence</span>
          </a>
          <a
            href="#services"
            onClick={(e) => handleNavClick(e, 'services')}
            className="hover:text-maxorange-500 transition-colors"
          >
            <span>Rishi Lab & Services</span>
          </a>
          <a
            href="#about"
            onClick={(e) => handleNavClick(e, 'about')}
            className="hover:text-maxorange-500 transition-colors"
          >
            <span>About Us</span>
          </a>
        </nav>

        {/* Right Call-To-Action: Book Appointment */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenBooking}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-maxorange-500 hover:bg-maxorange-600 text-white font-extrabold text-xs shadow-lg shadow-maxorange-500/25 transition-all hover:shadow-xl hover:scale-[1.02] active:scale-95"
          >
            <Calendar className="w-4 h-4" />
            <span>Book an Appointment</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 lg:hidden text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-6 py-4 space-y-3 text-xs font-semibold">
          <a
            href="#find-doctor"
            onClick={(e) => {
              setMobileMenuOpen(false);
              handleNavClick(e, 'find-doctor');
            }}
            className="block py-2 text-slate-700 hover:text-maxorange-500"
          >
            Find a Doctor
          </a>
          <a
            href="#specialities"
            onClick={(e) => {
              setMobileMenuOpen(false);
              handleNavClick(e, 'specialities');
            }}
            className="block py-2 text-slate-700 hover:text-maxorange-500"
          >
            Centers of Excellence
          </a>
          <a
            href="#services"
            onClick={(e) => {
              setMobileMenuOpen(false);
              handleNavClick(e, 'services');
            }}
            className="block py-2 text-slate-700 hover:text-maxorange-500"
          >
            Rishi Lab & Services
          </a>
          <a
            href="#about"
            onClick={(e) => {
              setMobileMenuOpen(false);
              handleNavClick(e, 'about');
            }}
            className="block py-2 text-slate-700 hover:text-maxorange-500"
          >
            About Us
          </a>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth(false);
              }}
              className="w-full py-2 bg-maxblue-50 text-maxblue-800 font-bold rounded-lg text-center"
            >
              Patient Sign In
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth(true);
              }}
              className="w-full py-2 bg-purple-50 text-purple-800 font-bold rounded-lg text-center"
            >
              Are you an Admin? (Staff Login)
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
