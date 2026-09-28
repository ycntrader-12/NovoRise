import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Search, 
  MapPin, 
  Briefcase, 
  Code, 
  Megaphone, 
  Cpu, 
  ArrowRight, 
  Upload, 
  PlusCircle, 
  Menu, 
  X, 
  Bookmark, 
  BookmarkCheck, 
  Clock, 
  Building2, 
  CheckCircle2, 
  Filter, 
  Sparkles, 
  Share2, 
  FileText, 
  Send, 
  Eye, 
  Linkedin, 
  Twitter, 
  Github, 
  Globe, 
  ChevronRight,
  UserCheck,
  LogOut,
  LayoutDashboard,
  Check,
  ChevronDown,
  User,
  Mail,
  Phone,
  Loader2,
  Sun,
  Moon
} from 'lucide-react';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { AuthFlowModal } from './src/components/auth/AuthFlowModal';
import { CandidateDashboard } from './src/components/dashboard/CandidateDashboard';
import { RecruiterDashboard } from './src/components/dashboard/RecruiterDashboard';
import { VerifyEmailPage } from './src/components/auth/VerifyEmailPage';
import { GoogleCallbackPage } from './src/components/auth/GoogleCallbackPage';
import { JOB_CATEGORIES, FEATURED_CATEGORIES, CATEGORY_GROUPS, type JobCategory } from './src/types/categories';
import { apiGenerateCoverLetter } from './src/api/ai.api';
import { apiGetJobs } from './src/api/jobs.api';
import { apiPost } from './src/api/client';

// Job Type
export interface Job {
  id: string;
  title: string;
  company: string;
  logoBg: string;
  logoText: string;
  category: JobCategory;
  contract: 'CDI' | 'CDD' | 'Freelance' | 'Stage';
  workplace: 'Remote' | 'Hybride' | 'Présentiel';
  location: string;
  salary: string;
  postedTime: string;
  featured?: boolean;
  isNew?: boolean;
  tags: string[];
  description: string;
  missions: string[];
  requirements: string[];
  benefits: string[];
}

// Initial Job Catalog Data
const INITIAL_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Lead Développeur Full Stack (React / Node.js)',
    company: 'TechNova Solutions',
    logoBg: 'bg-gradient-to-tr from-blue-600 to-indigo-600',
    logoText: 'TN',
    category: 'Informatique & Numérique',
    contract: 'CDI',
    workplace: 'Remote',
    location: 'Casablanca (Remote possible)',
    salary: '35 000 - 45 000 MAD / mois',
    postedTime: 'Il y a 2h',
    featured: true,
    isNew: true,
    tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    description: 'Nous recherchons un Lead Développeur Full Stack passionné pour concevoir et faire évoluer notre plateforme SaaS de nouvelle génération.',
    missions: [
      'Concevoir l’architecture frontend et backend de nos solutions SaaS',
      'Encadrer et mentorer une équipe de 5 développeurs juniors et intermédiaires',
      'Assurer la performance, la sécurité et l’évolutivité des applications',
      'Collaborer étroitement avec l’équipe Produit et Design'
    ],
    requirements: [
      '5+ années d’expérience sur React et Node.js / TypeScript',
      'Excellente maîtrise des architectures cloud (AWS ou GCP) et microservices',
      'Expérience confirmée en mentoring technique et revues de code',
      'Bonne communication et esprit d’équipe'
    ],
    benefits: ['Full remote flexible', 'Prime annuelle sur objectifs', 'Assurance santé premium', 'Budget formation & conférences']
  },
  {
    id: 'job-2',
    title: 'Senior Product Designer UI/UX',
    company: 'Pulse Creative Studio',
    logoBg: 'bg-gradient-to-tr from-purple-600 to-pink-600',
    logoText: 'PC',
    category: 'Design & Architecture',
    contract: 'CDI',
    workplace: 'Hybride',
    location: 'Rabat',
    salary: '25 000 - 32 000 MAD / mois',
    postedTime: 'Il y a 4h',
    featured: true,
    isNew: true,
    tags: ['Figma', 'Design System', 'User Research', 'Prototypage'],
    description: 'Créez des expériences utilisateur captivantes pour des millions d’utilisateurs au sein d’une agence en hyper-croissance.',
    missions: [
      'Diriger la recherche utilisateur et les tests d’utilisabilité',
      'Faire évoluer le Design System multi-plateformes',
      'Concevoir des interfaces esthétiques, fluides et accessibles',
      'Travailler en synergie avec les développeurs front-end'
    ],
    requirements: [
      'Minimum 4 ans en tant que Product Designer ou UI/UX Designer',
      'Portfolio démontrant des projets web & mobile complexes',
      'Expertise avancée de Figma et des outils de prototypage interactif',
      'Sens aigu du détail visuel et de la micro-interaction'
    ],
    benefits: ['Télétravail 3j/semaine', 'Matériel Apple dernière génération', 'Plan d’actionnariat salarié', 'Séminaire annuel']
  },
  {
    id: 'job-3',
    title: 'Growth Marketing Manager',
    company: 'ScaleUp Media',
    logoBg: 'bg-gradient-to-tr from-orange-500 to-amber-500',
    logoText: 'SM',
    category: 'Marketing & Communication',
    contract: 'CDI',
    workplace: 'Hybride',
    location: 'Casablanca',
    salary: '22 000 - 28 000 MAD / mois',
    postedTime: 'Il y a 1j',
    featured: false,
    isNew: false,
    tags: ['SEO/SEA', 'Growth Hacking', 'Google Ads', 'Analytics', 'HubSpot'],
    description: 'Prenez en main la stratégie d’acquisition et d’optimisation du tunnel de conversion pour accélérer notre expansion.',
    missions: [
      'Gérer et optimiser des campagnes publicitaires payantes (Google, Meta, LinkedIn)',
      'Développer la stratégie SEO et d’inbound marketing',
      'Analyser les métriques de conversion et mettre en place des tests A/B',
      'Automatiser les flux d’e-mailing et de lead nurturing'
    ],
    requirements: [
      '3+ années d’expérience réussie en Growth ou Acquisition B2B',
      'Maîtrise de Google Analytics 4, Tag Manager et des plateformes publicitaires',
      'Esprit analytique orienté ROI et expérimentation rapide',
      'Excellente plume et maîtrise du français et de l’anglais'
    ],
    benefits: ['Bonus sur performance', 'Horaires flexibles', 'Abonnement salle de sport', 'Formations certifiantes']
  },
  {
    id: 'job-4',
    title: 'Data Scientist & AI Engineer',
    company: 'Nexus Intelligence',
    logoBg: 'bg-gradient-to-tr from-emerald-500 to-teal-600',
    logoText: 'NI',
    category: 'Informatique & Numérique',
    contract: 'CDI',
    workplace: 'Remote',
    location: 'Remote',
    salary: '32 000 - 42 000 MAD / mois',
    postedTime: 'Il y a 1j',
    featured: true,
    isNew: true,
    tags: ['Python', 'LLM', 'Machine Learning', 'PyTorch', 'BigQuery'],
    description: 'Implémentez des modèles d’apprentissage profond et des solutions basées sur les LLM pour transformer des données massives en leviers business.',
    missions: [
      'Développer et déployer des modèles ML/DL en production',
      'Intégrer et fine-tuner des LLM pour des cas d’usage métier',
      'Créer des pipelines de données automatisés et robustes',
      'Présenter des insights actionnables aux parties prenantes'
    ],
    requirements: [
      'Diplôme d’ingénieur ou Master en Data Science / Intelligence Artificielle',
      'Solide expérience en Python, PyTorch/TensorFlow et Scikit-learn',
      'Expérience pratique avec les APIs d’IA générative et RAG',
      'Capacité à vulgariser les résultats techniques'
    ],
    benefits: ['100% télétravail', 'Équipement de calcul GPU cloud dédié', 'Couverture santé internationale', 'RTT avantageux']
  },
  {
    id: 'job-5',
    title: 'Key Account Executive B2B',
    company: 'OmniSales Global',
    logoBg: 'bg-gradient-to-tr from-blue-500 to-cyan-500',
    logoText: 'OS',
    category: 'Commerce & Vente',
    contract: 'CDI',
    workplace: 'Présentiel',
    location: 'Casablanca',
    salary: '20 000 - 30 000 MAD + Commissions',
    postedTime: 'Il y a 2j',
    featured: false,
    isNew: false,
    tags: ['Négociation B2B', 'CRM', 'Prospection', 'Key Accounts'],
    description: 'Développez notre portefeuille de grands comptes institutionnels et privés à forte valeur ajoutée.',
    missions: [
      'Identifier et prospecter les décideurs de grandes entreprises',
      'Mener les négociations commerciales de bout en bout',
      'Construire des relations de partenariat durables',
      'Participer aux salons et événements professionnels'
    ],
    requirements: [
      'Expérience confirmée de 3 à 5 ans dans la vente de solutions complexes B2B',
      'Aisance relationnelle irréprochable et pouvoir de persuasion',
      'Réseau actif dans le secteur tertiaire ou industriel',
      'Permis de conduire exigé'
    ],
    benefits: ['Commissions déplafonnées attractives', 'Véhicule de fonction', 'Téléphone et ordinateur portable', 'Assurance groupe']
  },
  {
    id: 'job-6',
    title: 'DevOps & Cloud Architect (AWS / Kubernetes)',
    company: 'CloudWave Solutions',
    logoBg: 'bg-gradient-to-tr from-indigo-600 to-violet-700',
    logoText: 'CW',
    category: 'Informatique & Numérique',
    contract: 'Freelance',
    workplace: 'Remote',
    location: 'Remote',
    salary: '4 000 - 5 500 MAD / jour',
    postedTime: 'Il y a 3j',
    featured: true,
    isNew: false,
    tags: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD', 'Docker'],
    description: 'Modernisez l’infrastructure cloud de nos clients vers une architecture conteneurisée hautement résiliente.',
    missions: [
      'Automatiser le provisionnement d’infrastructure via Terraform (IaC)',
      'Orchestrer et administrer des clusters Kubernetes de production',
      'Optimiser les coûts cloud et renforcer la sécurité DevSecOps',
      'Mettre en place des pipelines CI/CD zero-downtime'
    ],
    requirements: [
      'Certification AWS Solutions Architect ou CKA (Kubernetes) appréciée',
      'Minimum 4 ans sur des environnements de production à fort trafic',
      'Rigueur exemplaire en observabilité (Prometheus, Grafana, Datadog)',
      'Autonomie et sens du service'
    ],
    benefits: ['Mission longue durée (12 mois renouvelable)', 'Facturation rapide', 'Environnement technique moderne', 'Flexibilité horaire']
  },
  {
    id: 'job-7',
    title: 'Ingénieur Systèmes Embarqués & IoT',
    company: 'InnovaTech Systems',
    logoBg: 'bg-gradient-to-tr from-purple-700 to-indigo-800',
    logoText: 'IT',
    category: 'Génie Électrique & Électronique',
    contract: 'CDI',
    workplace: 'Présentiel',
    location: 'Tanger',
    salary: '24 000 - 32 000 MAD / mois',
    postedTime: 'Il y a 4j',
    featured: false,
    isNew: false,
    tags: ['C/C++', 'RTOS', 'Microcontrôleurs', 'BLE', 'MQTT'],
    description: 'Rejoignez notre pôle R&D pour concevoir les objets connectés et capteurs intelligents pour l’industrie 4.0.',
    missions: [
      'Programmer des firmwares en C/C++ sur microcontrôleurs ARM Cortex',
      'Développer les protocoles de communication basse consommation (BLE, LoRa)',
      'Tester et valider les prototypes en laboratoire',
      'Collaborer avec les ingénieurs hardware sur le routage PCB'
    ],
    requirements: [
      'Diplôme d’Ingénieur en Électronique, Systèmes Embarqués ou Mécatronique',
      'Maîtrise de FreeRTOS et des bus de communication (I2C, SPI, CAN)',
      'Expérience avec les outils de mesure (oscilloscope, analyseur logique)',
      'Passion pour l’innovation technologique'
    ],
    benefits: ['Prime d’installation à Tanger', 'Participation aux brevets R&D', 'Restaurant d’entreprise', 'Plan de retraite complémentaire']
  },
  {
    id: 'job-8',
    title: 'Stage Développeur Front-End (React / Next.js)',
    company: 'NovoRise Studio',
    logoBg: 'bg-gradient-to-tr from-[#FF9F1C] to-[#FF5E36]',
    logoText: 'NR',
    category: 'Informatique & Numérique',
    contract: 'Stage',
    workplace: 'Hybride',
    location: 'Casablanca',
    salary: '5 000 - 7 500 MAD / mois',
    postedTime: 'Il y a 3h',
    featured: true,
    isNew: true,
    tags: ['React', 'Next.js', 'Tailwind CSS', 'Git', 'UI/UX'],
    description: 'Stage de pré-embauche tremplin pour un(e) futur(e) talent front-end souhaitant monter en compétences sur des technologies web de pointe.',
    missions: [
      'Participer à l’intégration de maquettes Figma pixel-perfect',
      'Développer des composants UI réutilisables et accessibles',
      'Optimiser la performance et le SEO technique des interfaces',
      'Collaborer en méthode Agile Scrum'
    ],
    requirements: [
      'Étudiant en dernière année d’école d’ingénieur ou université informatique',
      'Bases solides en JavaScript/TypeScript, React et CSS moderne',
      'Sensibilité graphique et curiosité technique',
      'Motivation pour une embauche en CDI à l’issue du stage'
    ],
    benefits: ['Opportunité concrète de pré-embauche CDI', 'Mentoring quotidien dédié', 'Tickets restaurant', 'Ambiance startup stimulante']
  }
];

