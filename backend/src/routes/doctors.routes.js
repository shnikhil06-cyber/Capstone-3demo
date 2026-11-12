import { Router } from 'express';
import bcryptjs from 'bcryptjs';
import prisma from '../prisma.js';

const router = Router();

// GET /api/doctors
router.get('/', async (req, res) => {
  try {
    const { departmentId, availableOnly, q } = req.query;

    const where = {};
    if (departmentId && departmentId !== 'ALL') {
      where.departmentId = String(departmentId);
    }
    if (availableOnly === 'true') {
      where.isAvailable = true;
    }
    if (q) {
      const search = String(q).trim();
      where.OR = [
        { specialization: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const doctors = await prisma.doctor.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
          },
        },
        department: true,
        _count: {
          select: {
            appointments: true,
            admissions: true,
          },
        },
      },
    });

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/doctors/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        department: true,
        appointments: {
          take: 10,
          orderBy: { appointmentDate: 'desc' },
          include: {
            patient: { select: { id: true, name: true, patientCode: true, phone: true } },
          },
        },
      },
    });

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/doctors
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, password = 'Password@123', departmentId, specialization, qualification, experienceYears = 0, consultationFee = 500, roomNo, workingHours = '09:00 AM - 05:00 PM' } = req.body;

    if (!name || !email || !departmentId || !specialization || !qualification) {
      return res.status(400).json({ error: 'Name, email, department, specialization, and qualification are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existingUser) {
      return res.status(409).json({ error: 'A user with this email already exists' });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username: name.trim().toLowerCase().replace(/[^a-z0-9]/g, '.'),
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          phone: phone || null,
          role: 'DOCTOR',
        },
      });

      const doctor = await tx.doctor.create({
        data: {
          userId: user.id,
          departmentId,
          specialization: specialization.trim(),
          qualification: qualification.trim(),
          experienceYears: Number(experienceYears),
          consultationFee: Number(consultationFee),
          roomNo: roomNo || null,
          workingHours: workingHours || '09:00 AM - 05:00 PM',
          isAvailable: true,
        },
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
          department: true,
        },
      });

      return doctor;
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/doctors/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { specialization, qualification, experienceYears, consultationFee, roomNo, workingHours, isAvailable, name, phone } = req.body;

    const doctor = await prisma.doctor.findUnique({ where: { id } });
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (name || phone) {
        await tx.user.update({
          where: { id: doctor.userId },
          data: {
            name: name || undefined,
            phone: phone || undefined,
          },
        });
      }

      return tx.doctor.update({
        where: { id },
        data: {
          specialization: specialization || undefined,
          qualification: qualification || undefined,
          experienceYears: experienceYears !== undefined ? Number(experienceYears) : undefined,
          consultationFee: consultationFee !== undefined ? Number(consultationFee) : undefined,
          roomNo: roomNo !== undefined ? roomNo : undefined,
          workingHours: workingHours || undefined,
          isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : undefined,
        },
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
          department: true,
        },
      });
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/doctors/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await prisma.doctor.findUnique({ where: { id } });
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    await prisma.user.delete({ where: { id: doctor.userId } });
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

