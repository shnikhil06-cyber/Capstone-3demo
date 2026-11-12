import React, { useState, useEffect } from 'react';
import RishiLogo from '../common/RishiLogo.jsx';
import hospitalBg from '../../assets/hospital-bg.jpg';
import {
  Shield,
  User,
  Stethoscope,
  Building2,
  Calendar,
  FileText,
  CreditCard,
  Lock,
  Mail,
  Phone,
  Heart,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function PortalLoginPage({
  initialIsAdmin = false,
  initialMode = 'login',
  currentUser = null,
  onGoToWebsite,
  onSwitchAdmin,
  onSwitchMode,
  onLoginSuccess,
}) {
  const { login, register } = useAuth();

  // "Are you an Admin?" state
  const [isAdmin, setIsAdmin] = useState(initialIsAdmin);
  const [patientMode, setPatientMode] = useState(initialMode || 'login'); // 'login' | 'register'

  // Sync internal state when browser Back or Forward button changes the URL / props
  useEffect(() => {
    setIsAdmin(initialIsAdmin);
    if (initialIsAdmin) {
      setEmail('admin@hospital.com');
    } else {
      setEmail('rohit.kumar@example.com');
    }
  }, [initialIsAdmin]);

  useEffect(() => {
    setPatientMode(initialMode || 'login');
  }, [initialMode]);

  // Form inputs
  const [email, setEmail] = useState(initialIsAdmin ? 'admin@hospital.com' : 'rohit.kumar@example.com');
  const [password, setPassword] = useState('Password@123');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [address, setAddress] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePatientLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let res;
      if (patientMode === 'register') {
        res = await register({
          email,
          password,
          name,
          phone,
          role: 'PATIENT',
          age,
          gender,
          bloodGroup,
          address,
        });
      } else {
        res = await login(email, password);
      }
      if (onLoginSuccess && res?.user) {
        onLoginSuccess(res.user);
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      if (onLoginSuccess && res?.user) {
        onLoginSuccess(res.user);
      }
    } catch (err) {
      setError(err.message || 'Admin authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen relative flex flex-col justify-between p-4 md:p-8 font-['Plus_Jakarta_Sans',sans-serif] text-slate-800"
      style={{
        backgroundImage: `linear-gradient(rgba(10, 25, 41, 0.65), rgba(6, 20, 34, 0.78)), url(${hospitalBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Top Navbar Header */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between py-2 relative z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onGoToWebsite}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0b3a4a] via-[#092f3a] to-[#041c24] flex items-center justify-center p-1.5 shadow-lg shadow-teal-950/30 group-hover:scale-105 transition-transform border border-teal-500/30">
              <RishiLogo size="sm" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight leading-none group-hover:text-teal-300 transition-colors">
                RISHI <span className="text-teal-400 font-extrabold text-lg">HEALTHCARE</span>
              </h1>
              <p className="text-[10px] text-slate-300 font-bold tracking-wider uppercase">Super Speciality Hospitals</p>
            </div>
          </button>
        </div>

        {/* Back to Website Button */}
        <button
          onClick={onGoToWebsite}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 backdrop-blur-md transition-all shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Website</span>
        </button>
      </div>

      {/* Main Login Card */}
      <div className="max-w-4xl w-full mx-auto my-auto py-6">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Hero Sidebar */}
          <div className="md:w-5/12 bg-gradient-to-br from-sky-700 via-sky-600 to-sky-500 p-8 text-white flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 inline-block mb-3">
                Rishi Healthcare Secure Sign In
              </span>
              <h2 className="text-2xl font-black tracking-tight leading-snug">
                Compassionate Care. Clinical Excellence.
              </h2>
              <p className="text-xs text-sky-50 mt-2 leading-relaxed font-medium">
                Access your personal patient records or sign in to the hospital administration system.
              </p>

              {/* Portal Highlight Boxes */}
              <div className="mt-6 space-y-3">
                <div
                  className={`p-3.5 rounded-2xl border transition-all ${
                    !isAdmin ? 'bg-white/15 border-white/60 shadow-sm' : 'bg-white/5 border-white/10 opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <User className="w-4 h-4 text-white" />
                    <span>Rishi Patient Portal</span>
                  </div>
                  <p className="text-[11px] text-sky-50 mt-1">
                    Book consultations, review doctor prescriptions, track vitals, and settle bills online.
                  </p>
                </div>

                <div
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isAdmin ? 'bg-white/15 border-cyan-200/60 shadow-sm' : 'bg-white/5 border-white/10 opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-100">
                    <Shield className="w-4 h-4 text-cyan-100" />
                    <span>Hospital Staff & Admin Console</span>
                  </div>
                  <p className="text-[11px] text-sky-50 mt-1">
                    Ward occupancy, emergency beds, doctor rostering, pharmacy stock, and billing analytics.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-sky-500/50 mt-6 text-[11px] text-sky-100 flex items-center justify-between">
              <span>Emergency 24x7: 1066</span>
              <span>Saket, New Delhi</span>
            </div>
          </div>

          {/* Right Form: "Are you an Admin?" Interactive Selector */}
          <div className="md:w-7/12 p-8 md:p-10 flex flex-col justify-between bg-white">
            <div>
              {/* PRIMARY PROMPT: "Are you an Admin?" */}
              {currentUser && (
                <div className="mb-4 p-3 rounded-2xl bg-sky-50 border border-sky-200 text-xs flex items-center justify-between gap-3 text-sky-900">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>Signed in as <strong className="font-bold">{currentUser.name || currentUser.username}</strong> ({currentUser.role})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onLoginSuccess && onLoginSuccess(currentUser)}
                    className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg text-[11px] shrink-0"
                  >
                    Go to Portal →
                  </button>
                </div>
              )}

              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 mb-6">
                <div className="text-center text-xs font-extrabold text-maxblue-800 mb-2.5 uppercase tracking-wider flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-maxorange-500" />
                  Are you an Admin?
                </div>

                {/* Big Two-Choice Toggle */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdmin(false);
                      setError('');
                      setEmail('rohit.kumar@example.com');
                      setPassword('Password@123');
                      if (onSwitchAdmin) onSwitchAdmin(false);
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      !isAdmin
                        ? 'bg-maxorange-500 text-white shadow-md shadow-maxorange-500/30'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>No, I am a Patient</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsAdmin(true);
                      setError('');
                      setEmail('admin@hospital.com');
                      setPassword('Password@123');
                      if (onSwitchAdmin) onSwitchAdmin(true);
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      isAdmin
                        ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    <span>Yes, I am an Admin</span>
                  </button>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {error}
                </div>
              )}

              {/* -------------------- PATIENT PORTAL FLOW -------------------- */}
              {!isAdmin && (
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-extrabold text-maxblue-800 tracking-tight">
                      {patientMode === 'login' ? 'Pay Bill Online' : 'Register New Patient Account'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {patientMode === 'login'
                        ? 'Access your Rishi appointments, doctor prescriptions, and bills'
                        : 'Create your digital Rishi Healthcare ID'}
                    </p>
                  </div>
                  {/* Patient Form */}
                  <form onSubmit={handlePatientLogin} className="space-y-3 text-xs">
                    {patientMode === 'register' && (
                      <>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Ramesh Chandra"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-maxorange-500/20 focus:border-maxorange-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                            <input
                              type="tel"
                              required
                              placeholder="+91 98765 43210"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Blood Group</label>
                            <select
                              value={bloodGroup}
                              onChange={(e) => setBloodGroup(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                            >
                              <option value="A+">A+</option>
                              <option value="A-">A-</option>
                              <option value="B+">B+</option>
                              <option value="B-">B-</option>
                              <option value="O+">O+</option>
                              <option value="O-">O-</option>
                              <option value="AB+">AB+</option>
                              <option value="AB-">AB-</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Age</label>
                            <input
                              type="number"
                              placeholder="32"
                              value={age}
                              onChange={(e) => setAge(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Gender</label>
                            <select
                              value={gender}
                              onChange={(e) => setGender(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                            >
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="patient@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-maxorange-500/20 focus:border-maxorange-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Password *</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-maxorange-500/20 focus:border-maxorange-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 bg-maxorange-500 hover:bg-maxorange-600 text-white font-bold rounded-xl text-xs shadow-md shadow-maxorange-500/25 transition-all disabled:opacity-50 mt-1 flex items-center justify-center gap-2"
                    >
                      {loading ? 'Authenticating...' : patientMode === 'login' ? 'Sign In to Patient Portal' : 'Register & Create Rishi ID'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {/* Register / Back to Sign In toggle */}
                    <p className="text-center text-xs text-slate-500 mt-2">
                      {patientMode === 'login' ? (
                        <>
                          New patient?{' '}
                          <button
                            type="button"
                            onClick={() => {
                              setPatientMode('register');
                              setEmail('');
                              if (onSwitchMode) onSwitchMode('register');
                            }}
                            className="text-maxorange-600 font-bold hover:underline"
                          >
                            Register here
                          </button>
                        </>
                      ) : (
                        <>
                          Already registered?{' '}
                          <button
                            type="button"
                            onClick={() => {
                              setPatientMode('login');
                              setEmail('rohit.kumar@example.com');
                              if (onSwitchMode) onSwitchMode('login');
                            }}
                            className="text-maxorange-600 font-bold hover:underline"
                          >
                            Sign In
                          </button>
                        </>
                      )}
                    </p>
                  </form>
                </div>
              )}

              {/* -------------------- ADMIN / STAFF PORTAL FLOW -------------------- */}
              {isAdmin && (
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-extrabold text-maxblue-800 tracking-tight flex items-center gap-2">
                      <Shield className="w-5 h-5 text-maxblue-800" />
                      Rishi Hospital Staff & Admin Login
                    </h3>
                    <p className="text-xs text-slate-400">
                      Restricted management access for Clinicians, Ward Directors, and Helpdesk
                    </p>
                  </div>

                  {/* Admin Form */}
                  <form onSubmit={handleAdminLogin} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Staff / Admin Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="admin@hospital.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-maxblue-800/20 focus:border-maxblue-800"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Password *</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-maxblue-800/20 focus:border-maxblue-800"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs shadow-md shadow-sky-600/25 transition-all disabled:opacity-50 mt-1 flex items-center justify-center gap-2"
                    >
                      {loading ? 'Authenticating Staff...' : 'Access Rishi Hospital Admin Console'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              )}
            </div>


          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl w-full mx-auto text-center text-xs text-slate-300 py-2 relative z-10 font-semibold drop-shadow-sm">
        Rishi Healthcare Institute Limited • Super Speciality Hospitals
      </div>
    </div>
  );
}
