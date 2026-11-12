import { Router } from 'express';
import prisma from '../prisma.js';

const router = Router();

// GET /api/pharmacy/medicines
router.get('/medicines', async (req, res) => {
  try {
    const { q, category, lowStockOnly } = req.query;

    const where = {};
    if (category && category !== 'ALL') {
      where.category = String(category);
    }
    if (q) {
      const search = String(q).trim();
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { genericName: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { manufacturer: { contains: search, mode: 'insensitive' } },
      ];
    }

    const medicines = await prisma.medicine.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    const filtered = lowStockOnly === 'true'
      ? medicines.filter((m) => m.stock <= m.minStockAlert)
      : medicines;

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/pharmacy/medicines
router.post('/medicines', async (req, res) => {
  try {
    const { name, genericName, category, manufacturer, dosageForm = 'TABLET', stock = 0, minStockAlert = 10, unitPrice, expiryDate } = req.body;

    if (!name || !category || unitPrice === undefined || !expiryDate) {
      return res.status(400).json({ error: 'Name, Category, Unit Price, and Expiry Date are required' });
    }

    const count = await prisma.medicine.count();
    const code = `MED-${100 + count + 1}`;

    const medicine = await prisma.medicine.create({
      data: {
        code,
        name: name.trim(),
        genericName: genericName ? genericName.trim() : null,
        category: category.trim(),
        manufacturer: manufacturer ? manufacturer.trim() : null,
        dosageForm,
        stock: Number(stock),
        minStockAlert: Number(minStockAlert),
        unitPrice: Number(unitPrice),
        expiryDate: new Date(expiryDate),
      },
    });

    res.status(201).json(medicine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/pharmacy/medicines/:id
router.put('/medicines/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, genericName, category, manufacturer, dosageForm, stock, minStockAlert, unitPrice, expiryDate } = req.body;

    const updated = await prisma.medicine.update({
      where: { id },
      data: {
        name: name ? name.trim() : undefined,
        genericName: genericName !== undefined ? genericName : undefined,
        category: category ? category.trim() : undefined,
        manufacturer: manufacturer !== undefined ? manufacturer : undefined,
        dosageForm: dosageForm || undefined,
        stock: stock !== undefined ? Number(stock) : undefined,
        minStockAlert: minStockAlert !== undefined ? Number(minStockAlert) : undefined,
        unitPrice: unitPrice !== undefined ? Number(unitPrice) : undefined,
        expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/pharmacy/medicines/:id
router.delete('/medicines/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.medicine.delete({ where: { id } });
    res.json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

