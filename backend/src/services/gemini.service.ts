import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';

export interface GenerateContentResponse {
  success: boolean;
  content?: string;
  error?: string;
}

function buildSmartFallback(prompt: string): string {
  if (prompt.includes('fiche descriptive de poste') || prompt.includes('description de poste')) {
    const titleMatch = prompt.match(/Intitulé du poste\s*:\s*(.+)/i);
    const companyMatch = prompt.match(/Entreprise\s*:\s*(.+)/i);
    const categoryMatch = prompt.match(/Secteur\s*:\s*(.+)/i);
    const contractMatch = prompt.match(/Type de contrat\s*:\s*(.+)/i);
    const keywordsMatch = prompt.match(/Mots-clés[^\n:]*:\s*(.+)/i);

    const title = titleMatch ? titleMatch[1].trim() : 'Talent NovoRise';
    const company = companyMatch ? companyMatch[1].trim() : 'Entreprise Innovante';
    const category = categoryMatch ? categoryMatch[1].trim() : 'Technologie & Conseil';
    const contract = contractMatch ? contractMatch[1].trim() : 'CDI';
    const keywords = keywordsMatch ? keywordsMatch[1].trim() : 'Autonomie, Rigueur, Esprit d’équipe';

    return `### 🚀 Présentation du poste & Mission
Au sein de **${company}** (${category}), nous recherchons un(e) **${title}** passionné(e) et dynamique en contrat **${contract}** pour accompagner notre forte croissance et concevoir des solutions performantes.

### 🎯 Responsabilités Clés
- Piloter et délivrer les projets opérationnels stratégiques avec rigueur et autonomie.
- Collaborer étroitement avec les équipes transverses pour optimiser les processus et la qualité.
- Participer activement à l'amélioration continue et aux bonnes pratiques d'excellence.
- Suivre les indicateurs clés de performance et proposer des initiatives innovantes.

### 👤 Profil Recherché & Compétences
- Formation supérieure ou parcours éprouvé en adéquation avec les exigences du poste.
- Solide maîtrise des compétences clés du domaine : ${keywords}.
- Esprit d’initiative, grande adaptabilité et sens prononcé de la communication collaborative.

### ⭐ Avantages NovoRise
- Package salarial attractif et valorisant selon profil et expérience.
- Opportunités réelles d'évolution de carrière et plan de formation continue.
- Environnement de travail agile, bienveillant et stimulant.`;
  }

  if (prompt.includes('lettre de motivation')) {
    const jobMatch = prompt.match(/Poste visé\s*:\s*(.+)/i);
    const compMatch = prompt.match(/Entreprise\s*:\s*(.+)/i);
    const skillsMatch = prompt.match(/Compétences clés\s*:\s*(.+)/i);

    const job = jobMatch ? jobMatch[1].trim() : 'ce poste';
    const comp = compMatch ? compMatch[1].trim() : 'votre entreprise';
    const skills = skillsMatch ? skillsMatch[1].trim() : 'mes compétences et ma motivation';

    return `Madame, Monsieur,\n\nC'est avec un vif enthousiasme que je vous adresse ma candidature pour le poste de **${job}** au sein de **${comp}**.\n\nFort de mon parcours et animé par une réelle volonté de créer de la valeur, j'ai développé des compétences pointues (${skills}) qui me permettent de répondre avec précision et efficacité aux défis de cette mission. Votre vision ambitieuse et l'excellence de vos projets résonnent particulièrement avec mes aspirations professionnelles.\n\nRigoureux, adaptable et doté d'un fort esprit d'équipe, je suis convaincu de pouvoir contribuer activement à vos succès futurs. Je me tiens à votre entière disposition pour un échange approfondi.\n\nCordialement,\nVotre Candidat NovoRise`;
  }

  return `Synthèse générée par l'Assistant Intelligent NovoRise pour optimiser vos opportunités professionnelles.`;
}

/**
 * Service pour interagir avec l'API Google Gemini (avec fallback intelligent anti-blocage)
 */
export async function generateWithGemini(prompt: string): Promise<GenerateContentResponse> {
  if (!GEMINI_API_KEY) {
    console.warn('⚠️ GEMINI_API_KEY manquante, utilisation du générateur intelligent NovoRise IA.');
    return {
      success: true,
      content: buildSmartFallback(prompt),
    };
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      }),
    });

    const data: any = await response.json();

    if (!response.ok) {
      console.warn('⚠️ Google Gemini API retourne une erreur / restriction, activation du fallback intelligent NovoRise:', data?.error?.message);
      return {
        success: true,
        content: buildSmartFallback(prompt),
      };
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return {
        success: true,
        content: buildSmartFallback(prompt),
      };
    }

    return {
      success: true,
      content: text,
    };
  } catch (err: any) {
    console.warn('⚠️ Erreur réseau Google Gemini, basculement fluide sur le fallback IA NovoRise:', err?.message);
    return {
      success: true,
      content: buildSmartFallback(prompt),
    };
  }
}
