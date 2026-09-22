import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';
import { apiGetMe } from '../../api/auth.api';

/**
 * GoogleCallbackPage — appelé après le redirect OAuth Google :
 * http://localhost:5173/auth/google/success?token=JWT&role=candidat
 *
 * Lit le JWT dans l'URL, restaure la session, redirige vers le dashboard.
 */
export const GoogleCallbackPage: React.FC = () => {
  const { setActiveView } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const role = urlParams.get('role') as UserRole | null;

    if (!token) {
      setStatus('error');
      setMessage('Échec de la connexion Google : token manquant.');
      return;
    }

    // Stocker le JWT
    localStorage.setItem('novorise_jwt_token', token);

    // Récupérer le profil complet depuis le backend
    apiGetMe()
      .then((user) => {
        localStorage.setItem('novorise_user', JSON.stringify(user));
        setStatus('success');
        setMessage(`Bienvenue ${user.name} !`);
        // Rediriger vers le bon dashboard
        setTimeout(() => {
          setActiveView(user.role === 'candidat' ? 'candidate-dashboard' : 'recruiter-dashboard');
          window.history.replaceState({}, '', '/');
        }, 1500);
      })
      .catch(() => {
        localStorage.removeItem('novorise_jwt_token');
        setStatus('error');
        setMessage('Erreur lors de la récupération de votre profil. Réessayez.');
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-10 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-indigo-400 animate-spin mx-auto mb-6" />
            <h2 className="text-white text-xl font-semibold mb-2">Connexion Google…</h2>
            <p className="text-white/60">Finalisation de votre session NovoRise</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-white text-2xl font-bold mb-3">{message}</h2>
            <p className="text-white/60">Redirection vers votre dashboard…</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-400" />
            </div>
            <h2 className="text-white text-2xl font-bold mb-3">Erreur OAuth</h2>
            <p className="text-white/70 mb-6">{message}</p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Retour à l'accueil
            </button>
          </>
        )}
      </div>
    </div>
  );
};
