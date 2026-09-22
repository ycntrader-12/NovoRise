import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole, UserProfile, Application, RecruiterJobPost, AuthModalStep } from '../types/auth';
import {
  apiRegister,
  apiVerifyEmail,
  apiLogin,
  apiForgotPassword,
  apiResetPassword,
  apiGetMe,
  apiUpdateProfile,
} from '../api/auth.api';
import {
  apiGetMyApplications,
  apiSubmitApplication,
} from '../api/applications.api';
import {
  apiGetMyJobs,
  apiCreateJob,
  apiUpdateJob,
  apiDeleteJob,
} from '../api/jobs.api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  activeView: 'home' | 'candidate-dashboard' | 'recruiter-dashboard';
  setActiveView: (view: 'home' | 'candidate-dashboard' | 'recruiter-dashboard') => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalStep: AuthModalStep;
  setAuthModalStep: (step: AuthModalStep) => void;
  pendingEmail: string;
  pendingRole: UserRole;
  resetToken: string | null;
  apiError: string | null;
  clearApiError: () => void;

  // Auth methods
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  confirmEmailToken: (token: string) => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; role: UserRole }>;
  loginWithGoogle: (preferredRole?: UserRole) => void;
  requestPasswordReset: (email: string) => Promise<string>;
  completePasswordReset: (token: string, newPassword: string) => Promise<boolean>;
  logout: () => void;
  updateCandidateProfile: (profile: Partial<UserProfile>) => Promise<void>;

  // Applications & Job postings
  applications: Application[];
  submitApplication: (app: {
    jobId: string;
    jobTitle: string;
    company: string;
    location: string;
    candidateName: string;
    candidateEmail: string;
    candidatePhone?: string;
    cvFileName?: string;
    coverLetterFileName?: string;
    coverNote?: string;
  }) => Promise<void>;
  recruiterJobs: RecruiterJobPost[];
  createRecruiterJob: (job: {
    title: string;
    company: string;
    category: RecruiterJobPost['category'];
    contract: RecruiterJobPost['contract'];
    workplace: RecruiterJobPost['workplace'];
    location: string;
    salary: string;
    description: string;
    tags: string[];
  }) => Promise<void>;
  toggleJobStatus: (id: string) => Promise<void>;
  deleteRecruiterJob: (id: string) => Promise<void>;
  refreshApplications: () => Promise<void>;
  refreshJobs: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Helpers session ─────────────────────────────────────────────────────────
const persistSession = (user: User, token: string) => {
  localStorage.setItem('novorise_jwt_token', token);
  localStorage.setItem('novorise_user', JSON.stringify(user));
};

