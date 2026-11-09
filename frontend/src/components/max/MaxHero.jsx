import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Search,
  Building,
  CreditCard,
  BedDouble,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  PhoneCall,
  User,
  HeartPulse,
} from 'lucide-react';
import { api } from '../../services/api.js';

export default function MaxHero({
  doctors = [],
  departments = [],
  onAppointmentBooked,
  stats,
  user,
  onRequireLogin,
}) {
  const [activeHeroTab, setActiveHeroTab] = useState('book'); // 'book' | 'find' | 'hospitals' | 'pay' | 'beds'

  // Booking Form State
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedDoc, setSelectedDoc] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [slot, setSlot] = useState('10:00 AM');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [reason, setReason] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [bookingError, setBookingError] = useState('');

  // Bill Search State
  const [billSearchCode, setBillSearchCode] = useState('MAX-INV-2026-001');
  const [foundBill, setFoundBill] = useState(null);
  const [billLoading, setBillLoading] = useState(false);
  const [billError, setBillError] = useState('');

  // Doctor search state
  const [doctorSearchQuery, setDoctorSearchQuery] = useState('');

  // If user is not logged in as a patient, ensure activeHeroTab is not 'pay'
  useEffect(() => {
    if (activeHeroTab === 'pay' && (!user || user.role !== 'PATIENT')) {
      setActiveHeroTab('book');
    }
  }, [user, activeHeroTab]);

  // Public Hero Tabs: "Pay Bill Online" is ONLY available for authenticated patients
  const heroTabs = [
    { id: 'book', label: 'Book an Appointment', icon: Calendar },
    { id: 'find', label: 'Find a Doctor', icon: Search },
    { id: 'hospitals', label: 'Our Hospitals', icon: Building },
    ...(user && user.role === 'PATIENT'
      ? [{ id: 'pay', label: 'Pay Bill Online', icon: CreditCard }]
      : []),
    { id: 'beds', label: 'Ward & ICU Beds', icon: BedDouble },
  ];

  const filteredDoctors = doctors.filter((doc) => {
    if (!doctorSearchQuery) return true;
    const q = doctorSearchQuery.toLowerCase();
    return (
      doc.user?.name?.toLowerCase().includes(q) ||
      doc.specialization?.toLowerCase().includes(q) ||
      doc.department?.name?.toLowerCase().includes(q)
    );
  });

  const handleFastBook = async (e) => {
    e.preventDefault();

    setBookingLoading(true);
    setBookingError('');
    setBookingSuccess(null);

    try {
      // 1. Check or register patient
      let patientId;
      if (user?.patient?.id) {
        patientId = user.patient.id;
      } else {
        const pts = await api.getPatients({ q: patientPhone || patientName });
        if (pts.length > 0) {
          patientId = pts[0].id;
        } else {
          const newPt = await api.createPatient({
            name: patientName,
            phone: patientPhone,
            gender: 'Other',
            age: 30,
            bloodGroup: 'O+',
          });
          patientId = newPt.id;
        }
      }

      // 2. Book appointment
      const doc = doctors.find((d) => d.id === selectedDoc) || doctors[0];
      const deptId = selectedDept || doc?.departmentId || departments[0]?.id;

      const apt = await api.createAppointment({
        patientId,
        doctorId: doc?.id,
        departmentId: deptId,
        appointmentDate: date,
        timeSlot: slot,
        type: 'CONSULTATION',
        reason: reason || 'Outpatient Consultation at Rishi Healthcare',
      });

      setBookingSuccess(apt);
      setPatientName('');
      setPatientPhone('');
      setReason('');
      if (onAppointmentBooked) onAppointmentBooked();
    } catch (err) {
      setBookingError(err.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleLookupBill = async (e) => {
    e.preventDefault();
    setBillLoading(true);
    setBillError('');
    setFoundBill(null);
    try {
      const bills = await api.getBills({ q: billSearchCode.trim() });
      if (bills.length > 0) {
        setFoundBill(bills[0]);
      } else {
        setBillError(`No invoice found matching "${billSearchCode}".`);
      }
    } catch (err) {
      setBillError(err.message);
    } finally {
      setBillLoading(false);
    }
  };

  const handlePayFoundBill = async () => {
    if (!foundBill) return;
    try {
      const updated = await api.payBill(foundBill.id, { paymentMethod: 'UPI' });
      setFoundBill(updated);
      alert('Payment settled successfully via Rishi Healthcare Instant Portal!');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-sky-700 via-sky-600 to-sky-500 text-white overflow-hidden py-12 md:py-20 px-4 sm:px-8">
      {/* Background Decor Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-maxorange-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Headline Section */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white font-extrabold text-xs mb-4 border border-white/10 backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-white" />
            <span>NABH & JCI Accredited Super Speciality Network</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
            Compassionate Care. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-sky-100">
              Clinical Excellence.
            </span>
          </h1>

          <p className="mt-3 text-sm md:text-base text-sky-50 leading-relaxed font-medium">
            India's most trusted quaternary healthcare institution with 17+ world-class super speciality hospitals, 4,000+ renowned clinicians, and advanced robotic surgical systems.
          </p>
        </div>

        {/* Floating Quick Action Widget (Signature Max Healthcare style) */}
        <div className="bg-white rounded-3xl shadow-2xl text-slate-800 overflow-hidden border border-slate-100">
          {/* Tabs Navigation Header */}
          <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto text-xs font-bold">
            {heroTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeHeroTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveHeroTab(tab.id)}
                  className={`flex-1 min-w-[150px] py-4 px-4 flex items-center justify-center gap-2 border-b-2 transition-all ${
                    isActive
                      ? 'border-maxorange-500 bg-white text-maxblue-800 font-extrabold shadow-xs'
                      : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-maxorange-500 stroke-[2.5]' : 'text-slate-400'
                    }`}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: Interactive Fast Book Appointment */}
          {activeHeroTab === 'book' && (
            <div className="p-6 md:p-8">
              {bookingSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-emerald-950">
                    Appointment Confirmed at Rishi Healthcare!
                  </h3>
                  <p className="text-xs text-emerald-800">
                    Your appointment number is{' '}
                    <span className="font-mono font-bold text-emerald-950 bg-emerald-100 px-2 py-0.5 rounded">
                      {bookingSuccess.appointmentNumber}
                    </span>
                  </p>
                  <div className="text-xs text-slate-600">
                    Doctor: <span className="font-bold">{bookingSuccess.doctor?.user?.name}</span> •{' '}
                    {bookingSuccess.department?.name} • Slot: {bookingSuccess.timeSlot}
                  </div>
                  <button
                    onClick={() => setBookingSuccess(null)}
                    className="mt-3 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all"
                  >
                    Book Another Consultation
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFastBook} className="space-y-4 text-xs">
                  {bookingError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-semibold">
                      {bookingError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Speciality */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Center of Excellence *</label>
                      <select
                        required
                        value={selectedDept}
                        onChange={(e) => {
                          setSelectedDept(e.target.value);
                          const d = doctors.filter((doc) => doc.departmentId === e.target.value);
                          if (d.length > 0) setSelectedDoc(d[0].id);
                        }}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-maxorange-500/20 focus:border-maxorange-500"
                      >
                        <option value="">-- Choose Speciality --</option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Doctor */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Select Doctor *</label>
                      <select
                        required
                        value={selectedDoc}
                        onChange={(e) => setSelectedDoc(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-maxorange-500/20 focus:border-maxorange-500"
                      >
                        <option value="">-- Choose Doctor --</option>
                        {doctors
                          .filter((d) => !selectedDept || d.departmentId === selectedDept)
                          .map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.user?.name}
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Date */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Preferred Date *</label>
                      <input
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-maxorange-500/20 focus:border-maxorange-500"
                      />
                    </div>

                    {/* Slot */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">OPD Slot *</label>
                      <select
                        value={slot}
                        onChange={(e) => setSlot(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-maxorange-500/20 focus:border-maxorange-500"
                      >
                        <option value="09:00 AM">09:00 AM (Morning)</option>
                        <option value="10:00 AM">10:00 AM (Morning)</option>
                        <option value="11:30 AM">11:30 AM (Morning)</option>
                        <option value="02:00 PM">02:00 PM (Afternoon)</option>
                        <option value="03:30 PM">03:30 PM (Evening)</option>
                        <option value="04:30 PM">04:30 PM (Evening)</option>
                      </select>
                    </div>
                  </div>

                  {/* Patient Details Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Patient Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kumar"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Primary Health Concern</label>
                      <input
                        type="text"
                        placeholder="e.g. Chest discomfort, Second opinion"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={bookingLoading}
                      className="px-8 py-3 bg-maxorange-500 hover:bg-maxorange-600 text-white font-black rounded-xl text-xs shadow-lg shadow-maxorange-500/30 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                    >
                      {bookingLoading ? 'Reserving Slot...' : 'Confirm Appointment Now'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Tab 2: Find a Doctor Search */}
          {activeHeroTab === 'find' && (
            <div className="p-6 md:p-8 space-y-4 text-xs">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search doctor by name (e.g. Dr. Balbir Sharma), speciality (Cardiology, Oncology), or clinical condition..."
                  value={doctorSearchQuery}
                  onChange={(e) => setDoctorSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-maxorange-500/20 focus:border-maxorange-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pt-2">
                {filteredDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{doc.user?.name}</div>
                      <div className="text-[11px] text-maxorange-600 font-semibold">{doc.specialization}</div>
                      <div className="text-[10px] text-slate-500">{doc.roomNo || 'Rishi Hospital OPD'} • Fee: ₹{doc.consultationFee}</div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedDoc(doc.id);
                        setSelectedDept(doc.departmentId);
                        setActiveHeroTab('book');
                      }}
                      className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold text-xs shrink-0"
                    >
                      Book Slot
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Our Hospitals */}
          {activeHeroTab === 'hospitals' && (
            <div className="p-6 md:p-8 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    name: 'Rishi Super Speciality Hospital, Saket',
                    city: 'South Delhi',
                    beds: '500+ Beds',
                    specialities: 'Cardiac, Oncology, Neuro, Organ Transplant',
                  },
                  {
                    name: 'Rishi Super Speciality Hospital, Pusa Road',
                    city: 'Pusa Road, Central Delhi',
                    beds: '650+ Beds',
                    specialities: 'Robotic Surgery, Bone Marrow, Liver Transplant',
                  },
                  {
                    name: 'Rishi Super Speciality Hospital, Mumbai',
                    city: 'Vile Parle, Mumbai',
                    beds: '350+ Beds',
                    specialities: 'Cancer Institute, Heart, Joint Replacement',
                  },
                  {
                    name: 'Rishi Super Speciality Hospital, Shalimar Bagh',
                    city: 'North Delhi',
                    beds: '400+ Beds',
                    specialities: 'Kidney Transplant, Mother & Child, Critical Care',
                  },
                ].map((h, i) => (
                  <div key={i} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-1.5">
                    <div className="text-[10px] font-extrabold uppercase text-maxorange-600">{h.city}</div>
                    <h4 className="font-extrabold text-slate-900 text-xs leading-snug">{h.name}</h4>
                    <p className="text-[11px] text-slate-500">{h.specialities}</p>
                    <div className="text-[10px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 inline-block mt-1">
                      {h.beds}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Pay Hospital Bill Online (Restricted strictly to Logged-in Patients) */}
          {user && user.role === 'PATIENT' && activeHeroTab === 'pay' && (
            <div className="p-6 md:p-8 text-xs space-y-4">
              <form onSubmit={handleLookupBill} className="flex gap-3">
                <input
                  type="text"
                  required
                  placeholder="Enter Max Invoice # (e.g. MAX-INV-2026-002) or Patient Name"
                  value={billSearchCode}
                  onChange={(e) => setBillSearchCode(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-maxorange-500/20 focus:border-maxorange-500"
                />
                <button
                  type="submit"
                  disabled={billLoading}
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
                >
                  {billLoading ? 'Searching...' : 'Check Bill'}
                </button>
              </form>

              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                <span>Quick Test Invoices:</span>
                <button
                  type="button"
                  onClick={() => setBillSearchCode('MAX-INV-2026-002')}
                  className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-mono font-bold hover:bg-amber-100 border border-amber-200 transition-all"
                >
                  MAX-INV-2026-002 (Unpaid ₹1,450)
                </button>
                <button
                  type="button"
                  onClick={() => setBillSearchCode('MAX-INV-2026-001')}
                  className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-mono font-bold hover:bg-emerald-100 border border-emerald-200 transition-all"
                >
                  MAX-INV-2026-001 (Paid ₹2,000)
                </button>
              </div>

              {billError && <div className="text-rose-600 font-semibold">{billError}</div>}

              {foundBill && (
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="font-mono text-maxorange-600 font-bold">{foundBill.invoiceNumber}</div>
                    <div className="text-sm font-bold text-slate-900">{foundBill.patient?.name}</div>
                    <div className="text-[11px] text-slate-500">
                      Total: ₹{foundBill.totalAmount} • Paid: ₹{foundBill.paidAmount} •{' '}
                      <span className="font-bold text-rose-600">
                        Balance Due: ₹{foundBill.totalAmount - foundBill.paidAmount}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${
                        foundBill.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {foundBill.status}
                    </span>

                    {foundBill.status !== 'PAID' && (
                      <button
                        onClick={handlePayFoundBill}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
                      >
                        Settle Payment (₹{foundBill.totalAmount - foundBill.paidAmount})
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 5: Real-time Ward & ICU Bed Status */}
          {activeHeroTab === 'beds' && (
            <div className="p-6 md:p-8 text-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Live Hospital Bed Availability Status</h3>
                  <p className="text-[11px] text-slate-400">Directly synchronized with Inpatient Admission Desk</p>
                </div>
                <div className="flex items-center gap-2 font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  Live Ward Tracker
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="text-slate-500 font-bold uppercase text-[10px]">Total Beds Capacity</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">{stats?.totalBeds || 11} Beds</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Across ICU, Deluxe & General Wards</div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-emerald-50/50">
                  <div className="text-emerald-700 font-bold uppercase text-[10px]">Beds Ready for Admission</div>
                  <div className="text-2xl font-black text-emerald-700 mt-1">{stats?.availableBeds || 9} Beds</div>
                  <div className="text-[11px] text-emerald-600 mt-0.5">Sanitized & Available immediately</div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-rose-50/50">
                  <div className="text-rose-700 font-bold uppercase text-[10px]">Currently Occupied</div>
                  <div className="text-2xl font-black text-rose-700 mt-1">{stats?.occupiedBeds || 2} Beds</div>
                  <div className="text-[11px] text-rose-600 mt-0.5">Under Active Inpatient Observation</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
