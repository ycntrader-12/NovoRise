// ─────────────────────────────────────────────────────────────────────────────
// NovoRise — Classification officielle des 7 Grands Domaines & Secteurs
// ─────────────────────────────────────────────────────────────────────────────

export type MainDomain =
  | '1. Sciences Exactes, Formelles et Naturelles'
  | '2. Ingénierie, Technologies et Informatique'
  | '3. Sciences Médicales et de la Santé'
  | '4. Sciences Humaines, Sociales et Gouvernance'
  | '5. Arts, Médias, Culture et Design'
  | '6. Commerce, Logistique et Services'
  | '7. Agriculture, Ressources Naturelles et Environnement';

export type JobCategory =
  // ── 1. Sciences Exactes, Formelles et Naturelles ──────────────────────────
  | 'Mathématiques & Logique'
  | 'Physique & Astronomie'
  | 'Chimie & Matière'
  | "Sciences de la Terre et de l'Univers"
  | 'Sciences du Vivant (Biologie)'
  // ── 2. Ingénierie, Technologies et Informatique ───────────────────────────
  | 'Informatique & Numérique'
  | 'Génie Mécanique & Matériaux'
  | 'Génie Électrique & Électronique'
  | 'Génie Civil & BTP'
  | 'Génie Énergétique & Nucléaire'
  // ── 3. Sciences Médicales et de la Santé ──────────────────────────────────
  | 'Médecine Clinique'
  | 'Soins & Paramédical'
  | 'Sciences Pharmaceutiques'
  | 'Odontologie & Santé Bucco-dentaire'
  | 'Santé Publique & Prévention'
  // ── 4. Sciences Humaines, Sociales et Gouvernance ─────────────────────────
  | 'Droit & Justice'
  | 'Économie & Finance'
  | 'Ressources Humaines & Management'
  | 'Psychologie & Sociologie'
  | 'Enseignement & Recherche'
  // ── 5. Arts, Médias, Culture et Design ────────────────────────────────────
  | 'Arts Visuels & Plastiques'
  | 'Cinéma, Audiovisuel & Spectacle'
  | 'Design & Architecture'
  | 'Information, Médias & Édition'
  | 'Industrie du Divertissement & Jeu Vidéo'
  // ── 6. Commerce, Logistique et Services ───────────────────────────────────
  | 'Commerce & Vente'
  | 'Marketing & Communication'
  | 'Transport & Logistique'
  | 'Hôtellerie, Restauration & Tourisme'
  | 'Services Généraux & Sécurité'
  // ── 7. Agriculture, Ressources Naturelles et Environnement ────────────────
  | 'Agriculture & Élevage'
  | 'Sylviculture & Pêche'
  | 'Environnement & Développement Durable'
  | 'Extraction & Mines';

export interface CategoryMeta {
  label: JobCategory;
  group: MainDomain;
  icon: string;
  color: string;
  textColor: string;
  count: number;
  jobs: string[]; // Liste des métiers/postes associés
}

export const MAIN_DOMAINS: MainDomain[] = [
  '1. Sciences Exactes, Formelles et Naturelles',
  '2. Ingénierie, Technologies et Informatique',
  '3. Sciences Médicales et de la Santé',
  '4. Sciences Humaines, Sociales et Gouvernance',
  '5. Arts, Médias, Culture et Design',
  '6. Commerce, Logistique et Services',
  '7. Agriculture, Ressources Naturelles et Environnement',
];

export const CATEGORY_GROUPS = MAIN_DOMAINS;

