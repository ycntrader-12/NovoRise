import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import pool from '../db/pool';
import emailQueue from './email.queue';

const BCRYPT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET || 'CHANGE_ME_IN_PRODUCTION';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: 'candidat' | 'recruteur' | 'admin' | 'admin_manager';
  iat?: number;
  exp?: number;
}

// ─── Utilitaire JWT ───────────────────────────────────────────────────────────
export const signJwt = (payload: Omit<JwtPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
};

export const verifyJwt = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

// ─── Register ─────────────────────────────────────────────────────────────────
export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: 'candidat' | 'recruteur'
) => {
  const cleanEmail = email.toLowerCase();

  // Vérification email existant
  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [cleanEmail]);
  if (existing.rows.length > 0) {
    throw new Error('EMAIL_ALREADY_EXISTS');
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const verificationToken = uuidv4();
  const userId = uuidv4();

  // INSERT avec UUID généré côté applicatif
  const result = await pool.query(
    `INSERT INTO users (id, name, email, password_hash, role, verified, verification_token)
     VALUES ($1, $2, $3, $4, $5, 0, $6)
     RETURNING id, name, email, role, verified, verification_token`,
    [userId, name, cleanEmail, passwordHash, role, verificationToken]
  );

  const newUser = result.rows[0];

  // Envoyer email de vérification
  try {
    await emailQueue.add({
      type: 'email-verification',
      to: email,
      name,
      token: verificationToken,
    });
  } catch (queueErr) {
    console.warn('⚠️ Email queue non disponible:', (queueErr as Error).message);
  }

  return newUser;
};

