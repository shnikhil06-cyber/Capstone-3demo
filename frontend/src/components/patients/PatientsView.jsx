import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Heart,
  AlertCircle,
  FileText,
  Calendar,
  BedDouble,
  Receipt,
  X,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { api } from '../../services/api.js';

export default function PatientsView({ onBookAppointmentForPatient }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('ALL');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // New Patient Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'Male',
    age: '',
    bloodGroup: 'O+',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    allergies: '',
    chronicConditions: '',
  });

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const data = await api.getPatients({
        q: search || undefined,
        bloodGroup: bloodGroupFilter !== 'ALL' ? bloodGroupFilter : undefined,
      });
      setPatients(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [search, bloodGroupFilter]);

  const handleSelectPatient = async (patient) => {
    setSelectedPatient(patient);
    setLoadingDetails(true);
    try {
      const full = await api.getPatientById(patient.id);
      setPatientDetails(full);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCreatePatient = async (e) => {
    e.preventDefault();
    try {
      await api.createPatient(formData);
      setIsRegisterOpen(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        gender: 'Male',
        age: '',
        bloodGroup: 'O+',
        address: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        allergies: '',
        chronicConditions: '',
      });
      fetchPatients();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeletePatient = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete patient "${name}"?`)) return;
    try {
      await api.deletePatient(id);
      if (selectedPatient?.id === id) {
        setSelectedPatient(null);
        setPatientDetails(null);
      }
      fetchPatients();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-teal-600" />
            Patient Directory & Electronic Medical Records
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage demographics, medical histories, vitals, admissions, and prescriptions.
          </p>
        </div>

        <button
          onClick={() => setIsRegisterOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Register Patient
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, patient ID (PAT-...), phone or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Blood Group:</span>
          <select
            value={bloodGroupFilter}
            onChange={(e) => setBloodGroupFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Groups</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </div>
      </div>

      {/* Main Patients Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Patient Code</th>
                <th className="py-3 px-4">Name & Contact</th>
                <th className="py-3 px-4">Age / Gender</th>
                <th className="py-3 px-4">Blood Group</th>
                <th className="py-3 px-4">Inpatient Status</th>
                <th className="py-3 px-4">Allergies / Chronic</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Loading patients...
                  </td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No patients match your search.
                  </td>
                </tr>
              ) : (
                patients.map((p) => {
                  const isAdmitted = p.admissions && p.admissions.length > 0;
                  return (
                    <tr
                      key={p.id}
                      onClick={() => handleSelectPatient(p)}
                      className="hover:bg-teal-50/40 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-teal-700">{p.patientCode}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800 text-sm">{p.name}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {p.phone}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {p.age ? `${p.age} yrs` : 'N/A'} • {p.gender}
                      </td>
                      <td className="py-3 px-4">
                        {p.bloodGroup ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <Heart className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
                            {p.bloodGroup}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {isAdmitted ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 uppercase">
                            Room {p.admissions[0].bed?.room?.roomNumber} (Bed {p.admissions[0].bed?.bedNumber})
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Outpatient</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                        {p.allergies ? (
                          <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-medium border border-amber-200 mr-1">
                            {p.allergies}
                          </span>
                        ) : null}
                        {p.chronicConditions && (
                          <span className="text-slate-600 text-[11px]">{p.chronicConditions}</span>
                        )}
                        {!p.allergies && !p.chronicConditions && <span className="text-slate-400">None</span>}
                      </td>
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleSelectPatient(p)}
                            className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg font-semibold text-xs flex items-center gap-1"
                            title="View Full Profile"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Profile
                          </button>
                          <button
                            onClick={() => handleDeletePatient(p.id, p.name)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Patient"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Detail Drawer / Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-sky-900/30 backdrop-blur-xs z-50 flex justify-end">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-teal-600 text-white font-bold text-lg flex items-center justify-center">
                  {selectedPatient.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    {selectedPatient.name}
                    <span className="text-xs font-mono font-semibold bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
                      {selectedPatient.patientCode}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedPatient.age} yrs • {selectedPatient.gender} • Blood Group: {selectedPatient.bloodGroup || 'N/A'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedPatient(null);
                  setPatientDetails(null);
                }}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {loadingDetails ? (
                <div className="py-12 text-center text-xs text-slate-400">Loading complete medical record...</div>
              ) : patientDetails ? (
                <>
                  {/* Contact & Demographics */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <div className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-1">
                      Contact & Emergency Details
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-slate-600">
                      <div>
                        <span className="text-slate-400">Phone:</span> {patientDetails.phone}
                      </div>
                      <div>
                        <span className="text-slate-400">Email:</span> {patientDetails.email || 'N/A'}
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-400">Address:</span> {patientDetails.address || 'N/A'}
                      </div>
                      <div>
                        <span className="text-slate-400">Emergency Contact:</span>{' '}
                        {patientDetails.emergencyContactName || 'N/A'}
                      </div>
                      <div>
                        <span className="text-slate-400">Emergency Phone:</span>{' '}
                        {patientDetails.emergencyContactPhone || 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* Clinical Alert Card */}
                  <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/70 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-amber-800 mb-1">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      Known Allergies & Chronic Conditions
                    </div>
                    <div className="text-amber-900">
                      <span className="font-semibold">Allergies:</span> {patientDetails.allergies || 'None recorded'}
                    </div>
                    <div className="text-amber-900 mt-0.5">
                      <span className="font-semibold">Chronic Conditions:</span>{' '}
                      {patientDetails.chronicConditions || 'None recorded'}
                    </div>
                  </div>

                  {/* Medical Records & Prescriptions Tab */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-teal-600" />
                      Clinical Encounters & Prescriptions ({patientDetails.medicalRecords?.length || 0})
                    </h4>
                    {patientDetails.medicalRecords?.length > 0 ? (
                      <div className="space-y-3">
                        {patientDetails.medicalRecords.map((rec) => (
                          <div key={rec.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
                            <div className="flex items-center justify-between text-xs mb-2">
                              <span className="font-bold text-slate-900">{rec.diagnosis}</span>
                              <span className="text-slate-400">
                                {new Date(rec.recordDate).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 mb-2">
                              Attending: <span className="font-semibold text-slate-700">{rec.doctor?.user?.name}</span>
                            </div>
                            {rec.vitalsBp && (
                              <div className="flex flex-wrap gap-2 text-[11px] mb-2 bg-slate-50 p-2 rounded-lg font-mono">
                                <span className="text-slate-600">BP: {rec.vitalsBp}</span>
                                <span className="text-slate-600">Pulse: {rec.vitalsPulse}</span>
                                <span className="text-slate-600">Temp: {rec.vitalsTemp}</span>
                                <span className="text-slate-600">Wt: {rec.vitalsWeight}</span>
                              </div>
                            )}
                            {rec.doctorNotes && (
                              <p className="text-xs text-slate-600 italic bg-teal-50/50 p-2 rounded-lg border border-teal-100">
                                "{rec.doctorNotes}"
                              </p>
                            )}

                            {/* Prescriptions */}
                            {rec.prescriptions?.map((p) => (
                              <div key={p.id} className="mt-3 pt-3 border-t border-slate-100">
                                <div className="text-[11px] font-bold text-teal-700 uppercase mb-1">
                                  Prescribed Rx:
                                </div>
                                <div className="space-y-1">
                                  {p.items?.map((it) => (
                                    <div
                                      key={it.id}
                                      className="text-xs flex items-center justify-between bg-slate-50 p-1.5 rounded"
                                    >
                                      <span className="font-semibold text-slate-800">{it.medicineName}</span>
                                      <span className="text-slate-500 text-[11px]">
                                        {it.dosage} • {it.frequency} • {it.durationDays}d
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No medical records on file yet.</p>
                    )}
                  </div>

                  {/* Inpatient Admissions */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                      <BedDouble className="w-4 h-4 text-teal-600" />
                      Admission History ({patientDetails.admissions?.length || 0})
                    </h4>
                    {patientDetails.admissions?.length > 0 ? (
                      <div className="space-y-2">
                        {patientDetails.admissions.map((adm) => (
                          <div
                            key={adm.id}
                            className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs"
                          >
                            <div>
                              <div className="font-bold text-slate-800">
                                Room {adm.bed?.room?.roomNumber} (Bed {adm.bed?.bedNumber})
                              </div>
                              <div className="text-slate-500 text-[11px]">Reason: {adm.reason}</div>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                adm.status === 'ADMITTED'
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {adm.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No past inpatient admissions.</p>
                    )}
                  </div>
                </>
              ) : null}
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => {
                  if (onBookAppointmentForPatient) {
                    onBookAppointmentForPatient(selectedPatient);
                  }
                  setSelectedPatient(null);
                }}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow"
              >
                Book Appointment for {selectedPatient.name}
              </button>
              <button
                onClick={() => {
                  setSelectedPatient(null);
                  setPatientDetails(null);
                }}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register Patient Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 bg-sky-900/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-600" />
                Register New Patient
              </h3>
              <button
                onClick={() => setIsRegisterOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="patient@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    placeholder="35"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Residential Address</label>
                <input
                  type="text"
                  placeholder="Street, City, Postal Code"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Emergency Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Spouse / Parent"
                    value={formData.emergencyContactName}
                    onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Emergency Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 00000"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Known Allergies (if any)</label>
                <input
                  type="text"
                  placeholder="e.g. Penicillin, Sulfa, Peanuts"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Chronic Conditions (if any)</label>
                <input
                  type="text"
                  placeholder="e.g. Diabetes Type 2, Hypertension, Asthma"
                  value={formData.chronicConditions}
                  onChange={(e) => setFormData({ ...formData, chronicConditions: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-md shadow-teal-600/20"
                >
                  Register Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

