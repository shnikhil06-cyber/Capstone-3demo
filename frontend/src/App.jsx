import React, { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import DashboardView from './components/dashboard/DashboardView.jsx';
import PatientsView from './components/patients/PatientsView.jsx';
import DoctorsView from './components/doctors/DoctorsView.jsx';
import AppointmentsView from './components/appointments/AppointmentsView.jsx';
import MedicalRecordsView from './components/medical-records/MedicalRecordsView.jsx';
import RoomsView from './components/rooms/RoomsView.jsx';
import PharmacyView from './components/pharmacy/PharmacyView.jsx';
import BillingView from './components/billing/BillingView.jsx';
import DepartmentsView from './components/departments/DepartmentsView.jsx';
import PortalLoginPage from './components/auth/PortalLoginPage.jsx';
import PatientPortalView from './components/patient-portal/PatientPortalView.jsx';

// Max Healthcare Website Components (https://www.maxhealthcare.in/)
import MaxHeader from './components/max/MaxHeader.jsx';
import MaxBannerCarousel from './components/max/MaxBannerCarousel.jsx';
import MaxHero from './components/max/MaxHero.jsx';
import MaxStatsSection from './components/max/MaxStatsSection.jsx';
import MaxCentersOfExcellence from './components/max/MaxCentersOfExcellence.jsx';
import MaxDoctorsSection from './components/max/MaxDoctorsSection.jsx';
import MaxServicesSection from './components/max/MaxServicesSection.jsx';
import MaxAboutSection from './components/max/MaxAboutSection.jsx';
import MaxFooter from './components/max/MaxFooter.jsx';
import RishiLogo from './components/common/RishiLogo.jsx';

import { useAuth } from './context/AuthContext.jsx';
import { api } from './services/api.js';

export default function App() {
  const { user, isLoading, logout, quickSwitch } = useAuth();

  // Primary View Controller: 'website' | 'login' | 'patient' | 'admin'
  // Default view is the Rishi Healthcare website (landing page), not the login screen
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const initialUrlView = searchParams ? searchParams.get('view') : null;
  const initialHash = typeof window !== 'undefined' ? window.location.hash : '';

  // If there's an anchor hash pointing to a section (e.g. #hospitals, #services, #about), prioritize website view
  const defaultMode = (initialHash && initialHash !== '#')
    ? 'website'
    : (initialUrlView === 'login' ? 'login' : 'website');

  const [viewMode, setViewMode] = useState(defaultMode);
  const [loginAsAdmin, setLoginAsAdmin] = useState(false);

  // Section navigation helper: switches to website mode, cleans ?view=login from URL, and smoothly scrolls to section
  const handleNavigateSection = (targetId) => {
    if (viewMode !== 'website') {
      setViewMode('website');
    }
    if (typeof window !== 'undefined') {
      const cleanUrl = window.location.pathname + (targetId ? `#${targetId}` : '');
      window.history.pushState({}, '', cleanUrl);
    }
    setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Scroll to section hash on initial load or viewMode switch
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashId = window.location.hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(hashId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 250);
    }
  }, [viewMode]);

  // Admin View State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState(null);

  // Public / Shared Catalog State for Max Website
  const [publicDoctors, setPublicDoctors] = useState([]);
  const [publicDepartments, setPublicDepartments] = useState([]);

  // Cross-module preselected values in admin view
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);
  const [selectedPatientForBooking, setSelectedPatientForBooking] = useState(null);
  const [selectedAppointmentForRecord, setSelectedAppointmentForRecord] = useState(null);

  // Fetch public catalog on mount so Max Healthcare website has live data
  const loadPublicData = async () => {
    try {
      const [docs, depts, dashboardStats] = await Promise.all([
        api.getDoctors(),
        api.getDepartments(),
        api.getDashboardStats().catch(() => null),
      ]);
      setPublicDoctors(docs || []);
      setPublicDepartments(depts || []);
      if (dashboardStats) setStats(dashboardStats);
    } catch (err) {
      console.warn('Could not preload public data:', err);
    }
  };

  useEffect(() => {
    loadPublicData();
  }, []);

  // Load admin dashboard data when user is staff/admin
  const loadDashboardData = async () => {
    try {
      const [statsData, recentData] = await Promise.all([
        api.getDashboardStats(),
        api.getDashboardRecent(),
      ]);
      setStats(statsData);
      setRecent(recentData);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  };

  useEffect(() => {
    if (user && user.role !== 'PATIENT') {
      loadDashboardData();
    }
  }, [user, activeTab]);

  const handleUpdateAppointmentStatus = async (id, status) => {
    try {
      await api.updateAppointmentStatus(id, status);
      loadDashboardData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleBookWithDoctor = (doc) => {
    setSelectedDoctorForBooking(doc);
    setActiveTab('appointments');
  };

  const handleBookForPatient = (patient) => {
    setSelectedPatientForBooking(patient);
    setActiveTab('appointments');
  };

  const handleOpenMedicalRecord = (apt) => {
    setSelectedAppointmentForRecord(apt);
    setActiveTab('medical-records');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 flex flex-col items-center justify-center text-sky-900 font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0b3a4a] via-[#092f3a] to-[#041c24] flex items-center justify-center p-2 text-white shadow-xl shadow-teal-950/30 animate-pulse border border-teal-500/30">
          <RishiLogo size="lg" />
        </div>
        <h2 className="text-xl font-black mt-4 tracking-tight">
          RISHI <span className="text-maxorange-500">HEALTHCARE</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1 font-semibold">Connecting to PostgreSQL database...</p>
      </div>
    );
  }

  // 1. Unauthenticated or Explicit Login Portal (asking "Are you an Admin?")
  if (!user && viewMode === 'login') {
    return (
      <div className="relative">
        <PortalLoginPage
          initialIsAdmin={loginAsAdmin}
          onGoToWebsite={() => {
            if (typeof window !== 'undefined') {
              window.history.pushState({}, '', window.location.pathname);
            }
            setViewMode('website');
          }}
        />
      </div>
    );
  }

  // 2. Max Healthcare Official Website Replica (https://www.maxhealthcare.in/)
  if (viewMode === 'website' || (!user && viewMode !== 'login')) {
    return (
      <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans',sans-serif] text-slate-800">

        {/* Max Healthcare Header */}
        <MaxHeader
          user={user}
          onLogout={logout}
          onGoHome={() => handleNavigateSection('')}
          onNavigateSection={handleNavigateSection}
          onOpenBooking={() => {
            const el = document.getElementById('book-appointment');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenAuth={(asAdmin = false) => {
            setLoginAsAdmin(asAdmin);
            setViewMode('login');
          }}
          onOpenPayBill={() => {
            const el = document.getElementById('book-appointment');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenPatientPortal={() => setViewMode('patient')}
          onOpenAdminPortal={() => setViewMode('admin')}
        />

        {/* 5-Second Promotional Banner Carousel */}
        <MaxBannerCarousel
          onBookAppointment={() => {
            const el = document.getElementById('book-appointment');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Hero Section with Interactive 5-tab Max Widget */}
        <div id="book-appointment">
          <MaxHero
            doctors={publicDoctors}
            departments={publicDepartments}
            stats={stats}
            onAppointmentBooked={loadPublicData}
            user={user}
            onRequireLogin={() => {
              setLoginAsAdmin(false);
              setViewMode('login');
            }}
          />
        </div>

        {/* Live Network Stats Strip */}
        <MaxStatsSection />

        {/* Clinical Centers of Excellence */}
        <MaxCentersOfExcellence />

        {/* Renowned Max Clinicians */}
        <MaxDoctorsSection
          doctors={publicDoctors}
          onBookDoctor={(doc) => {
            if (!user) {
              setLoginAsAdmin(false);
              setViewMode('login');
              return;
            }
            const el = document.getElementById('book-appointment');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Max Integrated Healthcare Services (Rishi Lab & Services #services) */}
        <MaxServicesSection
          onOpenBooking={() => {
            const el = document.getElementById('book-appointment');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* About Rishi Healthcare Comprehensive Overview (#about) */}
        <MaxAboutSection
          onOpenBooking={() => {
            const el = document.getElementById('book-appointment');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Max Healthcare Comprehensive Footer */}
        <MaxFooter
          onOpenAuth={(asAdmin = false) => {
            setLoginAsAdmin(asAdmin);
            setViewMode('login');
          }}
        />
      </div>
    );
  }

  // 3. Authenticated Patient Portal
  if (user && (viewMode === 'patient' || (user.role === 'PATIENT' && viewMode !== 'admin'))) {
    return (
      <PatientPortalView
        onBackToWebsite={() => setViewMode('website')}
        onSwitchToAdmin={async () => {
          if (user.role === 'ADMIN' || user.role === 'DOCTOR' || user.role === 'RECEPTIONIST') {
            setViewMode('admin');
          } else {
            // Quick-switch to Super Admin for demo evaluation
            await quickSwitch('admin@hospital.com');
            setViewMode('admin');
          }
        }}
      />
    );
  }

  // 4. Authenticated Hospital Management Console (Admin / Clinician / Staff)
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar */}
      <Navbar
        onOpenLogin={() => {
          logout();
          setViewMode('login');
        }}
        onDataReload={loadDashboardData}
        onViewWebsite={() => setViewMode('website')}
        onViewPatientPortal={() => setViewMode('patient')}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          stats={stats}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardView
              stats={stats}
              recent={recent}
              onNavigate={setActiveTab}
              onOpenBookAppointment={() => setActiveTab('appointments')}
              onOpenRegisterPatient={() => setActiveTab('patients')}
              onOpenAdmitPatient={() => setActiveTab('rooms')}
              onOpenCreateInvoice={() => setActiveTab('billing')}
              onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
            />
          )}

          {activeTab === 'patients' && (
            <PatientsView onBookAppointmentForPatient={handleBookForPatient} />
          )}

          {activeTab === 'doctors' && (
            <DoctorsView onBookAppointmentWithDoctor={handleBookWithDoctor} />
          )}

          {activeTab === 'appointments' && (
            <AppointmentsView
              preselectedDoctor={selectedDoctorForBooking}
              preselectedPatient={selectedPatientForBooking}
              onOpenMedicalRecord={handleOpenMedicalRecord}
            />
          )}

          {activeTab === 'medical-records' && (
            <MedicalRecordsView
              preselectedAppointment={selectedAppointmentForRecord}
            />
          )}

          {activeTab === 'rooms' && <RoomsView />}

          {activeTab === 'pharmacy' && <PharmacyView />}

          {activeTab === 'billing' && <BillingView />}

          {activeTab === 'departments' && <DepartmentsView />}
        </main>
      </div>
    </div>
  );
}
