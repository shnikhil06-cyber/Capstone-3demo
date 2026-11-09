import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  Search,
  Plus,
  Mail,
  Phone,
  Clock,
  DoorOpen,
  DollarSign,
  Award,
  CheckCircle,
  XCircle,
  X,
  Trash2,
} from 'lucide-react';
import { api } from '../../services/api.js';
import { getDoctorImage } from '../../services/doctorImages.js';

export default function DoctorsView({ onBookAppointmentWithDoctor }) {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Add Doctor Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    departmentId: '',
    specialization: '',
    qualification: '',
    experienceYears: 5,
    consultationFee: 800,
    roomNo: 'OPD-101',
    workingHours: '09:00 AM - 04:00 PM',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [docs, depts] = await Promise.all([
        api.getDoctors({
          q: search || undefined,
          departmentId: departmentFilter !== 'ALL' ? departmentFilter : undefined,
        }),
        api.getDepartments(),
      ]);
      setDoctors(docs);
      setDepartments(depts);
      if (depts.length > 0 && !formData.departmentId) {
        setFormData((prev) => ({ ...prev, departmentId: depts[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, departmentFilter]);

  const handleCreateDoctor = async (e) => {
    e.preventDefault();
    try {
      await api.createDoctor(formData);
      setIsAddOpen(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        departmentId: departments[0]?.id || '',
        specialization: '',
        qualification: '',
        experienceYears: 5,
        consultationFee: 800,
        roomNo: 'OPD-101',
        workingHours: '09:00 AM - 04:00 PM',
      });
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleAvailability = async (id, currentStatus) => {
    try {
      await api.updateDoctor(id, { isAvailable: !currentStatus });
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteDoctor = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove doctor "${name}"?`)) return;
    try {
      await api.deleteDoctor(id);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-teal-600" />
            Medical Specialists & Physicians
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            View consultant credentials, OPD schedules, fees, and manage departmental appointments.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Add Doctor Profile
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by doctor name, specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Department:</span>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading doctor profiles...</div>
      ) : doctors.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400">No doctors found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {doctors.map((doc, idx) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-teal-300 hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div>
                {/* Doctor Card Top */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={getDoctorImage(doc, idx)}
                        alt={doc.user?.name || 'Doctor'}
                        className="w-12 h-12 rounded-xl object-cover object-top border border-slate-100 shadow-sm"
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
                        className="w-12 h-12 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 text-white font-extrabold text-lg items-center justify-center shadow-sm"
                      >
                        {doc.user?.name?.replace('Dr. ', '').charAt(0) || 'D'}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{doc.user?.name}</h3>
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200 mt-0.5">
                        {doc.department?.name}
                      </span>
                    </div>
                  </div>

                  {/* Availability Badge Button */}
                  <button
                    onClick={() => handleToggleAvailability(doc.id, doc.isAvailable)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 border transition-all ${
                      doc.isAvailable
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                    }`}
                    title="Click to toggle availability"
                  >
                    {doc.isAvailable ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Available
                      </>
                    ) : (
                      'On Leave'
                    )}
                  </button>
                </div>

                {/* Details */}
                <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                  <div className="font-semibold text-slate-800">{doc.specialization}</div>
                  <div className="text-[11px] text-slate-500 italic">{doc.qualification}</div>

                  <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] border-t border-slate-100 mt-3">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Award className="w-3.5 h-3.5 text-teal-600" />
                      <span>{doc.experienceYears} yrs experience</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                      <DollarSign className="w-3.5 h-3.5 text-teal-600" />
                      <span>₹{doc.consultationFee} fee</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <DoorOpen className="w-3.5 h-3.5 text-teal-600" />
                      <span>{doc.roomNo || 'OPD-101'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      <span className="truncate">{doc.workingHours}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onBookAppointmentWithDoctor && onBookAppointmentWithDoctor(doc)}
                  className="flex-1 py-1.5 px-3 bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold rounded-xl text-xs transition-colors text-center"
                >
                  Book Appointment
                </button>
                <button
                  onClick={() => handleDeleteDoctor(doc.id, doc.user?.name)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Remove Doctor"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Doctor Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-sky-900/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-teal-600" />
                Add New Doctor & Login
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDoctor} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Doctor Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Samir Joshi"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email (for Login) *</label>
                  <input
                    type="email"
                    required
                    placeholder="doctor@hospital.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98111 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department *</label>
                  <select
                    required
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Specialization *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Spine Surgery"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Qualifications *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MBBS, MS (Orthopedics), MCh"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fee (₹)</label>
                  <input
                    type="number"
                    value={formData.consultationFee}
                    onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">OPD Room</label>
                  <input
                    type="text"
                    value={formData.roomNo}
                    onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Working Hours</label>
                <input
                  type="text"
                  value={formData.workingHours}
                  onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-md shadow-teal-600/20"
                >
                  Save Doctor Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

