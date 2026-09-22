import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import passport from 'passport';
import {
  registerUser,
  verifyEmailToken,
  loginUser,
  requestPasswordReset,
  completePasswordReset,
  getUserById,
  signJwt,
  updateUserProfile,
} from '../services/auth.service';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// ─── Validation helpers ───────────────────────────────────────────────────────
const handleValidationErrors = (req: Request, res: Response): boolean => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('Validation error on route', req.originalUrl, ':', errors.array());
    res.status(400).json({ error: 'VALIDATION_ERROR', details: errors.array() });
    return true;
  }
  return false;
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/register
// ─────────────────────────────────────────────────────────────────────────────
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Le nom est requis'),
    body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Mot de passe : minimum 8 caractères'),
    body('role')
      .isIn(['candidat', 'recruteur'])
      .withMessage('Rôle invalide'),
  ],
  async (req: Request, res: Response) => {
    if (handleValidationErrors(req, res)) return;

    try {
      const { name, email, password, role } = req.body;
      const user = await registerUser(name, email, password, role);

      res.status(201).json({
        message: 'Inscription réussie. Vérifiez votre email pour activer votre compte.',
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      });
    } catch (err: any) {
      if (err.message === 'EMAIL_ALREADY_EXISTS') {
        res.status(409).json({ error: 'EMAIL_ALREADY_EXISTS', message: 'Cet email est déjà utilisé.' });
      } else {
        console.error('Register error:', err);
        res.status(500).json({ error: 'SERVER_ERROR' });
      }
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/auth/verify?token=...
// ─────────────────────────────────────────────────────────────────────────────
router.get('/verify', async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    res.status(400).json({ error: 'MISSING_TOKEN' });
    return;
  }

  try {
    const { user, token: jwtToken } = await verifyEmailToken(token);
    res.json({
      message: 'Email vérifié avec succès.',
      token: jwtToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: true,
      },
    });
  } catch (err: any) {
    if (err.message === 'INVALID_OR_EXPIRED_TOKEN') {
      res.status(400).json({ error: 'INVALID_OR_EXPIRED_TOKEN', message: 'Lien de vérification invalide ou expiré.' });
    } else {
      console.error('Verify email error:', err);
      res.status(500).json({ error: 'SERVER_ERROR' });
    }
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────────────────────────────────────────
router.post(
  '/login',
  [
    body('email').trim().notEmpty().withMessage('Identifiant ou email requis'),
    body('password').notEmpty().withMessage('Mot de passe requis'),
  ],
  async (req: Request, res: Response) => {
    if (handleValidationErrors(req, res)) return;

    try {
      const { email, password } = req.body;
      const { user, token } = await loginUser(email, password);

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.verified,
          avatar: user.avatar_url,
          profile: {
            title: user.title,
            phone: user.phone,
            location: user.location,
            bio: user.bio,
            skills: user.skills,
            cvFileName: user.cv_filename,
            coverLetterFileName: user.cover_letter_filename,
            companyName: user.company_name,
            companyWebsite: user.company_website,
          },
        },
      });
    } catch (err: any) {
      const errorMap: Record<string, [number, string]> = {
        INVALID_CREDENTIALS: [401, 'Email ou mot de passe incorrect.'],
        EMAIL_NOT_VERIFIED: [403, 'Veuillez vérifier votre email avant de vous connecter.'],
        USE_GOOGLE_LOGIN: [400, 'Ce compte utilise la connexion Google.'],
      };
      const [status, message] = errorMap[err.message] || [500, 'Erreur serveur'];
      res.status(status).json({ error: err.message || 'SERVER_ERROR', message });
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/forgot-password
// ─────────────────────────────────────────────────────────────────────────────
router.post(
  '/forgot-password',
  [body('email').isEmail().normalizeEmail()],
  async (req: Request, res: Response) => {
    if (handleValidationErrors(req, res)) return;

    try {
      await requestPasswordReset(req.body.email);
      // Toujours répondre 200 (ne pas révéler si l'email existe)
      res.json({ message: 'Si cet email existe, vous recevrez un lien de réinitialisation.' });
    } catch (err) {
      console.error('Forgot password error:', err);
      res.status(500).json({ error: 'SERVER_ERROR' });
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/reset-password
// ─────────────────────────────────────────────────────────────────────────────
router.post(
  '/reset-password',
  [
    body('token').notEmpty(),
    body('newPassword').isLength({ min: 8 }),
  ],
  async (req: Request, res: Response) => {
    if (handleValidationErrors(req, res)) return;

    try {
      const { token, newPassword } = req.body;
      await completePasswordReset(token, newPassword);
      res.json({ message: 'Mot de passe réinitialisé avec succès.' });
    } catch (err: any) {
      if (err.message === 'RESET_TOKEN_INVALID_OR_EXPIRED') {
        res.status(400).json({ error: 'RESET_TOKEN_INVALID_OR_EXPIRED', message: 'Lien expiré ou invalide.' });
      } else {
        res.status(500).json({ error: 'SERVER_ERROR' });
      }
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/auth/me  (route protégée JWT)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = await getUserById(req.user!.sub);
    if (!user) {
      res.status(404).json({ error: 'USER_NOT_FOUND' });
      return;
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.verified,
      avatar: user.avatar_url,
      profile: {
        title: user.title,
        phone: user.phone,
        location: user.location,
        bio: user.bio,
        skills: user.skills,
        cvFileName: user.cv_filename,
        coverLetterFileName: user.cover_letter_filename,
        companyName: user.company_name,
        companyWebsite: user.company_website,
      },
    });
  } catch (err) {
    console.error('/me error:', err);
    res.status(500).json({ error: 'SERVER_ERROR' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/auth/profile  (route protégée JWT)
// ─────────────────────────────────────────────────────────────────────────────
router.patch('/profile', requireAuth, async (req: Request, res: Response) => {
  try {
    const updated = await updateUserProfile(req.user!.sub, req.body);
    res.json(updated);
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'SERVER_ERROR' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Google OAuth 2.0 — Initiation
// GET /api/auth/google?role=candidat|recruteur
// ─────────────────────────────────────────────────────────────────────────────
router.get('/google', (req: Request, res: Response, next) => {
  const role = (req.query.role as string) || 'candidat';
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: role,  // Passer le rôle via state OAuth
  })(req, res, next);
});

// ─────────────────────────────────────────────────────────────────────────────
// Google OAuth 2.0 — Callback
// GET /api/auth/google/callback
// ─────────────────────────────────────────────────────────────────────────────
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_failed` }),
  (req: Request, res: Response) => {
    const user = req.user as any;
    const token = signJwt({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    // Redirect vers le frontend avec le token dans l'URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/auth/google/success?token=${token}&role=${user.role}`);
  }
);

export default router;
