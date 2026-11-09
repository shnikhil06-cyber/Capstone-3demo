import { Router } from 'express';
import prisma from '../prisma.js';

const router = Router();

// GET /api/lab/tests
router.get('/tests', async (_req, res) => {
  try {
    const tests = await prisma.labTest.findMany({
      orderBy: { testName: 'asc' },
    });
    res.json(tests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/lab/reports
router.get('/reports', async (req, res) => {
  try {
    const { patientId, status } = req.query;

    const where = {};
    if (patientId && patientId !== 'ALL') where.patientId = String(patientId);
    if (status && status !== 'ALL') where.status = String(status);

    const reports = await prisma.labReport.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        labTest: true,
        patient: { select: { id: true, name: true, patientCode: true, age: true, gender: true } },
        doctor: {
          include: { user: { select: { name: true } } },
        },
      },
    });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/lab/reports
router.post('/reports', async (req, res) => {
  try {
    const { labTestId, patientId, doctorId, testDate } = req.body;
    if (!labTestId || !patientId || !doctorId) {
      return res.status(400).json({ error: 'Lab test, patient, and doctor are required' });
    }

    const count = await prisma.labReport.count();
    const reportCode = `REP-2026-${String(count + 1).padStart(3, '0')}`;

    const report = await prisma.labReport.create({
      data: {
        reportCode,
        labTestId,
        patientId,
        doctorId,
        testDate: testDate ? new Date(testDate) : new Date(),
        status: 'REQUESTED',
      },
      include: {
        labTest: true,
        patient: true,
        doctor: { include: { user: { select: { name: true } } } },
      },
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/lab/reports/:id
router.patch('/reports/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { resultSummary, findings, normalRange, status } = req.body;

    const report = await prisma.labReport.update({
      where: { id },
      data: {
        resultSummary: resultSummary || undefined,
        findings: findings || undefined,
        normalRange: normalRange || undefined,
        status: status || undefined,
      },
      include: {
        labTest: true,
        patient: true,
        doctor: { include: { user: { select: { name: true } } } },
      },
    });

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

