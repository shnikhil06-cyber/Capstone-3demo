import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Bed,
  ShieldCheck,
  Award,
  ArrowRight,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

const HOSPITALS_DATA = [
  {
    id: 'saket',
    name: 'Rishi Super Speciality Hospital, Saket',
    city: 'Delhi NCR',
    area: 'Saket, South Delhi',
    address: '1, 2, Press Enclave Marg, Saket Institutional Area, New Delhi 110017',
    beds: '530+ Beds',
    icuBeds: '160 Critical Care Beds',
    emergency: '011-26515050',
    accreditation: 'JCI & NABH Gold',
    specialities: ['Cardiac Sciences', 'Robotic Oncology', 'Neurosciences', 'Kidney & Liver Transplant'],
    tag: 'Flagship Quaternary Center',
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'pusa-road',
    name: 'Rishi Super Speciality Hospital, Pusa Road',
    city: 'Delhi NCR',
    area: 'Karol Bagh / Pusa Road, Central Delhi',
    address: 'Building No. 8A, Pusa Road, Metro Pillar 130, New Delhi 110005',
    beds: '350+ Beds',
    icuBeds: '95 Critical Care Beds',
    emergency: '011-26515051',
    accreditation: 'NABH & NABL',
    specialities: ['Bone Marrow Transplant', 'Medical Oncology', 'Gastroenterology', 'Orthopaedics'],
    tag: 'Oncology & Transplant Center',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'mumbai',
    name: 'Rishi Super Speciality Hospital, Mumbai',
    city: 'Mumbai',
    area: 'Vile Parle West, Mumbai',
    address: 'S.V. Road, Near Milan Subway, Vile Parle West, Mumbai, Maharashtra 400056',
    beds: '420+ Beds',
    icuBeds: '120 Critical Care Beds',
    emergency: '022-68310000',
    accreditation: 'JCI & NABH',
    specialities: ['Advanced Neurosciences', 'Minimal Access Surgery', 'Cardiothoracic Surgery', 'Pediatrics'],
    tag: 'Western Region Apex Center',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'gurugram',
    name: 'Rishi Super Speciality Hospital, Gurugram',
    city: 'Delhi NCR',
    area: 'Sushant Lok 1, Gurugram',
    address: 'B-Block, Sushant Lok 1, Sector 43, Gurugram, Haryana 122001',
    beds: '300+ Beds',
    icuBeds: '80 Critical Care Beds',
    emergency: '0124-6623000',
    accreditation: 'NABH Accredited',
    specialities: ['Level 1 Trauma Center', 'Robotic Joint Replacement', 'Mother & Child Care', 'Pulmonology'],
    tag: 'Trauma & Robotic Center',
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'shalimar-bagh',
    name: 'Rishi Super Speciality Hospital, Shalimar Bagh',
    city: 'Delhi NCR',
    area: 'Shalimar Bagh, North Delhi',
    address: 'FC-50, C&D Block, Shalimar Bagh, New Delhi 110088',
    beds: '280+ Beds',
    icuBeds: '75 Critical Care Beds',
    emergency: '011-66422222',
    accreditation: 'NABH Accredited',
    specialities: ['Radiation Oncology', 'Advanced Urology', 'Vascular Surgery', 'Bariatric Surgery'],
    tag: 'Cancer & Minimally Invasive Hub',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'patparganj',
    name: 'Rishi Super Speciality Hospital, Patparganj',
    city: 'Delhi NCR',
    area: 'Patparganj, East Delhi',
    address: '108A, I.P. Extension, Patparganj, Delhi 110092',
    beds: '400+ Beds',
    icuBeds: '110 Critical Care Beds',
    emergency: '011-43033333',
    accreditation: 'NABH & NABL',
    specialities: ['Renal Sciences & Dialysis', 'Cardiovascular Surgery', 'Plastic Surgery', 'Critical Care'],
    tag: 'Apex Kidney & Cardiac Hub',
    image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'vaishali',
    name: 'Rishi Super Speciality Hospital, Vaishali',
    city: 'Delhi NCR',
    area: 'Sector 1, Vaishali, Ghaziabad',
    address: 'W-3, Sector-1, Vaishali, Ghaziabad, Uttar Pradesh 201012',
    beds: '370+ Beds',
    icuBeds: '100 Critical Care Beds',
    emergency: '0120-4188000',
    accreditation: 'NABH & Green OT',
    specialities: ['Emergency Medicine', 'Neurology & Stroke Unit', 'Endocrinology', 'Spine Surgery'],
    tag: 'Tertiary Care Leader',
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'dehradun',
    name: 'Rishi Super Speciality Hospital, Dehradun',
    city: 'Uttarakhand',
    area: 'Mussoorie Diversion Road, Dehradun',
    address: 'Mussoorie Diversion Road, Malsi, Dehradun, Uttarakhand 248003',
    beds: '220+ Beds',
    icuBeds: '60 Critical Care Beds',
    emergency: '0135-7193000',
    accreditation: 'NABH Accredited',
    specialities: ['Cardiac Interventions', 'Trauma Care', 'Nephrology', 'General Surgery'],
    tag: 'Foothills Healthcare Hub',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=80',
  },
];

