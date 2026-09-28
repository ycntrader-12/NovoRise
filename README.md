# NovoRise — Plateforme Moderne de Recrutement & Job Board Intelligent

<div align="center">

![NovoRise](https://img.shields.io/badge/NovoRise-Job%20Board-2D6BE4?style=for-the-badge&logo=briefcase&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Google%20Gemini-AI%20Power-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Google Auth](https://img.shields.io/badge/Google-Identity%20Services-34A853?style=for-the-badge&logo=google&logoColor=white)
![SQLite / PostgreSQL](https://img.shields.io/badge/Database-SQLite%20%2F%20Postgres-336791?style=for-the-badge&logo=postgresql&logoColor=white)

**La plateforme nouvelle génération qui connecte les talents ambitieux et les entreprises innovantes, propulsée par l'Intelligence Artificielle.**

[Fonctionnalités](#-fonctionnalités) • [Architecture](#-architecture) • [Stack Technique](#-stack-technique) • [Démarrage Rapide](#-démarrage-rapide) • [Google Auth](#-authentification-google) • [API](#-api-endpoints)

</div>

---

## ✨ Fonctionnalités

### 🎯 Pour les Candidats
- **Moteur de recherche & filtres multi-critères** — Recherche en direct par intitulé, compétences, localisation, salaire et mots-clés.
- **Filtres avancés** — Secteurs (*Tech & IT*, *Design & Créa*, *Marketing*, *Finance*, etc.), types de contrat (*CDI*, *CDD*, *Freelance*, *Stage*) et modalités (*Télétravail*, *Hybride*, *Sur site*).
- **Fiche détaillée de poste** — Description complète, compétences requises, salaire, type de contrat et fiche entreprise.
- **Candidature rapide** — Téléversement de CV et lettre de motivation en temps réel.
- **✨ Assistant IA de Lettre de Motivation (Gemini)** — Génération instantanée d'une lettre de motivation sur-mesure adaptée à l'offre ciblée et au profil du candidat.
- **Favoris & Sauvegardes** — Mise en favoris des offres préférées avec persistance locale et compteur dans le dashboard.
- **Dashboard candidat dédié** — Suivi en temps réel de toutes ses candidatures (*En attente*, *En cours*, *Acceptée*, *Refusée*) et gestion du profil.

### 🏢 Pour les Recruteurs
- **Publication d'offres intuitive** — Formulaire complet de publication d'annonces avec prévisualisation.
- **✨ Générateur d'Annonces par IA (Gemini)** — Rédaction automatique de descriptions de poste percutantes et structurées à partir du titre et des mots-clés.
- **Dashboard recruteur complet** — Pilotage des offres publiées (Actif / Pause / Clôturé), statistiques de vues et candidatures reçues.
- **Gestion du pipeline de candidats** — Changement de statut des candidatures en un clic avec notifications.
- **Profil entreprise** — Logo, site web, bio et coordonnées.

### 👑 Portail Administration Dédié (`:3007`)
- **Portail Admin indépendant** accessible sur le port dédié **3007** (`http://localhost:3007`).
- **Tableau de bord KPI en direct** — Total utilisateurs, offres actives, candidatures déposées, taux de conversion.
- **Modération des offres** — Consultation, validation, mise en pause ou suppression d'annonces.
- **Gestion des utilisateurs** — Activation, suspension et suppression de comptes candidats ou recruteurs.

### 🔐 Authentification & Sécurité
- **Inscription & Connexion standard** avec validation d'email (jeton sécurisé UUID v4 valable 24h).
- **Inscription & Connexion Directe avec Google** — Conforme aux standards **Google Identity Services (GIS)** et **OpenID Connect**.
- **Authentification sans friction** — Ouverture de la fenêtre native Google, récupération du profil réel (nom, email, photo) et connexion immédiate.
- **Vérification cryptographique backend** via la bibliothèque officielle `google-auth-library` (`OAuth2Client`).
- **Mot de passe oublié** — Réinitialisation par jeton temporaire expirant en 1 heure.
- **Sessions sécurisées par JWT** — Signature HS256 côté serveur avec expiration configurable.

---

## 🏗️ Architecture des Services

Le projet est structuré en **3 services synchronisés** :

```
NovoRise/
├── 🌐 Frontend Public   →  http://localhost:3005  (Vite + React 18 + Tailwind)
├── ⚙️  Backend API       →  http://localhost:3006  (Express + TypeScript + Bull/Redis + Gemini)
└── 🔐 Portail Admin     →  http://localhost:3007  (Interface d'administration dédiée)
```

### Arborescence détaillée

```
NovoRise/
├── frontend (racine)          → React 18 + Vite + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── api/               → client.ts, auth.api.ts, jobs.api.ts, ai.api.ts, admin.api.ts
│   │   ├── context/           → AuthContext.tsx (état global auth & session)
│   │   ├── components/
│   │   │   ├── auth/          → AuthFlowModal.tsx, VerifyEmailPage.tsx, GoogleCallbackPage.tsx
│   │   │   └── dashboard/     → CandidateDashboard.tsx, RecruiterDashboard.tsx, AdminDashboardPortal.tsx
│   │   └── types/             → auth.ts, jobs.ts, admin.ts
│   ├── index.html             → Application publique principale
│   ├── admin.html             → Portail administrateur dédié
│   └── novorise_job_board.tsx → Orchestrateur principal de l'application
│
└── backend/                   → Express 5 + TypeScript
    └── src/
        ├── routes/            → auth.routes.ts, jobs.routes.ts, applications.routes.ts, admin.routes.ts, ai.routes.ts
        ├── services/          → auth.service.ts, ai.service.ts, email.queue.ts
        ├── workers/           → email.worker.ts (Nodemailer SMTP asynchrone)
        ├── middleware/        → auth.middleware.ts (JWT verify + requireRole)
        ├── config/            → passport.ts (Google OAuth 2.0 Strategy)
        └── db/                → pool.ts (Adapter SQLite hybride / Supabase PostgreSQL)
```

---

## 🛠️ Stack Technique

### Frontend
| Technologie | Version | Rôle |
| :--- | :--- | :--- |
| **React** | 18.3 | Bibliothèque UI interactive |
| **TypeScript** | 5.7 | Typage statique strict |
| **Vite** | 6.1 | Bundler ultra-rapide et serveur de dev multi-entrées |
| **Tailwind CSS** | 3.4 | Framework utilitaire CSS responsive |
| **Lucide React** | 0.475 | Pack d'icônes vectorielles modernes |
| **Google Identity Services** | v1 | SDK officiel Google Sign-In |

### Backend
| Technologie | Version | Rôle |
| :--- | :--- | :--- |
| **Express** | 5.2 | Serveur d'API REST |
| **google-auth-library** | 9.x | Validation cryptographique des jetons d'identité Google |
| **@google/genai** | — | Intégration de l'Intelligence Artificielle Google Gemini |
| **better-sqlite3** | 13.0 | Moteur de base de données ultra-rapide pour le dev local |
| **pg (PostgreSQL)** | 8.23 | Connecteur PostgreSQL pour production (Supabase) |
| **jsonwebtoken** | 9.0 | Génération et vérification des jetons de session JWT |
| **bcryptjs** | 3.0 | Hachage sécurisé des mots de passe (12 tours) |
| **passport / passport-google-oauth20** | 0.7 / 2.0 | Stratégie d'authentification OAuth 2.0 |
| **Bull + Redis** | 4.16 / 6.0 | File d'attente asynchrone pour les envois d'emails |
| **Nodemailer** | 10.0 | Client SMTP avec templates HTML |

---

## 🚀 Démarrage Rapide

### Prérequis
- [Node.js](https://nodejs.org/) v18 ou plus récent
- Système Windows, macOS ou Linux

### 1. Cloner le dépôt

```bash
git clone https://github.com/ycntrader-12/NovoRise.git
cd NovoRise
```

### 2. Installer les dépendances

```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

### 3. Fichiers d'environnement

Créez le fichier `.env` à la racine :
```env
VITE_API_URL=http://localhost:3006
VITE_GOOGLE_CLIENT_ID=835055005645-14vp9a34co61gd6f4em3l0k5rh86fq2r.apps.googleusercontent.com
```

Créez le fichier `backend/.env` :
```env
PORT=3006
FRONTEND_URL=http://localhost:3005
JWT_SECRET=votre_super_secret_jwt_min_32_caracteres
JWT_EXPIRES_IN=7d

# Google OAuth 2.0
GOOGLE_CLIENT_ID=835055005645-14vp9a34co61gd6f4em3l0k5rh86fq2r.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=votre_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3006/api/auth/google/callback

# Google Gemini AI API
GEMINI_API_KEY=votre_cle_gemini_api
GOOGLE_API_KEY=votre_cle_gemini_api

# Base de données locale (SQLite activé automatiquement par défaut)
# DATABASE_URL=postgresql://... (optionnel pour Supabase)
```

### 4. Démarrage des services

#### ⚡ Option 1 : Démarrage en 1 clic (Windows)
Double-cliquez simplement sur le script :
```cmd
start_all.bat
```
Ce script libère automatiquement les ports 3005, 3006 et 3007, démarre les trois processus et ouvre vos navigateurs !

#### 🛠️ Option 2 : Démarrage manuel

```bash
# Terminal 1 — Backend API (port 3006)
cd backend
npm run dev

# Terminal 2 — Frontend Public (port 3005)
npm run dev

# Terminal 3 — Portail Admin (port 3007)
npm run dev:admin
```

---

## 🔑 Authentification Google

NovoRise applique les **standards officiels Google Identity Services (GIS)** :

### 1. Inscription & Connexion Directe en 1 clic
- Dans la modale d'inscription ou de connexion, cliquez sur le bouton officiel Google.
- Google affiche l'invite native de sélection de compte.
- NovoRise valide l'ID Token via `google-auth-library` et connecte l'utilisateur avec son vrai profil Google.

### 2. Configuration dans Google Cloud Console
Pour autoriser votre environnement local, configurez votre Client OAuth dans [Google Cloud Console — Identifiants](https://console.cloud.google.com/apis/credentials) :

1. **Origines JavaScript autorisées** :
   ```
   http://localhost:3005
   http://localhost:3006
   ```
2. **URIs de redirection autorisés** :
   ```
   http://localhost:3006/api/auth/google/callback
   http://localhost:3005/api/auth/google/callback
   ```

---

## 📡 API Endpoints

### 🔐 Authentification (`/api/auth`)
| Méthode | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/register` | Inscription email + envoi jeton de validation |
| `GET` | `/verify?token=` | Confirmation d'email par jeton UUID |
| `POST` | `/login` | Connexion email/mot de passe → JWT |
| `POST` | `/google/direct` | Connexion/Inscription directe Google avec validation de jeton |
| `GET` | `/google` | Initiation de la redirection OAuth Google |
| `GET` | `/google/callback` | Callback OAuth Google → JWT |
| `POST` | `/forgot-password` | Demande de réinitialisation de mot de passe |
| `POST` | `/reset-password` | Réinitialisation avec jeton valide |
| `GET` | `/me` | Profil de l'utilisateur connecté 🔒 |
| `PATCH` | `/profile` | Mise à jour des informations de profil 🔒 |

### 💼 Offres d'emploi (`/api/jobs`)
| Méthode | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Liste publique des offres actives |
| `GET` | `/:id` | Détail d'une offre spécifique |
| `GET` | `/mine` | Offres créées par le recruteur connecté 🔒 |
| `POST` | `/` | Création d'une nouvelle offre 🔒 (Recruteur) |
| `PUT` | `/:id` | Modification d'une offre 🔒 (Recruteur) |
| `DELETE` | `/:id` | Suppression d'une offre 🔒 (Recruteur) |

### 📄 Candidatures (`/api/applications`)
| Méthode | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/` | Dépôt d'une candidature avec CV 🔒 (Candidat) |
| `GET` | `/me` | Liste de mes candidatures 🔒 (Candidat) |
| `GET` | `/job/:jobId` | Candidatures reçues pour une offre 🔒 (Recruteur) |
| `PATCH` | `/:id/status` | Mise à jour du statut d'une candidature 🔒 (Recruteur) |

### 🤖 Intelligence Artificielle (`/api/ai`)
| Méthode | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/generate-job-description` | Génération IA Gemini d'une fiche de poste complète |
| `POST` | `/generate-cover-letter` | Rédaction IA Gemini d'une lettre de motivation ciblée |

### 👑 Administration (`/api/admin`)
| Méthode | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/stats` | Statistiques globales & KPIs de la plateforme 🔒 |
| `GET` | `/users` | Liste complète de tous les utilisateurs 🔒 |
| `PATCH` | `/users/:id/status` | Modification du statut utilisateur (Actif / Suspendu) 🔒 |
| `GET` | `/jobs` | Liste globale de toutes les annonces publiées 🔒 |
| `PATCH` | `/jobs/:id/status` | Modération du statut de l'offre 🔒 |
| `DELETE` | `/jobs/:id` | Suppression administrative d'une offre 🔒 |

> 🔒 = Requiert un en-tête `Authorization: Bearer <token_jwt>`

---

## 🔒 Sécurité & Bonnes Pratiques

- **Hashage fort** : Mots de passe hashés avec **bcrypt** (12 rounds).
- **Vérification Google cryptographique** : Utilisation de la clé publique Google via `google-auth-library` sans stockage de secrets tiers.
- **Protection CSRF / CORS** : CORS restreint aux origines autorisées (`3005`, `3006`, `3007`).
- **Isolation du Portail Admin** : Serveur et middleware dédiés sur le port 3007 avec barrières de rôle strictes.
- **Envois asynchrones** : Notifications email gérées hors thread principal par worker Bull/Redis.
- **Protection des données sensibles** : Tous les identifiants et clés API sont isolés dans des fichiers `.env` ignorés par Git.

---

## 📄 Licence

Ce projet est sous licence MIT. Développé pour **NovoRise** — Tous droits réservés © 2026.
