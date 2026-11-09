import { Router } from 'express';
import { seedDatabase } from '../seed.js';

const router = Router();

router.post('/reset', async (_req, res) => {
  try {
    await seedDatabase();
    res.json({ message: 'Database reset and re-seeded successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Seed failed' });
  }
});

export default router;

