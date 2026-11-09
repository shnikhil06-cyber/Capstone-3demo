import React, { useState, useEffect } from 'react';
import {
  BedDouble,
  Plus,
  User,
  Stethoscope,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  LogOut,
  Building,
} from 'lucide-react';
import { api } from '../../services/api.js';

export default function RoomsView() {
  const [rooms, setRooms] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmitOpen, setIsAdmitOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);

  // Admission form state
  const [admitForm, setAdmitForm] = useState({
    patientId: '',
    bedId: '',
    attendingDoctorId: '',
    reason: '',
    notes: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [roomsData, patientsData, doctorsData] = await Promise.all([
        api.getRooms(),
        api.getPatients(),
        api.getDoctors(),
      ]);
      setRooms(roomsData);
      setPatients(patientsData);
      setDoctors(doctorsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdmit = async (e) => {
    e.preventDefault();
    try {
      await api.admitPatient(admitForm);
      setIsAdmitOpen(false);
      setAdmitForm({
        patientId: '',
        bedId: '',
        attendingDoctorId: '',
        reason: '',
        notes: '',
      });
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDischarge = async (admissionId) => {
    if (!window.confirm('Confirm patient discharge? This will free the bed and generate an itemized inpatient accommodation bill.')) {
      return;
    }
    try {
      await api.dischargePatient(admissionId);
      setSelectedBed(null);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSetBedStatus = async (bedId, status) => {
    try {
      await api.updateBedStatus(bedId, status);
      setSelectedBed(null);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Find all available beds for the dropdown
  const availableBeds = rooms.flatMap((r) =>
    r.beds
      .filter((b) => b.status === 'AVAILABLE')
      .map((b) => ({ ...b, roomNumber: r.roomNumber, roomType: r.roomType, dailyRate: r.dailyRate }))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BedDouble className="w-6 h-6 text-teal-600" />
            Inpatient Bed & Ward Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time interactive ward visual map, bed occupancy tracker, admission and discharge workflows.
          </p>
        </div>

        <button
          onClick={() => setIsAdmitOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Admit Patient to Bed
        </button>
      </div>

      {/* Legend */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-wrap items-center gap-6 shadow-xs text-xs font-semibold text-slate-600">
        <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Bed Status:</span>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-md bg-emerald-500"></span>
          <span>Available ({availableBeds.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-md bg-rose-500"></span>
          <span>Occupied</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-md bg-amber-400"></span>
          <span>Maintenance</span>
        </div>
      </div>

      {/* Ward Rooms Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading ward data...</div>
      ) : (
        <div className="space-y-6">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              {/* Room Header */}
              <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-xs">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      Room {room.roomNumber}{' '}
                      <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200 ml-2">
                        {room.roomType} WARD
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Floor {room.floor} • Rate: ₹{room.dailyRate}/day • Total Beds: {room.beds?.length}
                    </p>
                  </div>
                </div>

                <div className="text-xs font-bold text-slate-500">
                  {room.beds?.filter((b) => b.status === 'AVAILABLE').length} Available
                </div>
              </div>

              {/* Beds Grid */}
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {room.beds?.map((bed) => {
                  const activeAdm = bed.admissions?.[0];
                  const isAvailable = bed.status === 'AVAILABLE';
                  const isOccupied = bed.status === 'OCCUPIED';
                  const isMaint = bed.status === 'MAINTENANCE';

                  return (
                    <div
                      key={bed.id}
                      onClick={() => setSelectedBed({ ...bed, room })}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.02] shadow-xs flex flex-col justify-between ${
                        isAvailable
                          ? 'border-emerald-200 bg-emerald-50/20 hover:border-emerald-400'
                          : isOccupied
                          ? 'border-rose-200 bg-rose-50/30 hover:border-rose-400'
                          : 'border-amber-200 bg-amber-50/20 hover:border-amber-400'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-extrabold text-slate-800 text-sm">{bed.bedNumber}</span>
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              isAvailable ? 'bg-emerald-500' : isOccupied ? 'bg-rose-500' : 'bg-amber-400'
                            }`}
                          />
                        </div>

                        {isOccupied && activeAdm ? (
                          <div className="space-y-1 text-xs">
                            <div className="font-bold text-slate-900 truncate">{activeAdm.patient?.name}</div>
                            <div className="text-[11px] text-slate-500 truncate">
                              Dr. {activeAdm.attendingDoctor?.user?.name?.replace('Dr. ', '')}
                            </div>
                            <div className="text-[10px] text-rose-700 font-semibold bg-rose-100/70 px-1.5 py-0.5 rounded truncate mt-1">
                              {activeAdm.reason}
                            </div>
                          </div>
                        ) : isAvailable ? (
                          <div className="text-xs text-emerald-700 font-medium py-2">
                            Ready for Admission
                          </div>
                        ) : (
                          <div className="text-xs text-amber-700 font-medium py-2">
                            Under Cleaning
                          </div>
                        )}
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-medium flex items-center justify-between">
                        <span>Click for options</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bed Detail / Action Modal */}
      {selectedBed && (
        <div className="fixed inset-0 bg-sky-900/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-teal-600" />
                Bed {selectedBed.bedNumber} (Room {selectedBed.room?.roomNumber})
              </h3>
              <button onClick={() => setSelectedBed(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Ward Category:</span>
                <span className="font-bold text-slate-800">{selectedBed.room?.roomType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Daily Bed Rate:</span>
                <span className="font-bold text-slate-800">₹{selectedBed.room?.dailyRate}/day</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Current Status:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                    selectedBed.status === 'AVAILABLE'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedBed.status === 'OCCUPIED'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {selectedBed.status}
                </span>
              </div>

              {/* If Occupied, Show Patient and Discharge button */}
              {selectedBed.status === 'OCCUPIED' && selectedBed.admissions?.[0] && (
                <div className="bg-rose-50/50 p-3.5 rounded-xl border border-rose-200 space-y-2 mt-2">
                  <div className="font-bold text-rose-900 text-xs">Admitted Patient Info:</div>
                  <div className="text-slate-800 font-semibold">{selectedBed.admissions[0].patient?.name}</div>
                  <div className="text-slate-600 text-[11px]">
                    Doctor: {selectedBed.admissions[0].attendingDoctor?.user?.name}
                  </div>
                  <div className="text-slate-600 text-[11px]">Reason: {selectedBed.admissions[0].reason}</div>
                  <div className="text-slate-500 text-[10px]">
                    Admitted:{' '}
                    {new Date(selectedBed.admissions[0].admissionDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>

                  <button
                    onClick={() => handleDischarge(selectedBed.admissions[0].id)}
                    className="w-full mt-3 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-4 h-4" />
                    Discharge & Generate Bill
                  </button>
                </div>
              )}

              {/* Status changing controls */}
              <div className="pt-3">
                <span className="font-bold text-slate-700 block mb-2">Change Bed Status:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSetBedStatus(selectedBed.id, 'AVAILABLE')}
                    className="flex-1 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg border border-emerald-200"
                  >
                    Mark Available
                  </button>
                  <button
                    onClick={() => handleSetBedStatus(selectedBed.id, 'MAINTENANCE')}
                    className="flex-1 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold rounded-lg border border-amber-200"
                  >
                    Maintenance
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedBed(null)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admit Patient Modal */}
      {isAdmitOpen && (
        <div className="fixed inset-0 bg-sky-900/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-teal-600" />
                Admit Patient to Bed
              </h3>
              <button onClick={() => setIsAdmitOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Patient *</label>
                <select
                  required
                  value={admitForm.patientId}
                  onChange={(e) => setAdmitForm({ ...admitForm, patientId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.patientCode} • {p.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Available Bed *</label>
                <select
                  required
                  value={admitForm.bedId}
                  onChange={(e) => setAdmitForm({ ...admitForm, bedId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                >
                  <option value="">-- Choose Available Bed --</option>
                  {availableBeds.map((b) => (
                    <option key={b.id} value={b.id}>
                      Room {b.roomNumber} ({b.roomType}) — Bed {b.bedNumber} (₹{b.dailyRate}/day)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Attending Doctor *</label>
                <select
                  required
                  value={admitForm.attendingDoctorId}
                  onChange={(e) => setAdmitForm({ ...admitForm, attendingDoctorId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                >
                  <option value="">-- Choose Attending Physician --</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.user?.name} ({d.department?.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Admission Reason / Diagnosis *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acute appendicitis post-op observation"
                  value={admitForm.reason}
                  onChange={(e) => setAdmitForm({ ...admitForm, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Care Notes (optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. NPO till morning, IV fluids at 100ml/hr, monitor hourly vitals."
                  value={admitForm.notes}
                  onChange={(e) => setAdmitForm({ ...admitForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdmitOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-md shadow-teal-600/20"
                >
                  Admit Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

