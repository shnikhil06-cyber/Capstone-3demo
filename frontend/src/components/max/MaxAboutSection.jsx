import React from 'react';
import RishiLogo from '../common/RishiLogo.jsx';
import {
  ShieldCheck,
  Award,
  Heart,
  Users,
  Building2,
  Stethoscope,
  Microscope,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Target,
  Compass,
  Activity,
  Bot,
  Zap,
} from 'lucide-react';

export default function MaxAboutSection({ onOpenBooking }) {
  const handleScroll = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const stats = [
    { label: 'Network Hospitals', value: '17+', desc: 'Quaternary super speciality hubs' },
    { label: 'Renowned Clinicians', value: '4,000+', desc: 'Globally trained specialists' },
    { label: 'Critical Care Beds', value: '1,500+', desc: 'Advanced Level 3 ICU setup' },
    { label: 'Patients Healed Annually', value: '3.5M+', desc: '99.4% clinical excellence rate' },
  ];

  const pillars = [
    {
      icon: <Award className="w-6 h-6 text-sky-600" />,
      title: 'Dual JCI & NABH Accreditation',
      desc: 'All flagship hospitals are certified by Joint Commission International (USA) and National Accreditation Board for Hospitals, ensuring zero-compromise patient safety and global clinical pathways.',
      tag: 'Global Safety Gold Standard',
    },
    {
      icon: <Microscope className="w-6 h-6 text-sky-600" />,
      title: 'Advanced Robotic Surgical Suites',
      desc: 'Equipped with fourth-generation Da Vinci Xi robotic surgical consoles, TrueBeam STx radiosurgery, and hybrid digital cath labs for sub-millimeter surgical precision and swift recovery.',
      tag: 'Cutting-Edge Technology',
    },
    {
      icon: <Users className="w-6 h-6 text-maxorange-600" />,
      title: 'Compassionate Patient-First Culture',
      desc: 'From our 24x7 Emergency response teams to Rishi@Home post-operative nursing, our 15,000+ caregivers are committed to treating every patient with dignity, warmth, and transparent ethics.',
      tag: 'Human Touch & Empathy',
    },
    {
      icon: <Target className="w-6 h-6 text-sky-600" />,
      title: 'Comprehensive Quaternary Care',
      desc: 'Integrated Centers of Excellence spanning Cardiology, Oncology, Neurosciences, Organ Transplants, and Orthopaedics provide complete end-to-end medical care under one roof.',
      tag: 'Multidisciplinary Boards',
    },
  ];

  const techHighlights = [
    {
      icon: <Bot className="w-5 h-5 text-sky-600" />,
      title: 'Da Vinci Xi Robotic Surgical System',
      detail: 'Fourth-generation 3D-HD robotic consoles for sub-millimeter surgical precision in Oncology and Urology.',
    },
    {
      icon: <Zap className="w-5 h-5 text-maxorange-500" />,
      title: 'TrueBeam STx Stereotactic Radiosurgery',
      detail: 'Advanced cancer radiation targeting tumors within fractions of a millimeter while sparing healthy tissue.',
    },
    {
      icon: <Activity className="w-5 h-5 text-sky-600" />,
      title: 'Intraoperative 3T MRI & Biplane Cath Lab',
      detail: 'Real-time brain and coronary vascular imaging during active surgery for optimal clinical outcomes.',
    },
  ];

  return (
    <section
      id="about"
      className="py-16 md:py-24 bg-white px-4 sm:px-8 border-t border-slate-200"
      style={{ scrollMarginTop: '110px' }}
    >
      <div className="max-w-7xl mx-auto space-y-14">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-black tracking-widest uppercase">
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            <span>About Rishi Healthcare Institute</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Compassionate Care. <br className="hidden sm:inline" />
            <span className="text-sky-600">Clinical Excellence.</span>
          </h2>

          <p className="text-xs md:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto font-medium">
            Founded with the singular purpose of providing world-class tertiary and quaternary medical care, Rishi Healthcare has grown to become India's most trusted hospital network, blending clinical acumen with genuine compassion.
          </p>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((st, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-white border border-slate-200 text-center hover:border-sky-300 hover:shadow-lg transition-all shadow-xs"
            >
              <div className="text-3xl md:text-4xl font-black text-sky-600 tracking-tight">
                {st.value}
              </div>
              <div className="text-xs font-extrabold text-slate-900 mt-1">{st.label}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{st.desc}</div>
            </div>
          ))}
        </div>

        {/* 4 Pillars of Excellence */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pil, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl border border-slate-200 bg-white hover:border-sky-300 hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {pil.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                    {pil.tag}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  {pil.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {pil.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Advanced Medical Technology & Infrastructure Strip */}
        <div className="bg-sky-50/60 rounded-3xl p-6 md:p-8 border border-sky-100 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 bg-sky-100 px-2.5 py-1 rounded-full border border-sky-200">
                Precision Equipment
              </span>
              <h3 className="text-xl font-black text-slate-900 tracking-tight mt-2">
                Pioneering Surgical & Diagnostic Technologies
              </h3>
            </div>
            <p className="text-xs text-slate-600 max-w-md leading-relaxed">
              Investing in the world's most advanced biomedical instrumentation to guarantee higher cure rates, reduced hospital stays, and minimal surgical scarring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {techHighlights.map((tech, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center mb-3 text-sky-600">
                    {tech.icon}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {tech.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                    {tech.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership & Clinical Governance Statement */}
        <div className="p-6 md:p-8 rounded-3xl bg-sky-50/70 border border-sky-200 flex flex-col sm:flex-row items-center gap-6 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Heart className="w-7 h-7 text-white" />
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-[10px] font-black uppercase tracking-wider text-sky-700">
              Medical Governance & Ethics
            </div>
            <p className="text-xs md:text-sm text-slate-800 font-medium italic leading-relaxed">
              "At Rishi Healthcare, every diagnosis and treatment plan is grounded in multidisciplinary clinical tumor boards, zero-compromise patient safety, and genuine empathy."
            </p>
            <div className="text-xs font-bold text-sky-900 pt-1">
              — Clinical Advisory Council, Rishi Super Speciality Hospitals
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-2 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => handleScroll('book-appointment')}
            className="px-6 py-3 rounded-xl bg-maxorange-500 hover:bg-maxorange-600 text-white font-black text-xs shadow-md transition-all hover:scale-[1.02] flex items-center gap-2"
          >
            <span>Book Doctor Consultation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll('specialities')}
            className="px-6 py-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs border border-sky-200 transition-all"
          >
            Explore Centers of Excellence
          </button>
          <button
            onClick={() => handleScroll('services')}
            className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 transition-all shadow-xs"
          >
            Rishi Lab & Diagnostics
          </button>
        </div>

      </div>
    </section>
  );
}
