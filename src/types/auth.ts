export type UserRole = 'candidat' | 'recruteur' | 'admin';

export interface UserProfile {
  title?: string;
  phone?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  cvFileName?: string;
  coverLetterFileName?: string;
  companyName?: string;
  companyWebsite?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  avatar?: string;
  profile?: UserProfile;
}

export type ApplicationStatus = 'En attente' | 'En cours d\'examen' | 'Entretien' | 'Acceptée' | 'Refusée';

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  appliedAt: string;
  status: ApplicationStatus;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  cvFileName?: string;
  coverLetterFileName?: string;
  coverNote?: string;
}

// Ré-export du type centralisé
export type { JobCategory } from './categories';
import type { JobCategory } from './categories';

export interface RecruiterJobPost {
  id: string;
  title: string;
  company: string;
  category: JobCategory;
  contract: 'CDI' | 'CDD' | 'Freelance' | 'Stage';
  workplace: 'Remote' | 'Hybride' | 'Présentiel';
  location: string;
  salary: string;
  description: string;
  tags: string[];
  postedAt: string;
  status: 'Actif' | 'Pause' | 'Clôturé';
  viewsCount: number;
  applicationsCount: number;
}

export type AuthModalStep = 
  | 'login' 
  | 'register' 
  | 'email-confirmation' 
  | 'forgot-password' 
  | 'reset-password';

