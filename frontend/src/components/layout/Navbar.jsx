import React, { useState } from 'react';
import RishiLogo from '../common/RishiLogo.jsx';
import {
  Activity,
  User,
  Shield,
  Stethoscope,
  Users,
  RotateCcw,
  LogOut,
  ChevronDown,
  Building2,
  CheckCircle,
  ExternalLink,
  Globe,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';

export default function Navbar({ onOpenLogin, onDataReload, onViewWebsite, onViewPatientPortal }) {
  const { user, logout, quickSwitch } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleResetData = async () => {
    if (!window.confirm('This will restore all departments, doctors, patients, beds, and medicines to original demo state. Continue?')) {
      return;
    }
    setIsResetting(true);
    try {
      await api.resetDatabase();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
      if (onDataReload) onDataReload();
    } catch (err) {
      alert('Reset failed: ' + err.message);
    } finally {
      setIsResetting(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'DOCTOR':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'RECEPTIONIST':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'PHARMACIST':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shadow-xs">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0b3a4a] via-[#092f3a] to-[#041c24] flex items-center justify-center p-1.5 shadow-md shadow-teal-950/20 border border-teal-500/30">
          <RishiLogo size="sm" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-black text-maxblue-800 tracking-tight flex items-center gap-2">
            RISHI <span className="text-maxorange-500 font-extrabold text-sm sm:text-base">HEALTHCARE</span>
            <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-maxblue-50 text-maxblue-800 font-bold border border-maxblue-200">
              Admin & Clinical Console
            </span>
          </h1>
          <p className="text-[11px] text-slate-400 hidden sm:block">Rishi Super Speciality Hospital Management</p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Switch to Rishi Website */}
        {onViewWebsite && (
          <button
            onClick={onViewWebsite}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-maxblue-50 text-maxblue-800 hover:bg-maxblue-100 border border-maxblue-200 transition-all"
            title="View public Rishi Healthcare website"
          >
            <Globe className="w-3.5 h-3.5 text-maxorange-500" />
            <span className="hidden md:inline">Rishi Healthcare Website</span>
            <span className="md:hidden">Website</span>
          </button>
        )}

        {/* Switch to Patient View Button */}
        {onViewPatientPortal && (
          <button
            onClick={onViewPatientPortal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-all"
            title="Switch to User / Patient View"
          >
            <User className="w-3.5 h-3.5 text-emerald-600" />
            <span>Patient Portal</span>
          </button>
        )}

        {/* Reset Database Button */}
        <button
          onClick={handleResetData}
          disabled={isResetting}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200 transition-all disabled:opacity-50"
          title="Reset sample patients, appointments, medicines and beds"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin text-maxorange-500' : ''}`} />
          <span className="hidden lg:inline">{isResetting ? 'Resetting...' : 'Reset Demo Data'}</span>
          {resetSuccess && <CheckCircle className="w-3.5 h-3.5 text-emerald-600 inline" />}
        </button>

        {/* User Account Dropdown */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-slate-50 border border-slate-200 transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-maxblue-100 text-maxblue-800 font-bold flex items-center justify-center text-sm">
                {user.name?.charAt(0) || 'U'}
              </div>
              <div className="text-left hidden md:block">
                <div className="text-xs font-bold text-slate-800 leading-tight">{user.name}</div>
                <div className="flex items-center gap-1">
                  <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${getRoleBadgeColor(user.role)}`}>
                    {user.role}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
            </button>

            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-400 font-medium">Logged in as</p>
                    <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>

                  {/* Switch Roles Section */}
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Switch Role View
                    </p>
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          quickSwitch('admin@hospital.com');
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-purple-50 text-slate-700 hover:text-purple-700 flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <Shield className="w-3.5 h-3.5 text-purple-600" />
                          <span>Dr. Alok Nath</span>
                        </span>
                        <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-semibold">ADMIN</span>
                      </button>

                      <button
                        onClick={() => {
                          quickSwitch('dr.balbir@hospital.com');
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-blue-50 text-slate-700 hover:text-blue-700 flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                          <span>Dr. Balbir Singh</span>
                        </span>
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-semibold">CARDIOLOGY</span>
                      </button>

                      <button
                        onClick={() => {
                          quickSwitch('rohit.kumar@example.com');
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-teal-50 text-slate-700 hover:text-teal-700 flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-teal-600" />
                          <span>Rohit Kumar</span>
                        </span>
                        <span className="text-[10px] bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded font-semibold">PATIENT</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out (Return to Login)
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-maxorange-500 text-white hover:bg-maxorange-600 shadow-sm transition-all"
          >
            <User className="w-3.5 h-3.5" />
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
