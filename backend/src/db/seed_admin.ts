import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { db } from './pool.js';

async function seedAdmin() {
  try {
    const password = 'Admin@1212';
    const passwordHash = await bcrypt.hash(password, 12);

    const admins = [
      { id: '00000000-0000-0000-0000-000000000001', name: 'Administrateur Principal', email: 'admin@novorise.com' },
      { id: '00000000-0000-0000-0000-000000000002', name: 'Administrateur', email: 'admin@admin.com' },
    ];

    for (const admin of admins) {
      const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(admin.email);
      if (existing) {
        db.prepare('UPDATE users SET password_hash = ?, role = \'admin\', verified = 1 WHERE email = ?')
          .run(passwordHash, admin.email);
        console.log(`✅ Mis à jour : ${admin.email}`);
      } else {
        db.prepare(
          `INSERT INTO users (id, name, email, password_hash, role, verified)
           VALUES (?, ?, ?, ?, 'admin', 1)`
        ).run(admin.id, admin.name, admin.email, passwordHash);
        console.log(`✅ Créé : ${admin.email}`);
      }
    }

    console.log('\n🔑 Identifiants admin :');
    console.log('   Email 1 : admin@novorise.com (ou juste "admin")');
    console.log('   Email 2 : admin@admin.com');
    console.log('   Mot de passe : Admin@1212');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur lors du seeding :', err);
    process.exit(1);
  }
}

seedAdmin();
