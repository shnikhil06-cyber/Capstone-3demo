import { Router } from 'express';
import prisma from '../prisma.js';

const router = Router();

// GET /api/dashboard/stats
router.get('/stats', async (_req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalPatients,
      totalDoctors,
      totalDepartments,
      todayAppointments,
      pendingAppointments,
      totalBeds,
      occupiedBeds,
      medicines,
      paidBills,
      unpaidBills,
    ] = await Promise.all([
      prisma.patient.count(),
      prisma.doctor.count(),
      prisma.department.count(),
      prisma.appointment.count({
        where: {
          appointmentDate: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
      prisma.appointment.count({
        where: { status: 'PENDING' },
      }),
      prisma.bed.count(),
      prisma.bed.count({
        where: { status: 'OCCUPIED' },
      }),
      prisma.medicine.findMany({
        select: { stock: true, minStockAlert: true },
      }),
      prisma.bill.aggregate({
        _sum: { paidAmount: true },
        where: { status: { in: ['PAID', 'PARTIAL'] } },
      }),
      prisma.bill.aggregate({
        _sum: { totalAmount: true },
        where: { status: 'UNPAID' },
      }),
    ]);

    const lowStockMedicines = medicines.filter((m) => m.stock <= m.minStockAlert).length;
    const bedOccupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
    const totalRevenue = paidBills._sum.paidAmount || 0;
    const pendingReceivables = unpaidBills._sum.totalAmount || 0;

    res.json({
      totalPatients,
      totalDoctors,
      totalDepartments,
      todayAppointments,
      pendingAppointments,
      totalBeds,
      occupiedBeds,
      availableBeds: totalBeds - occupiedBeds,
      bedOccupancyRate,
      lowStockMedicines,
      totalRevenue,
      pendingReceivables,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/dashboard/recent
router.get('/recent', async (_req, res) => {
  try {
    const [recentAppointments, recentAdmissions, recentBills, lowStockList] = await Promise.all([
      prisma.appointment.findMany({
        take: 5,
        orderBy: { appointmentDate: 'desc' },
        include: {
          patient: { select: { id: true, name: true, patientCode: true, phone: true } },
          doctor: {
            include: {
              user: { select: { name: true } },
              department: { select: { name: true } },
            },
          },
        },
      }),
      prisma.admission.findMany({
        take: 5,
        where: { status: 'ADMITTED' },
        orderBy: { admissionDate: 'desc' },
        include: {
          patient: { select: { id: true, name: true, patientCode: true } },
          bed: { include: { room: true } },
          attendingDoctor: { include: { user: { select: { name: true } } } },
        },
      }),
      prisma.bill.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          patient: { select: { id: true, name: true, patientCode: true } },
        },
      }),
      prisma.medicine.findMany({
        where: {
          stock: { lte: 25 },
        },
        take: 5,
        orderBy: { stock: 'asc' },
      }),
    ]);

    res.json({
      recentAppointments,
      recentAdmissions,
      recentBills,
      lowStockList,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

