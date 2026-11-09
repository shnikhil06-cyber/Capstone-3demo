import React from 'react';
import {
  Stethoscope,
  Award,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  Star,
  CheckCircle,
} from 'lucide-react';
import { getDoctorImage } from '../../services/doctorImages.js';

export default function MaxDoctorsSection({ doctors = [], onBookDoctor }) {
  return (
    <section id="find-doctor" className="py-16 md:py-24 bg-slate-50 px-4 sm:px-8 border-y border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-maxorange-500 bg-maxorange-50 px-3 py-1 rounded-full border border-maxorange-200">
              India's Leading Specialists
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-maxblue-800 tracking-tight mt-3">
              Consult Renowned Rishi Clinicians
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-2 max-w-xl">
              Meet experienced department heads, robotic surgeons, and fellowship-trained international experts.
            </p>
          </div>

          <div className="text-xs font-bold text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs">
            Showing <span className="text-maxorange-600 font-extrabold">{doctors.length}</span> Verified Specialists
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc, idx) => (
            <div
              key={doc.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-maxblue-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Doctor Head */}
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={getDoctorImage(doc, idx)}
                      alt={doc.user?.name || 'Doctor'}
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover object-top border-2 border-slate-100 shadow-md group-hover:scale-105 transition-transform"
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
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-maxblue-800 to-maxblue-600 text-white font-black text-2xl items-center justify-center shadow-md shrink-0"
                    >
                      {doc.user?.name?.replace('Dr. ', '').charAt(0) || 'D'}
                    </div>
                    <span
                      className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-xs"
                      title="Available Today"
                    ></span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Verified Rishi Clinician</span>
                    </div>
                    <h3 className="font-extrabold text-maxblue-800 text-base mt-0.5">{doc.user?.name}</h3>
                    <div className="text-xs text-maxorange-600 font-semibold">{doc.department?.name}</div>
                    <div className="flex items-center gap-1 mt-1 text-[11px] text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-slate-700">4.9</span>
                      <span className="text-slate-400 font-normal">({85 + idx * 17} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="font-semibold text-slate-800 leading-snug">{doc.specialization}</div>
                  <div className="text-[11px] text-slate-400 italic line-clamp-2">{doc.qualification}</div>

                  <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Clinical Experience:</span>
                      <span className="font-bold text-slate-800">{doc.experienceYears}+ Years</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Consultation Fee:</span>
                      <span className="font-extrabold text-maxblue-800 text-sm">₹{doc.consultationFee}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Hospital Room:</span>
                      <span className="font-semibold text-slate-700">{doc.roomNo || 'Rishi Saket OPD'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">OPD Hours:</span>
                      <span className="font-semibold text-slate-700">{doc.workingHours}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Book Button */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => onBookDoctor && onBookDoctor(doc)}
                  className="w-full py-2.5 bg-maxorange-500 hover:bg-maxorange-600 text-white font-extrabold rounded-xl text-xs shadow-md shadow-maxorange-500/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Consultation Slot</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
