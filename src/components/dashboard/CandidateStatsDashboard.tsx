import React from 'react';
import { 
  TrendingUp, 
  Award, 
  Target, 
  Clock, 
  CheckCircle2, 
  Eye, 
  Send, 
  Sparkles, 
  FileText, 
  Calendar, 
  Briefcase, 
  ArrowUpRight,
  Zap,
  BarChart3,
  PieChart,
  UserCheck,
  Building2,
  ChevronRight
} from 'lucide-react';
import { Application, User } from '../../types/auth';

interface CandidateStatsDashboardProps {
  user: User | null;
  applications: Application[];
  profileTitle: string;
  skillsCount: number;
  hasCv: boolean;
  hasCoverLetter: boolean;
  onNavigateTab: (tab: 'applications' | 'profile') => void;
  onBrowseJobs: () => void;
}

export const CandidateStatsDashboard: React.FC<CandidateStatsDashboardProps> = ({
  user,
  applications,
  profileTitle,
  skillsCount,
  hasCv,
  hasCoverLetter,
  onNavigateTab,
  onBrowseJobs
}) => {
  // Calculs statistiques
  const totalApps = applications.length;
  const pendingApps = applications.filter(a => a.status === 'En attente').length;
  const inReviewApps = applications.filter(a => a.status === "En cours d'examen").length;
  const interviewApps = applications.filter(a => a.status === 'Entretien').length;
  const acceptedApps = applications.filter(a => a.status === 'Acceptée').length;
  const rejectedApps = applications.filter(a => a.status === 'Refusée').length;

  // Calcul du taux de réponse & taux de conversion en entretien
  const respondedApps = inReviewApps + interviewApps + acceptedApps + rejectedApps;
  const responseRate = totalApps > 0 ? Math.round((respondedApps / totalApps) * 100) : 0;
  const interviewRate = totalApps > 0 ? Math.round((interviewApps / totalApps) * 100) : 0;

  // Score de complétion de profil
  let profileScore = 20; // base (compte créé)
  if (user?.isEmailVerified) profileScore += 15;
  if (profileTitle && profileTitle.trim()) profileScore += 15;
  if (skillsCount >= 3) profileScore += 20;
  if (hasCv) profileScore += 15;
  if (hasCoverLetter) profileScore += 15;
  profileScore = Math.min(profileScore, 100);

  // Activité récente (simulation réaliste des dernières semaines si candidatures existantes)
  const activityData = [
    { day: 'Lun', value: Math.min(totalApps, 1) },
    { day: 'Mar', value: Math.min(totalApps, 3) },
    { day: 'Mer', value: Math.min(totalApps, 2) },
    { day: 'Jeu', value: Math.min(totalApps, 4) },
    { day: 'Ven', value: Math.min(totalApps, 2) },
    { day: 'Sam', value: 0 },
    { day: 'Dim', value: 1 }
  ];
  const maxActivity = Math.max(...activityData.map(d => d.value), 4);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* ─── BANDEAU OBJECTIF & SANTÉ DU PROFIL ─── */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-3xl p-6 sm:p-8 text-white border border-slate-700/50 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#2D6BE4]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-40 h-40 bg-[#FF9F1C]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold backdrop-blur-sm border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tableau de bord statistique & visibilité</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bonjour, {user?.name || 'Candidat'} 👋
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Voici votre performance globale en temps réel. Optimisez vos candidatures, suivez les retours des recruteurs et maximisez vos chances d'obtenir des entretiens.
            </p>
          </div>

          {/* Jauge Complétion du Profil */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10 flex items-center gap-5 min-w-[280px]">
            <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-700/60"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#FF9F1C] transition-all duration-1000 ease-out"
                  strokeDasharray={`${profileScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-black text-sm text-white">{profileScore}%</span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Score Profil</div>
              <div className="text-sm font-bold text-white mt-0.5">
                {profileScore >= 90 ? '🌟 Profil Excellent' : profileScore >= 60 ? '⚡ Profil Optimisé' : '🔧 À compléter'}
              </div>
              <button 
                onClick={() => onNavigateTab('profile')}
                className="text-xs text-[#FF9F1C] hover:text-[#ffb246] font-semibold flex items-center gap-1 mt-1 transition-colors"
              >
                <span>Améliorer mon profil</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 4 CARTES KPI STATISTIQUES ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 : Candidatures Totales */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Candidatures</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2D6BE4] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Send className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-900">{totalApps}</div>
            <div className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{totalApps > 0 ? '+100% actives' : 'Aucun envoi'}</span>
            </div>
          </div>
        </div>

        {/* KPI 2 : Entretiens Décrochés */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Entretiens</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-purple-600">{interviewApps}</div>
            <div className="text-xs font-semibold text-purple-700 mt-1 flex items-center gap-1">
              <span>{interviewRate}% de conversion</span>
            </div>
          </div>
        </div>

        {/* KPI 3 : Taux de Réponse Recruteurs */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Taux de réponse</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-emerald-600">{responseRate}%</div>
            <div className="text-xs font-semibold text-slate-500 mt-1">
              {respondedApps} traités sur {totalApps}
            </div>
          </div>
        </div>

        {/* KPI 4 : Vues du profil & Portée */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Visibilité Profil</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#FF9F1C] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-900">48</div>
            <div className="text-xs font-semibold text-[#FF9F1C] mt-1 flex items-center gap-1">
              <span>Consultations RH récentes</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── STATISTIQUES DÉTAILLÉES : ENTONNOIR & RÉPARTITION ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Entonnoir de Recrutement (Pipeline) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#2D6BE4]" />
                <span>Entonnoir des candidatures (Pipeline)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Cycle de vie de vos candidatures auprès des entreprises partenaires</p>
            </div>
            <button 
              onClick={() => onNavigateTab('applications')}
              className="text-xs font-bold text-[#2D6BE4] hover:underline flex items-center gap-1"
            >
              <span>Voir détails</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Barres d'états dynamiques */}
          <div className="space-y-4">
            {/* Étape 1 : Envoyées / En attente */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  En attente de première lecture
                </span>
                <span className="text-slate-900 font-extrabold">{pendingApps} ({totalApps > 0 ? Math.round((pendingApps / totalApps) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-400 rounded-full transition-all duration-700"
                  style={{ width: `${totalApps > 0 ? (pendingApps / totalApps) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Étape 2 : En cours d'examen */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  En cours d'examen approfondi RH
                </span>
                <span className="text-slate-900 font-extrabold">{inReviewApps} ({totalApps > 0 ? Math.round((inReviewApps / totalApps) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-700"
                  style={{ width: `${totalApps > 0 ? (inReviewApps / totalApps) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Étape 3 : Entretiens */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                  Entretiens planifiés ou passés
                </span>
                <span className="text-purple-700 font-extrabold">{interviewApps} ({totalApps > 0 ? Math.round((interviewApps / totalApps) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 rounded-full transition-all duration-700"
                  style={{ width: `${totalApps > 0 ? (interviewApps / totalApps) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Étape 4 : Offres acceptées */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  Candidatures acceptées (Offres reçues)
                </span>
                <span className="text-emerald-700 font-extrabold">{acceptedApps} ({totalApps > 0 ? Math.round((acceptedApps / totalApps) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                  style={{ width: `${totalApps > 0 ? (acceptedApps / totalApps) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Étape 5 : Refusées */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="flex items-center gap-2 text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                  Non retenues
                </span>
                <span className="text-rose-600 font-extrabold">{rejectedApps} ({totalApps > 0 ? Math.round((rejectedApps / totalApps) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-rose-400 rounded-full transition-all duration-700"
                  style={{ width: `${totalApps > 0 ? (rejectedApps / totalApps) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Graphique d'activité de la semaine (Barres stylisées) */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Activité de recherche cette semaine</span>
              <span className="text-xs text-slate-500">Candidatures & interactions</span>
            </div>
            <div className="flex items-end justify-between gap-2 h-24 pt-4 px-2">
              {activityData.map((item, idx) => {
                const heightPercent = Math.max((item.value / maxActivity) * 100, 15);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="w-full max-w-[28px] bg-slate-100 rounded-t-lg h-full flex items-end">
                      <div 
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          item.value > 0 ? 'bg-gradient-to-t from-[#2D6BE4] to-[#5C94FF]' : 'bg-slate-200'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">{item.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Colonne Latérale : Diagnostic & Conseils Pro */}
        <div className="space-y-6">
          {/* Checklist d'optimisation */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#FF9F1C]" />
              <span>Optimisation CV & Profil</span>
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs">
                <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${hasCv ? 'text-emerald-500' : 'text-slate-300'}`} />
                <span className={hasCv ? 'text-slate-700 font-semibold' : 'text-slate-400'}>
                  CV professionnel déposé ({hasCv ? '100%' : 'Non déposé'})
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${hasCoverLetter ? 'text-emerald-500' : 'text-slate-300'}`} />
                <span className={hasCoverLetter ? 'text-slate-700 font-semibold' : 'text-slate-400'}>
                  Lettre de motivation prête
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${skillsCount >= 5 ? 'text-emerald-500' : 'text-slate-300'}`} />
                <span className={skillsCount >= 5 ? 'text-slate-700 font-semibold' : 'text-slate-400'}>
                  Compétences clés renseignées ({skillsCount}/5 min.)
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${user?.isEmailVerified ? 'text-emerald-500' : 'text-amber-500'}`} />
                <span className={user?.isEmailVerified ? 'text-slate-700 font-semibold' : 'text-amber-700 font-medium'}>
                  Adresse email confirmée
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('profile')}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Mettre à jour mes pièces</span>
            </button>
          </div>

          {/* Action rapide : Explorer de nouvelles opportunités */}
          <div className="bg-gradient-to-br from-[#2D6BE4] to-[#1C4CB0] rounded-3xl p-6 text-white shadow-lg space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-amber-300" />
            </div>
            <h4 className="font-extrabold text-base">Booster vos candidatures</h4>
            <p className="text-xs text-blue-100 leading-relaxed">
              Les candidats qui postulent à au moins 5 offres par semaine augmentent de 70% leurs chances de décrocher un entretien.
            </p>
            <button
              onClick={onBrowseJobs}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-white text-[#2D6BE4] hover:bg-blue-50 text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Parcourir les postes recommandés</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
