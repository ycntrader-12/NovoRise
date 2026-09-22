import { apiGet, apiPost, apiPatch } from './client';
import { Application, ApplicationStatus } from '../types/auth';

interface SubmitApplicationPayload {
  jobId: string;
  coverNote?: string;
  cvFileName?: string;
}

// POST /api/applications
export const apiSubmitApplication = (payload: SubmitApplicationPayload): Promise<Application> =>
  apiPost<Application>('/applications', payload);

// GET /api/applications/me
export const apiGetMyApplications = (): Promise<Application[]> =>
  apiGet<Application[]>('/applications/me');

// GET /api/applications/job/:jobId
export const apiGetJobApplications = (jobId: string): Promise<Application[]> =>
  apiGet<Application[]>(`/applications/job/${jobId}`);

// PATCH /api/applications/:id/status
export const apiUpdateApplicationStatus = (
  id: string,
  status: ApplicationStatus
): Promise<Application> =>
  apiPatch<Application>(`/applications/${id}/status`, { status });
