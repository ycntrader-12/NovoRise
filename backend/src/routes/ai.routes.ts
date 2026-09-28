import { Router, Request, Response } from 'express';
import { generateWithGemini } from '../services/gemini.service';
import { verifyJwt } from '../services/auth.service';

const router = Router();

const optionalAuth = (req: Request, _res: Response, next: () => void) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      (req as any).user = verifyJwt(token);
    } catch (_) {}
  }
  next();
};

/**
 * POST /api/ai/generate-job-description
 * Génère ou enrichit une description de poste avec Gemini
 */
router.post('/generate-job-description', optionalAuth, async (req: Request, res: Response) => {
  const { title, company, category, contract, keywords } = req.body;

  if (!title) {
    res.status(400).json({ error: 'TITLE_REQUIRED', message: 'Le titre du poste est requis.' });
    return;
  }

  const prompt = `Tu es un expert RH et recruteur d'élite pour la plateforme NovoRise.
Rédige une fiche descriptive de poste attractive, claire et professionnelle en français pour le poste suivant :
- Intitulé du poste : ${title}
- Entreprise : ${company || 'Entreprise innovante'}
- Secteur : ${category || 'Tech'}
- Type de contrat : ${contract || 'CDI'}
- Mots-clés / Compétences souhaitées : ${keywords || 'Standards du marché'}

Structure la réponse avec :
1. Présentation du poste et de la mission
2. Responsabilités clés (3 à 5 points)
3. Profil recherché et compétences requises
4. Avantages offerts

Adopte un ton moderne, motivant et direct, sans fioritures inutiles.`;

  const result = await generateWithGemini(prompt);

  if (!result.success) {
    res.status(500).json({ error: 'AI_GENERATION_FAILED', message: result.error });
    return;
  }

  res.json({ description: result.content });
});

/**
 * POST /api/ai/generate-cover-letter
 * Aide le candidat à générer ou améliorer sa lettre de motivation
 */
router.post('/generate-cover-letter', optionalAuth, async (req: Request, res: Response) => {
  const { jobTitle, company, candidateSkills, candidateBio } = req.body;

  const prompt = `Tu es un conseiller carrière pour talents ambitieux sur la plateforme NovoRise.
Rédige une courte lettre de motivation personnalisée, percutante et professionnelle (max 200 mots) en français pour une candidature :
- Poste visé : ${jobTitle || 'Poste ouvert'}
- Entreprise : ${company || 'Entreprise cible'}
- Profil du candidat : ${candidateBio || 'Professionnel motivé'}
- Compétences clés : ${candidateSkills || 'Polyvalence et rigueur'}

Mets en avant la valeur ajoutée pour l'entreprise avec un ton dynamique et confiant.`;

  const result = await generateWithGemini(prompt);

  if (!result.success) {
    res.status(500).json({ error: 'AI_GENERATION_FAILED', message: result.error });
    return;
  }

  res.json({ coverLetter: result.content });
});

export default router;
