import { Router } from 'express';
import prisma from '../prisma.js';

const router = Router();

// GET /api/rooms
router.get('/', async (_req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: { roomNumber: 'asc' },
      include: {
        beds: {
          orderBy: { bedNumber: 'asc' },
          include: {
            admissions: {
              where: { status: 'ADMITTED' },
              include: {
                patient: { select: { id: true, name: true, patientCode: true } },
                attendingDoctor: { include: { user: { select: { name: true } } } },
              },
            },
          },
        },
      },
    });

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/rooms/beds
router.get('/beds', async (req, res) => {
  try {
    const { status, roomType } = req.query;

    const where = {};
    if (status && status !== 'ALL') where.status = String(status);
    if (roomType && roomType !== 'ALL') where.room = { roomType: String(roomType) };

    const beds = await prisma.bed.findMany({
      where,
      orderBy: { bedNumber: 'asc' },
      include: {
        room: true,
        admissions: {
          where: { status: 'ADMITTED' },
          include: {
            patient: true,
            attendingDoctor: { include: { user: { select: { name: true } } } },
          },
        },
      },
    });

    res.json(beds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/rooms/admissions
router.post('/admissions', async (req, res) => {
  try {
    const { patientId, bedId, attendingDoctorId, reason, notes } = req.body;
    if (!patientId || !bedId || !attendingDoctorId || !reason) {
      return res.status(400).json({ error: 'Patient, Bed, Attending Doctor, and Reason are required' });
    }

    const bed = await prisma.bed.findUnique({ where: { id: bedId } });
    if (!bed) {
      return res.status(404).json({ error: 'Bed not found' });
    }
    if (bed.status !== 'AVAILABLE') {
      return res.status(400).json({ error: `Bed ${bed.bedNumber} is currently ${bed.status}` });
    }

    const admissionCount = await prisma.admission.count();
    const admissionCode = `ADM-2026-${String(admissionCount + 1).padStart(3, '0')}`;

    const admission = await prisma.$transaction(async (tx) => {
      const adm = await tx.admission.create({
        data: {
          admissionCode,
          patientId,
          bedId,
          attendingDoctorId,
          reason: reason.trim(),
          notes: notes ? notes.trim() : null,
          status: 'ADMITTED',
        },
        include: {
          patient: true,
          bed: { include: { room: true } },
          attendingDoctor: { include: { user: { select: { name: true } } } },
        },
      });

      await tx.bed.update({
        where: { id: bedId },
        data: { status: 'OCCUPIED' },
      });

      return adm;
    });

    res.status(201).json(admission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/rooms/admissions/:id/discharge
router.post('/admissions/:id/discharge', async (req, res) => {
  try {
    const { id } = req.params;
    const admission = await prisma.admission.findUnique({
      where: { id },
      include: { bed: { include: { room: true } }, patient: true },
    });

    if (!admission) {
      return res.status(404).json({ error: 'Admission not found' });
    }

    if (admission.status === 'DISCHARGED') {
      return res.status(400).json({ error: 'Patient is already discharged' });
    }

    const dischargeDate = new Date();
    const daysStayed = Math.max(
      1,
      Math.ceil((dischargeDate.getTime() - new Date(admission.admissionDate).getTime()) / (1000 * 60 * 60 * 24))
    );
    const roomRate = admission.bed.room.dailyRate;
    const totalBedCharges = daysStayed * roomRate;

    const result = await prisma.$transaction(async (tx) => {
      const updatedAdm = await tx.admission.update({
        where: { id },
        data: {
          status: 'DISCHARGED',
          dischargeDate,
        },
      });

      await tx.bed.update({
        where: { id: admission.bedId },
        data: { status: 'AVAILABLE' },
      });

      const invoiceCount = await prisma.bill.count();
      const invoiceNumber = `INV-2026-${String(invoiceCount + 1).padStart(3, '0')}`;
      const taxRate = 5.0;
      const taxAmount = (totalBedCharges * taxRate) / 100;
      const totalAmount = totalBedCharges + taxAmount;

      const bill = await tx.bill.create({
        data: {
          invoiceNumber,
          patientId: admission.patientId,
          admissionId: admission.id,
          issueDate: new Date(),
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          subtotal: totalBedCharges,
          taxRate,
          taxAmount,
          discount: 0,
          totalAmount,
          paidAmount: 0,
          status: 'UNPAID',
          paymentMethod: 'CASH',
          notes: `Discharge bill for ${daysStayed} day(s) stay in Room ${admission.bed.room.roomNumber} (${admission.bed.bedNumber})`,
          items: {
            create: [
              {
                description: `Room & Bed Accommodation (${daysStayed} day(s) @ ₹${roomRate}/day)`,
                category: 'BED_CHARGE',
                quantity: daysStayed,
                unitPrice: roomRate,
                totalPrice: totalBedCharges,
              },
            ],
          },
        },
      });

      return { admission: updatedAdm, bill };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/rooms/beds/:id/status
router.patch('/beds/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'RESERVED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid bed status' });
    }

    const bed = await prisma.bed.update({
      where: { id },
      data: { status },
      include: { room: true },
    });

    res.json(bed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