// Convertir une offre backend en format Job affichable
const mapBackendJobToJob = (backendJob: any): Job => ({
  id: String(backendJob.id),
  title: backendJob.title || 'Opportunité Professionnelle',
  company: backendJob.company || 'Entreprise Partenaire',
  logoBg: 'bg-gradient-to-tr from-blue-600 to-indigo-600',
  logoText: (backendJob.company || 'NR').substring(0, 2).toUpperCase(),
  category: (backendJob.category || 'Informatique & Numérique') as JobCategory,
  contract: (backendJob.contract || 'CDI') as any,
  workplace: (backendJob.workplace || 'Remote') as any,
  location: backendJob.location || 'Casablanca',
  salary: backendJob.salary || 'Selon profil',
  postedTime: backendJob.postedAt || 'Récemment',
  featured: true,
  isNew: true,
  tags: Array.isArray(backendJob.tags) ? backendJob.tags : (typeof backendJob.tags === 'string' ? JSON.parse(backendJob.tags || '[]') : []),
  description: backendJob.description || '',
  missions: [
    'Piloter et délivrer les missions clés du poste avec rigueur et autonomie',
    'Collaborer étroitement avec les équipes pluridisciplinaires',
    'Participer activement à la performance collective'
  ],
  requirements: [
    'Expérience probante dans le domaine concerné',
    'Excellentes qualités relationnelles et rigueur opérationnelle'
  ],
  benefits: ['Package salarial attractif', 'Couverture santé complète', 'Possibilités d\'évolution rapide']
});

