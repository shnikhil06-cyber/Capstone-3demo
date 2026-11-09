import React, { useState } from 'react';
import {
  FlaskConical,
  Home,
  Bot,
  Globe2,
  PhoneCall,
  Clock,
  ArrowRight,
  ShieldCheck,
  Pill,
  CheckCircle2,
  Calendar,
  Sparkles,
  Phone,
  Truck,
  HeartPulse,
} from 'lucide-react';

const LAB_PACKAGES = [
  {
    id: 'whole-body',
    title: 'Comprehensive Whole Body Checkup',
    tag: 'Most Popular',
    testsCount: '85+ Parameters',
    price: '₹1,499',
    originalPrice: '₹3,500',
    discount: '57% OFF',
    tests: ['Complete Hemogram (CBC)', 'Lipid Profile (Cholesterol)', 'Liver Function Test (LFT)', 'Kidney Function Test (KFT)', 'HbA1c & Fasting Sugar', 'Thyroid Profile (T3, T4, TSH)'],
    badgeColor: 'bg-teal-600',
  },
  {
    id: 'heart-health',
    title: 'Advanced Cardiac Health Package',
    tag: 'Heart Care',
    testsCount: '62+ Parameters',
    price: '₹2,199',
    originalPrice: '₹4,800',
    discount: '54% OFF',
    tests: ['Lipid Profile Advanced', 'hs-CRP (Cardiac Risk)', 'High-Sensitivity Troponin-I', 'Serum Homocysteine', 'Apo A1 & Apo B Ratio', 'ECG & Fasting Blood Glucose'],
    badgeColor: 'bg-rose-600',
  },
  {
    id: 'diabetes-care',
    title: 'Complete Diabetes Monitoring Panel',
    tag: 'Metabolic Care',
    testsCount: '45+ Parameters',
    price: '₹899',
    originalPrice: '₹1,999',
    discount: '55% OFF',
    tests: ['HbA1c (Glycosylated Hemoglobin)', 'Fasting & PP Blood Glucose', 'Serum Creatinine & eGFR', 'Urine Microalbumin / Creatinine', 'Lipid Profile Screen'],
    badgeColor: 'bg-amber-600',
  },
  {
    id: 'senior-citizen',
    title: 'Senior Citizen Comprehensive Health',
    tag: 'Age 60+ Care',
    testsCount: '90+ Parameters',
    price: '₹2,499',
    originalPrice: '₹5,500',
    discount: '55% OFF',
    tests: ['Vitamin D3 & Vitamin B12', 'Bone Mineral Profile & Calcium', 'Complete Blood Count & ESR', 'Prostate Specific Antigen (PSA) / Pap Smear', 'Cardiac & Renal Panels'],
    badgeColor: 'bg-sky-600',
  },
];

