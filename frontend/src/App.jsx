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
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const initialUrlView = searchParams ? searchParams.get('view') : null;
  const initialIsAdmin = searchParams ? searchParams.get('admin') === 'true' : false;
  const initialLoginMode = searchParams ? (searchParams.get('mode') || 'login') : 'login';
  const initialAdminTab = searchParams ? searchParams.get('tab') : null;
  const initialHash = typeof window !== 'undefined' ? window.location.hash : '';

  // If there's an anchor hash pointing to a section (e.g. #services, #about), prioritize website view
  const defaultMode = (initialHash && initialHash !== '#')
    ? 'website'
    : (initialUrlView === 'login' ? 'login' : (initialUrlView === 'patient' ? 'patient' : (initialUrlView === 'admin' ? 'admin' : 'website')));

  const [viewMode, setViewMode] = useState(defaultMode);
  const [loginAsAdmin, setLoginAsAdmin] = useState(initialIsAdmin);
  const [loginMode, setLoginMode] = useState(initialLoginMode);
  const [activeTab, setActiveTab] = useState(initialAdminTab || 'dashboard');
  const [patientTab, setPatientTab] = useState(initialUrlView === 'patient' && initialAdminTab ? initialAdminTab : 'overview');

  // Unified Navigation Controller: synchronizes viewMode, admin login state, and browser history
  const navigateTo = (newMode, options = {}) => {
    const { admin = false, mode = 'login', targetId = '', tab = '', replace = false } = options;

    setViewMode(newMode);
    if (newMode === 'login') {
      setLoginAsAdmin(admin);
      setLoginMode(mode);
    }
    if (newMode === 'admin' && tab) {
      setActiveTab(tab);
    }

    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname || '/';
      let targetUrl = pathname;

      if (newMode === 'login') {
        const queryParams = new URLSearchParams();
        queryParams.set('view', 'login');
        if (admin) queryParams.set('admin', 'true');
        if (mode && mode !== 'login') queryParams.set('mode', mode);
        targetUrl = `${pathname}?${queryParams.toString()}`;
      } else if (newMode === 'patient') {
        const queryParams = new URLSearchParams();
        queryParams.set('view', 'patient');
        if (tab && tab !== 'overview') queryParams.set('tab', tab);
        targetUrl = `${pathname}?${queryParams.toString()}`;
      } else if (newMode === 'admin') {
        const queryParams = new URLSearchParams();
        queryParams.set('view', 'admin');
        const adminTab = tab || activeTab || 'dashboard';
        queryParams.set('tab', adminTab);
        targetUrl = `${pathname}?${queryParams.toString()}`;
      } else if (newMode === 'website') {
        targetUrl = targetId ? `${pathname}#${targetId}` : pathname;
      }

      const stateObj = {
        viewMode: newMode,
        loginAsAdmin: admin,
        loginMode: mode,
        targetId,
        tab: newMode === 'admin' ? (tab || activeTab) : tab,
      };

      const currentFullUrl = window.location.pathname + window.location.search + window.location.hash;
      if (replace) {
        window.history.replaceState(stateObj, '', targetUrl);
      } else if (targetUrl !== currentFullUrl) {
        window.history.pushState(stateObj, '', targetUrl);
      }
    }

    if (targetId) {
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // Section navigation helper: switches to website mode and smoothly scrolls
  const handleNavigateSection = (targetId) => {
    navigateTo('website', { targetId });
  };

  const handleSelectAdminTab = (tab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const currentTab = new URLSearchParams(window.location.search).get('tab');
      if (currentTab !== tab) {
        window.history.pushState(
          { viewMode: 'admin', tab },
          '',
          `${window.location.pathname}?view=admin&tab=${tab}`
        );
      }
    }
  };

  const handleSelectPatientTab = (tab) => {
    setPatientTab(tab);
    if (typeof window !== 'undefined') {
      const currentTab = new URLSearchParams(window.location.search).get('tab');
      if (currentTab !== tab) {
        window.history.pushState(
          { viewMode: 'patient', patientTab: tab },
          '',
          `${window.location.pathname}?view=patient&tab=${tab}`
        );
      }
    }
  };

  // On mount: record initial state into browser history so Back button can return here
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.replaceState(
        {
          viewMode: defaultMode,
          loginAsAdmin: initialIsAdmin,
          loginMode: initialLoginMode,
          targetId: initialHash ? initialHash.replace('#', '') : '',
          tab: initialAdminTab || 'dashboard',
        },
        '',
        window.location.href
      );
    }
  }, []);

  // Listen for browser Back and Forward buttons (HTML5 popstate event)
  useEffect(() => {
    const handlePopState = (event) => {
      if (typeof window === 'undefined') return;

      const params = new URLSearchParams(window.location.search);
      const urlView = params.get('view');
      const isAdminLogin = params.get('admin') === 'true';
      const urlMode = params.get('mode') || 'login';
      const urlTab = params.get('tab');
      const hashId = window.location.hash ? window.location.hash.replace('#', '') : '';

      let targetMode = 'website';
      if (event.state && event.state.viewMode) {
        targetMode = event.state.viewMode;
      } else if (urlView === 'login') {
        targetMode = 'login';
      } else if (urlView === 'patient') {
        targetMode = 'patient';
      } else if (urlView === 'admin') {
        targetMode = 'admin';
      }

      const targetIsAdmin = event.state?.loginAsAdmin ?? isAdminLogin;
      const targetModeType = event.state?.loginMode ?? urlMode;
      const targetTab = event.state?.tab || urlTab || 'dashboard';

      setViewMode(targetMode);
      setLoginAsAdmin(targetIsAdmin);
      setLoginMode(targetModeType);
      if (targetMode === 'admin') {
        setActiveTab(targetTab);
      }
      if (targetMode === 'patient') {
        const pTab = event.state?.patientTab || urlTab || 'overview';
        setPatientTab(pTab);
      }

      if (targetMode === 'website' && hashId) {
        setTimeout(() => {
          const el = document.getElementById(hashId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
    handleSelectAdminTab('appointments');
  };

  const handleBookForPatient = (patient) => {
    setSelectedPatientForBooking(patient);
    handleSelectAdminTab('appointments');
  };

  const handleOpenMedicalRecord = (apt) => {
    setSelectedAppointmentForRecord(apt);
    handleSelectAdminTab('medical-records');
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

  // 1. Explicit Login Portal (asking "Are you an Admin?")
  if (viewMode === 'login' || (!user && (viewMode === 'patient' || viewMode === 'admin'))) {
    return (
      <div className="relative">
        <PortalLoginPage
          currentUser={user}
          initialIsAdmin={loginAsAdmin || viewMode === 'admin'}
          initialMode={loginMode}
          onSwitchAdmin={(isAdmin) => {
            setLoginAsAdmin(isAdmin);
            navigateTo('login', { admin: isAdmin, mode: loginMode });
          }}
          onSwitchMode={(mode) => {
            setLoginMode(mode);
            navigateTo('login', { admin: loginAsAdmin, mode });
          }}
          onLoginSuccess={(loggedInUser) => {
            const targetMode = loggedInUser?.role === 'PATIENT' ? 'patient' : 'admin';
            navigateTo(targetMode);
          }}
          onGoToWebsite={() => navigateTo('website')}
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
          onOpenAuth={(asAdmin = false) => navigateTo('login', { admin: asAdmin })}
          onOpenPayBill={() => {
            const el = document.getElementById('book-appointment');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenPatientPortal={() => navigateTo('patient')}
          onOpenAdminPortal={() => navigateTo('admin')}
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
            onRequireLogin={() => navigateTo('login', { admin: false })}
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
              navigateTo('login', { admin: false });
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
          onOpenAuth={(asAdmin = false) => navigateTo('login', { admin: asAdmin })}
        />
      </div>
    );
  }

  // 3. Authenticated Patient Portal
  if (user && (viewMode === 'patient' || (user.role === 'PATIENT' && viewMode !== 'admin' && viewMode !== 'website'))) {
    return (
      <PatientPortalView
        initialTab={patientTab}
        onSelectTab={handleSelectPatientTab}
        onBackToWebsite={() => navigateTo('website')}
        onSwitchToAdmin={async () => {
          if (user.role === 'ADMIN' || user.role === 'DOCTOR' || user.role === 'RECEPTIONIST') {
            navigateTo('admin');
          } else {
            // Quick-switch to Super Admin for demo evaluation
            await quickSwitch('admin@hospital.com');
            navigateTo('admin');
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
          navigateTo('login', { admin: true });
        }}
        onDataReload={loadDashboardData}
        onViewWebsite={() => navigateTo('website')}
        onViewPatientPortal={() => navigateTo('patient')}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={handleSelectAdminTab}
          stats={stats}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardView
              stats={stats}
              recent={recent}
              onNavigate={handleSelectAdminTab}
              onOpenBookAppointment={() => handleSelectAdminTab('appointments')}
              onOpenRegisterPatient={() => handleSelectAdminTab('patients')}
              onOpenAdmitPatient={() => handleSelectAdminTab('rooms')}
              onOpenCreateInvoice={() => handleSelectAdminTab('billing')}
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