export const JOB_CATEGORIES: CategoryMeta[] = [
  // ── 1. Sciences Exactes, Formelles et Naturelles
  {
    label: 'Mathématiques & Logique',
    group: '1. Sciences Exactes, Formelles et Naturelles',
    icon: '📐',
    color: 'bg-blue-50',
    textColor: 'text-blue-600',
    count: 1420,
    jobs: ['Mathématicien', 'Statisticien', 'Actuaire', 'Cryptologue', 'Data Analyst']
  },
  {
    label: 'Physique & Astronomie',
    group: '1. Sciences Exactes, Formelles et Naturelles',
    icon: '🌌',
    color: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    count: 850,
    jobs: ['Physicien', 'Astrophysicien', 'Chercheur en nanotechnologie', 'Météorologue', 'Acousticien']
  },
  {
    label: 'Chimie & Matière',
    group: '1. Sciences Exactes, Formelles et Naturelles',
    icon: '🧪',
    color: 'bg-violet-50',
    textColor: 'text-violet-600',
    count: 920,
    jobs: ['Chimiste', 'Ingénieur chimiste', 'Technicien de laboratoire', 'Aromaticien', 'Spécialiste des matériaux']
  },
  {
    label: "Sciences de la Terre et de l'Univers",
    group: '1. Sciences Exactes, Formelles et Naturelles',
    icon: '🌍',
    color: 'bg-cyan-50',
    textColor: 'text-cyan-600',
    count: 640,
    jobs: ['Géologue', 'Océanographe', 'Sismologue', 'Volcanologue', 'Géomaticien']
  },
  {
    label: 'Sciences du Vivant (Biologie)',
    group: '1. Sciences Exactes, Formelles et Naturelles',
    icon: '🔬',
    color: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    count: 1150,
    jobs: ['Biologiste', 'Généticien', 'Zoologiste', 'Botaniste', 'Microbiologiste']
  },

  // ── 2. Ingénierie, Technologies et Informatique
  {
    label: 'Informatique & Numérique',
    group: '2. Ingénierie, Technologies et Informatique',
    icon: '💻',
    color: 'bg-blue-50',
    textColor: 'text-blue-600',
    count: 5820,
    jobs: ['Développeur Full-Stack', 'Ingénieur DevOps', 'Architecte Cloud', 'Expert en cybersécurité', 'Ingénieur en Intelligence Artificielle']
  },
  {
    label: 'Génie Mécanique & Matériaux',
    group: '2. Ingénierie, Technologies et Informatique',
    icon: '⚙️',
    color: 'bg-slate-50',
    textColor: 'text-slate-600',
    count: 1740,
    jobs: ['Ingénieur mécanique', 'Concepteur CAO', 'Technicien de maintenance industrielle', 'Opérateur sur machine à commande numérique (CN)']
  },
  {
    label: 'Génie Électrique & Électronique',
    group: '2. Ingénierie, Technologies et Informatique',
    icon: '⚡',
    color: 'bg-amber-50',
    textColor: 'text-amber-600',
    count: 1390,
    jobs: ['Ingénieur électronicien', 'Électrotechnicien', 'Technicien câbleur', 'Concepteur de circuits intégrés', 'Automaticien']
  },
  {
    label: 'Génie Civil & BTP',
    group: '2. Ingénierie, Technologies et Informatique',
    icon: '🏗️',
    color: 'bg-stone-50',
    textColor: 'text-stone-600',
    count: 2450,
    jobs: ['Ingénieur génie civil', 'Architecte', 'Chef de chantier', 'Conducteur de travaux', 'Géomètre-topographe']
  },
  {
    label: 'Génie Énergétique & Nucléaire',
    group: '2. Ingénierie, Technologies et Informatique',
    icon: '🔋',
    color: 'bg-yellow-50',
    textColor: 'text-yellow-600',
    count: 980,
    jobs: ['Ingénieur en énergies renouvelables', 'Thermicien', 'Ingénieur sûreté nucléaire', "Technicien d'exploitation de centrale"]
  },

  // ── 3. Sciences Médicales et de la Santé
  {
    label: 'Médecine Clinique',
    group: '3. Sciences Médicales et de la Santé',
    icon: '🏥',
    color: 'bg-red-50',
    textColor: 'text-red-500',
    count: 3100,
    jobs: ['Médecin généraliste', 'Chirurgien', 'Anesthésiste-réanimateur', 'Pédiatre', 'Psychiatre', 'Cardiologue']
  },
  {
    label: 'Soins & Paramédical',
    group: '3. Sciences Médicales et de la Santé',
    icon: '🩺',
    color: 'bg-rose-50',
    textColor: 'text-rose-500',
    count: 2840,
    jobs: ['Infirmier(ère)', 'Kinésithérapeute', 'Sage-femme', 'Ergothérapeute', 'Manipulateur en électroradiologie']
  },
  {
    label: 'Sciences Pharmaceutiques',
    group: '3. Sciences Médicales et de la Santé',
    icon: '💊',
    color: 'bg-pink-50',
    textColor: 'text-pink-500',
    count: 1260,
    jobs: ['Pharmacien', 'Technicien en formulation', 'Visiteur médical', 'Responsable pharmacovigilance']
  },
  {
    label: 'Odontologie & Santé Bucco-dentaire',
    group: '3. Sciences Médicales et de la Santé',
    icon: '🦷',
    color: 'bg-sky-50',
    textColor: 'text-sky-600',
    count: 890,
    jobs: ['Chirurgien-dentiste', 'Orthodontiste', 'Prothésiste dentaire', 'Assistant dentaire']
  },
  {
    label: 'Santé Publique & Prévention',
    group: '3. Sciences Médicales et de la Santé',
    icon: '🛡️',
    color: 'bg-teal-50',
    textColor: 'text-teal-600',
    count: 730,
    jobs: ['Épidémiologiste', 'Médecin du travail', 'Inspecteur de santé publique', 'Biostatisticien']
  },

  // ── 4. Sciences Humaines, Sociales et Gouvernance
  {
    label: 'Droit & Justice',
    group: '4. Sciences Humaines, Sociales et Gouvernance',
    icon: '⚖️',
    color: 'bg-slate-50',
    textColor: 'text-slate-700',
    count: 1680,
    jobs: ['Avocat', 'Magistrat', 'Notaire', "Juriste d'entreprise", 'Greffier', 'Huissier de justice']
  },
  {
    label: 'Économie & Finance',
    group: '4. Sciences Humaines, Sociales et Gouvernance',
    icon: '📈',
    color: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    count: 3420,
    jobs: ['Économiste', 'Analyste financier', 'Contrôleur de gestion', 'Trader', "Banquier d'affaires"]
  },
  {
    label: 'Ressources Humaines & Management',
    group: '4. Sciences Humaines, Sociales et Gouvernance',
    icon: '👥',
    color: 'bg-teal-50',
    textColor: 'text-teal-600',
    count: 2560,
    jobs: ['Directeur des ressources humaines (DRH)', 'Chargé de recrutement', 'Consultant en management', 'Manager de transition']
  },
  {
    label: 'Psychologie & Sociologie',
    group: '4. Sciences Humaines, Sociales et Gouvernance',
    icon: '🧠',
    color: 'bg-purple-50',
    textColor: 'text-purple-600',
    count: 1140,
    jobs: ['Psychologue clinicien', 'Neuropsychologue', 'Sociologue', 'Ergonome', 'Éducateur spécialisé']
  },
  {
    label: 'Enseignement & Recherche',
    group: '4. Sciences Humaines, Sociales et Gouvernance',
    icon: '🎓',
    color: 'bg-blue-50',
    textColor: 'text-blue-600',
    count: 2190,
    jobs: ['Professeur des écoles', 'Enseignant-chercheur', 'Formateur professionnel', 'Ingénieur pédagogique', "Inspecteur de l'Éducation nationale"]
  },

  // ── 5. Arts, Médias, Culture et Design
  {
    label: 'Arts Visuels & Plastiques',
    group: '5. Arts, Médias, Culture et Design',
    icon: '🎨',
    color: 'bg-pink-50',
    textColor: 'text-pink-600',
    count: 760,
    jobs: ['Artiste peintre', 'Sculpteur', 'Photographe', 'Conservateur de musée', 'Galeriste']
  },
  {
    label: 'Cinéma, Audiovisuel & Spectacle',
    group: '5. Arts, Médias, Culture et Design',
    icon: '🎬',
    color: 'bg-purple-50',
    textColor: 'text-purple-600',
    count: 1320,
    jobs: ['Réalisateur', 'Cadreur', 'Ingénieur du son', 'Scénariste', 'Acteur/Comédien', 'Régisseur']
  },
  {
    label: 'Design & Architecture',
    group: '5. Arts, Médias, Culture et Design',
    icon: '✏️',
    color: 'bg-orange-50',
    textColor: 'text-orange-500',
    count: 2110,
    jobs: ['Designer industriel', "Architecte d'intérieur", 'Graphiste', 'UX/UI Designer', 'Paysagiste']
  },
  {
    label: 'Information, Médias & Édition',
    group: '5. Arts, Médias, Culture et Design',
    icon: '📰',
    color: 'bg-amber-50',
    textColor: 'text-amber-600',
    count: 1450,
    jobs: ['Journaliste', 'Rédacteur en chef', 'Éditeur', 'Community Manager', 'Attaché de presse']
  },
  {
    label: 'Industrie du Divertissement & Jeu Vidéo',
    group: '5. Arts, Médias, Culture et Design',
    icon: '🎮',
    color: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    count: 1890,
    jobs: ['Game Designer', 'Développeur 3D', 'Animateur 2D/3D', 'Testeur QA', 'Producteur de jeux vidéos']
  },

  // ── 6. Commerce, Logistique et Services
  {
    label: 'Commerce & Vente',
    group: '6. Commerce, Logistique et Services',
    icon: '💼',
    color: 'bg-green-50',
    textColor: 'text-green-600',
    count: 4210,
    jobs: ['Directeur commercial', "Ingénieur d'affaires", 'Chef de produit', 'Vendeur spécialisé', 'Négociateur immobilier']
  },
  {
    label: 'Marketing & Communication',
    group: '6. Commerce, Logistique et Services',
    icon: '📣',
    color: 'bg-orange-50',
    textColor: 'text-orange-500',
    count: 3680,
    jobs: ['Directeur marketing', 'Traffic Manager', 'Growth Hacker', 'Chef de projet événementiel', 'Spécialiste SEO/SEA']
  },
  {
    label: 'Transport & Logistique',
    group: '6. Commerce, Logistique et Services',
    icon: '🚚',
    color: 'bg-sky-50',
    textColor: 'text-sky-600',
    count: 3120,
    jobs: ['Supply Chain Manager', "Responsable d'entrepôt", 'Affréteur', 'Chauffeur routier', 'Pilote de ligne', 'Contrôleur aérien']
  },
  {
    label: 'Hôtellerie, Restauration & Tourisme',
    group: '6. Commerce, Logistique et Services',
    icon: '🏨',
    color: 'bg-rose-50',
    textColor: 'text-rose-500',
    count: 2750,
    jobs: ["Directeur d'hôtel", 'Chef cuisinier', 'Sommelier', 'Agent de voyages', 'Guide conférencier']
  },
  {
    label: 'Services Généraux & Sécurité',
    group: '6. Commerce, Logistique et Services',
    icon: '🛡️',
    color: 'bg-gray-100',
    textColor: 'text-gray-600',
    count: 1940,
    jobs: ['Agent de sécurité', 'Sapeur-pompier', 'Technicien de propreté', "Hôte(sse) d'accueil", "Concierge d'entreprise"]
  },

  // ── 7. Agriculture, Ressources Naturelles et Environnement
  {
    label: 'Agriculture & Élevage',
    group: '7. Agriculture, Ressources Naturelles et Environnement',
    icon: '🌾',
    color: 'bg-lime-50',
    textColor: 'text-lime-700',
    count: 1350,
    jobs: ['Agriculteur', 'Éleveur', 'Chef de culture', 'Conseiller agronome', 'Ouvrier viticole']
  },
  {
    label: 'Sylviculture & Pêche',
    group: '7. Agriculture, Ressources Naturelles et Environnement',
    icon: '🌲',
    color: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    count: 680,
    jobs: ['Garde forestier', 'Technicien forestier', 'Marin-pêcheur', 'Pisciculteur', 'Bûcheron']
  },
  {
    label: 'Environnement & Développement Durable',
    group: '7. Agriculture, Ressources Naturelles et Environnement',
    icon: '🌱',
    color: 'bg-green-50',
    textColor: 'text-green-600',
    count: 1870,
    jobs: ['Ingénieur environnement', 'Conseiller en transition écologique', 'Technicien en traitement des eaux', 'Chargé de mission RSE', 'Écologue']
  },
  {
    label: 'Extraction & Mines',
    group: '7. Agriculture, Ressources Naturelles et Environnement',
    icon: '⛏️',
    color: 'bg-amber-50',
    textColor: 'text-amber-700',
    count: 520,
    jobs: ['Ingénieur minier', "Géologue d'exploration", 'Technicien de forage', 'Opérateur de raffinerie', 'Topographe minier']
  },
];

// ─── Valeurs brutes pour les selects et la validation ────────────────────────
export const ALL_CATEGORY_VALUES: JobCategory[] = JOB_CATEGORIES.map(c => c.label);

// ─── Top 8 catégories d'opportunités à la une sur la page d'accueil ───────────
export const FEATURED_CATEGORIES: JobCategory[] = [
  'Informatique & Numérique',
  'Commerce & Vente',
  'Marketing & Communication',
  'Économie & Finance',
  'Médecine Clinique',
  'Génie Civil & BTP',
  'Design & Architecture',
  'Environnement & Développement Durable',
];
