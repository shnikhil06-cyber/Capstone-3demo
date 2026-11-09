import React from 'react';
import {
  Users,
  Stethoscope,
  Calendar,
  BedDouble,
  DollarSign,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  FileText,
} from 'lucide-react';

export default function DashboardView({
  stats,
  recent,
  onNavigate,
  onOpenBookAppointment,
  onOpenRegisterPatient,
  onOpenAdmitPatient,
  onOpenCreateInvoice,
  onUpdateAppointmentStatus,
}) {
  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="bg-gradient-to-r from-sky-700 via-sky-600 to-sky-500 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold bg-teal-500/20 text-teal-200 border border-teal-400/30 px-3 py-1 rounded-full">
            Hospital Command Center
          </span>
          <h2 className="text-2xl font-extrabold mt-2 tracking-tight">
            Hospital Overview & Operations
          </h2>
          <p className="text-sm text-teal-100/80 mt-1 max-w-xl">
            Real-time management for inpatient wards, OPD clinics, pharmacy inventory, and billing operations.
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenRegisterPatient}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            New Patient
          </button>
          <button
            onClick={onOpenBookAppointment}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all backdrop-blur-sm"
          >
            <Calendar className="w-4 h-4" />
            Book Slot
          </button>
          <button
            onClick={onOpenAdmitPatient}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all backdrop-blur-sm"
          >
            <BedDouble className="w-4 h-4" />
            Admit Bed
          </button>
          <button
            onClick={onOpenCreateInvoice}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all backdrop-blur-sm"
          >
            <FileText className="w-4 h-4" />
            New Invoice
          </button>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Patients */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Patients</span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            {stats?.totalPatients ?? 0}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Active registered records</span>
          </div>
        </div>

        {/* Active Doctors */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Medical Staff</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            {stats?.totalDoctors ?? 0}
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            Across {stats?.totalDepartments ?? 0} departments
          </div>
        </div>

        {/* Bed Occupancy */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bed Occupancy</span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <BedDouble className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2 flex items-baseline gap-2">
            <span>{stats?.bedOccupancyRate ?? 0}%</span>
            <span className="text-xs text-slate-400 font-normal">
              ({stats?.occupiedBeds ?? 0}/{stats?.totalBeds ?? 0} occupied)
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-sky-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, stats?.bedOccupancyRate ?? 0)}%` }}
            />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Collected Revenue</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            ₹{(stats?.totalRevenue ?? 0).toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-amber-600 font-medium mt-1">
            ₹{(stats?.pendingReceivables ?? 0).toLocaleString('en-IN')} pending
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Appointments & Live Bed Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments Column (2 spans) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Upcoming & Today's Appointments</h3>
              <p className="text-xs text-slate-400">Scheduled consultations and doctor visits</p>
            </div>
            <button
              onClick={() => onNavigate('appointments')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-y border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Patient</th>
                  <th className="py-2.5 px-3">Doctor / Dept</th>
                  <th className="py-2.5 px-3">Date & Slot</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recent?.recentAppointments?.length ? (
                  recent.recentAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-800">{apt.patient?.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{apt.patient?.patientCode}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-700">{apt.doctor?.user?.name}</div>
                        <div className="text-[11px] text-teal-600 font-medium">{apt.doctor?.department?.name}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-700">
                          {new Date(apt.appointmentDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {apt.timeSlot}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
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
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {apt.status === 'PENDING' && (
                            <button
                              onClick={() => onUpdateAppointmentStatus(apt.id, 'CONFIRMED')}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              title="Confirm"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                          {apt.status !== 'COMPLETED' && apt.status !== 'CANCELLED' && (
                            <button
                              onClick={() => onUpdateAppointmentStatus(apt.id, 'COMPLETED')}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                              title="Complete"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400 text-xs">
                      No appointments recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Ward Admissions & Inventory Alert */}
        <div className="space-y-6">
          {/* Active Inpatients Widget */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Active Inpatient Beds</h3>
                <p className="text-[11px] text-slate-400">Currently occupied hospital beds</p>
              </div>
              <button
                onClick={() => onNavigate('rooms')}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700"
              >
                Ward Map
              </button>
            </div>

            <div className="space-y-2.5">
              {recent?.recentAdmissions?.length ? (
                recent.recentAdmissions.map((adm) => (
                  <div
                    key={adm.id}
                    className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-800">{adm.patient?.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {adm.bed?.room?.roomNumber} • Bed <span className="font-semibold text-teal-700">{adm.bed?.bedNumber}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 uppercase">
                      Admitted
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-xs text-slate-400">No active admissions currently</div>
              )}
            </div>
          </div>

          {/* Pharmacy Low-Stock Alert Widget */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">Low Stock Drugs</h3>
              </div>
              <button
                onClick={() => onNavigate('pharmacy')}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700"
              >
                Pharmacy
              </button>
            </div>

            <div className="space-y-2">
              {recent?.lowStockList?.length ? (
                recent.lowStockList.map((med) => (
                  <div
                    key={med.id}
                    className="p-2.5 rounded-xl border border-amber-100 bg-amber-50/40 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-800">{med.name}</div>
                      <div className="text-[10px] text-slate-500">{med.dosageForm} • {med.category}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-amber-700">{med.stock} left</span>
                      <div className="text-[10px] text-slate-400">Alert at ≤ {med.minStockAlert}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-xs text-emerald-600 font-medium">
                  All medicine stock levels are healthy!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

