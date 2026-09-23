import React, { useState } from 'react';
import { 
  Briefcase, 
  FileText, 
  FileCode,
  Search, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Building2, 
  Upload, 
  Sparkles, 
  User, 
  Bookmark, 
  ArrowRight, 
  ExternalLink,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ApplicationStatus } from '../../types/auth';
import { CandidateStatsDashboard } from './CandidateStatsDashboard';

interface CandidateDashboardProps {
  onBrowseJobs: () => void;
}

export const CandidateDashboard: React.FC<CandidateDashboardProps> = ({ onBrowseJobs }) => {
  const { user, applications, updateCandidateProfile } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'stats' | 'applications' | 'profile' | 'saved'>('stats');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Profile editable state
  const [profileTitle, setProfileTitle] = useState(user?.profile?.title || 'Développeur Full Stack');
  const [profileBio, setProfileBio] = useState(
    user?.profile?.bio || 'Ingénieur passionné par la création de produits digitaux performants et élégants. Ouvert à de nouvelles opportunités en CDI ou missions Remote.'
  );
  const [skills, setSkills] = useState<string[]>(
    user?.profile?.skills || ['React', 'TypeScript', 'Node.js', 'Next.js', 'Tailwind CSS', 'Docker']
  );
  const [newSkillInput, setNewSkillInput] = useState('');
  const [cvFile, setCvFile] = useState(user?.profile?.cvFileName || 'CV_Principal_2026.pdf');
  const [coverLetterFile, setCoverLetterFile] = useState(user?.profile?.coverLetterFileName || 'Lettre_De_Motivation_2026.pdf');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCandidateProfile({
      title: profileTitle,
      bio: profileBio,
      skills,
      cvFileName: cvFile,
      coverLetterFileName: coverLetterFile
    });
    showToast('Profil, CV et Lettre de motivation mis à jour avec succès ! ✨');
  };

  const addSkill = () => {
    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
      setSkills([...skills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const removeSkill = (sk: string) => {
    setSkills(skills.filter(s => s !== sk));
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Entretien':
        return (
          <span className="bg-purple-100 text-purple-800 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Entretien prévu
          </span>
        );
      case 'En cours d\'examen':
        return (
          <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1.5 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-blue-600" /> En cours d'examen
          </span>
        );
      case 'Acceptée':
        return (
          <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1.5 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Acceptée
          </span>
        );
      case 'Refusée':
        return (
          <span className="bg-rose-100 text-rose-800 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1.5 shadow-sm">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> Non retenue
          </span>
        );
      default:
        return (
          <span className="bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1.5 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> En attente de revue
          </span>
        );
    }
  };

  return (
    <div className="pt-24 pb-20 max-w-[1780px] w-full mx-auto px-4 sm:px-8 lg:px-12">
      
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B132B] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#FF9F1C]" />
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Top Banner: User Profile Overview */}
      <div className="bg-gradient-to-r from-[#0B132B] via-[#1C2541] to-[#0B132B] rounded-3xl p-6 md:p-10 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#FF9F1C]/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#FF9F1C] to-[#FF5E36] text-white flex items-center justify-center font-extrabold text-2xl shadow-lg border-2 border-white/20">
              {user?.name.charAt(0).toUpperCase() || 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Candidat Vérifié
                </span>
                <span className="text-gray-400 text-xs">• Session active</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                {user?.name || 'Candidat'}
              </h1>
              <p className="text-gray-300 text-sm mt-0.5">
                {profileTitle} • {user?.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onBrowseJobs}
              className="bg-gradient-to-r from-[#FF9F1C] to-[#FF5E36] text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-lg shadow-orange-500/20 hover:scale-105 transition-all flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Explorer les offres</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/15 px-4 py-2.5 rounded-full text-xs font-semibold transition-all flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>Mon Profil & CV</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 text-center sm:text-left">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <div className="text-gray-400 text-xs">Candidatures envoyées</div>
            <div className="text-2xl font-black text-white mt-1">{applications.length}</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <div className="text-gray-400 text-xs">Entretiens prévus</div>
            <div className="text-2xl font-black text-[#FF9F1C] mt-1">
              {applications.filter(a => a.status === 'Entretien').length}
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <div className="text-gray-400 text-xs">Vues du profil</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">48</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <div className="text-gray-400 text-xs">Statut recherche</div>
            <div className="text-xs font-bold text-white mt-2 flex items-center gap-1.5 justify-center sm:justify-start">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              À l'écoute d'opportunités
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-3 border-b border-gray-200 mb-8 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'stats'
              ? 'bg-[#0B132B] text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-[#FF9F1C]" />
          <span>Statistiques & Activité</span>
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'applications'
              ? 'bg-[#0B132B] text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Mes candidatures ({applications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-[#0B132B] text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Mon Profil & CV</span>
        </button>
      </div>

      {/* ================= TAB 0: STATISTIQUES GLOBALES ================= */}
      {activeTab === 'stats' && (
        <CandidateStatsDashboard
          user={user}
          applications={applications}
          profileTitle={profileTitle}
          skillsCount={skills.length}
          hasCv={Boolean(cvFile)}
          hasCoverLetter={Boolean(coverLetterFile)}
          onNavigateTab={(tab) => setActiveTab(tab)}
          onBrowseJobs={onBrowseJobs}
        />
      )}

      {/* ================= TAB 1: MES CANDIDATURES ================= */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-[#0B132B]">Suivi de vos candidatures</h2>
              <p className="text-gray-500 text-xs mt-0.5">
                Consultez en temps réel l'avancement de vos demandes auprès des entreprises.
              </p>
            </div>
            <button
              onClick={onBrowseJobs}
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#FF5E36] hover:text-[#FF9F1C] transition-colors"
            >
              <span>Postuler à de nouveaux postes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {applications.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-orange-50 text-[#FF9F1C] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#0B132B] mb-1">Aucune candidature pour le moment</h3>
              <p className="text-gray-500 text-xs max-w-sm mx-auto mb-6">
                Explorez le catalogue de postes NovoRise et postulez directement en 1 clic.
              </p>
              <button
                onClick={onBrowseJobs}
                className="bg-gradient-to-r from-[#FF9F1C] to-[#FF5E36] text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-md hover:shadow-orange-500/20 transition-all"
              >
                Parcourir les offres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {applications.map(app => (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {app.company.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#0B132B]">{app.jobTitle}</h3>
                        <p className="text-gray-500 text-xs flex items-center gap-2">
                          <span className="font-semibold text-gray-700">{app.company}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-gray-400" /> {app.location}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" /> Postulé : {app.appliedAt}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-600 font-medium">
                        <FileText className="w-3.5 h-3.5 text-[#FF9F1C]" /> {app.cvFileName || 'CV transmis'}
                      </span>
                    </div>

                    {app.coverNote && (
                      <p className="text-xs text-gray-500 bg-gray-50 p-2.5 rounded-xl border border-gray-100 italic">
                        « {app.coverNote} »
                      </p>
                    )}
                  </div>

                  <div className="flex flex-row md:flex-col items-start md:items-end justify-between gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                    <div>{getStatusBadge(app.status)}</div>
                    <button
                      onClick={() => showToast(`Message envoyé au recruteur de ${app.company}.`)}
                      className="text-xs font-semibold text-gray-500 hover:text-[#0B132B] flex items-center gap-1 transition-colors"
                    >
                      <span>Relancer le recruteur</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: PROFIL & CV ================= */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm max-w-3xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#0B132B]">Profil Candidat & CV</h2>
            <p className="text-gray-500 text-xs mt-0.5">
              Ces informations sont transmises automatiquement lors de vos candidatures directes.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6 text-xs">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Nom complet</label>
                <input
                  type="text"
                  disabled
                  value={user?.name || ''}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3.5 py-2.5 text-gray-500 font-medium"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3.5 py-2.5 text-gray-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Intitulé de votre poste cible *</label>
              <input
                type="text"
                required
                value={profileTitle}
                onChange={(e) => setProfileTitle(e.target.value)}
                placeholder="Ex: Senior Frontend Engineer (React/TypeScript)"
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#FF9F1C] text-gray-800 transition-colors"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Bio / Résumé professionnel</label>
              <textarea
                rows={3}
                value={profileBio}
                onChange={(e) => setProfileBio(e.target.value)}
                placeholder="Décrivez brièvement vos points forts, réalisations et ce que vous recherchez..."
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#FF9F1C] text-gray-800 transition-colors resize-none"
              />
            </div>

            {/* Skills manager */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Compétences clés</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {skills.map(sk => (
                  <span
                    key={sk}
                    className="bg-orange-50 text-[#FF5E36] font-semibold px-3 py-1 rounded-lg flex items-center gap-1.5 border border-orange-100"
                  >
                    {sk}
                    <button
                      type="button"
                      onClick={() => removeSkill(sk)}
                      className="hover:text-red-700 ml-1 text-xs"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  placeholder="Ajouter une compétence (ex: Kubernetes, GraphQL)..."
                  className="flex-1 border border-gray-200 rounded-xl px-3.5 py-2 outline-none focus:border-[#FF9F1C]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="bg-[#0B132B] text-white px-4 py-2 rounded-xl font-bold flex items-center gap-1 hover:bg-slate-900 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Ajouter
                </button>
              </div>
            </div>

            {/* CV & Lettre de Motivation Documents Section */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <label className="block font-semibold text-gray-800 text-sm">Documents Candidat (Tous formats acceptés)</label>
                <span className="text-[11px] text-[#FF5E36] font-medium">PDF, DOC, DOCX, ODT, RTF, TXT, Images...</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* CV Box */}
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-5 text-center hover:border-[#FF9F1C] bg-gray-50/50 hover:bg-white transition-all relative cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.odt,.rtf,.txt,.jpg,.jpeg,.png,.webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setCvFile(f.name);
                    }}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                  />
                  <div className="w-10 h-10 bg-orange-50 text-[#FF9F1C] rounded-xl flex items-center justify-center mx-auto mb-2">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Document 1 • CV</span>
                  <div className="font-bold text-[#0B132B] text-xs truncate max-w-[240px] mx-auto">{cvFile}</div>
                  <div className="text-[11px] text-gray-500 mt-1 flex items-center justify-center gap-1">
                    <Upload className="w-3 h-3 text-[#FF9F1C]" />
                    <span>Cliquez ou déposez votre CV (Tous formats)</span>
                  </div>
                </div>

                {/* Lettre de Motivation Box */}
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-5 text-center hover:border-[#2D6BE4] bg-gray-50/50 hover:bg-white transition-all relative cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.odt,.rtf,.txt,.jpg,.jpeg,.png,.webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setCoverLetterFile(f.name);
                    }}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                  />
                  <div className="w-10 h-10 bg-blue-50 text-[#2D6BE4] rounded-xl flex items-center justify-center mx-auto mb-2">
                    <FileCode className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Document 2 • Lettre de Motivation</span>
                  <div className="font-bold text-[#0B132B] text-xs truncate max-w-[240px] mx-auto">{coverLetterFile}</div>
                  <div className="text-[11px] text-gray-500 mt-1 flex items-center justify-center gap-1">
                    <Upload className="w-3 h-3 text-[#2D6BE4]" />
                    <span>Cliquez ou déposez votre Lettre (Tous formats)</span>
                  </div>
                </div>

              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="bg-gradient-to-r from-[#FF9F1C] to-[#FF5E36] hover:from-[#e88b14] hover:to-[#e54a22] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-orange-500/20 transition-all text-xs"
              >
                Enregistrer les modifications
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
};
