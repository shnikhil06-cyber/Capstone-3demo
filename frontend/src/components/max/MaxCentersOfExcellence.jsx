import React from 'react';
import {
  Heart,
  Brain,
  Bone,
  Baby,
  Stethoscope,
  AlertCircle,
  Activity,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

const CENTERS = [
  {
    id: 'CARD',
    name: 'Cardiac Sciences',
    icon: Heart,
    color: 'from-rose-500 to-red-600',
    description: 'Advanced interventional cardiology, TAVR, robotic cardiac bypass, and cardiac electrophysiology.',
    treatments: ['Coronary Angioplasty', 'Heart Valve Surgery', 'Pacemaker & ICD', 'Pediatric Cardiology'],
  },
  {
    id: 'ONCO',
    name: 'Cancer Care / Oncology',
    icon: Activity,
    color: 'from-amber-500 to-orange-600',
    description: 'Comprehensive medical, surgical, and radiation oncology with CyberKnife robotic radiosurgery.',
    treatments: ['Robotic Cancer Resection', 'Bone Marrow Transplant', 'Targeted Immunotherapy', 'PET-CT Diagnostics'],
  },
  {
    id: 'NEUR',
    name: 'Neurosciences',
    icon: Brain,
    color: 'from-sky-500 to-blue-600',
    description: 'Comprehensive stroke center, robotic spine surgery, deep brain stimulation, and neuro-rehabilitation.',
    treatments: ['Acute Stroke Thrombectomy', 'Brain Tumor Surgery', 'Minimally Invasive Spine', 'Epilepsy Care'],
  },
  {
    id: 'ORTH',
    name: 'Orthopaedics & Joint Replacement',
    icon: Bone,
    color: 'from-blue-500 to-cyan-600',
    description: 'Robotic knee and hip replacement, sports medicine, complex trauma reconstruction, and arthroscopy.',
    treatments: ['Robotic Knee Replacement', 'Hip Arthroscopy', 'ACL / Ligament Repair', 'Spine Decompression'],
  },
  {
    id: 'PEDI',
    name: 'Paediatrics & Child Care',
    icon: Baby,
    color: 'from-emerald-500 to-teal-600',
    description: 'Level-III Neonatal Intensive Care Unit (NICU), pediatric cardiology, and adolescent health.',
    treatments: ['Neonatal Resuscitation', 'Pediatric Surgeries', 'Vaccination Schedule', 'Growth Tracking'],
  },
  {
    id: 'GMED',
    name: 'Internal Medicine & Diabetology',
    icon: Stethoscope,
    color: 'from-teal-600 to-emerald-700',
    description: 'Chronic diabetes management, hypertension, infectious diseases, and preventive annual health checkups.',
    treatments: ['Insulin Management', 'Lipid Disorders', 'Fever & Infection Care', 'Annual Wellness Check'],
  },
];

export default function MaxCentersOfExcellence({ onSelectSpeciality }) {
  return (
    <section id="specialities" className="py-16 md:py-24 bg-white px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-maxorange-500 bg-maxorange-50 px-3 py-1 rounded-full border border-maxorange-200">
            World-Class Medical Disciplines
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-maxblue-800 tracking-tight mt-3">
            Centers of Clinical Excellence
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-2 leading-relaxed">
            Leading super-speciality divisions equipped with state-of-the-art robotic medical technology and globally certified faculty.
          </p>
        </div>

        {/* Centers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CENTERS.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.id}
                className="bg-white rounded-3xl border border-slate-200 hover:border-maxorange-300 p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${c.color} text-white flex items-center justify-center shadow-md`}>
                      <Icon className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {c.id}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-maxblue-800 group-hover:text-maxorange-600 transition-colors">
                    {c.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{c.description}</p>

                  {/* Top Key Procedures */}
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Key Clinical Procedures:
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 text-[11px] font-semibold text-slate-700">
                      {c.treatments.map((t, idx) => (
                        <div key={idx} className="flex items-center gap-1 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-maxorange-500 shrink-0"></span>
                          <span className="truncate">{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectSpeciality && onSelectSpeciality(c.name)}
                  className="mt-6 w-full py-2.5 bg-slate-50 hover:bg-maxorange-50 text-maxblue-800 hover:text-maxorange-600 font-bold rounded-xl text-xs border border-slate-200 hover:border-maxorange-200 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Consult {c.name} Specialists</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

