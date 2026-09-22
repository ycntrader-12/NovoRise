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
  Building2
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl md:max-w-2xl w-full shadow-2xl p-6 sm:p-8 md:p-10 relative border border-gray-100 my-8">
        
        {/* Close button */}
        <button
          onClick={() => {
            setAuthModalOpen(false);
            setFeedbackMsg(null);
          }}
          className="absolute top-6 right-6 text-[#6B7280] hover:text-[#1A1A2E] bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors cursor-pointer"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ================= STEP 1: INSCRIPTION ================= */}
        {authModalStep === 'register' && (
          <div>
            {/* Header / Tabs */}
            <div className="flex bg-[#F8F7F5] p-1.5 rounded-xl mb-8 border border-gray-200/60 max-w-md mx-auto">
              <button
                type="button"
                onClick={() => setAuthModalStep('login')}
                className="flex-1 py-2 text-xs font-semibold rounded-lg transition-all text-[#6B7280] hover:text-[#1A1A2E]"
              >
                Connexion
              </button>
              <button
                type="button"
                className="flex-1 py-2 text-xs font-semibold rounded-lg transition-all bg-white text-[#1A1A2E] shadow-sm"
              >
                Inscription
              </button>
            </div>

            <div className="text-center mb-8">
              <div className="inline-flex p-3 rounded-2xl bg-blue-50 text-[#2D6BE4] mb-3">
                <UserIcon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#1A1A2E]">Rejoignez NovoRise</h3>
              <p className="text-[#6B7280] text-sm mt-1.5 font-medium max-w-md mx-auto">
                Créez votre compte pour explorer les meilleures offres d'emploi ou recruter des talents d'exception.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5 text-sm max-w-lg mx-auto">
              
              {/* Role Selection */}
              <div>
                <label className="block font-semibold text-[#1A1A2E] mb-2 text-xs uppercase tracking-wider">Choisissez votre rôle *</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRole('candidat')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-3 cursor-pointer ${
                      role === 'candidat'
                        ? 'border-[#2D6BE4] bg-blue-50/50 text-[#1A1A2E] shadow-sm'
                        : 'border-gray-200 text-[#6B7280] hover:border-gray-300'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl ${role === 'candidat' ? 'bg-[#2D6BE4] text-white' : 'bg-gray-100 text-[#6B7280]'}`}>
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#1A1A2E]">Candidat</div>
                      <div className="text-xs text-[#6B7280]">Chercher un emploi</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('recruteur')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-3 cursor-pointer ${
                      role === 'recruteur'
                        ? 'border-[#16A34A] bg-emerald-50/50 text-[#1A1A2E] shadow-sm'
                        : 'border-gray-200 text-[#6B7280] hover:border-gray-300'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl ${role === 'recruteur' ? 'bg-[#16A34A] text-white' : 'bg-gray-100 text-[#6B7280]'}`}>
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#1A1A2E]">Recruteur</div>
                      <div className="text-xs text-[#6B7280]">Publier des offres</div>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1A1A2E] mb-1.5 text-xs">Nom complet *</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Sarah Alami"
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-[#2D6BE4] focus:ring-2 focus:ring-[#2D6BE4]/20 transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1A1A2E] mb-1.5 text-xs">Email professionnel ou personnel *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah@exemple.com"
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-[#2D6BE4] focus:ring-2 focus:ring-[#2D6BE4]/20 transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1A1A2E] mb-1.5 text-xs">Mot de passe *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Au moins 8 caractères"
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-[#2D6BE4] focus:ring-2 focus:ring-[#2D6BE4]/20 transition-all text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2D6BE4] hover:bg-[#2D6BE4]/90 text-white py-3.5 rounded-xl font-semibold shadow-sm transition-all flex items-center justify-center gap-2 text-sm mt-4 cursor-pointer active:scale-95"
              >
                <span>Créer mon compte</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
              <p className="text-[#6B7280] text-xs">
                Déjà inscrit ?{' '}
                <button
                  onClick={() => setAuthModalStep('login')}
                  className="font-semibold text-[#2D6BE4] hover:underline"
                >
                  Se connecter
                </button>
              </p>
            </div>
          </div>
        )}

        {/* ================= STEP 2: EMAIL DE CONFIRMATION (TOKEN 24H) ================= */}
        {authModalStep === 'email-confirmation' && (
          <div className="text-center py-4 max-w-lg mx-auto">
            <div className="w-16 h-16 bg-blue-50 text-[#2D6BE4] rounded-2xl flex items-center justify-center mx-auto mb-4 relative">
              <Mail className="w-8 h-8" />
              <div className="absolute -bottom-1 -right-1 bg-[#16A34A] text-white p-1 rounded-full">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-[#2D6BE4] text-xs font-semibold mb-3">
              <Clock className="w-3.5 h-3.5" /> Lien de confirmation envoyé (Expiration 24h)
            </span>

            <h3 className="text-2xl font-bold text-[#1A1A2E] mb-2">Vérifiez votre boîte mail</h3>
            <p className="text-[#6B7280] text-sm leading-relaxed max-w-md mx-auto mb-6 font-medium">
              Nous venons d'envoyer un lien de vérification sécurisé à l'adresse :<br />
              <strong className="text-[#1A1A2E] font-semibold">{pendingEmail || 'votre email'}</strong>
            </p>

            <div className="bg-[#F8F7F5] border border-gray-200/60 rounded-2xl p-4 text-left text-xs mb-6 space-y-2">
              <div className="flex items-center justify-between text-[#6B7280]">
                <span>Rôle sélectionné :</span>
                <span className="font-bold uppercase text-[#2D6BE4]">{pendingRole}</span>
              </div>
              <div className="flex items-center justify-between text-[#6B7280]">
                <span>Validité du jeton :</span>
                <span className="text-[#16A34A] font-semibold">24 heures</span>
              </div>
            </div>

            {/* Simulation button */}
            <button
              onClick={() => confirmEmailToken('mock_24h_token_valid')}
              className="w-full bg-[#16A34A] hover:bg-[#16A34A]/90 text-white py-3.5 rounded-xl font-semibold shadow-sm transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Confirmer l'email (Simuler clic)</span>
            </button>

            <div className="mt-6 flex items-center justify-center gap-3 text-xs text-[#6B7280]">
              <button 
                onClick={() => setAuthModalStep('register')}
                className="hover:text-[#1A1A2E] font-medium"
              >
                Modifier l'adresse email
              </button>
              <span>•</span>
              <button 
                onClick={() => setAuthModalStep('login')}
                className="hover:text-[#1A1A2E] font-medium"
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
            <div className="flex bg-[#F8F7F5] p-1.5 rounded-xl mb-8 border border-gray-200/60 max-w-md mx-auto">
              <button
                type="button"
                className="flex-1 py-2 text-xs font-semibold rounded-lg transition-all bg-white text-[#1A1A2E] shadow-sm"
              >
                Connexion
              </button>
              <button
                type="button"
                onClick={() => setAuthModalStep('register')}
                className="flex-1 py-2 text-xs font-semibold rounded-lg transition-all text-[#6B7280] hover:text-[#1A1A2E]"
              >
                Inscription
              </button>
            </div>

            {feedbackMsg && (
              <div className="mb-6 bg-emerald-50 text-emerald-800 text-xs p-3.5 rounded-xl flex items-center gap-2 border border-emerald-100 max-w-lg mx-auto">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] flex-shrink-0" />
                <span>{feedbackMsg}</span>
              </div>
            )}

            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#1A1A2E]">Bon retour sur NovoRise</h3>
              <p className="text-[#6B7280] text-sm mt-1.5 font-medium">
                Connectez-vous pour accéder à votre espace dédié.
              </p>
            </div>

            <div className="max-w-lg mx-auto space-y-5">
              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleOAuth}
                disabled={loading}
                className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-[#1A1A2E] py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-3 shadow-sm cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>Continuer avec Google</span>
              </button>

              <div className="flex items-center my-4">
                <div className="flex-1 border-t border-gray-200"></div>
                <span className="px-3 text-[#6B7280] text-xs font-semibold uppercase tracking-wider">ou par email</span>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4 text-sm">
                <div>
                  <label className="block font-semibold text-[#1A1A2E] mb-1.5 text-xs">Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nom@exemple.com"
                      className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-[#2D6BE4] focus:ring-2 focus:ring-[#2D6BE4]/20 transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="font-semibold text-[#1A1A2E] text-xs">Mot de passe</label>
                    <button
                      type="button"
                      onClick={() => {
                        setFeedbackMsg(null);
                        setAuthModalStep('forgot-password');
                      }}
                      className="text-[#2D6BE4] hover:underline text-xs font-semibold"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-[#2D6BE4] focus:ring-2 focus:ring-[#2D6BE4]/20 transition-all text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1A1A2E] hover:bg-[#1A1A2E]/90 text-white py-3.5 rounded-xl font-semibold shadow-sm transition-all text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 mt-2"
                >
                  <span>Se connecter</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
              <p className="text-[#6B7280] text-xs">
                Pas encore de compte ?{' '}
                <button
                  onClick={() => setAuthModalStep('register')}
                  className="font-semibold text-[#2D6BE4] hover:underline"
                >
                  S'inscrire gratuitement
                </button>
              </p>
            </div>
          </div>
        )}

        {/* ================= STEP 4: MOT DE PASSE OUBLIÉ ================= */}
        {authModalStep === 'forgot-password' && (
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex p-3 rounded-2xl bg-blue-50 text-[#2D6BE4] mb-3">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#1A1A2E]">Mot de passe oublié</h3>
              <p className="text-[#6B7280] text-sm mt-1.5 font-medium">
                Saisissez votre email pour recevoir un lien de réinitialisation sécurisé.
              </p>
            </div>

            <form onSubmit={handleForgotRequest} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-[#1A1A2E] mb-1.5 text-xs">Email du compte *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@domaine.com"
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-[#2D6BE4] focus:ring-2 focus:ring-[#2D6BE4]/20 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3.5 text-xs text-[#2D6BE4] flex items-start gap-2.5 font-medium">
                <AlertCircle className="w-4 h-4 text-[#2D6BE4] flex-shrink-0 mt-0.5" />
                <span>Un token temporaire valide 1 heure sera généré pour choisir votre nouveau mot de passe.</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2D6BE4] hover:bg-[#2D6BE4]/90 text-white py-3.5 rounded-xl font-semibold shadow-sm transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Envoyer le lien</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
              <button
                onClick={() => setAuthModalStep('login')}
                className="text-[#6B7280] hover:text-[#1A1A2E] text-xs font-semibold"
              >
                ← Retour à la connexion
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 5: RÉINITIALISATION MOT DE PASSE (TOKEN 1H) ================= */}
        {authModalStep === 'reset-password' && (
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex p-3 rounded-2xl bg-emerald-50 text-[#16A34A] mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#1A1A2E]">Nouveau mot de passe</h3>
              <p className="text-[#6B7280] text-sm mt-1.5 font-medium">
                Choisissez votre nouveau mot de passe de connexion.
              </p>
            </div>

            <form onSubmit={handleResetSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-[#1A1A2E] mb-1.5 text-xs">Jeton de réinitialisation</label>
                <input
                  type="text"
                  required
                  value={tokenInput || resetToken || ''}
                  onChange={(e) => setTokenInput(e.target.value)}
                  className="w-full border border-gray-200 bg-[#F8F7F5] rounded-xl px-4 py-3 outline-none font-mono text-xs text-[#1A1A2E]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1A1A2E] mb-1.5 text-xs">Nouveau mot de passe *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Au moins 8 caractères"
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-[#2D6BE4] focus:ring-2 focus:ring-[#2D6BE4]/20 transition-all text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#16A34A] hover:bg-[#16A34A]/90 text-white py-3.5 rounded-xl font-semibold shadow-sm transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Mettre à jour le mot de passe</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
              <button
                onClick={() => setAuthModalStep('login')}
                className="text-[#6B7280] hover:text-[#1A1A2E] text-xs font-semibold"
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
