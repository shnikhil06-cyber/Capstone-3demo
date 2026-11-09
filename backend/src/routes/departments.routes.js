import { Router } from 'express';
import prisma from '../prisma.js';

const router = Router();

// GET /api/departments
router.get('/', async (_req, res) => {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            doctors: true,
            appointments: true,
          },
        },
        doctors: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
      },
    });

    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/departments
router.post('/', async (req, res) => {
  try {
    const { name, code, description, icon } = req.body;
    if (!name || !code) {
      return res.status(400).json({ error: 'Name and Code are required' });
    }

    const dept = await prisma.department.create({
      data: {
        name: name.trim(),
        code: code.trim().toUpperCase(),
        description: description ? description.trim() : null,
        icon: icon || 'Building2',
      },
    });

    res.status(201).json(dept);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/departments/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description, icon } = req.body;

    const dept = await prisma.department.update({
      where: { id },
      data: {
        name: name ? name.trim() : undefined,
        code: code ? code.trim().toUpperCase() : undefined,
        description: description !== undefined ? description : undefined,
        icon: icon || undefined,
      },
    });

    res.json(dept);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