// ─── Verify Email Token ───────────────────────────────────────────────────────
export const verifyEmailToken = async (token: string, email?: string) => {
  let found: { rows: any[]; rowCount: number };

  // Dev-only bypass: mock tokens only work when NODE_ENV is explicitly not 'production'
  if (process.env.NODE_ENV !== 'production' && (token === 'mock_24h_token_valid' || token.startsWith('mock_'))) {
    if (email) {
      found = await pool.query(
        'SELECT id, name, email, role FROM users WHERE email = $1',
        [email.toLowerCase().trim()]
      );
    } else {
      found = await pool.query(
        'SELECT id, name, email, role FROM users WHERE verified = 0 ORDER BY rowid DESC LIMIT 1'
      );
    }

    // Si aucun non vérifié, prendre le dernier inscrit
    if (!found || found.rows.length === 0) {
      found = await pool.query(
        'SELECT id, name, email, role FROM users ORDER BY rowid DESC LIMIT 1'
      );
    }
  } else {
    found = await pool.query(
      'SELECT id, name, email, role FROM users WHERE verification_token = $1',
      [token]
    );
  }

  if (!found || found.rows.length === 0) {
    throw new Error('INVALID_OR_EXPIRED_TOKEN');
  }

  const user = found.rows[0];

  // Marquer comme vérifié
  await pool.query(
    'UPDATE users SET verified = 1, verification_token = NULL WHERE id = $1',
    [user.id]
  );

  user.verified = true;

  const jwtToken = signJwt({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  return { user, token: jwtToken };
};

// ─── Google Direct / Fast Login (Upsert) ─────────────────────────────────────
export const loginOrRegisterGoogleUser = async (
  email: string,
  name: string,
  role: 'candidat' | 'recruteur',
  avatarUrl?: string,
  googleId?: string
) => {
  const cleanEmail = email.toLowerCase().trim();
  const cleanRole = role === 'recruteur' ? 'recruteur' : 'candidat';
  const cleanName = name?.trim() || (cleanRole === 'recruteur' ? 'Recruteur Google' : 'Candidat Google');
  const avatar = avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=2D6BE4&color=fff`;

  let user: any;
  const existing = await pool.query('SELECT * FROM users WHERE email = $1', [cleanEmail]);
  if (existing.rows.length > 0) {
    user = existing.rows[0];
    await pool.query(
      'UPDATE users SET verified = 1, avatar_url = COALESCE(avatar_url, $1), google_id = COALESCE($2, google_id) WHERE id = $3',
      [avatar, googleId || null, user.id]
    );
    user.verified = true;
    if (!user.avatar_url) user.avatar_url = avatar;
    if (googleId && !user.google_id) user.google_id = googleId;
  } else {
    const newId = uuidv4();
    await pool.query(
      `INSERT INTO users (id, name, email, role, verified, avatar_url, google_id)
       VALUES ($1, $2, $3, $4, 1, $5, $6)`,
      [newId, cleanName, cleanEmail, cleanRole, avatar, googleId || `google_${Date.now()}`]
    );
    user = {
      id: newId,
      name: cleanName,
      email: cleanEmail,
      role: cleanRole,
      verified: true,
      avatar_url: avatar,
    };
  }

  const jwtToken = signJwt({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  const { password_hash: _, ...safeUser } = user;
  return { user: safeUser, token: jwtToken };
};

// ─── Login ────────────────────────────────────────────────────────────────────
export const loginUser = async (email: string, password: string) => {
  let cleanEmail = email.toLowerCase().trim();
  if (!cleanEmail.includes('@')) {
    cleanEmail = `${cleanEmail}@novorise.com`;
  }

  // ─── Compte Administrateur Dédié (user: admin / password: Admin@1212) ────────
  if (
    (cleanEmail === 'admin@novorise.com' || cleanEmail === 'admin@admin.com') &&
    password === 'Admin@1212'
  ) {
    const adminId = '00000000-0000-0000-0000-000000000001';
    const adminUser = {
      id: adminId,
      name: 'Administrateur Principal',
      email: cleanEmail,
      role: 'admin' as const,
      verified: true,
    };

    // Assurer silencieusement son existence dans SQLite
    try {
      const existingAdmin = await pool.query('SELECT id FROM users WHERE id = $1', [adminId]);
      if (existingAdmin.rows.length === 0) {
        const passwordHash = await bcrypt.hash('Admin@1212', 10);
        await pool.query(
          `INSERT INTO users (id, name, email, password_hash, role, verified)
           VALUES ($1, $2, $3, $4, 'admin', 1)`,
          [adminId, adminUser.name, adminUser.email, passwordHash]
        );
      }
    } catch (_) {}

    const jwtToken = signJwt({
      sub: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      role: 'admin',
    });

    return { user: adminUser, token: jwtToken };
  }

  const result = await pool.query(
    `SELECT id, name, email, password_hash, role, verified, avatar_url,
            title, phone, location, bio, skills, cv_filename, cover_letter_filename,
            company_name, company_website
     FROM users WHERE email = $1`,
    [cleanEmail]
  );

  if (result.rows.length === 0) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const user = result.rows[0];

  if (!user.password_hash) {
    throw new Error('USE_GOOGLE_LOGIN');
  }

  if (!user.verified) {
    throw new Error('EMAIL_NOT_VERIFIED');
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const jwtToken = signJwt({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  const { password_hash: _, ...safeUser } = user;
  return { user: safeUser, token: jwtToken };
};

// ─── Get User by ID ───────────────────────────────────────────────────────────
export const getUserById = async (id: string) => {
  const result = await pool.query(
    `SELECT id, name, email, role, verified, avatar_url,
            title, phone, location, bio, skills, cv_filename, cover_letter_filename,
            company_name, company_website, created_at
     FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

// ─── Request Password Reset ───────────────────────────────────────────────────
export const requestPasswordReset = async (email: string) => {
  const result = await pool.query(
    'SELECT id, name, email FROM users WHERE email = $1 AND verified = 1',
    [email.toLowerCase()]
  );

  if (result.rows.length === 0) {
    return; // Sécurité : ne pas révéler si l'email existe
  }

  const user = result.rows[0];
  const resetToken = uuidv4();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  await pool.query(
    'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3',
    [resetToken, expiresAt, user.id]
  );

  await emailQueue.add({
    type: 'password-reset',
    to: email,
    name: user.name,
    token: resetToken,
  });
};

// ─── Complete Password Reset ──────────────────────────────────────────────────
export const completePasswordReset = async (token: string, newPassword: string) => {
  const result = await pool.query(
    `SELECT id FROM users
     WHERE reset_token = $1 AND reset_token_expires > $2`,
    [token, new Date().toISOString()]
  );

  if (result.rows.length === 0) {
    throw new Error('RESET_TOKEN_INVALID_OR_EXPIRED');
  }

  const newHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

  await pool.query(
    'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2',
    [newHash, result.rows[0].id]
  );
};

// ─── Update User Profile ──────────────────────────────────────────────────────
export const updateUserProfile = async (
  userId: string,
  profile: {
    name?: string;
    title?: string;
    phone?: string;
    location?: string;
    bio?: string;
    skills?: string[];
    cvFileName?: string;
    coverLetterFileName?: string;
    companyName?: string;
    companyWebsite?: string;
  }
) => {
  await pool.query(
    `UPDATE users SET
      name = COALESCE($1, name),
      title = COALESCE($2, title),
      phone = COALESCE($3, phone),
      location = COALESCE($4, location),
      bio = COALESCE($5, bio),
      skills = COALESCE($6, skills),
      cv_filename = COALESCE($7, cv_filename),
      cover_letter_filename = COALESCE($8, cover_letter_filename),
      company_name = COALESCE($9, company_name),
      company_website = COALESCE($10, company_website),
      updated_at = datetime('now')
    WHERE id = $11`,
    [
      profile.name,
      profile.title,
      profile.phone,
      profile.location,
      profile.bio,
      profile.skills,
      profile.cvFileName,
      profile.coverLetterFileName,
      profile.companyName,
      profile.companyWebsite,
      userId,
    ]
  );

  // Récupérer et retourner le profil mis à jour
  const updated = await pool.query(
    `SELECT id, name, email, role, verified, avatar_url,
            title, phone, location, bio, skills, cv_filename, cover_letter_filename,
            company_name, company_website
     FROM users WHERE id = $1`,
    [userId]
  );
  return updated.rows[0];
};
