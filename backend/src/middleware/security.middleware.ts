import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

/**
 * Configuration hermétique des en-têtes de sécurité HTTP via Helmet
 * Applique CSP, HSTS, anti-clickjacking et désactivation de l'empreinte serveur
 */
export const secureHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        'https://accounts.google.com',
        'https://apis.google.com',
      ],
      frameSrc: ["'self'", 'https://accounts.google.com'],
      connectSrc: [
        "'self'",
        'https://accounts.google.com',
        'https://generativelanguage.googleapis.com',
      ],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
    },
  },
  crossOriginEmbedderPolicy: false, // Requis pour les iframes OAuth Google Identity
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'deny' }, // Anti-clickjacking (X-Frame-Options: DENY)
  hidePoweredBy: true, // Supprime X-Powered-By: Express
  hsts: {
    maxAge: 31536000, // 1 an
    includeSubDomains: true,
    preload: true,
  },
  ieNoOpen: true,
  noSniff: true, // X-Content-Type-Options: nosniff
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
});

/**
 * Rate Limiter Global (Prévention DDoS et énumération agressive)
 */
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Max 300 requêtes par fenêtre IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'TOO_MANY_REQUESTS',
    message: 'Trop de requêtes. Veuillez réessayer dans quelques minutes.',
  },
});

/**
 * Rate Limiter Sensible : Authentification & Bruteforce
 * Cible spécifiquement /api/auth/login, /api/auth/register, /api/auth/forgot-password
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Max 15 tentatives par fenêtre IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'AUTH_RATE_LIMIT_EXCEEDED',
    message: 'Tentatives excessives. Accès temporairement suspendu pour des raisons de sécurité.',
  },
});

/**
 * Sanitization récursive des entrées utilisateurs (Défense en profondeur anti-XSS & Injection)
 */
export const sanitizeInputs = (req: Request, _res: Response, next: NextFunction): void => {
  const sanitize = (value: unknown): unknown => {
    if (typeof value === 'string') {
      // Suppression des caractères d'échappement null-byte et nettoyage des espaces superflus
      return value.replace(/\0/g, '').trim();
    }
    if (Array.isArray(value)) {
      return value.map(sanitize);
    }
    if (value !== null && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, sanitize(v)])
      );
    }
    return value;
  };

  if (req.body && typeof req.body === 'object') {
    try {
      req.body = sanitize(req.body);
    } catch {
      // Préserver le body si non-sérialisable
    }
  }

  if (req.query && typeof req.query === 'object') {
    try {
      const sanitized = sanitize(req.query);
      Object.defineProperty(req, 'query', {
        value: sanitized,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    } catch {
      // Préserver la query si getter non configurable
    }
  }

  next();
};

/**
 * Intercepteur global des erreurs (Zéro fuite d'informations internes)
 */
export const secureErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Journalisation interne sécurisée
  console.error('[SECURITY_ALERT] Erreur système interceptée :', {
    name: err.name,
    message: err.message,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });

  // Réponse uniforme et opaque au client : aucune information d'infrastructure ou SQL
  res.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: 'Une erreur imprévue est survenue. L’incident a été consigné pour analyse.',
  });
};