const clearSession = () => {
  localStorage.removeItem('novorise_jwt_token');
  localStorage.removeItem('novorise_user');
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'home' | 'candidate-dashboard' | 'recruiter-dashboard'>('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalStep, setAuthModalStep] = useState<AuthModalStep>('login');
  const [pendingEmail, setPendingEmail] = useState('');
  const [pendingRole, setPendingRole] = useState<UserRole>('candidat');
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [recruiterJobs, setRecruiterJobs] = useState<RecruiterJobPost[]>([]);

  const clearApiError = () => setApiError(null);

  // ─── Établir une session ────────────────────────────────────────────────────
  const establishSession = useCallback((userData: User, jwtToken: string) => {
    setUser(userData);
    setToken(jwtToken);
    persistSession(userData, jwtToken);
    if (userData.role === 'candidat') {
      setActiveView('candidate-dashboard');
    } else {
      setActiveView('recruiter-dashboard');
    }
  }, []);

  // ─── Restaurer la session depuis localStorage au montage ───────────────────
  useEffect(() => {
    const savedToken = localStorage.getItem('novorise_jwt_token');
    const savedUser = localStorage.getItem('novorise_user');

    if (savedToken && savedUser) {
      try {
        const parsedUser: User = JSON.parse(savedUser);
        setUser(parsedUser);
        setToken(savedToken);
        // Revalider le token avec le backend en silence
        apiGetMe()
          .then((freshUser) => {
            setUser(freshUser);
            localStorage.setItem('novorise_user', JSON.stringify(freshUser));
          })
          .catch(() => {
            // Token expiré ou invalide → déconnexion
            clearSession();
            setUser(null);
            setToken(null);
          });
      } catch {
        clearSession();
      }
    }
  }, []);

  // ─── Écouter l'event session-expired (401 intercepté dans client.ts) ───────
  useEffect(() => {
    const handleExpired = () => {
      setUser(null);
      setToken(null);
      setActiveView('home');
      setApiError('Votre session a expiré. Veuillez vous reconnecter.');
      setAuthModalOpen(true);
      setAuthModalStep('login');
    };
    window.addEventListener('novorise:session-expired', handleExpired);
    return () => window.removeEventListener('novorise:session-expired', handleExpired);
  }, []);

  // ─── Charger les données après connexion ────────────────────────────────────
  useEffect(() => {
    if (!user || !token) return;
    if (user.role === 'candidat') {
      apiGetMyApplications()
        .then(setApplications)
        .catch(console.error);
    } else if (user.role === 'recruteur') {
      apiGetMyJobs()
        .then(setRecruiterJobs)
        .catch(console.error);
    }
  }, [user?.id, token]);

  // ─── Register → email de confirmation ──────────────────────────────────────
  const register = async (name: string, email: string, password: string, role: UserRole) => {
    try {
      setApiError(null);
      await apiRegister(name, email, password, role);
      setPendingEmail(email);
      setPendingRole(role);
      setAuthModalStep('email-confirmation');
    } catch (err: any) {
      const msg = err.code === 'EMAIL_ALREADY_EXISTS'
        ? 'Cet email est déjà utilisé.'
        : err.message || 'Erreur lors de l\'inscription.';
      setApiError(msg);
      throw err;
    }
  };

  // ─── Confirm Email (token depuis le lien /verify?token=...) ────────────────
  const confirmEmailToken = async (tokenStr: string) => {
    try {
      setApiError(null);
      const { user: verifiedUser, token: jwtToken } = await apiVerifyEmail(tokenStr);
      establishSession(verifiedUser, jwtToken);
      setAuthModalOpen(false);
    } catch (err: any) {
      const msg = err.code === 'INVALID_OR_EXPIRED_TOKEN'
        ? 'Lien de vérification invalide ou expiré.'
        : err.message || 'Erreur de vérification.';
      setApiError(msg);
      throw err;
    }
  };

  // ─── Login ──────────────────────────────────────────────────────────────────
  const login = async (email: string, password: string) => {
    try {
      setApiError(null);
      const { user: loggedUser, token: jwtToken } = await apiLogin(email, password);
      establishSession(loggedUser, jwtToken);
      setAuthModalOpen(false);
      return { success: true, role: loggedUser.role };
    } catch (err: any) {
      const errorMessages: Record<string, string> = {
        INVALID_CREDENTIALS: 'Email ou mot de passe incorrect.',
        EMAIL_NOT_VERIFIED: 'Vérifiez votre email avant de vous connecter.',
        USE_GOOGLE_LOGIN: 'Ce compte utilise la connexion Google.',
      };
      const msg = errorMessages[err.code] || err.message || 'Erreur de connexion.';
      setApiError(msg);
      throw err;
    }
  };

  // ─── Google OAuth — redirect vers le backend ────────────────────────────────
  const loginWithGoogle = (preferredRole: UserRole = 'candidat') => {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    window.location.href = `${apiBase}/api/auth/google?role=${preferredRole}`;
  };

  // ─── Google OAuth callback handler (appelé par VerifyEmailPage si ?token=) ─
  // Utilisé quand le backend redirige vers /auth/google/success?token=...&role=...
  // Géré dans GoogleCallbackPage

  // ─── Mot de passe oublié ────────────────────────────────────────────────────
  const requestPasswordReset = async (email: string): Promise<string> => {
    try {
      setApiError(null);
      await apiForgotPassword(email);
      setPendingEmail(email);
      // Pas de step intermédiaire : l'email envoyé contient le lien
      // On passe directement à reset-password pour permettre la saisie manuelle du token
      setAuthModalStep('reset-password');
      return '';
    } catch (err: any) {
      setApiError(err.message || 'Erreur lors de la demande de réinitialisation.');
      throw err;
    }
  };

  // ─── Compléter le reset mdp ─────────────────────────────────────────────────
  const completePasswordReset = async (token: string, newPassword: string): Promise<boolean> => {
    try {
      setApiError(null);
      await apiResetPassword(token, newPassword);
      setResetToken(null);
      setAuthModalStep('login');
      return true;
    } catch (err: any) {
      const msg = err.code === 'RESET_TOKEN_INVALID_OR_EXPIRED'
        ? 'Lien expiré ou invalide. Faites une nouvelle demande.'
        : err.message || 'Erreur lors de la réinitialisation.';
      setApiError(msg);
      return false;
    }
  };

  // ─── Déconnexion ────────────────────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    setToken(null);
    setApplications([]);
    setRecruiterJobs([]);
    clearSession();
    setActiveView('home');
  };

  // ─── Mise à jour profil ─────────────────────────────────────────────────────
  const updateCandidateProfile = async (profileUpdate: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const updated = await apiUpdateProfile(profileUpdate);
      setUser(updated);
      localStorage.setItem('novorise_user', JSON.stringify(updated));
    } catch (err: any) {
      setApiError(err.message || 'Erreur lors de la mise à jour du profil.');
      throw err;
    }
  };

  // ─── Soumettre une candidature ──────────────────────────────────────────────
  const submitApplication = async (appData: {
    jobId: string;
    jobTitle: string;
    company: string;
    location: string;
    candidateName: string;
    candidateEmail: string;
    candidatePhone?: string;
    cvFileName?: string;
    coverLetterFileName?: string;
    coverNote?: string;
  }) => {
    try {
      const newApp = await apiSubmitApplication({
        jobId: appData.jobId,
        coverNote: appData.coverNote,
        cvFileName: appData.cvFileName,
        coverLetterFileName: appData.coverLetterFileName,
      });
      // Enrichir avec les infos du job pour l'affichage local
      const enriched: Application = {
        ...newApp,
        jobTitle: appData.jobTitle,
        company: appData.company,
        location: appData.location,
        candidateName: appData.candidateName,
        candidateEmail: appData.candidateEmail,
        candidatePhone: appData.candidatePhone,
        appliedAt: 'À l\'instant',
      };
      setApplications(prev => [enriched, ...prev]);
    } catch (err: any) {
      if (err.code === 'ALREADY_APPLIED') {
        setApiError('Vous avez déjà postulé pour cette offre.');
      } else {
        setApiError(err.message || 'Erreur lors de la candidature.');
      }
      throw err;
    }
  };

  // ─── Refresh candidatures ───────────────────────────────────────────────────
  const refreshApplications = async () => {
    const apps = await apiGetMyApplications();
    setApplications(apps);
  };

  // ─── Refresh offres recruteur ───────────────────────────────────────────────
  const refreshJobs = async () => {
    const jobs = await apiGetMyJobs();
    setRecruiterJobs(jobs);
  };

  // ─── Créer une offre ────────────────────────────────────────────────────────
  const createRecruiterJob = async (job: {
    title: string;
    company: string;
    category: RecruiterJobPost['category'];
    contract: RecruiterJobPost['contract'];
    workplace: RecruiterJobPost['workplace'];
    location: string;
    salary: string;
    description: string;
    tags: string[];
  }) => {
    try {
      const newJob = await apiCreateJob(job);
      setRecruiterJobs(prev => [newJob, ...prev]);
    } catch (err: any) {
      setApiError(err.message || 'Erreur lors de la création de l\'offre.');
      throw err;
    }
  };

  // ─── Basculer statut offre ──────────────────────────────────────────────────
  const toggleJobStatus = async (id: string) => {
    const currentJob = recruiterJobs.find(j => j.id === id);
    if (!currentJob) return;
    const newStatus = currentJob.status === 'Actif' ? 'Pause' : 'Actif';
    try {
      const updated = await apiUpdateJob(id, { status: newStatus });
      setRecruiterJobs(prev => prev.map(j => j.id === id ? updated : j));
    } catch (err: any) {
      setApiError(err.message || 'Erreur lors de la mise à jour.');
      throw err;
    }
  };

  // ─── Supprimer une offre ────────────────────────────────────────────────────
  const deleteRecruiterJob = async (id: string) => {
    try {
      await apiDeleteJob(id);
      setRecruiterJobs(prev => prev.filter(j => j.id !== id));
    } catch (err: any) {
      setApiError(err.message || 'Erreur lors de la suppression.');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        activeView,
        setActiveView,
        authModalOpen,
        setAuthModalOpen,
        authModalStep,
        setAuthModalStep,
        pendingEmail,
        pendingRole,
        resetToken,
        apiError,
        clearApiError,
        register,
        confirmEmailToken,
        login,
        loginWithGoogle,
        requestPasswordReset,
        completePasswordReset,
        logout,
        updateCandidateProfile,
        applications,
        submitApplication,
        recruiterJobs,
        createRecruiterJob,
        toggleJobStatus,
        deleteRecruiterJob,
        refreshApplications,
        refreshJobs,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
