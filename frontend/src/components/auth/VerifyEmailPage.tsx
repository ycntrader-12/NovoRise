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
        // Redirection vers le dashboard après 1.5s
        setTimeout(() => {
          window.location.replace('/');
        }, 1500);
      })
      .catch((err: Error) => {
        setStatus('error');
        setMessage(err.message || 'Lien invalide ou expiré. Réinscrivez-vous.');
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B132B] via-[#1C2541] to-[#0B132B] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#FF9F1C]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#2D6BE4]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl relative border border-slate-100 overflow-hidden my-6 z-10">
        
        {/* Header bar matching NovoRise modal top */}
        <div className="bg-gradient-to-r from-[#0B132B] via-[#1C2541] to-[#0B132B] text-white p-6 relative overflow-hidden text-center">
          <div className="absolute right-0 top-0 w-32 h-32 bg-[#FF9F1C]/20 rounded-full blur-xl pointer-events-none" />
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF9F1C]/20 text-[#FF9F1C] text-[11px] font-bold uppercase tracking-wider border border-[#FF9F1C]/30 mb-2">
            NovoRise Auth
          </span>
          <h3 className="text-xl font-extrabold text-white tracking-tight">Validation d'Email</h3>
        </div>

        <div className="p-8 sm:p-10 text-center">
          {status === 'loading' && (
            <>
              <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-5">
                <Loader2 className="w-8 h-8 text-[#FF9F1C] animate-spin" />
              </div>
              <h2 className="text-lg font-extrabold text-[#0B132B] mb-1.5">Vérification en cours…</h2>
              <p className="text-slate-500 text-xs">Validation de votre adresse email et activation du compte</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-emerald-100">
                <CheckCircle2 className="w-8 h-8 text-[#16A34A]" />
              </div>
              <h2 className="text-lg font-extrabold text-[#0B132B] mb-1.5">Email vérifié ! 🎉</h2>
              <p className="text-slate-500 text-xs mt-1">{message}</p>
              <div className="mt-4 flex justify-center">
                <div className="w-6 h-6 border-2 border-[#2D6BE4] border-t-transparent rounded-full animate-spin" />
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-red-100">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-lg font-extrabold text-[#0B132B] mb-1.5">Lien invalide ou expiré</h2>
              <p className="text-slate-500 text-xs mb-6">{message}</p>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-[#2D6BE4] hover:bg-[#2563EB] text-white py-3.5 rounded-2xl font-extrabold shadow-lg shadow-blue-500/25 transition-all text-xs cursor-pointer"
              >
                Retour à l'accueil
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
