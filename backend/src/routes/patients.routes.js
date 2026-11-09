import { Router } from 'express';
import prisma from '../prisma.js';

const router = Router();

// GET /api/patients
router.get('/', async (req, res) => {
  try {
    const { q, bloodGroup, gender } = req.query;

    const where = {};
    if (bloodGroup && bloodGroup !== 'ALL') {
      where.bloodGroup = String(bloodGroup);
    }
    if (gender && gender !== 'ALL') {
      where.gender = String(gender);
    }
    if (q) {
      const search = String(q).trim();
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { patientCode: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const patients = await prisma.patient.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            appointments: true,
            medicalRecords: true,
            admissions: true,
            bills: true,
          },
        },
        admissions: {
          where: { status: 'ADMITTED' },
          include: {
            bed: { include: { room: true } },
          },
          take: 1,
        },
      },
    });

    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/patients/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        appointments: {
          orderBy: { appointmentDate: 'desc' },
          include: {
            doctor: {
              include: {
                user: { select: { name: true } },
                department: { select: { name: true } },
              },
            },
          },
        },
        medicalRecords: {
          orderBy: { recordDate: 'desc' },
          include: {
            doctor: {
              include: { user: { select: { name: true } } },
            },
            prescriptions: {
              include: { items: true },
            },
          },
        },
        admissions: {
          orderBy: { admissionDate: 'desc' },
          include: {
            bed: { include: { room: true } },
            attendingDoctor: { include: { user: { select: { name: true } } } },
          },
        },
        bills: {
          orderBy: { createdAt: 'desc' },
          include: { items: true },
        },
        labReports: {
          orderBy: { createdAt: 'desc' },
          include: { labTest: true },
        },
      },
    });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/patients
router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      gender,
      age,
      bloodGroup,
      address,
      emergencyContactName,
      emergencyContactPhone,
      allergies,
      chronicConditions,
      dateOfBirth,
    } = req.body;

    if (!name || !phone || !gender) {
      return res.status(400).json({ error: 'Name, phone, and gender are required' });
    }

    const count = await prisma.patient.count();
    const patientCode = `PAT-${1000 + count + 1}`;

    const newPatient = await prisma.patient.create({
      data: {
        patientCode,
        name: name.trim(),
        email: email ? email.trim() : null,
        phone: phone.trim(),
        gender,
        age: age ? Number(age) : null,
        bloodGroup: bloodGroup || null,
        address: address || null,
        emergencyContactName: emergencyContactName || null,
        emergencyContactPhone: emergencyContactPhone || null,
        allergies: allergies || null,
        chronicConditions: chronicConditions || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      },
    });

    res.status(201).json(newPatient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/patients/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      gender,
      age,
      bloodGroup,
      address,
      emergencyContactName,
      emergencyContactPhone,
      allergies,
      chronicConditions,
      dateOfBirth,
    } = req.body;

    const updated = await prisma.patient.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        gender,
        age: age ? Number(age) : null,
        bloodGroup,
        address,
        emergencyContactName,
        emergencyContactPhone,
        allergies,
        chronicConditions,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/patients/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.patient.delete({ where: { id } });
    res.json({ message: 'Patient removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

