// ─── HTTP Client — appels vers le backend Express (/api) ──────────────────────
// Le vite.config.ts proxifie /api → http://localhost:3001 en dev
// En production, VITE_API_URL pointe vers votre backend déployé

const BASE_URL = import.meta.env.VITE_API_URL || '';

// Récupère le JWT depuis localStorage
const getToken = (): string | null => localStorage.getItem('novorise_jwt_token');

interface RequestOptions extends RequestInit {
  data?: unknown;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { data, headers: extraHeaders, ...rest } = options;
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(extraHeaders as Record<string, string> || {}),
  };

  const config: RequestInit = {
    ...rest,
    headers,
    ...(data !== undefined ? { body: JSON.stringify(data) } : {}),
  };

  const response = await fetch(`${BASE_URL}/api${endpoint}`, config);

  // Token expiré : déconnexion automatique
  if (response.status === 401) {
    localStorage.removeItem('novorise_jwt_token');
    localStorage.removeItem('novorise_user');
    window.dispatchEvent(new CustomEvent('novorise:session-expired'));
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: 'Erreur réseau' }));
    
    let errorMessage = errorBody.message;
    if (errorBody.error === 'VALIDATION_ERROR' && Array.isArray(errorBody.details)) {
      errorMessage = errorBody.details.map((e: any) => e.msg).join(', ');
    } else if (!errorMessage) {
      errorMessage = errorBody.error ? `Erreur: ${errorBody.error}` : `HTTP ${response.status} Request failed`;
    }

    throw Object.assign(new Error(errorMessage), {
      status: response.status,
      code: errorBody.error,
      details: errorBody.details,
    });
  }

  return response.json() as Promise<T>;
}

export const apiGet = <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' });
export const apiPost = <T>(endpoint: string, data: unknown) => request<T>(endpoint, { method: 'POST', data });
export const apiPut = <T>(endpoint: string, data: unknown) => request<T>(endpoint, { method: 'PUT', data });
export const apiPatch = <T>(endpoint: string, data: unknown) => request<T>(endpoint, { method: 'PATCH', data });
export const apiDelete = <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' });
