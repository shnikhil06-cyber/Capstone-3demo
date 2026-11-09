import React from 'react';
import {
  Users,
  BedDouble,
  Building2,
  HeartPulse,
  ShieldCheck,
  Award,
} from 'lucide-react';

export default function MaxStatsSection() {
  return (
    <section className="bg-sky-600 text-white py-16 px-4 sm:px-8 border-y border-sky-500">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-maxblue-700/60">
          <div className="pt-4 lg:pt-0">
            <div className="text-3xl sm:text-4xl font-black text-white">4,000+</div>
            <div className="text-xs font-bold text-sky-50 uppercase tracking-wider mt-1">Leading Doctors</div>
            <div className="text-[11px] text-sky-100 mt-0.5">Top Medical Specialists</div>
          </div>

          <div className="pt-4 lg:pt-0">
            <div className="text-3xl sm:text-4xl font-black text-white">3,400+</div>
            <div className="text-xs font-bold text-sky-50 uppercase tracking-wider mt-1">Hospital Beds</div>
            <div className="text-[11px] text-sky-100 mt-0.5">ICU & Inpatient Suites</div>
          </div>

          <div className="pt-4 lg:pt-0">
            <div className="text-3xl sm:text-4xl font-black text-white">17+</div>
            <div className="text-xs font-bold text-sky-50 uppercase tracking-wider mt-1">Hospitals</div>
            <div className="text-[11px] text-sky-100 mt-0.5">Delhi-NCR, Mumbai, Punjab</div>
          </div>

          <div className="pt-4 lg:pt-0">
            <div className="text-3xl sm:text-4xl font-black text-white">500,000+</div>
            <div className="text-xs font-bold text-sky-50 uppercase tracking-wider mt-1">Patients Treated</div>
            <div className="text-[11px] text-sky-100 mt-0.5">Annual Clinical Volume</div>
          </div>

          <div className="pt-4 lg:pt-0 col-span-2 lg:col-span-1">
            <div className="text-3xl sm:text-4xl font-black text-emerald-400">JCI & NABH</div>
            <div className="text-xs font-bold text-sky-50 uppercase tracking-wider mt-1">Gold Accreditations</div>
            <div className="text-[11px] text-sky-100 mt-0.5">International Quality Care</div>
          </div>
        </div>
      </div>
    </section>
  );
}

