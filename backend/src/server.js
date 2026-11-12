import express from 'express';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import patientsRoutes from './routes/patients.routes.js';
import doctorsRoutes from './routes/doctors.routes.js';
import departmentsRoutes from './routes/departments.routes.js';
import appointmentsRoutes from './routes/appointments.routes.js';
import medicalRecordsRoutes from './routes/medicalRecords.routes.js';
import roomsRoutes from './routes/rooms.routes.js';
import pharmacyRoutes from './routes/pharmacy.routes.js';
import billingRoutes from './routes/billing.routes.js';
import labRoutes from './routes/lab.routes.js';
import seedRoutes from './routes/seed.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Global Middlewares
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
app.use(express.json());

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'OK',
    service: 'Hospital Management System API (JavaScript)',
    database: 'PostgreSQL (Prisma)',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/patients', patientsRoutes);
app.use('/api/doctors', doctorsRoutes);
app.use('/api/departments', departmentsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/medical-records', medicalRecordsRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/lab', labRoutes);
app.use('/api/seed', seedRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

// Error Handling Middleware
app.use((err, _req, res, _next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`🏥 Hospital Management System API is running on http://localhost:${PORT}`);
});

export default app;

