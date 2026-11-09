import React from 'react';
import RishiLogo from '../common/RishiLogo.jsx';
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Heart,
  Globe2,
  Clock,
  ArrowUpRight,
} from 'lucide-react';

export default function MaxFooter({ onOpenAuth }) {
  return (
    <footer className="bg-sky-700 text-white text-xs pt-16 pb-8 border-t border-sky-600 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        {/* Top Emergency Strip */}
        <div className="bg-white/10 border border-white/25 backdrop-blur-sm rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl text-white">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <Phone className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-xs uppercase font-black tracking-widest text-amber-200">
                24x7 Emergency & Trauma Helpline
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-0.5">
                Dial 1066 / 011-26515050
              </h3>
              <p className="text-xs text-orange-100 mt-1">
                Immediate advanced cardiac life support ambulance dispatch & emergency room resuscitation.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:1066"
              className="px-6 py-3 bg-white text-maxorange-700 font-black rounded-xl text-xs hover:bg-orange-50 transition-all shadow-md"
            >
              Call 1066 Ambulance
            </a>
            <button
              onClick={() => onOpenAuth(true)}
              className="px-5 py-3 bg-sky-700 hover:bg-sky-800 text-white font-bold rounded-xl text-xs border border-white/20 transition-all"
            >
              Hospital Staff Portal
            </button>
          </div>
        </div>

        {/* 4-Columns Directory */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Max Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0b3a4a] via-[#092f3a] to-[#041c24] flex items-center justify-center p-1 border border-teal-500/30">
                <RishiLogo size="sm" />
              </div>
              <span className="text-xl font-black tracking-tight">
                RISHI <span className="text-maxorange-500">HEALTHCARE</span>
              </span>
            </div>
            <p className="text-sky-100 text-xs leading-relaxed">
              Rishi Healthcare Institute Limited is one of India's largest healthcare organizations operating 17+ facilities across Delhi NCR, Mumbai, Punjab, and Uttarakhand.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>JCI & NABH Gold Accredited</span>
            </div>
          </div>

          {/* Col 2: Network Hospitals */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-3">
              Network Hospitals
            </h4>
            <ul className="space-y-2 text-sky-50 text-xs">
              {[
                'Rishi Super Speciality Hospital, Saket, Delhi',
                'Rishi Super Speciality Hospital, Pusa Road, Delhi',
                'Rishi Hospital, Vile Parle, Mumbai',
                'Rishi Hospital, Gurugram, Haryana',
                'Rishi Super Speciality, Shalimar Bagh, Delhi',
                'Rishi Super Speciality Hospital, Vaishali',
                'Rishi Super Speciality Hospital, Dehradun',
                'Rishi Super Speciality Hospital, Mohali',
              ].map((h, i) => (
                <li key={i}>
                  <button
                    onClick={() => {
                      const el = document.getElementById('hospitals');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors text-left"
                  >
                    {h}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Centers of Excellence */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-3">
              Centers of Excellence
            </h4>
            <ul className="space-y-2 text-sky-50 text-xs">
              {[
                'Cardiac Sciences & Heart Institute',
                'Cancer Care / Oncology',
                'Neurosciences & Stroke Center',
                'Orthopaedics & Joint Replacement',
                'Liver & Biliary Sciences / Organ Transplant',
                'Kidney Transplant & Nephrology',
                'Robotic Surgical Systems',
                'Paediatrics & Neonatal ICU',
              ].map((c, i) => (
                <li key={i}>
                  <button
                    onClick={() => {
                      const el = document.getElementById('specialities');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors text-left"
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Quick Portals & Contact */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-3">
              Digital Portals
            </h4>
            <ul className="space-y-2 text-sky-50 text-xs">
              <li>
                <button onClick={() => onOpenAuth(false)} className="hover:text-white transition-colors text-left">
                  Patient Health Records Portal
                </button>
              </li>
              <li>
                <button onClick={() => onOpenAuth(true)} className="hover:text-white transition-colors text-left">
                  Hospital Admin & Doctor Console
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('services');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors text-left"
                >
                  Rishi Lab Online Diagnostic Reports
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('services');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors text-left"
                >
                  Rishi@Home Healthcare Booking
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAuth(false)}
                  className="hover:text-white transition-colors text-left"
                >
                  Pay Bill Online (Patient Sign In)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('about');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors text-left"
                >
                  About Rishi Healthcare Network
                </button>
              </li>
            </ul>

            <div className="mt-4 pt-3 border-t border-sky-500 text-sky-100 text-[11px]">
              <div>Head Office: Saket, New Delhi 110017</div>
              <div>Email: helpdesk@rishihealthcare.com</div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-sky-600 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} Rishi Healthcare Institute Limited. All Rights Reserved.
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-sky-100">Privacy Policy</a>
            <a href="#" className="hover:text-sky-100">Terms of Use</a>
            <a href="#" className="hover:text-sky-100">Bio-Medical Waste Reports</a>
            <a href="#" className="hover:text-sky-100">Clinical Governance</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
