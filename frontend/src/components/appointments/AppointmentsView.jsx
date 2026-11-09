import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Search,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Trash2,
  X,
  Filter,
} from 'lucide-react';
import { api } from '../../services/api.js';

export default function AppointmentsView({ preselectedDoctor, preselectedPatient, onOpenMedicalRecord }) {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [doctorFilter, setDoctorFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');

  // Book Appointment Modal
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    departmentId: '',
    appointmentDate: new Date().toISOString().split('T')[0],
    timeSlot: '10:00 AM',
    type: 'CONSULTATION',
    reason: '',
    symptoms: '',
    notes: '',
  });

  const loadAll = async () => {
    setLoading(true);
    try {
      const [apts, pts, docs, depts] = await Promise.all([
        api.getAppointments({
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
          doctorId: doctorFilter !== 'ALL' ? doctorFilter : undefined,
          date: dateFilter || undefined,
        }),
        api.getPatients(),
        api.getDoctors(),
        api.getDepartments(),
      ]);
      setAppointments(apts);
      setPatients(pts);
      setDoctors(docs);
      setDepartments(depts);

      // Preselect if provided
      if (preselectedDoctor) {
        setFormData((prev) => ({
          ...prev,
          doctorId: preselectedDoctor.id,
          departmentId: preselectedDoctor.departmentId,
        }));
        setIsBookOpen(true);
      }
      if (preselectedPatient) {
        setFormData((prev) => ({ ...prev, patientId: preselectedPatient.id }));
        setIsBookOpen(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [statusFilter, doctorFilter, dateFilter]);

  const handleDoctorChange = (doctorId) => {
    const doc = doctors.find((d) => d.id === doctorId);
    setFormData((prev) => ({
      ...prev,
      doctorId,
      departmentId: doc?.departmentId || prev.departmentId,
    }));
  };

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      await api.createAppointment(formData);
      setIsBookOpen(false);
      setFormData({
        patientId: '',
        doctorId: '',
        departmentId: '',
        appointmentDate: new Date().toISOString().split('T')[0],
        timeSlot: '10:00 AM',
        type: 'CONSULTATION',
        reason: '',
        symptoms: '',
        notes: '',
      });
      loadAll();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.updateAppointmentStatus(id, status);
      loadAll();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this appointment record?')) return;
    try {
      await api.deleteAppointment(id);
      loadAll();
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
            <CalendarIcon className="w-6 h-6 text-teal-600" />
            Appointment Scheduling & Consultations
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Book OPD consultation slots, track clinical visits, and manage appointment workflows.
          </p>
        </div>

        <button
          onClick={() => setIsBookOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Book Appointment
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-slate-600">
            <Filter className="w-3.5 h-3.5 text-teal-600" />
            Filters:
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {/* Doctor Filter */}
          <select
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
          >
            <option value="ALL">All Doctors</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.user?.name} ({d.department?.name})
              </option>
            ))}
          </select>

          {/* Date Filter */}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="text-[11px] text-teal-600 hover:underline font-semibold"
            >
              Clear Date
            </button>
          )}
        </div>

        <div className="text-slate-400 font-medium">
          Showing <span className="text-slate-800 font-bold">{appointments.length}</span> appointments
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">APT Number</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Doctor & Department</th>
                <th className="py-3 px-4">Scheduled Slot</th>
                <th className="py-3 px-4">Reason / Symptoms</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Loading appointments...
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No appointments match the selected filters.
                  </td>
                </tr>
              ) : (
                appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-700">{apt.appointmentNumber}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{apt.patient?.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {apt.patient?.patientCode} • {apt.patient?.phone}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{apt.doctor?.user?.name}</div>
                      <div className="text-[11px] text-teal-600 font-medium">{apt.department?.name}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">
                        {new Date(apt.appointmentDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {apt.timeSlot}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-medium text-slate-800 truncate">{apt.reason}</div>
                      {apt.symptoms && (
                        <div className="text-[11px] text-slate-400 truncate">Symptoms: {apt.symptoms}</div>
                      )}
                    </td>
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
                      <div className="flex items-center justify-end gap-1.5">
                        {apt.status === 'PENDING' && (
                          <button
                            onClick={() => handleStatusUpdate(apt.id, 'CONFIRMED')}
                            className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold"
                          >
                            Confirm
                          </button>
                        )}

                        {apt.status === 'CONFIRMED' && (
                          <button
                            onClick={() => {
                              if (onOpenMedicalRecord) {
                                onOpenMedicalRecord(apt);
                              } else {
                                handleStatusUpdate(apt.id, 'COMPLETED');
                              }
                            }}
                            className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold flex items-center gap-1"
                            title="Prescribe & Complete"
                          >
                            <FileText className="w-3 h-3" />
                            Prescribe / Done
                          </button>
                        )}

                        {apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED' && (
                          <button
                            onClick={() => handleStatusUpdate(apt.id, 'CANCELLED')}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            title="Cancel Appointment"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(apt.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          title="Delete Appointment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Book Appointment Modal */}
      {isBookOpen && (
        <div className="fixed inset-0 bg-sky-900/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-teal-600" />
                Book Consultation Appointment
              </h3>
              <button onClick={() => setIsBookOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBook} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Patient *</label>
                <select
                  required
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.patientCode} • {p.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Doctor *</label>
                <select
                  required
                  value={formData.doctorId}
                  onChange={(e) => handleDoctorChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                >
                  <option value="">-- Choose Doctor --</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.user?.name} — {d.department?.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Appointment Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time Slot *</label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="09:30 AM">09:30 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Consultation Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                >
                  <option value="CONSULTATION">General Consultation</option>
                  <option value="FOLLOW_UP">Follow Up Visit</option>
                  <option value="ROUTINE">Routine Wellness Check</option>
                  <option value="EMERGENCY">Acute Emergency</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary Reason for Visit *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. High fever for 3 days and severe dry cough"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Observed Symptoms (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Headache, chills, nausea"
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBookOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-md shadow-teal-600/20"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

