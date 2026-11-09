import React from 'react';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Calendar,
  ClipboardList,
  BedDouble,
  Pill,
  Receipt,
  Building2,
  HeartPulse,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'patients', label: 'Patients', icon: Users },
  { id: 'doctors', label: 'Doctors', icon: Stethoscope },
  { id: 'appointments', label: 'Appointments', icon: Calendar },
  { id: 'medical-records', label: 'Medical Records', icon: ClipboardList },
  { id: 'rooms', label: 'Beds & Wards', icon: BedDouble },
  { id: 'pharmacy', label: 'Pharmacy', icon: Pill },
  { id: 'billing', label: 'Billing & Invoices', icon: Receipt },
  { id: 'departments', label: 'Departments', icon: Building2 },
];

export default function Sidebar({ activeTab, onSelectTab, stats }) {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Hospital Banner */}
      <div className="p-4 border-b border-slate-100">
        <div className="bg-gradient-to-br from-maxblue-50 to-slate-100 border border-maxblue-100 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <HeartPulse className="w-5 h-5 text-maxorange-400" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-black text-maxblue-800 truncate">Rishi Super Speciality</div>
            <div className="text-[11px] text-maxorange-600 font-bold truncate">Saket Campus • NABH/JCI</div>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Management
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-maxblue-50 text-maxblue-800 font-extrabold border-l-4 border-maxorange-500 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-maxorange-500 stroke-[2.5]' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {/* Badges for real-time counts */}
              {item.id === 'appointments' && stats?.todayAppointments !== undefined && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-maxorange-100 text-maxorange-700">
                  {stats.todayAppointments}
                </span>
              )}
              {item.id === 'rooms' && stats?.availableBeds !== undefined && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  {stats.availableBeds} avail
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-100 text-[11px] text-slate-400">
        <div className="flex items-center justify-between font-semibold text-slate-600">
          <span>Rishi Healthcare Network</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
        </div>
        <p className="mt-0.5 text-slate-400">PostgreSQL Connected</p>
      </div>
    </aside>
  );
}
