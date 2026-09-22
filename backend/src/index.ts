import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from './config/passport';

// Routes
import authRoutes from './routes/auth.routes';
import jobsRoutes from './routes/jobs.routes';
import applicationsRoutes from './routes/applications.routes';
import adminRoutes from './routes/admin.routes';

// Worker email (démarre Bull consumer dès le lancement)
import './workers/email.worker';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ─── Middlewares globaux ──────────────────────────────────────────────────────
app.use(cors({
  origin: [
    FRONTEND_URL, 
    'http://localhost:3005', 
    'http://localhost:3006', 
    'http://localhost:3007',
    'http://localhost:5173', 
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// ─── Routes API ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/admin', adminRoutes);

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

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
});

// ─── Démarrage ────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║   🚀 NovoRise API                        ║
  ║   Port    : http://localhost:${PORT}          ║
  ║   Health  : /api/health                  ║
  ║   Auth    : /api/auth/*                  ║
  ║   Jobs    : /api/jobs/*                  ║
  ║   Apps    : /api/applications/*          ║
  ╚══════════════════════════════════════════╝
  `);
});

export default app;