function NovoRiseMain() {
  const { 
    user, 
    isAuthenticated, 
    activeView, 
    setActiveView, 
    setAuthModalOpen, 
    setAuthModalStep,
    logout,
    submitApplication,
    recruiterJobs
  } = useAuth();

  // Dynamic jobs synced from backend
  const [allJobs, setAllJobs] = useState<Job[]>(INITIAL_JOBS);
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);

  React.useEffect(() => {
    let active = true;
    apiGetJobs()
      .then(fetchedJobs => {
        if (!active || !Array.isArray(fetchedJobs) || fetchedJobs.length === 0) return;
        const converted = fetchedJobs.map(mapBackendJobToJob);
        setAllJobs(prev => {
          const map = new Map<string, Job>();
          converted.forEach(j => map.set(j.id, j));
          prev.forEach(j => {
            if (!map.has(j.id)) map.set(j.id, j);
          });
          return Array.from(map.values());
        });
      })
      .catch(() => {});

    return () => { active = false; };
  }, [recruiterJobs]);

  // Navigation & Modals
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applyJob, setApplyJob] = useState<Job | null>(null);

  // Search & Filter State
  const [searchKeyword, setSearchKeyword] = useState('');
  const [locationKeyword, setLocationKeyword] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Tous');
  const [activeContract, setActiveContract] = useState<string>('Tous');
  const [activeWorkplace, setActiveWorkplace] = useState<string>('Tous');

  // Bookmarks
  const [savedJobs, setSavedJobs] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('novorise_saved_jobs');
      return raw ? JSON.parse(raw) : ['job-1'];
    } catch (_) {
      return ['job-1'];
    }
  });
  const [showOnlySaved, setShowOnlySaved] = useState(false);

  // Dark mode theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('novorise_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('novorise_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('novorise_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Contact Modal State
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    nom: '', prenom: '', email: '', telephone: '', sujet: '', message: ''
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactLoading(true);
    setContactError(null);
    try {
      await apiPost('/contact', contactForm);
      showToast('Votre message a bien été envoyé aux administrateurs !');
      setShowContactModal(false);
      setContactForm({ nom: '', prenom: '', email: '', telephone: '', sujet: '', message: '' });
    } catch (err: any) {
      setContactError(err.message || 'Erreur lors de l\'envoi du message');
    } finally {
      setContactLoading(false);
    }
  };

  // Application form
  const [applyForm, setApplyForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    note: '',
    fileName: '',
    coverLetterFileName: ''
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleGenerateAICoverLetter = async () => {
    if (!applyJob) return;
    setIsGeneratingCoverLetter(true);
    try {
      const res = await apiGenerateCoverLetter({
        jobTitle: applyJob.title,
        company: applyJob.company,
        candidateSkills: user?.profile?.skills?.join(', ') || 'Rigueur, dynamisme et autonomie',
        candidateBio: user?.profile?.bio || `Candidat motivé postulant au poste de ${applyJob.title}`,
      });
      setApplyForm(prev => ({ ...prev, note: res.coverLetter }));
      showToast('Lettre de motivation personnalisée générée par l\'IA Gemini ! ✨');
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la génération avec l\'IA.');
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };

  // Toggle Bookmark
  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (savedJobs.includes(id)) {
      const updated = savedJobs.filter(j => j !== id);
      setSavedJobs(updated);
      try { localStorage.setItem('novorise_saved_jobs', JSON.stringify(updated)); } catch (_) {}
      showToast('Offre retirée de vos favoris.');
    } else {
      const updated = [...savedJobs, id];
      setSavedJobs(updated);
      try { localStorage.setItem('novorise_saved_jobs', JSON.stringify(updated)); } catch (_) {}
      showToast('Offre ajoutée à vos favoris ⭐');
    }
  };

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return allJobs.filter(job => {
      if (showOnlySaved && !savedJobs.includes(job.id)) return false;
      if (activeCategory !== 'Tous' && job.category !== activeCategory) return false;
      if (activeContract !== 'Tous' && job.contract !== activeContract) return false;
      if (activeWorkplace !== 'Tous' && job.workplace !== activeWorkplace) return false;

      if (searchKeyword.trim()) {
        const q = searchKeyword.toLowerCase();
        const matchTitle = job.title.toLowerCase().includes(q);
        const matchCompany = job.company.toLowerCase().includes(q);
        const matchTags = job.tags.some(t => t.toLowerCase().includes(q));
        const matchDesc = job.description.toLowerCase().includes(q);
        if (!matchTitle && !matchCompany && !matchTags && !matchDesc) return false;
      }

      if (locationKeyword.trim()) {
        const lq = locationKeyword.toLowerCase();
        const matchLoc = job.location.toLowerCase().includes(lq);
        const matchWp = job.workplace.toLowerCase().includes(lq);
        if (!matchLoc && !matchWp) return false;
      }

      return true;
    });
  }, [allJobs, searchKeyword, locationKeyword, activeCategory, activeContract, activeWorkplace, showOnlySaved, savedJobs]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (activeView !== 'home') setActiveView('home');
    const el = document.getElementById('offres-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTagClick = (tag: string) => {
    if (activeView !== 'home') setActiveView('home');
    if (tag.toLowerCase() === 'remote') {
      setActiveWorkplace('Remote');
      setSearchKeyword('');
    } else if (tag.toLowerCase() === 'casablanca') {
      setLocationKeyword('Casablanca');
      setSearchKeyword('');
    } else {
      setSearchKeyword(tag);
    }
    const el = document.getElementById('offres-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const resetFilters = () => {
    setSearchKeyword('');
    setLocationKeyword('');
    setActiveCategory('Tous');
    setActiveContract('Tous');
    setActiveWorkplace('Tous');
    setShowOnlySaved(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B1120] font-sans text-slate-800 dark:text-slate-100 transition-colors duration-300 relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] bg-[#0B132B] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-gray-400 hover:text-white ml-2 text-xs"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Auth Modal with all architecture steps */}
      <AuthFlowModal />

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#F8F7F5]/90 dark:bg-[#0B1120]/90 backdrop-blur-md border-b border-gray-200/60 dark:border-slate-800/80 w-full transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div 
              onClick={() => { 
                setActiveView('home'); 
                resetFilters(); 
                window.scrollTo({ top: 0, behavior: 'smooth' }); 
              }}
              className="flex items-center gap-2 cursor-pointer select-none group"
            >
              <div className="bg-[#2D6BE4] dark:bg-gradient-to-tr dark:from-cyan-500 dark:to-indigo-500 p-1.5 rounded-lg text-white shadow-sm group-hover:scale-105 transition-transform dark:shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                <TrendingUp className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold text-[#1A1A2E] dark:text-white tracking-tight">
                Novo<span className="text-[#2D6BE4] dark:text-cyan-400">Rise</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6 items-center">
              <button 
                onClick={() => {
                  setActiveView('home');
                  const el = document.getElementById('offres-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }} 
                className={`font-medium text-sm transition-colors ${
                  activeView === 'home' ? 'text-[#2D6BE4] dark:text-cyan-400 font-bold' : 'text-[#1A1A2E] dark:text-slate-300 hover:text-[#2D6BE4] dark:hover:text-cyan-400'
                }`}
              >
                Trouver un emploi
              </button>

              <button 
                onClick={() => {
                  setActiveView('home');
                  const el = document.getElementById('categories-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }} 
                className="text-[#6B7280] dark:text-slate-400 hover:text-[#1A1A2E] dark:hover:text-white font-medium text-sm transition-colors"
              >
                Secteurs d'activité
              </button>

              {/* Role-based Dashboard link if authenticated */}
              {isAuthenticated && (
                <button
                  onClick={() => {
                    setActiveView(user?.role === 'recruteur' ? 'recruiter-dashboard' : 'candidate-dashboard');
                  }}
                  className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                    activeView === 'candidate-dashboard' || activeView === 'recruiter-dashboard'
                      ? 'bg-[#2D6BE4] text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-slate-800 text-[#1A1A2E] dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Mon Dashboard ({user?.role === 'recruteur' ? 'Recruteur' : 'Candidat'})</span>
                </button>
              )}

              {/* Saved items button */}
              <button 
                onClick={() => {
                  if (activeView !== 'home') setActiveView('home');
                  setShowOnlySaved(!showOnlySaved);
                  const el = document.getElementById('offres-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all border ${
                  showOnlySaved 
                    ? 'bg-[#2D6BE4] text-white border-[#2D6BE4]' 
                    : 'bg-white dark:bg-slate-900/60 text-[#6B7280] dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-[#1A1A2E] dark:hover:text-white'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Favoris ({savedJobs.length})</span>
              </button>
            </nav>

            {/* User Auth CTA / Profile Area + Theme Toggle */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleDarkMode}
                aria-label="Basculer le thème"
                title={isDarkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
                className="p-2 rounded-xl border border-gray-300/80 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 text-slate-700 dark:text-cyan-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-sm hover:shadow dark:shadow-[0_0_12px_rgba(6,182,212,0.25)] active:scale-95"
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-600" />
                )}
              </button>

              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div 
                    onClick={() => setActiveView(user?.role === 'recruteur' ? 'recruiter-dashboard' : 'candidate-dashboard')}
                    className="flex items-center gap-2.5 bg-gray-100 dark:bg-slate-900/80 hover:bg-gray-200/80 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-800 cursor-pointer transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#2D6BE4] text-white flex items-center justify-center font-bold text-xs">
                      {user?.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-[#1A1A2E] dark:text-white line-clamp-1">{user?.name}</div>
                      <div className="text-[10px] text-[#2D6BE4] dark:text-cyan-400 font-semibold uppercase">{user?.role}</div>
                    </div>
                  </div>

                  <button
                    onClick={logout}
                    className="p-2 text-[#6B7280] dark:text-slate-400 hover:text-[#1A1A2E] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    title="Déconnexion"
                    aria-label="Déconnexion"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => { setAuthModalStep('login'); setAuthModalOpen(true); }}
                    className="text-[#1A1A2E] dark:text-slate-200 font-medium text-sm px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  >
                    Connexion
                  </button>
                  <button 
                    onClick={() => { setAuthModalStep('register'); setAuthModalOpen(true); }}
                    className="bg-[#2D6BE4] text-white px-5 py-2 rounded-lg font-medium text-sm hover:bg-[#2D6BE4]/90 transition-colors shadow-sm cursor-pointer"
                  >
                    Inscription
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu button & Theme toggle */}
            <div className="md:hidden flex items-center gap-2">
              <button
                type="button"
                onClick={toggleDarkMode}
                aria-label="Basculer le thème"
                className="p-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-cyan-400"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-[#1A1A2E] dark:text-white hover:text-[#2D6BE4] focus:outline-none p-1"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-[#0E172A] px-4 pt-2 pb-6 space-y-3 shadow-lg border-b border-gray-200 dark:border-slate-800 animate-fade-in text-slate-900 dark:text-white">
            <button 
              onClick={() => { setActiveView('home'); setIsMobileMenuOpen(false); }} 
              className="block w-full text-left px-3 py-2 text-[#1A1A2E] dark:text-white font-medium rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 text-xs"
            >
              Trouver un emploi
            </button>

            {isAuthenticated ? (
              <>
                <button 
                  onClick={() => { 
                    setActiveView(user?.role === 'recruteur' ? 'recruiter-dashboard' : 'candidate-dashboard'); 
                    setIsMobileMenuOpen(false); 
                  }} 
                  className="block w-full text-left px-3 py-2 text-[#2D6BE4] dark:text-cyan-400 font-bold rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 text-xs"
                >
                  Mon Dashboard ({user?.role})
                </button>
                <div className="pt-2 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center px-3">
                  <span className="text-[#6B7280] dark:text-slate-400 text-xs">{user?.email}</span>
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center gap-1">
                    <LogOut className="w-3.5 h-3.5" /> Déconnexion
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-2 flex flex-col gap-2">
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); setAuthModalStep('login'); setAuthModalOpen(true); }}
                  className="text-[#1A1A2E] dark:text-slate-200 font-medium px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-xs hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  Connexion
                </button>
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); setAuthModalStep('register'); setAuthModalOpen(true); }}
                  className="bg-[#2D6BE4] text-white px-4 py-2.5 rounded-lg font-medium text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-[#2D6BE4]/90"
                >
                  Inscription
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* ================= ACTIVE VIEW CONTENT ================= */}

      {/* 1. CANDIDATE DASHBOARD VIEW */}
      {activeView === 'candidate-dashboard' && (
        <CandidateDashboard onBrowseJobs={() => {
          setActiveView('home');
          setTimeout(() => {
            document.getElementById('offres-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }} />
      )}

      {/* 2. RECRUITER DASHBOARD VIEW */}
      {activeView === 'recruiter-dashboard' && (
        <RecruiterDashboard />
      )}

      {/* 3. HOME VIEW (LANDING & EXPLORE OFFERS) */}
      {activeView === 'home' && (
        <main>
          {/* HERO SECTION */}
          <section className="w-full py-16 md:py-24 px-4 flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A2E] dark:text-white mb-4 tracking-tight">
              Trouvez l'emploi qui <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-cyan-400 dark:via-sky-400 dark:to-indigo-400 bg-clip-text text-transparent">
                vous correspond.
              </span>
            </h1>
            <p className="text-lg text-[#6B7280] dark:text-slate-300 mb-10 max-w-2xl font-medium">
              Découvrez des milliers d'offres d'emploi dans les meilleures entreprises. 
              Votre prochaine opportunité vous attend.
            </p>

            {/* Prominent Search Bar (Effet Cyberpunk Glow en Dark Mode) */}
            <div className="w-full max-w-4xl relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-violet-500/20 blur-xl opacity-0 dark:opacity-100 transition-opacity pointer-events-none" />

              <form 
                onSubmit={handleSearchSubmit}
                className="relative w-full bg-white dark:bg-[#0E172A] rounded-2xl shadow-md dark:shadow-[0_0_25px_rgba(6,182,212,0.25)] p-2 flex flex-col md:flex-row items-center border border-gray-100 dark:border-cyan-500/40 transition-all"
              >
                <div className="flex items-center flex-1 w-full px-4 py-3 md:border-r border-gray-200 dark:border-slate-800">
                  <Search className="text-[#6B7280] dark:text-cyan-400 w-5 h-5 mr-3 flex-shrink-0" />
                  <input 
                    type="text" 
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="Intitulé de poste, mots-clés, entreprise..." 
                    className="w-full outline-none text-[#1A1A2E] dark:text-white bg-transparent placeholder-[#6B7280] dark:placeholder-slate-400 text-base"
                  />
                  {searchKeyword && (
                    <button 
                      type="button" 
                      onClick={() => setSearchKeyword('')} 
                      className="text-[#6B7280] dark:text-slate-400 hover:text-[#1A1A2E] dark:hover:text-white text-xs mr-2"
                    >
                      ✕
                    </button>
                  )}
                </div>
                
                <div className="flex items-center flex-1 w-full px-4 py-3 border-t md:border-t-0 border-gray-100 dark:border-slate-800">
                  <MapPin className="text-[#6B7280] dark:text-indigo-400 w-5 h-5 mr-3 flex-shrink-0" />
                  <input 
                    type="text" 
                    value={locationKeyword}
                    onChange={(e) => setLocationKeyword(e.target.value)}
                    placeholder="Ville ou code postal" 
                    className="w-full outline-none text-[#1A1A2E] dark:text-white bg-transparent placeholder-[#6B7280] dark:placeholder-slate-400 text-base"
                  />
                  {locationKeyword && (
                    <button 
                      type="button" 
                      onClick={() => setLocationKeyword('')} 
                      className="text-[#6B7280] dark:text-slate-400 hover:text-[#1A1A2E] dark:hover:text-white text-xs mr-2"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <button 
                  type="submit"
                  className="w-full md:w-auto bg-[#2D6BE4] hover:bg-[#2D6BE4]/90 dark:bg-gradient-to-r dark:from-indigo-600 dark:to-cyan-600 dark:shadow-[0_0_15px_rgba(99,102,241,0.5)] text-white px-8 py-3.5 rounded-xl font-semibold flex items-center justify-center transition-all mt-2 md:mt-0 flex-shrink-0 cursor-pointer shadow-sm active:scale-95"
                >
                  Rechercher
                </button>
              </form>
            </div>
            
            {/* Quick trending tags */}
            <div className="mt-8 flex flex-wrap justify-center items-center gap-2.5 text-sm">
              <span className="text-[#6B7280] dark:text-slate-300 font-medium text-xs">Tendances :</span>
              {['Développeur React', 'UI/UX Designer', 'Data Scientist', 'Casablanca', 'Remote'].map((tag) => (
                <button 
                  key={tag} 
                  type="button" 
                  onClick={() => handleTagClick(tag)}
                  className="bg-white dark:bg-slate-900/60 text-[#6B7280] dark:text-slate-300 hover:text-[#1A1A2E] dark:hover:text-white px-3.5 py-1 rounded-full cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 transition-all text-xs border border-gray-200/60 dark:border-slate-700/80 active:scale-95 shadow-sm dark:hover:border-cyan-500/50"
                >
                  {tag}
                </button>
              ))}
            </div>
          </section>

          {/* CATEGORIES SECTION */}
          <section id="categories-section" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-10">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2D6BE4] dark:text-cyan-400 uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#2D6BE4] dark:text-cyan-400" /> Métiers & Secteurs
                </div>
                <h2 className="text-3xl font-bold text-[#1A1A2E] dark:text-white">Opportunités recommandées</h2>
                <p className="text-[#6B7280] dark:text-slate-300 mt-2 font-medium">Explorez les secteurs qui recrutent le plus activement aujourd'hui.</p>
              </div>
              <button 
                onClick={() => {
                  setActiveCategory('Tous');
                  document.getElementById('offres-section')?.scrollIntoView({ behavior: 'smooth' });
                }} 
                className="hidden md:flex items-center text-[#2D6BE4] dark:text-cyan-400 font-semibold hover:underline transition-colors text-sm"
              >
                Voir toutes les offres <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>

            {/* Top 8 featured categories — cards cliquables */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {FEATURED_CATEGORIES.map(catLabel => {
                const meta = JOB_CATEGORIES.find(c => c.label === catLabel)!;
                return (
                  <div
                    key={catLabel}
                    onClick={() => {
                      setActiveCategory(catLabel);
                      document.getElementById('offres-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`bg-white dark:bg-[#0E172A] rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer border group ${
                      activeCategory === catLabel 
                        ? 'border-[#2D6BE4] dark:border-cyan-400 ring-2 ring-blue-400/20 dark:ring-cyan-400/20' 
                        : 'border-gray-100 dark:border-slate-800 hover:dark:border-cyan-500/40'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#F8F7F5] dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700 flex items-center justify-center mb-4 text-2xl group-hover:bg-[#2D6BE4]/10 transition-colors">
                      {meta.icon}
                    </div>
                    <h3 className="text-sm font-bold text-[#1A1A2E] dark:text-white mb-1 leading-tight group-hover:text-[#2D6BE4] dark:group-hover:text-cyan-400 transition-colors">{meta.label}</h3>
                    <p className="text-[#6B7280] dark:text-slate-400 text-xs mb-2">{meta.count.toLocaleString('fr-FR')} offres</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {meta.jobs.slice(0, 3).map(jobName => (
                        <span key={jobName} className="text-[10px] bg-[#F8F7F5] dark:bg-slate-800/80 text-[#6B7280] dark:text-slate-300 px-1.5 py-0.5 rounded border border-gray-100 dark:border-slate-700">
                          {jobName}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center text-xs font-semibold text-[#6B7280] dark:text-slate-400 group-hover:text-[#2D6BE4] dark:group-hover:text-cyan-400 transition-colors">
                      Explorer <ArrowRight className="ml-1 w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tous les secteurs — grille compacte groupée */}
            <div className="bg-white dark:bg-[#0E172A] rounded-2xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm">
              <p className="text-xs font-bold text-[#6B7280] dark:text-slate-400 uppercase tracking-wider mb-4">Tous les secteurs ({JOB_CATEGORIES.length})</p>
              {CATEGORY_GROUPS.map(group => {
                const cats = JOB_CATEGORIES.filter(c => c.group === group);
                return (
                  <div key={group} className="mb-4 last:mb-0">
                    <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">{group}</p>
                    <div className="flex flex-wrap gap-2">
                      {cats.map(cat => (
                        <button
                          key={cat.label}
                          onClick={() => {
                            setActiveCategory(cat.label);
                            document.getElementById('offres-section')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            activeCategory === cat.label
                              ? 'bg-[#1A1A2E] dark:bg-cyan-500 text-white dark:text-slate-950 shadow-sm font-bold'
                              : 'bg-[#F8F7F5] dark:bg-slate-800/60 border border-gray-200/60 dark:border-slate-700 text-[#6B7280] dark:text-slate-300 hover:border-[#2D6BE4] dark:hover:border-cyan-400 hover:text-[#2D6BE4] dark:hover:text-cyan-400'
                          }`}
                        >
                          <span>{cat.icon}</span>
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* JOB LISTINGS SECTION */}
          <section id="offres-section" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-[#1A1A2E] dark:text-white">Offres d'emploi ({filteredJobs.length})</h2>
                <p className="text-[#6B7280] dark:text-slate-400 text-sm mt-1 font-medium">
                  Découvrez nos opportunités sélectionnées selon vos critères
                </p>
              </div>

              {(searchKeyword || locationKeyword || activeCategory !== 'Tous' || activeContract !== 'Tous' || activeWorkplace !== 'Tous' || showOnlySaved) && (
                <button 
                  onClick={resetFilters}
                  className="self-start md:self-auto text-xs font-semibold text-[#2D6BE4] dark:text-cyan-400 hover:underline flex items-center gap-1 transition-colors"
                >
                  ✕ Réinitialiser les filtres
                </button>
              )}
            </div>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-[#0E172A] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 mb-8 space-y-4 transition-colors">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <span className="text-xs font-semibold text-[#6B7280] dark:text-slate-400 mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Secteur:
                </span>
                {/* Bouton Tous */}
                <button
                  onClick={() => setActiveCategory('Tous')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    activeCategory === 'Tous'
                      ? 'bg-[#1A1A2E] text-white shadow-sm dark:bg-cyan-500 dark:text-slate-950 font-bold'
                      : 'bg-[#F8F7F5] dark:bg-slate-800/80 text-[#6B7280] dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                  }`}
                >
                  Tous
                </button>

                {/* Dropdown groupé — tous les secteurs */}
                <div className="relative group">
                  <button
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      activeCategory !== 'Tous'
                        ? 'bg-[#2D6BE4] text-white shadow-sm dark:bg-cyan-500 dark:text-slate-950 font-bold'
                        : 'bg-[#F8F7F5] dark:bg-slate-800/80 text-[#6B7280] dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Filter className="w-3 h-3" />
                    {activeCategory !== 'Tous' ? activeCategory : 'Choisir un secteur'}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  <div className="absolute left-0 top-full mt-1 z-50 hidden group-hover:block w-[520px] bg-white dark:bg-[#0E172A] rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 p-4 max-h-[420px] overflow-y-auto">
                    {CATEGORY_GROUPS.map(group => {
                      const cats = JOB_CATEGORIES.filter(c => c.group === group);
                      return (
                        <div key={group} className="mb-3 last:mb-0">
                          <p className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-widest mb-1.5 px-1">{group}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {cats.map(cat => (
                              <button
                                key={cat.label}
                                onClick={() => setActiveCategory(cat.label)}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                                  activeCategory === cat.label
                                    ? 'bg-[#1A1A2E] text-white dark:bg-cyan-500 dark:text-slate-950 font-bold'
                                    : 'bg-[#F8F7F5] dark:bg-slate-800/60 text-[#6B7280] dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-cyan-500/10 hover:text-[#2D6BE4] dark:hover:text-cyan-400'
                                }`}
                              >
                                <span className="text-sm">{cat.icon}</span> {cat.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 dark:border-slate-800 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-[#6B7280] dark:text-slate-400">Contrat:</span>
                  {['Tous', 'CDI', 'CDD', 'Freelance', 'Stage'].map(contract => (
                    <button
                      key={contract}
                      onClick={() => setActiveContract(contract)}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        activeContract === contract 
                          ? 'bg-[#2D6BE4] dark:bg-cyan-500 dark:text-slate-950 text-white font-bold' 
                          : 'text-[#6B7280] dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {contract}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-[#6B7280] dark:text-slate-400">Modalité:</span>
                  {['Tous', 'Remote', 'Hybride', 'Présentiel'].map(wp => (
                    <button
                      key={wp}
                      onClick={() => setActiveWorkplace(wp)}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        activeWorkplace === wp 
                          ? 'bg-[#1A1A2E] dark:bg-cyan-500 dark:text-slate-950 text-white font-bold' 
                          : 'text-[#6B7280] dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {wp}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Jobs Cards Grid */}
            {filteredJobs.length === 0 ? (
              <div className="bg-white dark:bg-[#0E172A] rounded-2xl p-12 text-center border border-gray-100 dark:border-slate-800 shadow-sm max-w-lg mx-auto">
                <div className="w-16 h-16 bg-blue-50 dark:bg-cyan-950/40 text-[#2D6BE4] dark:text-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#1A1A2E] dark:text-white mb-2">Aucune offre trouvée</h3>
                <p className="text-[#6B7280] dark:text-slate-400 text-sm mb-6 font-medium">
                  Aucune offre ne correspond exactement à vos critères. Essayez d'élargir votre recherche.
                </p>
                <button 
                  onClick={resetFilters}
                  className="bg-[#2D6BE4] dark:bg-cyan-500 dark:text-slate-950 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#2D6BE4]/90 dark:hover:bg-cyan-400 transition-colors shadow-sm cursor-pointer"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredJobs.map(job => {
                  const isSaved = savedJobs.includes(job.id);
                  return (
                    <div 
                      key={job.id}
                      onClick={() => setSelectedJob(job)}
                      className="bg-white dark:bg-[#0E172A] p-6 rounded-2xl shadow-sm hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] border border-gray-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-cyan-500/40 transition-all group flex flex-col justify-between h-full cursor-pointer"
                    >
                      <div>
                        {/* Header: Logo, Title, Bookmark */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#F8F7F5] dark:bg-slate-800 border border-gray-100 dark:border-slate-700 flex items-center justify-center font-bold text-[#2D6BE4] dark:text-cyan-400 text-xl shrink-0">
                              {job.logoText}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-[#1A1A2E] dark:text-white group-hover:text-[#2D6BE4] dark:group-hover:text-cyan-400 transition-colors leading-tight line-clamp-1">
                                {job.title}
                              </h3>
                              <div className="flex items-center text-sm text-[#6B7280] dark:text-slate-400 mt-1 font-medium">
                                <Building2 className="w-4 h-4 mr-1.5 text-[#6B7280] dark:text-slate-400" />
                                {job.company}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={(e) => toggleBookmark(job.id, e)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isSaved ? 'text-[#2D6BE4] dark:text-cyan-400 bg-blue-50 dark:bg-cyan-950/40' : 'text-gray-300 dark:text-slate-600 hover:text-[#2D6BE4] dark:hover:text-cyan-400'
                            }`}
                            title={isSaved ? "Retirer des favoris" : "Enregistrer l'offre"}
                            aria-label="Enregistrer l'offre"
                          >
                            {isSaved ? <BookmarkCheck className="w-5 h-5 fill-current" /> : <Bookmark className="w-5 h-5" />}
                          </button>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#F8F7F5] dark:bg-slate-800/80 text-[#6B7280] dark:text-slate-300 border border-gray-100 dark:border-slate-700">
                            <MapPin className="w-3.5 h-3.5 mr-1 text-[#6B7280] dark:text-slate-400" />
                            {job.location} ({job.workplace})
                          </span>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#2D6BE4]/10 dark:bg-cyan-500/10 text-[#2D6BE4] dark:text-cyan-400">
                            <Briefcase className="w-3.5 h-3.5 mr-1" />
                            {job.contract}
                          </span>
                        </div>

                        <p className="text-[#6B7280] dark:text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed font-medium">
                          {job.description}
                        </p>
                      </div>

                      {/* Footer: Time and Action Button */}
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800">
                        <div className="flex items-center text-xs text-[#6B7280] dark:text-slate-400 font-medium">
                          <Clock className="w-4 h-4 mr-1.5 text-[#6B7280] dark:text-slate-400" />
                          {job.postedTime}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedJob(job); }}
                            className="px-3 py-1.5 text-xs font-semibold text-[#6B7280] dark:text-slate-400 hover:text-[#1A1A2E] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            Détails
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setApplyJob(job); }}
                            className="bg-[#16A34A] hover:bg-[#16A34A]/90 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center gap-1 cursor-pointer"
                          >
                            <span>Postuler</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* CANDIDATE & RECRUITER CTA SECTION */}
          <section id="solutions-section" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Carte 1 : Pour les candidats */}
              <div className="bg-gradient-to-br from-[#0B132B] via-[#162040] to-[#0B132B] rounded-3xl p-8 lg:p-10 relative overflow-hidden group shadow-xl border border-slate-700/50 flex flex-col justify-between transition-all hover:border-[#2D6BE4]/50">
                <div className="absolute right-0 top-0 w-64 h-64 bg-[#2D6BE4]/20 rounded-full blur-3xl pointer-events-none group-hover:bg-[#2D6BE4]/30 transition-all duration-500" />
                <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D6BE4]/20 text-[#60A5FA] text-xs font-bold uppercase tracking-wider border border-[#2D6BE4]/30 mb-4">
                    <UserCheck className="w-3.5 h-3.5 text-[#60A5FA]" /> Espace Candidats
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-black text-white mb-3 tracking-tight">
                    Pour les candidats
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6 font-medium max-w-md">
                    Faites-vous repérer directement par les meilleurs recruteurs. Déposez votre CV dans notre vivier de talents vérifiés.
                  </p>

                  <div className="space-y-2 mb-8">
                    <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                      <div className="w-4 h-4 rounded-full bg-[#2D6BE4]/30 text-[#60A5FA] flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>Candidature directe en 1 clic sans formulaire lourd</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                      <div className="w-4 h-4 rounded-full bg-[#2D6BE4]/30 text-[#60A5FA] flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>Suivi en temps réel de vos candidatures</span>
                    </div>
                  </div>
                </div>

                <div className="relative z-10">
                  <button 
                    onClick={() => {
                      if (isAuthenticated && user?.role === 'candidat') {
                        setActiveView('candidate-dashboard');
                      } else {
                        setAuthModalStep('register');
                        setAuthModalOpen(true);
                      }
                    }}
                    className="bg-[#2D6BE4] hover:bg-[#2563EB] text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2.5 transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-105 active:scale-95 text-xs sm:text-sm cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-white" /> 
                    <span>{isAuthenticated && user?.role === 'candidat' ? 'Accéder à mon espace CV' : 'Créer un profil Candidat'}</span>
                    <ArrowRight className="w-4 h-4 text-white/80 ml-1" />
                  </button>
                </div>
              </div>

              {/* Carte 2 : Pour les recruteurs */}
              <div className="bg-gradient-to-br from-[#0B132B] via-[#1A2548] to-[#0B132B] rounded-3xl p-8 lg:p-10 relative overflow-hidden group shadow-xl border border-slate-700/50 flex flex-col justify-between transition-all hover:border-[#2D6BE4]/50">
                <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/30 transition-all duration-500" />
                <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-[#2D6BE4]/15 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-[#60A5FA] text-xs font-bold uppercase tracking-wider border border-blue-500/30 mb-4">
                    <Building2 className="w-3.5 h-3.5 text-[#60A5FA]" /> Espace Entreprises
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-black text-white mb-3 tracking-tight">
                    Pour les recruteurs
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6 font-medium max-w-md">
                    Accédez à un vivier de talents qualifiés et diffusez vos offres d'emploi à la bonne audience en un clic.
                  </p>

                  <div className="space-y-2 mb-8">
                    <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                      <div className="w-4 h-4 rounded-full bg-indigo-500/30 text-[#60A5FA] flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>Diffusion instantanée et ciblage précis des profils</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                      <div className="w-4 h-4 rounded-full bg-indigo-500/30 text-[#60A5FA] flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>Gestion des candidatures et contact direct</span>
                    </div>
                  </div>
                </div>

                <div className="relative z-10">
                  <button 
                    onClick={() => {
                      if (isAuthenticated && user?.role === 'recruteur') {
                        setActiveView('recruiter-dashboard');
                      } else {
                        setAuthModalStep('register');
                        setAuthModalOpen(true);
                      }
                    }}
                    className="bg-white hover:bg-slate-100 text-[#0B132B] px-6 py-3.5 rounded-2xl font-extrabold flex items-center gap-2.5 transition-all shadow-lg shadow-white/10 hover:shadow-white/20 hover:scale-105 active:scale-95 text-xs sm:text-sm cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4 text-[#2D6BE4]" /> 
                    <span>{isAuthenticated && user?.role === 'recruteur' ? 'Accéder au Dashboard Recruteur' : 'Publier une annonce / Inscription'}</span>
                    <ArrowRight className="w-4 h-4 text-[#0B132B]/70 ml-1" />
                  </button>
                </div>
              </div>

            </div>
          </section>
        </main>
      )}

      {/* FOOTER */}
      <footer className="bg-white dark:bg-[#070D18] border-t border-gray-200/60 dark:border-slate-800/80 pt-16 pb-8 mt-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4 cursor-pointer" onClick={() => { setActiveView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                <div className="bg-[#2D6BE4] dark:bg-cyan-500 p-1.5 rounded-lg text-white dark:text-slate-950 shadow-sm">
                  <TrendingUp className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <span className="text-xl font-bold text-[#1A1A2E] dark:text-white tracking-tight">
                  Novo<span className="text-[#2D6BE4] dark:text-cyan-400">Rise</span>
                </span>
              </div>
              <p className="text-[#6B7280] dark:text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                Le point de rencontre entre les talents ambitieux et les entreprises innovantes. Votre prochaine opportunité commence ici.
              </p>
              
              <div className="flex items-center gap-3">
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-9 h-9 rounded-full bg-[#F8F7F5] dark:bg-slate-800 hover:bg-[#2D6BE4] dark:hover:bg-cyan-500 hover:text-white dark:hover:text-slate-950 text-[#6B7280] dark:text-slate-300 flex items-center justify-center transition-colors shadow-sm"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-9 h-9 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-[#FF9F1C] dark:hover:bg-cyan-500 hover:text-white dark:hover:text-slate-950 text-gray-600 dark:text-slate-300 flex items-center justify-center transition-colors shadow-sm"
                  aria-label="Twitter / X"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-9 h-9 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-[#FF9F1C] dark:hover:bg-cyan-500 hover:text-white dark:hover:text-slate-950 text-gray-600 dark:text-slate-300 flex items-center justify-center transition-colors shadow-sm"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); showToast('Site officiel NovoRise'); }}
                  className="w-9 h-9 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-[#FF9F1C] dark:hover:bg-cyan-500 hover:text-white dark:hover:text-slate-950 text-gray-600 dark:text-slate-300 flex items-center justify-center transition-colors shadow-sm"
                  aria-label="Site Web"
                >
                  <Globe className="w-4 h-4" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-[#0B132B] dark:text-white mb-4">Candidats</h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-slate-400">
                <li>
                  <button onClick={() => { setActiveView('home'); document.getElementById('offres-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-[#2D6BE4] dark:hover:text-cyan-400 transition-colors text-left">
                    Rechercher un emploi
                  </button>
                </li>
                <li>
                  <button onClick={() => { setAuthModalStep('register'); setAuthModalOpen(true); }} className="hover:text-[#2D6BE4] dark:hover:text-cyan-400 transition-colors text-left">
                    Créer un profil
                  </button>
                </li>
                <li>
                  <button onClick={() => {
                    if (isAuthenticated && user?.role === 'candidat') {
                      setActiveView('candidate-dashboard');
                    } else {
                      setAuthModalStep('register');
                      setAuthModalOpen(true);
                    }
                  }} className="hover:text-[#2D6BE4] dark:hover:text-cyan-400 transition-colors text-left">
                    Déposer son CV
                  </button>
                </li>
                <li>
                  <button onClick={() => showToast('Inscrivez-vous pour activer les alertes personnalisées')} className="hover:text-[#2D6BE4] dark:hover:text-cyan-400 transition-colors text-left">
                    Alertes emploi
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#0B132B] dark:text-white mb-4">Recruteurs</h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-slate-400">
                <li>
                  <button onClick={() => {
                    if (isAuthenticated && user?.role === 'recruteur') {
                      setActiveView('recruiter-dashboard');
                    } else {
                      setAuthModalStep('register');
                      setAuthModalOpen(true);
                    }
                  }} className="hover:text-[#2D6BE4] dark:hover:text-cyan-400 transition-colors text-left">
                    Publier une annonce
                  </button>
                </li>
                <li>
                  <button onClick={() => {
                    if (isAuthenticated && user?.role === 'recruteur') {
                      setActiveView('recruiter-dashboard');
                    } else {
                      setAuthModalStep('login');
                      setAuthModalOpen(true);
                    }
                  }} className="hover:text-[#2D6BE4] dark:hover:text-cyan-400 transition-colors text-left">
                    Accès CVthèque
                  </button>
                </li>
                <li>
                  <a href="#solutions-section" className="hover:text-[#2D6BE4] dark:hover:text-cyan-400 transition-colors">
                    Solutions Marque Employeur
                  </a>
                </li>
                <li>
                  <button onClick={() => showToast('Grille tarifaire : contactez contact@novorise.com')} className="hover:text-[#2D6BE4] dark:hover:text-cyan-400 transition-colors text-left">
                    Tarifs & Packs
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#0B132B] dark:text-white mb-4">NovoRise</h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-slate-400">
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); showToast('NovoRise — Plateforme RH & Recrutement'); }} className="hover:text-[#2D6BE4] dark:hover:text-cyan-400 transition-colors">
                    À propos
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); setShowContactModal(true); }} className="hover:text-[#2D6BE4] dark:hover:text-cyan-400 transition-colors">
                    Contactez-nous
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); showToast('Politique de confidentialité conforme RGPD & CNDP'); }} className="hover:text-[#2D6BE4] dark:hover:text-cyan-400 transition-colors">
                    Politique de confidentialité
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); showToast('Conditions Générales d\'Utilisation de NovoRise'); }} className="hover:text-[#2D6BE4] dark:hover:text-cyan-400 transition-colors">
                    CGU & Mentions Légales
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-100 dark:border-slate-800/80 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 dark:text-slate-500 text-sm">
              © {new Date().getFullYear()} NovoRise. Tous droits réservés. Plateforme moderne d'emploi et de recrutement.
            </p>
            <div className="flex items-center gap-6 text-xs text-gray-400 dark:text-slate-500">
              <span>Fait avec passion pour les talents de demain</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ================= MODAL: JOB DETAILS ================= */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-[#0B132B]/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-[#0E172A] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-slate-100 dark:border-slate-800 my-6 transition-colors">
            
            {/* Modal Top Header (NovoRise Theme) */}
            <div className="bg-gradient-to-r from-[#0B132B] via-[#1C2541] to-[#0B132B] text-white p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-64 bg-[#2D6BE4]/20 rounded-full blur-3xl pointer-events-none" />

              <button 
                onClick={() => setSelectedJob(null)}
                className="absolute top-5 right-5 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-20 cursor-pointer"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-4 pr-10 relative z-10">
                <div className={`w-14 h-14 rounded-2xl ${selectedJob.logoBg} text-white flex items-center justify-center font-extrabold text-lg flex-shrink-0 shadow-lg border-2 border-white/20`}>
                  {selectedJob.logoText}
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#2D6BE4]/20 text-[#60A5FA] text-[11px] font-bold uppercase tracking-wider border border-[#2D6BE4]/30 mb-1">
                    {selectedJob.category}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{selectedJob.title}</h3>
                  <p className="text-slate-300 font-medium text-xs sm:text-sm mt-0.5">{selectedJob.company} • {selectedJob.location}</p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" /> {selectedJob.contract}
                </span>
                <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-emerald-100 dark:border-emerald-800/40">
                  <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> {selectedJob.workplace}
                </span>
                <span className="bg-blue-50 dark:bg-cyan-950/40 text-[#2D6BE4] dark:text-cyan-400 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-blue-100 dark:border-cyan-800/40">
                  <Clock className="w-3.5 h-3.5 text-[#2D6BE4] dark:text-cyan-400" /> {selectedJob.postedTime}
                </span>
                <span className="bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-purple-100 dark:border-purple-800/40">
                  💰 {selectedJob.salary}
                </span>
              </div>

              <div className="space-y-6 text-sm text-gray-700 dark:text-slate-300 border-t border-b border-gray-100 dark:border-slate-800 py-6">
                <div>
                  <h4 className="font-extrabold text-[#0B132B] dark:text-white text-base mb-2">Description du poste</h4>
                  <p className="leading-relaxed text-gray-600 dark:text-slate-400 text-xs sm:text-sm">{selectedJob.description}</p>
                </div>

                {selectedJob.missions && selectedJob.missions.length > 0 && (
                  <div>
                    <h4 className="font-extrabold text-[#0B132B] dark:text-white text-base mb-2">Missions principales</h4>
                    <ul className="space-y-2">
                      {selectedJob.missions.map((mission, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-600 dark:text-slate-400">
                          <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span>{mission}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                  <div>
                    <h4 className="font-extrabold text-[#0B132B] dark:text-white text-base mb-2">Profil recherché</h4>
                    <ul className="space-y-2">
                      {selectedJob.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-600 dark:text-slate-400">
                          <Check className="w-4 h-4 text-[#2D6BE4] dark:text-cyan-400 mt-0.5 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedJob.benefits && selectedJob.benefits.length > 0 && (
                  <div>
                    <h4 className="font-extrabold text-[#0B132B] dark:text-white text-base mb-2">Avantages offerts</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedJob.benefits.map((b, idx) => (
                        <div key={idx} className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 border border-slate-100 dark:border-slate-700">
                          <Sparkles className="w-3.5 h-3.5 text-[#2D6BE4] dark:text-cyan-400" /> {b}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-4 mt-6">
                <button
                  onClick={() => toggleBookmark(selectedJob.id)}
                  className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-[#0B132B] dark:hover:text-white px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {savedJobs.includes(selectedJob.id) ? (
                    <>
                      <BookmarkCheck className="w-4 h-4 text-[#2D6BE4] dark:text-cyan-400" />
                      <span>Sauvegardée</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4" />
                      <span>Enregistrer</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    const jobToApply = selectedJob;
                    setSelectedJob(null);
                    setApplyJob(jobToApply);
                  }}
                  className="bg-[#2D6BE4] hover:bg-[#2563EB] dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 px-8 py-3.5 rounded-2xl font-extrabold text-xs sm:text-sm shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  Postuler maintenant
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ================= MODAL: APPLY TO JOB (CANDIDATURE DIRECTE) ================= */}
      {applyJob && (
        <div className="fixed inset-0 z-50 bg-[#0B132B]/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-[#0E172A] rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 relative my-4 max-h-[92vh] flex flex-col transition-colors">
            
            {/* Modal Top Header (NovoRise Blue Brand Theme) */}
            <div className="bg-gradient-to-r from-[#0B132B] via-[#1C2541] to-[#0B132B] text-white p-5 sm:p-6 relative overflow-hidden flex-shrink-0">
              <div className="absolute right-0 top-0 w-48 h-48 bg-[#2D6BE4]/20 rounded-full blur-2xl pointer-events-none" />
              
              <button 
                onClick={() => setApplyJob(null)}
                className="absolute top-4 right-4 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-20 cursor-pointer"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative z-10 pr-8">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#2D6BE4]/20 text-[#60A5FA] text-[11px] font-bold uppercase tracking-wider border border-[#2D6BE4]/30 mb-1.5">
                  <Sparkles className="w-3 h-3 text-[#60A5FA]" /> Candidature directe
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{applyJob.title}</h3>
                <p className="text-slate-300 text-xs sm:text-sm mt-0.5 font-medium">{applyJob.company} • {applyJob.location}</p>
              </div>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto">
              <form onSubmit={(e) => {
                e.preventDefault();
                submitApplication({
                  jobId: applyJob.id,
                  jobTitle: applyJob.title,
                  company: applyJob.company,
                  location: applyJob.location,
                  candidateName: applyForm.fullName || user?.name || 'Candidat',
                  candidateEmail: applyForm.email || user?.email || 'candidat@novorise.com',
                  candidatePhone: applyForm.phone,
                  cvFileName: applyForm.fileName || user?.profile?.cvFileName || 'CV_Candidat_NovoRise.pdf',
                  coverLetterFileName: applyForm.coverLetterFileName || user?.profile?.coverLetterFileName,
                  coverNote: applyForm.note
                });

                showToast(`Votre candidature pour ${applyJob.title} a bien été enregistrée et transmise ! 🎉`);
                setApplyJob(null);
              }} className="space-y-3.5 text-xs">
                
                {/* Row 1: Nom & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-[11px]">Nom complet *</label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input 
                        type="text" 
                        required 
                        defaultValue={user?.name || ''}
                        onChange={(e) => setApplyForm({...applyForm, fullName: e.target.value})}
                        placeholder="Ex: Sarah Alami"
                        className="w-full border border-slate-200 dark:border-slate-700 focus:border-[#2D6BE4] dark:focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 outline-none transition-all text-xs text-slate-800 dark:text-white bg-slate-50/50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-[#2D6BE4]/15"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-[11px]">Email *</label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input 
                        type="email" 
                        required 
                        defaultValue={user?.email || ''}
                        onChange={(e) => setApplyForm({...applyForm, email: e.target.value})}
                        placeholder="sarah@exemple.com"
                        className="w-full border border-slate-200 dark:border-slate-700 focus:border-[#2D6BE4] dark:focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 outline-none transition-all text-xs text-slate-800 dark:text-white bg-slate-50/50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-[#2D6BE4]/15"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Téléphone */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-[11px]">Téléphone *</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input 
                      type="tel" 
                      required 
                      value={applyForm.phone}
                      onChange={(e) => setApplyForm({...applyForm, phone: e.target.value})}
                      placeholder="+212 6..."
                      className="w-full border border-slate-200 dark:border-slate-700 focus:border-[#2D6BE4] dark:focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 outline-none transition-all text-xs text-slate-800 dark:text-white bg-slate-50/50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-[#2D6BE4]/15"
                    />
                  </div>
                </div>

                {/* Upload Documents (CV + Lettre de motivation - Tous Formats) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
                  {/* CV Upload */}
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-[11px]">CV (Tous formats) *</label>
                    <div className="border-2 border-dashed border-blue-200 dark:border-slate-700 hover:border-[#2D6BE4] dark:hover:border-cyan-400 bg-blue-50/30 dark:bg-slate-800/40 hover:bg-blue-50/60 dark:hover:bg-slate-800/70 rounded-2xl p-3 text-center transition-all cursor-pointer relative group">
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx,.odt,.rtf,.txt,.jpg,.jpeg,.png,.webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setApplyForm({...applyForm, fileName: file.name});
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-slate-700 text-[#2D6BE4] dark:text-cyan-400 flex items-center justify-center mx-auto mb-1 shadow-sm group-hover:scale-105 transition-transform">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                        {applyForm.fileName || user?.profile?.cvFileName 
                          ? `✓ ${applyForm.fileName || user?.profile?.cvFileName}` 
                          : 'Déposer votre CV'}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Format libre</span>
                    </div>
                  </div>

                  {/* Lettre de Motivation Upload */}
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-[11px]">Lettre de Motivation (Optionnel)</label>
                    <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-[#2D6BE4] dark:hover:border-cyan-400 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-blue-50/30 dark:hover:bg-slate-800/70 rounded-2xl p-3 text-center transition-all cursor-pointer relative group">
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx,.odt,.rtf,.txt,.jpg,.jpeg,.png,.webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setApplyForm({...applyForm, coverLetterFileName: file.name});
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:bg-blue-100 group-hover:text-[#2D6BE4] dark:group-hover:text-cyan-400 flex items-center justify-center mx-auto mb-1 shadow-sm group-hover:scale-105 transition-transform">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                        {applyForm.coverLetterFileName || user?.profile?.coverLetterFileName 
                          ? `✓ ${applyForm.coverLetterFileName || user?.profile?.coverLetterFileName}` 
                          : 'Déposer votre Lettre'}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Format libre</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-slate-700 dark:text-slate-300 text-[11px]">Message pour le recruteur (optionnel)</label>
                    <button
                      type="button"
                      onClick={handleGenerateAICoverLetter}
                      disabled={isGeneratingCoverLetter}
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-[#2D6BE4] text-white text-[10px] font-bold shadow-sm hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer disabled:opacity-50"
                      title="Générer une lettre de motivation personnalisée avec l'IA Gemini"
                    >
                      {isGeneratingCoverLetter ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Rédaction IA…</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 text-amber-300" />
                          <span>Rédiger avec l'IA Gemini</span>
                        </>
                      )}
                    </button>
                  </div>
                  <textarea 
                    rows={4}
                    value={applyForm.note}
                    onChange={(e) => setApplyForm({...applyForm, note: e.target.value})}
                    placeholder="Présentez brièvement vos motivations pour ce poste (ou cliquez sur 'Rédiger avec l'IA Gemini')..."
                    className="w-full border border-slate-200 dark:border-slate-700 focus:border-[#2D6BE4] dark:focus:border-cyan-400 rounded-xl px-3 py-2 outline-none transition-all text-xs text-slate-800 dark:text-white bg-slate-50/50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-[#2D6BE4]/15 resize-none leading-relaxed"
                  />
                </div>

                <div className="pt-1">
                  <button 
                    type="submit"
                    className="w-full bg-[#2D6BE4] hover:bg-[#2563EB] dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 py-3 rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:shadow-blue-600/35 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
                  >
                    <Send className="w-4 h-4" />
                    <span>Envoyer ma candidature</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CONTACTEZ-NOUS ================= */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-[#0B132B]/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-[#0E172A] rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 relative my-4 flex flex-col transition-colors">
            
            <div className="bg-gradient-to-r from-[#0B132B] via-[#1C2541] to-[#0B132B] text-white p-5 sm:p-6 relative overflow-hidden flex-shrink-0">
              <div className="absolute right-0 top-0 w-48 h-48 bg-[#2D6BE4]/20 rounded-full blur-2xl pointer-events-none" />
              <button 
                onClick={() => setShowContactModal(false)}
                className="absolute top-4 right-4 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-20 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="relative z-10 pr-8">
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">Contactez-nous</h3>
                <p className="text-slate-300 text-xs sm:text-sm mt-0.5 font-medium">Envoyez un message direct à nos administrateurs.</p>
              </div>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto">
              <form onSubmit={handleContactSubmit} className="space-y-3.5 text-xs">
                {contactError && (
                  <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-100 mb-2">
                    {contactError}
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-[11px]">Nom *</label>
                    <input type="text" required value={contactForm.nom} onChange={(e) => setContactForm({...contactForm, nom: e.target.value})} className="w-full border border-slate-200 dark:border-slate-700 focus:border-[#2D6BE4] dark:focus:border-cyan-400 rounded-xl px-3 py-2 outline-none transition-all text-xs text-slate-800 dark:text-white bg-slate-50/50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-[#2D6BE4]/15" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-[11px]">Prénom *</label>
                    <input type="text" required value={contactForm.prenom} onChange={(e) => setContactForm({...contactForm, prenom: e.target.value})} className="w-full border border-slate-200 dark:border-slate-700 focus:border-[#2D6BE4] dark:focus:border-cyan-400 rounded-xl px-3 py-2 outline-none transition-all text-xs text-slate-800 dark:text-white bg-slate-50/50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-[#2D6BE4]/15" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-[11px]">Email *</label>
                    <input type="email" required value={contactForm.email} onChange={(e) => setContactForm({...contactForm, email: e.target.value})} className="w-full border border-slate-200 dark:border-slate-700 focus:border-[#2D6BE4] dark:focus:border-cyan-400 rounded-xl px-3 py-2 outline-none transition-all text-xs text-slate-800 dark:text-white bg-slate-50/50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-[#2D6BE4]/15" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-[11px]">Téléphone *</label>
                    <input type="tel" required value={contactForm.telephone} onChange={(e) => setContactForm({...contactForm, telephone: e.target.value})} className="w-full border border-slate-200 dark:border-slate-700 focus:border-[#2D6BE4] dark:focus:border-cyan-400 rounded-xl px-3 py-2 outline-none transition-all text-xs text-slate-800 dark:text-white bg-slate-50/50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-[#2D6BE4]/15" />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-[11px]">Objet / Sujet *</label>
                  <input type="text" required value={contactForm.sujet} onChange={(e) => setContactForm({...contactForm, sujet: e.target.value})} className="w-full border border-slate-200 dark:border-slate-700 focus:border-[#2D6BE4] dark:focus:border-cyan-400 rounded-xl px-3 py-2 outline-none transition-all text-xs text-slate-800 dark:text-white bg-slate-50/50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-[#2D6BE4]/15" />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-[11px]">Message *</label>
                  <textarea rows={4} required value={contactForm.message} onChange={(e) => setContactForm({...contactForm, message: e.target.value})} className="w-full border border-slate-200 dark:border-slate-700 focus:border-[#2D6BE4] dark:focus:border-cyan-400 rounded-xl px-3 py-2 outline-none transition-all text-xs text-slate-800 dark:text-white bg-slate-50/50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-[#2D6BE4]/15 resize-none" />
                </div>

                <div className="pt-2">
                  <button type="submit" disabled={contactLoading} className="w-full bg-[#2D6BE4] hover:bg-[#2563EB] dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 py-3 rounded-2xl font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs disabled:opacity-70">
                    {contactLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>{contactLoading ? 'Envoi...' : 'Envoyer le message'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Wrap with AuthProvider + simple URL routing for verify/OAuth callback
export default function NovoRise() {
  const path = window.location.pathname;
  const search = window.location.search;

  // Route: /verify?token=... → page de confirmation email
  if (path === '/verify' || (path === '/' && search.startsWith('?token='))) {
    return (
      <AuthProvider>
        <VerifyEmailPage />
      </AuthProvider>
    );
  }

  // Route: /auth/google/success?token=...&role=... → callback Google OAuth
  if (path.startsWith('/auth/google')) {
    return (
      <AuthProvider>
        <GoogleCallbackPage />
      </AuthProvider>
    );
  }

  // Route: /reset-password?token=... → open modal reset
  // Géré directement dans NovoRiseMain via useEffect

  return (
    <AuthProvider>
      <NovoRiseMain />
    </AuthProvider>
  );
}