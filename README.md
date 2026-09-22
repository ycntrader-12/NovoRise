# NovoRise — Plateforme Moderne de Recrutement & Job Board

<div align="center">

![NovoRise](https://img.shields.io/badge/NovoRise-Job%20Board-6366f1?style=for-the-badge&logo=briefcase&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-Bull%20Queue-DC382D?style=for-the-badge&logo=redis&logoColor=white)

**La plateforme nouvelle génération qui connecte talents ambitieux et entreprises innovantes.**

</div>

---

## ✨ Fonctionnalités

### 🎯 Pour les Candidats
- **Moteur de recherche & filtres multi-critères** — Recherche en direct par intitulé, compétences et localisation
- **Filtres avancés** — Par secteur (*Tech & IT*, *Marketing & Com*, *Vente & Business*, *Ingénierie & R&D*), contrat (*CDI*, *CDD*, *Freelance*, *Stage*) et modalité (*Remote*, *Hybride*, *Présentiel*)
- **Fiche détaillée de poste** — Missions clés, profil requis, avantages et rémunération
- **Candidature rapide** — Formulaire avec téléversement de CV et confirmation interactive
- **Favoris** — Enregistrement des offres préférées avec compteur
- **Dashboard candidat** — Suivi de toutes ses candidatures et statuts en temps réel

### 🏢 Pour les Recruteurs
- **Publication d'offres** — Formulaire complet de diffusion d'annonces
- **Dashboard recruteur** — Gestion des offres (Actif / Pause / Clôturé) et des candidatures reçues
- **Notifications email** — Alerte automatique à chaque nouvelle candidature

### 🔐 Authentification Complète
- **Inscription** avec confirmation email (lien tokenisé UUID v4, valable 24h)
- **Connexion** email/mot de passe ou **Google OAuth 2.0**
- **Mot de passe oublié** — Lien de reset expirant en 1 heure
- **JWT** signé côté serveur, stocké côté client, revalidé à chaque session

---

## 🏗️ Architecture

```
NovoRise/
├── frontend (racine)          → React 18 + Vite + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── api/               → Couche HTTP (client fetch + auth/jobs/applications)
│   │   ├── context/           → AuthContext branché sur l'API réelle
│   │   ├── components/
│   │   │   ├── auth/          → AuthFlowModal, VerifyEmailPage, GoogleCallbackPage
│   │   │   └── dashboard/     → CandidateDashboard, RecruiterDashboard
│   │   └── types/             → Types TypeScript partagés
│   └── novorise_job_board.tsx → App principale + routing URL simple
│
└── backend/                   → Express 4 + TypeScript
    └── src/
        ├── routes/            → auth, jobs, applications
        ├── services/          → auth.service (bcrypt/JWT/UUID), email.queue (Bull)
        ├── workers/           → email.worker (Nodemailer SMTP)
        ├── middleware/        → JWT requireAuth + requireRole
        ├── config/            → passport.ts (Google OAuth)
        └── db/                → pool PostgreSQL + migrations.sql
```

### Flux d'architecture

```
Client (React)
    │ HTTPS
    ▼
API Routes (Express :3006)
    │  POST /register · POST /login · POST /reset-password
    ▼
Auth Service
    ├── Hash bcrypt (12 rounds) + JWT signé (HS256)
    ├── UUID v4 → token email
    │
    ├──► PostgreSQL (Supabase)
    │      users · job_posts · applications
    │
    └──► File de tâches (Bull/Redis)
             Job: type + destinataire + token
             Retry exponentiel · 3 tentatives
                  │
                  ▼
             SMTP Worker (Nodemailer)
             Port 587 · STARTTLS · Mailtrap
                  │
         ┌────────┼────────┐
         ▼        ▼        ▼
    Confirmation  Reset   Notif
      email       mdp   recruteur
```

---

## 🛠️ Stack Technique

### Frontend
| Technologie | Version | Usage |
|-------------|---------|-------|
| **React** | 18.3 | UI Framework |
| **TypeScript** | 5.7 | Typage statique |
| **Vite** | 6.1 | Bundler & Dev Server (port 3005) |
| **Tailwind CSS** | 3.4 | Styling |
| **Lucide React** | 0.475 | Icônes |

### Backend
| Technologie | Version | Usage |
|-------------|---------|-------|
| **Express** | 4 | HTTP Server (port 3006) |
| **PostgreSQL / Supabase** | — | Base de données principale |
| **bcryptjs** | — | Hash mots de passe (12 rounds) |
| **jsonwebtoken** | — | JWT HS256 (sign/verify) |
| **uuid** | — | Tokens email UUID v4 |
| **Bull + Redis** | — | File de tâches asynchrones |
| **Nodemailer** | — | Envoi SMTP port 587 STARTTLS |
| **passport-google-oauth20** | — | Google OAuth 2.0 |
| **express-validator** | — | Validation des inputs |

---

## 🚀 Démarrage Rapide

### Prérequis

- [Node.js](https://nodejs.org/) v18+
- [Redis](https://redis.io/) installé localement (port 6379)
- Compte [Supabase](https://supabase.com/) (PostgreSQL gratuit)
- Compte [Mailtrap](https://mailtrap.io/) (SMTP sandbox gratuit)
- Compte [Google Cloud Console](https://console.cloud.google.com/) pour OAuth

### 1. Cloner le dépôt

```bash
git clone https://github.com/ycntrader-12/NovoRise.git
cd NovoRise
```

### 2. Installer les dépendances

```bash
# Dépendances frontend
npm install

# Dépendances backend
cd backend
npm install
cd ..
```

### 3. Configurer le backend

```bash
# Copier le fichier d'exemple
copy backend\.env.example backend\.env
```

Remplissez `backend/.env` :

```env
# PostgreSQL — Supabase
DATABASE_URL=postgresql://postgres:[MOT_DE_PASSE]@db.[PROJET].supabase.co:5432/postgres

# JWT
JWT_SECRET=votre_secret_min_32_caracteres
JWT_EXPIRES_IN=7d

# Serveur
PORT=3006
FRONTEND_URL=http://localhost:3005

# Redis (local)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# SMTP — Mailtrap
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=votre_username_mailtrap
SMTP_PASS=votre_password_mailtrap

# Google OAuth
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_CALLBACK_URL=http://localhost:3006/api/auth/google/callback
```

### 4. Créer les tables PostgreSQL

Dans **Supabase → SQL Editor**, exécutez le contenu de :
```
backend/src/db/migrations.sql
```

### 5. Lancer le projet

#### ⚡ Démarrage en un clic (Windows)
```
Double-cliquez sur start_all.bat
```

#### Ou manuellement
```bash
# Terminal 1 — Backend
cd backend
npm run dev
# → http://localhost:3006/api/health ✅

# Terminal 2 — Frontend
npm run dev
# → http://localhost:3005 ✅
```

---

## 📡 API Endpoints

### Auth (`/api/auth`)
| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/register` | Inscription + envoi email de confirmation |
| `GET` | `/verify?token=` | Vérification email avec token UUID |
| `POST` | `/login` | Connexion email/mot de passe → JWT |
| `POST` | `/forgot-password` | Demande reset mdp → email avec token 1h |
| `POST` | `/reset-password` | Nouveau mot de passe avec token valide |
| `GET` | `/me` | Profil de l'utilisateur connecté 🔒 |
| `PATCH` | `/profile` | Mise à jour du profil 🔒 |
| `GET` | `/google` | Initiation Google OAuth 2.0 |
| `GET` | `/google/callback` | Callback Google → JWT → redirect frontend |

### Jobs (`/api/jobs`)
| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/` | Liste publique des offres actives |
| `GET` | `/mine` | Offres du recruteur connecté 🔒 |
| `POST` | `/` | Créer une offre 🔒 recruteur |
| `PUT` | `/:id` | Modifier une offre 🔒 recruteur |
| `DELETE` | `/:id` | Supprimer une offre 🔒 recruteur |

### Applications (`/api/applications`)
| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/` | Soumettre une candidature 🔒 candidat |
| `GET` | `/me` | Mes candidatures 🔒 candidat |
| `GET` | `/job/:jobId` | Candidatures d'une offre 🔒 recruteur |
| `PATCH` | `/:id/status` | Changer le statut d'une candidature 🔒 recruteur |

> 🔒 = Route protégée par JWT Bearer token

---

## 📧 Emails automatiques

Tous les emails sont envoyés de façon **asynchrone** via Bull/Redis (jamais dans la requête HTTP) :

| Type | Déclencheur | Contenu |
|------|-------------|---------|
| **Confirmation** | Inscription | Lien `/verify?token=UUID` valable 24h |
| **Reset mdp** | Mot de passe oublié | Lien `/reset-password?token=` expirant en 1h |
| **Notif recruteur** | Nouvelle candidature | Nom, email candidat + lien dashboard |

---

## 📁 Structure des fichiers clés

```
backend/
├── src/
│   ├── db/
│   │   ├── migrations.sql      ← Schéma PostgreSQL (users, job_posts, applications)
│   │   └── pool.ts             ← Pool pg avec SSL Supabase
│   ├── services/
│   │   ├── auth.service.ts     ← bcrypt · JWT · UUID · CRUD users
│   │   └── email.queue.ts      ← File Bull/Redis (retry exponentiel)
│   ├── workers/
│   │   └── email.worker.ts     ← Consumer Bull + templates HTML Nodemailer
│   ├── middleware/
│   │   └── auth.middleware.ts  ← requireAuth + requireRole(...)
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── jobs.routes.ts
│   │   └── applications.routes.ts
│   ├── config/
│   │   └── passport.ts         ← Stratégie Google OAuth 2.0
│   └── index.ts                ← Entrée Express
├── .env.example                ← Variables à remplir (ne pas commiter .env !)
└── tsconfig.json

src/ (frontend)
├── api/
│   ├── client.ts               ← fetch + Bearer JWT + auto-logout 401
│   ├── auth.api.ts
│   ├── jobs.api.ts
│   └── applications.api.ts
├── context/
│   └── AuthContext.tsx         ← État global auth branché sur l'API
├── components/
│   ├── auth/
│   │   ├── AuthFlowModal.tsx   ← Modal inscription/connexion/reset
│   │   ├── VerifyEmailPage.tsx ← Page /verify?token=
│   │   └── GoogleCallbackPage.tsx
│   └── dashboard/
│       ├── CandidateDashboard.tsx
│       └── RecruiterDashboard.tsx
└── types/
    └── auth.ts                 ← Types TypeScript partagés

start_all.bat                   ← Lance frontend:3005 + backend:3006
```

---

## 🔒 Sécurité

- ✅ Mots de passe hashés **bcrypt** (12 rounds) — jamais stockés en clair
- ✅ JWT signé avec secret env — jamais hardcodé
- ✅ Emails envoyés **hors de la requête HTTP** (Bull/Redis) — pas de timeout
- ✅ Token reset mdp expirant en **1 heure**
- ✅ Route `/forgot-password` répond toujours 200 — ne révèle pas si l'email existe
- ✅ Variables sensibles dans `.env` — non commité (`.gitignore`)
- ✅ CORS configuré pour le domaine frontend uniquement

---

## 📄 License

© 2026 NovoRise. Tous droits réservés.
