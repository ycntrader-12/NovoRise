'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Search, 
  MapPin, 
  Sun, 
  Moon, 
  Bookmark, 
  LogOut,
  Briefcase,
  Layers,
  LayoutDashboard
} from 'lucide-react';

/**
 * Sanitisation stricte des requêtes de recherche (Anti-XSS & Injection)
 */
const sanitizeSearchInput = (input: string): string => {
  return input
    .replace(/[<>'"`;()&$]/g, '') // Éradication des caractères d'injection script / DOM-based XSS
    .replace(/\0/g, '')           // Suppression des null-bytes
    .trim()
    .slice(0, 100);              // Limitation de longueur défensive
};

interface NovoRiseHomePageProps {
  onSearchSubmit?: (query: { role: string; location: string }) => void;
  onLogout?: () => void;
}

export const NovoRiseHomePage: React.FC<NovoRiseHomePageProps> = ({
  onSearchSubmit,
  onLogout,
}) => {
  // ─── 1. Gestion du Thème (Clair / Sombre avec persistance localStorage) ───────
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    // Détection de la préférence système ou du choix enregistré
    const savedTheme = localStorage.getItem('novorise_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = savedTheme ? savedTheme === 'dark' : prefersDark;

    setIsDarkMode(initialDark);
    if (initialDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('novorise_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('novorise_theme', 'light');
    }
  };

  // ─── 2. Contrôle Sécurisé des Champs de Recherche ───────────────────────────
  const [roleQuery, setRoleQuery] = useState<string>('');
  const [locationQuery, setLocationQuery] = useState<string>('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const trendingTags = [
    'Développeur React',
    'UI/UX Designer',
    'Data Scientist',
    'Casablanca',
    'Remote',
  ];

  const handleTagClick = (tag: string) => {
    setActiveTag(tag);
    if (tag === 'Casablanca' || tag === 'Remote') {
      setLocationQuery(tag);
    } else {
      setRoleQuery(tag);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanRole = sanitizeSearchInput(roleQuery);
    const cleanLocation = sanitizeSearchInput(locationQuery);

    if (onSearchSubmit) {
      onSearchSubmit({ role: cleanRole, location: cleanLocation });
    } else {
      console.log('[SECURE_SEARCH_EXECUTION]', { role: cleanRole, location: cleanLocation });
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#FCFBF8] text-slate-900 dark:bg-[#0B1120] dark:text-white transition-colors duration-300 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* ─── A. Header / Navbar ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FCFBF8]/85 dark:bg-[#0B1120]/85 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo NovoRise */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 dark:bg-gradient-to-tr dark:from-cyan-500 dark:to-indigo-500 flex items-center justify-center text-white shadow-md dark:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-transform group-hover:scale-105">
              <TrendingUp className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Novo<span className="text-indigo-600 dark:text-cyan-400">Rise</span>
            </span>
          </div>

          {/* Navigation Centrale */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a 
              href="#jobs" 
              className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors py-1 relative group"
            >
              <Briefcase className="w-4 h-4 opacity-70 group-hover:opacity-100" />
              <span>Trouver un emploi</span>
            </a>
            <a 
              href="#sectors" 
              className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors py-1 relative group"
            >
              <Layers className="w-4 h-4 opacity-70 group-hover:opacity-100" />
              <span>Secteurs d'activité</span>
            </a>
            <a 
              href="#dashboard" 
              className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors py-1 relative group"
            >
              <LayoutDashboard className="w-4 h-4 opacity-70 group-hover:opacity-100" />
              <span>Mon Dashboard (Candidat)</span>
            </a>
          </nav>

          {/* Actions Droite */}
          <div className="flex items-center gap-3.5">
            
            {/* Bouton Favoris */}
            <button 
              type="button"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-300/80 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all shadow-sm hover:shadow active:scale-95"
            >
              <Bookmark className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400 fill-indigo-600/20 dark:fill-cyan-400/20" />
              <span>Favoris</span>
              <span className="ml-0.5 px-1.5 py-0.2 bg-indigo-100 dark:bg-cyan-950 text-indigo-700 dark:text-cyan-300 rounded-full text-[11px] font-extrabold">
                1
              </span>
            </button>

            {/* Bouton Bascule Mode Clair / Sombre */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Basculer le thème"
              className="p-2.5 rounded-xl border border-slate-300/80 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-slate-700 dark:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 dark:shadow-[0_0_12px_rgba(6,182,212,0.25)] transition-all cursor-pointer active:scale-95"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400 animate-spin-once" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Badge Profil Utilisateur */}
            <div className="hidden sm:flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-violet-600 text-white font-bold flex items-center justify-center text-sm shadow-sm dark:shadow-[0_0_10px_rgba(139,92,246,0.5)]">
                Y
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  Yacine El Idrissi
                </div>
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider bg-violet-100 text-violet-700 dark:bg-violet-950/70 dark:text-violet-300 border border-violet-200/50 dark:border-violet-800/50">
                  CANDIDAT
                </span>
              </div>
              <button
                type="button"
                onClick={onLogout}
                title="Déconnexion sécurisée"
                className="p-1.5 ml-1 text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* ─── B & C & D. Hero & Barre de Recherche & Tendances ───────────────── */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24 max-w-5xl mx-auto text-center w-full">
        
        {/* Hero Section */}
        <div className="max-w-3xl space-y-5 mb-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-tight">
            Trouvez l'emploi qui <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-cyan-400 dark:via-sky-400 dark:to-indigo-400 bg-clip-text text-transparent">
              vous correspond.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Découvrez des milliers d'offres d'emploi dans les meilleures entreprises. Votre prochaine opportunité vous attend.
          </p>
        </div>

        {/* Barre de Recherche Flottante (Cyberpunk Glow en Dark Mode) */}
        <div className="w-full max-w-4xl relative">
          
          {/* Effet lumineux d'arrière-plan en Dark Mode */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-violet-500/20 blur-xl opacity-0 dark:opacity-100 transition-opacity pointer-events-none" />

          <form 
            onSubmit={handleSearch}
            className="relative bg-white dark:bg-[#0E172A] border border-slate-200/90 dark:border-cyan-500/40 rounded-full p-2.5 sm:p-3 shadow-xl dark:shadow-[0_0_30px_rgba(6,182,212,0.25)] flex flex-col md:flex-row items-center gap-2 transition-all duration-300"
          >
            
            {/* 1. Input Métier */}
            <div className="flex-1 w-full flex items-center gap-3 px-4 py-2">
              <Search className="w-5 h-5 text-slate-400 dark:text-cyan-400 flex-shrink-0" />
              <div className="text-left w-full">
                <label htmlFor="search-role" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                  Métier
                </label>
                <input
                  id="search-role"
                  type="text"
                  value={roleQuery}
                  onChange={(e) => setRoleQuery(e.target.value)}
                  placeholder="UI/UX Designer"
                  autoComplete="off"
                  className="w-full bg-transparent text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
                />
              </div>
            </div>

            {/* 2. Séparateur Vertical */}
            <div className="hidden md:block h-9 w-[1px] bg-slate-200 dark:bg-slate-800" />

            {/* 3. Input Localisation */}
            <div className="flex-1 w-full flex items-center gap-3 px-4 py-2">
              <MapPin className="w-5 h-5 text-slate-400 dark:text-indigo-400 flex-shrink-0" />
              <div className="text-left w-full">
                <label htmlFor="search-location" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                  Localisation
                </label>
                <input
                  id="search-location"
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="Ville ou code postal"
                  autoComplete="off"
                  className="w-full bg-transparent text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
                />
              </div>
            </div>

            {/* Bouton Rechercher */}
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3.5 rounded-full font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-gradient-to-r dark:from-indigo-600 dark:to-cyan-600 hover:dark:from-indigo-500 hover:dark:to-cyan-500 shadow-md hover:shadow-lg dark:shadow-[0_0_20px_rgba(99,102,241,0.5)] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Rechercher</span>
            </button>
          </form>
        </div>

        {/* D. Section Tendances (Tags cliquables) */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-bold text-slate-700 dark:text-slate-300 mr-1">Tendances :</span>
          {trendingTags.map((tag) => {
            const isSelected = activeTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className={`px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-cyan-400 dark:bg-cyan-950/40 dark:text-cyan-300 dark:shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                    : 'border-slate-300/80 dark:border-slate-700/80 bg-transparent hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white dark:hover:border-cyan-500/50'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

      </main>

      {/* Footer Minimaliste Sécurisé */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 NovoRise. Tous droits réservés.</p>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Plateforme Sécurisée (Zero-Trust & GIS)
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default NovoRiseHomePage;
