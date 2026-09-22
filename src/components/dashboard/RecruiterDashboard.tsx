import React, { useState } from 'react';
import { 
  Building2, 
  PlusCircle, 
  Users, 
  Eye, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Briefcase, 
  Mail, 
  Phone, 
  Send, 
  X, 
  FileText, 
  Trash2, 
  Pause, 
  Play, 
  Sparkles,
  Search,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { RecruiterJobPost, Application } from '../../types/auth';

export const RecruiterDashboard: React.FC = () => {
  const { 
    user, 
    recruiterJobs, 
    createRecruiterJob, 
    toggleJobStatus, 
    deleteRecruiterJob,
    applications
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'manage-jobs' | 'post-job' | 'candidates'>('manage-jobs');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Contact candidate modal
  const [contactingCandidate, setContactingCandidate] = useState<Application | null>(null);
  const [contactMessage, setContactMessage] = useState('');

  // Post new job form state
  const [newJob, setNewJob] = useState({
    title: '',
    company: user?.profile?.companyName || 'NovoRise Partner',
    category: 'Tech & IT' as RecruiterJobPost['category'],
    contract: 'CDI' as RecruiterJobPost['contract'],
    workplace: 'Remote' as RecruiterJobPost['workplace'],
    location: 'Casablanca (Remote possible)',
    salary: '30 000 - 45 000 MAD / mois',
    description: '',
    tags: 'React, TypeScript, Next.js'
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    createRecruiterJob({
      title: newJob.title,
      company: newJob.company,
      category: newJob.category,
      contract: newJob.contract,
      workplace: newJob.workplace,
      location: newJob.location,
      salary: newJob.salary,
      description: newJob.description,
      tags: newJob.tags.split(',').map(t => t.trim()).filter(Boolean)
    });
    showToast(`L'annonce "${newJob.title}" a été publiée avec succès ! 🚀`);
    setActiveTab('manage-jobs');
    setNewJob({
      title: '',
      company: user?.profile?.companyName || 'NovoRise Partner',
      category: 'Tech & IT',
      contract: 'CDI',
      workplace: 'Remote',
      location: 'Casablanca (Remote possible)',
      salary: '30 000 - 45 000 MAD / mois',
      description: '',
      tags: 'React, TypeScript, Next.js'
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Message envoyé à ${contactingCandidate?.candidateName} (${contactingCandidate?.candidateEmail}) ! 📩`);
    setContactingCandidate(null);
    setContactMessage('');
  };

  const totalViews = recruiterJobs.reduce((acc, j) => acc + j.viewsCount, 0);
  const totalApplications = applications.length;

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B132B] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#FF9F1C]" />
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Top Banner: Recruiter Overview */}
      <div className="bg-gradient-to-r from-[#0B132B] via-[#1A233A] to-[#0B132B] rounded-3xl p-6 md:p-10 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#FF5E36]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#FF5E36] to-[#FF9F1C] text-white flex items-center justify-center font-extrabold text-2xl shadow-lg border-2 border-white/20">
              <Building2 className="w-10 h-10" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#FF5E36]/20 text-[#FF9F1C] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[#FF5E36]/30">
                  Espace Recruteur Entreprise
                </span>
                <span className="text-gray-400 text-xs">• Session active</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                {user?.profile?.companyName || user?.name || 'Entreprise Recruteur'}
              </h1>
              <p className="text-gray-300 text-sm mt-0.5">
                Compte géré par {user?.name} ({user?.email})
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('post-job')}
              className="bg-gradient-to-r from-[#FF9F1C] to-[#FF5E36] hover:from-[#e88b14] hover:to-[#e54a22] text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-lg shadow-orange-500/20 hover:scale-105 transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publier une offre</span>
            </button>
            <button
              onClick={() => setActiveTab('candidates')}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/15 px-4 py-2.5 rounded-full text-xs font-semibold transition-all flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>Voir candidatures ({applications.length})</span>
            </button>
          </div>
        </div>

        {/* Recruiter Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 text-center sm:text-left">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <div className="text-gray-400 text-xs">Annonces actives</div>
            <div className="text-2xl font-black text-white mt-1">
              {recruiterJobs.filter(j => j.status === 'Actif').length}
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <div className="text-gray-400 text-xs">Candidatures reçues</div>
            <div className="text-2xl font-black text-[#FF9F1C] mt-1">{totalApplications}</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <div className="text-gray-400 text-xs">Vues d'annonces</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{totalViews}</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <div className="text-gray-400 text-xs">Taux de conversion</div>
            <div className="text-2xl font-black text-blue-400 mt-1">
              {totalViews > 0 ? `${Math.round((totalApplications / totalViews) * 100)}%` : '5%'}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-3 border-b border-gray-200 mb-8 pb-3">
        <button
          onClick={() => setActiveTab('manage-jobs')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'manage-jobs'
              ? 'bg-[#0B132B] text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Gérer mes annonces ({recruiterJobs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('candidates')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'candidates'
              ? 'bg-[#0B132B] text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Candidatures reçues ({applications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('post-job')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'post-job'
              ? 'bg-gradient-to-r from-[#FF9F1C] to-[#FF5E36] text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publier une offre</span>
        </button>
      </div>

      {/* ================= TAB 1: GÉRER LES ANNONCES ================= */}
      {activeTab === 'manage-jobs' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-[#0B132B]">Vos offres d'emploi diffusées</h2>
              <p className="text-gray-500 text-xs mt-0.5">
                Activez, mettez en pause ou modifiez le statut de vos annonces à tout moment.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('post-job')}
              className="hidden sm:flex items-center gap-2 bg-[#0B132B] text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-slate-800 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#FF9F1C]" />
              <span>Créer une annonce</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {recruiterJobs.map(job => (
              <div
                key={job.id}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      job.status === 'Actif'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {job.status === 'Actif' ? '● En ligne' : '❚❚ En pause'}
                    </span>
                    <span className="text-xs text-gray-400">Publié : {job.postedAt}</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0B132B]">{job.title}</h3>
                  
                  <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-gray-600">
                    <span className="bg-slate-100 px-2.5 py-1 rounded-lg">{job.contract}</span>
                    <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg">{job.workplace}</span>
                    <span className="flex items-center gap-1 text-gray-500"><MapPin className="w-3 h-3 text-gray-400" /> {job.location}</span>
                    <span className="text-[#0B132B] font-bold">💰 {job.salary}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.tags.map(t => (
                      <span key={t} className="text-[11px] bg-gray-50 text-gray-600 px-2.5 py-0.5 rounded-md">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 justify-between md:justify-end">
                  {/* Views & Applications metrics */}
                  <div className="text-right text-xs pr-4 border-r border-gray-100 hidden sm:block">
                    <div className="text-gray-400">Candidatures</div>
                    <div className="font-bold text-[#FF5E36] text-base">{job.applicationsCount}</div>
                  </div>

                  <button
                    onClick={() => toggleJobStatus(job.id)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      job.status === 'Actif'
                        ? 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        : 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                    }`}
                    title={job.status === 'Actif' ? 'Mettre en pause' : 'Réactiver l\'annonce'}
                  >
                    {job.status === 'Actif' ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>Mettre en pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Réactiver</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      deleteRecruiterJob(job.id);
                      showToast(`Annonce "${job.title}" supprimée.`);
                    }}
                    className="p-2.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Supprimer l'annonce"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 2: VOIR LES CANDIDATURES REÇUES & CONTACTER ================= */}
      {activeTab === 'candidates' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-[#0B132B]">Candidatures reçues</h2>
              <p className="text-gray-500 text-xs mt-0.5">
                Consultez les profils des candidats ayant postulé et contactez-les directement.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {applications.map(app => (
              <div
                key={app.id}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#FF9F1C] to-[#FF5E36] text-white flex items-center justify-center font-bold text-sm">
                      {app.candidateName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#0B132B]">{app.candidateName}</h3>
                      <p className="text-gray-500 text-xs">
                        Poste visé : <strong className="text-gray-700">{app.jobTitle}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                    <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-gray-400" /> {app.candidateEmail}</span>
                    {app.candidatePhone && (
                      <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-gray-400" /> {app.candidatePhone}</span>
                    )}
                    <span className="flex items-center gap-1 text-[#FF5E36] font-semibold">
                      <FileText className="w-3.5 h-3.5" /> {app.cvFileName}
                    </span>
                  </div>

                  {app.coverNote && (
                    <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100 italic">
                      « {app.coverNote} »
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                  <button
                    onClick={() => setContactingCandidate(app)}
                    className="bg-[#0B132B] hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-[#FF9F1C]" />
                    <span>Contacter le candidat</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 3: PUBLIER UNE NOUVELLE OFFRE ================= */}
      {activeTab === 'post-job' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm max-w-3xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#0B132B]">Publier une offre d'emploi</h2>
            <p className="text-gray-500 text-xs mt-0.5">
              Remplissez les détails pour diffuser immédiatement votre opportunité auprès de milliers de candidats.
            </p>
          </div>

          <form onSubmit={handlePostJob} className="space-y-4 text-xs">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Intitulé du poste *</label>
                <input
                  type="text"
                  required
                  value={newJob.title}
                  onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                  placeholder="Ex: Senior Cloud DevOps Engineer"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#FF9F1C]"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Nom de l'entreprise *</label>
                <input
                  type="text"
                  required
                  value={newJob.company}
                  onChange={(e) => setNewJob({...newJob, company: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#FF9F1C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Secteur *</label>
                <select
                  value={newJob.category}
                  onChange={(e) => setNewJob({...newJob, category: e.target.value as any})}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#FF9F1C] bg-white"
                >
                  <option value="Tech & IT">Tech & IT</option>
                  <option value="Marketing & Com">Marketing & Com</option>
                  <option value="Vente & Business">Vente & Business</option>
                  <option value="Ingénierie & R&D">Ingénierie & R&D</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Type de contrat *</label>
                <select
                  value={newJob.contract}
                  onChange={(e) => setNewJob({...newJob, contract: e.target.value as any})}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#FF9F1C] bg-white"
                >
                  <option value="CDI">CDI</option>
                  <option value="CDD">CDD</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Stage">Stage</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Modalité de travail *</label>
                <select
                  value={newJob.workplace}
                  onChange={(e) => setNewJob({...newJob, workplace: e.target.value as any})}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#FF9F1C] bg-white"
                >
                  <option value="Remote">Télétravail (Remote)</option>
                  <option value="Hybride">Hybride</option>
                  <option value="Présentiel">Présentiel</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Localisation *</label>
                <input
                  type="text"
                  required
                  value={newJob.location}
                  onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                  placeholder="Ex: Casablanca ou Paris"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#FF9F1C]"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Fourchette de rémunération *</label>
                <input
                  type="text"
                  required
                  value={newJob.salary}
                  onChange={(e) => setNewJob({...newJob, salary: e.target.value})}
                  placeholder="Ex: 35 000 - 45 000 MAD / mois"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#FF9F1C]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Mots-clés / Compétences requises (séparés par des virgules)</label>
              <input
                type="text"
                value={newJob.tags}
                onChange={(e) => setNewJob({...newJob, tags: e.target.value})}
                placeholder="Ex: React, Node.js, AWS, Kubernetes"
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#FF9F1C]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Description complète du poste *</label>
              <textarea
                rows={4}
                required
                value={newJob.description}
                onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                placeholder="Décrivez les objectifs clés, les responsabilités et l'équipe..."
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#FF9F1C] resize-none"
              />
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="bg-gradient-to-r from-[#FF9F1C] to-[#FF5E36] hover:from-[#e88b14] hover:to-[#e54a22] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-orange-500/20 transition-all text-xs"
              >
                Diffuser l'offre en ligne
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('manage-jobs')}
                className="text-gray-500 hover:text-gray-800 font-semibold px-4 py-3"
              >
                Annuler
              </button>
            </div>

          </form>
        </div>
      )}

      {/* ================= MODAL: CONTACTER UN CANDIDAT ================= */}
      {contactingCandidate && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl p-6 md:p-8 relative border border-gray-100">
            <button
              onClick={() => setContactingCandidate(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6 pr-8">
              <span className="text-xs font-bold text-[#FF5E36] uppercase tracking-wider">Messagerie Candidat</span>
              <h3 className="text-xl font-bold text-[#0B132B] mt-1">
                Contacter {contactingCandidate.candidateName}
              </h3>
              <p className="text-gray-500 text-xs">
                Pour le poste : <strong>{contactingCandidate.jobTitle}</strong>
              </p>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Destinataire</label>
                <input
                  type="text"
                  disabled
                  value={`${contactingCandidate.candidateName} <${contactingCandidate.candidateEmail}>`}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3.5 py-2 text-gray-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Objet</label>
                <input
                  type="text"
                  required
                  defaultValue={`Invitation à un entretien — ${contactingCandidate.jobTitle}`}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#FF9F1C]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Votre message / Proposition de créneau *</label>
                <textarea
                  rows={4}
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Bonjour, votre profil a retenu toute notre attention pour ce poste. Seriez-vous disponible pour un premier échange en visioconférence cette semaine ?..."
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#FF9F1C] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0B132B] hover:bg-slate-900 text-white py-3 rounded-full font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 text-[#FF9F1C]" />
                <span>Envoyer l'invitation</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
