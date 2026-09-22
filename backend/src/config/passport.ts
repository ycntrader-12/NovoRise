import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import pool from '../db/pool';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/api/auth/google/callback',
      passReqToCallback: true,
    },
    async (req: any, _accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase();
        const name = profile.displayName;
        const googleId = profile.id;
        const avatarUrl = profile.photos?.[0]?.value;
        
        // Rôle passé via le state OAuth (candidat par défaut)
        const role = (req.query.state as string) || 'candidat';

        if (!email) {
          return done(new Error('NO_EMAIL_FROM_GOOGLE'), undefined);
        }

        // Upsert : crée ou met à jour l'utilisateur Google (SQLite-compatible)
        let user;
        try {
          // Chercher l'utilisateur existant par email
          const existing = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
          );

          if (existing.rows.length > 0) {
            // Mettre à jour le google_id et avatar_url si nécessaire
            await pool.query(
              `UPDATE users SET google_id = COALESCE(google_id, $1), avatar_url = COALESCE($2, avatar_url), verified = 1 WHERE email = $3`,
              [googleId, avatarUrl, email]
            );
            const updated = await pool.query('SELECT id, name, email, role, verified, avatar_url FROM users WHERE email = $1', [email]);
            user = updated.rows[0];
          } else {
            // Créer un nouvel utilisateur Google
            const newId = uuidv4();
            await pool.query(
              `INSERT INTO users (id, name, email, google_id, role, verified, avatar_url)
               VALUES ($1, $2, $3, $4, $5, 1, $6)`,
              [newId, name, email, googleId, role, avatarUrl]
            );
            user = { id: newId, name, email, role, verified: true, avatar_url: avatarUrl };
          }
        } catch (dbErr) {
          console.warn('⚠️ Mode hors-ligne Google OAuth.');
          user = {
            id: require('crypto').randomUUID(),
            name,
            email,
            role,
            verified: true,
            avatar_url: avatarUrl
          };
        }

        return done(null, user);
      } catch (err) {
        return done(err as Error, undefined);
      }
    }
  )
);

// Pas de sessions (on utilise JWT stateless)
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user as Express.User));

export default passport;
