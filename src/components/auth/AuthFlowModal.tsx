import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Briefcase, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  KeyRound, 
  Clock, 
  AlertCircle,
  Building2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';

export const AuthFlowModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalStep,
    setAuthModalStep,
    pendingEmail,
    pendingRole,
    resetToken,
    register,
    confirmEmailToken,
    login,
    loginWithGoogle,
    requestPasswordReset,
    completePasswordReset
  } = useAuth();

  // Local form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('candidat');

  const [newPassword, setNewPassword] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!authModalOpen) return null;

  // Handle Inscription Submit
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await register(name, email, password, role);
    setLoading(false);
  };

  // Handle Connexion Submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await login(email, password);
    setLoading(false);
  };

  // Handle Google OAuth
  const handleGoogleOAuth = async () => {
    setLoading(true);
    await loginWithGoogle(role);
    setLoading(false);
  };

  // Handle Forgot Password Request
  const handleForgotRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const generatedToken = await requestPasswordReset(email);
    setTokenInput(generatedToken);
    setLoading(false);
    setFeedbackMsg(`Un token temporaire valable 1 heure a été généré.`);
  };

  // Handle Reset Password Submit
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await completePasswordReset(tokenInput || (resetToken || ''), newPassword);
    setLoading(false);
    setFeedbackMsg('Votre mot de passe a été mis à jour avec succès ! Vous pouvez vous connecter.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 md:p-8 relative border border-gray-100">
        
        {/* Close button */}
        <button
          onClick={() => {
            setAuthModalOpen(false);
            setFeedbackMsg(null);
          }}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ================= STEP 1: INSCRIPTION ================= */}
        {authModalStep === 'register' && (
          <div>
            {/* Header / Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => setAuthModalStep('login')}
                className="flex-1 py-2 text-xs font-bold rounded-xl transition-all text-gray-500 hover:text-gray-900"
              >
                Connexion
              </button>
              <button
                type="button"
                className="flex-1 py-2 text-xs font-bold rounded-xl transition-all bg-white text-[#0B132B] shadow-sm"
              >
                Inscription
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="inline-flex p-3 rounded-2xl bg-orange-50 text-[#FF9F1C] mb-3">
                <UserIcon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#0B132B]">Rejoignez NovoRise</h3>
              <p className="text-gray-500 text-xs mt-1">
                Créez votre compte pour explorer ou recruter des talents d'exception.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4 text-xs">
              
              {/* Role Selection */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1.5">Choisissez votre rôle *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('candidat')}
                    className={`p-3 rounded-2xl border-2 text-left transition-all flex items-center gap-2.5 ${
                      role === 'candidat'
                        ? 'border-[#FF9F1C] bg-orange-50/60 text-[#0B132B] shadow-sm'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${role === 'candidat' ? 'bg-[#FF9F1C] text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs">Candidat</div>
                      <div className="text-[10px] text-gray-500">Chercher un emploi</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('recruteur')}
                    className={`p-3 rounded-2xl border-2 text-left transition-all flex items-center gap-2.5 ${
                      role === 'recruteur'
                        ? 'border-[#FF5E36] bg-rose-50/60 text-[#0B132B] shadow-sm'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${role === 'recruteur' ? 'bg-[#FF5E36] text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs">Recruteur</div>
                      <div className="text-[10px] text-gray-500">Publier des offres</div>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Nom complet *</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Sarah Alami"
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-3.5 py-2.5 outline-none focus:border-[#FF9F1C] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Email professionnel ou personnel *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah@exemple.com"
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-3.5 py-2.5 outline-none focus:border-[#FF9F1C] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Mot de passe *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Au moins 8 caractères"
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-3.5 py-2.5 outline-none focus:border-[#FF9F1C] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#FF9F1C] to-[#FF5E36] hover:from-[#e88b14] hover:to-[#e54a22] text-white py-3.5 rounded-full font-bold shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer active:scale-95"
              >
                <span>Créer mon compte</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
              <p className="text-gray-500 text-[11px]">
                Déjà inscrit ?{' '}
                <button
                  onClick={() => setAuthModalStep('login')}
                  className="font-bold text-[#FF5E36] hover:underline"
                >
                  Se connecter
                </button>
              </p>
            </div>
          </div>
        )}

        {/* ================= STEP 2: EMAIL DE CONFIRMATION (TOKEN 24H) ================= */}
        {authModalStep === 'email-confirmation' && (
          <div className="text-center py-2">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4 relative">
              <Mail className="w-8 h-8" />
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold uppercase tracking-wider mb-2">
              <Clock className="w-3.5 h-3.5" /> Lien token • Expiration 24h
            </span>

            <h3 className="text-2xl font-bold text-[#0B132B] mb-2">Vérifiez vos emails</h3>
            <p className="text-gray-600 text-xs leading-relaxed max-w-sm mx-auto mb-6">
              Nous venons d'envoyer un lien de confirmation sécurisé à l'adresse :<br />
              <strong className="text-[#0B132B] font-semibold">{pendingEmail || 'votre email'}</strong>
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs mb-6 space-y-2">
              <div className="flex items-center justify-between text-gray-500 text-[11px]">
                <span>Rôle détecté :</span>
                <span className="font-bold uppercase text-[#FF5E36]">{pendingRole}</span>
              </div>
              <div className="flex items-center justify-between text-gray-500 text-[11px]">
                <span>Validité du token :</span>
                <span className="text-emerald-600 font-semibold">24 heures</span>
              </div>
              <div className="text-gray-400 text-[10px] pt-1 border-t border-slate-200">
                L'activation stockera automatiquement votre jeton JWT de session dans le navigateur.
              </div>
            </div>

            {/* Simulation button for user testing */}
            <button
              onClick={() => confirmEmailToken('mock_24h_token_valid')}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-3.5 rounded-full font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 text-xs"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Confirmer l'email (Simuler clic sur le lien)</span>
            </button>

            <div className="mt-4 flex items-center justify-center gap-3 text-xs text-gray-400">
              <button 
                onClick={() => setAuthModalStep('register')}
                className="hover:text-gray-600 text-[11px]"
              >
                Modifier l'adresse email
              </button>
              <span>•</span>
              <button 
                onClick={() => setAuthModalStep('login')}
                className="hover:text-gray-600 text-[11px]"
              >
                Retour à la connexion
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: CONNEXION ================= */}
        {authModalStep === 'login' && (
          <div>
            {/* Header / Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-2xl mb-6">
              <button
                type="button"
                className="flex-1 py-2 text-xs font-bold rounded-xl transition-all bg-white text-[#0B132B] shadow-sm"
              >
                Connexion
              </button>
              <button
                type="button"
                onClick={() => setAuthModalStep('register')}
                className="flex-1 py-2 text-xs font-bold rounded-xl transition-all text-gray-500 hover:text-gray-900"
              >
                Inscription
              </button>
            </div>

            {feedbackMsg && (
              <div className="mb-4 bg-emerald-50 text-emerald-800 text-xs p-3 rounded-xl flex items-center gap-2 border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{feedbackMsg}</span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-[#0B132B]">Bon retour sur NovoRise</h3>
              <p className="text-gray-500 text-xs mt-1">
                Connectez-vous pour accéder à votre espace dédié.
              </p>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleOAuth}
              disabled={loading}
              className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 rounded-2xl font-semibold text-xs transition-all flex items-center justify-center gap-3 shadow-sm mb-4 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Continuer avec Google (OAuth)</span>
            </button>

            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-3 text-gray-400 text-[10px] uppercase font-bold tracking-wider">ou par email</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nom@exemple.com"
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-3.5 py-2.5 outline-none focus:border-[#FF9F1C] transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-gray-700">Mot de passe</label>
                  <button
                    type="button"
                    onClick={() => {
                      setFeedbackMsg(null);
                      setAuthModalStep('forgot-password');
                    }}
                    className="text-[#FF5E36] hover:underline text-[11px] font-medium"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-3.5 py-2.5 outline-none focus:border-[#FF9F1C] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0B132B] hover:bg-slate-900 text-white py-3.5 rounded-full font-bold shadow-md transition-all text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Se connecter</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
              <p className="text-gray-500 text-[11px]">
                Pas encore de compte ?{' '}
                <button
                  onClick={() => setAuthModalStep('register')}
                  className="font-bold text-[#FF5E36] hover:underline"
                >
                  S'inscrire gratuitement
                </button>
              </p>
            </div>
          </div>
        )}

        {/* ================= STEP 4: MOT DE PASSE OUBLIÉ ================= */}
        {authModalStep === 'forgot-password' && (
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex p-3 rounded-2xl bg-amber-50 text-amber-600 mb-3">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#0B132B]">Mot de passe oublié</h3>
              <p className="text-gray-500 text-xs mt-1">
                Saisissez votre adresse email pour recevoir un lien de réinitialisation sécurisé (token 1h).
              </p>
            </div>

            <form onSubmit={handleForgotRequest} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Email du compte *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@domaine.com"
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-3.5 py-2.5 outline-none focus:border-[#FF9F1C] transition-colors"
                  />
                </div>
              </div>

              <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-3 text-[11px] text-amber-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>Un token temporaire de 1h sera généré pour vous permettre de choisir un nouveau mot de passe.</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0B132B] hover:bg-slate-900 text-white py-3.5 rounded-full font-bold shadow-md transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Envoyer le lien de réinitialisation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
              <button
                onClick={() => setAuthModalStep('login')}
                className="text-gray-500 hover:text-gray-800 text-xs font-semibold"
              >
                ← Retour à la connexion
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 5: RÉINITIALISATION MOT DE PASSE (TOKEN 1H) ================= */}
        {authModalStep === 'reset-password' && (
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex p-3 rounded-2xl bg-emerald-50 text-emerald-600 mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#0B132B]">Nouveau mot de passe</h3>
              <p className="text-gray-500 text-xs mt-1">
                Token validé (expiration 1h). Choisissez votre nouveau mot de passe.
              </p>
            </div>

            <form onSubmit={handleResetSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Jeton de réinitialisation (Token 1h)</label>
                <input
                  type="text"
                  required
                  value={tokenInput || resetToken || ''}
                  onChange={(e) => setTokenInput(e.target.value)}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3.5 py-2.5 outline-none font-mono text-[11px] text-gray-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Nouveau mot de passe *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Au moins 8 caractères"
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-3.5 py-2.5 outline-none focus:border-[#FF9F1C] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3.5 rounded-full font-bold shadow-md transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Mettre à jour le mot de passe</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
              <button
                onClick={() => setAuthModalStep('login')}
                className="text-gray-500 hover:text-gray-800 text-xs font-semibold"
              >
                ← Annuler et revenir à la connexion
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
