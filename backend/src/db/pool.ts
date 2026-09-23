import Database from 'better-sqlite3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const dbDir = typeof __dirname !== 'undefined' ? __dirname : process.cwd();

// ─── Base de données SQLite locale ───────────────────────────────────────────
const DB_PATH = path.join(dbDir, '..', '..', 'novorise.db');

export const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

console.log(`✅ SQLite connecté : ${DB_PATH}`);

// ─── Initialisation du schéma ────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id                    TEXT    PRIMARY KEY,
    name                  TEXT    NOT NULL,
    email                 TEXT    UNIQUE NOT NULL,
    password_hash         TEXT,
    role                  TEXT    NOT NULL DEFAULT 'candidat',
    verified              INTEGER NOT NULL DEFAULT 0,
    verification_token    TEXT,
    reset_token           TEXT,
    reset_token_expires   TEXT,
    google_id             TEXT    UNIQUE,
    avatar_url            TEXT,
    title                 TEXT,
    phone                 TEXT,
    location              TEXT,
    bio                   TEXT,
    skills                TEXT    DEFAULT '[]',
    cv_filename           TEXT,
    cover_letter_filename TEXT,
    company_name          TEXT,
    company_website       TEXT,
    created_at            TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at            TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS job_posts (
    id                 TEXT    PRIMARY KEY,
    recruiter_id       TEXT    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title              TEXT    NOT NULL,
    company            TEXT    NOT NULL,
    category           TEXT    NOT NULL,
    contract           TEXT    NOT NULL,
    workplace          TEXT    NOT NULL,
    location           TEXT,
    salary             TEXT,
    description        TEXT,
    tags               TEXT    DEFAULT '[]',
    status             TEXT    NOT NULL DEFAULT 'Actif',
    views_count        INTEGER NOT NULL DEFAULT 0,
    applications_count INTEGER NOT NULL DEFAULT 0,
    created_at         TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at         TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS applications (
    id                    TEXT PRIMARY KEY,
    job_id                TEXT NOT NULL REFERENCES job_posts(id) ON DELETE CASCADE,
    candidate_id          TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cover_note            TEXT,
    cv_filename           TEXT,
    cover_letter_filename TEXT,
    status                TEXT NOT NULL DEFAULT 'En attente',
    applied_at            TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at            TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE (job_id, candidate_id)
  );

  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_users_vtok ON users(verification_token);
  CREATE INDEX IF NOT EXISTS idx_users_rtok ON users(reset_token);
  CREATE INDEX IF NOT EXISTS idx_jobs_recruiter ON job_posts(recruiter_id);
  CREATE INDEX IF NOT EXISTS idx_apps_job ON applications(job_id);
  CREATE INDEX IF NOT EXISTS idx_apps_candidate ON applications(candidate_id);
`);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function normalizeRow(row: any): any {
  if (!row) return row;
  if ('verified' in row) row.verified = row.verified === 1;
  if ('skills' in row && typeof row.skills === 'string') {
    try { row.skills = JSON.parse(row.skills); } catch { row.skills = []; }
  }
  if ('tags' in row && typeof row.tags === 'string') {
    try { row.tags = JSON.parse(row.tags); } catch { row.tags = []; }
  }
  return row;
}

function convertParams(sql: string): string {
  // Converts $1, $2... PostgreSQL placeholders to ? SQLite placeholders
  return sql.replace(/\$\d+/g, '?');
}

function normalizeParams(params: any[]): any[] {
  return params.map(p => {
    if (Array.isArray(p)) return JSON.stringify(p);
    if (p === true) return 1;
    if (p === false) return 0;
    return p;
  });
}

// ─── Pool Adapter ────────────────────────────────────────────────────────────
// Mimics the pg Pool interface (pool.query(sql, params)) for drop-in replacement
export const pool = {
  query: async (rawSql: string, rawParams: any[] = []): Promise<{ rows: any[]; rowCount: number }> => {
    const sql = convertParams(rawSql);
    const params = normalizeParams(rawParams);
    const upper = sql.trim().toUpperCase();

    try {
      // ── SELECT / WITH ────────────────────────────────────────────────────
      if (upper.startsWith('SELECT') || upper.startsWith('WITH')) {
        const rows = db.prepare(sql).all(...params).map(normalizeRow);
        return { rows, rowCount: rows.length };
      }

      // ── INSERT ... RETURNING ─────────────────────────────────────────────
      if (upper.startsWith('INSERT')) {
        const tableMatch = sql.match(/INSERT\s+(?:OR\s+\w+\s+)?INTO\s+"?(\w+)"?/i);
        const hasReturning = /RETURNING/i.test(sql);

        // Generate UUID for the id if not provided in params
        // Inject the id into the query if needed
        let finalSql = sql;
        let finalParams = params;

        if (hasReturning) {
          const returningIdx = sql.toUpperCase().indexOf('RETURNING');
          const insertSql = sql.substring(0, returningIdx).trim();
          const returningCols = sql.substring(returningIdx + 9).trim();

          db.prepare(insertSql).run(...finalParams);

          if (tableMatch) {
            const tableName = tableMatch[1];
            const lastRow = db.prepare(
              `SELECT ${returningCols === '*' ? '*' : returningCols} FROM ${tableName} WHERE rowid = last_insert_rowid()`
            ).get() as any;
            return { rows: [normalizeRow(lastRow)], rowCount: 1 };
          }
          return { rows: [], rowCount: 0 };
        }

        // INSERT without RETURNING
        const info = db.prepare(finalSql).run(...finalParams);
        return { rows: [], rowCount: info.changes };
      }

      // ── UPDATE ... RETURNING ─────────────────────────────────────────────
      if (upper.startsWith('UPDATE')) {
        const hasReturning = /RETURNING/i.test(sql);
        if (hasReturning) {
          const returningIdx = sql.toUpperCase().indexOf('RETURNING');
          const updateSql = sql.substring(0, returningIdx).trim();
          const returningCols = sql.substring(returningIdx + 9).trim();
          const tableMatch = sql.match(/UPDATE\s+"?(\w+)"?/i);

          // Extract WHERE clause to re-select updated rows
          const whereMatch = updateSql.match(/WHERE\s+([\s\S]+)$/i);

          db.prepare(updateSql).run(...params);

          if (tableMatch && whereMatch) {
            const tableName = tableMatch[1];
            const whereClause = whereMatch[1];
            // Count WHERE placeholders to get correct slice of params
            const updateParamCount = (updateSql.match(/\?/g) || []).length;
            const whereParams = params.slice(updateParamCount - (whereClause.match(/\?/g) || []).length);

            const rows = db.prepare(
              `SELECT ${returningCols === '*' ? '*' : returningCols} FROM ${tableName} WHERE ${whereClause}`
            ).all(...whereParams).map(normalizeRow);
            return { rows, rowCount: rows.length };
          }
          return { rows: [], rowCount: 0 };
        }
        const info = db.prepare(sql).run(...params);
        return { rows: [], rowCount: info.changes };
      }

      // ── DELETE ───────────────────────────────────────────────────────────
      if (upper.startsWith('DELETE')) {
        const hasReturning = /RETURNING/i.test(sql);
        if (hasReturning) {
          const returningIdx = sql.toUpperCase().indexOf('RETURNING');
          const deleteSql = sql.substring(0, returningIdx).trim();
          const returningCols = sql.substring(returningIdx + 9).trim();
          const tableMatch = sql.match(/FROM\s+"?(\w+)"?/i);
          const whereMatch = deleteSql.match(/WHERE\s+([\s\S]+)$/i);

          if (tableMatch && whereMatch) {
            // Fetch rows before deletion
            const tableName = tableMatch[1];
            const selectBeforeDelete = db.prepare(
              `SELECT ${returningCols === '*' ? '*' : returningCols} FROM ${tableName} WHERE ${whereMatch[1]}`
            ).all(...params).map(normalizeRow);

            db.prepare(deleteSql).run(...params);
            return { rows: selectBeforeDelete, rowCount: selectBeforeDelete.length };
          }
        }
        const info = db.prepare(sql).run(...params);
        return { rows: [], rowCount: info.changes };
      }

      // ── Generic fallback ──────────────────────────────────────────────────
      db.exec(sql);
      return { rows: [], rowCount: 0 };

    } catch (err: any) {
      console.error('SQLite pool.query error:', err.message);
      console.error('  SQL:', sql);
      console.error('  Params:', params);
      throw err;
    }
  },

  // pg-compatible event stubs (not needed but prevent crashes)
  on: (_event: string, _cb: Function) => {},
};

export default pool;
