import React from 'react';
import { 
  TrendingUp, 
  Eye, 
  Users, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  Target, 
  Sparkles, 
  BarChart3, 
  ArrowUpRight, 
  PlusCircle, 
  Pause, 
  Check, 
  Building2, 
  Layers,
  ArrowRight,
  Zap,
  Filter
} from 'lucide-react';
import { RecruiterJobPost, Application, User } from '../../types/auth';

interface RecruiterStatsDashboardProps {
  user: User | null;
  recruiterJobs: RecruiterJobPost[];
  applications: Application[];
  onNavigateTab: (tab: 'manage-jobs' | 'candidates' | 'post-job') => void;
}

export const RecruiterStatsDashboard: React.FC<RecruiterStatsDashboardProps> = ({
  user,
  recruiterJobs,
  applications,
  onNavigateTab
}) => {
  // Calculs statistiques globaux
  const totalJobs = recruiterJobs.length;
  const activeJobs = recruiterJobs.filter(j => j.status === 'Actif').length;
  const pausedJobs = recruiterJobs.filter(j => j.status === 'Pause').length;

  const totalViews = recruiterJobs.reduce((acc, j) => acc + (j.viewsCount || 0), 0);
  const totalApplications = applications.length;

  // Taux de conversion global
  const globalConversionRate = totalViews > 0 
    ? Math.round((totalApplications / totalViews) * 100) 
    : 0;

  // Candidatures par statut
  const pendingApps = applications.filter(a => a.status === 'En attente').length;
  const inReviewApps = applications.filter(a => a.status === "En cours d'examen").length;
  const interviewApps = applications.filter(a => a.status === 'Entretien').length;
  const acceptedApps = applications.filter(a => a.status === 'Acceptée').length;
  const rejectedApps = applications.filter(a => a.status === 'Refusée').length;

  // Candidatures par contrat ou type
  const cdiJobs = recruiterJobs.filter(j => j.contract === 'CDI').length;
  const remoteJobs = recruiterJobs.filter(j => j.workplace === 'Remote').length;

  // Calcul du top poste le plus attractif
  const topJob = [...recruiterJobs].sort((a, b) => (b.applicationsCount || 0) - (a.applicationsCount || 0))[0];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* ─── BANDEAU OBJECTIF & APERÇU RECRUTEUR ─── */}
      <div className="bg-gradient-to-r from-[#0B132B] via-[#1A233A] to-[#0B132B] rounded-3xl p-6 sm:p-8 text-white border border-slate-700/50 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#FF5E36]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-40 h-40 bg-[#FF9F1C]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-orange-300 text-xs font-semibold backdrop-blur-sm border border-orange-500/20">
              <Sparkles className="w-3.5 h-3.5 text-[#FF9F1C]" />
              <span>Pilotage RH & Performance des Offres</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Espace Recrutement • {user?.profile?.companyName || user?.name || 'Entreprise'}
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Analysez l'impact de vos annonces, mesurez l'engagement des candidats et pilotez votre pipeline de recrutement en temps réel.
            </p>
          </div>

          {/* Bouton d'action rapide */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('post-job')}
              className="bg-gradient-to-r from-[#FF9F1C] to-[#FF5E36] hover:from-[#e88b14] hover:to-[#e54a22] text-white px-5 py-3 rounded-2xl text-xs font-bold shadow-lg shadow-orange-500/20 hover:scale-105 transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publier une offre</span>
            </button>
            <button
              onClick={() => onNavigateTab('candidates')}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/15 px-4 py-3 rounded-2xl text-xs font-semibold transition-all flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>Voir le vivier ({totalApplications})</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── 4 CARTES KPI STATISTIQUES RECRUTEUR ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 : Annonces Actives */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Offres en ligne</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2D6BE4] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-900">{activeJobs}</div>
            <div className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1">
              <span>{totalJobs} annonces au total ({pausedJobs} en pause)</span>
            </div>
          </div>
        </div>

        {/* KPI 2 : Candidatures reçues */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Candidatures reçues</span>
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF5E36] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-[#FF5E36]">{totalApplications}</div>
            <div className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{pendingApps} en attente de revue</span>
            </div>
          </div>
        </div>

        {/* KPI 3 : Vues globales */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Vues d'annonces</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-900">{totalViews}</div>
            <div className="text-xs font-semibold text-emerald-600 mt-1">
              Impressions qualifiées
            </div>
          </div>
        </div>

        {/* KPI 4 : Taux de conversion */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Taux de conversion</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-purple-600">{globalConversionRate}%</div>
            <div className="text-xs font-semibold text-slate-500 mt-1">
              Ratio Candidatures / Visites
            </div>
          </div>
        </div>

      </div>

      {/* ─── PIPELINE DE QUALIFICATION & RÉPARTITION ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Colonne 1 & 2 : Pipeline de sélection des talents */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#FF5E36]" />
                <span>Entonnoir de recrutement (Qualification des profils)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Avancement de vos candidats de la réception jusqu'à l'embauche</p>
            </div>
            <button 
              onClick={() => onNavigateTab('candidates')}
              className="text-xs font-bold text-[#FF5E36] hover:underline flex items-center gap-1"
            >
              <span>Gérer les candidats</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Barres horizontales interactives */}
          <div className="space-y-4">
            {/* 1. Nouvelles candidatures non examinées */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  Nouvelles candidatures (En attente)
                </span>
                <span className="text-slate-900 font-extrabold">{pendingApps} ({totalApplications > 0 ? Math.round((pendingApps / totalApplications) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-400 rounded-full transition-all duration-700"
                  style={{ width: `${totalApplications > 0 ? (pendingApps / totalApplications) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* 2. En cours d'évaluation technique / RH */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  Dossiers en cours d'examen
                </span>
                <span className="text-slate-900 font-extrabold">{inReviewApps} ({totalApplications > 0 ? Math.round((inReviewApps / totalApplications) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-700"
                  style={{ width: `${totalApplications > 0 ? (inReviewApps / totalApplications) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* 3. Entretiens programmés */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                  Candidats en phase d'entretien
                </span>
                <span className="text-purple-700 font-extrabold">{interviewApps} ({totalApplications > 0 ? Math.round((interviewApps / totalApplications) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 rounded-full transition-all duration-700"
                  style={{ width: `${totalApplications > 0 ? (interviewApps / totalApplications) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* 4. Embauches / Propositions acceptées */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  Offres acceptées (Recrutements validés)
                </span>
                <span className="text-emerald-700 font-extrabold">{acceptedApps} ({totalApplications > 0 ? Math.round((acceptedApps / totalApplications) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                  style={{ width: `${totalApplications > 0 ? (acceptedApps / totalApplications) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* 5. Profils déclinés */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="flex items-center gap-2 text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                  Candidatures refusées / clôturées
                </span>
                <span className="text-rose-600 font-extrabold">{rejectedApps} ({totalApplications > 0 ? Math.round((rejectedApps / totalApplications) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-rose-400 rounded-full transition-all duration-700"
                  style={{ width: `${totalApplications > 0 ? (rejectedApps / totalApplications) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Performance par annonce */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Top offres attractives</span>
              <span className="text-xs text-slate-500">{totalJobs} offres au catalogue</span>
            </div>
            
            <div className="space-y-2">
              {recruiterJobs.slice(0, 3).map(j => (
                <div key={j.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="truncate pr-4">
                    <div className="text-xs font-bold text-slate-900 truncate">{j.title}</div>
                    <div className="text-[11px] text-slate-500">{j.contract} • {j.location}</div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-slate-400" /> {j.viewsCount}
                    </span>
                    <span className="text-xs font-bold text-[#FF5E36] bg-orange-100/60 px-2 py-0.5 rounded-md">
                      {j.applicationsCount} candidats
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Colonne 3 : Indicateurs stratégiques de recrutement */}
        <div className="space-y-6">
          {/* Card Top Métriques de l'entreprise */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#2D6BE4]" />
              <span>Attractivité Entreprise</span>
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-50/50 border border-blue-100">
                <span className="text-xs font-medium text-slate-600">Offres en télétravail (Remote)</span>
                <span className="text-xs font-black text-blue-700">{remoteJobs} ({totalJobs > 0 ? Math.round((remoteJobs / totalJobs) * 100) : 0}%)</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                <span className="text-xs font-medium text-slate-600">Postes stables (CDI)</span>
                <span className="text-xs font-black text-emerald-700">{cdiJobs} ({totalJobs > 0 ? Math.round((cdiJobs / totalJobs) * 100) : 0}%)</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-50/50 border border-purple-100">
                <span className="text-xs font-medium text-slate-600">Délai moyen de qualification</span>
                <span className="text-xs font-black text-purple-700">~ 48 heures</span>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('manage-jobs')}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Gérer le catalogue d'annonces</span>
            </button>
          </div>

          {/* Action Callout : Conseil Recruteur Pro */}
          <div className="bg-gradient-to-br from-[#0B132B] to-[#1E293B] rounded-3xl p-6 text-white shadow-lg space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF9F1C]/15 rounded-full blur-xl pointer-events-none" />
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-[#FF9F1C]" />
            </div>
            <h4 className="font-extrabold text-base">Accélérez vos recrutements</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Répondre aux candidats dans les 72h multiplie par 3 votre attractivité employeur et fidélise les meilleurs profils tech et cadres.
            </p>
            <button
              onClick={() => onNavigateTab('candidates')}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FF9F1C] to-[#FF5E36] text-white hover:opacity-95 text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Évaluer les candidats en attente</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
