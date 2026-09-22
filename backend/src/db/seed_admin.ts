import bcrypt from 'bcryptjs';
import pool from './pool';

async function seedAdmin() {
  try {
    const password = 'Admin@1212';
    const passwordHash = await bcrypt.hash(password, 12);

    // Upsert admin@novorise.com
    const res1 = await pool.query(
      `INSERT INTO users (name, email, password_hash, role, verified)
       VALUES ('Administrateur Principal', 'admin@novorise.com', $1, 'admin', TRUE)
       ON CONFLICT (email) DO UPDATE 
       SET password_hash = $1, role = 'admin', verified = TRUE
       RETURNING id, name, email, role, verified`,
      [passwordHash]
    );

    // Upsert admin@admin.com
    const res2 = await pool.query(
      `INSERT INTO users (name, email, password_hash, role, verified)
       VALUES ('Administrateur', 'admin@admin.com', $1, 'admin', TRUE)
       ON CONFLICT (email) DO UPDATE 
       SET password_hash = $1, role = 'admin', verified = TRUE
       RETURNING id, name, email, role, verified`,
      [passwordHash]
    );

    console.log('✅ Comptes Administrateur créés / mis à jour avec succès :');
    console.log('   Compte 1 : admin@novorise.com (ou simple "admin")');
    console.log('   Compte 2 : admin@admin.com');
    console.log('   Mot de passe : Admin@1212');
    console.log('   Rôle : admin');
    console.log('   Data 1 :', res1.rows[0]);
    console.log('   Data 2 :', res2.rows[0]);
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur lors du seeding de l\'administrateur :', err);
    process.exit(1);
  }
}

seedAdmin();
