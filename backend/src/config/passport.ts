import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import pool from '../db/pool';
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

        // Upsert : crée ou met à jour l'utilisateur Google
        const result = await pool.query(
          `INSERT INTO users (name, email, google_id, role, verified, avatar_url)
           VALUES ($1, $2, $3, $4, TRUE, $5)
           ON CONFLICT (email) DO UPDATE SET
             google_id = COALESCE(users.google_id, EXCLUDED.google_id),
             avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
             verified = TRUE
           RETURNING id, name, email, role, verified, avatar_url`,
          [name, email, googleId, role, avatarUrl]
        );

        return done(null, result.rows[0]);
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
