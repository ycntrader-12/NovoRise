import { Router, Request, Response } from 'express';
import pool from '../db/pool';
import { requireAuth, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Protect ALL admin routes with requireAuth and requireRole('admin')
router.use(requireAuth);
router.use(requireRole('admin'));

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/stats — Statistiques globales de la plateforme & DB
// ─────────────────────────────────────────────────────────────────────────────
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const usersCount = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE role = 'candidat') as candidats,
        COUNT(*) FILTER (WHERE role = 'recruteur') as recruteurs,
        COUNT(*) FILTER (WHERE role = 'admin') as admins,
        COUNT(*) FILTER (WHERE is_verified = true) as verified
      FROM users
    `);

    const jobsCount = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'Actif') as actifs,
        COUNT(*) FILTER (WHERE status = 'Clôturé') as clotures
      FROM job_posts
    `);

    const appsCount = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'En attente') as en_attente,
        COUNT(*) FILTER (WHERE status = 'Acceptée') as acceptees,
        COUNT(*) FILTER (WHERE status = 'Refusée') as refusees
      FROM applications
    `);

    const dbVersion = await pool.query('SELECT version();');

    res.json({
      users: usersCount.rows[0],
      jobs: jobsCount.rows[0],
      applications: appsCount.rows[0],
      dbVersion: dbVersion.rows[0]?.version || 'PostgreSQL (Supabase)',
      systemTime: new Date().toISOString()
    });
  } catch (err) {
    console.error('GET /admin/stats error:', err);
    res.status(500).json({ error: 'SERVER_ERROR' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/users — Gestion des utilisateurs (Recherche, Filtres, Rôles)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/users', async (req: Request, res: Response) => {
  try {
    const { role, search } = req.query;

    let query = `
      SELECT id, email, name, role, is_verified, created_at, avatar_url
      FROM users
      WHERE 1=1
    `;
    const params: string[] = [];
    let count = 0;

    if (role && role !== 'Tous') {
      params.push(role as string);
      query += ` AND role = $${++count}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (name ILIKE $${++count} OR email ILIKE $${count})`;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('GET /admin/users error:', err);
    res.status(500).json({ error: 'SERVER_ERROR' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/admin/users/:id — Modifier le rôle d'un utilisateur
// ─────────────────────────────────────────────────────────────────────────────
router.patch('/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role, is_verified } = req.body;

    if (role && !['candidat', 'recruteur', 'admin'].includes(role)) {
      res.status(400).json({ error: 'INVALID_ROLE' });
      return;
    }

    const result = await pool.query(
      `UPDATE users 
       SET role = COALESCE($1, role),
           is_verified = COALESCE($2, is_verified)
       WHERE id = $3
       RETURNING id, email, name, role, is_verified, created_at`,
      [role || null, is_verified !== undefined ? is_verified : null, id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ error: 'USER_NOT_FOUND' });
      return;
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('PATCH /admin/users/:id error:', err);
    res.status(500).json({ error: 'SERVER_ERROR' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/admin/users/:id — Supprimer un utilisateur
// ─────────────────────────────────────────────────────────────────────────────
router.delete('/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Protections : ne pas pouvoir se supprimer soi-même
    if (req.user?.sub === id) {
      res.status(400).json({ error: 'CANNOT_DELETE_SELF' });
      return;
    }

    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id, name, email', [id]);

    if (result.rowCount === 0) {
      res.status(404).json({ error: 'USER_NOT_FOUND' });
      return;
    }

    res.json({ message: 'USER_DELETED', user: result.rows[0] });
  } catch (err) {
    console.error('DELETE /admin/users/:id error:', err);
    res.status(500).json({ error: 'SERVER_ERROR' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/database/tables — Visualiser les tables SQL & métadonnées
// ─────────────────────────────────────────────────────────────────────────────
router.get('/database/tables', async (_req: Request, res: Response) => {
  try {
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    const tablesResult = await pool.query(tablesQuery);
    const tableNames = tablesResult.rows.map(r => r.table_name);

    const tablesDetails = await Promise.all(
      tableNames.map(async (tableName) => {
        const countRes = await pool.query(`SELECT COUNT(*) as row_count FROM "${tableName}"`);
        const colsRes = await pool.query(`
          SELECT column_name, data_type, is_nullable
          FROM information_schema.columns
          WHERE table_name = $1
          ORDER BY ordinal_position;
        `, [tableName]);

        return {
          tableName,
          rowCount: parseInt(countRes.rows[0].row_count, 10),
          columns: colsRes.rows
        };
      })
    );

    res.json(tablesDetails);
  } catch (err) {
    console.error('GET /admin/database/tables error:', err);
    res.status(500).json({ error: 'SERVER_ERROR' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/database/table/:name — Explorer le contenu d'une table SQL
// ─────────────────────────────────────────────────────────────────────────────
router.get('/database/table/:name', async (req: Request, res: Response) => {
  try {
    const name = String(req.params.name);
    const allowedTables = ['users', 'job_posts', 'applications'];

    if (!allowedTables.includes(name)) {
      res.status(400).json({ error: 'UNAUTHORIZED_TABLE' });
      return;
    }

    const result = await pool.query(`SELECT * FROM "${name}" ORDER BY 1 DESC LIMIT 100`);
    res.json(result.rows);
  } catch (err) {
    console.error(`GET /admin/database/table/${req.params.name} error:`, err);
    res.status(500).json({ error: 'SERVER_ERROR' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/admin/jobs/:id — Supprimer n'importe quelle offre d'emploi
// ─────────────────────────────────────────────────────────────────────────────
router.delete('/jobs/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM job_posts WHERE id = $1 RETURNING id, title', [id]);

    if (result.rowCount === 0) {
      res.status(404).json({ error: 'JOB_NOT_FOUND' });
      return;
    }

    res.json({ message: 'JOB_DELETED', job: result.rows[0] });
  } catch (err) {
    console.error('DELETE /admin/jobs/:id error:', err);
    res.status(500).json({ error: 'SERVER_ERROR' });
  }
});

export default router;
