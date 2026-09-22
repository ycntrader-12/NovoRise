import { apiGet, apiPatch, apiDelete } from './client';

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
  role: 'candidat' | 'recruteur' | 'admin';
  is_verified: boolean;
  created_at: string;
  avatar_url?: string;
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

  // Update user role or verification status
  async updateUser(id: string, role?: string, is_verified?: boolean): Promise<AdminUser> {
    return apiPatch<AdminUser>(`/admin/users/${id}`, { role, is_verified });
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

  // Delete job post
  async deleteJob(id: string): Promise<{ message: string }> {
    return apiDelete<{ message: string }>(`/admin/jobs/${id}`);
  },
};
