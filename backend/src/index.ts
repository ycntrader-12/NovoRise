import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from './config/passport';
import {
  secureHeaders,
  globalRateLimiter,
  sanitizeInputs,
  secureErrorHandler,
} from './middleware/security.middleware';

// Routes
import authRoutes from './routes/auth.routes';
import jobsRoutes from './routes/jobs.routes';
import applicationsRoutes from './routes/applications.routes';
import adminRoutes from './routes/admin.routes';
import aiRoutes from './routes/ai.routes';
import contactRoutes from './routes/contact.routes';

// Worker email (démarre Bull consumer dès le lancement)
import './workers/email.worker';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3006', 10);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3005';
const ADMIN_URL = process.env.ADMIN_URL || 'http://localhost:3007';

// ─── 1. En-têtes HTTP de sécurité stricts (Helmet) ───────────────────────────
app.use(secureHeaders);

// ─── 2. Rate Limiting Global (Protection DoS / Énumération) ───────────────────
app.use(globalRateLimiter);

// ─── 3. Politique CORS Hermétique ─────────────────────────────────────────────
const allowedOrigins = [
  FRONTEND_URL,
  ADMIN_URL,
  'http://localhost:3005',
  'http://localhost:3006',
  'http://localhost:3007',
  'http://localhost:5173',
  'http://localhost:3000',
  'null',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Permettre les requêtes locales / sans origine (curl, file:///, tests internes)
    if (!origin || origin === 'null' || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS_RESTRICTION_TRIGGERED'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// ─── 4. Limitation de taille des payloads (Prévention dépassement DoS) ────────
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// ─── 5. Assainissement récursif des entrées utilisateurs (Anti-XSS & Null-Byte)
app.use(sanitizeInputs);

// ─── 6. Authentification Passport ─────────────────────────────────────────────
app.use(passport.initialize());

// ─── 7. Routes API ────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/contact', contactRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'NovoRise API v1.0',
  });
});

// ─── 404 handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'ROUTE_NOT_FOUND' });
});

// ─── 8. Gestionnaire d'erreurs sécurisé (Zéro fuite d'informations) ───────────
app.use(secureErrorHandler);

// ─── Démarrage ────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║   🚀 NovoRise API [Secured]              ║
  ║   Port    : http://localhost:${PORT}          ║
  ║   Health  : /api/health                  ║
  ║   Auth    : /api/auth/*                  ║
  ║   Jobs    : /api/jobs/*                  ║
  ║   Apps    : /api/applications/*          ║
  ╚══════════════════════════════════════════╝
  `);
});

export default app;
