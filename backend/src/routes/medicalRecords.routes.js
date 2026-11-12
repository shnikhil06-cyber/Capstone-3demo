import { Router } from 'express';
import prisma from '../prisma.js';

const router = Router();

// GET /api/medical-records
router.get('/', async (req, res) => {
  try {
    const { patientId, doctorId } = req.query;

    const where = {};
    if (patientId && patientId !== 'ALL') where.patientId = String(patientId);
    if (doctorId && doctorId !== 'ALL') where.doctorId = String(doctorId);

    const records = await prisma.medicalRecord.findMany({
      where,
      orderBy: { recordDate: 'desc' },
      include: {
        patient: { select: { id: true, name: true, patientCode: true, age: true, gender: true, bloodGroup: true } },
        doctor: {
          include: {
            user: { select: { name: true } },
            department: { select: { name: true } },
          },
        },
        appointment: { select: { id: true, appointmentNumber: true, appointmentDate: true } },
        prescriptions: {
          include: {
            items: {
              include: { medicine: true },
            },
          },
        },
      },
    });

    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/medical-records/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const record = await prisma.medicalRecord.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: {
          include: {
            user: { select: { name: true, email: true } },
            department: true,
          },
        },
        appointment: true,
        prescriptions: {
          include: {
            items: {
              include: { medicine: true },
            },
          },
        },
      },
    });

    if (!record) {
      return res.status(404).json({ error: 'Medical record not found' });
    }

    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/medical-records
router.post('/', async (req, res) => {
  try {
    const { patientId, doctorId, appointmentId, diagnosis, symptoms, vitalsBp, vitalsPulse, vitalsTemp, vitalsWeight, doctorNotes, followUpDate, prescriptionItems = [], prescriptionNotes } = req.body;

    if (!patientId || !doctorId || !diagnosis) {
      return res.status(400).json({ error: 'Patient, Doctor, and Diagnosis are required' });
    }

    const created = await prisma.$transaction(async (tx) => {
      // 1. Create Medical Record
      const record = await tx.medicalRecord.create({
        data: {
          patientId,
          doctorId,
          appointmentId: appointmentId || null,
          diagnosis: diagnosis.trim(),
          symptoms: symptoms ? symptoms.trim() : null,
          vitalsBp: vitalsBp || null,
          vitalsPulse: vitalsPulse || null,
          vitalsTemp: vitalsTemp || null,
          vitalsWeight: vitalsWeight || null,
          doctorNotes: doctorNotes ? doctorNotes.trim() : null,
          followUpDate: followUpDate ? new Date(followUpDate) : null,
        },
      });

      // 2. If appointmentId is supplied, mark appointment as COMPLETED
      if (appointmentId) {
        await tx.appointment.update({
          where: { id: appointmentId },
          data: { status: 'COMPLETED' },
        });
      }

      // 3. Create Prescription if items are provided
      if (prescriptionItems && prescriptionItems.length > 0) {
        const prescription = await tx.prescription.create({
          data: {
            medicalRecordId: record.id,
            patientId,
            doctorId,
            notes: prescriptionNotes || null,
          },
        });

        for (const item of prescriptionItems) {
          if (item.medicineName && item.medicineName.trim()) {
            await tx.prescriptionItem.create({
              data: {
                prescriptionId: prescription.id,
                medicineId: item.medicineId || null,
                medicineName: item.medicineName.trim(),
                dosage: item.dosage || '1 tablet',
                frequency: item.frequency || 'Twice a day',
                durationDays: Number(item.durationDays) || 5,
                instructions: item.instructions || null,
              },
            });

            // If medicine is tracked in stock, deduct quantity
            if (item.medicineId) {
              await tx.medicine.update({
                where: { id: item.medicineId },
                data: {
                  stock: {
                    decrement: Math.min(10, item.durationDays ? Number(item.durationDays) : 1),
                  },
                },
              });
            }
          }
        }
      }

      return record;
    });

    const fullRecord = await prisma.medicalRecord.findUnique({
      where: { id: created.id },
      include: {
        patient: true,
        doctor: {
          include: {
            user: { select: { name: true } },
            department: true,
          },
        },
        prescriptions: {
          include: { items: true },
        },
      },
    });

    res.status(201).json(fullRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

