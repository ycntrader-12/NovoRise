import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../db/pool';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import emailQueue from '../services/email.queue';

const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/jobs — Liste publique des offres actives
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, contract, workplace, search } = req.query;

    let query = `
      SELECT j.*, u.name as recruiter_name, u.avatar_url as recruiter_avatar
      FROM job_posts j
      JOIN users u ON j.recruiter_id = u.id
      WHERE j.status = 'Actif'
    `;
    const params: string[] = [];
    let paramCount = 0;

    if (category) {
      params.push(category as string);
      query += ` AND j.category = $${++paramCount}`;
    }
    if (contract) {
      params.push(contract as string);
      query += ` AND j.contract = $${++paramCount}`;
    }
    if (workplace) {
      params.push(workplace as string);
      query += ` AND j.workplace = $${++paramCount}`;
    }
    if (search) {
      params.push(`%${search}%`);
      query += ` AND (j.title ILIKE $${++paramCount} OR j.company ILIKE $${paramCount} OR j.description ILIKE $${paramCount})`;
    }

    query += ' ORDER BY j.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('GET /jobs error:', err);
    res.status(500).json({ error: 'SERVER_ERROR' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/jobs/mine — Offres du recruteur connecté
// ─────────────────────────────────────────────────────────────────────────────
router.get('/mine', requireAuth, requireRole('recruteur', 'admin'), async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM job_posts WHERE recruiter_id = $1 ORDER BY created_at DESC',
      [req.user!.sub]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('GET /jobs/mine error:', err);
    res.status(500).json({ error: 'SERVER_ERROR' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/jobs — Créer une offre (recruteur seulement)
// ─────────────────────────────────────────────────────────────────────────────
router.post(
  '/',
  requireAuth,
  requireRole('recruteur', 'admin'),
  [
    body('title').trim().notEmpty(),
    body('company').trim().notEmpty(),
    body('category').isIn(['Tech & IT', 'Marketing & Com', 'Vente & Business', 'Ingénierie & R&D']),
    body('contract').isIn(['CDI', 'CDD', 'Freelance', 'Stage']),
    body('workplace').isIn(['Remote', 'Hybride', 'Présentiel']),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: 'VALIDATION_ERROR', details: errors.array() });
      return;
    }

    try {
      const { title, company, category, contract, workplace, location, salary, description, tags } = req.body;

      const result = await pool.query(
        `INSERT INTO job_posts (recruiter_id, title, company, category, contract, workplace, location, salary, description, tags)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [req.user!.sub, title, company, category, contract, workplace, location, salary, description, tags || []]
      );

      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('POST /jobs error:', err);
      res.status(500).json({ error: 'SERVER_ERROR' });
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/jobs/:id — Modifier une offre
// ─────────────────────────────────────────────────────────────────────────────
router.put('/:id', requireAuth, requireRole('recruteur', 'admin'), async (req: Request, res: Response) => {
  try {
    const { title, company, category, contract, workplace, location, salary, description, tags, status } = req.body;

    const result = await pool.query(
      `UPDATE job_posts SET
        title = COALESCE($1, title),
        company = COALESCE($2, company),
        category = COALESCE($3, category),
        contract = COALESCE($4, contract),
        workplace = COALESCE($5, workplace),
        location = COALESCE($6, location),
        salary = COALESCE($7, salary),
        description = COALESCE($8, description),
        tags = COALESCE($9, tags),
        status = COALESCE($10, status)
      WHERE id = $11 AND recruiter_id = $12
      RETURNING *`,
      [title, company, category, contract, workplace, location, salary, description, tags, status, req.params.id, req.user!.sub]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'JOB_NOT_FOUND_OR_UNAUTHORIZED' });
      return;
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('PUT /jobs/:id error:', err);
    res.status(500).json({ error: 'SERVER_ERROR' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/jobs/:id — Supprimer une offre
// ─────────────────────────────────────────────────────────────────────────────
router.delete('/:id', requireAuth, requireRole('recruteur', 'admin'), async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'DELETE FROM job_posts WHERE id = $1 AND recruiter_id = $2 RETURNING id',
      [req.params.id, req.user!.sub]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'JOB_NOT_FOUND_OR_UNAUTHORIZED' });
      return;
    }

    res.json({ message: 'Offre supprimée.' });
  } catch (err) {
    console.error('DELETE /jobs/:id error:', err);
    res.status(500).json({ error: 'SERVER_ERROR' });
  }
});

export default router;
