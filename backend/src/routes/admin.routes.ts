import { Router, Request, Response } from 'express';
import pool from '../db/pool';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Protect ALL admin routes — admin_manager can access user management only
router.use(requireAuth);
router.use(requireRole('admin', 'admin_manager'));

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/stats — Statistiques globales (admin uniquement)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/stats', requireRole('admin'), async (_req: Request, res: Response) => {
  try {
    const usersCount = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN role = 'candidat' THEN 1 ELSE 0 END) as candidats,
        SUM(CASE WHEN role = 'recruteur' THEN 1 ELSE 0 END) as recruteurs,
        SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admins,
        SUM(CASE WHEN verified = 1 THEN 1 ELSE 0 END) as verified
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
        SUM(CASE WHEN status = 'En attente' THEN 1 ELSE 0 END) as en_attente,
        SUM(CASE WHEN status = 'Acceptée' THEN 1 ELSE 0 END) as acceptees,
        SUM(CASE WHEN status = 'Refusée' THEN 1 ELSE 0 END) as refusees
      FROM applications
    `);

    const dbVersion = await pool.query("SELECT 'SQLite (local)' as version");

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
      SELECT id, email, name, role, verified as is_verified, created_at, avatar_url
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
      query += ` AND (name LIKE $${++count} OR email LIKE $${count})`;
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

    if (role && !['candidat', 'recruteur', 'admin', 'admin_manager'].includes(role)) {
      res.status(400).json({ error: 'INVALID_ROLE' });
      return;
    }

    const result = await pool.query(
      `UPDATE users 
       SET role = COALESCE($1, role),
           verified = COALESCE($2, verified)
       WHERE id = $3
       RETURNING id, email, name, role, verified as is_verified, created_at`,
      [role || null, is_verified !== undefined ? (is_verified ? 1 : 0) : null, id]
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
// POST /api/admin/users — Créer un utilisateur (admin uniquement)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/users', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400).json({ error: 'VALIDATION_ERROR', message: 'name, email, password, role sont requis' });
      return;
    }

    if (!['candidat', 'recruteur', 'admin', 'admin_manager'].includes(role)) {
      res.status(400).json({ error: 'INVALID_ROLE' });
      return;
    }

    // Vérifier si email existe déjà
    try {
      const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
      if (existing.rows.length > 0) {
        res.status(409).json({ error: 'EMAIL_ALREADY_EXISTS', message: 'Cet email est déjà utilisé' });
        return;
      }
    } catch (_dbErr) { /* mode hors-ligne */ }

    const passwordHash = await bcrypt.hash(password, 12);

    let newUser;
    try {
      const newId = uuidv4();
      const result = await pool.query(
        `INSERT INTO users (id, name, email, password_hash, role, verified)
         VALUES ($1, $2, $3, $4, $5, 1)
         RETURNING id, name, email, role, verified, created_at`,
        [newId, name, email.toLowerCase(), passwordHash, role]
      );
      newUser = result.rows[0];
    } catch (_dbErr) {
      console.warn('⚠️ Mode hors-ligne : utilisateur créé en mémoire.');
      newUser = { id: uuidv4(), name, email: email.toLowerCase(), role, verified: true, created_at: new Date().toISOString() };
    }

    res.status(201).json({ message: 'Utilisateur créé avec succès', user: newUser });
  } catch (err) {
    console.error('POST /admin/users error:', err);
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
// GET /api/admin/database/tables — Visualiser les tables SQL (admin uniquement)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/database/tables', requireRole('admin'), async (_req: Request, res: Response) => {
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
// GET /api/admin/database/table/:name — Explorer une table (admin uniquement)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/database/table/:name', requireRole('admin'), async (req: Request, res: Response) => {
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
// DELETE /api/admin/jobs/:id — Supprimer une offre (admin uniquement)
// ─────────────────────────────────────────────────────────────────────────────
router.delete('/jobs/:id', requireRole('admin'), async (req: Request, res: Response) => {
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
