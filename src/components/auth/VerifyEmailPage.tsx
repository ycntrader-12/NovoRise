import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * VerifyEmailPage — appelé quand l'utilisateur clique sur le lien de l'email :
 * http://localhost:5173/verify?token=UUID_TOKEN
 *
 * Lit le token dans l'URL, appelle l'API /auth/verify, établit la session.
 * Intégrez ce composant comme route dans votre routeur ou via window.location.search.
 */
export const VerifyEmailPage: React.FC = () => {
  const { confirmEmailToken } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Lien de vérification invalide : token manquant.');
      return;
    }

    confirmEmailToken(token)
      .then(() => {
        setStatus('success');
        setMessage('Votre email est vérifié ! Vous êtes maintenant connecté.');
        // Nettoyer l'URL après 2s
        setTimeout(() => {
          window.history.replaceState({}, '', '/');
        }, 2000);
      })
      .catch((err: Error) => {
        setStatus('error');
        setMessage(err.message || 'Lien invalide ou expiré. Réinscrivez-vous.');
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-10 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-indigo-400 animate-spin mx-auto mb-6" />
            <h2 className="text-white text-xl font-semibold mb-2">Vérification en cours…</h2>
            <p className="text-white/60">Connexion à votre compte NovoRise</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-white text-2xl font-bold mb-3">Email vérifié ! ✅</h2>
            <p className="text-white/70">{message}</p>
            <p className="text-white/40 text-sm mt-4">Redirection vers votre dashboard…</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-400" />
            </div>
            <h2 className="text-white text-2xl font-bold mb-3">Lien invalide</h2>
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
