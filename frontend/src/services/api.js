const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('hms_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `HTTP error ${res.status}: ${res.statusText}`);
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  getMe: () => request('/auth/me'),

  getDemoUsers: () => request('/auth/demo-users'),

  // Dashboard
  getDashboardStats: () => request('/dashboard/stats'),
  getDashboardRecent: () => request('/dashboard/recent'),

  // Patients
  getPatients: (params = {}) => {
    const cleanParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== ''));
    const query = new URLSearchParams(cleanParams).toString();
    return request(`/patients${query ? `?${query}` : ''}`);
  },

  getPatientById: (id) => request(`/patients/${id}`),

  createPatient: (patientData) =>
    request('/patients', {
      method: 'POST',
      body: JSON.stringify(patientData),
    }),

  updatePatient: (id, patientData) =>
    request(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patientData),
    }),

  deletePatient: (id) =>
    request(`/patients/${id}`, {
      method: 'DELETE',
    }),

  // Doctors
  getDoctors: (params = {}) => {
    const cleanParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== ''));
    const query = new URLSearchParams(cleanParams).toString();
    return request(`/doctors${query ? `?${query}` : ''}`);
  },

  getDoctorById: (id) => request(`/doctors/${id}`),

  createDoctor: (doctorData) =>
    request('/doctors', {
      method: 'POST',
      body: JSON.stringify(doctorData),
    }),

  updateDoctor: (id, doctorData) =>
    request(`/doctors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(doctorData),
    }),

  deleteDoctor: (id) =>
    request(`/doctors/${id}`, {
      method: 'DELETE',
    }),

  // Departments
  getDepartments: () => request('/departments'),

  createDepartment: (deptData) =>
    request('/departments', {
      method: 'POST',
      body: JSON.stringify(deptData),
    }),

  // Appointments
  getAppointments: (params = {}) => {
    const cleanParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== ''));
    const query = new URLSearchParams(cleanParams).toString();
    return request(`/appointments${query ? `?${query}` : ''}`);
  },

  getAppointmentById: (id) => request(`/appointments/${id}`),

  createAppointment: (appointmentData) =>
    request('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    }),

  updateAppointmentStatus: (id, status) =>
    request(`/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  deleteAppointment: (id) =>
    request(`/appointments/${id}`, {
      method: 'DELETE',
    }),

  // Medical Records & Prescriptions
  getMedicalRecords: (params = {}) => {
    const cleanParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== ''));
    const query = new URLSearchParams(cleanParams).toString();
    return request(`/medical-records${query ? `?${query}` : ''}`);
  },

  getMedicalRecordById: (id) => request(`/medical-records/${id}`),

  createMedicalRecord: (recordData) =>
    request('/medical-records', {
      method: 'POST',
      body: JSON.stringify(recordData),
    }),

  // Rooms & Beds & Admissions
  getRooms: () => request('/rooms'),

  getBeds: (params = {}) => {
    const cleanParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== ''));
    const query = new URLSearchParams(cleanParams).toString();
    return request(`/rooms/beds${query ? `?${query}` : ''}`);
  },

  admitPatient: (admissionData) =>
    request('/rooms/admissions', {
      method: 'POST',
      body: JSON.stringify(admissionData),
    }),

  dischargePatient: (admissionId) =>
    request(`/rooms/admissions/${admissionId}/discharge`, {
      method: 'POST',
    }),

  updateBedStatus: (bedId, status) =>
    request(`/rooms/beds/${bedId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // Pharmacy
  getMedicines: (params = {}) => {
    const cleanParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== ''));
    const query = new URLSearchParams(cleanParams).toString();
    return request(`/pharmacy/medicines${query ? `?${query}` : ''}`);
  },

  createMedicine: (medData) =>
    request('/pharmacy/medicines', {
      method: 'POST',
      body: JSON.stringify(medData),
    }),

  updateMedicine: (id, medData) =>
    request(`/pharmacy/medicines/${id}`, {
      method: 'PUT',
      body: JSON.stringify(medData),
    }),

  deleteMedicine: (id) =>
    request(`/pharmacy/medicines/${id}`, {
      method: 'DELETE',
    }),

  // Billing & Invoices
  getBills: (params = {}) => {
    const cleanParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== ''));
    const query = new URLSearchParams(cleanParams).toString();
    return request(`/billing${query ? `?${query}` : ''}`);
  },

  getBillById: (id) => request(`/billing/${id}`),

  createBill: (billData) =>
    request('/billing', {
      method: 'POST',
      body: JSON.stringify(billData),
    }),

  payBill: (id, paymentData) =>
    request(`/billing/${id}/pay`, {
      method: 'PATCH',
      body: JSON.stringify(paymentData),
    }),

  // Lab Tests & Reports
  getLabTests: () => request('/lab/tests'),

  getLabReports: (params = {}) => {
    const cleanParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== ''));
    const query = new URLSearchParams(cleanParams).toString();
    return request(`/lab/reports${query ? `?${query}` : ''}`);
  },

  orderLabTest: (data) =>
    request('/lab/reports', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateLabReport: (id, updateData) =>
    request(`/lab/reports/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    }),

  // Seed Reset
  resetDatabase: () =>
    request('/seed/reset', {
      method: 'POST',
    }),
};

