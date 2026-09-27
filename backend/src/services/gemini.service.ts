import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';

export interface GenerateContentResponse {
  success: boolean;
  content?: string;
  error?: string;
}

/**
 * Service pour interagir avec l'API Google Gemini
 */
export async function generateWithGemini(prompt: string): Promise<GenerateContentResponse> {
  if (!GEMINI_API_KEY) {
    return {
      success: false,
      error: 'GEMINI_API_KEY_MISSING: Aucune clé API Google Gemini configurée.',
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
      if (data?.error?.status === 'PERMISSION_DENIED') {
        return {
          success: false,
          error: `GEMINI_API_NOT_ENABLED: Veuillez activer l'API Gemini sur la console Google Cloud : ${data?.error?.details?.[0]?.metadata?.activationUrl || 'https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com'}`,
        };
      }
      return {
        success: false,
        error: data?.error?.message || 'Erreur lors de la génération avec Gemini.',
      };
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return {
        success: false,
        error: 'Aucune réponse générée par Gemini.',
      };
    }

    return {
      success: true,
      content: text,
    };
  } catch (err: any) {
    console.error('Gemini API Error:', err);
    return {
      success: false,
      error: err.message || 'Erreur réseau vers Google Gemini.',
    };
  }
}
