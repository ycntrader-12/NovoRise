import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from './client';
import { RecruiterJobPost } from '../types/auth';

// GET /api/jobs (liste publique)
export const apiGetJobs = (filters?: {
  category?: string;
  contract?: string;
  workplace?: string;
  search?: string;
}): Promise<RecruiterJobPost[]> => {
  const params = new URLSearchParams();
  if (filters?.category) params.set('category', filters.category);
  if (filters?.contract) params.set('contract', filters.contract);
  if (filters?.workplace) params.set('workplace', filters.workplace);
  if (filters?.search) params.set('search', filters.search);
  const qs = params.toString();
  return apiGet<RecruiterJobPost[]>(`/jobs${qs ? `?${qs}` : ''}`);
};

// GET /api/jobs/mine (recruteur connecté)
export const apiGetMyJobs = (): Promise<RecruiterJobPost[]> =>
  apiGet<RecruiterJobPost[]>('/jobs/mine');

// POST /api/jobs
export const apiCreateJob = (job: Omit<RecruiterJobPost, 'id' | 'postedAt' | 'status' | 'viewsCount' | 'applicationsCount'>): Promise<RecruiterJobPost> =>
  apiPost<RecruiterJobPost>('/jobs', job);

// PUT /api/jobs/:id
export const apiUpdateJob = (id: string, job: Partial<RecruiterJobPost>): Promise<RecruiterJobPost> =>
  apiPut<RecruiterJobPost>(`/jobs/${id}`, job);

// DELETE /api/jobs/:id
export const apiDeleteJob = (id: string): Promise<{ message: string }> =>
  apiDelete<{ message: string }>(`/jobs/${id}`);
