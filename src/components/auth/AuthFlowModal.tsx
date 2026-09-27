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
  TrendingUp,
  Check,
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
    pendingVerificationToken,
    resetToken,
    register,
    confirmEmailToken,
    login,
    loginWithGoogle,
    loginWithGoogleInstant,
    requestPasswordReset,
    completePasswordReset,
    apiError
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
    try {
      await register(name, email, password, role);
    } catch (err) {
      // Error is already caught and set to apiError in useAuth
    } finally {
      setLoading(false);
    }
  };

  // Handle Connexion Submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      // Error is set in apiError
    } finally {
      setLoading(false);
    }
  };

  // Handle Google OAuth
  const handleGoogleOAuth = async () => {
    setLoading(true);
    await loginWithGoogle(role);
    setLoading(false);
  };

  // Handle Google Instant (Fast / Anti-blocage)
  const handleGoogleInstant = async () => {
    setLoading(true);
    try {
      await loginWithGoogleInstant(role, email || undefined, name || undefined);
    } catch (_) {
    } finally {
      setLoading(false);
    }
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
    <div className="fixed inset-0 z-50 bg-[#0B132B]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl relative border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col md:flex-row">
        
        {/* ================= LEFT COLUMN: NOVORISE BRAND SHOWCASE (Desktop) ================= */}
        <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-[#0B132B] via-[#1C2541] to-[#0B132B] text-white p-7 lg:p-8 flex-col justify-between relative overflow-hidden select-none">
          {/* Ambient Lighting Blurs */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-[#2D6BE4]/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />

          {/* Top: Logo & Tag */}
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="bg-[#2D6BE4] p-1.5 rounded-xl text-white shadow-md shadow-blue-500/30">
                <TrendingUp className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Novo<span className="text-[#2D6BE4]">Rise</span>
              </span>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2D6BE4]/20 text-[#60A5FA] text-[11px] font-bold uppercase tracking-wider border border-[#2D6BE4]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#60A5FA]" /> Plateforme RH & Talents
            </span>
          </div>

          {/* Center: Dynamic Title & Value Propositions */}
          <div className="relative z-10 my-4 space-y-3">
            <div>
              <h4 className="text-xl lg:text-2xl font-black leading-tight text-white">
                {authModalStep === 'register' && "Propulsez votre avenir professionnel."}
                {authModalStep === 'login' && "Ravi de vous revoir parmi nous !"}
                {authModalStep === 'email-confirmation' && "Une étape pour valider votre profil."}
                {authModalStep === 'forgot-password' && "Récupération sécurisée d'accès."}
                {authModalStep === 'reset-password' && "Sécurisez votre nouveau mot de passe."}
              </h4>
              <p className="text-slate-300 text-xs mt-1.5 leading-relaxed">
                Connectez-vous à l'écosystème d'emploi et de recrutement de référence au Maroc.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2.5 text-xs text-slate-200">
                <div className="w-4 h-4 rounded-full bg-[#2D6BE4]/30 text-[#60A5FA] flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>+5 000 offres d'entreprises vérifiées</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-200">
                <div className="w-4 h-4 rounded-full bg-[#2D6BE4]/30 text-[#60A5FA] flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Candidatures directes & suivi en temps réel</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-200">
                <div className="w-4 h-4 rounded-full bg-[#2D6BE4]/30 text-[#60A5FA] flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Contact direct avec les recruteurs</span>
              </div>
            </div>
          </div>

          {/* Bottom: Trust & Security */}
          <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Conforme RGPD
            </span>
            <span className="font-semibold text-slate-300">NovoRise v2.0</span>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: INTERACTIVE FORM (Compact & Optimized) ================= */}
        <div className="w-full md:w-7/12 p-5 sm:p-6 lg:p-7 flex flex-col justify-between overflow-y-auto relative">
          
          {/* Close Button */}
          <button
            onClick={() => {
              setAuthModalOpen(false);
              setFeedbackMsg(null);
            }}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors cursor-pointer z-30"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>

          <div>
            {/* Top Switcher Tabs (For Register & Login) */}
            {(authModalStep === 'register' || authModalStep === 'login') && (
              <div className="flex bg-slate-100/90 p-1 rounded-xl mb-4 max-w-[260px]">
                <button
                  type="button"
                  onClick={() => setAuthModalStep('login')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    authModalStep === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Connexion
                </button>
                <button
                  type="button"
                  onClick={() => setAuthModalStep('register')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    authModalStep === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Inscription
                </button>
              </div>
            )}

            {/* Notification / Feedback Messages */}
            {feedbackMsg && (
              <div className="mb-3 bg-emerald-50 text-emerald-800 text-xs p-3 rounded-xl flex items-center gap-2 border border-emerald-100 font-medium animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] flex-shrink-0" />
                <span>{feedbackMsg}</span>
              </div>
            )}

            {apiError && (
              <div className="mb-3 p-3 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-2.5 text-xs font-medium animate-fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p>{apiError}</p>
              </div>
            )}

            {/* ================= STEP 1: INSCRIPTION ================= */}
            {authModalStep === 'register' && (
              <div>
                <div className="mb-3">
                  <h3 className="text-xl font-black text-[#0B132B]">Rejoignez NovoRise</h3>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Créez votre compte gratuit en moins d'une minute.
                  </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-3 text-xs">
                  {/* Role Selector (Compact 2 cards) */}
                  <div>
                    <label className="block font-bold text-slate-600 mb-1 text-[11px] uppercase tracking-wider">
                      Votre profil *
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setRole('candidat')}
                        className={`px-3 py-2 rounded-xl border-2 text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                          role === 'candidat'
                            ? 'border-[#2D6BE4] bg-blue-50/60 text-[#0B132B] shadow-sm ring-1 ring-[#2D6BE4]/30'
                            : 'border-slate-200 text-slate-500 hover:border-slate-300 bg-slate-50/50'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg ${role === 'candidat' ? 'bg-[#2D6BE4] text-white shadow-sm' : 'bg-slate-200 text-slate-600'}`}>
                          <Briefcase className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-extrabold text-xs text-[#0B132B]">Candidat</div>
                          <div className="text-[10px] text-slate-500 leading-none mt-0.5">Chercher un emploi</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRole('recruteur')}
                        className={`px-3 py-2 rounded-xl border-2 text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                          role === 'recruteur'
                            ? 'border-[#0B132B] bg-slate-100 text-[#0B132B] shadow-sm ring-1 ring-slate-900/20'
                            : 'border-slate-200 text-slate-500 hover:border-slate-300 bg-slate-50/50'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg ${role === 'recruteur' ? 'bg-[#0B132B] text-white shadow-sm' : 'bg-slate-200 text-slate-600'}`}>
                          <Building2 className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-extrabold text-xs text-[#0B132B]">Recruteur</div>
                          <div className="text-[10px] text-slate-500 leading-none mt-0.5">Publier des offres</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Google OAuth Button */}
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={handleGoogleOAuth}
                      disabled={loading}
                      className="w-full bg-white border border-slate-200 hover:border-[#2D6BE4] hover:bg-blue-50/20 text-slate-800 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md cursor-pointer group active:scale-[0.99]"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                      </svg>
                      <span>S'inscrire avec Google ({role === 'candidat' ? 'Candidat' : 'Recruteur'})</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleGoogleInstant}
                      disabled={loading}
                      className="w-full text-center text-[11px] text-[#2D6BE4] hover:text-[#1D4ED8] hover:underline font-semibold py-0.5 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-[#2D6BE4]" />
                      <span>Inscription express Google (1 clic sans redirection)</span>
                    </button>
                  </div>

                  <div className="flex items-center my-1.5">
                    <div className="flex-1 border-t border-slate-200"></div>
                    <span className="px-2.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">ou par email</span>
                    <div className="flex-1 border-t border-slate-200"></div>
                  </div>

                  {/* Horizontal 2-column input fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-[11px]">Nom complet *</label>
                      <div className="relative">
                        <UserIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ex: Sarah Alami"
                          className="w-full border border-slate-200 focus:border-[#2D6BE4] rounded-xl pl-8 pr-3 py-2 outline-none transition-all text-xs text-slate-800 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-[#2D6BE4]/15"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-[11px]">Email *</label>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="sarah@exemple.com"
                          className="w-full border border-slate-200 focus:border-[#2D6BE4] rounded-xl pl-8 pr-3 py-2 outline-none transition-all text-xs text-slate-800 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-[#2D6BE4]/15"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-[11px]">Mot de passe *</label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Au moins 8 caractères"
                        className="w-full border border-slate-200 focus:border-[#2D6BE4] rounded-xl pl-8 pr-3 py-2 outline-none transition-all text-xs text-slate-800 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-[#2D6BE4]/15"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#2D6BE4] hover:bg-[#2563EB] text-white py-2.5 rounded-xl font-bold shadow-md shadow-blue-600/25 hover:shadow-blue-600/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-xs cursor-pointer disabled:opacity-70 mt-1"
                  >
                    <span>Créer mon compte</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                <div className="pt-2 text-center">
                  <p className="text-slate-500 text-[11px]">
                    Déjà inscrit ?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthModalStep('login')}
                      className="font-bold text-[#2D6BE4] hover:text-[#1D4ED8] hover:underline cursor-pointer"
                    >
                      Se connecter
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* ================= STEP 2: EMAIL DE CONFIRMATION ================= */}
            {authModalStep === 'email-confirmation' && (
              <div className="text-center py-2">
                <div className="w-12 h-12 bg-blue-50 text-[#2D6BE4] rounded-2xl flex items-center justify-center mx-auto mb-3 relative">
                  <Mail className="w-6 h-6" />
                  <div className="absolute -bottom-1 -right-1 bg-[#16A34A] text-white p-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 text-[#2D6BE4] text-[11px] font-semibold mb-2">
                  <Clock className="w-3 h-3" /> Lien valide 24h
                </span>

                <h3 className="text-lg font-black text-[#0B132B] mb-1">Vérifiez votre boîte mail</h3>
                <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto mb-4">
                  Un email avec un lien de confirmation sécurisé a été envoyé à :<br />
                  <strong className="text-slate-900 font-bold">{pendingEmail || 'votre email'}</strong>
                </p>

                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-left text-xs mb-4 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Rôle sélectionné :</span>
                    <span className="font-bold uppercase text-[#2D6BE4]">{pendingRole}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Statut :</span>
                    <span className="text-[#16A34A] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> En attente de validation
                    </span>
                  </div>
                </div>

                {/* Simulation button for demo */}
                <button
                  onClick={() => confirmEmailToken(pendingVerificationToken || 'mock_24h_token_valid')}
                  className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirmer l'email (Simuler clic)</span>
                </button>

                <div className="mt-3 flex items-center justify-center gap-3 text-xs text-slate-500">
                  <button 
                    onClick={() => setAuthModalStep('register')}
                    className="hover:text-slate-900 font-medium"
                  >
                    Modifier l'email
                  </button>
                  <span>•</span>
                  <button 
                    onClick={() => setAuthModalStep('login')}
                    className="hover:text-slate-900 font-medium"
                  >
                    Retour à la connexion
                  </button>
                </div>
              </div>
            )}

            {/* ================= STEP 3: CONNEXION ================= */}
            {authModalStep === 'login' && (
              <div>
                <div className="mb-3">
                  <h3 className="text-xl font-black text-[#0B132B]">Bon retour sur NovoRise</h3>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Connectez-vous pour accéder à votre espace dédié.
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Google OAuth Button */}
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={handleGoogleOAuth}
                      disabled={loading}
                      className="w-full bg-white border border-slate-200 hover:border-[#2D6BE4] hover:bg-blue-50/20 text-slate-800 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md cursor-pointer group active:scale-[0.99]"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                      </svg>
                      <span>Continuer avec Google</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleGoogleInstant}
                      disabled={loading}
                      className="w-full text-center text-[11px] text-[#2D6BE4] hover:text-[#1D4ED8] hover:underline font-semibold py-0.5 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-[#2D6BE4]" />
                      <span>Connexion express Google (1 clic sans redirection)</span>
                    </button>
                  </div>

                  <div className="flex items-center my-1.5">
                    <div className="flex-1 border-t border-slate-200"></div>
                    <span className="px-2.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">ou par email</span>
                    <div className="flex-1 border-t border-slate-200"></div>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-[11px]">Email</label>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="nom@exemple.com"
                          className="w-full border border-slate-200 focus:border-[#2D6BE4] rounded-xl pl-8 pr-3 py-2 outline-none transition-all text-xs text-slate-800 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-[#2D6BE4]/15"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="font-bold text-slate-700 text-[11px]">Mot de passe</label>
                        <button
                          type="button"
                          onClick={() => {
                            setFeedbackMsg(null);
                            setAuthModalStep('forgot-password');
                          }}
                          className="text-[#2D6BE4] hover:text-[#1D4ED8] hover:underline text-[11px] font-bold cursor-pointer"
                        >
                          Mot de passe oublié ?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full border border-slate-200 focus:border-[#2D6BE4] rounded-xl pl-8 pr-3 py-2 outline-none transition-all text-xs text-slate-800 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-[#2D6BE4]/15"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#2D6BE4] hover:bg-[#2563EB] text-white py-2.5 rounded-xl font-bold shadow-md shadow-blue-600/25 hover:shadow-blue-600/40 hover:scale-[1.01] active:scale-[0.99] transition-all text-xs flex items-center justify-center gap-2 cursor-pointer mt-1 disabled:opacity-70"
                    >
                      <span>Se connecter</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>

                <div className="pt-3 text-center">
                  <p className="text-slate-500 text-[11px]">
                    Pas encore de compte ?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthModalStep('register')}
                      className="font-bold text-[#2D6BE4] hover:text-[#1D4ED8] hover:underline cursor-pointer"
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
                <div className="mb-3">
                  <div className="inline-flex p-2 rounded-xl bg-blue-50 text-[#2D6BE4] mb-2">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-black text-[#0B132B]">Mot de passe oublié</h3>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Saisissez votre email pour recevoir un lien de réinitialisation sécurisé.
                  </p>
                </div>

                <form onSubmit={handleForgotRequest} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-[11px]">Email du compte *</label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre.email@domaine.com"
                        className="w-full border border-slate-200 focus:border-[#2D6BE4] rounded-xl pl-8 pr-3 py-2 outline-none transition-all text-xs text-slate-800 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-[#2D6BE4]/15"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3 text-xs text-blue-900 flex items-start gap-2 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 text-[#2D6BE4] flex-shrink-0 mt-0.5" />
                    <span>Un token temporaire valide 1 heure sera généré pour choisir votre nouveau mot de passe.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#2D6BE4] hover:bg-[#2563EB] text-white py-2.5 rounded-xl font-bold shadow-md shadow-blue-600/25 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    <span>Envoyer le lien</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                <div className="pt-3 text-center">
                  <button
                    onClick={() => setAuthModalStep('login')}
                    className="text-slate-500 hover:text-slate-900 text-xs font-bold cursor-pointer"
                  >
                    ← Retour à la connexion
                  </button>
                </div>
              </div>
            )}

            {/* ================= STEP 5: RÉINITIALISATION MOT DE PASSE ================= */}
            {authModalStep === 'reset-password' && (
              <div>
                <div className="mb-3">
                  <div className="inline-flex p-2 rounded-xl bg-blue-50 text-[#2D6BE4] mb-2">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-black text-[#0B132B]">Nouveau mot de passe</h3>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Choisissez votre nouveau mot de passe de connexion.
                  </p>
                </div>

                <form onSubmit={handleResetSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-[11px]">Jeton de réinitialisation</label>
                    <input
                      type="text"
                      required
                      value={tokenInput || resetToken || ''}
                      onChange={(e) => setTokenInput(e.target.value)}
                      className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3 py-2 outline-none font-mono text-xs text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-[11px]">Nouveau mot de passe *</label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Au moins 8 caractères"
                        className="w-full border border-slate-200 focus:border-[#2D6BE4] rounded-xl pl-8 pr-3 py-2 outline-none transition-all text-xs text-slate-800 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-[#2D6BE4]/15"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#2D6BE4] hover:bg-[#2563EB] text-white py-2.5 rounded-xl font-bold shadow-md shadow-blue-600/25 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    <span>Mettre à jour le mot de passe</span>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                </form>

                <div className="pt-3 text-center">
                  <button
                    onClick={() => setAuthModalStep('login')}
                    className="text-slate-500 hover:text-slate-900 text-xs font-bold cursor-pointer"
                  >
                    ← Annuler et revenir à la connexion
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
