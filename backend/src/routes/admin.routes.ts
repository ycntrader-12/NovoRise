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
      SELECT id, email, name, role, verified as is_verified, created_at, avatar_url,
             phone, title, location, company_name, company_website, bio, google_id
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
// PATCH /api/admin/users/:id — Modifier un utilisateur (profil, rôle, mot de passe)
// ─────────────────────────────────────────────────────────────────────────────
router.patch('/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      email, 
      role, 
      is_verified, 
      password, 
      phone, 
      title, 
      location, 
      company_name, 
      company_website, 
      bio 
    } = req.body;

    const existingUser = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (existingUser.rows.length === 0) {
      res.status(404).json({ error: 'USER_NOT_FOUND', message: 'Utilisateur introuvable' });
      return;
    }
    const current = existingUser.rows[0];

    // Vérifier l'email si modifié
    if (email && email.toLowerCase().trim() !== current.email.toLowerCase().trim()) {
      const emailCheck = await pool.query('SELECT id FROM users WHERE email = $1 AND id != $2', [email.toLowerCase().trim(), id]);
      if (emailCheck.rows.length > 0) {
        res.status(409).json({ error: 'EMAIL_ALREADY_EXISTS', message: 'Cet email est déjà utilisé par un autre compte.' });
        return;
      }
    }

    if (role && !['candidat', 'recruteur', 'admin', 'admin_manager'].includes(role)) {
      res.status(400).json({ error: 'INVALID_ROLE', message: 'Rôle invalide' });
      return;
    }

    let passwordHash = current.password_hash;
    if (password && typeof password === 'string' && password.trim().length > 0) {
      if (password.trim().length < 6) {
        res.status(400).json({ error: 'PASSWORD_TOO_SHORT', message: 'Le mot de passe doit comporter au moins 6 caractères.' });
        return;
      }
      passwordHash = await bcrypt.hash(password.trim(), 12);
    }

    const updatedName = name !== undefined ? name.trim() : current.name;
    const updatedEmail = email !== undefined ? email.toLowerCase().trim() : current.email;
    const updatedRole = role !== undefined ? role : current.role;
    const updatedVerified = is_verified !== undefined ? (is_verified ? 1 : 0) : current.verified;
    const updatedPhone = phone !== undefined ? phone : current.phone;
    const updatedTitle = title !== undefined ? title : current.title;
    const updatedLocation = location !== undefined ? location : current.location;
    const updatedCompany = company_name !== undefined ? company_name : current.company_name;
    const updatedWebsite = company_website !== undefined ? company_website : current.company_website;
    const updatedBio = bio !== undefined ? bio : current.bio;

    await pool.query(
      `UPDATE users 
       SET name = $1,
           email = $2,
           role = $3,
           verified = $4,
           password_hash = $5,
           phone = $6,
           title = $7,
           location = $8,
           company_name = $9,
           company_website = $10,
           bio = $11,
           updated_at = datetime('now')
       WHERE id = $12`,
      [
        updatedName,
        updatedEmail,
        updatedRole,
        updatedVerified,
        passwordHash,
        updatedPhone,
        updatedTitle,
        updatedLocation,
        updatedCompany,
        updatedWebsite,
        updatedBio,
        id
      ]
    );

    const result = await pool.query(
      `SELECT id, email, name, role, verified as is_verified, created_at, avatar_url,
              phone, title, location, company_name, company_website, bio, google_id
       FROM users WHERE id = $1`,
      [id]
    );

    res.json(result.rows[0]);
  } catch (err: any) {
    console.error('PATCH /admin/users/:id error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/admin/users/:id/reset-password — Réinitialiser le mot de passe
// ─────────────────────────────────────────────────────────────────────────────
router.post('/users/:id/reset-password', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || typeof newPassword !== 'string' || newPassword.trim().length < 6) {
      res.status(400).json({ error: 'PASSWORD_TOO_SHORT', message: 'Le mot de passe doit comporter au moins 6 caractères.' });
      return;
    }

    const userCheck = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [id]);
    if (userCheck.rows.length === 0) {
      res.status(404).json({ error: 'USER_NOT_FOUND', message: 'Utilisateur introuvable.' });
      return;
    }

    const passwordHash = await bcrypt.hash(newPassword.trim(), 12);
    await pool.query(
      `UPDATE users 
       SET password_hash = $1, 
           updated_at = datetime('now') 
       WHERE id = $2`,
      [passwordHash, id]
    );

    res.json({ 
      success: true, 
      message: `Mot de passe de ${userCheck.rows[0].name} mis à jour avec succès.` 
    });
  } catch (err: any) {
    console.error('POST /admin/users/:id/reset-password error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
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
// GET /api/admin/jobs — Liste de toutes les offres d'emploi (admin uniquement)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/jobs', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;

    let query = `
      SELECT j.*, u.name as recruiter_name, u.email as recruiter_email, u.company_name as recruiter_company
      FROM job_posts j
      LEFT JOIN users u ON j.recruiter_id = u.id
      WHERE 1=1
    `;
    const params: string[] = [];
    let count = 0;

    if (status && status !== 'Tous') {
      params.push(status as string);
      query += ` AND j.status = $${++count}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (j.title LIKE $${++count} OR j.company LIKE $${count} OR u.name LIKE $${count} OR u.email LIKE $${count})`;
    }

    query += ' ORDER BY j.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('GET /admin/jobs error:', err);
    res.status(500).json({ error: 'SERVER_ERROR' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/admin/jobs/:id/status — Modifier le statut d'une offre (admin)
// ─────────────────────────────────────────────────────────────────────────────
router.patch('/jobs/:id/status', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['Actif', 'Pause', 'Clôturé'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: 'INVALID_STATUS', message: 'Statut invalide' });
      return;
    }

    const result = await pool.query(
      'UPDATE job_posts SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ error: 'JOB_NOT_FOUND', message: 'Offre introuvable' });
      return;
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('PATCH /admin/jobs/:id/status error:', err);
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