export default function MaxServicesSection({ onOpenBooking }) {
  const [activeTab, setActiveTab] = useState('lab'); // 'lab' | 'home' | 'robotics' | 'emergency'
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [patientPhone, setPatientPhone] = useState('');
  const [patientAddress, setPatientAddress] = useState('');

  const handleBookPackage = (pkg) => {
    setSelectedPackage(pkg);
    setBookingSuccess(false);
  };

  const handleConfirmLabBooking = (e) => {
    e.preventDefault();
    if (!patientPhone) {
      alert('Please enter your mobile number for home sample collection.');
      return;
    }
    setBookingSuccess(true);
    setTimeout(() => {
      setSelectedPackage(null);
      setBookingSuccess(false);
      setPatientPhone('');
      setPatientAddress('');
    }, 3500);
  };

  return (
    <section id="services" className="py-16 md:py-24 bg-white px-4 sm:px-8 border-t border-slate-200">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-black uppercase tracking-widest text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Rishi Integrated Services
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-maxblue-800 tracking-tight mt-3">
            Rishi Lab & Healthcare Services
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-2 leading-relaxed">
            Continuous spectrum of diagnostic, clinical, and home recovery services designed around patient comfort, precision, and speed.
          </p>
        </div>

        {/* 4 Pillars of Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Rishi Lab */}
          <div className="p-6 rounded-3xl border border-teal-200 bg-teal-50/40 hover:border-teal-400 hover:shadow-lg transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform">
                <FlaskConical className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">
                  NABL Certified
                </span>
                <span className="text-[10px] font-bold text-emerald-600">Doorstep Sample</span>
              </div>
              <h3 className="text-base font-extrabold text-maxblue-800">Rishi Lab Diagnostics</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                NABL accredited diagnostics with automated pathology, digital reports in 6 hours, and certified home phlebotomy visits.
              </p>
            </div>
            <a
              href="#lab-packages"
              className="mt-5 pt-3 border-t border-teal-200 text-xs font-bold text-teal-700 flex items-center justify-between group-hover:text-teal-800"
            >
              <span>Explore 80+ Lab Packages</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Rishi@Home */}
          <div className="p-6 rounded-3xl border border-orange-200 bg-orange-50/40 hover:border-orange-400 hover:shadow-lg transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-maxorange-500 text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform">
                <Home className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
                  24x7 Available
                </span>
                <span className="text-[10px] font-bold text-slate-600">Home Care</span>
              </div>
              <h3 className="text-base font-extrabold text-maxblue-800">Rishi@Home Care</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Full ICU setup at home, specialized post-surgical nursing, physiotherapy, critical care monitoring, and medicine delivery.
              </p>
            </div>
            <a
              href="tel:01126515050"
              className="mt-5 pt-3 border-t border-orange-200 text-xs font-bold text-maxorange-600 flex items-center justify-between"
            >
              <span>Call Home Care Concierge</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Robotic Surgery */}
          <div className="p-6 rounded-3xl border border-sky-200 bg-sky-50/40 hover:border-sky-400 hover:shadow-lg transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                  Da Vinci Xi
                </span>
                <span className="text-[10px] font-bold text-sky-700">Sub-mm Precision</span>
              </div>
              <h3 className="text-base font-extrabold text-maxblue-800">Robotic Surgery Suites</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Fourth-generation robotic surgery consoles for complex oncology, urology, cardiac bypass, and minimal tissue disruption.
              </p>
            </div>
            <a
              href="#find-doctor"
              className="mt-5 pt-3 border-t border-sky-200 text-xs font-bold text-sky-700 flex items-center justify-between"
            >
              <span>Consult Robotic Surgeons</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Emergency & Trauma */}
          <div className="p-6 rounded-3xl border border-rose-200 bg-rose-50/40 hover:border-rose-400 hover:shadow-lg transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                  Level 1 Trauma
                </span>
                <span className="text-[10px] font-bold text-emerald-600">&lt; 12 Min Dispatch</span>
              </div>
              <h3 className="text-base font-extrabold text-maxblue-800">24x7 Emergency Helpline</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                GPS telemetry ACLS ambulances, immediate catheterization triage for acute heart attack, and comprehensive stroke recovery protocols.
              </p>
            </div>
            <a
              href="tel:1066"
              className="mt-5 pt-3 border-t border-rose-200 text-xs font-bold text-rose-700 flex items-center justify-between"
            >
              <span>Dial 1066 Emergency</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Featured Rishi Lab Packages */}
        <div id="lab-packages" className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-teal-700 flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5" />
                NABL Accredited Diagnostics
              </span>
              <h3 className="text-2xl md:text-3xl font-black text-maxblue-800 tracking-tight mt-1">
                Popular Rishi Lab Diagnostic Packages
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Free certified doorstep blood collection with fast digital reports sent to your phone and patient portal.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-teal-700 bg-teal-50 px-3.5 py-2 rounded-xl border border-teal-200 self-start sm:self-auto">
              <Truck className="w-4 h-4 text-teal-600" />
              <span>Doorstep Sample Pickup Available in Delhi NCR & Mumbai</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {LAB_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between hover:border-teal-400 hover:shadow-xl transition-all shadow-xs relative"
              >
                <div>
                  {/* Top Tag & Discount */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full text-white ${pkg.badgeColor}`}>
                      {pkg.tag}
                    </span>
                    <span className="text-[11px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {pkg.discount}
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-maxblue-800 tracking-tight leading-snug">
                    {pkg.title}
                  </h4>
                  <div className="text-xs font-bold text-teal-700 mt-1">
                    {pkg.testsCount} included
                  </div>

                  {/* Price */}
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900 tracking-tight">{pkg.price}</span>
                    <span className="text-xs text-slate-400 line-through">{pkg.originalPrice}</span>
                  </div>

                  {/* Tests List */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                    {pkg.tests.map((t, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <span className="leading-tight">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Booking Button */}
                <button
                  onClick={() => handleBookPackage(pkg)}
                  className="mt-6 w-full py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Home Collection</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Modal for Booking Lab Package */}
        {selectedPackage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => setSelectedPackage(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>

              {bookingSuccess ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-slate-800">
                    Home Collection Scheduled!
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Our Rishi Lab phlebotomist will contact you on <span className="font-bold text-slate-800">{patientPhone}</span> to confirm the appointment and fasting instructions.
                  </p>
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                      Package: {selectedPackage.title} ({selectedPackage.price})
                    </span>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                      Rishi Lab Doorstep Pickup
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-800">
                    Book {selectedPackage.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Special Package Price: <span className="font-black text-teal-700 text-sm">{selectedPackage.price}</span> (Inclusive of home visit & digital report)
                  </p>

                  <form onSubmit={handleConfirmLabBooking} className="mt-5 space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Contact Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Home Pickup Address (City / Area)
                      </label>
                      <input
                        type="text"
                        value={patientAddress}
                        onChange={(e) => setPatientAddress(e.target.value)}
                        placeholder="e.g. Flat 402, Saket, South Delhi"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>

                    <div className="pt-3">
                      <button
                        type="submit"
                        className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm Home Collection Request</span>
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-400 text-center mt-2">
                      Zero sample collection charges • Certified NABL sterile vacuum tubes
                    </p>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
