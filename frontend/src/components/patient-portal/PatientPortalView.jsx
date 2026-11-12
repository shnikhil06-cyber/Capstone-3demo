import React, { useState, useEffect } from 'react';
import RishiLogo from '../common/RishiLogo.jsx';
import {
  User,
  Calendar,
  ClipboardList,
  Pill,
  Receipt,
  Stethoscope,
  Heart,
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  CreditCard,
  Printer,
  X,
  LogOut,
  Shield,
  Activity,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import { getDoctorImage } from '../../services/doctorImages.js';

export default function PatientPortalView({ onSwitchToAdmin, onBackToWebsite, initialTab = 'overview', onSelectTab }) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab || 'overview');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    if (onSelectTab) onSelectTab(tabId);
  };

  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [bills, setBills] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Book Appointment Modal
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState('');
  const [selectedDeptForBooking, setSelectedDeptForBooking] = useState('');
  const [bookDate, setBookDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookSlot, setBookSlot] = useState('10:00 AM');
  const [bookReason, setBookReason] = useState('');
  const [bookSymptoms, setBookSymptoms] = useState('');

  // Selected Bill for Printable Receipt Modal
  const [selectedBill, setSelectedBill] = useState(null);

  const patientId = user?.patient?.id;

  const loadPatientData = async () => {
    if (!patientId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [apts, recs, bls, docs, depts] = await Promise.all([
        api.getAppointments({ patientId }),
        api.getMedicalRecords({ patientId }),
        api.getBills({ patientId }),
        api.getDoctors(),
        api.getDepartments(),
      ]);
      setAppointments(apts);
      setRecords(recs);
      setBills(bls);
      setDoctors(docs);
      setDepartments(depts);
    } catch (err) {
      console.error('Failed to load patient data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatientData();
  }, [patientId]);

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    try {
      await api.createAppointment({
        patientId,
        doctorId: selectedDoctorForBooking,
        departmentId: selectedDeptForBooking,
        appointmentDate: bookDate,
        timeSlot: bookSlot,
        type: 'CONSULTATION',
        reason: bookReason,
        symptoms: bookSymptoms,
      });
      setIsBookModalOpen(false);
      setBookReason('');
      setBookSymptoms('');
      loadPatientData();
      handleSelectTab('appointments');
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePayBill = async (billId, paymentMethod = 'UPI') => {
    try {
      const updated = await api.payBill(billId, { paymentMethod });
      setSelectedBill(updated);
      loadPatientData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCancelAppointment = async (aptId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await api.updateAppointmentStatus(aptId, 'CANCELLED');
      loadPatientData();
    } catch (err) {
      alert(err.message);
    }
  };

  const openBookWithDoctor = (doc) => {
    setSelectedDoctorForBooking(doc.id);
    setSelectedDeptForBooking(doc.departmentId);
    setIsBookModalOpen(true);
  };

  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'CONFIRMED' || a.status === 'PENDING'
  );
  const unpaidBills = bills.filter((b) => b.status === 'UNPAID' || b.status === 'PARTIAL');
  const totalDue = unpaidBills.reduce((acc, b) => acc + (b.totalAmount - b.paidAmount), 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] text-slate-800">
      {/* Top Patient Header with Max Healthcare Branding */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBackToWebsite && (
              <button
                onClick={onBackToWebsite}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all mr-1 flex items-center gap-1 text-xs font-bold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Rishi Website</span>
              </button>
            )}

            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0b3a4a] via-[#092f3a] to-[#041c24] flex items-center justify-center p-1.5 shadow-md shadow-teal-950/20 border border-teal-500/30">
              <RishiLogo size="sm" />
            </div>
            <div>
              <h1 className="text-base font-black text-maxblue-800 tracking-tight flex items-center gap-2">
                RISHI <span className="text-maxorange-500 font-extrabold text-sm">PATIENT PORTAL</span>
                <span className="text-[11px] font-mono bg-maxblue-50 text-maxblue-800 px-2 py-0.5 rounded-full border border-maxblue-200">
                  {user?.patient?.patientCode || 'PAT-1001'}
                </span>
              </h1>
              <p className="text-[11px] text-slate-400">Welcome, {user?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Blood Group */}
            {user?.patient?.bloodGroup && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                {user.patient.bloodGroup}
              </span>
            )}

            {/* Sign Out */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 flex gap-2 overflow-x-auto py-2">
          {[
            { id: 'overview', label: 'My Health Overview', icon: Activity },
            { id: 'appointments', label: `My Appointments (${appointments.length})`, icon: Calendar },
            { id: 'records', label: `Rishi Prescriptions & EMR (${records.length})`, icon: ClipboardList },
            { id: 'bills', label: `My Bills & Payments (${bills.length})`, icon: Receipt },
            { id: 'doctors', label: `Rishi Specialists (${doctors.length})`, icon: Stethoscope },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-maxorange-500 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Patient Content Area */}
      <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1 space-y-6">
        
        {/* ==================== TAB 1: OVERVIEW ==================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Patient Hero Card */}
            <div className="bg-gradient-to-r from-sky-700 via-sky-600 to-sky-500 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-sky-500">
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full bg-white/20 text-white border border-white/30">
                  Rishi Healthcare Digital ID
                </span>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                  Welcome, {user?.name}!
                </h2>
                <p className="text-xs text-sky-50 max-w-xl leading-relaxed">
                  Your electronic medical records, active doctor prescriptions, laboratory diagnostic reports, and hospital invoices at Rishi Healthcare.
                </p>
                <div className="flex flex-wrap gap-4 text-xs pt-2 text-sky-50">
                  <div>
                    <span className="text-white font-bold">Rishi Code:</span>{' '}
                    <span className="font-mono font-bold text-white">{user?.patient?.patientCode}</span>
                  </div>
                  <div>
                    <span className="text-white font-bold">Phone:</span>{' '}
                    <span className="font-bold text-white">{user?.patient?.phone}</span>
                  </div>
                  <div>
                    <span className="text-white font-bold">Blood Group:</span>{' '}
                    <span className="font-bold text-white">{user?.patient?.bloodGroup || 'O+'}</span>
                  </div>
                </div>
              </div>

              <div>
                <button
                  onClick={() => setIsBookModalOpen(true)}
                  className="px-6 py-3 rounded-2xl bg-maxorange-500 hover:bg-maxorange-600 text-white font-black text-xs shadow-lg shadow-maxorange-500/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
                >
                  <Calendar className="w-4 h-4" />
                  Book New Consultation
                </button>
              </div>
            </div>

            {/* Overview KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                onClick={() => handleSelectTab('appointments')}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-maxorange-400 transition-all"
              >
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold uppercase tracking-wider">Upcoming Visits</span>
                  <div className="w-9 h-9 rounded-xl bg-orange-50 text-maxorange-600 flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-maxblue-800 mt-2">
                  {upcomingAppointments.length}
                </div>
                <div className="text-xs text-maxorange-600 font-semibold mt-1 flex items-center gap-1">
                  View scheduled visits <ArrowRight className="w-3 h-3" />
                </div>
              </div>

              <div
                onClick={() => handleSelectTab('records')}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-maxorange-400 transition-all"
              >
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold uppercase tracking-wider">Prescriptions (Rx)</span>
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-maxblue-800 flex items-center justify-center">
                    <Pill className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-maxblue-800 mt-2">
                  {records.length}
                </div>
                <div className="text-xs text-maxblue-800 font-semibold mt-1 flex items-center gap-1">
                  View medication routine <ArrowRight className="w-3 h-3" />
                </div>
              </div>

              <div
                onClick={() => handleSelectTab('bills')}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-maxorange-400 transition-all"
              >
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold uppercase tracking-wider">Outstanding Balance</span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 mt-2">
                  ₹{totalDue.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                  {unpaidBills.length > 0 ? 'Pay online now' : 'All settled'} <ArrowRight className="w-3 h-3" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold uppercase tracking-wider">Rishi Hospital Unit</span>
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-base font-black text-maxblue-800 mt-2">
                  Rishi Saket, New Delhi
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Super Speciality Campus
                </div>
              </div>
            </div>

            {/* Next Scheduled Appointment Highlight */}
            {upcomingAppointments.length > 0 && (
              <div className="bg-white rounded-2xl border border-maxorange-200 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-maxorange-500" />
                    <h3 className="text-sm font-bold text-slate-900">Your Next Scheduled OPD Consultation</h3>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-maxblue-100 text-maxblue-800 uppercase">
                    {upcomingAppointments[0].status}
                  </span>
                </div>

                <div className="bg-orange-50/40 p-4 rounded-xl border border-orange-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-extrabold text-maxblue-800">
                      {upcomingAppointments[0].doctor?.user?.name}
                    </div>
                    <div className="text-xs font-semibold text-maxorange-600">
                      {upcomingAppointments[0].department?.name} • {upcomingAppointments[0].doctor?.specialization}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Reason: <span className="font-medium text-slate-800">{upcomingAppointments[0].reason}</span>
                    </div>
                  </div>

                  <div className="text-left md:text-right">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 md:justify-end">
                      <Calendar className="w-4 h-4 text-maxorange-500" />
                      {new Date(upcomingAppointments[0].appointmentDate).toLocaleDateString('en-IN', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                    <div className="text-xs text-slate-500 font-semibold mt-0.5 flex items-center gap-1 md:justify-end">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {upcomingAppointments[0].timeSlot}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 2: MY APPOINTMENTS ==================== */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-maxblue-800 tracking-tight flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-maxorange-500" />
                  My Scheduled Appointments at Rishi Healthcare
                </h2>
                <p className="text-xs text-slate-500">Track consultation times and status with hospital doctors</p>
              </div>

              <button
                onClick={() => setIsBookModalOpen(true)}
                className="px-4 py-2 bg-maxorange-500 hover:bg-maxorange-600 text-white rounded-xl text-xs font-bold shadow transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                Book Consultation
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">APT Number</th>
                      <th className="py-3 px-4">Doctor & Department</th>
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4">Reason</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {appointments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          No appointments found. Click "Book Consultation" to schedule one!
                        </td>
                      </tr>
                    ) : (
                      appointments.map((apt) => (
                        <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-maxorange-600">{apt.appointmentNumber}</td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{apt.doctor?.user?.name}</div>
                            <div className="text-[11px] text-maxblue-800 font-medium">{apt.department?.name}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-800">
                              {new Date(apt.appointmentDate).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {apt.timeSlot}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 max-w-xs truncate text-slate-700">{apt.reason}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                apt.status === 'CONFIRMED'
                                  ? 'bg-blue-100 text-blue-700'
                                  : apt.status === 'COMPLETED'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : apt.status === 'PENDING'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-rose-100 text-rose-700'
                              }`}
                            >
                              {apt.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {apt.status === 'PENDING' || apt.status === 'CONFIRMED' ? (
                              <button
                                onClick={() => handleCancelAppointment(apt.id)}
                                className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold"
                              >
                                Cancel
                              </button>
                            ) : (
                              <span className="text-slate-400 text-xs">-</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: MEDICAL RECORDS & PRESCRIPTIONS ==================== */}
        {activeTab === 'records' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-extrabold text-maxblue-800 tracking-tight flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-maxorange-500" />
                My Electronic Medical Records & Rishi Prescriptions (Rx)
              </h2>
              <p className="text-xs text-slate-500">Official clinician diagnoses, recorded vitals, and medication instructions</p>
            </div>

            {records.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-xs text-slate-400">
                No clinical records on file yet. Once your doctor enters diagnoses and prescribes medicines, they will appear here.
              </div>
            ) : (
              <div className="space-y-4">
                {records.map((rec) => (
                  <div key={rec.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                      <div>
                        <span className="text-xs font-bold text-maxorange-600">Consultation Date: </span>
                        <span className="text-xs font-semibold text-slate-800">
                          {new Date(rec.recordDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Stethoscope className="w-4 h-4 text-maxorange-500" />
                        {rec.doctor?.user?.name} ({rec.doctor?.department?.name})
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="font-bold text-slate-900 text-sm">
                        Diagnosis: <span className="text-maxblue-800">{rec.diagnosis}</span>
                      </div>
                      {rec.symptoms && (
                        <div className="text-slate-600">
                          <span className="font-semibold">Symptoms:</span> {rec.symptoms}
                        </div>
                      )}
                    </div>

                    {/* Vitals */}
                    {(rec.vitalsBp || rec.vitalsPulse || rec.vitalsTemp) && (
                      <div className="flex flex-wrap gap-2 text-xs font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        {rec.vitalsBp && <span>BP: {rec.vitalsBp}</span>}
                        {rec.vitalsPulse && <span>Pulse: {rec.vitalsPulse}</span>}
                        {rec.vitalsTemp && <span>Temp: {rec.vitalsTemp}</span>}
                        {rec.vitalsWeight && <span>Weight: {rec.vitalsWeight}</span>}
                      </div>
                    )}

                    {/* Doctor Notes */}
                    {rec.doctorNotes && (
                      <div className="text-xs text-slate-600 italic bg-orange-50/50 p-2.5 rounded-xl border border-orange-100">
                        Clinician Advice: "{rec.doctorNotes}"
                      </div>
                    )}

                    {/* Prescriptions */}
                    {rec.prescriptions?.map((p) => (
                      <div key={p.id} className="pt-2">
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2">
                          <Pill className="w-4 h-4 text-maxorange-500" />
                          Prescribed Medication Routine (Rishi Pharmacy)
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {p.items?.map((it) => (
                            <div key={it.id} className="p-2.5 rounded-xl border border-orange-100 bg-orange-50/40 text-xs">
                              <div className="font-bold text-slate-900">{it.medicineName}</div>
                              <div className="text-[11px] text-maxorange-700 font-semibold mt-0.5">
                                {it.dosage} • {it.frequency}
                              </div>
                              <div className="text-[10px] text-slate-500 mt-0.5">
                                For {it.durationDays} days {it.instructions ? `(${it.instructions})` : ''}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 4: MY BILLS ==================== */}
        {activeTab === 'bills' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-extrabold text-maxblue-800 tracking-tight flex items-center gap-2">
                <Receipt className="w-5 h-5 text-maxorange-500" />
                My Rishi Healthcare Invoices & Online Payments
              </h2>
              <p className="text-xs text-slate-500">Pay hospital bills securely, check outstanding balance, and print receipts</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Invoice #</th>
                      <th className="py-3 px-4">Date Issued</th>
                      <th className="py-3 px-4">Total Amount</th>
                      <th className="py-3 px-4">Paid Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Payment Method</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bills.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400">
                          No bills on file.
                        </td>
                      </tr>
                    ) : (
                      bills.map((bill) => (
                        <tr key={bill.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-maxorange-600">{bill.invoiceNumber}</td>
                          <td className="py-3.5 px-4 text-slate-600">
                            {new Date(bill.issueDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="py-3.5 px-4 font-extrabold text-slate-900">₹{bill.totalAmount}</td>
                          <td className="py-3.5 px-4 font-semibold text-emerald-700">₹{bill.paidAmount}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                bill.status === 'PAID'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {bill.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 font-medium">{bill.paymentMethod}</td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {bill.status !== 'PAID' && (
                                <button
                                  onClick={() => handlePayBill(bill.id, 'UPI')}
                                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs"
                                >
                                  Pay ₹{bill.totalAmount - bill.paidAmount}
                                </button>
                              )}
                              <button
                                onClick={() => setSelectedBill(bill)}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1"
                              >
                                <Printer className="w-3 h-3" />
                                Receipt
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 5: FIND DOCTORS ==================== */}
        {activeTab === 'doctors' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-extrabold text-maxblue-800 tracking-tight flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-maxorange-500" />
                Rishi Healthcare Clinicians & OPD Timings
              </h2>
              <p className="text-xs text-slate-500">Book direct appointments with top specialists across centers of excellence</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {doctors.map((doc, idx) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-maxorange-300 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative shrink-0">
                        <img
                          src={getDoctorImage(doc, idx)}
                          alt={doc.user?.name || 'Doctor'}
                          className="w-14 h-14 rounded-xl object-cover object-top border border-slate-100 shadow-sm"
                          loading="lazy"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            if (e.target.nextElementSibling) {
                              e.target.nextElementSibling.style.display = 'flex';
                            }
                          }}
                        />
                        <div
                          style={{ display: 'none' }}
                          className="w-14 h-14 rounded-xl bg-sky-600 text-white font-black text-lg items-center justify-center"
                        >
                          {doc.user?.name?.replace('Dr. ', '').charAt(0) || 'D'}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{doc.user?.name}</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-maxorange-700 border border-orange-200">
                          {doc.department?.name}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-slate-600">
                      <div className="font-semibold text-slate-800">{doc.specialization}</div>
                      <div className="text-[11px] text-slate-400 italic">{doc.qualification}</div>
                      <div className="pt-2 text-xs text-slate-700 flex justify-between font-semibold border-t border-slate-100 mt-2">
                        <span>Consultation Fee:</span>
                        <span className="text-maxblue-800 font-extrabold">₹{doc.consultationFee}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex justify-between">
                        <span>Hospital Location:</span>
                        <span>{doc.roomNo || 'Rishi Saket OPD'}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => openBookWithDoctor(doc)}
                    className="w-full mt-4 py-2 bg-maxorange-500 hover:bg-maxorange-600 text-white font-bold rounded-xl text-xs transition-colors"
                  >
                    Book with {doc.user?.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Book Appointment Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 bg-sky-900/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-maxorange-500" />
                Book Rishi Healthcare Consultation
              </h3>
              <button onClick={() => setIsBookModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBookAppointment} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Department *</label>
                <select
                  required
                  value={selectedDeptForBooking}
                  onChange={(e) => {
                    setSelectedDeptForBooking(e.target.value);
                    const docsInDept = doctors.filter((d) => d.departmentId === e.target.value);
                    if (docsInDept.length > 0) setSelectedDoctorForBooking(docsInDept[0].id);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                >
                  <option value="">-- Choose Department --</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Doctor *</label>
                <select
                  required
                  value={selectedDoctorForBooking}
                  onChange={(e) => setSelectedDoctorForBooking(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                >
                  <option value="">-- Choose Doctor --</option>
                  {doctors
                    .filter((d) => !selectedDeptForBooking || d.departmentId === selectedDeptForBooking)
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.user?.name} ({d.department?.name})
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={bookDate}
                    onChange={(e) => setBookDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time Slot *</label>
                  <select
                    value={bookSlot}
                    onChange={(e) => setBookSlot(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for Consultation *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Follow-up cardiac evaluation"
                  value={bookReason}
                  onChange={(e) => setBookReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Observed Symptoms (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Mild palpitations, cough"
                  value={bookSymptoms}
                  onChange={(e) => setBookSymptoms(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-maxorange-500 hover:bg-maxorange-600 text-white rounded-xl font-bold shadow-md shadow-maxorange-500/20"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bill Receipt Modal */}
      {selectedBill && (
        <div className="fixed inset-0 bg-sky-900/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400">Rishi Hospital Receipt</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print
                </button>
                <button onClick={() => setSelectedBill(null)} className="p-1 text-slate-400 hover:text-slate-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="text-center pb-2 border-b border-slate-100">
                <h3 className="font-extrabold text-maxblue-800 text-base">RISHI SUPER SPECIALITY HOSPITAL</h3>
                <p className="text-[11px] text-slate-500">Official Patient Receipt • GSTIN: 07AAACM9999F1Z2</p>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Invoice Number:</span>
                <span className="font-mono font-bold text-maxorange-600">{selectedBill.invoiceNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Total Amount:</span>
                <span className="font-extrabold text-slate-900">₹{selectedBill.totalAmount}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Paid Amount:</span>
                <span className="font-bold text-emerald-700">₹{selectedBill.paidAmount}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Payment Status:</span>
                <span className="font-bold uppercase text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {selectedBill.status} ({selectedBill.paymentMethod})
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedBill(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
