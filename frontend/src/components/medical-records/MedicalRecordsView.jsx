import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  Search,
  Plus,
  Trash2,
  X,
  Stethoscope,
  Pill,
  Heart,
  Calendar,
  User,
  Clock,
} from 'lucide-react';
import { api } from '../../services/api.js';

export default function MedicalRecordsView({ preselectedAppointment }) {
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentId: '',
    diagnosis: '',
    symptoms: '',
    vitalsBp: '120/80 mmHg',
    vitalsPulse: '72 bpm',
    vitalsTemp: '98.6 F',
    vitalsWeight: '68 kg',
    doctorNotes: '',
    followUpDate: '',
    prescriptionItems: [
      { medicineId: '', medicineName: '', dosage: '1 tablet', frequency: 'Twice daily', durationDays: 5, instructions: 'After food' },
    ],
    prescriptionNotes: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [recs, pts, docs, meds] = await Promise.all([
        api.getMedicalRecords(),
        api.getPatients(),
        api.getDoctors(),
        api.getMedicines(),
      ]);
      setRecords(recs);
      setPatients(pts);
      setDoctors(docs);
      setMedicines(meds);

      // Pre-fill from appointment if passed
      if (preselectedAppointment) {
        setFormData((prev) => ({
          ...prev,
          patientId: preselectedAppointment.patientId,
          doctorId: preselectedAppointment.doctorId,
          appointmentId: preselectedAppointment.id,
          symptoms: preselectedAppointment.symptoms || '',
          diagnosis: preselectedAppointment.reason || '',
        }));
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddMedicineRow = () => {
    setFormData((prev) => ({
      ...prev,
      prescriptionItems: [
        ...prev.prescriptionItems,
        { medicineId: '', medicineName: '', dosage: '1 tablet', frequency: 'Twice daily', durationDays: 5, instructions: 'After food' },
      ],
    }));
  };

  const handleRemoveMedicineRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      prescriptionItems: prev.prescriptionItems.filter((_, i) => i !== index),
    }));
  };

  const handleMedicineChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.prescriptionItems];
      updated[index][field] = value;

      // If medicineId changed, automatically set medicineName
      if (field === 'medicineId') {
        const med = medicines.find((m) => m.id === value);
        if (med) {
          updated[index].medicineName = `${med.name} (${med.dosageForm})`;
        }
      }
      return { ...prev, prescriptionItems: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createMedicalRecord(formData);
      setIsModalOpen(false);
      setFormData({
        patientId: '',
        doctorId: '',
        appointmentId: '',
        diagnosis: '',
        symptoms: '',
        vitalsBp: '120/80 mmHg',
        vitalsPulse: '72 bpm',
        vitalsTemp: '98.6 F',
        vitalsWeight: '68 kg',
        doctorNotes: '',
        followUpDate: '',
        prescriptionItems: [
          { medicineId: '', medicineName: '', dosage: '1 tablet', frequency: 'Twice daily', durationDays: 5, instructions: 'After food' },
        ],
        prescriptionNotes: '',
      });
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-teal-600" />
            Electronic Medical Records & Prescriptions (EMR)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Diagnoses, patient vitals, clinical evaluations, and multi-medicine e-prescriptions.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          New Medical Record & Rx
        </button>
      </div>

      {/* Records Feed */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading medical records...</div>
      ) : records.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400">No medical records recorded yet.</div>
      ) : (
        <div className="space-y-4">
          {records.map((rec) => (
            <div
              key={rec.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-teal-300 transition-all p-5"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* Left: Patient & Clinical Diagnosis */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-lg">
                      {rec.patient?.patientCode}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-base">{rec.patient?.name}</h3>
                    <span className="text-xs text-slate-400">
                      ({rec.patient?.age} yrs, {rec.patient?.gender}, {rec.patient?.bloodGroup})
                    </span>
                  </div>

                  <div className="text-sm font-bold text-teal-800">
                    Diagnosis: <span className="text-slate-900 font-bold">{rec.diagnosis}</span>
                  </div>

                  {rec.symptoms && (
                    <div className="text-xs text-slate-600">
                      <span className="font-semibold text-slate-500">Symptoms:</span> {rec.symptoms}
                    </div>
                  )}

                  {/* Vitals Strip */}
                  <div className="flex flex-wrap gap-2 text-xs font-mono pt-1">
                    {rec.vitalsBp && (
                      <span className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700">
                        BP: {rec.vitalsBp}
                      </span>
                    )}
                    {rec.vitalsPulse && (
                      <span className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700">
                        Pulse: {rec.vitalsPulse}
                      </span>
                    )}
                    {rec.vitalsTemp && (
                      <span className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700">
                        Temp: {rec.vitalsTemp}
                      </span>
                    )}
                    {rec.vitalsWeight && (
                      <span className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700">
                        Weight: {rec.vitalsWeight}
                      </span>
                    )}
                  </div>

                  {rec.doctorNotes && (
                    <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                      Clinical Notes: "{rec.doctorNotes}"
                    </p>
                  )}
                </div>

                {/* Right: Doctor Info & Date */}
                <div className="text-right text-xs text-slate-500 shrink-0">
                  <div className="font-bold text-slate-800">{rec.doctor?.user?.name}</div>
                  <div className="text-teal-600 font-semibold">{rec.doctor?.department?.name}</div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-end gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(rec.recordDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              </div>

              {/* Prescriptions Section */}
              {rec.prescriptions?.map((rx) => (
                <div key={rx.id} className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Pill className="w-4 h-4 text-teal-600" />
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Prescribed Medicines (Rx)
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                    {rx.items?.map((it) => (
                      <div
                        key={it.id}
                        className="p-2.5 rounded-xl border border-teal-100 bg-teal-50/30 flex flex-col justify-between"
                      >
                        <div className="font-bold text-slate-800 text-xs">{it.medicineName}</div>
                        <div className="text-[11px] text-teal-700 font-semibold mt-1">
                          {it.dosage} • {it.frequency}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Duration: {it.durationDays} days {it.instructions ? `• ${it.instructions}` : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Create Medical Record Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-sky-900/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-teal-600" />
                New Medical Encounter & Prescription
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Patient *</label>
                  <select
                    required
                    value={formData.patientId}
                    onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    <option value="">-- Choose Patient --</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.patientCode})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Consulting Doctor *</label>
                  <select
                    required
                    value={formData.doctorId}
                    onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    <option value="">-- Choose Doctor --</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.user?.name} ({d.department?.name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary Diagnosis *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acute Bronchitis with mild wheezing"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Observed Clinical Symptoms</label>
                <input
                  type="text"
                  placeholder="e.g. Low grade pyrexia, persistent dry cough, fatigue"
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              {/* Vitals Input Grid */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700 block mb-2 text-xs uppercase tracking-wider">
                  Patient Vitals
                </span>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">Blood Pressure</label>
                    <input
                      type="text"
                      placeholder="120/80 mmHg"
                      value={formData.vitalsBp}
                      onChange={(e) => setFormData({ ...formData, vitalsBp: e.target.value })}
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">Pulse</label>
                    <input
                      type="text"
                      placeholder="72 bpm"
                      value={formData.vitalsPulse}
                      onChange={(e) => setFormData({ ...formData, vitalsPulse: e.target.value })}
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">Temperature</label>
                    <input
                      type="text"
                      placeholder="98.6 F"
                      value={formData.vitalsTemp}
                      onChange={(e) => setFormData({ ...formData, vitalsTemp: e.target.value })}
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">Weight</label>
                    <input
                      type="text"
                      placeholder="70 kg"
                      value={formData.vitalsWeight}
                      onChange={(e) => setFormData({ ...formData, vitalsWeight: e.target.value })}
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Prescription Items Builder */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-slate-700 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-teal-600" />
                    Prescription Medicines (Rx)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMedicineRow}
                    className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Medicine
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.prescriptionItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-wrap items-center gap-2"
                    >
                      {/* Pick from inventory or custom name */}
                      <select
                        value={item.medicineId}
                        onChange={(e) => handleMedicineChange(idx, 'medicineId', e.target.value)}
                        className="px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs flex-1 min-w-[140px]"
                      >
                        <option value="">-- Or choose from Pharmacy --</option>
                        {medicines.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.stock} in stock)
                          </option>
                        ))}
                      </select>

                      <input
                        type="text"
                        placeholder="Drug Name"
                        value={item.medicineName}
                        onChange={(e) => handleMedicineChange(idx, 'medicineName', e.target.value)}
                        className="px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs flex-1 min-w-[120px]"
                      />

                      <input
                        type="text"
                        placeholder="Dosage (e.g. 1 tab)"
                        value={item.dosage}
                        onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                        className="px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs w-24"
                      />

                      <input
                        type="text"
                        placeholder="Frequency"
                        value={item.frequency}
                        onChange={(e) => handleMedicineChange(idx, 'frequency', e.target.value)}
                        className="px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs w-28"
                      />

                      <input
                        type="number"
                        placeholder="Days"
                        value={item.durationDays}
                        onChange={(e) => handleMedicineChange(idx, 'durationDays', e.target.value)}
                        className="px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs w-16"
                      />

                      {formData.prescriptionItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMedicineRow(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Doctor Advice / Clinical Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Plenty of oral fluids, steam inhalation twice daily, review in 5 days."
                  value={formData.doctorNotes}
                  onChange={(e) => setFormData({ ...formData, doctorNotes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-md shadow-teal-600/20"
                >
                  Save Encounter & Prescribe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

