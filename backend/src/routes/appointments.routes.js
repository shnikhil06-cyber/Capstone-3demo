import { Router } from 'express';
import prisma from '../prisma.js';

const router = Router();

// GET /api/appointments
router.get('/', async (req, res) => {
  try {
    const { doctorId, patientId, departmentId, status, date } = req.query;

    const where = {};
    if (doctorId && doctorId !== 'ALL') where.doctorId = String(doctorId);
    if (patientId && patientId !== 'ALL') where.patientId = String(patientId);
    if (departmentId && departmentId !== 'ALL') where.departmentId = String(departmentId);
    if (status && status !== 'ALL') where.status = String(status);

    if (date) {
      const selectedDate = new Date(String(date));
      selectedDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);

      where.appointmentDate = {
        gte: selectedDate,
        lt: nextDay,
      };
    }

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: { appointmentDate: 'desc' },
      include: {
        patient: true,
        doctor: {
          include: {
            user: { select: { name: true, email: true, phone: true } },
            department: true,
          },
        },
        department: true,
        medicalRecords: {
          include: {
            prescriptions: {
              include: { items: true },
            },
          },
        },
      },
    });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/appointments/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: {
          include: {
            user: { select: { name: true, email: true, phone: true } },
            department: true,
          },
        },
        department: true,
        medicalRecords: {
          include: {
            prescriptions: {
              include: { items: true },
            },
          },
        },
        bills: {
          include: { items: true },
        },
      },
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/appointments
router.post('/', async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
      departmentId,
      appointmentDate,
      timeSlot,
      type = 'CONSULTATION',
      reason,
      symptoms,
      notes,
    } = req.body;

    if (!patientId || !doctorId || !departmentId || !appointmentDate || !timeSlot || !reason) {
      return res.status(400).json({ error: 'Patient, Doctor, Department, Date, Time Slot, and Reason are required' });
    }

    const count = await prisma.appointment.count();
    const appointmentNumber = `APT-2026-${100 + count + 1}`;

    const appointment = await prisma.appointment.create({
      data: {
        appointmentNumber,
        patientId,
        doctorId,
        departmentId,
        appointmentDate: new Date(appointmentDate),
        timeSlot,
        type,
        status: 'CONFIRMED',
        reason: reason.trim(),
        symptoms: symptoms ? symptoms.trim() : null,
        notes: notes ? notes.trim() : null,
      },
      include: {
        patient: true,
        doctor: {
          include: {
            user: { select: { name: true, email: true } },
            department: true,
          },
        },
        department: true,
      },
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/appointments/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid appointment status' });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: { status },
      include: {
        patient: true,
        doctor: {
          include: {
            user: { select: { name: true } },
            department: true,
          },
        },
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/appointments/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.appointment.delete({ where: { id } });
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

