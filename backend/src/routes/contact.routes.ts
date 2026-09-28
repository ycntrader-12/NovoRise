import { Router, Request, Response } from 'express';
import pool from '../db/pool';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// POST /api/contact — Soumettre un message de contact (public, sans auth)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { nom, prenom, email, telephone, sujet, message } = req.body;

    if (!nom || !prenom || !email || !telephone || !sujet || !message) {
      res.status(400).json({ error: 'FIELDS_REQUIRED', details: 'Tous les champs sont obligatoires.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'INVALID_EMAIL' });
      return;
    }

    const id = uuidv4();
    await pool.query(
      `INSERT INTO contact_messages (id, nom, prenom, email, telephone, sujet, message) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id, nom.trim(), prenom.trim(), email.trim(), telephone.trim(), sujet.trim(), message.trim()]
    );

    res.status(201).json({ message: 'MESSAGE_SENT', id });
  } catch (err) {
    console.error('POST /contact error:', err);
    res.status(500).json({ error: 'SERVER_ERROR' });
  }
});

export default router;
