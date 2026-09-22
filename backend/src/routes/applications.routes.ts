import { Router, Request, Response } from 'express';
import pool from '../db/pool';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import emailQueue from '../services/email.queue';

const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/applications — Soumettre une candidature (candidat)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/', requireAuth, requireRole('candidat'), async (req: Request, res: Response) => {
  try {
    const { jobId, coverNote, cvFileName } = req.body;
    const candidateId = req.user!.sub;

    // Vérifier que l'offre existe et est active
    const jobResult = await pool.query(
      `SELECT j.id, j.title, j.company, u.id as recruiter_id, u.email as recruiter_email, u.name as recruiter_name
       FROM job_posts j JOIN users u ON j.recruiter_id = u.id
       WHERE j.id = $1 AND j.status = 'Actif'`,
      [jobId]
    );

    if (jobResult.rows.length === 0) {
      res.status(404).json({ error: 'JOB_NOT_FOUND', message: "Cette offre n'existe pas ou n'est plus active." });
      return;
    }

    const job = jobResult.rows[0];

    // Insérer la candidature
    const appResult = await pool.query(
      `INSERT INTO applications (job_id, candidate_id, cover_note, cv_filename)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (job_id, candidate_id) DO NOTHING
       RETURNING *`,
      [jobId, candidateId, coverNote, cvFileName]
    );

    if (appResult.rows.length === 0) {
      res.status(409).json({ error: 'ALREADY_APPLIED', message: 'Vous avez déjà postulé pour cette offre.' });
      return;
    }

    // Incrémenter le compteur de candidatures sur l'offre
    await pool.query(
      'UPDATE job_posts SET applications_count = applications_count + 1 WHERE id = $1',
      [jobId]
    );

    // Push notification email recruteur dans Bull/Redis (asynchrone)
    await emailQueue.add({
      type: 'application-notification',
      to: job.recruiter_email,
      name: job.recruiter_name,
      payload: {
        recruiterName: job.recruiter_name,
        jobTitle: job.title,
        candidateName: req.user!.name,
        candidateEmail: req.user!.email,
        appliedAt: new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Casablanca' }),
      },
    });

    res.status(201).json(appResult.rows[0]);
  } catch (err) {
    console.error('POST /applications error:', err);
    res.status(500).json({ error: 'SERVER_ERROR' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/applications/me — Mes candidatures (candidat)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/me', requireAuth, requireRole('candidat'), async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT a.*, j.title as job_title, j.company, j.location, j.workplace, j.contract
       FROM applications a
       JOIN job_posts j ON a.job_id = j.id
       WHERE a.candidate_id = $1
       ORDER BY a.applied_at DESC`,
      [req.user!.sub]
    );

    res.json(result.rows.map(row => ({
      id: row.id,
      jobId: row.job_id,
      jobTitle: row.job_title,
      company: row.company,
      location: row.location,
      workplace: row.workplace,
      contract: row.contract,
      status: row.status,
      appliedAt: row.applied_at,
      coverNote: row.cover_note,
      cvFileName: row.cv_filename,
    })));
  } catch (err) {
    console.error('GET /applications/me error:', err);
    res.status(500).json({ error: 'SERVER_ERROR' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/applications/job/:jobId — Candidatures pour une offre (recruteur)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/job/:jobId', requireAuth, requireRole('recruteur', 'admin'), async (req: Request, res: Response) => {
  try {
    // Vérifier que l'offre appartient au recruteur connecté
    const jobCheck = await pool.query(
      'SELECT id FROM job_posts WHERE id = $1 AND recruiter_id = $2',
      [req.params.jobId, req.user!.sub]
    );

    if (jobCheck.rows.length === 0) {
      res.status(403).json({ error: 'FORBIDDEN' });
      return;
    }

    const result = await pool.query(
      `SELECT a.*, u.name as candidate_name, u.email as candidate_email, u.phone as candidate_phone
       FROM applications a
       JOIN users u ON a.candidate_id = u.id
       WHERE a.job_id = $1
       ORDER BY a.applied_at DESC`,
      [req.params.jobId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('GET /applications/job/:jobId error:', err);
    res.status(500).json({ error: 'SERVER_ERROR' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/applications/:id/status — Changer le statut d'une candidature (recruteur)
// ─────────────────────────────────────────────────────────────────────────────
router.patch('/:id/status', requireAuth, requireRole('recruteur', 'admin'), async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const validStatuses = ['En attente', "En cours d'examen", 'Entretien', 'Acceptée', 'Refusée'];

    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: 'INVALID_STATUS' });
      return;
    }

    const result = await pool.query(
      `UPDATE applications SET status = $1
       WHERE id = $2
       AND job_id IN (SELECT id FROM job_posts WHERE recruiter_id = $3)
       RETURNING *`,
      [status, req.params.id, req.user!.sub]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'APPLICATION_NOT_FOUND_OR_UNAUTHORIZED' });
      return;
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('PATCH /applications/:id/status error:', err);
    res.status(500).json({ error: 'SERVER_ERROR' });
  }
});

export default router;