export default function MaxHospitalsSection({ onSelectHospital }) {
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  const filterTabs = [
    { id: 'ALL', label: 'All Hospitals', count: HOSPITALS_DATA.length },
    { id: 'Delhi NCR', label: 'Delhi NCR', count: HOSPITALS_DATA.filter((h) => h.city === 'Delhi NCR').length },
    { id: 'Mumbai', label: 'Mumbai', count: HOSPITALS_DATA.filter((h) => h.city === 'Mumbai').length },
    { id: 'Uttarakhand', label: 'Uttarakhand', count: HOSPITALS_DATA.filter((h) => h.city === 'Uttarakhand').length },
  ];

  const filteredHospitals =
    selectedFilter === 'ALL'
      ? HOSPITALS_DATA
      : HOSPITALS_DATA.filter((h) => h.city === selectedFilter);

  const handleBookAtHospital = (hosp) => {
    if (onSelectHospital) {
      onSelectHospital(hosp.name);
    } else {
      const el = document.getElementById('book-appointment');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hospitals" className="py-16 md:py-24 bg-slate-50 px-4 sm:px-8 border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-black uppercase tracking-widest text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Network Directory
              </span>
              <span className="text-xs text-slate-400 font-semibold">• 17+ Quaternary Facilities</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-maxblue-800 tracking-tight">
              Rishi Super Speciality Hospitals
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-2 max-w-2xl leading-relaxed">
              India's premier healthcare institution providing quaternary medical treatment, robotic surgeries, and 24x7 emergency trauma care across major metropolitan hubs.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs self-start md:self-auto">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedFilter === tab.id
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedFilter === tab.id ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Hospitals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredHospitals.map((hosp) => (
            <div
              key={hosp.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-sky-300 transition-all flex flex-col justify-between group"
            >
              {/* Card Image */}
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <img
                  src={hosp.image}
                  alt={hosp.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                
                {/* Tag Badge */}
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-teal-600/90 text-white backdrop-blur-md border border-white/20">
                    {hosp.tag}
                  </span>
                </div>

                {/* Accreditation Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 text-[10px] font-bold text-slate-800 shadow-xs backdrop-blur-md">
                  <ShieldCheck className="w-3 h-3 text-teal-600" />
                  <span>{hosp.accreditation}</span>
                </div>

                {/* Bottom Hospital Area */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="text-[11px] font-bold text-teal-300 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{hosp.area}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-extrabold text-maxblue-800 tracking-tight leading-snug group-hover:text-sky-600 transition-colors">
                    {hosp.name}
                  </h3>

                  {/* Bed Counts */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2 font-medium">
                    <span className="flex items-center gap-1 text-slate-700 font-bold">
                      <Bed className="w-3.5 h-3.5 text-sky-600" />
                      {hosp.beds}
                    </span>
                    <span>•</span>
                    <span>{hosp.icuBeds}</span>
                  </div>

                  {/* Specialities Chips */}
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {hosp.specialities.map((spec, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Address */}
                  <p className="text-[11px] text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                    {hosp.address}
                  </p>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <a
                      href={`tel:${hosp.emergency.replace(/-/g, '')}`}
                      className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-extrabold text-[11px]"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{hosp.emergency}</span>
                    </a>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      24x7 ER Active
                    </span>
                  </div>

                  <button
                    onClick={() => handleBookAtHospital(hosp)}
                    className="w-full py-2 px-3 rounded-xl bg-maxorange-500 hover:bg-maxorange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all hover:shadow-md"
                  >
                    <span>Book Appointment at this Hospital</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-200">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-maxblue-800">
                Need Help Finding the Right Hospital Branch?
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Speak directly with our 24x7 Central Patient Concierge Desk for ambulance dispatch, hospital transfers, or doctor availability.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:1066"
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl flex items-center gap-2 shadow-md transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Emergency 1066</span>
            </a>
            <a
              href="tel:01126515050"
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition-all"
            >
              Healthline: 011-26515050
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

