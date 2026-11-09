import { Router } from 'express';
import bcryptjs from 'bcryptjs';
import prisma from '../prisma.js';
import { authenticate, generateToken } from '../middleware/auth.js';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        doctor: {
          include: { department: true },
        },
        patient: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const { password: _, ...userWithoutPassword } = user;
    res.json({
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Login failed' });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, username, role = 'PATIENT', phone, gender, bloodGroup, age, address } = req.body;
    if (!email || !password || (!name && !username)) {
      return res.status(400).json({ error: 'Email, password, and username/name are required' });
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existing) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const finalUsername = username || name || email.split('@')[0];
    const finalName = name || username || finalUsername;

    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username: finalUsername,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        name: finalName,
        role,
        phone,
      },
    });

    let patientRecord = null;
    if (role === 'PATIENT') {
      const patientCount = await prisma.patient.count();
      patientRecord = await prisma.patient.create({
        data: {
          userId: user.id,
          patientCode: `PAT-${1000 + patientCount + 1}`,
          name: user.name,
          email: user.email,
          phone: phone || '',
          gender: gender || 'Other',
          bloodGroup: bloodGroup || null,
          age: age ? Number(age) : null,
          address: address || null,
        },
      });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        patient: patientRecord,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Registration failed' });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        doctor: {
          include: { department: true },
        },
        patient: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/auth/demo-users
router.get('/demo-users', async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        doctor: {
          select: {
            specialization: true,
            department: { select: { name: true } },
          },
        },
      },
      take: 10,
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

