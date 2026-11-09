import { Router } from 'express';
import prisma from '../prisma.js';

const router = Router();

// GET /api/billing
router.get('/', async (req, res) => {
  try {
    const { status, patientId, q } = req.query;

    const where = {};
    if (status && status !== 'ALL') where.status = String(status);
    if (patientId && patientId !== 'ALL') where.patientId = String(patientId);

    if (q) {
      const search = String(q).trim();
      where.OR = [
        { invoiceNumber: { contains: search, mode: 'insensitive' } },
        { patient: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const bills = await prisma.bill.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        patient: {
          select: { id: true, name: true, patientCode: true, phone: true, email: true },
        },
        items: true,
      },
    });

    res.json(bills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/billing/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const bill = await prisma.bill.findUnique({
      where: { id },
      include: {
        patient: true,
        items: true,
        appointment: {
          include: {
            doctor: {
              include: { user: { select: { name: true } }, department: true },
            },
          },
        },
        admission: {
          include: {
            bed: { include: { room: true } },
          },
        },
      },
    });

    if (!bill) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json(bill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/billing
router.post('/', async (req, res) => {
  try {
    const {
      patientId,
      appointmentId,
      admissionId,
      items = [],
      taxRate = 5.0,
      discount = 0,
      paymentMethod = 'CASH',
      notes,
    } = req.body;

    if (!patientId || items.length === 0) {
      return res.status(400).json({ error: 'Patient and at least one item are required' });
    }

    const subtotal = items.reduce(
      (sum, it) => sum + (Number(it.quantity) || 1) * (Number(it.unitPrice) || 0),
      0
    );
    const taxAmount = (subtotal * (Number(taxRate) || 0)) / 100;
    const totalAmount = Math.max(0, subtotal + taxAmount - (Number(discount) || 0));

    const invoiceCount = await prisma.bill.count();
    const invoiceNumber = `INV-2026-${String(invoiceCount + 1).padStart(3, '0')}`;

    const bill = await prisma.bill.create({
      data: {
        invoiceNumber,
        patientId,
        appointmentId: appointmentId || null,
        admissionId: admissionId || null,
        subtotal,
        taxRate: Number(taxRate) || 0,
        taxAmount,
        discount: Number(discount) || 0,
        totalAmount,
        paidAmount: 0,
        status: 'UNPAID',
        paymentMethod,
        notes: notes ? notes.trim() : null,
        items: {
          create: items.map((it) => ({
            description: it.description,
            category: it.category || 'OTHER',
            quantity: Number(it.quantity) || 1,
            unitPrice: Number(it.unitPrice) || 0,
            totalPrice: (Number(it.quantity) || 1) * (Number(it.unitPrice) || 0),
          })),
        },
      },
      include: {
        patient: true,
        items: true,
      },
    });

    res.status(201).json(bill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/billing/:id/pay
router.patch('/:id/pay', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, paymentMethod } = req.body;

    const bill = await prisma.bill.findUnique({ where: { id } });
    if (!bill) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const newPaidAmount = bill.paidAmount + (Number(amount) || bill.totalAmount - bill.paidAmount);
    const newStatus = newPaidAmount >= bill.totalAmount ? 'PAID' : 'PARTIAL';

    const updated = await prisma.bill.update({
      where: { id },
      data: {
        paidAmount: Math.min(newPaidAmount, bill.totalAmount),
        status: newStatus,
        paymentMethod: paymentMethod || bill.paymentMethod,
      },
      include: {
        patient: true,
        items: true,
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

