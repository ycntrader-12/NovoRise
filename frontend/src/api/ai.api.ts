import { apiPost } from './client';

export interface GenerateJobDescriptionParams {
  title: string;
  company?: string;
  category?: string;
  contract?: string;
  keywords?: string;
}

export interface GenerateCoverLetterParams {
  jobTitle?: string;
  company?: string;
  candidateSkills?: string;
  candidateBio?: string;
}

export interface JobDescriptionResponse {
  description: string;
}

export interface CoverLetterResponse {
  coverLetter: string;
}

/**
 * Générer une description de poste attractive et structurée avec l'IA Gemini
 */
export const apiGenerateJobDescription = (
  params: GenerateJobDescriptionParams
): Promise<JobDescriptionResponse> =>
  apiPost<JobDescriptionResponse>('/ai/generate-job-description', params);

/**
 * Générer une lettre de motivation personnalisée pour le candidat avec l'IA Gemini
 */
export const apiGenerateCoverLetter = (
  params: GenerateCoverLetterParams
): Promise<CoverLetterResponse> =>
  apiPost<CoverLetterResponse>('/ai/generate-cover-letter', params);
