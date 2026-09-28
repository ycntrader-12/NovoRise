import { apiGet, apiPatch, apiDelete, apiPost } from './client';

export interface AdminStats {
  users: {
    total: string;
    candidats: string;
    recruteurs: string;
    admins: string;
    verified: string;
  };
  jobs: {
    total: string;
    actifs: string;
    clotures: string;
  };
  applications: {
    total: string;
    en_attente: string;
    acceptees: string;
    refusees: string;
  };
  dbVersion: string;
  systemTime: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'candidat' | 'recruteur' | 'admin' | 'admin_manager';
  is_verified: boolean;
  created_at: string;
  avatar_url?: string;
  phone?: string;
  title?: string;
  location?: string;
  company_name?: string;
  company_website?: string;
  bio?: string;
  google_id?: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: 'candidat' | 'recruteur' | 'admin' | 'admin_manager';
  is_verified?: boolean;
  password?: string;
  phone?: string;
  title?: string;
  location?: string;
  company_name?: string;
  company_website?: string;
  bio?: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: 'candidat' | 'recruteur' | 'admin' | 'admin_manager';
}

export interface DbTableColumn {
  column_name: string;
  data_type: string;
  is_nullable: string;
}

export interface DbTableInfo {
  tableName: string;
  rowCount: number;
  columns: DbTableColumn[];
}

export interface AdminJob {
  id: string;
  recruiter_id: string;
  title: string;
  company: string;
  category: string;
  contract: string;
  workplace: string;
  location: string;
  salary: string;
  description: string;
  tags: string[] | string;
  status: 'Actif' | 'Pause' | 'Clôturé';
  views_count?: number;
  applications_count?: number;
  created_at: string;
  recruiter_name?: string;
  recruiter_email?: string;
  recruiter_company?: string;
}

export const adminApi = {
  // Get system & database statistics
  async getStats(): Promise<AdminStats> {
    return apiGet<AdminStats>('/admin/stats');
  },

  // Get users list
  async getUsers(role?: string, search?: string): Promise<AdminUser[]> {
    const params = new URLSearchParams();
    if (role && role !== 'Tous') params.append('role', role);
    if (search) params.append('search', search);

    const queryString = params.toString();
    return apiGet<AdminUser[]>(`/admin/users${queryString ? `?${queryString}` : ''}`);
  },

  // Update user role or full user information (including password)
  async updateUser(id: string, payload: UpdateUserPayload | string, is_verified?: boolean): Promise<AdminUser> {
    if (typeof payload === 'string') {
      return apiPatch<AdminUser>(`/admin/users/${id}`, { role: payload, is_verified });
    }
    return apiPatch<AdminUser>(`/admin/users/${id}`, payload);
  },

  // Direct password reset by admin
  async resetUserPassword(id: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return apiPost<{ success: boolean; message: string }>(`/admin/users/${id}/reset-password`, { newPassword });
  },

  // Delete user account
  async deleteUser(id: string): Promise<{ message: string; user: AdminUser }> {
    return apiDelete<{ message: string; user: AdminUser }>(`/admin/users/${id}`);
  },

  // Get PostgreSQL tables metadata
  async getDatabaseTables(): Promise<DbTableInfo[]> {
    return apiGet<DbTableInfo[]>('/admin/database/tables');
  },

  // Get rows of a specific SQL table
  async getTableRows(tableName: string): Promise<Record<string, any>[]> {
    return apiGet<Record<string, any>[]>(`/admin/database/table/${tableName}`);
  },

  // Get all job postings
  async getJobs(status?: string, search?: string): Promise<AdminJob[]> {
    const params = new URLSearchParams();
    if (status && status !== 'Tous') params.append('status', status);
    if (search) params.append('search', search);

    const queryString = params.toString();
    return apiGet<AdminJob[]>(`/admin/jobs${queryString ? `?${queryString}` : ''}`);
  },

  // Update job status
  async updateJobStatus(id: string, status: string): Promise<AdminJob> {
    return apiPatch<AdminJob>(`/admin/jobs/${id}/status`, { status });
  },

  // Delete job post
  async deleteJob(id: string): Promise<{ message: string }> {
    return apiDelete<{ message: string }>(`/admin/jobs/${id}`);
  },

  // Create a new user account (admin only)
  async createUser(payload: CreateUserPayload): Promise<{ message: string; user: AdminUser }> {
    return apiPost<{ message: string; user: AdminUser }>('/admin/users', payload);
  },
};
