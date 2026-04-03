import { Router } from 'express';
import { db } from '../db/knex';

const router = Router();

// health check
router.get('/health', async (req, res) => {
  await db.raw('SELECT 1');

  res.json({
    status: 'ok',
    uptime: process.uptime(),
  });
});

export default router;