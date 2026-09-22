// ─────────────────────────────────────────────────────────────────────────────
// NovoRise — Tous les secteurs d'activité du monde
// Source centrale : importer depuis ici dans toute l'app
// ─────────────────────────────────────────────────────────────────────────────

export type JobCategory =
  // ── Technologie & Numérique ──────────────────────────────────────────────
  | 'Tech & IT'
  | 'Développement Logiciel'
  | 'Cybersécurité'
  | 'Intelligence Artificielle & Data'
  | 'Cloud & DevOps'
  | 'Blockchain & Web3'
  | 'Jeux Vidéo & Animation 3D'
  | 'Électronique & Systèmes Embarqués'
  // ── Marketing, Com & Création ────────────────────────────────────────────
  | 'Marketing & Com'
  | 'Design & UX/UI'
  | 'Publicité & Médias'
  | 'Journalisme & Rédaction'
  | 'Photographie & Vidéo'
  | 'Relations Publiques'
  | 'E-commerce & Marketplace'
  // ── Business, Vente & Finance ────────────────────────────────────────────
  | 'Vente & Business'
  | 'Finance & Comptabilité'
  | 'Banque & Assurance'
  | 'Audit & Conseil'
  | 'Immobilier & Construction'
  | 'Import / Export & Commerce International'
  | 'Entrepreneuriat & Startups'
  // ── Ingénierie & Sciences ────────────────────────────────────────────────
  | 'Ingénierie & R&D'
  | 'Génie Civil & BTP'
  | 'Industrie & Production'
  | 'Aéronautique & Spatial'
  | 'Énergie & Environnement'
  | 'Chimie & Matériaux'
  | 'Automobile & Mobilité'
  | 'Agriculture & Agroalimentaire'
  | 'Sciences & Recherche'
  // ── Santé & Social ───────────────────────────────────────────────────────
  | 'Santé & Médecine'
  | 'Pharmacie & Biotechnologie'
  | 'Paramédical & Soins'
  | 'Psychologie & Bien-être'
  | 'Social & Humanitaire'
  | 'Sport & Fitness'
  // ── Éducation & Formation ────────────────────────────────────────────────
  | 'Éducation & Enseignement'
  | 'Formation Professionnelle'
  | 'Recherche Académique'
  // ── Droit, RH & Administration ───────────────────────────────────────────
  | 'Ressources Humaines'
  | 'Juridique & Droit'
  | 'Administration & Gestion'
  | 'Service Client & Support'
  | 'Achats & Supply Chain'
  | 'Qualité & Conformité'
  // ── Art, Culture & Tourisme ──────────────────────────────────────────────
  | 'Art & Culture'
  | 'Musique & Audio'
  | 'Mode & Luxe'
  | 'Tourisme & Hôtellerie'
  | 'Restauration & Food'
  | 'Sport Professionnel & Événementiel'
  // ── Transport & Logistique ───────────────────────────────────────────────
  | 'Transport & Logistique'
  | 'Maritime & Portuaire'
  | 'Aviation & Aéroports'
  // ── Secteur Public & ONG ─────────────────────────────────────────────────
  | 'Secteur Public & Gouvernement'
  | 'ONG & Associations'
  | 'Défense & Sécurité';

// ─── Données enrichies par catégorie ─────────────────────────────────────────
export interface CategoryMeta {
  label: JobCategory;
  icon: string;        // emoji
  color: string;       // bg Tailwind
  textColor: string;   // text Tailwind
  count: number;       // nombre d'offres indicatif
  group: string;       // groupe d'appartenance
}

