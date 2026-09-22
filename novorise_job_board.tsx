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
  DollarSign,
  Users,
  Check
} from 'lucide-react';

// Types
export interface Job {
  id: string;
  title: string;
  company: string;
  logoBg: string;
  logoText: string;
  category: 'Tech & IT' | 'Marketing & Com' | 'Vente & Business' | 'Ingénierie & R&D';
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

// Initial Job Data
const INITIAL_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Lead Développeur Full Stack (React / Node.js)',
    company: 'TechNova Solutions',
    logoBg: 'bg-gradient-to-tr from-blue-600 to-indigo-600',
    logoText: 'TN',
    category: 'Tech & IT',
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
    category: 'Tech & IT',
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
    category: 'Marketing & Com',
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
    category: 'Tech & IT',
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
    category: 'Vente & Business',
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
    category: 'Ingénierie & R&D',
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
    category: 'Ingénierie & R&D',
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
    category: 'Tech & IT',
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

export default function NovoRise() {
  // Navigation & Modals
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [postJobModalOpen, setPostJobModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applyJob, setApplyJob] = useState<Job | null>(null);

  // Search & Filter State
  const [searchKeyword, setSearchKeyword] = useState('');
  const [locationKeyword, setLocationKeyword] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Tous');
  const [activeContract, setActiveContract] = useState<string>('Tous');
  const [activeWorkplace, setActiveWorkplace] = useState<string>('Tous');

  // Bookmarks
  const [savedJobs, setSavedJobs] = useState<string[]>(['job-1']);
  const [showOnlySaved, setShowOnlySaved] = useState(false);

  // Form states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [applyForm, setApplyForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    note: '',
    fileName: ''
  });
  const [cvForm, setCvForm] = useState({
    fullName: '',
    email: '',
    domain: 'Tech & IT',
    fileName: ''
  });
  const [newJobForm, setNewJobForm] = useState({
    title: '',
    company: '',
    category: 'Tech & IT' as Job['category'],
    contract: 'CDI' as Job['contract'],
    workplace: 'Remote' as Job['workplace'],
    location: '',
    salary: '',
    description: '',
    tags: ''
  });

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Toggle Bookmark
  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (savedJobs.includes(id)) {
      setSavedJobs(savedJobs.filter(j => j !== id));
      showToast('Offre retirée de vos favoris.');
    } else {
      setSavedJobs([...savedJobs, id]);
      showToast('Offre ajoutée à vos favoris ⭐');
    }
  };

  // Filter logic
  const filteredJobs = useMemo(() => {
    return INITIAL_JOBS.filter(job => {
      // Saved jobs filter
      if (showOnlySaved && !savedJobs.includes(job.id)) {
        return false;
      }

      // Category filter
      if (activeCategory !== 'Tous' && job.category !== activeCategory) {
        return false;
      }

      // Contract filter
      if (activeContract !== 'Tous' && job.contract !== activeContract) {
        return false;
      }

      // Workplace filter
      if (activeWorkplace !== 'Tous' && job.workplace !== activeWorkplace) {
        return false;
      }

      // Keyword search
      if (searchKeyword.trim()) {
        const query = searchKeyword.toLowerCase();
        const matchTitle = job.title.toLowerCase().includes(query);
        const matchCompany = job.company.toLowerCase().includes(query);
        const matchTags = job.tags.some(t => t.toLowerCase().includes(query));
        const matchDesc = job.description.toLowerCase().includes(query);
        if (!matchTitle && !matchCompany && !matchTags && !matchDesc) {
          return false;
        }
      }

      // Location search
      if (locationKeyword.trim()) {
        const locQuery = locationKeyword.toLowerCase();
        const matchLocation = job.location.toLowerCase().includes(locQuery);
        const matchWorkplace = job.workplace.toLowerCase().includes(locQuery);
        if (!matchLocation && !matchWorkplace) {
          return false;
        }
      }

      return true;
    });
  }, [searchKeyword, locationKeyword, activeCategory, activeContract, activeWorkplace, showOnlySaved, savedJobs]);

  // Handle Search Submission
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const offersElement = document.getElementById('offres-section');
    if (offersElement) {
      offersElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle Quick Trending Tag Click
  const handleTagClick = (tag: string) => {
    if (tag.toLowerCase() === 'remote') {
      setActiveWorkplace('Remote');
      setSearchKeyword('');
    } else if (tag.toLowerCase() === 'casablanca') {
      setLocationKeyword('Casablanca');
      setSearchKeyword('');
    } else {
      setSearchKeyword(tag);
    }
    const offersElement = document.getElementById('offres-section');
    if (offersElement) {
      offersElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Reset Filters
  const resetFilters = () => {
    setSearchKeyword('');
    setLocationKeyword('');
    setActiveCategory('Tous');
    setActiveContract('Tous');
    setActiveWorkplace('Tous');
    setShowOnlySaved(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-slate-800 relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] bg-[#0B132B] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#FF9F1C] flex-shrink-0" />
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

      {/* HEADER */}
      <header className="absolute top-0 w-full z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            
            {/* Logo */}
            <div 
              onClick={() => { resetFilters(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex items-center gap-2 cursor-pointer select-none group"
            >
              <div className="bg-gradient-to-tr from-[#FF9F1C] to-[#FF5E36] p-2 rounded-xl shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <TrendingUp className="text-white w-6 h-6" strokeWidth={3} />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                Novo<span className="text-[#FF9F1C]">Rise</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 items-center">
              <a 
                href="#offres-section" 
                className="text-white hover:text-[#FF9F1C] font-medium transition-colors"
              >
                Offres
              </a>
              <a 
                href="#categories-section" 
                className="text-gray-300 hover:text-white font-medium transition-colors"
              >
                Secteurs
              </a>
              <a 
                href="#solutions-section" 
                className="text-gray-300 hover:text-white font-medium transition-colors"
              >
                Candidats & Entreprises
              </a>
              
              {/* Saved items pill button */}
              <button 
                onClick={() => {
                  setShowOnlySaved(!showOnlySaved);
                  const el = document.getElementById('offres-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all border ${
                  showOnlySaved 
                    ? 'bg-[#FF9F1C] text-white border-[#FF9F1C]' 
                    : 'bg-white/10 text-gray-300 border-white/10 hover:bg-white/20'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Favoris ({savedJobs.length})</span>
              </button>
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={() => { setAuthMode('login'); setAuthModalOpen(true); }}
                className="text-white hover:text-gray-200 font-medium px-4 py-2 transition-colors"
              >
                Connexion
              </button>
              <button 
                onClick={() => { setAuthMode('register'); setAuthModalOpen(true); }}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm px-6 py-2 rounded-full font-medium transition-all transform hover:scale-105"
              >
                S'inscrire
              </button>
              <button
                onClick={() => setPostJobModalOpen(true)}
                className="bg-gradient-to-r from-[#FF9F1C] to-[#FF5E36] text-white px-4 py-2 rounded-full font-semibold text-sm shadow-md hover:shadow-orange-500/20 transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publier</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-3">
              <button 
                onClick={() => {
                  setShowOnlySaved(!showOnlySaved);
                  const el = document.getElementById('offres-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-white bg-white/10 p-2 rounded-xl relative"
                title="Favoris"
              >
                <Bookmark className="w-5 h-5" />
                {savedJobs.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FF5E36] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {savedJobs.length}
                  </span>
                )}
              </button>
              
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-[#FF9F1C] focus:outline-none p-1"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#0B132B] px-4 pt-2 pb-6 space-y-3 shadow-2xl border-t border-white/10 animate-fade-in">
            <a 
              href="#offres-section" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="block px-3 py-2 text-white font-medium rounded-md hover:bg-white/10"
            >
              Offres d'emploi
            </a>
            <a 
              href="#categories-section" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="block px-3 py-2 text-gray-300 font-medium rounded-md hover:bg-white/10"
            >
              Secteurs d'activité
            </a>
            <a 
              href="#solutions-section" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="block px-3 py-2 text-gray-300 font-medium rounded-md hover:bg-white/10"
            >
              Candidats & Entreprises
            </a>
            
            <div className="pt-4 flex flex-col gap-3">
              <button 
                onClick={() => { setIsMobileMenuOpen(false); setAuthMode('login'); setAuthModalOpen(true); }}
                className="text-white font-medium px-4 py-2 border border-white/20 rounded-full"
              >
                Connexion
              </button>
              <button 
                onClick={() => { setIsMobileMenuOpen(false); setAuthMode('register'); setAuthModalOpen(true); }}
                className="bg-white/10 text-white px-4 py-2 rounded-full font-medium"
              >
                S'inscrire
              </button>
              <button 
                onClick={() => { setIsMobileMenuOpen(false); setPostJobModalOpen(true); }}
                className="bg-gradient-to-r from-[#FF9F1C] to-[#FF5E36] text-white px-4 py-2.5 rounded-full font-semibold flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" /> Publier une offre
              </button>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="relative bg-[#0B132B] pt-32 pb-24 lg:pt-48 lg:pb-36 overflow-hidden">
          {/* Subtle background glow effect */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-30 pointer-events-none" 
            style={{ background: 'radial-gradient(circle, #FF9F1C 0%, transparent 60%)', filter: 'blur(80px)' }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-orange-300 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#FF9F1C]" />
              <span>Plus de 5 000 offres d'emploi vérifiées en 2026</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
              Élevez votre carrière.<br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9F1C] to-[#FF5E36]">
                Votre prochain chapitre commence ici.
              </span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
              Trouvez des opportunités qui vous correspondent parmi des milliers d'entreprises innovantes.
            </p>

            {/* Main Search Bar */}
            <form 
              onSubmit={handleSearchSubmit}
              className="bg-white p-2 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-center w-full max-w-4xl mx-auto gap-2 md:gap-0 transition-all focus-within:ring-4 focus-within:ring-orange-500/20"
            >
              <div className="flex items-center flex-1 p-3 border-b md:border-b-0 md:border-r border-gray-100 w-full group">
                <Search className="text-gray-400 mr-3 group-focus-within:text-[#FF9F1C] transition-colors w-5 h-5 flex-shrink-0" />
                <input 
                  type="text" 
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Poste, compétences, mots-clés (ex: React, Marketing)..." 
                  className="w-full outline-none text-gray-700 bg-transparent placeholder-gray-400 text-sm md:text-base"
                />
                {searchKeyword && (
                  <button 
                    type="button" 
                    onClick={() => setSearchKeyword('')} 
                    className="text-gray-400 hover:text-gray-600 text-xs mr-2"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              <div className="flex items-center flex-1 p-3 w-full group">
                <MapPin className="text-gray-400 mr-3 group-focus-within:text-[#FF9F1C] transition-colors w-5 h-5 flex-shrink-0" />
                <input 
                  type="text" 
                  value={locationKeyword}
                  onChange={(e) => setLocationKeyword(e.target.value)}
                  placeholder="Localisation (ex: Casablanca, Remote, Paris)..." 
                  className="w-full outline-none text-gray-700 bg-transparent placeholder-gray-400 text-sm md:text-base"
                />
                {locationKeyword && (
                  <button 
                    type="button" 
                    onClick={() => setLocationKeyword('')} 
                    className="text-gray-400 hover:text-gray-600 text-xs mr-2"
                  >
                    ✕
                  </button>
                )}
              </div>

              <button 
                type="submit"
                className="bg-gradient-to-r from-[#FF9F1C] to-[#FF5E36] hover:from-[#e88b14] hover:to-[#e54a22] text-white px-8 py-4 rounded-xl md:rounded-full font-bold w-full md:w-auto mt-2 md:mt-0 shadow-lg shadow-orange-500/30 transition-all transform hover:scale-105 flex justify-center items-center gap-2"
              >
                <span>Rechercher</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            
            {/* Quick trending tags */}
            <div className="mt-8 flex flex-wrap justify-center items-center gap-2.5 text-sm">
              <span className="text-gray-400 font-medium">Tendances :</span>
              {['Développeur React', 'UI/UX Designer', 'Data Scientist', 'Casablanca', 'Remote'].map((tag) => (
                <button 
                  key={tag} 
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className="bg-white/10 text-gray-300 px-3.5 py-1 rounded-full cursor-pointer hover:bg-white/20 hover:text-white transition-all text-xs border border-white/5 active:scale-95"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* CATEGORIES SECTION */}
        <section id="categories-section" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF5E36] uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" /> Métiers & Secteurs
              </div>
              <h2 className="text-3xl font-bold text-[#0B132B]">Opportunités recommandées</h2>
              <p className="text-gray-500 mt-2">Explorez les secteurs qui recrutent le plus activement aujourd'hui.</p>
            </div>
            <button 
              onClick={() => {
                setActiveCategory('Tous');
                document.getElementById('offres-section')?.scrollIntoView({ behavior: 'smooth' });
              }} 
              className="hidden md:flex items-center text-[#FF5E36] font-semibold hover:text-[#FF9F1C] transition-colors"
            >
              Voir toutes les offres <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Tech & IT */}
            <div 
              onClick={() => {
                setActiveCategory('Tech & IT');
                document.getElementById('offres-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border group relative ${
                activeCategory === 'Tech & IT' ? 'border-[#FF9F1C] ring-2 ring-orange-400/20' : 'border-gray-100'
              }`}
            >
              <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#FF9F1C]/10 transition-colors">
                <Code className="text-blue-600 group-hover:text-[#FF9F1C] w-7 h-7 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-[#0B132B] mb-2">Tech & IT</h3>
              <p className="text-gray-500 text-sm mb-4">4,520 opportunités ouvertes</p>
              <div className="flex items-center text-sm font-medium text-gray-400 group-hover:text-[#FF5E36] transition-colors">
                Explorer <ArrowRight className="ml-1 w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </div>
            </div>

            {/* Card 2: Marketing & Com */}
            <div 
              onClick={() => {
                setActiveCategory('Marketing & Com');
                document.getElementById('offres-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border group relative ${
                activeCategory === 'Marketing & Com' ? 'border-[#FF9F1C] ring-2 ring-orange-400/20' : 'border-gray-100'
              }`}
            >
              <div className="bg-orange-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#FF9F1C]/10 transition-colors">
                <Megaphone className="text-orange-500 group-hover:text-[#FF9F1C] w-7 h-7 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-[#0B132B] mb-2">Marketing & Com</h3>
              <p className="text-gray-500 text-sm mb-4">1,840 opportunités ouvertes</p>
              <div className="flex items-center text-sm font-medium text-gray-400 group-hover:text-[#FF5E36] transition-colors">
                Explorer <ArrowRight className="ml-1 w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </div>
            </div>

            {/* Card 3: Vente & Business */}
            <div 
              onClick={() => {
                setActiveCategory('Vente & Business');
                document.getElementById('offres-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border group relative ${
                activeCategory === 'Vente & Business' ? 'border-[#FF9F1C] ring-2 ring-orange-400/20' : 'border-gray-100'
              }`}
            >
              <div className="bg-green-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#FF9F1C]/10 transition-colors">
                <Briefcase className="text-green-600 group-hover:text-[#FF9F1C] w-7 h-7 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-[#0B132B] mb-2">Vente & Business</h3>
              <p className="text-gray-500 text-sm mb-4">2,930 opportunités ouvertes</p>
              <div className="flex items-center text-sm font-medium text-gray-400 group-hover:text-[#FF5E36] transition-colors">
                Explorer <ArrowRight className="ml-1 w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </div>
            </div>

            {/* Card 4: Ingénierie & R&D */}
            <div 
              onClick={() => {
                setActiveCategory('Ingénierie & R&D');
                document.getElementById('offres-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border group relative ${
                activeCategory === 'Ingénierie & R&D' ? 'border-[#FF9F1C] ring-2 ring-orange-400/20' : 'border-gray-100'
              }`}
            >
              <div className="bg-purple-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#FF9F1C]/10 transition-colors">
                <Cpu className="text-purple-600 group-hover:text-[#FF9F1C] w-7 h-7 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-[#0B132B] mb-2">Ingénierie & R&D</h3>
              <p className="text-gray-500 text-sm mb-4">1,120 opportunités ouvertes</p>
              <div className="flex items-center text-sm font-medium text-gray-400 group-hover:text-[#FF5E36] transition-colors">
                Explorer <ArrowRight className="ml-1 w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </div>
            </div>
          </div>
        </section>

        {/* JOB LISTINGS SECTION (THE CORE OF THE JOB BOARD) */}
        <section id="offres-section" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF9F1C] animate-pulse"></span>
                <span className="text-xs font-bold text-[#FF5E36] uppercase tracking-wider">Offres d'emploi en direct</span>
              </div>
              <h2 className="text-3xl font-bold text-[#0B132B] mt-1">Dernières opportunités</h2>
              <p className="text-gray-500 text-sm mt-1">
                {filteredJobs.length} offre{filteredJobs.length > 1 ? 's' : ''} disponible{filteredJobs.length > 1 ? 's' : ''} selon vos critères
              </p>
            </div>

            {/* Quick Filter Reset */}
            {(searchKeyword || locationKeyword || activeCategory !== 'Tous' || activeContract !== 'Tous' || activeWorkplace !== 'Tous' || showOnlySaved) && (
              <button 
                onClick={resetFilters}
                className="self-start md:self-auto text-xs font-semibold text-[#FF5E36] hover:text-[#FF9F1C] underline flex items-center gap-1 transition-colors"
              >
                ✕ Réinitialiser tous les filtres
              </button>
            )}
          </div>

          {/* Interactive Filters Bar */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 space-y-4">
            
            {/* Top row: Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <span className="text-xs font-semibold text-gray-400 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Secteur:
              </span>
              {['Tous', 'Tech & IT', 'Marketing & Com', 'Vente & Business', 'Ingénierie & R&D'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    activeCategory === cat 
                      ? 'bg-[#0B132B] text-white shadow-sm' 
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Second row: Contract & Workplace Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 text-xs">
              
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-gray-400">Contrat:</span>
                {['Tous', 'CDI', 'CDD', 'Freelance', 'Stage'].map(contract => (
                  <button
                    key={contract}
                    onClick={() => setActiveContract(contract)}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      activeContract === contract 
                        ? 'bg-[#FF9F1C] text-white font-bold' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {contract}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-gray-400">Modalité:</span>
                {['Tous', 'Remote', 'Hybride', 'Présentiel'].map(wp => (
                  <button
                    key={wp}
                    onClick={() => setActiveWorkplace(wp)}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      activeWorkplace === wp 
                        ? 'bg-[#FF5E36] text-white font-bold' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {wp}
                  </button>
                ))}
              </div>

            </div>
          </div>

          {/* Job Cards Grid */}
          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-lg mx-auto">
              <div className="w-16 h-16 bg-orange-50 text-[#FF9F1C] rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#0B132B] mb-2">Aucune offre trouvée</h3>
              <p className="text-gray-500 text-sm mb-6">
                Aucune offre ne correspond exactement à vos critères. Essayez d'élargir votre recherche.
              </p>
              <button 
                onClick={resetFilters}
                className="bg-[#0B132B] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 transition-colors"
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
                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all cursor-pointer flex flex-col justify-between group relative"
                  >
                    {/* Card Top */}
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-4">
                        
                        <div className="flex items-center gap-3">
                          {/* Company Logo Badge */}
                          <div className={`w-12 h-12 rounded-xl ${job.logoBg} text-white flex items-center justify-center font-extrabold text-sm shadow-sm flex-shrink-0`}>
                            {job.logoText}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-500 text-xs flex items-center gap-1.5">
                              {job.company}
                              <span className="inline-block w-1 h-1 rounded-full bg-gray-300"></span>
                              <span className="text-gray-400">{job.postedTime}</span>
                            </h4>
                            <h3 className="text-lg font-bold text-[#0B132B] group-hover:text-[#FF5E36] transition-colors line-clamp-1 mt-0.5">
                              {job.title}
                            </h3>
                          </div>
                        </div>

                        {/* Bookmark Button */}
                        <button
                          onClick={(e) => toggleBookmark(job.id, e)}
                          className={`p-2 rounded-xl transition-colors ${
                            isSaved ? 'text-[#FF9F1C] bg-orange-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                          }`}
                          title={isSaved ? "Retirer des favoris" : "Enregistrer l'offre"}
                          aria-label="Enregistrer l'offre"
                        >
                          {isSaved ? <BookmarkCheck className="w-5 h-5 fill-current" /> : <Bookmark className="w-5 h-5" />}
                        </button>
                      </div>

                      {/* Description snippet */}
                      <p className="text-gray-600 text-xs line-clamp-2 mb-4 leading-relaxed">
                        {job.description}
                      </p>

                      {/* Meta Pills */}
                      <div className="flex flex-wrap items-center gap-2 mb-4 text-xs font-medium">
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-slate-500" /> {job.contract}
                        </span>
                        <span className={`px-2.5 py-1 rounded-lg flex items-center gap-1 ${
                          job.workplace === 'Remote' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                          <Globe className="w-3 h-3" /> {job.workplace}
                        </span>
                        <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" /> {job.location}
                        </span>
                      </div>

                      {/* Skill Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {job.tags.slice(0, 4).map(tag => (
                          <span 
                            key={tag} 
                            onClick={(e) => { e.stopPropagation(); handleTagClick(tag); }}
                            className="text-[11px] font-medium bg-gray-50 text-gray-600 px-2.5 py-0.5 rounded-md hover:bg-orange-50 hover:text-[#FF5E36] transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                        {job.tags.length > 4 && (
                          <span className="text-[10px] text-gray-400 px-1 py-0.5">
                            +{job.tags.length - 4}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Bottom: Salary & Actions */}
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2 mt-auto">
                      <div className="text-xs">
                        <span className="text-gray-400 block text-[10px]">Rémunération estimée</span>
                        <span className="font-bold text-[#0B132B]">{job.salary}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedJob(job); }}
                          className="px-3.5 py-1.5 text-xs font-semibold text-gray-600 hover:text-[#0B132B] hover:bg-gray-100 rounded-xl transition-colors"
                        >
                          Détails
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setApplyJob(job); }}
                          className="bg-[#0B132B] group-hover:bg-gradient-to-r group-hover:from-[#FF9F1C] group-hover:to-[#FF5E36] text-white px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                        >
                          <span>Postuler</span>
                          <ChevronRight className="w-3.5 h-3.5" />
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
            
            {/* Candidate Box */}
            <div className="bg-[#0B132B] rounded-3xl p-8 lg:p-12 relative overflow-hidden group shadow-xl">
              {/* Decorative elements */}
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-orange-300 text-xs font-semibold mb-4">
                <Users className="w-3.5 h-3.5" /> Espace Candidats
              </div>

              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 relative z-10">
                Faites décoller votre carrière
              </h3>
              <p className="text-gray-300 mb-8 max-w-sm relative z-10 text-sm leading-relaxed">
                Faites-vous repérer directement par les meilleurs recruteurs. Déposez votre CV dans notre vivier de talents vérifiés.
              </p>
              
              <button 
                onClick={() => setCvModalOpen(true)}
                className="bg-white text-[#0B132B] hover:bg-gray-100 px-6 py-3.5 rounded-full font-bold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg relative z-10 text-sm"
              >
                <Upload className="w-4 h-4 text-[#FF5E36]" /> 
                <span>Déposer mon CV</span>
              </button>
            </div>

            {/* Recruiter Box */}
            <div className="bg-gradient-to-br from-[#FF9F1C] to-[#FF5E36] rounded-3xl p-8 lg:p-12 relative overflow-hidden group shadow-xl">
              {/* Decorative elements */}
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold mb-4">
                <Building2 className="w-3.5 h-3.5" /> Espace Entreprises
              </div>

              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 relative z-10">
                Recrutez les meilleurs talents
              </h3>
              <p className="text-white/95 mb-8 max-w-sm relative z-10 text-sm leading-relaxed">
                Accédez à un vivier de talents qualifiés et diffusez vos offres d'emploi à la bonne audience en un clic.
              </p>
              
              <button 
                onClick={() => setPostJobModalOpen(true)}
                className="bg-[#0B132B] text-white hover:bg-slate-900 px-6 py-3.5 rounded-full font-bold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg relative z-10 text-sm"
              >
                <PlusCircle className="w-4 h-4 text-[#FF9F1C]" /> 
                <span>Publier une offre</span>
              </button>
            </div>

          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 pt-16 pb-8 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            {/* Column 1: Brand */}
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <div className="bg-gradient-to-tr from-[#FF9F1C] to-[#FF5E36] p-1.5 rounded-lg">
                  <TrendingUp className="text-white w-5 h-5" strokeWidth={3} />
                </div>
                <span className="text-xl font-bold text-[#0B132B] tracking-tight">
                  Novo<span className="text-[#FF9F1C]">Rise</span>
                </span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Le point de rencontre entre les talents ambitieux et les entreprises innovantes. L'espoir d'une nouvelle carrière commence ici.
              </p>
              
              {/* Social Icons */}
              <div className="flex items-center gap-3">
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#FF9F1C] hover:text-white text-gray-600 flex items-center justify-center transition-colors shadow-sm"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#FF9F1C] hover:text-white text-gray-600 flex items-center justify-center transition-colors shadow-sm"
                  aria-label="Twitter / X"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#FF9F1C] hover:text-white text-gray-600 flex items-center justify-center transition-colors shadow-sm"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); showToast('Site officiel NovoRise'); }}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#FF9F1C] hover:text-white text-gray-600 flex items-center justify-center transition-colors shadow-sm"
                  aria-label="Site Web"
                >
                  <Globe className="w-4 h-4" />
                </a>
              </div>
            </div>
            
            {/* Column 2: Candidates */}
            <div>
              <h4 className="font-bold text-[#0B132B] mb-4">Candidats</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <a href="#offres-section" className="hover:text-[#FF5E36] transition-colors">
                    Rechercher un emploi
                  </a>
                </li>
                <li>
                  <button onClick={() => { setAuthMode('register'); setAuthModalOpen(true); }} className="hover:text-[#FF5E36] transition-colors text-left">
                    Créer un profil
                  </button>
                </li>
                <li>
                  <button onClick={() => setCvModalOpen(true)} className="hover:text-[#FF5E36] transition-colors text-left">
                    Déposer son CV
                  </button>
                </li>
                <li>
                  <button onClick={() => showToast('Inscrivez-vous pour activer les alertes personnalisées')} className="hover:text-[#FF5E36] transition-colors text-left">
                    Alertes emploi
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Recruiters */}
            <div>
              <h4 className="font-bold text-[#0B132B] mb-4">Recruteurs</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <button onClick={() => setPostJobModalOpen(true)} className="hover:text-[#FF5E36] transition-colors text-left">
                    Publier une annonce
                  </button>
                </li>
                <li>
                  <button onClick={() => showToast('Accès CVthèque réservé aux comptes entreprises vérifiés')} className="hover:text-[#FF5E36] transition-colors text-left">
                    Accès CVthèque
                  </button>
                </li>
                <li>
                  <a href="#solutions-section" className="hover:text-[#FF5E36] transition-colors">
                    Solutions Marque Employeur
                  </a>
                </li>
                <li>
                  <button onClick={() => showToast('Grille tarifaire : contactez contact@novorise.com')} className="hover:text-[#FF5E36] transition-colors text-left">
                    Tarifs & Packs
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: About */}
            <div>
              <h4 className="font-bold text-[#0B132B] mb-4">NovoRise</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); showToast('NovoRise — Plateforme RH & Recrutement'); }} className="hover:text-[#FF5E36] transition-colors">
                    À propos
                  </a>
                </li>
                <li>
                  <a href="mailto:contact@novorise.com" className="hover:text-[#FF5E36] transition-colors">
                    Contactez-nous
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); showToast('Politique de confidentialité conforme RGPD & CNDP'); }} className="hover:text-[#FF5E36] transition-colors">
                    Politique de confidentialité
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); showToast('Conditions Générales d\'Utilisation de NovoRise'); }} className="hover:text-[#FF5E36] transition-colors">
                    CGU & Mentions Légales
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} NovoRise. Tous droits réservés. Plateforme moderne d'emploi et de recrutement.
            </p>
            <div className="flex items-center gap-6 text-xs text-gray-400">
              <span>Fait avec passion pour les talents de demain</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ===================== MODALS ===================== */}

      {/* 1. JOB DETAILS MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 relative">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedJob(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Info */}
            <div className="flex items-start gap-4 mb-6 pr-10">
              <div className={`w-14 h-14 rounded-2xl ${selectedJob.logoBg} text-white flex items-center justify-center font-extrabold text-lg flex-shrink-0 shadow-md`}>
                {selectedJob.logoText}
              </div>
              <div>
                <span className="text-xs font-bold text-[#FF5E36] uppercase tracking-wider">{selectedJob.category}</span>
                <h3 className="text-2xl font-bold text-[#0B132B]">{selectedJob.title}</h3>
                <p className="text-gray-500 font-medium text-sm mt-0.5">{selectedJob.company} • {selectedJob.location}</p>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="bg-slate-100 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-slate-500" /> {selectedJob.contract}
              </span>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-emerald-600" /> {selectedJob.workplace}
              </span>
              <span className="bg-orange-50 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#FF9F1C]" /> {selectedJob.postedTime}
              </span>
              <span className="bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-xl">
                💰 {selectedJob.salary}
              </span>
            </div>

            {/* Description */}
            <div className="space-y-6 text-sm text-gray-700 border-t border-b border-gray-100 py-6">
              <div>
                <h4 className="font-bold text-[#0B132B] text-base mb-2">Description du poste</h4>
                <p className="leading-relaxed text-gray-600">{selectedJob.description}</p>
              </div>

              {selectedJob.missions && selectedJob.missions.length > 0 && (
                <div>
                  <h4 className="font-bold text-[#0B132B] text-base mb-2">Missions principales</h4>
                  <ul className="space-y-2">
                    {selectedJob.missions.map((mission, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{mission}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                <div>
                  <h4 className="font-bold text-[#0B132B] text-base mb-2">Profil recherché</h4>
                  <ul className="space-y-2">
                    {selectedJob.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#FF9F1C] mt-0.5 flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedJob.benefits && selectedJob.benefits.length > 0 && (
                <div>
                  <h4 className="font-bold text-[#0B132B] text-base mb-2">Avantages offerts</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedJob.benefits.map((b, idx) => (
                      <div key={idx} className="bg-gray-50 p-2.5 rounded-xl text-xs font-medium text-gray-700 flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#FF5E36]" /> {b}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-4 mt-6">
              <button
                onClick={() => toggleBookmark(selectedJob.id)}
                className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#0B132B] px-4 py-2.5 rounded-xl border border-gray-200 transition-colors"
              >
                {savedJobs.includes(selectedJob.id) ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-[#FF9F1C]" />
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
                className="bg-gradient-to-r from-[#FF9F1C] to-[#FF5E36] hover:from-[#e88b14] hover:to-[#e54a22] text-white px-8 py-3 rounded-full font-bold text-sm shadow-lg shadow-orange-500/20 transition-all transform hover:scale-105"
              >
                Postuler maintenant
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 2. APPLY TO JOB MODAL */}
      {applyJob && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl p-6 md:p-8 relative">
            <button 
              onClick={() => setApplyJob(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6 pr-8">
              <span className="text-xs font-bold text-[#FF5E36] uppercase tracking-wider">Candidature directe</span>
              <h3 className="text-xl font-bold text-[#0B132B] mt-1">{applyJob.title}</h3>
              <p className="text-gray-500 text-xs">{applyJob.company} • {applyJob.location}</p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              showToast(`Votre candidature pour ${applyJob.title} a bien été transmise ! 🎉`);
              setApplyJob(null);
              setApplyForm({ fullName: '', email: '', phone: '', note: '', fileName: '' });
            }} className="space-y-4 text-sm">
              
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nom complet *</label>
                <input 
                  type="text" 
                  required 
                  value={applyForm.fullName}
                  onChange={(e) => setApplyForm({...applyForm, fullName: e.target.value})}
                  placeholder="Ex: Sarah Alami"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#FF9F1C] transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email *</label>
                  <input 
                    type="email" 
                    required 
                    value={applyForm.email}
                    onChange={(e) => setApplyForm({...applyForm, email: e.target.value})}
                    placeholder="sarah@exemple.com"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#FF9F1C] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Téléphone *</label>
                  <input 
                    type="tel" 
                    required 
                    value={applyForm.phone}
                    onChange={(e) => setApplyForm({...applyForm, phone: e.target.value})}
                    placeholder="+212 6..."
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#FF9F1C] transition-colors"
                  />
                </div>
              </div>

              {/* Upload CV */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Curriculum Vitae (PDF, max 5 Mo) *</label>
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center hover:border-[#FF9F1C] transition-colors cursor-pointer relative">
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx"
                    required
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setApplyForm({...applyForm, fileName: file.name});
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                  <span className="text-xs font-medium text-gray-600 block">
                    {applyForm.fileName ? `✓ ${applyForm.fileName}` : 'Cliquez ou glissez votre CV ici'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Message pour le recruteur (optionnel)</label>
                <textarea 
                  rows={3}
                  value={applyForm.note}
                  onChange={(e) => setApplyForm({...applyForm, note: e.target.value})}
                  placeholder="Présentez brièvement vos points forts pour ce poste..."
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2 outline-none focus:border-[#FF9F1C] transition-colors text-xs resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-[#FF9F1C] to-[#FF5E36] hover:from-[#e88b14] hover:to-[#e54a22] text-white py-3.5 rounded-full font-bold shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 mt-4"
              >
                <Send className="w-4 h-4" /> Envoyer ma candidature
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. CANDIDATE TALENT POOL / CV DROP MODAL */}
      {cvModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 md:p-8 relative">
            <button 
              onClick={() => setCvModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-orange-50 text-[#FF9F1C] rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0B132B]">Déposez votre CV</h3>
              <p className="text-gray-500 text-xs mt-1">
                Soyez contacté directement par des recruteurs à la recherche de votre profil.
              </p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              showToast('CV ajouté à la CVthèque NovoRise avec succès ! ✨');
              setCvModalOpen(false);
              setCvForm({ fullName: '', email: '', domain: 'Tech & IT', fileName: '' });
            }} className="space-y-4 text-sm">
              
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nom complet *</label>
                <input 
                  type="text" 
                  required 
                  value={cvForm.fullName}
                  onChange={(e) => setCvForm({...cvForm, fullName: e.target.value})}
                  placeholder="Votre nom et prénom"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#FF9F1C] transition-colors text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email professionnel *</label>
                <input 
                  type="email" 
                  required 
                  value={cvForm.email}
                  onChange={(e) => setCvForm({...cvForm, email: e.target.value})}
                  placeholder="votre.email@domaine.com"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#FF9F1C] transition-colors text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Votre domaine d'expertise *</label>
                <select 
                  value={cvForm.domain}
                  onChange={(e) => setCvForm({...cvForm, domain: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#FF9F1C] transition-colors text-xs bg-white"
                >
                  <option value="Tech & IT">Tech & Informatique</option>
                  <option value="Marketing & Com">Marketing & Communication</option>
                  <option value="Vente & Business">Vente & Développement Commercial</option>
                  <option value="Ingénierie & R&D">Ingénierie & R&D</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Fichier CV (PDF) *</label>
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center hover:border-[#FF9F1C] transition-colors cursor-pointer relative">
                  <input 
                    type="file" 
                    accept=".pdf"
                    required
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setCvForm({...cvForm, fileName: f.name});
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <FileText className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                  <span className="text-xs font-medium text-gray-600 block">
                    {cvForm.fileName ? `✓ ${cvForm.fileName}` : 'Sélectionnez votre fichier PDF'}
                  </span>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#0B132B] hover:bg-slate-900 text-white py-3 rounded-full font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                Confirmer mon inscription au vivier
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. POST A JOB (RECRUITER) MODAL */}
      {postJobModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 relative">
            <button 
              onClick={() => setPostJobModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-xs font-bold text-[#FF5E36] uppercase tracking-wider">Espace Recruteur</span>
              <h3 className="text-2xl font-bold text-[#0B132B] mt-1">Publier une nouvelle offre</h3>
              <p className="text-gray-500 text-xs">Touchez des milliers de candidats qualifiés sur NovoRise.</p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              showToast(`L'offre "${newJobForm.title}" a été publiée et sera vérifiée sous 2h ! 🚀`);
              setPostJobModalOpen(false);
              setNewJobForm({
                title: '',
                company: '',
                category: 'Tech & IT',
                contract: 'CDI',
                workplace: 'Remote',
                location: '',
                salary: '',
                description: '',
                tags: ''
              });
            }} className="space-y-4 text-sm">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Intitulé du poste *</label>
                  <input 
                    type="text" 
                    required 
                    value={newJobForm.title}
                    onChange={(e) => setNewJobForm({...newJobForm, title: e.target.value})}
                    placeholder="Ex: Senior React Developer"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#FF9F1C] transition-colors text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Entreprise *</label>
                  <input 
                    type="text" 
                    required 
                    value={newJobForm.company}
                    onChange={(e) => setNewJobForm({...newJobForm, company: e.target.value})}
                    placeholder="Ex: Acme Corp"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#FF9F1C] transition-colors text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Secteur *</label>
                  <select 
                    value={newJobForm.category}
                    onChange={(e) => setNewJobForm({...newJobForm, category: e.target.value as any})}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-[#FF9F1C] transition-colors text-xs bg-white"
                  >
                    <option value="Tech & IT">Tech & IT</option>
                    <option value="Marketing & Com">Marketing & Com</option>
                    <option value="Vente & Business">Vente & Business</option>
                    <option value="Ingénierie & R&D">Ingénierie & R&D</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Contrat *</label>
                  <select 
                    value={newJobForm.contract}
                    onChange={(e) => setNewJobForm({...newJobForm, contract: e.target.value as any})}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-[#FF9F1C] transition-colors text-xs bg-white"
                  >
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Stage">Stage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Modalité *</label>
                  <select 
                    value={newJobForm.workplace}
                    onChange={(e) => setNewJobForm({...newJobForm, workplace: e.target.value as any})}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-[#FF9F1C] transition-colors text-xs bg-white"
                  >
                    <option value="Remote">Télétravail (Remote)</option>
                    <option value="Hybride">Hybride</option>
                    <option value="Présentiel">Présentiel</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Localisation *</label>
                  <input 
                    type="text" 
                    required 
                    value={newJobForm.location}
                    onChange={(e) => setNewJobForm({...newJobForm, location: e.target.value})}
                    placeholder="Ex: Casablanca ou Paris"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#FF9F1C] transition-colors text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Rémunération indicative *</label>
                  <input 
                    type="text" 
                    required 
                    value={newJobForm.salary}
                    onChange={(e) => setNewJobForm({...newJobForm, salary: e.target.value})}
                    placeholder="Ex: 25k - 35k MAD / mois"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#FF9F1C] transition-colors text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Compétences clés (séparées par des virgules)</label>
                <input 
                  type="text" 
                  value={newJobForm.tags}
                  onChange={(e) => setNewJobForm({...newJobForm, tags: e.target.value})}
                  placeholder="Ex: React, Node.js, Tailwind, AWS"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#FF9F1C] transition-colors text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description du poste *</label>
                <textarea 
                  rows={4}
                  required
                  value={newJobForm.description}
                  onChange={(e) => setNewJobForm({...newJobForm, description: e.target.value})}
                  placeholder="Détaillez le rôle, missions et profil attendu..."
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2 outline-none focus:border-[#FF9F1C] transition-colors text-xs resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-[#FF9F1C] to-[#FF5E36] hover:from-[#e88b14] hover:to-[#e54a22] text-white py-3.5 rounded-full font-bold shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" /> Diffuser l'offre
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. AUTH MODAL (CONNEXION / INSCRIPTION) */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 md:p-8 relative">
            <button 
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Auth Mode Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-2xl mb-6">
              <button
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  authMode === 'login' ? 'bg-white text-[#0B132B] shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Connexion
              </button>
              <button
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  authMode === 'register' ? 'bg-white text-[#0B132B] shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                S'inscrire
              </button>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-[#0B132B]">
                {authMode === 'login' ? 'Bon retour sur NovoRise' : 'Créer un compte NovoRise'}
              </h3>
              <p className="text-gray-500 text-xs mt-1">
                {authMode === 'login' 
                  ? 'Accédez à vos candidatures et offres sauvegardées.' 
                  : 'Rejoignez la communauté de talents et recruteurs.'}
              </p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              showToast(authMode === 'login' ? 'Connexion réussie ! Bienvenue.' : 'Compte créé avec succès ! Bienvenue sur NovoRise.');
              setAuthModalOpen(false);
            }} className="space-y-4 text-xs">

              {authMode === 'register' && (
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Vous êtes :</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" className="p-2 border-2 border-[#FF9F1C] bg-orange-50/50 rounded-xl font-bold text-[#FF5E36]">
                      Candidat
                    </button>
                    <button type="button" className="p-2 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50">
                      Recruteur
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  required 
                  placeholder="nom@exemple.com"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#FF9F1C] transition-colors"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-gray-700">Mot de passe</label>
                  {authMode === 'login' && (
                    <a href="#" onClick={(e) => { e.preventDefault(); showToast('Lien de réinitialisation envoyé par email'); }} className="text-[#FF5E36] hover:underline text-[11px]">
                      Mot de passe oublié ?
                    </a>
                  )}
                </div>
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#FF9F1C] transition-colors"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#0B132B] hover:bg-slate-900 text-white py-3.5 rounded-full font-bold shadow-md transition-all text-xs"
              >
                {authMode === 'login' ? 'Se connecter' : 'Créer mon compte'}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}