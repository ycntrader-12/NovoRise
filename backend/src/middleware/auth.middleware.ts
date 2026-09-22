import { Request, Response, NextFunction } from 'express';
import { verifyJwt, JwtPayload } from '../services/auth.service';

// Extension de l'interface Request pour y ajouter l'utilisateur authentifié
declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}

// ─── Middleware : vérification du JWT Bearer ─────────────────────────────────
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'TOKEN_MISSING', message: 'Authorization header requis' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyJwt(token);
    (req as any).user = payload;
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      res.status(401).json({ error: 'TOKEN_EXPIRED', message: 'Session expirée, veuillez vous reconnecter' });
    } else {
      res.status(401).json({ error: 'TOKEN_INVALID', message: 'Token invalide' });
    }
  }
};

// ─── Middleware : restriction par rôle ───────────────────────────────────────
export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user as JwtPayload | undefined;
    if (!user) {
      res.status(401).json({ error: 'NOT_AUTHENTICATED' });
      return;
    }
    if (!roles.includes(user.role)) {
      res.status(403).json({
        error: 'FORBIDDEN',
        message: `Accès réservé aux rôles : ${roles.join(', ')}`,
      });
      return;
    }
    next();
  };
};