export const JOB_CATEGORIES: CategoryMeta[] = [
  // ── Technologie & Numérique
  { label: 'Tech & IT',                      icon: '💻', color: 'bg-blue-50',    textColor: 'text-blue-600',   count: 4520, group: 'Technologie & Numérique' },
  { label: 'Développement Logiciel',          icon: '⌨️', color: 'bg-blue-50',    textColor: 'text-blue-600',   count: 3840, group: 'Technologie & Numérique' },
  { label: 'Cybersécurité',                   icon: '🔐', color: 'bg-blue-50',    textColor: 'text-blue-600',   count: 1200, group: 'Technologie & Numérique' },
  { label: 'Intelligence Artificielle & Data',icon: '🤖', color: 'bg-violet-50',  textColor: 'text-violet-600', count: 2760, group: 'Technologie & Numérique' },
  { label: 'Cloud & DevOps',                  icon: '☁️', color: 'bg-sky-50',     textColor: 'text-sky-600',    count: 1980, group: 'Technologie & Numérique' },
  { label: 'Blockchain & Web3',               icon: '⛓️', color: 'bg-indigo-50',  textColor: 'text-indigo-600', count: 560,  group: 'Technologie & Numérique' },
  { label: 'Jeux Vidéo & Animation 3D',       icon: '🎮', color: 'bg-pink-50',    textColor: 'text-pink-600',   count: 780,  group: 'Technologie & Numérique' },
  { label: 'Électronique & Systèmes Embarqués',icon:'🔌', color: 'bg-cyan-50',    textColor: 'text-cyan-600',   count: 640,  group: 'Technologie & Numérique' },
  // ── Marketing, Com & Création
  { label: 'Marketing & Com',                 icon: '📣', color: 'bg-orange-50',  textColor: 'text-orange-500', count: 1840, group: 'Marketing & Création' },
  { label: 'Design & UX/UI',                  icon: '🎨', color: 'bg-pink-50',    textColor: 'text-pink-500',   count: 1340, group: 'Marketing & Création' },
  { label: 'Publicité & Médias',              icon: '📺', color: 'bg-orange-50',  textColor: 'text-orange-500', count: 890,  group: 'Marketing & Création' },
  { label: 'Journalisme & Rédaction',         icon: '✍️', color: 'bg-amber-50',   textColor: 'text-amber-600',  count: 540,  group: 'Marketing & Création' },
  { label: 'Photographie & Vidéo',            icon: '📸', color: 'bg-rose-50',    textColor: 'text-rose-500',   count: 430,  group: 'Marketing & Création' },
  { label: 'Relations Publiques',             icon: '🤝', color: 'bg-orange-50',  textColor: 'text-orange-500', count: 320,  group: 'Marketing & Création' },
  { label: 'E-commerce & Marketplace',        icon: '🛒', color: 'bg-yellow-50',  textColor: 'text-yellow-600', count: 1120, group: 'Marketing & Création' },
  // ── Business, Vente & Finance
  { label: 'Vente & Business',                icon: '💼', color: 'bg-green-50',   textColor: 'text-green-600',  count: 2930, group: 'Business & Finance' },
  { label: 'Finance & Comptabilité',          icon: '💰', color: 'bg-emerald-50', textColor: 'text-emerald-600',count: 1650, group: 'Business & Finance' },
  { label: 'Banque & Assurance',              icon: '🏦', color: 'bg-teal-50',    textColor: 'text-teal-600',   count: 1240, group: 'Business & Finance' },
  { label: 'Audit & Conseil',                 icon: '📊', color: 'bg-green-50',   textColor: 'text-green-600',  count: 870,  group: 'Business & Finance' },
  { label: 'Immobilier & Construction',       icon: '🏗️', color: 'bg-lime-50',    textColor: 'text-lime-700',   count: 760,  group: 'Business & Finance' },
  { label: 'Import / Export & Commerce International', icon: '🌍', color: 'bg-green-50', textColor: 'text-green-600', count: 450, group: 'Business & Finance' },
  { label: 'Entrepreneuriat & Startups',      icon: '🚀', color: 'bg-amber-50',   textColor: 'text-amber-600',  count: 980,  group: 'Business & Finance' },
  // ── Ingénierie & Sciences
  { label: 'Ingénierie & R&D',                icon: '⚙️', color: 'bg-purple-50',  textColor: 'text-purple-600', count: 1120, group: 'Ingénierie & Sciences' },
  { label: 'Génie Civil & BTP',               icon: '🏛️', color: 'bg-stone-50',   textColor: 'text-stone-600',  count: 930,  group: 'Ingénierie & Sciences' },
  { label: 'Industrie & Production',          icon: '🏭', color: 'bg-gray-100',   textColor: 'text-gray-600',   count: 1480, group: 'Ingénierie & Sciences' },
  { label: 'Aéronautique & Spatial',          icon: '✈️', color: 'bg-sky-50',     textColor: 'text-sky-600',    count: 340,  group: 'Ingénierie & Sciences' },
  { label: 'Énergie & Environnement',         icon: '🌱', color: 'bg-green-50',   textColor: 'text-green-600',  count: 760,  group: 'Ingénierie & Sciences' },
  { label: 'Chimie & Matériaux',              icon: '🧪', color: 'bg-violet-50',  textColor: 'text-violet-600', count: 420,  group: 'Ingénierie & Sciences' },
  { label: 'Automobile & Mobilité',           icon: '🚗', color: 'bg-slate-50',   textColor: 'text-slate-600',  count: 680,  group: 'Ingénierie & Sciences' },
  { label: 'Agriculture & Agroalimentaire',   icon: '🌾', color: 'bg-lime-50',    textColor: 'text-lime-700',   count: 540,  group: 'Ingénierie & Sciences' },
  { label: 'Sciences & Recherche',            icon: '🔬', color: 'bg-indigo-50',  textColor: 'text-indigo-600', count: 890,  group: 'Ingénierie & Sciences' },
  // ── Santé & Social
  { label: 'Santé & Médecine',                icon: '🏥', color: 'bg-red-50',     textColor: 'text-red-500',    count: 2100, group: 'Santé & Social' },
  { label: 'Pharmacie & Biotechnologie',      icon: '💊', color: 'bg-pink-50',    textColor: 'text-pink-500',   count: 780,  group: 'Santé & Social' },
  { label: 'Paramédical & Soins',             icon: '🩺', color: 'bg-red-50',     textColor: 'text-red-500',    count: 1430, group: 'Santé & Social' },
  { label: 'Psychologie & Bien-être',         icon: '🧠', color: 'bg-purple-50',  textColor: 'text-purple-600', count: 560,  group: 'Santé & Social' },
  { label: 'Social & Humanitaire',            icon: '❤️', color: 'bg-rose-50',    textColor: 'text-rose-500',   count: 430,  group: 'Santé & Social' },
  { label: 'Sport & Fitness',                 icon: '🏋️', color: 'bg-orange-50',  textColor: 'text-orange-500', count: 380,  group: 'Santé & Social' },
  // ── Éducation & Formation
  { label: 'Éducation & Enseignement',        icon: '🎓', color: 'bg-yellow-50',  textColor: 'text-yellow-600', count: 1240, group: 'Éducation & Formation' },
  { label: 'Formation Professionnelle',       icon: '📚', color: 'bg-amber-50',   textColor: 'text-amber-600',  count: 670,  group: 'Éducation & Formation' },
  { label: 'Recherche Académique',            icon: '🔭', color: 'bg-indigo-50',  textColor: 'text-indigo-600', count: 340,  group: 'Éducation & Formation' },
  // ── Droit, RH & Administration
  { label: 'Ressources Humaines',             icon: '👥', color: 'bg-teal-50',    textColor: 'text-teal-600',   count: 890,  group: 'RH & Administration' },
  { label: 'Juridique & Droit',               icon: '⚖️', color: 'bg-slate-50',   textColor: 'text-slate-600',  count: 540,  group: 'RH & Administration' },
  { label: 'Administration & Gestion',        icon: '🗂️', color: 'bg-gray-100',   textColor: 'text-gray-600',   count: 720,  group: 'RH & Administration' },
  { label: 'Service Client & Support',        icon: '🎧', color: 'bg-blue-50',    textColor: 'text-blue-600',   count: 1560, group: 'RH & Administration' },
  { label: 'Achats & Supply Chain',           icon: '📦', color: 'bg-amber-50',   textColor: 'text-amber-600',  count: 680,  group: 'RH & Administration' },
  { label: 'Qualité & Conformité',            icon: '✅', color: 'bg-green-50',   textColor: 'text-green-600',  count: 430,  group: 'RH & Administration' },
  // ── Art, Culture & Tourisme
  { label: 'Art & Culture',                   icon: '🎭', color: 'bg-rose-50',    textColor: 'text-rose-500',   count: 420,  group: 'Art, Culture & Tourisme' },
  { label: 'Musique & Audio',                 icon: '🎵', color: 'bg-pink-50',    textColor: 'text-pink-500',   count: 310,  group: 'Art, Culture & Tourisme' },
  { label: 'Mode & Luxe',                     icon: '👗', color: 'bg-fuchsia-50', textColor: 'text-fuchsia-600',count: 580,  group: 'Art, Culture & Tourisme' },
  { label: 'Tourisme & Hôtellerie',           icon: '🏨', color: 'bg-cyan-50',    textColor: 'text-cyan-600',   count: 870,  group: 'Art, Culture & Tourisme' },
  { label: 'Restauration & Food',             icon: '🍽️', color: 'bg-orange-50',  textColor: 'text-orange-500', count: 1100, group: 'Art, Culture & Tourisme' },
  { label: 'Sport Professionnel & Événementiel', icon: '🏆', color: 'bg-amber-50', textColor: 'text-amber-600', count: 340,  group: 'Art, Culture & Tourisme' },
  // ── Transport & Logistique
  { label: 'Transport & Logistique',          icon: '🚚', color: 'bg-slate-50',   textColor: 'text-slate-600',  count: 1230, group: 'Transport & Logistique' },
  { label: 'Maritime & Portuaire',            icon: '⚓', color: 'bg-blue-50',    textColor: 'text-blue-600',   count: 290,  group: 'Transport & Logistique' },
  { label: 'Aviation & Aéroports',            icon: '🛫', color: 'bg-sky-50',     textColor: 'text-sky-600',    count: 420,  group: 'Transport & Logistique' },
  // ── Secteur Public & ONG
  { label: 'Secteur Public & Gouvernement',   icon: '🏛️', color: 'bg-slate-50',   textColor: 'text-slate-600',  count: 890,  group: 'Secteur Public & ONG' },
  { label: 'ONG & Associations',              icon: '🌐', color: 'bg-teal-50',    textColor: 'text-teal-600',   count: 430,  group: 'Secteur Public & ONG' },
  { label: 'Défense & Sécurité',              icon: '🛡️', color: 'bg-gray-100',   textColor: 'text-gray-600',   count: 340,  group: 'Secteur Public & ONG' },
];

// ─── Groupes de catégories ────────────────────────────────────────────────────
export const CATEGORY_GROUPS = [
  'Technologie & Numérique',
  'Marketing & Création',
  'Business & Finance',
  'Ingénierie & Sciences',
  'Santé & Social',
  'Éducation & Formation',
  'RH & Administration',
  'Art, Culture & Tourisme',
  'Transport & Logistique',
  'Secteur Public & ONG',
] as const;

// ─── Valeurs brutes pour les selects et la validation ────────────────────────
export const ALL_CATEGORY_VALUES: JobCategory[] = JOB_CATEGORIES.map(c => c.label);

// ─── Top 8 catégories pour la section "Secteurs" de la homepage ──────────────
export const FEATURED_CATEGORIES: JobCategory[] = [
  'Tech & IT',
  'Intelligence Artificielle & Data',
  'Marketing & Com',
  'Vente & Business',
  'Santé & Médecine',
  'Finance & Comptabilité',
  'Ingénierie & R&D',
  'Éducation & Enseignement',
];
